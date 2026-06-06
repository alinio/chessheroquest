import { describe, it, expect } from "vitest";
import { PLANS, planByPriceId, mapPaddleStatus } from "./plans";

describe("pricing plans (§21)", () => {
  it("defines the four tiers in order", () => {
    expect(PLANS.map((p) => p.id)).toEqual([
      "free",
      "pro_monthly",
      "pro_annual",
      "lifetime",
    ]);
  });

  it("planByPriceId returns null for an unknown price", () => {
    expect(planByPriceId("pri_does_not_exist")).toBeNull();
  });

  it("normalizes Paddle subscription statuses", () => {
    expect(mapPaddleStatus("active")).toBe("active");
    expect(mapPaddleStatus("trialing")).toBe("active");
    expect(mapPaddleStatus("past_due")).toBe("past_due");
    expect(mapPaddleStatus("paused")).toBe("paused");
    expect(mapPaddleStatus("canceled")).toBe("canceled");
    expect(mapPaddleStatus("anything-else")).toBe("none");
  });
});
