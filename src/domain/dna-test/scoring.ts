/**
 * Chess DNA Test — scoring (pure). Reads stored centipawn-loss tags, never an
 * engine at runtime. Produces a difficulty-weighted accuracy, a per-opening-
 * family breakdown (for "strongest / biggest weakness" later), and a PROVISIONAL
 * Opening IQ via a clearly-isolated, swappable calibration stub.
 */
import type { Answer, FamilyPerformance, TestResult } from "./types";

/** A move losing this many centipawns (or more) scores zero quality. */
export const BLUNDER_CP = 300;

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const clamp01 = (n: number) => clamp(n, 0, 1);

/** Answer quality in [0,1]: 0 cp loss → 1.0, scaling linearly to 0 at a blunder. */
export function qualityFromCpLoss(centipawnLoss: number): number {
  return clamp01(1 - Math.max(0, centipawnLoss) / BLUNDER_CP);
}

/** Difficulty-weighted aggregate accuracy in [0,1] over SKILL answers only
 *  (style forks have no right answer and must never affect Opening IQ). */
export function aggregateAccuracy(answers: readonly Answer[]): number {
  const scored = answers.filter((a) => a.questionType === "skill");
  if (scored.length === 0) return 0;
  let weighted = 0;
  let weight = 0;
  for (const a of scored) {
    const w = Math.max(1, a.difficulty);
    weighted += w * a.quality;
    weight += w;
  }
  return weight === 0 ? 0 : weighted / weight;
}

/**
 * Provisional Opening IQ on the public 0–1000 scale.
 *
 * TODO: replace with calibrated percentile mapping (GDD §11). The real mapping
 * anchors raw accuracy to a population percentile (cold-start from Lichess rating
 * bands). Until that data exists, this is a deterministic placeholder curve so the
 * pipeline runs end-to-end. SWAP THIS ONE FUNCTION — nothing else depends on the
 * calibration shape.
 */
export function provisionalOpeningIq(rawAccuracy: number, difficultyReached: number): number {
  const acc = clamp01(rawAccuracy);
  // Gentle concave curve so mid performance isn't punishing (monotonic).
  const base = Math.pow(acc, 0.85) * 1000;
  // Small nudge for the difficulty the player sustained (±40 around the mid).
  const diffBonus = ((clamp(difficultyReached, 1, 5) - 3) / 2) * 40;
  return Math.round(clamp(base + diffBonus, 0, 1000));
}

/** Per-opening-family performance — powers strongest/weakest later (DNA card). */
export function familyPerformance(answers: readonly Answer[]): FamilyPerformance[] {
  const map = new Map<string, { sum: number; n: number }>();
  for (const a of answers) {
    if (a.questionType !== "skill") continue; // style answers don't reflect skill
    const e = map.get(a.openingFamily) ?? { sum: 0, n: 0 };
    e.sum += a.quality;
    e.n += 1;
    map.set(a.openingFamily, e);
  }
  return [...map.entries()]
    .map(([family, { sum, n }]) => ({ family, positions: n, avgQuality: sum / n }))
    .sort((a, b) => b.avgQuality - a.avgQuality);
}

/** Assemble the full result from the recorded answers. Pure (no Date). */
export function buildResult(answers: readonly Answer[]): TestResult {
  const rawAccuracy = aggregateAccuracy(answers);
  const difficultyReached = answers
    .filter((a) => a.questionType === "skill")
    .reduce((m, a) => Math.max(m, a.difficulty), 0);
  const byFamily = familyPerformance(answers);
  return {
    answers: [...answers],
    positionsAnswered: answers.length,
    rawAccuracy,
    difficultyReached,
    openingIq: provisionalOpeningIq(rawAccuracy, difficultyReached),
    byFamily,
    strongestFamily: byFamily.length > 0 ? byFamily[0]!.family : null,
    weakestFamily: byFamily.length > 0 ? byFamily[byFamily.length - 1]!.family : null,
  };
}
