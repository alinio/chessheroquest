/**
 * ChessHeroQuest asset registry (docs/visual-assets.md). The SINGLE source of
 * every asset path — components import from here, NEVER hard-code "/assets/…".
 *
 * Model: 4 REALMS (one boss each) + 20 OPENINGS (banner + emblem, each belongs to
 * a realm). A realm's Boss Fight uses getRealmBoss(getOpeningRealm(opening)).
 * Until a real file is dropped at a path, render PLACEHOLDER (gray) as a fallback.
 * We never generate the artwork here.
 */
const BASE = "/assets";
const O = `${BASE}/openings`;

/** Gray stand-in shown until a real asset file is placed. */
export const PLACEHOLDER = `${BASE}/_placeholder.svg`;

export type Archetype = "warrior" | "strategist" | "defender" | "trickster";
/** Quest-map medallion states. */
export type NodeState = "active" | "completed" | "locked" | "boss";
/** Rank insignia tiers (Road-to-Elo milestones). */
export type RankTier = 1000 | 1200 | 1500 | 1800;
/** The four realms (archetype territories). */
export type RealmId = "ember-marches" | "obsidian-court" | "aegis-bastion" | "mirage-bazaar";

export const ASSETS = {
  brand: {
    ogImage: `${BASE}/brand/og-image.png`,
    appIcon: `${BASE}/brand/app-icon.png`,
  },
  archetypes: {
    // Reusing the landing's canon archetype art + crests (no separate drop needed).
    portrait: {
      warrior: "/landing/archetype-warrior.png",
      strategist: "/landing/archetype-strategist.png",
      defender: "/landing/archetype-defender.png",
      trickster: "/landing/archetype-trickster.png",
    } as Record<Archetype, string>,
    sigil: {
      warrior: "/landing/crest-warrior.png",
      strategist: "/landing/crest-strategist.png",
      defender: "/landing/crest-defender.png",
      trickster: "/landing/crest-trickster.png",
    } as Record<Archetype, string>,
  },
  backgrounds: {
    questMap: `${BASE}/backgrounds/quest-map-bg.webp`,
    today: `${BASE}/backgrounds/today-hero-bg.webp`,
    dnaTest: `${BASE}/backgrounds/dna-test-bg.webp`,
    resultsReveal: `${BASE}/backgrounds/results-reveal-bg.webp`,
    bossArena: `${BASE}/backgrounds/boss-arena-bg.webp`,
  },
  textures: {
    obsidian: `${BASE}/textures/obsidian.webp`,
    parchment: `${BASE}/textures/parchment.webp`,
  },
  nodes: {
    active: `${BASE}/nodes/node-active.png`,
    completed: `${BASE}/nodes/node-completed.png`,
    locked: `${BASE}/nodes/node-locked.png`,
    boss: `${BASE}/nodes/node-boss.png`,
  } as Record<NodeState, string>,
  dnaCard: {
    frame: `${BASE}/dna-card/frame.png`,
    weeklyReportFrame: `${BASE}/dna-card/weekly-report-frame.png`,
  },
  coach: {
    mentor: `${BASE}/coach/mentor.png`,
  },
  badges: {
    ranks: {
      1000: `${BASE}/badges/rank-1000.png`,
      1200: `${BASE}/badges/rank-1200.png`,
      1500: `${BASE}/badges/rank-1500.png`,
      1800: `${BASE}/badges/rank-1800.png`,
    } as Record<RankTier, string>,
    masterySeal: `${BASE}/passport/stamp-mastered.png`, // mastery seal = the mastered stamp
  },
  passport: {
    cover: `${BASE}/passport/cover.webp`,
    stampMastered: `${BASE}/passport/stamp-mastered.png`,
    stampLocked: `${BASE}/passport/stamp-locked.png`,
  },
  realms: {
    // Reusing the landing's Guardian art for now (drop realms/<realm>/boss.png to override).
    "ember-marches": { boss: "/landing/scene-guardian-poster.jpg" },
    "obsidian-court": { boss: "/landing/scene-guardian-poster.jpg" },
    "aegis-bastion": { boss: "/landing/scene-guardian-poster.jpg" },
    "mirage-bazaar": { boss: "/landing/scene-guardian-poster.jpg" },
  } as Record<RealmId, { boss: string }>,
  // 20 openings (5 per realm). Sicilian Dragon's art lives in the `sicilian` folder.
  openings: {
    italian: { banner: `${O}/italian/banner.webp`, emblem: `${O}/italian/emblem.png`, realm: "ember-marches" },
    "kings-gambit": { banner: `${O}/kings-gambit/banner.webp`, emblem: `${O}/kings-gambit/emblem.png`, realm: "ember-marches" },
    scotch: { banner: `${O}/scotch/banner.webp`, emblem: `${O}/scotch/emblem.png`, realm: "ember-marches" },
    "smith-morra": { banner: `${O}/smith-morra/banner.webp`, emblem: `${O}/smith-morra/emblem.png`, realm: "ember-marches" },
    "sicilian-dragon": { banner: `${O}/sicilian/banner.webp`, emblem: `${O}/sicilian/emblem.png`, realm: "ember-marches" },
    "ruy-lopez": { banner: `${O}/ruy-lopez/banner.webp`, emblem: `${O}/ruy-lopez/emblem.png`, realm: "obsidian-court" },
    "queens-gambit": { banner: `${O}/queens-gambit/banner.webp`, emblem: `${O}/queens-gambit/emblem.png`, realm: "obsidian-court" },
    "nimzo-indian": { banner: `${O}/nimzo-indian/banner.webp`, emblem: `${O}/nimzo-indian/emblem.png`, realm: "obsidian-court" },
    catalan: { banner: `${O}/catalan/banner.webp`, emblem: `${O}/catalan/emblem.png`, realm: "obsidian-court" },
    english: { banner: `${O}/english/banner.webp`, emblem: `${O}/english/emblem.png`, realm: "obsidian-court" },
    london: { banner: `${O}/london/banner.webp`, emblem: `${O}/london/emblem.png`, realm: "aegis-bastion" },
    french: { banner: `${O}/french/banner.webp`, emblem: `${O}/french/emblem.png`, realm: "aegis-bastion" },
    slav: { banner: `${O}/slav/banner.webp`, emblem: `${O}/slav/emblem.png`, realm: "aegis-bastion" },
    petroff: { banner: `${O}/petroff/banner.webp`, emblem: `${O}/petroff/emblem.png`, realm: "aegis-bastion" },
    "caro-kann": { banner: `${O}/caro-kann/banner.webp`, emblem: `${O}/caro-kann/emblem.png`, realm: "aegis-bastion" },
    scandinavian: { banner: `${O}/scandinavian/banner.webp`, emblem: `${O}/scandinavian/emblem.png`, realm: "mirage-bazaar" },
    budapest: { banner: `${O}/budapest/banner.webp`, emblem: `${O}/budapest/emblem.png`, realm: "mirage-bazaar" },
    stafford: { banner: `${O}/stafford/banner.webp`, emblem: `${O}/stafford/emblem.png`, realm: "mirage-bazaar" },
    "blackmar-diemer": { banner: `${O}/blackmar-diemer/banner.webp`, emblem: `${O}/blackmar-diemer/emblem.png`, realm: "mirage-bazaar" },
    englund: { banner: `${O}/englund/banner.webp`, emblem: `${O}/englund/emblem.png`, realm: "mirage-bazaar" },
  } satisfies Record<string, { banner: string; emblem: string; realm: RealmId }>,
} as const;

