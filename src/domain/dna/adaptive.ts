/**
 * Adaptive sequencing (pure). The test climbs in difficulty on correct answers
 * and eases off on wrong ones, always serving the unseen question closest to the
 * running target difficulty. Deterministic (no randomness) → testable.
 */
import type { DnaQuestion, DnaAnswer } from "./types";

export const START_DIFFICULTY = 3;
const MIN_DIFFICULTY = 1;
const MAX_DIFFICULTY = 5;

const clampDifficulty = (d: number) =>
  Math.min(MAX_DIFFICULTY, Math.max(MIN_DIFFICULTY, d));

/** Running target difficulty given the answers so far. */
export function nextTargetDifficulty(answers: readonly DnaAnswer[]): number {
  let target = START_DIFFICULTY;
  for (const a of answers) {
    target = clampDifficulty(target + (a.correct ? 1 : -1));
  }
  return target;
}

/**
 * The next unseen question whose difficulty is closest to the target.
 * Ties broken deterministically by id. Returns null when the bank is exhausted.
 */
export function selectNextQuestion(
  bank: readonly DnaQuestion[],
  askedIds: ReadonlySet<string>,
  answers: readonly DnaAnswer[],
): DnaQuestion | null {
  const remaining = bank.filter((q) => !askedIds.has(q.id));
  if (remaining.length === 0) return null;

  const target = nextTargetDifficulty(answers);
  return remaining.reduce((best, q) => {
    const dq = Math.abs(q.difficulty - target);
    const db = Math.abs(best.difficulty - target);
    if (dq < db) return q;
    if (dq === db && q.id < best.id) return q;
    return best;
  });
}
