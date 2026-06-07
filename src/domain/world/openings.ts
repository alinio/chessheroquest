/**
 * World node maps — opening metadata + map positions (% over the 9:16 world art).
 * SEED: only the Warrior world (Ember Marches) is laid out, and only the Italian
 * Game is the fully-playable seed opening; the rest are real openings shown as
 * locked/stub nodes.
 * TODO: lay out the other 3 worlds' node maps + make their openings playable (GDD §11).
 */
import type { Archetype } from "@/src/domain/style-quiz/types";
import type { Side } from "./types";

export interface WorldOpeningMeta {
  id: string;
  name: string;
  eco: string;
  side: Side;
  description: string;
  /** Position as % of the world map image (x left→right, y top→bottom). */
  pos: { x: number; y: number };
  /** The seed opening fully built end-to-end (Learn/Drill/Boss); others are stubs. */
  playable: boolean;
  /** Tile art if it exists in public/art/tiles; else a coded fallback is used. */
  tileArt?: string;
}

export const WARRIOR_OPENINGS: WorldOpeningMeta[] = [
  { id: "italian", name: "Italian Game", eco: "C50", side: "white", description: "Classical bishop to c4, fast development aimed at f7.", pos: { x: 30, y: 84 }, playable: true },
  { id: "kings-gambit", name: "King's Gambit", eco: "C30", side: "white", description: "Burn the f-pawn for a roaring attack.", pos: { x: 66, y: 67 }, playable: false, tileArt: "/art/tiles/tile-kingsgambit.png" },
  { id: "scotch", name: "Scotch Game", eco: "C45", side: "white", description: "Smash the centre open early.", pos: { x: 32, y: 51 }, playable: false, tileArt: "/art/tiles/tile-scotch.png" },
  { id: "smith-morra", name: "Smith-Morra Gambit", eco: "B21", side: "white", description: "Sacrifice a pawn to flood the open lines vs the Sicilian.", pos: { x: 66, y: 35 }, playable: false, tileArt: "/art/tiles/tile-morra.png" },
  { id: "sicilian-dragon", name: "Sicilian Dragon", eco: "B70", side: "black", description: "The fianchetto bishop is a dragon down the long diagonal.", pos: { x: 36, y: 21 }, playable: false },
];

export const WORLD_OPENINGS: Partial<Record<Archetype, WorldOpeningMeta[]>> = {
  warrior: WARRIOR_OPENINGS,
};

/** Kingdom Boss node position (% of the map), at the summit. */
export const WORLD_BOSS_POS: Partial<Record<Archetype, { x: number; y: number }>> = {
  warrior: { x: 50, y: 8 },
};
