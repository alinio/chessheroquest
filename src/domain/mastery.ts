/**
 * Opening mastery state (domain — pure). Maps coverage + FSRS retention to the
 * four kingdom states (master-vision §10, DESIGN.md mastery tokens). Gold =
 * "conquered" requires BOTH full coverage and high retention — you can't gold a
 * kingdom by skimming it (LAW #1: mastery, not volume).
 */
export type MasteryState = "leak" | "review" | "solid" | "gold";

export function masteryState(
  studied: number,
  total: number,
  avgRetention: number,
): MasteryState {
  if (total <= 0 || studied <= 0) return "leak";
  const coverage = studied / total;
  if (coverage < 0.5) return "leak";
  if (avgRetention < 0.6) return "review";
  if (coverage < 1 || avgRetention < 0.85) return "solid";
  return "gold";
}
