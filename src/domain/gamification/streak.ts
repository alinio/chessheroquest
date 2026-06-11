/**
 * Streak (domain — pure). Habit loop (master-vision §12.4): the streak grows on
 * training done, resets after a missed day. No energy/lives gating (§12.0).
 */

/** Calendar-day index (UTC) for a date — lets us compare days, not timestamps. */
export function dayIndex(d: Date): number {
  return Math.floor(d.getTime() / 86_400_000);
}

export interface StreakState {
  count: number;
  /** Day index of the last activity, or null if never active. */
  lastActiveDay: number | null;
}

export const EMPTY_STREAK: StreakState = { count: 0, lastActiveDay: null };

/**
 * Record training activity at `now`. Same day → unchanged; the next consecutive
 * day → +1; a gap of 2+ days → reset to 1.
 */
export function recordActivity(state: StreakState, now: Date): StreakState {
  const today = dayIndex(now);
  if (state.lastActiveDay === null) return { count: 1, lastActiveDay: today };
  if (today === state.lastActiveDay) return state;
  if (today === state.lastActiveDay + 1) {
    return { count: state.count + 1, lastActiveDay: today };
  }
  return { count: 1, lastActiveDay: today };
}

/** A streak is alive if the user trained today or yesterday (grace day). */
export function isStreakAlive(state: StreakState, now: Date): boolean {
  if (state.lastActiveDay === null) return false;
  const today = dayIndex(now);
  return today === state.lastActiveDay || today === state.lastActiveDay + 1;
}

/**
 * A streak worth rescuing: trained yesterday but not yet today, with at least
 * `minCount` days banked. Drives the daily streak-rescue email — value, not
 * manipulation (LAW #5): we only nudge when something real is at stake.
 */
export function isStreakAtRisk(state: StreakState, now: Date, minCount = 3): boolean {
  if (state.lastActiveDay === null) return false;
  return state.count >= minCount && dayIndex(now) === state.lastActiveDay + 1;
}
