import { describe, it, expect } from "vitest";
import { Chess } from "chess.js";
import { DNA_TEST_BANK, TEST_LENGTH } from "./bank";
import {
  qualityFromCpLoss,
  aggregateAccuracy,
  provisionalOpeningIq,
  familyPerformance,
  buildResult,
  BLUNDER_CP,
} from "./scoring";
import {
  nextTargetDifficulty,
  makeAnswer,
  selectNextPosition,
  START_DIFFICULTY,
} from "./adaptive";
import type { Answer, TestPosition } from "./types";

describe("DNA test bank (chess truth — no fabricated FENs/moves)", () => {
  it("every seed position is a legal, consistent, single-best puzzle", () => {
    expect(DNA_TEST_BANK.length).toBeGreaterThan(0);
    for (const p of DNA_TEST_BANK) {
      // FEN parses
      const game = new Chess(p.fen);
      // side to move matches the tag
      expect(game.turn()).toBe(p.sideToMove === "white" ? "w" : "b");
      // difficulty in range
      expect(p.difficulty).toBeGreaterThanOrEqual(1);
      expect(p.difficulty).toBeLessThanOrEqual(5);
      // 2–4 options
      expect(p.options.length).toBeGreaterThanOrEqual(2);
      expect(p.options.length).toBeLessThanOrEqual(4);
      // skill = exactly one best at 0cp; style = no best (no right answer)
      const best = p.options.filter((o) => o.isBest);
      if (p.questionType === "skill") {
        expect(best).toHaveLength(1);
        expect(best[0]!.centipawnLoss).toBe(0);
      } else {
        expect(best).toHaveLength(0);
      }
      // every option is a legal move from the position
      for (const o of p.options) {
        const probe = new Chess(p.fen);
        expect(() => probe.move(o.san)).not.toThrow();
        expect(o.centipawnLoss).toBeGreaterThanOrEqual(0);
      }
      // lineSan is real: replaying it from the start reaches this FEN
      const lineGame = new Chess();
      for (const san of p.lineSan) expect(() => lineGame.move(san)).not.toThrow();
      expect(lineGame.fen()).toBe(p.fen);
    }
  });

  it("TEST_LENGTH is the bank size, capped at 20", () => {
    expect(TEST_LENGTH).toBe(Math.min(20, DNA_TEST_BANK.length));
  });
});

describe("scoring", () => {
  it("qualityFromCpLoss: 0→1, half-blunder→.5, blunder→0", () => {
    expect(qualityFromCpLoss(0)).toBe(1);
    expect(qualityFromCpLoss(BLUNDER_CP / 2)).toBeCloseTo(0.5);
    expect(qualityFromCpLoss(BLUNDER_CP)).toBe(0);
    expect(qualityFromCpLoss(BLUNDER_CP * 2)).toBe(0);
  });

  it("aggregateAccuracy weights harder positions more", () => {
    const easyWrong: Answer = { positionId: "e", openingFamily: "X", difficulty: 1, questionType: "skill", chosen: 0, centipawnLoss: BLUNDER_CP, isBest: false, quality: 0 };
    const hardRight: Answer = { positionId: "h", openingFamily: "Y", difficulty: 5, questionType: "skill", chosen: 0, centipawnLoss: 0, isBest: true, quality: 1 };
    // weighted: (1*0 + 5*1) / (1+5) = 5/6
    expect(aggregateAccuracy([easyWrong, hardRight])).toBeCloseTo(5 / 6);
    expect(aggregateAccuracy([])).toBe(0);
  });

  it("provisionalOpeningIq is 0→low, perfect→1000, and monotonic", () => {
    expect(provisionalOpeningIq(0, 1)).toBeLessThan(50);
    expect(provisionalOpeningIq(1, 5)).toBe(1000);
    expect(provisionalOpeningIq(0.8, 3)).toBeLessThan(provisionalOpeningIq(0.95, 3));
    const iq = provisionalOpeningIq(0.6, 3);
    expect(iq).toBeGreaterThanOrEqual(0);
    expect(iq).toBeLessThanOrEqual(1000);
  });

  it("familyPerformance ranks strongest first", () => {
    const answers: Answer[] = [
      { positionId: "1", openingFamily: "Strong", difficulty: 2, questionType: "skill", chosen: 0, centipawnLoss: 0, isBest: true, quality: 1 },
      { positionId: "2", openingFamily: "Weak", difficulty: 2, questionType: "skill", chosen: 1, centipawnLoss: BLUNDER_CP, isBest: false, quality: 0 },
    ];
    const fams = familyPerformance(answers);
    expect(fams[0]!.family).toBe("Strong");
    expect(fams[fams.length - 1]!.family).toBe("Weak");
  });

  it("buildResult surfaces strongest/weakest families", () => {
    const answers: Answer[] = [
      { positionId: "1", openingFamily: "Italian Game", difficulty: 2, questionType: "skill", chosen: 0, centipawnLoss: 0, isBest: true, quality: 1 },
      { positionId: "2", openingFamily: "Sicilian Defense", difficulty: 3, questionType: "skill", chosen: 0, centipawnLoss: BLUNDER_CP, isBest: false, quality: 0 },
    ];
    const r = buildResult(answers);
    expect(r.strongestFamily).toBe("Italian Game");
    expect(r.weakestFamily).toBe("Sicilian Defense");
    expect(r.positionsAnswered).toBe(2);
    expect(r.openingIq).toBeGreaterThanOrEqual(0);
  });
});

describe("adaptive engine", () => {
  it("difficulty steps up on strong, down on weak, clamps 1–5", () => {
    expect(nextTargetDifficulty(3, 0.9)).toBe(4);
    expect(nextTargetDifficulty(3, 0.2)).toBe(2);
    expect(nextTargetDifficulty(3, 0.6)).toBe(3);
    expect(nextTargetDifficulty(5, 1)).toBe(5);
    expect(nextTargetDifficulty(1, 0)).toBe(1);
  });

  it("makeAnswer: best → quality 1; skip → blunder/quality 0", () => {
    const p = DNA_TEST_BANK[0]!;
    const bestIdx = p.options.findIndex((o) => o.isBest);
    expect(makeAnswer(p, bestIdx).quality).toBe(1);
    const skip = makeAnswer(p, null);
    expect(skip.chosen).toBeNull();
    expect(skip.centipawnLoss).toBe(BLUNDER_CP);
    expect(skip.quality).toBe(0);
  });

  it("selectNextPosition: deterministic, nearest difficulty, skips used, exhausts to null", () => {
    const used = new Set<string>();
    const counts: Record<string, number> = {};
    const first = selectNextPosition(DNA_TEST_BANK, used, START_DIFFICULTY, counts)!;
    expect(first).toBeTruthy();
    // determinism: same inputs → same pick
    expect(selectNextPosition(DNA_TEST_BANK, used, START_DIFFICULTY, counts)!.id).toBe(first.id);
    // walk the whole bank without repeats
    const seen = new Set<string>();
    const target = START_DIFFICULTY;
    const fc: Record<string, number> = {};
    for (let i = 0; i < DNA_TEST_BANK.length; i++) {
      const pick = selectNextPosition(DNA_TEST_BANK, seen, target, fc) as TestPosition;
      expect(seen.has(pick.id)).toBe(false);
      seen.add(pick.id);
      fc[pick.openingFamily] = (fc[pick.openingFamily] ?? 0) + 1;
    }
    expect(seen.size).toBe(DNA_TEST_BANK.length);
    expect(selectNextPosition(DNA_TEST_BANK, seen, target, fc)).toBeNull();
  });
});
