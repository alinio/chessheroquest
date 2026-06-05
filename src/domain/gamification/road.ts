/**
 * Road to Elo (domain — pure). The destination, not the product (master-vision
 * §5): the user picks a goal; Opening IQ is the gauge; a projected Elo impact
 * shows ROI.
 *
 * LAUNCH DEFAULTS (§4.4, §27): the IQ→Elo mapping is a transparent, conservative
 * placeholder refined by regressing IQ against real Elo as data grows. Frame all
 * projections to the user as ESTIMATES — never over-promise (risk §24).
 */

export type EloGoal = 1000 | 1200 | 1500 | 1800;
export const ELO_GOALS: readonly EloGoal[] = [1000, 1200, 1500, 1800];

const clampIq = (iq: number) => Math.min(1000, Math.max(0, iq));

/** Estimated practical Elo gained from opening mastery at a given Opening IQ. */
export function projectedEloGain(openingIq: number): number {
  // Default: openings are worth up to ~+250 Elo of practical strength at IQ 1000.
  return Math.round((clampIq(openingIq) / 1000) * 250);
}

/** Launch-default Opening IQ that "completes" the road to each Elo goal. */
export function goalTargetIq(goal: EloGoal): number {
  switch (goal) {
    case 1000:
      return 350;
    case 1200:
      return 500;
    case 1500:
      return 700;
    case 1800:
      return 900;
  }
}

/** Progress toward a chosen Elo goal as a 0–1 fraction (the Road gauge fill). */
export function roadProgress(openingIq: number, goal: EloGoal): number {
  const target = goalTargetIq(goal);
  return Math.min(1, Math.max(0, clampIq(openingIq) / target));
}
