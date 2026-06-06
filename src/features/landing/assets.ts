/**
 * Landing asset registry — the SINGLE source of every media path (kickoff §
 * "Centralize every path"). Real files live in `public/landing/`.
 *
 * Reality note: the downloaded assets are `.png` (posters / kingdoms / crests)
 * and `.mp4` (videos) — there are no `.webp` / `.webm` siblings yet, so we wire
 * the extensions that actually exist. If optimized siblings are added later,
 * extend the `sources` arrays here and nowhere else.
 */

const BASE = "/landing";

export const LANDING_ASSETS = {
  hero: {
    desktop: {
      // webm first when it exists; mp4 is the guaranteed fallback.
      video: [`${BASE}/hero-desktop.mp4`] as const,
      poster: `${BASE}/hero-desktop-poster.png`,
    },
    mobile: {
      video: [`${BASE}/hero-mobile.mp4`] as const,
      poster: `${BASE}/hero-mobile-poster.png`,
    },
  },
  kingdoms: {
    italian: `${BASE}/kingdom-italian.png`,
    sicilian: `${BASE}/kingdom-sicilian.png`,
    french: `${BASE}/kingdom-french.png`,
    caroKann: `${BASE}/kingdom-caro-kann.png`,
    london: `${BASE}/kingdom-london.png`,
  },
  crests: {
    strategist: `${BASE}/crest-strategist.png`,
    warrior: `${BASE}/crest-warrior.png`,
    defender: `${BASE}/crest-defender.png`,
    trickster: `${BASE}/crest-trickster.png`,
  },
  ambient: {
    embers: `${BASE}/embers-loop.mp4`,
  },
  /** OG / social share image (kickoff §10 / SEO). */
  ogImage: `${BASE}/hero-desktop-poster.png`,
} as const;

export type LandingArchetypeKey = keyof typeof LANDING_ASSETS.crests;
export type KingdomKey = keyof typeof LANDING_ASSETS.kingdoms;
