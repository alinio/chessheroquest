/**
 * Opening-explorer line tree (chess-curation-spec.md Schema B + §5b).
 * One tree per opening; feeds the explorer-style Learn flow and (post-answer) the
 * DNA test enrichment. FENs are built with chess.js at module load so they are
 * always legal/consistent (never hand-typed). Moves are REAL theory; `explain`
 * is authored (never LLM).
 *
 * TODO: the `explorer` stats below are ILLUSTRATIVE seed snapshots — pull the real
 * values from the Lichess opening explorer (rated DB, target band) + Stockfish at
 * curation time and set verified per move (§5b). Marked `SNAP`/`BAND` below.
 */
import { Chess } from "chess.js";

export interface ExplorerStats {
  popularityPct?: number; // % of games in this rating band that play this move
  mastersPct?: number;
  eval?: string; // engine eval label, e.g. "+0.3" | "=" | "-0.2"
  peerResults?: { whitePct: number; drawPct: number; blackPct: number };
  gamesCount?: number;
  ratingBand?: string;
  snapshotDate?: string;
}

export interface ExplorerNode {
  san: string;
  fen: string; // position AFTER this move
  explain?: string; // authored Learn caption
  isCritical?: boolean; // → becomes a drill / must-know move
  explorer?: ExplorerStats; // §5b — POST-ANSWER only in the test
}

export interface ExplorerVariation {
  name: string;
  fromPly: number; // index in mainLine where it diverges
  line: ExplorerNode[]; // the divergent move + its continuation
  explain: string;
}

export interface ExplorerOpening {
  openingId: string;
  openingName: string;
  eco: string;
  realm: string;
  accent: string; // hero accent css var
  side: "white" | "black";
  mainLine: ExplorerNode[];
  variations: ExplorerVariation[];
}

interface RawNode {
  san: string;
  explain?: string;
  isCritical?: boolean;
  explorer?: ExplorerStats;
}

const BAND = "1400–1800"; // TODO: target rating band for the snapshot
const SNAP = "2026-06-07"; // TODO: real Lichess explorer snapshot date (verified=false until then)

// Italian Game — Giuoco Pianissimo main line (real theory).
const ITALIAN_MAIN: RawNode[] = [
  { san: "e4", explain: "Stake the centre and free the bishop and queen." },
  { san: "e5", explain: "Black claims an equal share of the centre." },
  { san: "Nf3", explain: "Develop with tempo — already attacking e5.", isCritical: true },
  { san: "Nc6", explain: "Defend e5 and develop a piece." },
  { san: "Bc4", explain: "The Italian bishop, aimed straight at f7 — Black's softest square.", isCritical: true, explorer: { popularityPct: 100, eval: "=", ratingBand: BAND, snapshotDate: SNAP } },
  { san: "Bc5", explain: "Giuoco Piano — mirror White and eye f2 in return. The classical main line.", isCritical: true, explorer: { popularityPct: 46, mastersPct: 40, eval: "=", peerResults: { whitePct: 50, drawPct: 6, blackPct: 44 }, ratingBand: BAND, snapshotDate: SNAP } },
  { san: "c3", explain: "Prepare d4 and make luft for the bishop.", isCritical: true },
  { san: "Nf6", explain: "Develop and pressure e4." },
  { san: "d3", explain: "The 'Pianissimo' — quietly support e4; a slow maneuvering battle.", isCritical: true },
  { san: "d6", explain: "Black solidifies symmetrically. A rich strategic middlegame awaits." },
];

