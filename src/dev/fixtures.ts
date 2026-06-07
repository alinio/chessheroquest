/**
 * Demo fixtures for the DEV screen routes (/dev/screens/*). A fictional player so
 * the real screen components can render fully without auth/onboarding/stores.
 * DEV-ONLY — never imported by production flows.
 */
import type { Archetype, RealmId, OpeningId } from "@/src/lib/assets";

export interface DemoOpening {
  id: OpeningId;
  name: string;
  mastered: boolean;
}

export interface DemoPlayer {
  name: string;
  archetype: Archetype;
  realm: RealmId;
  openingIq: number;
  topPercent: number;
  streakDays: number;
  xpToday: number;
  goalDone: number;
  goalTarget: number;
  dueDrills: number;
  cardsReviewed: number;
  accuracy: number;
  eloGoal: number;
  strongest: string;
  weakness: string;
  recommended: { id: OpeningId; name: string };
  openings: DemoOpening[];
}

export const DEMO_PLAYER: DemoPlayer = {
  name: "Alex",
  archetype: "strategist",
  realm: "obsidian-court",
  openingIq: 742,
  topPercent: 12,
  streakDays: 7,
  xpToday: 120,
  goalDone: 12,
  goalTarget: 20,
  dueDrills: 8,
  cardsReviewed: 34,
  accuracy: 86,
  eloGoal: 1500,
  strongest: "Ruy Lopez",
  weakness: "Sicilian Dragon",
  recommended: { id: "ruy-lopez", name: "Ruy Lopez" },
  openings: [
    { id: "ruy-lopez", name: "Ruy Lopez", mastered: true },
    { id: "queens-gambit", name: "Queen's Gambit", mastered: true },
    { id: "nimzo-indian", name: "Nimzo-Indian", mastered: false },
    { id: "catalan", name: "Catalan", mastered: false },
    { id: "english", name: "English Opening", mastered: true },
    { id: "italian", name: "Italian Game", mastered: true },
    { id: "kings-gambit", name: "King's Gambit", mastered: false },
    { id: "scotch", name: "Scotch Game", mastered: false },
    { id: "smith-morra", name: "Smith-Morra Gambit", mastered: false },
    { id: "sicilian-dragon", name: "Sicilian Dragon", mastered: false },
    { id: "london", name: "London System", mastered: true },
    { id: "french", name: "French Defense", mastered: false },
    { id: "slav", name: "Slav Defense", mastered: false },
    { id: "petroff", name: "Petroff Defense", mastered: false },
    { id: "caro-kann", name: "Caro-Kann Defense", mastered: true },
    { id: "scandinavian", name: "Scandinavian Defense", mastered: false },
    { id: "budapest", name: "Budapest Gambit", mastered: false },
    { id: "stafford", name: "Stafford Gambit", mastered: false },
    { id: "blackmar-diemer", name: "Blackmar-Diemer Gambit", mastered: false },
    { id: "englund", name: "Englund Gambit", mastered: false },
  ],
};
