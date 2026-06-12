import { describe, expect, it } from "vitest";
import { medallionState, nextSealIndex, trainingChip, type PassportProgress } from "./passport";

const p = (over: Partial<PassportProgress>): PassportProgress => ({
  studied: 0,
  total: 10,
  state: "leak",
  guardianDefeated: false,
  ...over,
});

describe("medallionState — the four Passport states", () => {
  it("unexplored when nothing studied (or no curated path)", () => {
    expect(medallionState(null)).toBe("unexplored");
    expect(medallionState(p({ studied: 0 }))).toBe("unexplored");
  });

  it("in training while studied but not gold", () => {
    expect(medallionState(p({ studied: 3, state: "leak" }))).toBe("training");
    expect(medallionState(p({ studied: 8, state: "review" }))).toBe("training");
    expect(medallionState(p({ studied: 10, state: "solid" }))).toBe("training");
  });

  it("ready to seal at gold, sealed only once the Guardian falls", () => {
    expect(medallionState(p({ studied: 10, state: "gold" }))).toBe("ready");
    expect(medallionState(p({ studied: 10, state: "gold", guardianDefeated: true }))).toBe(
      "sealed",
    );
  });

  it("a Guardian win without gold mastery never seals (LAW #1)", () => {
    expect(medallionState(p({ studied: 10, state: "solid", guardianDefeated: true }))).toBe(
      "training",
    );
  });
});

describe("trainingChip", () => {
  it("names the state in coach words", () => {
    expect(trainingChip("leak")).toBe("Leak");
    expect(trainingChip("review")).toBe("Fading");
    expect(trainingChip("solid")).toBe("Solid");
  });
});

describe("nextSealIndex — gold > solid > best coverage, never sealed/untouched", () => {
  it("returns -1 on a fresh passport (nothing studied)", () => {
    expect(nextSealIndex([null, p({ studied: 0 })])).toBe(-1);
  });

  it("prefers a gold (ready) line over everything else", () => {
    const entries = [
      p({ studied: 10, state: "solid" }),
      p({ studied: 10, state: "gold" }),
      p({ studied: 9, state: "leak" }),
    ];
    expect(nextSealIndex(entries)).toBe(1);
  });

  it("prefers solid over higher raw coverage in leak/review", () => {
    const entries = [p({ studied: 9, state: "review" }), p({ studied: 6, state: "solid" })];
    expect(nextSealIndex(entries)).toBe(1);
  });

  it("falls back to the best coverage among started lines", () => {
    const entries = [p({ studied: 2 }), p({ studied: 7 }), p({ studied: 4 })];
    expect(nextSealIndex(entries)).toBe(1);
  });

  it("skips sealed openings entirely", () => {
    const entries = [
      p({ studied: 10, state: "gold", guardianDefeated: true }),
      p({ studied: 3, state: "leak" }),
    ];
    expect(nextSealIndex(entries)).toBe(1);
  });
});
