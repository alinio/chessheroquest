/**
 * Spaced repetition — SM-2 scheduler (pure). Drives card due/interval/ease/reps/
 * lapses from each drill result. Deterministic; no I/O, no Date (now is passed in).
 */
import type { SrsCard } from "./types";

const DAY_MS = 86_400_000;
export const MIN_EASE = 1.3;

/**
 * Apply one SM-2 review. `correct` maps to quality: correct → 4 (good),
 * wrong/skip → 1 (lapse → relearn from a 1-day interval).
 */
export function reviewCard(card: SrsCard, correct: boolean, now: number): SrsCard {
  const quality = correct ? 4 : 1;

  // Ease factor update (original SM-2), floored at 1.3.
  const easeRaw = card.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  const ease = Math.max(MIN_EASE, Math.round(easeRaw * 100) / 100);

  let reps = card.reps;
  let interval = card.interval;
  let lapses = card.lapses;

  if (quality < 3) {
    reps = 0;
    interval = 1; // relearn tomorrow
    lapses += 1;
  } else {
    reps += 1;
    interval = reps === 1 ? 1 : reps === 2 ? 6 : Math.max(1, Math.round(interval * ease));
  }

  return { ...card, ease, reps, interval, lapses, due: now + interval * DAY_MS };
}
