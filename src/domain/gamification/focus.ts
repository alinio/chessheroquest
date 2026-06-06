/**
 * Daily focus (domain — pure). Picks which openings the daily loop should target:
 * the weakest line (lowest mastery → Weakness Battle) and a boss candidate (the
 * strongest line not yet conquered → push it to gold). Drives §13's daily loop.
 */
import type { MasteryState } from "@/src/domain/mastery";

const STATE_ORDER: Record<MasteryState, number> = {
  leak: 0,
  review: 1,
  solid: 2,
  gold: 3,
};

export interface OpeningRef {
  slug: string;
  name: string;
  state: MasteryState;
}

export function pickFocusOpenings(openings: readonly OpeningRef[]): {
  weakest: OpeningRef | null;
  boss: OpeningRef | null;
} {
  if (openings.length === 0) return { weakest: null, boss: null };

  const byMastery = [...openings].sort(
    (a, b) => STATE_ORDER[a.state] - STATE_ORDER[b.state],
  );
  const weakest = byMastery[0] ?? null;

  // Boss = the strongest line that isn't gold yet (closest to conquering).
  const notConquered = byMastery.filter((o) => o.state !== "gold");
  const boss = notConquered.length > 0 ? notConquered[notConquered.length - 1]! : null;

  return { weakest, boss };
}
