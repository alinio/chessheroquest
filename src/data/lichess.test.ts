import { describe, it, expect } from "vitest";
import {
  ExplorerResponseSchema,
  rankedMoves,
  mostPlayedMove,
  explorerUrl,
  EXPLORER_DEFAULTS,
} from "./lichess";

/**
 * Recorded fixture: a realistic Opening Explorer response for the position after
 * 1.e4 (Black to move), lichess DB. Lets us test parsing + ranking OFFLINE — the
 * live call to explorer.lichess.ovh is verified separately on a networked host.
 */
const FIXTURE = {
  white: 124033,
  draws: 9001,
  black: 110872,
  moves: [
    { uci: "c7c5", san: "c5", white: 61000, draws: 4200, black: 58000, averageRating: 1322 },
    { uci: "e7e5", san: "e5", white: 41000, draws: 3100, black: 39000, averageRating: 1318 },
    { uci: "e7e6", san: "e6", white: 12000, draws: 900, black: 9500, averageRating: 1305 },
    { uci: "c7c6", san: "c6", white: 8000, draws: 600, black: 7200, averageRating: 1299 },
    { uci: "d7d5", san: "d5", white: 5000, draws: 300, black: 3900, averageRating: 1280 },
  ],
  opening: null,
};

describe("Lichess Explorer — schema + ranking (offline fixture)", () => {
  it("validates a real-shaped response", () => {
    expect(() => ExplorerResponseSchema.parse(FIXTURE)).not.toThrow();
  });

  it("rejects a malformed response (Zod boundary)", () => {
    const bad = { ...FIXTURE, white: "lots" };
    expect(() => ExplorerResponseSchema.parse(bad)).toThrow();
  });

  it("ranks moves by real popularity, most-played first", () => {
    const data = ExplorerResponseSchema.parse(FIXTURE);
    const ranked = rankedMoves(data);
    expect(ranked.map((m) => m.san)).toEqual(["c5", "e5", "e6", "c6", "d5"]);
    // non-increasing game counts
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i]!.games).toBeLessThanOrEqual(ranked[i - 1]!.games);
    }
  });

  it("frequencies sum to ~1 and shares stay in [0,1]", () => {
    const data = ExplorerResponseSchema.parse(FIXTURE);
    const ranked = rankedMoves(data);
    const sum = ranked.reduce((s, m) => s + m.frequency, 0);
    expect(sum).toBeCloseTo(1, 6);
    for (const m of ranked) {
      for (const share of [m.frequency, m.whiteShare, m.drawShare, m.blackShare]) {
        expect(share).toBeGreaterThanOrEqual(0);
        expect(share).toBeLessThanOrEqual(1);
      }
    }
  });

  it("mostPlayedMove = the product's 'correct' move (most played)", () => {
    const data = ExplorerResponseSchema.parse(FIXTURE);
    expect(mostPlayedMove(data)?.san).toBe("c5");
  });

  it("mostPlayedMove is null when Lichess has no data", () => {
    const empty = { white: 0, draws: 0, black: 0, moves: [], opening: null };
    expect(mostPlayedMove(ExplorerResponseSchema.parse(empty))).toBeNull();
  });

  it("builds a URL carrying the chosen audience filter", () => {
    const url = explorerUrl("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1");
    expect(url).toContain("explorer.lichess.ovh/lichess");
    expect(url).toContain(`ratings=${EXPLORER_DEFAULTS.ratings.join("%2C")}`);
    expect(url).toContain("speeds=blitz%2Crapid");
  });
});
