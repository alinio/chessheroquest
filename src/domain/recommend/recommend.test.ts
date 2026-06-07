import { describe, it, expect } from "vitest";
import { WORLDS } from "./worlds";
import { roadToElo, provisionalTopPercent } from "./road-to-elo";
import { ARCHETYPES } from "@/src/domain/style-quiz/types";

describe("worlds", () => {
  it("maps all 4 archetypes to a named world with a 5-opening roster", () => {
    for (const a of ARCHETYPES) {
      const w = WORLDS[a];
      expect(w.name).toBeTruthy();
      expect(w.openings.length).toBe(5);
      for (const o of w.openings) {
        expect(o.id).toBeTruthy();
        expect(o.name).toBeTruthy();
        expect(o.eco).toMatch(/^[A-E]\d\d$/);
      }
    }
  });
});

describe("roadToElo", () => {
  it("leads with the weakest family when it's in the roster", () => {
    const recs = roadToElo("warrior", "King's Gambit", 3);
    expect(recs[0]!.name).toBe("King's Gambit");
    expect(recs[0]!.reason).toMatch(/weakest/i);
    expect(recs).toHaveLength(3);
  });

  it("falls back to roster order when weakest isn't in the roster", () => {
    const recs = roadToElo("warrior", "French Defense", 3);
    expect(recs[0]!.name).toBe("Italian Game");
    expect(recs.every((r) => r.reason)).toBe(true);
  });

  it("is deterministic", () => {
    expect(roadToElo("trickster", "Budapest Gambit")).toEqual(roadToElo("trickster", "Budapest Gambit"));
  });
});

describe("provisionalTopPercent", () => {
  it("higher IQ → better (smaller) top %, clamped 1–99", () => {
    expect(provisionalTopPercent(1000)).toBe(1);
    expect(provisionalTopPercent(0)).toBe(99);
    expect(provisionalTopPercent(820)).toBe(18);
    expect(provisionalTopPercent(900)).toBeLessThan(provisionalTopPercent(500));
  });
});
