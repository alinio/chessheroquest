import { describe, it, expect } from "vitest";
import { levelForXp, xpForLevel, xpProgress } from "./xp";
import { recordActivity, isStreakAlive, EMPTY_STREAK } from "./streak";
import { generateDailyQuests } from "./quests";
import { projectedEloGain, roadProgress, goalTargetIq, practicalRankElo, ELO_GOALS } from "./road";

describe("XP & levels", () => {
  it("starts at level 1 and never decreases with XP", () => {
    expect(levelForXp(0)).toBe(1);
    let prev = 0;
    for (let xp = 0; xp <= 5000; xp += 137) {
      const l = levelForXp(xp);
      expect(l).toBeGreaterThanOrEqual(prev);
      prev = l;
    }
  });
  it("xpForLevel and levelForXp round-trip at boundaries", () => {
    for (let l = 1; l <= 10; l++) expect(levelForXp(xpForLevel(l))).toBe(l);
  });
  it("xpProgress stays within the current level band", () => {
    const p = xpProgress(275);
    expect(p.into).toBeGreaterThanOrEqual(0);
    expect(p.into).toBeLessThanOrEqual(p.needed);
  });
});

describe("streak (habit loop, no gating)", () => {
  const day = (n: number) => new Date(n * 86_400_000 + 3_600_000);

  it("first activity starts a streak of 1", () => {
    expect(recordActivity(EMPTY_STREAK, day(100))).toEqual({ count: 1, lastActiveDay: 100 });
  });
  it("the same day does not double-count", () => {
    const s = recordActivity(EMPTY_STREAK, day(100));
    expect(recordActivity(s, new Date(day(100).getTime() + 1000))).toEqual(s);
  });
  it("a consecutive day increments", () => {
    let s = recordActivity(EMPTY_STREAK, day(100));
    s = recordActivity(s, day(101));
    expect(s.count).toBe(2);
  });
  it("a missed day resets to 1", () => {
    let s = recordActivity(EMPTY_STREAK, day(100));
    s = recordActivity(s, day(103));
    expect(s.count).toBe(1);
  });
  it("stays alive through the grace day, dies after", () => {
    const s = recordActivity(EMPTY_STREAK, day(100));
    expect(isStreakAlive(s, day(101))).toBe(true);
    expect(isStreakAlive(s, day(102))).toBe(false);
  });
});

describe("daily quests (§13)", () => {
  it("always includes a Daily Quest, target clamped 1–10", () => {
    const q = generateDailyQuests({ dueCount: 99, weakestOpeningName: null, bossOpeningName: null });
    expect(q[0]!.type).toBe("daily_quest");
    expect(q[0]!.target).toBeGreaterThanOrEqual(1);
    expect(q[0]!.target).toBeLessThanOrEqual(10);
  });
  it("adds weakness + boss when provided", () => {
    const q = generateDailyQuests({
      dueCount: 5,
      weakestOpeningName: "Caro-Kann",
      bossOpeningName: "Italian Game",
    });
    expect(q.map((x) => x.type)).toEqual(["daily_quest", "weakness_battle", "boss_fight"]);
  });
});

describe("Road to Elo (launch-default estimates, §4.4)", () => {
  it("projected Elo gain rises with IQ and is bounded", () => {
    expect(projectedEloGain(0)).toBe(0);
    expect(projectedEloGain(1000)).toBe(250);
    expect(projectedEloGain(500)).toBeLessThan(projectedEloGain(900));
  });
  it("road progress is a clamped 0–1 fraction toward the goal", () => {
    for (const g of ELO_GOALS) {
      expect(roadProgress(0, g)).toBe(0);
      expect(roadProgress(2000, g)).toBe(1);
      expect(roadProgress(goalTargetIq(g), g)).toBe(1);
    }
  });
});

describe("practicalRankElo (Profile insignia — estimate, never inflated)", () => {
  it("starts at the 1000 baseline and climbs only past each goal's target IQ", () => {
    expect(practicalRankElo(0)).toBe(1000);
    expect(practicalRankElo(goalTargetIq(1000) - 1)).toBe(1000);
    expect(practicalRankElo(goalTargetIq(1200))).toBe(1200);
    expect(practicalRankElo(goalTargetIq(1500))).toBe(1500);
    expect(practicalRankElo(1000)).toBe(1800);
  });
});