const ITALIAN_VARIATIONS: { name: string; fromPly: number; explain: string; line: RawNode[] }[] = [
  {
    name: "Two Knights Defense",
    fromPly: 5,
    explain: "Instead of mirroring with ...Bc5, Black counterattacks e4 — sharper and more forcing.",
    line: [
      { san: "Nf6", explain: "Two Knights — hit e4 immediately.", explorer: { popularityPct: 38, mastersPct: 45, eval: "=", peerResults: { whitePct: 51, drawPct: 6, blackPct: 43 }, ratingBand: BAND, snapshotDate: SNAP } },
      { san: "Ng5", explain: "The aggressive try — White lunges at f7 (the Fried Liver looms).", isCritical: true },
      { san: "d5", explain: "The only good reply — strike back in the centre." },
      { san: "exd5", explain: "White grabs the pawn; now Black must avoid 5...Nxd5? and play 5...Na5." },
    ],
  },
  {
    name: "Hungarian Defense",
    fromPly: 5,
    explain: "A solid, modest retreat — Black sidesteps tactics at the cost of activity.",
    line: [
      { san: "Be7", explain: "Hungarian Defense — passive but very solid.", explorer: { popularityPct: 6, eval: "+0.2", ratingBand: BAND, snapshotDate: SNAP } },
      { san: "d4", explain: "White takes the centre with extra space." },
    ],
  },
  {
    name: "Evans Gambit",
    fromPly: 6,
    explain: "A romantic gambit: White sacrifices the b-pawn to rip open lines for a fast attack.",
    line: [
      { san: "b4", explain: "Evans Gambit — offer the b-pawn to deflect the bishop and play c3+d4 with tempo.", isCritical: true, explorer: { popularityPct: 7, mastersPct: 12, eval: "=", ratingBand: BAND, snapshotDate: SNAP } },
      { san: "Bxb4", explain: "Accepting is principled — grab the pawn." },
      { san: "c3", explain: "Hit the bishop and prepare the big d4 centre." },
      { san: "Ba5", explain: "The main retreat, eyeing the c3–d4 chain." },
    ],
  },
];

function buildMain(raw: RawNode[]): ExplorerNode[] {
  const g = new Chess();
  return raw.map((r) => {
    g.move(r.san); // throws on illegal → fails build/test, never ships bad data
    return { ...r, fen: g.fen() };
  });
}

function buildVariation(main: RawNode[], v: { name: string; fromPly: number; explain: string; line: RawNode[] }): ExplorerVariation {
  const g = new Chess();
  for (let i = 0; i < v.fromPly; i++) g.move(main[i]!.san);
  const line = v.line.map((r) => {
    g.move(r.san);
    return { ...r, fen: g.fen() };
  });
  return { name: v.name, fromPly: v.fromPly, explain: v.explain, line };
}

export const ITALIAN_EXPLORER: ExplorerOpening = {
  openingId: "italian",
  openingName: "Italian Game",
  eco: "C50",
  realm: "The Ember Marches",
  accent: "--chq-warrior",
  side: "white",
  mainLine: buildMain(ITALIAN_MAIN),
  variations: ITALIAN_VARIATIONS.map((v) => buildVariation(ITALIAN_MAIN, v)),
};

/** Registry of explorer trees (seed = Italian only). TODO: curate the rest (§11). */
export const EXPLORER_TREES: Record<string, ExplorerOpening> = {
  italian: ITALIAN_EXPLORER,
};

/** The node sequence the player is currently walking (main, or a variation grafted on). */
export function lineForTrack(o: ExplorerOpening, track: string | null): ExplorerNode[] {
  if (!track) return o.mainLine;
  const v = o.variations.find((x) => x.name === track);
  return v ? [...o.mainLine.slice(0, v.fromPly), ...v.line] : o.mainLine;
}

export interface Candidate {
  node: ExplorerNode;
  name: string; // "Main line" / variation name
  isMain: boolean;
  /** branch to switch to when chosen (null = stay on current track). */
  branchTo: string | null;
  explain?: string;
}

/** Candidate moves for the position reached after `ply` plies on `track`. */
export function candidatesAt(o: ExplorerOpening, track: string | null, ply: number): Candidate[] {
  const line = lineForTrack(o, track);
  const out: Candidate[] = [];
  const next = line[ply];
  if (next) out.push({ node: next, name: track ?? "Main line", isMain: !track, branchTo: track, explain: next.explain });
  // Named alternatives branch off the MAIN backbone only (seed scope).
  if (!track) {
    for (const v of o.variations) {
      if (v.fromPly === ply) out.push({ node: v.line[0]!, name: v.name, isMain: false, branchTo: v.name, explain: v.explain });
    }
  }
  return out;
}
