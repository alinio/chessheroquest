import { describe, it, expect } from "vitest";
import { reviewCard, MIN_EASE } from "./srs";
import type { SrsCard } from "./types";

const fresh = (): SrsCard => ({ id: "x", openingId: "italian", ref: "0", due: 0, interval: 0, ease: 2.5, reps: 0, lapses: 0 });
const DAY = 86_400_000;

describe("SM-2 reviewCard", () => {
  it("correct answers grow the interval (1 → 6 → ×ease)", () => {
    let c = reviewCard(fresh(), true, 0);
    expect(c.reps).toBe(1);
    expect(c.interval).toBe(1);
    expect(c.due).toBe(1 * DAY);

    c = reviewCard(c, true, 0);
    expect(c.reps).toBe(2);
    expect(c.interval).toBe(6);

    c = reviewCard(c, true, 0);
    expect(c.reps).toBe(3);
    expect(c.interval).toBe(Math.round(6 * c.ease));
    expect(c.interval).toBeGreaterThan(6);
  });

  it("a wrong answer resets reps + interval and counts a lapse", () => {
    let c = reviewCard(reviewCard(fresh(), true, 0), true, 0); // interval 6
    c = reviewCard(c, false, 0);
    expect(c.reps).toBe(0);
    expect(c.interval).toBe(1);
    expect(c.lapses).toBe(1);
    expect(c.due).toBe(1 * DAY);
  });

  it("ease never drops below 1.3", () => {
    let c = fresh();
    for (let i = 0; i < 20; i++) c = reviewCard(c, false, 0);
    expect(c.ease).toBeGreaterThanOrEqual(MIN_EASE);
  });

  it("correct (good=q4) holds ease; wrong lowers it", () => {
    expect(reviewCard(fresh(), true, 0).ease).toBeCloseTo(2.5);
    expect(reviewCard(fresh(), false, 0).ease).toBeLessThan(2.5);
  });
});
