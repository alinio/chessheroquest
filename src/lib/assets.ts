/**
 * ChessHeroQuest asset registry (docs/visual-assets.md). The SINGLE source of
 * every asset path — components import from here, NEVER hard-code "/assets/…".
 *
 * Until a real file is dropped at a path, render PLACEHOLDER (gray) as a fallback
 * (e.g. <img onError>). We never generate the artwork here.
 */
const BASE = "/assets";

/** Gray stand-in shown until a real asset file is placed. */
export const PLACEHOLDER = `${BASE}/_placeholder.svg`;

export type Archetype = "warrior" | "strategist" | "defender" | "trickster";
/** Quest-map medallion states. */
export type NodeState = "active" | "completed" | "locked" | "boss";
/** Rank insignia tiers (Road-to-Elo milestones). */
export type RankTier = 1000 | 1200 | 1500 | 1800;

export const ASSETS = {
  brand: {
    ogImage: `${BASE}/brand/og-image.png`,
    appIcon: `${BASE}/brand/app-icon.png`,
  },
  archetypes: {
    portrait: {
      warrior: `${BASE}/archetypes/warrior-portrait.png`,
      strategist: `${BASE}/archetypes/strategist-portrait.png`,
      defender: `${BASE}/archetypes/defender-portrait.png`,
      trickster: `${BASE}/archetypes/trickster-portrait.png`,
    } as Record<Archetype, string>,
    sigil: {
      warrior: `${BASE}/archetypes/sigil-warrior.png`,
      strategist: `${BASE}/archetypes/sigil-strategist.png`,
      defender: `${BASE}/archetypes/sigil-defender.png`,
      trickster: `${BASE}/archetypes/sigil-trickster.png`,
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
    masterySeal: `${BASE}/badges/mastery-seal.png`,
  },
  passport: {
    cover: `${BASE}/passport/cover.webp`,
    stampMastered: `${BASE}/passport/stamp-mastered.png`,
    stampLocked: `${BASE}/passport/stamp-locked.png`,
  },
} as const;

/** Quest-map medallion for a node state. */
export function getNodeArt(state: NodeState): string {
  return ASSETS.nodes[state];
}

/** Archetype portrait (DNA Results, Profile, DNA Card). */
export function getArchetypeArt(id: Archetype): string {
  return ASSETS.archetypes.portrait[id];
}

/** Archetype sigil/medallion badge (nav, cards, small). */
export function getArchetypeSigil(id: Archetype): string {
  return ASSETS.archetypes.sigil[id];
}

/** Rank insignia for an Elo / Road-to-Elo goal (nearest tier ≤ value). */
export function getRankInsignia(elo: number): string {
  const tier: RankTier = elo >= 1800 ? 1800 : elo >= 1500 ? 1500 : elo >= 1200 ? 1200 : 1000;
  return ASSETS.badges.ranks[tier];
}

/** Kingdom art per opening id. Add a kingdom: drop banner/emblem/boss in
 *  public/assets/kingdoms/<id>/ + add one entry here. Nothing else. */
export interface KingdomArt {
  banner: string;
  emblem: string;
  boss: string;
}
export const KINGDOMS: Record<string, KingdomArt> = {
  "caro-kann": {
    banner: `${BASE}/kingdoms/caro-kann/banner.webp`,
    emblem: `${BASE}/kingdoms/caro-kann/emblem.png`,
    boss: `${BASE}/kingdoms/caro-kann/boss.png`,
  },
  sicilian: {
    banner: `${BASE}/kingdoms/sicilian/banner.webp`,
    emblem: `${BASE}/kingdoms/sicilian/emblem.png`,
    boss: `${BASE}/kingdoms/sicilian/boss.png`,
  },
  french: {
    banner: `${BASE}/kingdoms/french/banner.webp`,
    emblem: `${BASE}/kingdoms/french/emblem.png`,
    boss: `${BASE}/kingdoms/french/boss.png`,
  },
  italian: {
    banner: `${BASE}/kingdoms/italian/banner.webp`,
    emblem: `${BASE}/kingdoms/italian/emblem.png`,
    boss: `${BASE}/kingdoms/italian/boss.png`,
  },
  "ruy-lopez": {
    banner: `${BASE}/kingdoms/ruy-lopez/banner.webp`,
    emblem: `${BASE}/kingdoms/ruy-lopez/emblem.png`,
    boss: `${BASE}/kingdoms/ruy-lopez/boss.png`,
  },
  "queens-gambit": {
    banner: `${BASE}/kingdoms/queens-gambit/banner.webp`,
    emblem: `${BASE}/kingdoms/queens-gambit/emblem.png`,
    boss: `${BASE}/kingdoms/queens-gambit/boss.png`,
  },
  scandinavian: {
    banner: `${BASE}/kingdoms/scandinavian/banner.webp`,
    emblem: `${BASE}/kingdoms/scandinavian/emblem.png`,
    boss: `${BASE}/kingdoms/scandinavian/boss.png`,
  },
  "kings-indian": {
    banner: `${BASE}/kingdoms/kings-indian/banner.webp`,
    emblem: `${BASE}/kingdoms/kings-indian/emblem.png`,
    boss: `${BASE}/kingdoms/kings-indian/boss.png`,
  },
  english: {
    banner: `${BASE}/kingdoms/english/banner.webp`,
    emblem: `${BASE}/kingdoms/english/emblem.png`,
    boss: `${BASE}/kingdoms/english/boss.png`,
  },
  london: {
    banner: `${BASE}/kingdoms/london/banner.webp`,
    emblem: `${BASE}/kingdoms/london/emblem.png`,
    boss: `${BASE}/kingdoms/london/boss.png`,
  },
  dutch: {
    banner: `${BASE}/kingdoms/dutch/banner.webp`,
    emblem: `${BASE}/kingdoms/dutch/emblem.png`,
    boss: `${BASE}/kingdoms/dutch/boss.png`,
  },
  "nimzo-indian": {
    banner: `${BASE}/kingdoms/nimzo-indian/banner.webp`,
    emblem: `${BASE}/kingdoms/nimzo-indian/emblem.png`,
    boss: `${BASE}/kingdoms/nimzo-indian/boss.png`,
  },
  "kings-gambit": {
    banner: `${BASE}/kingdoms/kings-gambit/banner.webp`,
    emblem: `${BASE}/kingdoms/kings-gambit/emblem.png`,
    boss: `${BASE}/kingdoms/kings-gambit/boss.png`,
  },
  scotch: {
    banner: `${BASE}/kingdoms/scotch/banner.webp`,
    emblem: `${BASE}/kingdoms/scotch/emblem.png`,
    boss: `${BASE}/kingdoms/scotch/boss.png`,
  },
};
/** Returns the kingdom's art, or null if that opening has no kingdom art yet. */
export function getKingdomArt(openingId: string): KingdomArt | null {
  return KINGDOMS[openingId] ?? null;
}
