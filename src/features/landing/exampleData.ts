/**
 * Example data for the landing's coded components (kickoff §5/§6).
 *
 * IMPORTANT: this is illustrative ONLY — the DNA Card carries a visible
 * "EXAMPLE" tag so we never imply it's the visitor's real result (guardrail §9:
 * no fabricated proof). The hero DNA Card numbers come straight from §5's
 * example line: Strategist · IQ 428 · Top 38% · London · Sicilian.
 */
import type { LandingArchetypeKey, KingdomKey } from "./assets";

export interface ExampleDnaResult {
  archetype: LandingArchetypeKey;
  openingIq: number;
  /** "Top X%" — the percentile shown to the user. */
  topPercent: number;
  bestOpening: string;
  biggestWeakness: string;
}

export const EXAMPLE_DNA: ExampleDnaResult = {
  archetype: "strategist",
  openingIq: 428,
  topPercent: 38,
  bestOpening: "London System",
  biggestWeakness: "Sicilian Defense",
};

export interface ArchetypeInfo {
  key: LandingArchetypeKey;
  label: string;
  tagline: string;
  /** DESIGN.md token color var for this tribe. */
  colorVar: string;
}

/** The four DNA tribes (DESIGN.md archetype colors · crest art in assets.ts). */
export const ARCHETYPES: ArchetypeInfo[] = [
  {
    key: "warrior",
    label: "Aggressive Warrior",
    tagline: "Attack relentlessly",
    colorVar: "var(--color-warrior)",
  },
  {
    key: "strategist",
    label: "Strategist",
    tagline: "Outmaneuver, then crush",
    colorVar: "var(--color-strategist)",
  },
  {
    key: "defender",
    label: "Defender",
    tagline: "Unbreakable and patient",
    colorVar: "var(--color-defender)",
  },
  {
    key: "trickster",
    label: "Trickster",
    tagline: "Surprise and bewilder",
    colorVar: "var(--color-trickster)",
  },
];

export const ARCHETYPE_BY_KEY: Record<LandingArchetypeKey, ArchetypeInfo> =
  Object.fromEntries(ARCHETYPES.map((a) => [a.key, a])) as Record<
    LandingArchetypeKey,
    ArchetypeInfo
  >;

export interface KingdomInfo {
  key: KingdomKey;
  name: string;
  /** Conquered tiles glow gold; locked tiles dim + desaturate (kickoff §S5). */
  conquered: boolean;
}

/** Five kingdoms for the World Map preview — one "conquered" to show the state. */
export const KINGDOMS_PREVIEW: KingdomInfo[] = [
  { key: "italian", name: "Italian Game", conquered: true },
  { key: "london", name: "London System", conquered: false },
  { key: "sicilian", name: "Sicilian Defense", conquered: false },
  { key: "french", name: "French Defense", conquered: false },
  { key: "caroKann", name: "Caro-Kann", conquered: false },
];
