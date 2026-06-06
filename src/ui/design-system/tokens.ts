/**
 * Design tokens as TS constants (art-direction-bible.md §1), for the parametric
 * components + anywhere a value is needed in JS (gauge math, hero lookup).
 * The CSS-var source of truth is theme.css; these mirror it.
 */

export const HERO_ACCENTS = {
  warrior: {
    label: "Aggressive Warrior",
    base: "#E0413B",
    glow: "rgba(224,65,59,.45)",
    border: "rgba(224,65,59,.6)",
  },
  strategist: {
    label: "Strategist",
    base: "#8B6CFF",
    glow: "rgba(139,108,255,.45)",
    border: "rgba(139,108,255,.6)",
  },
  defender: {
    label: "Defender",
    base: "#2FB67A",
    glow: "rgba(47,182,122,.45)",
    border: "rgba(47,182,122,.6)",
  },
  trickster: {
    label: "Trickster",
    base: "#38C7D6",
    glow: "rgba(56,199,214,.45)",
    border: "rgba(56,199,214,.6)",
  },
} as const;

export type HeroKey = keyof typeof HERO_ACCENTS;

/** Signature gold gradient stops (used by SVG <linearGradient> + CSS). */
export const GOLD_STOPS = [
  { offset: 0, color: "#FCEBB6" },
  { offset: 0.38, color: "#F3CF77" },
  { offset: 0.72, color: "#D9A227" },
  { offset: 1, color: "#A9781A" },
] as const;

/** Opening IQ is a public 0–1000 scale (GDD §reconciliation). */
export const IQ_MAX = 1000;

/** §1.2 type scale — px / line-height. */
export const TYPE_SCALE = {
  displayXl: { size: 56, line: 1.05 },
  displayL: { size: 40, line: 1.1 },
  h1: { size: 30, line: 1.15 },
  h2: { size: 24, line: 1.2 },
  h3: { size: 20, line: 1.25 },
  bodyL: { size: 16, line: 1.6 },
  body: { size: 15, line: 1.6 },
  small: { size: 13, line: 1.5 },
  micro: { size: 11, line: 1.4 },
} as const;
