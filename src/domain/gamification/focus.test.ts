import { describe, it, expect } from "vitest";
import { pickFocusOpenings } from "./focus";

describe("pickFocusOpenings (daily loop targeting)", () => {
  it("empty → no focus", () => {
    expect(pickFocusOpenings([])).toEqual({ weakest: null, boss: null });
  });

  it("weakest = lowest mastery; boss = strongest not-yet-conquered", () => {
    const r = pickFocusOpenings([
      { slug: "a", name: "A", state: "solid" },
      { slug: "b", name: "B", state: "leak" },
      { slug: "c", name: "C", state: "gold" },
    ]);
    expect(r.weakest?.slug).toBe("b");
    expect(r.boss?.slug).toBe("a");
  });

  it("all conquered → no boss, weakest still returned", () => {
    const r = pickFocusOpenings([
      { slug: "a", name: "A", state: "gold" },
      { slug: "b", name: "B", state: "gold" },
    ]);
    expect(r.weakest?.state).toBe("gold");
    expect(r.boss).toBeNull();
  });
});
