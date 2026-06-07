/**
 * Archetype → World mapping + opening rosters (pure data, from opening-boss-
 * catalog.md §1–4 and the hero/world names). Shared by M4 (Road to Elo), M5
 * (Hero Select) and M6 (the world). `variations` = the real named-variation count
 * per opening from the catalog (what the player will train through).
 *
 * TODO: rosters are catalog seed; confirm final per-hero rosters + line trees (§11).
 */
import type { Archetype } from "@/src/domain/style-quiz/types";

export interface WorldOpening {
  id: string;
  name: string;
  eco: string;
  /** Number of named variations in the catalog. */
  variations: number;
}

export interface World {
  archetype: Archetype;
  name: string;
  tagline: string;
  accentVar: string;
  openings: WorldOpening[];
}

export const WORLDS: Record<Archetype, World> = {
  warrior: {
    archetype: "warrior",
    name: "The Ember Marches",
    tagline: "Attack relentlessly",
    accentVar: "--chq-warrior",
    openings: [
      { id: "italian", name: "Italian Game", eco: "C50", variations: 8 },
      { id: "kings-gambit", name: "King's Gambit", eco: "C30", variations: 9 },
      { id: "scotch", name: "Scotch Game", eco: "C45", variations: 5 },
      { id: "smith-morra", name: "Smith-Morra Gambit", eco: "B21", variations: 5 },
      { id: "sicilian-dragon", name: "Sicilian Dragon", eco: "B70", variations: 5 },
    ],
  },
  strategist: {
    archetype: "strategist",
    name: "The Obsidian Court",
    tagline: "Outmaneuver, then crush",
    accentVar: "--chq-strategist",
    openings: [
      { id: "ruy-lopez", name: "Ruy Lopez", eco: "C60", variations: 11 },
      { id: "queens-gambit", name: "Queen's Gambit", eco: "D06", variations: 10 },
      { id: "nimzo-indian", name: "Nimzo-Indian", eco: "E20", variations: 7 },
      { id: "catalan", name: "Catalan", eco: "E00", variations: 2 },
      { id: "english", name: "English Opening", eco: "A10", variations: 7 },
    ],
  },
  defender: {
    archetype: "defender",
    name: "The Aegis Bastion",
    tagline: "Unbreakable & patient",
    accentVar: "--chq-defender",
    openings: [
      { id: "london", name: "London System", eco: "D02", variations: 3 },
      { id: "french", name: "French Defense", eco: "C00", variations: 8 },
      { id: "slav", name: "Slav Defense", eco: "D10", variations: 6 },
      { id: "petroff", name: "Petroff Defense", eco: "C42", variations: 5 },
      { id: "caro-kann", name: "Caro-Kann Defense", eco: "B10", variations: 8 },
    ],
  },
  trickster: {
    archetype: "trickster",
    name: "The Mirage Bazaar",
    tagline: "Surprise & bewilder",
    accentVar: "--chq-trickster",
    openings: [
      { id: "scandinavian", name: "Scandinavian Defense", eco: "B01", variations: 6 },
      { id: "budapest", name: "Budapest Gambit", eco: "A52", variations: 4 },
      { id: "stafford", name: "Stafford Gambit", eco: "C42", variations: 3 },
      { id: "blackmar-diemer", name: "Blackmar-Diemer Gambit", eco: "D00", variations: 5 },
      { id: "englund", name: "Englund Gambit", eco: "A40", variations: 5 },
    ],
  },
};
