/**
 * Seed opening line tree — Italian Game (Giuoco Pianissimo main line).
 * Built with chess.js at module load so every FEN is guaranteed correct (no
 * hand-typed FENs). Moves + ideas are established theory / authored curation
 * (never LLM). The Learn flow walks this; Drill (6c) drills the player's moves.
 *
 * TODO: full line tree — Giuoco Piano main + Two Knights / Fried Liver trap +
 * Evans Gambit branch pending curation (GDD §11). This is the Pianissimo main line.
 */
import { Chess } from "chess.js";
import type { LineNode, OpeningLineTree } from "./types";

interface AuthoredMove {
  san: string;
  comment?: string;
  isCritical?: boolean;
}

const ITALIAN_MAIN: AuthoredMove[] = [
  { san: "e4", comment: "Stake the centre and open lines for the bishop and queen." },
  { san: "e5", comment: "Black claims an equal share of the centre." },
  { san: "Nf3", comment: "Develop with tempo — already hitting e5.", isCritical: true },
  { san: "Nc6", comment: "Defend e5 and develop a piece." },
  { san: "Bc4", comment: "The Italian bishop, aimed straight at f7 — Black's softest point.", isCritical: true },
  { san: "Bc5", comment: "Black mirrors, eyeing f2 in return." },
  { san: "c3", comment: "Prepare d4 and make a luft for the bishop.", isCritical: true },
  { san: "Nf6", comment: "Develop and put pressure on e4." },
  { san: "d3", comment: "The 'Pianissimo' — quietly supporting e4; a slow maneuvering battle.", isCritical: true },
  { san: "d6", comment: "Black solidifies symmetrically. A rich strategic middlegame awaits." },
];

function buildChain(moves: AuthoredMove[]): LineNode[] {
  const game = new Chess();
  const nodes: LineNode[] = moves.map((m) => {
    game.move(m.san); // throws if illegal — fails the build/test, never ships bad data
    return { san: m.san, fen: game.fen(), comment: m.comment, isCritical: m.isCritical };
  });
  for (let i = 0; i < nodes.length - 1; i++) nodes[i]!.children = [nodes[i + 1]!];
  return nodes.length > 0 ? [nodes[0]!] : [];
}

export const ITALIAN_TREE: OpeningLineTree = {
  openingId: "italian",
  eco: "C50",
  name: "Italian Game",
  side: "white",
  root: buildChain(ITALIAN_MAIN),
};

/** Flatten the main line (children[0] chain) for the Learn walkthrough. */
export function mainLine(tree: OpeningLineTree): LineNode[] {
  const out: LineNode[] = [];
  let cur: LineNode | undefined = tree.root[0];
  while (cur) {
    out.push(cur);
    cur = cur.children?.[0];
  }
  return out;
}

/** Ply indices (0-based) where it's the player's side to move — the drillable moves. */
export function playerPlies(tree: OpeningLineTree): number[] {
  const line = mainLine(tree);
  const whiteToMove = tree.side === "white";
  return line.map((_, i) => i).filter((i) => (i % 2 === 0) === whiteToMove);
}

/** Registry of playable line trees (seed = Italian only). */
export const LINE_TREES: Record<string, OpeningLineTree> = {
  italian: ITALIAN_TREE,
};
