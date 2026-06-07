/**
 * Archetype → World mapping + opening rosters (pure data, from opening-boss-
 * catalog.md §1–4 and the hero/world names). Shared by M4 (Road to Elo), M5
 * (Hero Select) and M6 (the world).
 *
 * TODO: rosters are catalog seed; confirm final per-hero rosters + line trees
 * (GDD §11 / catalog curation). Names are canonical; playable lines are M6+.
 */
import type { Archetype } from "@/src/domain/style-quiz/types";

export interface WorldOpening {
  id: string;
  name: string;
  eco: string;
}

export interface World {
  archetype: Archetype;
  /** World name, e.g. "The Ember Marches". */
  name: string;
  tagline: string;
  accentVar: string; // CSS var name in theme.css
  openings: WorldOpening[];
}

export const WORLDS: Record<Archetype, World> = {
  warrior: {
    archetype: "warrior",
    name: "The Ember Marches",
    tagline: "Attack relentlessly",
    accentVar: "--chq-warrior",
    openings: [
      { id: "italian", name: "Italian Game", eco: "C50" },
      { id: "kings-gambit", name: "King's Gambit", eco: "C30" },
      { id: "scotch", name: "Scotch Game", eco: "C45" },
      { id: "smith-morra", name: "Smith-Morra Gambit", eco: "B21" },
      { id: "sicilian-dragon", name: "Sicilian Dragon", eco: "B70" },
    ],
  },
  strategist: {
    archetype: "strategist",
    name: "The Obsidian Court",
    tagline: "Outmaneuver, then crush",
    accentVar: "--chq-strategist",
    openings: [
      { id: "ruy-lopez", name: "Ruy Lopez", eco: "C60" },
      { id: "queens-gambit", name: "Queen's Gambit", eco: "D06" },
      { id: "nimzo-indian", name: "Nimzo-Indian", eco: "E20" },
      { id: "catalan", name: "Catalan", eco: "E00" },
      { id: "english", name: "English Opening", eco: "A10" },
    ],
  },
  defender: {
    archetype: "defender",
    name: "The Aegis Bastion",
    tagline: "Unbreakable & patient",
    accentVar: "--chq-defender",
    openings: [
      { id: "london", name: "London System", eco: "D02" },
      { id: "french", name: "French Defense", eco: "C00" },
      { id: "slav", name: "Slav Defense", eco: "D10" },
      { id: "petroff", name: "Petroff Defense", eco: "C42" },
      { id: "caro-kann", name: "Caro-Kann Defense", eco: "B10" },
    ],
  },
  trickster: {
    archetype: "trickster",
    name: "The Mirage Bazaar",
    tagline: "Surprise & bewilder",
    accentVar: "--chq-trickster",
    openings: [
      { id: "scandinavian", name: "Scandinavian Defense", eco: "B01" },
      { id: "budapest", name: "Budapest Gambit", eco: "A52" },
      { id: "stafford", name: "Stafford Gambit", eco: "C42" },
      { id: "blackmar-diemer", name: "Blackmar-Diemer Gambit", eco: "D00" },
      { id: "englund", name: "Englund Gambit", eco: "A40" },
    ],
  },
};
