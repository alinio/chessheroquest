/**
 * scripts/curate-opening.ts — re-runnable chess curation CLI.
 *   Run:  npx tsx scripts/curate-opening.ts
 *
 * Turns "an opening + its line(s)" into spec-conformant curation JSON
 * (docs/chess-curation-spec.md): an OpeningLineTree with explorer stats + engine
 * evals filled AUTOMATICALLY, and ALL prose left as `// TODO` for a human.
 *
 * Truth = Lichess opening explorer + Stockfish ONLY. Never invents moves, stats,
 * or prose. Missing data (network/engine unavailable, empty explorer) → the field
 * is left undefined + a TODO note; nothing is fabricated. Deterministic: fixed
 * engine depth + a stamped snapshotDate.
 */
import { Chess } from "chess.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawn } from "node:child_process";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — edit this block per opening, then re-run.
// ─────────────────────────────────────────────────────────────────────────────
const TARGET = {
  openingId: "italian-c50",
  openingName: "Italian Game",
  openingFamilyEco: "C50–C54",
  eco: "C50",
  realm: "Ember Marches", // source of truth: docs/opening-boss-catalog.md
  accent: "--chq-warrior",
  ratingBand: "1400-1800",
  speeds: "blitz,rapid,classical",
  lines: [["e4", "e5", "Nf3", "Nc6", "Bc4"]], // SAN from the start
  candidatePopularityThresholdPct: 5, // evaluate explorer alternatives at/above this
  captureTestPositionsAtPlies: [] as number[], // plies (0-based) to also emit as TestPosition
  engineDepth: 18,
  styleCpThreshold: 30, // top-2 within this cp AND both real theory → style fork (§4)
};

const TODO = "// TODO";
const SNAPSHOT_DATE = new Date().toISOString().slice(0, 10);
const UA = "ChessHeroQuest-curation/1.0 (https://chessheroquest.com; alain@monkeoz.com)";
const RATING_BUCKETS = [1000, 1200, 1400, 1600, 1800, 2000, 2200, 2500];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── chess helpers (real legality / FEN / SAN / UCI) ─────────────────────────
function sanToUciList(sans: string[]): string[] {
  const g = new Chess();
  return sans.map((s) => {
    const m = g.move(s);
    if (!m) throw new Error(`Illegal SAN "${s}" in line ${sans.join(" ")}`);
    return m.from + m.to + (m.promotion ?? "");
  });
}
function fenAfter(sans: string[]): string {
  const g = new Chess();
  sans.forEach((s) => g.move(s));
  return g.fen();
}
function sideToMove(fen: string): "white" | "black" {
  return fen.split(" ")[1] === "w" ? "white" : "black";
}
function sanOfUci(fen: string, uci: string): string | null {
  const g = new Chess(fen);
  try {
    const m = g.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci.length > 4 ? uci[4] : undefined });
    return m ? m.san : null;
  } catch {
    return null;
  }
}

function bandToRatings(band: string): string {
  const [lo, hi] = band.split("-").map((n) => parseInt(n, 10));
  const inc = RATING_BUCKETS.filter((b) => b >= (lo ?? 0) && b < (hi ?? 9999));
  return (inc.length ? inc : [1600]).join(",");
}

// ─── Lichess opening explorer (rated band + masters) ─────────────────────────
interface ExplorerMove { uci: string; san: string; white: number; draws: number; black: number; }
interface ExplorerResp { white: number; draws: number; black: number; moves: ExplorerMove[]; }

