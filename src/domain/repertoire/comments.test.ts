import { describe, expect, it } from "vitest";
import { STARTER_PATHS } from "./starter-paths";

/**
 * Per-move pedagogy guard: every curated path carries a comment for EVERY move
 * (comments[i] explains moves[i]). A length mismatch silently shows the wrong
 * idea under the wrong move — fail the build instead.
 */
describe("per-move comments", () => {
  it("every path has exactly one comment per move", () => {
    for (const path of STARTER_PATHS) {
      expect(path.comments, `${path.id} has no comments`).toBeDefined();
      expect(path.comments!.length, `${path.id} comments/moves mismatch`).toBe(
        path.moves.length,
      );
      for (const c of path.comments!) {
        expect(c.trim().length, `${path.id} has an empty comment`).toBeGreaterThan(8);
      }
    }
  });
});
