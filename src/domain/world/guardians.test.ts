import { describe, expect, it } from "vitest";
import { Chess } from "chess.js";
import { GUARDIANS, KINGDOM_BOSSES, PATH_SIDE, pathChallenges } from "./guardians";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { ASSETS } from "@/src/lib/assets";
import { OPENING_TO_PATH, PATH_TO_OPENING } from "@/src/lib/opening-paths";

describe("guardian roster", () => {
  it("names a Guardian for every opening in the registry", () => {
    for (const openingId of Object.keys(ASSETS.openings)) {
      expect(GUARDIANS[openingId], `missing guardian for ${openingId}`).toBeDefined();
    }
  });

  it("names a Kingdom Boss for every realm", () => {
    for (const realm of ["ember-marches", "obsidian-court", "aegis-bastion", "mirage-bazaar"]) {
      expect(KINGDOM_BOSSES[realm], `missing kingdom boss for ${realm}`).toBeDefined();
    }
  });

  it("assigns a side to every curated path", () => {
    for (const path of STARTER_PATHS) {
      expect(PATH_SIDE[path.id], `missing side for ${path.id}`).toMatch(/^(white|black)$/);
    }
  });

  it("maps every opening to a curated path, and back", () => {
    for (const openingId of Object.keys(ASSETS.openings)) {
      const pathId = OPENING_TO_PATH[openingId as keyof typeof OPENING_TO_PATH];
      expect(pathId, `no path for ${openingId}`).toBeDefined();
      expect(STARTER_PATHS.some((p) => p.id === pathId), `unknown path ${pathId}`).toBe(true);
    }
    for (const path of STARTER_PATHS) {
      expect(PATH_TO_OPENING[path.id], `no opening for path ${path.id}`).toBeDefined();
    }
  });
});

describe("pathChallenges", () => {
  it("yields exactly the player's plies, with legal expected moves", () => {
    for (const path of STARTER_PATHS) {
      const side = PATH_SIDE[path.id]!;
      const mine = side === "white" ? 0 : 1;
      const challenges = pathChallenges(path, side);

      expect(challenges.length).toBe(
        path.moves.filter((_, ply) => ply % 2 === mine).length,
      );
      for (const c of challenges) {
        expect(c.ply % 2).toBe(mine);
        // The expected SAN must be legal from fenBefore (chess.js = truth).
        const game = new Chess(c.fenBefore);
        expect(() => game.move(c.expectedSan), `${path.id} ply ${c.ply}`).not.toThrow();
      }
    }
  });
});
