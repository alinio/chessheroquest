---
name: ChessHeroQuest
direction: Epic Fantasy RPG — dark & premium
platform: mobile-first
colors:
  bg-abyss: "#0F1015"
  bg-surface: "#191B24"
  bg-raised: "#232636"
  hairline: "#2E3142"
  gold: "#E3B23C"
  gold-bright: "#F4CE6A"
  gold-deep: "#9A7A22"
  warrior: "#C0392B"
  strategist: "#6C5CE7"
  defender: "#1E9E6A"
  trickster: "#17A2A2"
  state-gold: "#E3B23C"
  state-solid: "#3FB371"
  state-review: "#E0922B"
  state-leak: "#D1495B"
  text-hi: "#F3EEE2"
  text-mid: "#B9B6AC"
  text-low: "#7C7E8C"
  board-light: "#E8DFC8"
  board-dark: "#6E5B4A"
typography:
  display: "Cinzel"        # heraldic serif — titles, ranks, kingdoms (sparingly)
  body: "Manrope"          # UI + body, highly legible on mobile
  iq: "Cinzel, gold, oversized, glow"  # the hero number
radius: { card: 16px, chip: 999px, board: 0 }
spacing: [4, 8, 12, 16, 24, 32, 48]
---

## Overview

A premium RPG of chess mastery. Deep inked backgrounds, localized golden light, heraldry and prestige. **Dark, golden, noble** — never cartoonish, never grim/horror (audience skews young). The unforgettable element: the **Opening IQ** as a heroic, glowing, living gold number.

## The board rule (most important)

**The board stays clean, legible and serious — the epic treatment goes around it, never on it.** No ornate squares, no fantasy piece sets that hurt recognition. Board = workbench (use `board-light`/`board-dark`, classic legible pieces, gold move-hints). Everything else (HUD, map, cards, ranks) carries the fantasy mood.

## Colors

Dominant dark surfaces + **gold** as the single prestige accent (IQ, "conquered", ranks). Each DNA archetype owns a signature color (warrior/strategist/defender/trickster) used for that tribe's crest and theme. Mastery states (gold/solid/review/leak) **always pair color with an icon/shape** — never color alone (color-blind safety).

## Typography

Cinzel for display impact (ranks, kingdom names, "Boss Defeated") — used sparingly and always legible. Manrope for all functional UI and body. The Opening IQ uses display weight in gold, oversized, with a soft glow — it must feel like treasure.

## Components

Opening IQ counter (animated gold count-up) · DNA/status cards (precious objects: thin gold border, dramatic shadow, archetype crest — built to be screenshot-shared) · World Map (named kingdoms; conquered ones glow gold) · progress gauges (epic filling bars/rings) · ranks/badges/titles (heraldic seals & medals) · session HUD (streak as a living flame; 3 daily "missions") · coach panel (parchment-toned bottom sheet).

## Motion & juice (gamification feel)

High-impact moments, not scattered jitter:
- **Dashboard load:** staggered reveal; IQ counts up with gold glow.
- **Kingdom conquered:** epic transition to gold + seal stamped.
- **Boss defeated:** brief epic flash + medal.
- **Streak:** flame grows at milestones.
- **Drilling — restraint:** correct/wrong feedback is quick & clean (color + icon), **never a long animation that slows input**. Juice lives on rewards & transitions, not on every move.
CSS-first for mobile performance; respect `prefers-reduced-motion`.

## Guardrails

Board legibility > decoration · AA contrast · states never color-only · age-appropriate (epic/noble, not violent) · smooth on mid-range phones · no generic AI aesthetic (no purple-on-white, no default system fonts). Commit to the dark-gold fantasy direction with precision.

> Usage: reference this file explicitly when generating UI ("use @DESIGN.md for all styling"). It is the single source of truth for visual decisions. Do **not** import a third-party site's identity over it — this DA is the product's differentiation.
