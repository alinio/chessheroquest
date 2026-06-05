/**
 * FSRS scheduling (domain — pure wrapper over ts-fsrs). The hidden retention
 * engine (CLAUDE.md LAW #6, master-vision §18): every answerable position is an
 * SRS card; FSRS schedules reviews and yields the Retention signal that feeds the
 * Opening IQ (§4.2) and makes it a *living* score that decays if you stop (§4.5).
 *
 * Deterministic: fuzz disabled so scheduling is reproducible and unit-testable.
 */
import {
  fsrs,
  generatorParameters,
  createEmptyCard,
  Rating,
  State,
  type Card,
  type Grade,
} from "ts-fsrs";

export const FSRS_PARAMETERS = generatorParameters({ enable_fuzz: false });
const scheduler = fsrs(FSRS_PARAMETERS);

export { Rating, State };
export type { Card, Grade };

/** A fresh, never-reviewed card for a position. */
export function newCard(now: Date): Card {
  return createEmptyCard(now);
}

/**
 * Map a binary drill outcome to an FSRS grade. The product layer stays binary
 * (you found the move or you didn't); FSRS handles the nuance internally.
 */
export function gradeFromOutcome(correct: boolean): Grade {
  return correct ? Rating.Good : Rating.Again;
}

/** Reschedule a card after the player answers. Returns the updated card. */
export function reviewCard(card: Card, correct: boolean, now: Date): Card {
  return scheduler.next(card, now, gradeFromOutcome(correct)).card;
}

/**
 * Retrievability (memory strength) in [0,1] at `now` — the Retention component of
 * the Opening IQ. Decays with elapsed time → "use it or lose it".
 */
export function retention(card: Card, now: Date): number {
  const r = scheduler.get_retrievability(card, now, false);
  return Number.isFinite(r) ? Math.min(1, Math.max(0, r)) : 0;
}

/** Whether the card is due for review at `now`. */
export function isDue(card: Card, now: Date): boolean {
  return card.due.getTime() <= now.getTime();
}
