/**
 * Demo fixtures for the DEV screen routes (/dev/screens/*). A fictional player so
 * the real screen components can render fully without auth/onboarding/stores.
 * DEV-ONLY — never imported by production flows.
 */
import type { Archetype, RealmId, OpeningId } from "@/src/lib/assets";

export interface OpeningPerf {
  name: string;
  games: number;
  winPct: number;
  trend: "up" | "down" | "flat";
}
export interface InsightsFixture {
  openingIq: number;
  topPercent: number;
  iqTrend: number[]; // ~12 recent points (0–1000)
  eloGoal: number;
  eloNow: number;
  accuracy: number;
  drillsThisWeek: number;
  cardsReviewed: number;
  connected: { platform: "lichess" | "chesscom"; username: string }[];
  openingPerf: OpeningPerf[]; // from synced real games
  weaknesses: { name: string; accuracy: number }[];
}

/** Demo analytics for /insights. */
export const DEMO_INSIGHTS: InsightsFixture = {
  openingIq: 742,
  topPercent: 12,
  iqTrend: [418, 442, 470, 503, 540, 561, 598, 630, 661, 690, 718, 742],
  eloGoal: 1500,
  eloNow: 1386,
  accuracy: 86,
  drillsThisWeek: 41,
  cardsReviewed: 312,
  connected: [{ platform: "lichess", username: "marc_1900" }],
  openingPerf: [
    { name: "Ruy Lopez", games: 64, winPct: 61, trend: "up" },
    { name: "Queen's Gambit", games: 38, winPct: 55, trend: "up" },
    { name: "English Opening", games: 21, winPct: 52, trend: "flat" },
    { name: "Sicilian Defense", games: 47, winPct: 41, trend: "down" },
  ],
  weaknesses: [
    { name: "Sicilian Defense", accuracy: 48 },
    { name: "French Defense", accuracy: 57 },
    { name: "Caro-Kann", accuracy: 63 },
  ],
};

export interface RealmEntry {
  id: RealmId;
  name: string;
  sub: string;
  archetype: Archetype;
  accent: string;
  sealed: number;
  total: number;
  current: boolean;
}
/** The 4 realms overview for /realms. */
export const DEMO_REALMS: RealmEntry[] = [
  { id: "ember-marches", name: "Ember Marches", sub: "Realm of the Warrior", archetype: "warrior", accent: "#e0413b", sealed: 2, total: 5, current: false },
  { id: "obsidian-court", name: "Obsidian Court", sub: "Realm of the Strategist", archetype: "strategist", accent: "#8a7bd8", sealed: 3, total: 5, current: true },
  { id: "aegis-bastion", name: "Aegis Bastion", sub: "Realm of the Defender", archetype: "defender", accent: "#4fb477", sealed: 1, total: 5, current: false },
  { id: "mirage-bazaar", name: "Mirage Bazaar", sub: "Realm of the Trickster", archetype: "trickster", accent: "#46c7d8", sealed: 0, total: 5, current: false },
];

export interface ProfileFixture {
  name: string;
  archetype: Archetype;
  archetypeName: string;
  realmName: string;
  openingIq: number;
  topPercent: number;
  rankElo: number;
  level: number;
  xp: number;
  xpNext: number;
  totalSeals: number;
  totalOpenings: number;
  streakRecord: number;
  strength: string;
  weakness: string;
  joined: string;
}

/** Demo profile for /profile. */
export const DEMO_PROFILE: ProfileFixture = {
  name: "Alex",
  archetype: "strategist",
  archetypeName: "The Strategist",
  realmName: "The Obsidian Court",
  openingIq: 742,
  topPercent: 12,
  rankElo: 1500,
  level: 14,
  xp: 2240,
  xpNext: 3000,
  totalSeals: 6,
  totalOpenings: 20,
  streakRecord: 23,
  strength: "Ruy Lopez",
  weakness: "Sicilian Defense",
  joined: "Apr 2026",
};

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
  best: "Ruy Lopez", // must match the live app's "strongest" (kills the DNA↔app contradiction)
  weakness: "Sicilian Defense",
  sample: true,
};
// NOTE: DNA iq/top% (428 / 57%) are the FIRST-TEST snapshot; Today shows the grown
// values (742 / 12%) — a time progression, not a contradiction. The strength/weakness
// opening must NOT differ, hence best = "Ruy Lopez" everywhere.
// TODO(real-data): derive DNA + Today + Arrival from ONE persisted result source.

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
