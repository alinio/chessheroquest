/**
 * Chess DNA Test — adaptive engine (pure). Difficulty tracks performance; next
 * position is chosen deterministically (closest difficulty → least-covered family
 * → id) so the same answers always yield the same path (GDD §2.3 reproducibility)
 * and coverage spreads across opening families.
 */
import type { Answer, TestPosition } from "./types";
import { BLUNDER_CP, qualityFromCpLoss } from "./scoring";

/** Adaptive starts in the 2–3 band (GDD §adaptive). */
export const START_DIFFICULTY = 3;

/** Step difficulty: best/near-best → up, costly → down, clamped 1–5. */
export function nextTargetDifficulty(current: number, quality: number): number {
  let next = current;
  if (quality >= 0.8) next += 1;
  else if (quality <= 0.4) next -= 1;
  return Math.max(1, Math.min(5, next));
}

/** Record an answer from a chosen option index (null = skipped → counts as a blunder). */
export function makeAnswer(
  position: TestPosition,
  chosen: number | null,
  latencyMs?: number,
): Answer {
  const option = chosen != null ? position.options[chosen] : undefined;
  const centipawnLoss = option ? option.centipawnLoss : BLUNDER_CP;
  const isBest = option ? option.isBest : false;
  return {
    positionId: position.id,
    openingFamily: position.openingFamily,
    difficulty: position.difficulty,
    chosen,
    centipawnLoss,
    isBest,
    quality: qualityFromCpLoss(centipawnLoss),
    latencyMs,
  };
}

/** Pick the next unseen position nearest the target difficulty, spreading families. */
export function selectNextPosition(
  bank: readonly TestPosition[],
  usedIds: ReadonlySet<string>,
  targetDifficulty: number,
  familyCounts: Readonly<Record<string, number>>,
): TestPosition | null {
  const candidates = bank.filter((p) => !usedIds.has(p.id));
  if (candidates.length === 0) return null;

  return [...candidates].sort((a, b) => {
    const da = Math.abs(a.difficulty - targetDifficulty);
    const db = Math.abs(b.difficulty - targetDifficulty);
    if (da !== db) return da - db;
    const fa = familyCounts[a.openingFamily] ?? 0;
    const fb = familyCounts[b.openingFamily] ?? 0;
    if (fa !== fb) return fa - fb;
    return a.id < b.id ? -1 : 1;
  })[0]!;
}
