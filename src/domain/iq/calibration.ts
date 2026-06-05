/**
 * Opening IQ calibration (domain — pure, the crown jewel; CLAUDE.md LAW #1).
 *
 * LAW #1: Opening IQ may only rise when real competence rises. These functions
 * map a [0,1] competence signal (Core) to the 0–1000 IQ scale and to ranks.
 *
 * IMPORTANT (master-vision §4.4 & §27): every constant here is a DEFAULT for
 * launch, to be re-fit by regressing IQ against observed real Elo as the user
 * base grows. They are centralized in CALIBRATION so that re-fitting is a
 * one-place change and never requires touching call sites.
 */

export const IQ_MIN = 0;
export const IQ_MAX = 1000;

/** Launch-default constants — replace with data-fit values (§4.4). */
export const CALIBRATION = {
  /** Concavity of Core→IQ. 1 = linear; <1 lifts mid scores; >1 suppresses them. */
  coreToIqExponent: 1,
  /** Multiplier applied to Core^exponent before scaling to IQ_MAX. */
  coreToIqGain: 1,
} as const;

/** Progression ranks tied to Opening IQ thresholds (master-vision §16). */
export const IQ_RANKS = [
  { min: 0, name: "Opening Explorer" },
  { min: 125, name: "Opening Hunter" },
  { min: 250, name: "Opening Scholar" },
  { min: 375, name: "Opening Strategist" },
  { min: 500, name: "Opening Master" },
  { min: 650, name: "Opening Grandmaster" },
  { min: 800, name: "Opening Legend" },
  { min: 920, name: "Opening Hero" },
] as const;

export type IqRankName = (typeof IQ_RANKS)[number]["name"];

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * Map a Core competence signal in [0,1] to an Opening IQ in [0,1000].
 * Monotonic non-decreasing. Honors LAW #1: IQ tracks competence, nothing else.
 */
export function calibrateCoreToIq(core: number): number {
  const c = clamp(core, 0, 1);
  const shaped = CALIBRATION.coreToIqGain * Math.pow(c, CALIBRATION.coreToIqExponent);
  return Math.round(clamp(shaped, 0, 1) * IQ_MAX);
}

/** The progression rank for a given Opening IQ. */
export function rankForIq(iq: number): IqRankName {
  const clamped = clamp(iq, IQ_MIN, IQ_MAX);
  let rank: IqRankName = IQ_RANKS[0].name;
  for (const tier of IQ_RANKS) {
    if (clamped >= tier.min) rank = tier.name;
  }
  return rank;
}

/**
 * A rough percentile estimate for a Core signal. Explicitly an ESTIMATE at
 * launch (§4.4) — communicated to the user as such, refined on real data.
 */
export function estimatePercentile(core: number): number {
  return Math.round(clamp(core, 0, 1) * 100);
}
