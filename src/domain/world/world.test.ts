import { describe, it, expect } from "vitest";
import { Chess } from "chess.js";
import { ITALIAN_TREE, mainLine, playerPlies } from "./italian";

describe("Italian line tree (chess truth)", () => {
  it("main line is 10 plies; every node FEN is reachable by replaying its SAN", () => {
    const line = mainLine(ITALIAN_TREE);
    expect(line).toHaveLength(10);
    const game = new Chess();
    for (const node of line) {
      expect(() => game.move(node.san)).not.toThrow();
      expect(game.fen()).toBe(node.fen);
    }
  });

  it("at least the critical moves are flagged", () => {
    const line = mainLine(ITALIAN_TREE);
    expect(line.filter((n) => n.isCritical).length).toBeGreaterThanOrEqual(3);
  });

  it("playerPlies are White's moves (even indices) for a White opening", () => {
    expect(playerPlies(ITALIAN_TREE)).toEqual([0, 2, 4, 6, 8]);
  });
});
