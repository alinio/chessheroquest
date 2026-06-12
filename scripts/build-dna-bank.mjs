/**
 * Regenerate the DNA question bank from REAL Lichess Opening Explorer data,
 * so the "correct" answer = the most-played move (LAW #2). Run locally / on a
 * networked host (the build sandbox has no egress to Lichess):
 *
 *   npm run dna:bank          # fetches Lichess, writes src/domain/dna/generated-bank.ts
 *   npm run dna:bank -- --dry # lists seed positions only, no network
 *
 * Self-contained ESM (chess.js + fetch) so it needs no TS loader. The curated
 * lines below MIRROR src/domain/repertoire/starter-paths.ts — keep them in sync.
 */
import { Chess } from "chess.js";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PATHS = [
  { id: "italian-giuoco-pianissimo", archetype: "strategist", moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6", "d3", "d6"] },
  { id: "scandinavian-mainline", archetype: "trickster", moves: ["e4", "d5", "exd5", "Qxd5", "Nc3", "Qa5", "d4", "Nf6", "Nf3", "c6"] },
  { id: "caro-kann-classical", archetype: "defender", moves: ["e4", "c6", "d4", "d5", "Nc3", "dxe4", "Nxe4", "Bf5", "Ng3", "Bg6"] },
  { id: "evans-gambit", archetype: "warrior", moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "b4", "Bxb4", "c3", "Ba5"] },
  { id: "kings-gambit", archetype: "warrior", moves: ["e4", "e5", "f4", "exf4", "Nf3", "g5", "Bc4", "Bg7", "d4", "d6"] },
  { id: "sicilian-dragon", archetype: "warrior", moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "g6"] },
  { id: "queens-gambit-declined", archetype: "strategist", moves: ["d4", "d5", "c4", "e6", "Nc3", "Nf6", "Bg5", "Be7", "e3", "O-O"] },
  { id: "london-system", archetype: "strategist", moves: ["d4", "d5", "Nf3", "Nf6", "Bf4", "e6", "e3", "c5", "c3", "Nc6"] },
  { id: "slav-defense", archetype: "defender", moves: ["d4", "d5", "c4", "c6", "Nf3", "Nf6", "Nc3", "dxc4", "a4", "Bf5"] },
  { id: "french-defense", archetype: "defender", moves: ["e4", "e6", "d4", "d5", "Nc3", "Nf6", "Bg5", "Be7", "e5", "Nfd7"] },
  { id: "budapest-gambit", archetype: "trickster", moves: ["d4", "Nf6", "c4", "e5", "dxe5", "Ng4", "Nf3", "Nc6", "Bf4", "Bb4"] },
  { id: "englund-gambit", archetype: "trickster", moves: ["d4", "e5", "dxe5", "Nc6", "Nf3", "Qe7", "Nc3", "Nxe5", "Nxe5", "Qxe5"] },
];

const PROBE_PLIES = [4, 5, 6, 7, 8];
const RATINGS = [1000, 1200, 1400, 1600];
const SPEEDS = ["blitz", "rapid"];
const MOVES = 12;

const dry = process.argv.includes("--dry");

function fenAfter(moves, ply) {
  const g = new Chess();
  for (let i = 0; i < ply; i++) g.move(moves[i]);
  return g.fen();
}
const difficulty = (ply) => Math.min(5, Math.max(1, Math.ceil((ply + 1) / 2)));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function explorerUrl(fen) {
  const u = new URL("https://explorer.lichess.org/lichess");
  u.searchParams.set("variant", "standard");
  u.searchParams.set("fen", fen);
  u.searchParams.set("ratings", RATINGS.join(","));
  u.searchParams.set("speeds", SPEEDS.join(","));
  u.searchParams.set("moves", String(MOVES));
  u.searchParams.set("topGames", "0");
  u.searchParams.set("recentGames", "0");
  return u.toString();
}

// Build the seed positions (mirrors src/domain/dna/question-bank.ts).
const seeds = [];
const seen = new Set();
for (const p of PATHS) {
  for (const ply of PROBE_PLIES) {
    if (ply >= p.moves.length) continue;
    const fen = fenAfter(p.moves, ply);
    if (seen.has(fen)) continue;
    seen.add(fen);
    seeds.push({
      id: `${p.id}@${ply}`,
      fen,
      archetype: p.archetype,
      difficulty: difficulty(ply),
      pathId: p.id,
      ply,
      curated: p.moves[ply],
    });
  }
}

if (dry) {
  console.log(`[dry] ${seeds.length} seed positions (no network):`);
  for (const s of seeds) {
    console.log(`  ${s.id.padEnd(26)} ${s.archetype.padEnd(11)} d${s.difficulty} curated=${s.curated}`);
  }
  process.exit(0);
}

const questions = [];
for (const s of seeds) {
  let res;
  try {
    res = await fetch(explorerUrl(s.fen), {
      headers: {
        "User-Agent": "ChessHeroQuest/0.1 (+https://chessheroquest.com)",
        // Required since 2026-02 — unauthenticated explorer requests get 401.
        ...(process.env.LICHESS_API_TOKEN ? { Authorization: `Bearer ${process.env.LICHESS_API_TOKEN}` } : {}),
      },
    });
  } catch (e) {
    console.warn(`fetch failed for ${s.id}: ${e.message} — skipping`);
    continue;
  }
  if (!res.ok) {
    console.warn(`HTTP ${res.status} for ${s.id} — skipping`);
    continue;
  }
  const data = await res.json();
  const ranked = (data.moves || [])
    .map((m) => ({ san: m.san, games: m.white + m.draws + m.black }))
    .sort((a, b) => b.games - a.games);
  const top = ranked[0];
  if (!top) {
    console.warn(`no Lichess data for ${s.id} — skipping`);
    continue;
  }
  questions.push({
    id: s.id,
    fen: s.fen,
    expectedMove: top.san,
    archetype: s.archetype,
    difficulty: s.difficulty,
    pathId: s.pathId,
    ply: s.ply,
  });
  const flag = top.san === s.curated ? "" : `  (curated was ${s.curated})`;
  console.log(`${s.id.padEnd(26)} most-played=${top.san}${flag}`);
  await sleep(350); // be gentle with Lichess rate limits
}

const header =
  `// AUTO-GENERATED by scripts/build-dna-bank.mjs — do not edit by hand.\n` +
  `// Source: Lichess Opening Explorer (lichess DB, ratings ${RATINGS.join("/")}, ${SPEEDS.join("+")}).\n` +
  `import type { DnaQuestion } from "./types";\n\n`;
const body = `export const GENERATED_DNA_BANK: DnaQuestion[] = ${JSON.stringify(questions, null, 2)};\n`;
const outPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "domain",
  "dna",
  "generated-bank.ts",
);
writeFileSync(outPath, header + body);
console.log(`\nWrote ${questions.length} questions → src/domain/dna/generated-bank.ts`);
