import { describe, expect, it } from "vitest";
import { dayIndex, isStreakAtRisk } from "./streak";

const day = (offset: number) => new Date((dayIndex(NOW) + offset) * 86_400_000);
const NOW = new Date("2026-06-11T18:00:00Z");

describe("isStreakAtRisk (the streak-rescue email trigger)", () => {
  it("fires when the user trained yesterday, not today, with ≥3 days banked", () => {
    expect(isStreakAtRisk({ count: 7, lastActiveDay: dayIndex(NOW) - 1 }, NOW)).toBe(true);
  });

  it("stays quiet when the user already trained today", () => {
    expect(isStreakAtRisk({ count: 7, lastActiveDay: dayIndex(NOW) }, NOW)).toBe(false);
  });

  it("stays quiet when the streak is already broken (2+ days ago)", () => {
    expect(isStreakAtRisk({ count: 7, lastActiveDay: dayIndex(NOW) - 2 }, NOW)).toBe(false);
  });

  it("stays quiet for tiny streaks — nothing real at stake (LAW #5)", () => {
    expect(isStreakAtRisk({ count: 2, lastActiveDay: dayIndex(NOW) - 1 }, NOW)).toBe(false);
  });

  it("stays quiet for never-active users", () => {
    expect(isStreakAtRisk({ count: 0, lastActiveDay: null }, NOW)).toBe(false);
  });

  it("honors a custom minimum", () => {
    expect(isStreakAtRisk({ count: 2, lastActiveDay: dayIndex(NOW) - 1 }, NOW, 2)).toBe(true);
  });

  it("day() helper sanity", () => {
    expect(dayIndex(day(0))).toBe(dayIndex(NOW));
  });
});
