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
  // Animated crests (image-to-video loops on black) — play in view, PNG fallback
  // under reduced-motion (assets v2 integration brief).
  crestsAnim: {
    strategist: `${BASE}/crest-strategist-anim.mp4`,
    warrior: `${BASE}/crest-warrior-anim.mp4`,
    defender: `${BASE}/crest-defender-anim.mp4`,
    trickster: `${BASE}/crest-trickster-anim.mp4`,
  },
  // Archetype card illustrations (portrait hero art per tribe — Round 2 §3).
  archetypeArt: {
    warrior: `${BASE}/archetype-warrior.png`,
    strategist: `${BASE}/archetype-strategist.png`,
    defender: `${BASE}/archetype-defender.png`,
    trickster: `${BASE}/archetype-trickster.png`,
  },
  // Passport section anchor — ornate tome + wax seals (Round 2 §7).
  passportTome: `${BASE}/passport-tome.png`,
  // Boss section — the giant guardian cinematic (one-shot; Round 2 §6).
  boss: {
    video: `${BASE}/scene-guardian.mp4`,
    poster: `${BASE}/scene-guardian-poster.jpg`,
  },
  // Final-CTA backdrop — the luminous king in the cathedral (animated + still).
  kingHall: {
    video: `${BASE}/bg-king.mp4`,
    poster: `${BASE}/bg-king.jpg`,
  },
  // Ambient section backdrops (low-opacity video + poster/reduced-motion still).
  backdrops: {
    pain: {
      video: `${BASE}/bg-pain.mp4`,
      poster: `${BASE}/bg-pain-poster.jpg`,
    },
    hall: {
      video: `${BASE}/bg-hall.mp4`,
      poster: `${BASE}/bg-hall-poster.jpg`,
    },
  },
  ambient: {
    embers: `${BASE}/embers-loop.mp4`,
  },
  /** OG / social share image (kickoff §10 / SEO). */
  ogImage: `${BASE}/hero-desktop-poster.png`,
} as const;

export type LandingArchetypeKey = keyof typeof LANDING_ASSETS.crests;
export type KingdomKey = keyof typeof LANDING_ASSETS.kingdoms;
