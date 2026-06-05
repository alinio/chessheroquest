/**
 * DNA question bank — DERIVED from the legality-certified curated paths, so no
 * chess "truth" is invented here (CLAUDE.md LAW #2). A question is: "from the
 * position after `ply` half-moves of path X, find the mainline move `moves[ply]`."
 *
 * PROVISIONAL: correctness = the curated editorial mainline. The production bank
 * must source position selection + correctness from the Lichess Opening Explorer
 * (frequency) and Stockfish (eval) once the truth layer is wired — see
 * src/data/lichess.ts / src/data/stockfish.ts. The bank is built behind a
 * function so swapping the source is a one-file change.
 */
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { fenAfter, expectedMoveAt } from "@/src/domain/repertoire/line";
import type { DnaQuestion } from "./types";

/** Half-move depths probed per path — deeper = more archetype-characteristic. */
const PROBE_PLIES = [4, 5, 6, 7, 8];

function difficultyForPly(ply: number): number {
  return Math.min(5, Math.max(1, Math.ceil((ply + 1) / 2)));
}

export function buildQuestionBank(): DnaQuestion[] {
  const questions: DnaQuestion[] = [];
  const seen = new Set<string>(); // dedup positions shared between paths

  for (const path of STARTER_PATHS) {
    for (const ply of PROBE_PLIES) {
      const expectedMove = expectedMoveAt(path, ply);
      if (expectedMove === null) continue; // ply past the end of this line

      const fen = fenAfter(path, ply);
      const key = `${fen}|${expectedMove}`;
      if (seen.has(key)) continue;
      seen.add(key);

      questions.push({
        id: `${path.id}@${ply}`,
        fen,
        expectedMove,
        archetype: path.archetype,
        difficulty: difficultyForPly(ply),
        pathId: path.id,
        ply,
      });
    }
  }

  return questions;
}

export const DNA_QUESTION_BANK: DnaQuestion[] = buildQuestionBank();

/** How many questions a single DNA Test run uses (target 20 on the prod bank). */
export const DNA_TEST_LENGTH = Math.min(20, DNA_QUESTION_BANK.length);
