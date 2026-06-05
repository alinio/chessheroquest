import { describe, it, expect } from "vitest";
import { positionMastery, openingMastery, computeCore } from "./core";
import { calibrateCoreToIq } from "./calibration";

describe("Opening IQ — Core (L1→L3, LAW #1)", () => {
  describe("L1 positionMastery = retention × accuracy", () => {
    it("forgetting zeroes mastery despite perfect past accuracy", () => {
      expect(positionMastery(0, 1)).toBe(0);
    });
    it("never being accurate zeroes mastery despite perfect retention", () => {
      expect(positionMastery(1, 0)).toBe(0);
    });
    it("full retention + full accuracy = 1", () => {
      expect(positionMastery(1, 1)).toBe(1);
    });
    it("is multiplicative and clamps inputs to [0,1]", () => {
      expect(positionMastery(0.5, 0.5)).toBeCloseTo(0.25, 6);
      expect(positionMastery(2, 2)).toBe(1);
      expect(positionMastery(-1, 1)).toBe(0);
    });
  });

  describe("L2 openingMastery — frequency-weighted", () => {
    it("returns 0 for an empty or zero-frequency opening", () => {
      expect(openingMastery([])).toBe(0);
      expect(openingMastery([{ retention: 1, accuracy: 1, frequency: 0 }])).toBe(0);
    });
    it("frequent positions dominate the score", () => {
      const m = openingMastery([
        { retention: 1, accuracy: 1, frequency: 90 }, // mastered, very common
        { retention: 0, accuracy: 0, frequency: 10 }, // unknown, rare
      ]);
      expect(m).toBeCloseTo(0.9, 5);
    });
  });

  describe("L3 computeCore + calibration (the living score, §4.5)", () => {
    it("a fully mastered repertoire → Core 1 → IQ 1000", () => {
      const core = computeCore([
        { mastery: 1, weight: 3 },
        { mastery: 1, weight: 1 },
      ]);
      expect(core).toBe(1);
      expect(calibrateCoreToIq(core)).toBe(1000);
    });

    it("a forgotten repertoire → Core 0 → IQ 0 (the score decays if you stop)", () => {
      const core = computeCore([{ mastery: 0, weight: 3 }]);
      expect(core).toBe(0);
      expect(calibrateCoreToIq(core)).toBe(0);
    });

    it("weights openings by repertoire importance, stays in [0,1]", () => {
      expect(
        computeCore([
          { mastery: 1, weight: 3 },
          { mastery: 0, weight: 1 },
        ]),
      ).toBeCloseTo(0.75, 5);
    });

    it("an empty repertoire scores Core 0", () => {
      expect(computeCore([])).toBe(0);
    });
  });
});
