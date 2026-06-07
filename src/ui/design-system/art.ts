/**
 * Real production art (shared with the landing) — the SAME assets the home page
 * uses, so the app matches its heroic-fantasy universe. Files live in
 * public/landing (hero art, crests, kingdom tiles), public/brand (logo) and
 * public/art (world maps). Reference by URL — no cross-feature import.
 */
import type { HeroKey } from "./tokens";

/** Full brand lockup (emblem + gold wordmark), 1478×418. */
export const BRAND_LOGO = "/brand/logo.png";

/** Portrait hero illustration per archetype (4:5). */
export const HERO_ART: Record<HeroKey, string> = {
  warrior: "/landing/archetype-warrior.png",
  strategist: "/landing/archetype-strategist.png",
  defender: "/landing/archetype-defender.png",
  trickster: "/landing/archetype-trickster.png",
};

/** Circular crest per archetype (render with mix-blend screen on dark). */
export const CREST_ART: Record<HeroKey, string> = {
  warrior: "/landing/crest-warrior.png",
  strategist: "/landing/crest-strategist.png",
  defender: "/landing/crest-defender.png",
  trickster: "/landing/crest-trickster.png",
};

/** Tall world-map backdrop per archetype (9:16). */
export const WORLD_MAP: Record<HeroKey, string> = {
  warrior: "/art/worlds/world-warrior-map.png",
  strategist: "/art/worlds/world-strategist-map.png",
  defender: "/art/worlds/world-defender-map.png",
  trickster: "/art/worlds/world-trickster-map.png",
};

/** Kingdom tile per opening id, where real art exists (else coded fallback). */
export const KINGDOM_TILE: Record<string, string> = {
  italian: "/landing/kingdom-italian.png",
  "sicilian-dragon": "/landing/kingdom-sicilian.png",
  french: "/landing/kingdom-french.png",
  "caro-kann": "/landing/kingdom-caro-kann.png",
  london: "/landing/kingdom-london.png",
};