async function fetchExplorer(playUci: string[]): Promise<{ rated: ExplorerResp; masters: ExplorerResp | null } | null> {
  const play = playUci.join(",");
  const ratings = bandToRatings(TARGET.ratingBand);
  const ratedUrl = `https://explorer.lichess.ovh/lichess?variant=standard&play=${play}&ratings=${ratings}&speeds=${TARGET.speeds}`;
  const mastersUrl = `https://explorer.lichess.ovh/masters?play=${play}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r1 = await fetch(ratedUrl, { headers: { "User-Agent": UA } });
      await sleep(1100); // throttle ~1 req/sec
      if (r1.status === 429) { await sleep(60_000); continue; }
      if (!r1.ok) return null;
      const rated = (await r1.json()) as ExplorerResp;
      let masters: ExplorerResp | null = null;
      try {
        const r2 = await fetch(mastersUrl, { headers: { "User-Agent": UA } });
        await sleep(1100);
        if (r2.ok) masters = (await r2.json()) as ExplorerResp;
      } catch { /* masters optional */ }
      return { rated, masters };
    } catch {
      await sleep(1500);
    }
  }
  return null;
}

const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 1000) / 10 : 0);

function explorerStatsFor(uci: string, data: { rated: ExplorerResp; masters: ExplorerResp | null }) {
  const total = data.rated.white + data.rated.draws + data.rated.black;
  const m = data.rated.moves.find((x) => x.uci === uci);
  if (!m || total === 0) return undefined;
  const mGames = m.white + m.draws + m.black;
  const masterTotal = data.masters ? data.masters.white + data.masters.draws + data.masters.black : 0;
  const mm = data.masters?.moves.find((x) => x.uci === uci);
  return {
    popularityPct: pct(mGames, total),
    mastersPct: mm && masterTotal ? pct(mm.white + mm.draws + mm.black, masterTotal) : undefined,
    peerResults: { whitePct: pct(m.white, mGames), drawPct: pct(m.draws, mGames), blackPct: pct(m.black, mGames) },
    gamesCount: mGames,
    ratingBand: TARGET.ratingBand,
    snapshotDate: SNAPSHOT_DATE,
  };
}

// ─── Stockfish (best-effort; unavailable → evals left undefined + TODO) ───────
interface Engine { evalFen(fen: string, depth: number): Promise<{ cp?: number; mate?: number; bestUci?: string } | null>; quit(): void; }

/** Native Stockfish over stdio (most reliable in Node). brew install stockfish, or STOCKFISH_PATH. */
function makeNativeEngine(bin = process.env.STOCKFISH_PATH || "stockfish"): Promise<Engine | null> {
  return new Promise((resolve) => {
    let proc: ReturnType<typeof spawn>;
    try {
      proc = spawn(bin, [], { stdio: ["pipe", "pipe", "ignore"] });
    } catch {
      resolve(null);
      return;
    }
    proc.on("error", () => resolve(null));
    const listeners: ((l: string) => void)[] = [];
    const off = (f: (l: string) => void) => { const i = listeners.indexOf(f); if (i >= 0) listeners.splice(i, 1); };
    let buf = "";
    proc.stdout!.on("data", (d: Buffer) => {
      buf += d.toString();
      let idx: number;
      while ((idx = buf.indexOf("\n")) >= 0) { const line = buf.slice(0, idx).trim(); buf = buf.slice(idx + 1); listeners.forEach((fn) => fn(line)); }
    });
    const send = (c: string) => proc.stdin!.write(c + "\n");
    const engine: Engine = {
      evalFen(fen, depth) {
        return new Promise((res) => {
          let last: { cp?: number; mate?: number } | null = null;
          const to = setTimeout(() => { off(f); res(last); }, 20_000);
          const f = (l: string) => {
            const sm = l.match(/^info .*\bscore (cp|mate) (-?\d+)/);
            if (sm) last = sm[1] === "cp" ? { cp: parseInt(sm[2]!, 10) } : { mate: parseInt(sm[2]!, 10) };
            const bm = l.match(/^bestmove (\S+)/);
            if (bm) { clearTimeout(to); off(f); res({ ...(last ?? {}), bestUci: bm[1] }); }
          };
          listeners.push(f);
          send(`position fen ${fen}`);
          send(`go depth ${depth}`);
        });
      },
      quit() { try { send("quit"); proc.kill(); } catch { /* noop */ } },
    };
    let settled = false;
    const initTo = setTimeout(() => { if (!settled) { settled = true; try { proc.kill(); } catch { /* noop */ } resolve(null); } }, 4000);
    const onInit = (l: string) => { if (/uciok/.test(l)) { settled = true; clearTimeout(initTo); off(onInit); send("setoption name Threads value 1"); resolve(engine); } };
    listeners.push(onInit);
    send("uci");
  });
}

async function makeEngine(): Promise<Engine | null> {
  const native = await makeNativeEngine();
  if (native) return native;
  // Fallback: the bundled Stockfish WASM (may not expose a UCI message port in Node).
  let mod: unknown;
  try {
    mod = (await import("stockfish")).default ?? (await import("stockfish"));
  } catch {
    return null;
  }
  let sf: Record<string, unknown>;
  try {
    sf = await (mod as () => Promise<Record<string, unknown>>)();
  } catch {
    return null;
  }
  const post = sf.postMessage as ((c: string) => void) | undefined;
  const addListener = sf.addMessageListener as ((f: (l: string) => void) => void) | undefined;
  if (typeof post !== "function" || typeof addListener !== "function") return null;
  const listeners: ((l: string) => void)[] = [];
  addListener((line: string) => listeners.forEach((fn) => fn(line)));
  const send = (c: string) => post(c);

  await new Promise<void>((res) => {
    const f = (l: string) => { if (/uciok/.test(l)) { off(f); res(); } };
    listeners.push(f);
    send("uci");
    setTimeout(res, 5000);
  });
  send("setoption name Threads value 1");
  function off(f: (l: string) => void) { const i = listeners.indexOf(f); if (i >= 0) listeners.splice(i, 1); }

  return {
    evalFen(fen, depth) {
      return new Promise((res) => {
        let last: { cp?: number; mate?: number } | null = null;
        const to = setTimeout(() => { off(f); res(last); }, 20_000);
        const f = (l: string) => {
          const sm = l.match(/^info .*\bscore (cp|mate) (-?\d+)/);
          if (sm) last = sm[1] === "cp" ? { cp: parseInt(sm[2]!, 10) } : { mate: parseInt(sm[2]!, 10) };
          const bm = l.match(/^bestmove (\S+)/);
          if (bm) { clearTimeout(to); off(f); res({ ...(last ?? {}), bestUci: bm[1] }); }
        };
        listeners.push(f);
        send(`position fen ${fen}`);
        send(`go depth ${depth}`);
      });
    },
    quit() { try { (sf.terminate as (() => void) | undefined)?.(); } catch { /* noop */ } },
  };
}

/** White-POV centipawns from a side-to-move-POV score at `fen`. */
function whiteCp(fen: string, s: { cp?: number; mate?: number } | null): number | null {
  if (!s) return null;
  const sign = sideToMove(fen) === "white" ? 1 : -1;
  if (typeof s.mate === "number") return sign * s.mate * 10000;
  if (typeof s.cp === "number") return sign * s.cp;
  return null;
}
function evalLabel(whiteCentipawns: number | null): string | undefined {
  if (whiteCentipawns === null) return undefined;
  if (Math.abs(whiteCentipawns) >= 9000) return whiteCentipawns > 0 ? "+M" : "-M";
  const v = whiteCentipawns / 100;
  if (Math.abs(v) < 0.15) return "=";
  return (v > 0 ? "+" : "") + v.toFixed(1);
}

// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  const summary = { positions: 0, candidatesEvaluated: 0, explorerEmpty: 0, skill: 0, style: 0, engineUsed: false };
  const engine = await makeEngine();
  summary.engineUsed = Boolean(engine);
  if (!engine) console.warn("⚠️  Stockfish unavailable in this environment — evals left as TODO (run on a machine with the engine).");

  const mainLine: unknown[] = [];
  const testPositions: unknown[] = [];

  for (const line of TARGET.lines) {
    const fullUci = sanToUciList(line); // validates legality

    for (let i = 0; i < line.length; i++) {
      summary.positions++;
      const parentSans = line.slice(0, i);
      const parentUci = fullUci.slice(0, i);
      const parentFen = fenAfter(parentSans);
      const playedUci = fullUci[i]!;
      const playedSan = line[i]!;
      const resultingFen = fenAfter(line.slice(0, i + 1));

      // explorer at the parent position
      const explorerData = await fetchExplorer(parentUci);
      if (!explorerData) summary.explorerEmpty++;

      // candidate moves to evaluate: explorer moves above threshold ∪ played ∪ engine best
      const candidateUcis = new Set<string>([playedUci]);
      if (explorerData) {
        const total = explorerData.rated.white + explorerData.rated.draws + explorerData.rated.black;
        for (const m of explorerData.rated.moves) {
          if (total > 0 && pct(m.white + m.draws + m.black, total) >= TARGET.candidatePopularityThresholdPct) candidateUcis.add(m.uci);
        }
      }

      // engine eval per candidate (centipawnLoss vs best), best-effort
      const evals: Record<string, { whiteCp: number | null; label?: string }> = {};
      let bestWhiteCp: number | null = null;
      if (engine) {
        // include the engine's own top move at the parent
        const top = await engine.evalFen(parentFen, TARGET.engineDepth);
        if (top?.bestUci) candidateUcis.add(top.bestUci);
        for (const uci of candidateUcis) {
          const g = new Chess(parentFen);
          try { g.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci.length > 4 ? uci[4] : undefined }); } catch { continue; }
          const after = g.fen();
          const s = await engine.evalFen(after, TARGET.engineDepth);
          // eval of `after` is from the opponent's POV; flip to the mover's POV via white-POV normalisation
          const wcp = whiteCp(after, s);
          evals[uci] = { whiteCp: wcp, label: evalLabel(wcp) };
          summary.candidatesEvaluated++;
        }
        const moverIsWhite = sideToMove(parentFen) === "white";
        const moverScores = Object.values(evals).map((e) => (e.whiteCp === null ? null : (moverIsWhite ? e.whiteCp : -e.whiteCp))).filter((x): x is number => x !== null);
        bestWhiteCp = moverScores.length ? (moverIsWhite ? Math.max(...moverScores) : -Math.max(...moverScores)) : null;
      }

      // mainLine node for the played move
      mainLine.push({
        san: playedSan,
        fen: resultingFen,
        explain: TODO,
        isCritical: TODO,
        explorer: explorerData ? explorerStatsFor(playedUci, explorerData) ?? `${TODO}: move not in explorer sample` : `${TODO}: explorer unavailable`,
        ...(engine ? { eval: evalLabel(whiteCp(resultingFen, null)) ?? evals[playedUci]?.label ?? TODO } : { eval: TODO }),
      });

      // optional TestPosition at flagged plies
      if (TARGET.captureTestPositionsAtPlies.includes(i)) {
        const moverIsWhite = sideToMove(parentFen) === "white";
        const options = [...candidateUcis].map((uci) => {
          const san = sanOfUci(parentFen, uci) ?? uci;
          const e = evals[uci];
          const moverCp = e && e.whiteCp !== null ? (moverIsWhite ? e.whiteCp : -e.whiteCp) : null;
          const cpl = bestWhiteCp !== null && moverCp !== null ? Math.max(0, (moverIsWhite ? bestWhiteCp : -bestWhiteCp) - (moverIsWhite ? moverCp : -moverCp)) : undefined;
          return {
            san,
            centipawnLoss: cpl,
            optionNote: TODO,
            explorer: explorerData ? explorerStatsFor(uci, explorerData) : undefined,
          };
        });
        // classify skill vs style (§4): top-2 within threshold AND both real theory
        const sorted = options.filter((o) => typeof o.centipawnLoss === "number").sort((a, b) => (a.centipawnLoss! - b.centipawnLoss!));
        const isStyle = sorted.length >= 2 && (sorted[1]!.centipawnLoss! - sorted[0]!.centipawnLoss!) <= TARGET.styleCpThreshold && sorted.slice(0, 2).every((o) => (o.explorer?.popularityPct ?? 0) >= TARGET.candidatePopularityThresholdPct);
        if (isStyle) summary.style++; else summary.skill++;
        testPositions.push({
          id: `${TARGET.openingId}-ply${i}`,
          openingName: TARGET.openingName,
          openingFamilyEco: TARGET.openingFamilyEco,
          eco: TARGET.eco,
          fen: parentFen,
          lineSan: parentSans,
          sideToMove: sideToMove(parentFen),
          difficulty: TODO,
          questionType: isStyle ? "style" : "skill",
          prompt: isStyle ? "Your move?" : "Best move?",
          options: options.map((o) => (isStyle ? { san: o.san, optionNote: TODO, archetypeLean: TODO, explorer: o.explorer } : { san: o.san, isBest: o.centipawnLoss === 0 || undefined, centipawnLoss: o.centipawnLoss, optionNote: TODO, explorer: o.explorer })),
          contextRpg: TODO,
          explanationRpg: TODO,
          source: `Lichess explorer (${TARGET.ratingBand}) + Stockfish d${TARGET.engineDepth} @ ${SNAPSHOT_DATE}`,
          verified: false,
        });
      }
    }
  }

  engine?.quit();

  const out = {
    openingTree: {
      openingId: TARGET.openingId,
      openingName: TARGET.openingName,
      eco: TARGET.eco,
      realm: TARGET.realm,
      accent: TARGET.accent,
      mainLine,
      variations: [] as unknown[], // TODO: curate variations
      traps: [] as unknown[], // TODO: curate traps
    },
    testPositions,
    meta: { source: `Lichess explorer + Stockfish d${TARGET.engineDepth}`, snapshotDate: SNAPSHOT_DATE, ratingBand: TARGET.ratingBand, verified: false },
  };

  const outPath = join(process.cwd(), "data", "curation", `${TARGET.openingId}.json`);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(out, null, 2));

  console.log(JSON.stringify(out, null, 2));
  console.log("\n── SUMMARY ──────────────────────────────");
  console.log(`opening:              ${TARGET.openingName} (${TARGET.openingId})`);
  console.log(`positions processed:  ${summary.positions}`);
  console.log(`candidates evaluated: ${summary.candidatesEvaluated}`);
  console.log(`explorer empty (TODO):${summary.explorerEmpty}`);
  console.log(`test positions:       ${testPositions.length}  (skill ${summary.skill} / style ${summary.style})`);
  console.log(`engine used:          ${summary.engineUsed ? `yes (depth ${TARGET.engineDepth})` : "NO — evals left as TODO"}`);
  console.log(`written:              ${outPath}`);
  console.log("All prose (explain / optionNote / contextRpg / explanationRpg) left as TODO. verified=false.");
}

main().catch((e) => { console.error("curate-opening failed:", e); process.exit(1); });
