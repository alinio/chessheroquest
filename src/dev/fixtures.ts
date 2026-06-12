/**
 * Demo fixtures for the DEV screen routes (/dev/screens/*). A fictional player so
 * the real screen components can render fully without auth/onboarding/stores.
 * DEV-ONLY — never imported by production flows.
 */
import { OPENING_NAMES, type Archetype, type RealmId, type OpeningId } from "@/src/lib/assets";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { fenAfter, moveSquaresAt } from "@/src/domain/repertoire/line";
import { KINGDOM_BOSSES, PATH_SIDE } from "@/src/domain/world/guardians";
import { OPENING_TO_PATH, OPENING_LINES, realmOpeningIds } from "@/src/lib/opening-paths";

/** Demo analytics for /dev/screens/insights (mirrors InsightsData in InsightsScreen). */
export const DEMO_INSIGHTS = {
  openingIq: 742,
  iqDelta: 324,
  iqTrend: [418, 442, 470, 503, 540, 561, 598, 630, 661, 690, 718, 742],
  eloGoal: 1500,
  roadPct: 100,
  projectedGain: 186,
  accuracy: 86 as number | null,
  drillsThisWeek: 41,
  cardsReviewed: 312,
  weaknesses: [
    { name: "Sicilian Dragon", state: "leak" as const, studied: 2, total: 5 },
    { name: "French Defense — Classical", state: "review" as const, studied: 4, total: 5 },
    { name: "Caro-Kann Defense — Classical", state: "solid" as const, studied: 5, total: 5 },
  ],
};

/** Tabiya preview of the realm's next unsealed opening (real fenAfter, LAW #2). */
export interface RealmNextLine {
  openingName: string;
  fen: string;
  orientation: "white" | "black";
  lastMove: { from: string; to: string } | null;
}
export interface RealmEntry {
  id: RealmId;
  name: string;
  sub: string;
  archetype: Archetype;
  accent: string;
  sealed: number;
  total: number;
  current: boolean;
  /** First unsealed opening's tabiya — null when the realm is fully sealed. */
  next?: RealmNextLine | null;
  /** Realm Boss name (KINGDOM_BOSSES — authored, never invented). */
  bossName?: string;
}

/** Demo "next opening" = the realm's opening at index `sealed` (registry order). */
function demoRealmNext(realm: RealmId, sealed: number): RealmNextLine | null {
  const id = realmOpeningIds(realm)[sealed];
  const pathId = id ? OPENING_TO_PATH[id] : null;
  const path = pathId ? STARTER_PATHS.find((p) => p.id === pathId) : undefined;
  if (!id || !path || path.moves.length === 0) return null;
  return {
    openingName: OPENING_NAMES[id],
    fen: fenAfter(path, path.moves.length),
    orientation: PATH_SIDE[path.id] ?? "white",
    lastMove: moveSquaresAt(path, path.moves.length - 1),
  };
}

/** The 4 realms overview for /realms. */
export const DEMO_REALMS: RealmEntry[] = [
  { id: "ember-marches", name: "Ember Marches", sub: "Realm of the Warrior", archetype: "warrior", accent: "#e0413b", sealed: 2, total: 5, current: false, next: demoRealmNext("ember-marches", 2), bossName: KINGDOM_BOSSES["ember-marches"]?.name },
  { id: "obsidian-court", name: "Obsidian Court", sub: "Realm of the Strategist", archetype: "strategist", accent: "#8a7bd8", sealed: 3, total: 5, current: true, next: demoRealmNext("obsidian-court", 3), bossName: KINGDOM_BOSSES["obsidian-court"]?.name },
  { id: "aegis-bastion", name: "Aegis Bastion", sub: "Realm of the Defender", archetype: "defender", accent: "#4fb477", sealed: 1, total: 5, current: false, next: demoRealmNext("aegis-bastion", 1), bossName: KINGDOM_BOSSES["aegis-bastion"]?.name },
  { id: "mirage-bazaar", name: "Mirage Bazaar", sub: "Realm of the Trickster", archetype: "trickster", accent: "#46c7d8", sealed: 5, total: 5, current: false, next: null, bossName: KINGDOM_BOSSES["mirage-bazaar"]?.name },
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
  strengthWin: number;
  weakness: string;
  weaknessLine: string;
  weaknessWin: number;
  weakFen: string;
  weakOrientation: "white" | "black";
  firstSessionLines: number;
  firstSessionMin: number;
  strengthId: OpeningId;
  weaknessId: OpeningId;
}

