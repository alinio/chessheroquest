import { describe, it, expect } from "vitest";
import { newCard, reviewCard, retention, isDue, State } from "./fsrs";

const T0 = new Date("2026-01-01T00:00:00Z");
const days = (n: number) => new Date(T0.getTime() + n * 86_400_000);

describe("FSRS wrapper (hidden retention engine, LAW #6)", () => {
  it("a new card is due now and starts in the New state", () => {
    const c = newCard(T0);
    expect(c.state).toBe(State.New);
    expect(isDue(c, T0)).toBe(true);
  });

  it("retention is ~1 right after a correct review and decays over time", () => {
    const reviewed = reviewCard(newCard(T0), true, T0);
    const now = retention(reviewed, T0);
    const later = retention(reviewed, days(30));
    expect(now).toBeGreaterThan(0.9);
    expect(later).toBeLessThan(now);
    expect(later).toBeGreaterThanOrEqual(0);
  });

  it("retention is monotonically non-increasing in elapsed time (use it or lose it)", () => {
    const c = reviewCard(newCard(T0), true, T0);
    let prev = 2;
    for (let d = 0; d <= 60; d += 5) {
      const r = retention(c, days(d));
      expect(r).toBeLessThanOrEqual(prev + 1e-9);
      prev = r;
    }
  });

  it("a correct review schedules further out than a wrong one", () => {
    const base = reviewCard(newCard(T0), true, T0);
    const atDue = new Date(base.due.getTime());
    const good = reviewCard(base, true, atDue);
    const again = reviewCard(base, false, atDue);
    expect(good.due.getTime()).toBeGreaterThan(again.due.getTime());
  });

  it("a wrong answer records a lapse on a graduated card", () => {
    let c = reviewCard(newCard(T0), true, T0);
    c = reviewCard(c, true, new Date(c.due.getTime()));
    const failed = reviewCard(c, false, new Date(c.due.getTime()));
    expect(failed.lapses).toBeGreaterThanOrEqual(1);
  });
});
