import { describe, it, expect } from "vitest";
import {
  calibrateCoreToIq,
  rankForIq,
  estimatePercentile,
  IQ_MIN,
  IQ_MAX,
  IQ_RANKS,
} from "./calibration";

describe("calibrateCoreToIq (LAW #1: IQ tracks competence)", () => {
  it("maps the [0,1] Core signal into [0,1000]", () => {
    expect(calibrateCoreToIq(0)).toBe(IQ_MIN);
    expect(calibrateCoreToIq(1)).toBe(IQ_MAX);
  });

  it("is monotonic non-decreasing — more competence never lowers IQ", () => {
    let prev = -1;
    for (let c = 0; c <= 1.0001; c += 0.05) {
      const iq = calibrateCoreToIq(c);
      expect(iq).toBeGreaterThanOrEqual(prev);
      prev = iq;
    }
  });

  it("clamps out-of-range input", () => {
    expect(calibrateCoreToIq(-5)).toBe(IQ_MIN);
    expect(calibrateCoreToIq(99)).toBe(IQ_MAX);
  });
});

describe("rankForIq (master-vision §16 tiers)", () => {
  it("floors to Explorer and tops out at Opening Hero", () => {
    expect(rankForIq(0)).toBe("Opening Explorer");
    expect(rankForIq(1000)).toBe("Opening Hero");
  });

  it("returns the highest tier whose threshold is met", () => {
    for (const tier of IQ_RANKS) {
      expect(rankForIq(tier.min)).toBe(tier.name);
    }
  });
});

describe("estimatePercentile", () => {
  it("is a clamped 0–100 estimate", () => {
    expect(estimatePercentile(0)).toBe(0);
    expect(estimatePercentile(1)).toBe(100);
    expect(estimatePercentile(0.42)).toBe(42);
    expect(estimatePercentile(2)).toBe(100);
  });
});