/** One-time post-payment arrival — the coach's diagnosis (board + plan). */
export const DEMO_ARRIVAL: ArrivalFixture = {
  archetype: "strategist",
  archetypeName: "Strategist",
  iq: 742,
  topPercent: 12,
  strength: "Ruy Lopez",
  strengthWin: 61,
  weakness: "Sicilian Defense",
  weaknessLine: "Dragon · Yugoslav Attack",
  weaknessWin: 41,
  // 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6 — White to play vs the Dragon.
  weakFen: "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6",
  weakOrientation: "white",
  firstSessionLines: 3,
  firstSessionMin: 6,
  strengthId: "ruy-lopez",
  weaknessId: "sicilian-dragon",
};

export interface QuestNode {
  id: OpeningId;
  name: string;
  state: "conquered" | "available" | "locked";
  x: number; // % left
  y: number; // % top
  /** Curated mainline id (training routes) — null when not curated yet. */
  pathId?: string | null;
  /** Lines at gold / total curated lines of this opening. */
  linesDone?: number;
  linesTotal?: number;
  /** The line's tabiya (fenAfter over the full curated mainline). */
  tabiyaFen?: string | null;
  side?: "white" | "black";
  lastMove?: { from: string; to: string } | null;
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

/** Dossier data for a quest node — REAL tabiya via fenAfter (LAW #2). */
function nodeDossier(id: OpeningId, linesDone = 0) {
  const pathId = OPENING_TO_PATH[id] ?? null;
  const path = pathId ? STARTER_PATHS.find((p) => p.id === pathId) : undefined;
  return {
    pathId,
    linesDone,
    linesTotal: OPENING_LINES[id]?.length ?? 0,
    tabiyaFen: path ? fenAfter(path, path.moves.length) : null,
    side: path ? (PATH_SIDE[path.id] ?? ("white" as const)) : ("white" as const),
    lastMove: path ? moveSquaresAt(path, path.moves.length - 1) : null,
  };
}

/** Demo Quest Map — Ember Marches (Warrior). Positions from mockup-hub-rpg.html. */
export const DEMO_QUEST: QuestMapFixture = {
  realm: "ember-marches",
  realmName: "Ember Marches",
  realmSub: "Realm of the Warrior",
  nodes: [
    { id: "italian", name: "Italian Game", state: "conquered", x: 12, y: 86, ...nodeDossier("italian", 3) },
    { id: "scotch", name: "Scotch Game", state: "available", x: 28, y: 74, ...nodeDossier("scotch") },
    { id: "kings-gambit", name: "King's Gambit", state: "locked", x: 48, y: 67, ...nodeDossier("kings-gambit") },
    { id: "smith-morra", name: "Smith-Morra Gambit", state: "locked", x: 36, y: 48, ...nodeDossier("smith-morra") },
    { id: "sicilian-dragon", name: "Sicilian Dragon", state: "locked", x: 60, y: 41, ...nodeDossier("sicilian-dragon") },
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

/** Demo cockpit data for /dev/screens/today (mirrors TodayData in TodayScreen). */
/* Demo boards derive from the REAL curated paths via fenAfter (LAW #2 — even
   fixtures never hand-write a position). */
const demoDuePath = STARTER_PATHS.find((p) => p.id === "sicilian-dragon")!;
const demoBossPath = STARTER_PATHS.find((p) => p.id === "queens-gambit-declined")!;
const demoTabiya = (p: typeof demoDuePath) => ({
  fen: fenAfter(p, p.moves.length),
  orientation: PATH_SIDE[p.id] ?? ("white" as const),
  lastMove: moveSquaresAt(p, p.moves.length - 1),
});

export const DEMO_TODAY = {
  streakDays: 7,
  xp: 2240,
  dueDrills: 8,
  eloGoal: 1500,
  eloPct: 74,
  strongest: "Ruy Lopez" as string | null,
  recommended: { slug: "queens-gambit-declined", name: "Queen's Gambit Declined" },
  weakest: { slug: "sicilian-dragon", name: "Sicilian Dragon" },
  // the day's board: a mid-line due card from the weakest line
  dueFen: fenAfter(demoDuePath, 5),
  dueOrientation: PATH_SIDE[demoDuePath.id] ?? ("white" as const),
  dueLineName: demoDuePath.name,
  dueLastMove: moveSquaresAt(demoDuePath, 4),
  weaknessBoard: demoTabiya(demoDuePath),
  bossBoard: demoTabiya(demoBossPath),
};

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
