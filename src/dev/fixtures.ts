/**
 * Demo fixtures for the DEV screen routes (/dev/screens/*). A fictional player so
 * the real screen components can render fully without auth/onboarding/stores.
 * DEV-ONLY — never imported by production flows.
 */
import type { Archetype, RealmId, OpeningId } from "@/src/lib/assets";

export interface ArrivalFixture {
  archetype: Archetype;
  archetypeName: string;
  iq: number;
  topPercent: number;
  strength: string;
  weakness: string;
  strengthId: OpeningId;
}

/** One-time post-payment arrival/orientation (P0 from the UX audit). */
export const DEMO_ARRIVAL: ArrivalFixture = {
  archetype: "strategist",
  archetypeName: "Strategist",
  iq: 742,
  topPercent: 12,
  strength: "Ruy Lopez",
  weakness: "Sicilian Defense",
  strengthId: "ruy-lopez",
};

export interface QuestNode {
  id: OpeningId;
  name: string;
  state: "conquered" | "available" | "locked";
  x: number; // % left
  y: number; // % top
}
export interface QuestMapFixture {
  realm: RealmId;
  realmName: string;
  realmSub: string;
  nodes: QuestNode[];
  bossName: string;
  bossX: number;
  bossY: number;
  conquered: number;
  total: number;
  continueId: OpeningId;
}

/** Demo Quest Map — Ember Marches (Warrior). Positions from mockup-hub-rpg.html. */
export const DEMO_QUEST: QuestMapFixture = {
  realm: "ember-marches",
  realmName: "Ember Marches",
  realmSub: "Realm of the Warrior",
  nodes: [
    { id: "italian", name: "Italian Game", state: "conquered", x: 12, y: 86 },
    { id: "scotch", name: "Scotch Game", state: "available", x: 28, y: 74 },
    { id: "kings-gambit", name: "King's Gambit", state: "locked", x: 48, y: 67 },
    { id: "smith-morra", name: "Smith-Morra Gambit", state: "locked", x: 36, y: 48 },
    { id: "sicilian-dragon", name: "Sicilian Dragon", state: "locked", x: 60, y: 41 },
  ],
  bossName: "Ignar",
  bossX: 50,
  bossY: 14,
  conquered: 1,
  total: 5,
  continueId: "scotch",
};

export interface BossFixture {
  name: string;
  subtitle: string;
  description: string;
  taunt: string;
  realm: RealmId;
  opening: string;
}

export interface DnaFixture {
  archetype: Archetype;
  archetypeName: string;
  iq: number;
  topPercent: number;
  matchPercent: number;
  traits: [string, string];
  best: string;
  weakness: string;
  sample: boolean;
}

/** Demo DNA reveal (S2) — The Strategist. */
export const DEMO_DNA: DnaFixture = {
  archetype: "strategist",
  archetypeName: "THE STRATEGIST",
  iq: 428,
  topPercent: 57,
  matchPercent: 78,
  traits: ["You build up before you strike", "You prize a small, lasting edge"],
  best: "Italian Game",
  weakness: "Sicilian Defense",
  sample: true,
};

/** Demo boss for /dev/screens/boss-fight (Aldovrandi · Ember Marches). */
export const DEMO_BOSS: BossFixture = {
  name: "Aldovrandi",
  subtitle: "The Roman Edge",
  description: "A Renaissance condottiero who duels with two crossed bishop-blades aimed at the king's throat.",
  taunt: "Your king's gate is f7 — and my blades already know the road.",
  realm: "ember-marches",
  opening: "Italian Game",
};

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
    { id: "sicilian-dragon", name: "Sicilian Dragon", mastered: true },
    { id: "london", name: "London System", mastered: true },
    { id: "french", name: "French Defense", mastered: false },
    { id: "slav", name: "Slav Defense", mastered: false },
    { id: "petroff", name: "Petroff Defense", mastered: false },
    { id: "caro-kann", name: "Caro-Kann", mastered: false },
    { id: "scandinavian", name: "Scandinavian", mastered: false },
    { id: "budapest", name: "Budapest Gambit", mastered: false },
    { id: "stafford", name: "Stafford Gambit", mastered: false },
    { id: "blackmar-diemer", name: "Blackmar-Diemer", mastered: false },
    { id: "englund", name: "Englund Gambit", mastered: false },
  ],
};
