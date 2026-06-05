/**
 * Opening IQ — Core computation (master-vision §4.3, levels L1→L3). PURE + tested.
 * Core = frequency-weighted mastery of what you actually face with your own
 * repertoire — the bulk of the IQ, the part that correlates with real Elo.
 *
 * BreadthBonus is deferred (build order #4: Core only). Feed Core to
 * calibrateCoreToIq() for the 0–1000 number.
 *
 * LAW #1: every signal here only rises with real competence — never time/volume.
 */

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));

/**
 * L1 — position mastery: retention × accuracy. If you forget it (retention → 0)
 * mastery → 0 regardless of past accuracy ("use it or lose it", §4.5). If you've
 * never been accurate, mastery → 0 even with perfect retention of a wrong idea.
 */
export function positionMastery(retention: number, accuracy: number): number {
  return clamp01(retention) * clamp01(accuracy);
}

export interface WeightedPosition {
  /** FSRS retrievability in [0,1]. */
  retention: number;
  /** Recent success rate in [0,1]. */
  accuracy: number;
  /** Real line frequency (Lichess); any non-negative scale — normalized here. */
  frequency: number;
}

/**
 * L2 — opening mastery: frequency-weighted mean of position mastery over the
 * lines you'll actually face. Frequent branches dominate (so rare deep lines
 * can't inflate the score). Returns 0 for an empty / zero-frequency opening.
 */
export function openingMastery(positions: readonly WeightedPosition[]): number {
  let weighted = 0;
  let total = 0;
  for (const p of positions) {
    const f = Math.max(0, p.frequency);
    weighted += f * positionMastery(p.retention, p.accuracy);
    total += f;
  }
  return total === 0 ? 0 : weighted / total;
}

export interface WeightedOpening {
  /** Opening mastery in [0,1] (typically from openingMastery). */
  mastery: number;
  /** How much this opening matters in the user's repertoire (e.g. its summed frequency). */
  weight: number;
}

/**
 * L3 — Core: frequency-weighted mastery across the openings you play, in [0,1].
 * The bulk of the Opening IQ. Returns 0 for an empty / zero-weight repertoire.
 */
export function computeCore(openings: readonly WeightedOpening[]): number {
  let weighted = 0;
  let total = 0;
  for (const o of openings) {
    const w = Math.max(0, o.weight);
    weighted += w * clamp01(o.mastery);
    total += w;
  }
  return total === 0 ? 0 : weighted / total;
}
