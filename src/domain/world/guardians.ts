/**
 * Opening Guardians (mini-bosses) — name/title/lore/taunt from the catalog (flavor;
 * truth is the curated lines + chess.js). Challenges are derived from the real
 * curated line tree (the player must play the correct moves from memory).
 *
 * TODO: full Guardian line set — Two Knights / Fried Liver tactics + Evans Gambit
 * deviation (catalog §1.1) pending curation (GDD §11). Seed = the main line.
 */
import { Chess } from "chess.js";
import { ITALIAN_TREE, mainLine, playerPlies } from "./italian";
import type { OpeningLineTree } from "./types";

export interface Guardian {
  openingId: string;
  name: string;
  title: string;
  lore: string;
  /** Authored taunt (catalog/GDD flavor — never LLM-generated). */
  taunt: string;
  art: string;
}

export const GUARDIANS: Record<string, Guardian> = {
  italian: {
    openingId: "italian",
    name: "Aldovrandi",
    title: "The Roman Edge",
    lore: "A Renaissance condottiero who duels with two crossed bishop-blades aimed at the king's throat.",
    taunt: "Your king's gate is f7 — and my blades already know the road.",
    art: "/art/bosses/boss-warrior-italian.png",
  },
};

export type Difficulty = "easy" | "medium" | "hard";

export const DIFFICULTY: Record<Difficulty, { label: string; mistakesAllowed: number; hints: boolean; validates: boolean; pro: boolean }> = {
  easy: { label: "Easy", mistakesAllowed: Number.POSITIVE_INFINITY, hints: true, validates: false, pro: false },
  medium: { label: "Medium", mistakesAllowed: 1, hints: false, validates: true, pro: false },
  hard: { label: "Hard", mistakesAllowed: 0, hints: false, validates: true, pro: true },
};

export interface Challenge {
  fenBefore: string;
  expectedSan: string;
  isCritical: boolean;
}

const START_FEN = new Chess().fen();

/** The fight = the player's moves in the curated line, played from memory. */
export function guardianChallenges(tree: OpeningLineTree): Challenge[] {
  const line = mainLine(tree);
  return playerPlies(tree).map((ply) => ({
    fenBefore: ply > 0 ? line[ply - 1]!.fen : START_FEN,
    expectedSan: line[ply]!.san,
    isCritical: Boolean(line[ply]!.isCritical),
  }));
}

export const GUARDIAN_TREES: Record<string, OpeningLineTree> = { italian: ITALIAN_TREE };
