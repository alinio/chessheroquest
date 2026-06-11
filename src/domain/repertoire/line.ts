/**
 * Pure helpers over a CuratedPath. chess.js is the move model / source of truth;
 * these functions never invent moves or evaluations (CLAUDE.md LAW #2).
 */
import { Chess } from "chess.js";
import type { CuratedPath } from "./types";

/** Replays the path's SAN moves through chess.js. True iff every move is legal. */
export function isPathLegal(path: CuratedPath): boolean {
  const game = new Chess();
  for (const san of path.moves) {
    try {
      game.move(san);
    } catch {
      return false;
    }
  }
  return true;
}

/**
 * FEN after the first `ply` half-moves (ply = 0 → initial position).
 * Throws RangeError if ply is outside [0, moves.length].
 */
export function fenAfter(path: CuratedPath, ply: number): string {
  if (ply < 0 || ply > path.moves.length) {
    throw new RangeError(`ply ${ply} out of range [0, ${path.moves.length}]`);
  }
  const game = new Chess();
  for (let i = 0; i < ply; i++) {
    // Safe: i < ply <= moves.length, and noUncheckedIndexedAccess flags the access.
    game.move(path.moves[i]!);
  }
  return game.fen();
}

/** The expected SAN at a given ply, or null if the line is complete. */
export function expectedMoveAt(path: CuratedPath, ply: number): string | null {
  return path.moves[ply] ?? null;
}

/**
 * The from/to squares of the move at `ply` (chess.js-resolved — SAN alone
 * doesn't carry the source square). Used for gold last-move highlights.
 */
export function moveSquaresAt(path: CuratedPath, ply: number): { from: string; to: string } {
  if (ply < 0 || ply >= path.moves.length) {
    throw new RangeError(`ply ${ply} out of range [0, ${path.moves.length - 1}]`);
  }
  const game = new Chess();
  for (let i = 0; i < ply; i++) {
    game.move(path.moves[i]!);
  }
  const m = game.move(path.moves[ply]!);
  return { from: m.from, to: m.to };
}

/**
 * Locate a position inside the line: the ply such that fenAfter(path, ply)
 * equals `fen`, or -1 when the position is not on this path. Lets the UI
 * re-anchor a raw SRS card (FEN) back into its curated line.
 */
export function plyOfFen(path: CuratedPath, fen: string): number {
  const game = new Chess();
  if (game.fen() === fen) return 0;
  for (let i = 0; i < path.moves.length; i++) {
    game.move(path.moves[i]!);
    if (game.fen() === fen) return i + 1;
  }
  return -1;
}