export type OpeningId = keyof typeof ASSETS.openings;

export const REALM_NAMES: Record<RealmId, string> = {
  "ember-marches": "The Ember Marches",
  "obsidian-court": "The Obsidian Court",
  "aegis-bastion": "The Aegis Bastion",
  "mirage-bazaar": "The Mirage Bazaar",
};

/** Canonical display names per opening (matches the mockups). */
export const OPENING_NAMES: Record<OpeningId, string> = {
  italian: "Italian Game",
  "kings-gambit": "King's Gambit",
  scotch: "Scotch Game",
  "smith-morra": "Smith-Morra Gambit",
  "sicilian-dragon": "Sicilian Dragon",
  "ruy-lopez": "Ruy Lopez",
  "queens-gambit": "Queen's Gambit",
  "nimzo-indian": "Nimzo-Indian",
  catalan: "Catalan",
  english: "English Opening",
  london: "London System",
  french: "French Defense",
  slav: "Slav Defense",
  petroff: "Petroff Defense",
  "caro-kann": "Caro-Kann",
  scandinavian: "Scandinavian",
  budapest: "Budapest Gambit",
  stafford: "Stafford Gambit",
  "blackmar-diemer": "Blackmar-Diemer",
  englund: "Englund Gambit",
};

/** Quest-map medallion for a node state. */
export function getNodeArt(state: NodeState): string {
  return ASSETS.nodes[state];
}

/** Archetype portrait (DNA Results, Profile, DNA Card). */
export function getArchetypeArt(id: Archetype): string {
  return ASSETS.archetypes.portrait[id];
}
/** Archetype sigil/medallion badge. */
export function getArchetypeSigil(id: Archetype): string {
  return ASSETS.archetypes.sigil[id];
}

/** Rank insignia for an Elo / Road-to-Elo goal (nearest tier ≤ value). */
export function getRankInsignia(elo: number): string {
  const tier: RankTier = elo >= 1800 ? 1800 : elo >= 1500 ? 1500 : elo >= 1200 ? 1200 : 1000;
  return ASSETS.badges.ranks[tier];
}

/** Opening banner + emblem (Opening detail S7, Quest Map node). */
export function getOpeningArt(id: OpeningId): { banner: string; emblem: string } | null {
  const o = ASSETS.openings[id];
  return o ? { banner: o.banner, emblem: o.emblem } : null;
}

/** Which realm an opening belongs to. */
export function getOpeningRealm(id: OpeningId): RealmId | null {
  return ASSETS.openings[id]?.realm ?? null;
}

/** The boss art for a realm (the Boss Fight of any opening in that realm). */
export function getRealmBoss(realmId: RealmId): string {
  return ASSETS.realms[realmId].boss;
}
