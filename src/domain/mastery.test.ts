import { describe, it, expect } from "vitest";
import { masteryState } from "./mastery";

describe("masteryState (kingdom colours, §10)", () => {
  it("nothing studied → leak", () => {
    expect(masteryState(0, 10, 0)).toBe("leak");
    expect(masteryState(0, 0, 0)).toBe("leak");
  });

  it("barely covered → leak", () => {
    expect(masteryState(3, 10, 0.9)).toBe("leak"); // 30% coverage
  });

  it("covered but shaky retention → review", () => {
    expect(masteryState(8, 10, 0.5)).toBe("review");
  });

  it("good coverage + decent retention → solid", () => {
    expect(masteryState(8, 10, 0.9)).toBe("solid"); // <100% coverage
    expect(masteryState(10, 10, 0.8)).toBe("solid"); // retention <0.85
  });

  it("full coverage + high retention → gold (conquered)", () => {
    expect(masteryState(10, 10, 0.9)).toBe("gold");
  });

  it("you cannot gold a kingdom by skimming it (LAW #1)", () => {
    expect(masteryState(5, 10, 1)).not.toBe("gold"); // half-covered, perfect retention
  });
});
