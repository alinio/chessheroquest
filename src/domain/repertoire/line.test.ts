import { describe, it, expect } from "vitest";
import { Chess } from "chess.js";
import { STARTER_PATHS } from "./starter-paths";
import { isPathLegal, fenAfter, expectedMoveAt } from "./line";

describe("curated starter paths", () => {
  it("are ALL fully legal (engine = truth, even for hand-curated content)", () => {
    for (const p of STARTER_PATHS) {
      expect(isPathLegal(p), p.id).toBe(true);
    }
  });

  it("each have a non-empty movelist and a unique id", () => {
    const ids = new Set<string>();
    for (const p of STARTER_PATHS) {
      expect(p.moves.length, p.id).toBeGreaterThan(0);
      expect(ids.has(p.id), `duplicate id ${p.id}`).toBe(false);
      ids.add(p.id);
    }
  });
});

describe("line helpers", () => {
  const p = STARTER_PATHS[0]!;

  it("fenAfter(0) is the initial position", () => {
    expect(fenAfter(p, 0)).toBe(new Chess().fen());
  });

  it("fenAfter(full length) yields a legal, loadable position", () => {
    const fen = fenAfter(p, p.moves.length);
    expect(() => new Chess(fen)).not.toThrow();
    expect(fen).not.toBe(new Chess().fen());
  });

  it("expectedMoveAt returns the SAN, then null past the end", () => {
    expect(expectedMoveAt(p, 0)).toBe(p.moves[0]);
    expect(expectedMoveAt(p, p.moves.length)).toBeNull();
  });

  it("fenAfter throws when ply is out of range", () => {
    expect(() => fenAfter(p, p.moves.length + 1)).toThrow(RangeError);
    expect(() => fenAfter(p, -1)).toThrow(RangeError);
  });

  it("isPathLegal returns false for an illegal line", () => {
    expect(isPathLegal({ ...p, moves: ["e4", "e4"] })).toBe(false);
  });
});
