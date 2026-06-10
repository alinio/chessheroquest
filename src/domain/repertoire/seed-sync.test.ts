/**
 * Anti-drift guard: scripts/seed-openings.mjs MIRRORS STARTER_PATHS (it can't
 * import TS). If a curated path is added or its moves change without updating
 * the seed, drills for that line silently fail to persist (upsertCardReview
 * no-ops on unseeded FENs). This test fails the build instead.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { STARTER_PATHS } from "./starter-paths";

const seedSource = readFileSync(
  join(process.cwd(), "scripts", "seed-openings.mjs"),
  "utf8",
);

function seedMovesFor(slug: string): string[] | null {
  const line = seedSource
    .split("\n")
    .find((l) => l.includes(`slug: "${slug}"`));
  if (!line) return null;
  const m = line.match(/moves:\s*\[([^\]]*)\]/);
  if (!m) return null;
  return m[1]!.split(",").map((s) => s.trim().replace(/^"|"$/g, ""));
}

describe("seed-openings.mjs mirrors STARTER_PATHS", () => {
  it("contains every curated path with identical moves", () => {
    for (const path of STARTER_PATHS) {
      const seeded = seedMovesFor(path.id);
      expect(seeded, `path "${path.id}" missing from seed-openings.mjs`).not.toBeNull();
      expect(seeded, `moves drift for "${path.id}"`).toEqual(path.moves);
    }
  });
});
