/**
 * Verbatim landing copy (kickoff §5 — copy is FINAL, do not rewrite).
 * Centralized so every section pulls the exact same strings and the CTA label
 * never drifts. Headline copy (the channel-aware H1/sub) lives in `variants.ts`.
 */

/** Primary CTA label — appears in hero, sticky bar, S2, final (kickoff §9). */
export const CTA_LABEL = "Take the Free Chess DNA Test";
/** S5 uses a slightly different verb ("Start with…") per §5. */
export const CTA_LABEL_START = "Start with the Free Chess DNA Test";
/** Where every CTA points. Repo route is `/dna` (user-flows), not `/dna-test`. */
export const CTA_HREF = "/dna";

export const HERO = {
  ctaLabel: CTA_LABEL,
  microcopy: "Free · no signup to begin · ~2 minutes",
} as const;

export const PAIN = {
  h2: "You're losing games before move 10.",
  body: "You hit a position you don't understand. You walk into a trap you'd never seen. “Study your openings,” they say — then bury you in 300 variations you'll never remember. Start with the one score that shows where you actually stand.",
  ctaLabel: CTA_LABEL,
} as const;

export const WHAT_YOU_GET = {
  h2: "See the game behind your games.",
  body: "Your Opening IQ. Your Chess DNA archetype. Your strongest opening. Your biggest weakness. And a Road to Elo with the exact openings to train next — built for how you actually play.",
} as const;

/** Intro above the archetype row (Round 2 §3). */
export const ARCHETYPE_INTRO = {
  title: "Every player has a Chess DNA.",
  sub: "Four ways to win. The free test reveals which one is yours.",
  ctaLabel: CTA_LABEL,
} as const;

/** Boss section (Round 2 §6). */
export const BOSS = {
  kicker: "Kingdom Boss",
  h2: "Face the Kingdom Bosses.",
  tag: "The Dragon Variation",
  body: "Each opening's toughest variation. Beat it to conquer the kingdom.",
  ctaLabel: CTA_LABEL_START,
} as const;

/** Passport section (Round 2 §7). */
export const PASSPORT = {
  title: "Your Opening Passport",
  body: "Master an opening, earn its seal. Collect them all.",
} as const;

export const HOW_IT_WORKS = {
  h2: "Your opening quest starts in three steps.",
  steps: [
    {
      n: 1,
      phase: "Discover",
      title: "Take the free Chess DNA Test",
      body: "Get your Opening IQ and your Chess DNA — 20 positions, about 2 minutes, no signup to begin.",
    },
    {
      n: 2,
      phase: "Train",
      title: "Train 5 minutes a day",
      body: "Pick your hero, learn your openings, fix weak lines, and keep your streak alive.",
    },
    {
      n: 3,
      phase: "Conquer",
      title: "Beat the bosses, earn the seals",
      body: "Outplay the Opening Guardians and Kingdom Bosses, earn each opening's seal, and fill your Opening Passport.",
    },
  ],
} as const;

export const KINGDOMS = {
  h2: "Then the real game begins.",
  body: "Every opening becomes a kingdom to conquer. Train it, beat its Opening Guardian, and add it to your Opening Passport.",
  ctaLabel: CTA_LABEL_START,
} as const;

export const FINAL = {
  h2: "Discover your Opening IQ — free.",
  body: "Take the 2-minute Chess DNA Test and reveal the openings shaping your game.",
  ctaLabel: CTA_LABEL,
  microcopy: "Free · ~2 minutes · no signup to begin",
} as const;

export const FOOTER = {
  wordmark: "ChessHeroQuest",
  tagline: "The RPG of chess openings.",
  links: [
    { label: "How it works", href: "/#how-it-works" },
    { label: "Blog", href: "/blog" },
    { label: "Log in", href: "/signin" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
} as const;
