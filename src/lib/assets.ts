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
    rank1000: `${BASE}/badges/rank-1000.png`,
    rank1200: `${BASE}/badges/rank-1200.png`,
    rank1500: `${BASE}/badges/rank-1500.png`,
    rank1800: `${BASE}/badges/rank-1800.png`,
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

/** Per-opening kingdom art (generated only when the opening is curated). */
export function getKingdomArt(openingId: string, kind: "banner" | "emblem" | "boss"): string {
  const ext = kind === "banner" ? "webp" : "png";
  return `${BASE}/kingdoms/${openingId}/${kind}.${ext}`;
}
