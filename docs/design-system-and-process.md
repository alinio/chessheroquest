# ChessHeroQuest — Design System & Build Process

**Purpose.** This is the **code-facing layer** that makes every screen consistent, so Claude Code composes screens instead of improvising them. It turns the visual direction into buildable, enforceable rules.

**Relationship to the other docs (no duplication):**
- `art-direction-bible.md` = the **visual source of truth** (the look & feel, the art direction). If a value here ever conflicts, the bible wins — reconcile.
- `asset-production-manifest.md` = how the **illustrated art** (heroes, worlds, tiles, bosses) is produced.
- **This doc** = **tokens-as-code + UI primitives + asset inventory + the workflow**. The "how it's built the same way every time" layer.

---

## 0. The anti-improvisation principle (read first)

Claude Code improvises when it lacks an executable constraint. So:
1. **No hardcoded values.** No raw hex, px, font names, or shadow recipes in components — only tokens.
2. **No from-scratch styling.** Every screen is assembled from shared **primitives** (§3). If a primitive doesn't exist, you *add it to the kit first*, then use it — never inline a one-off.
3. **No ad-hoc assets.** Use assets from the inventory (§2) by path. If one is missing, **STOP and request it** — never generate a substitute or drop in a random image/icon.
4. **/preview is the truth check** (§4): every token and primitive renders there; drift is visible.

If a prompt would break one of these, that's the signal to extend the system, not to improvise.

---

## 1. Design tokens (single source — lives in code)

Tokens live in ONE place (e.g. `theme.ts` / `tokens.css`) and every component imports them. **Values below must match `art-direction-bible.md`** — if the bible already defines them, use the bible's exact values; treat these as the starting set to reconcile.

```css
/* Surfaces — obsidian */
--obsidian:        #0a0812;
--obsidian-2:      #120e1c;
--panel:           #171120;
--panel-2:         #1e1730;

/* Gold (primary accent / brand) */
--gold:            #cda845;
--gold-bright:     #f1d680;
--gold-dim:        #7a6a38;

/* Realm accents (active realm swaps --accent) */
--ember:           #e0413b;  /* Ember Marches  — Warrior   */
--obsidian-court:  #8b6cff;  /* Obsidian Court — Strategist */
--aegis:           #2fb67a;  /* Aegis Bastion  — Defender   */
--mirage:          #38c7d6;  /* Mirage Bazaar  — Trickster  */
--accent:          var(--ember); /* set per active realm */

/* Text */
--parchment:       #ece3cf;  /* primary text */
--muted:           #9c9484;
--faint:           #6f6757;

/* State (results) */
--win:             #2fb67a;
--draw:            #9c9484;
--loss:            #e0413b;

/* Lines & glows */
--hairline:        rgba(205,168,69,.28);      /* gold hairline borders */
--glow-gold:       0 0 22px rgba(205,168,69,.35);
--glow-accent:     0 0 24px rgba(224,65,59,.50);

/* Radii */
--r-sm:6px; --r-md:10px; --r-lg:14px; --r-xl:16px;

/* Type */
--font-display:'Cinzel', serif;   /* headings, brand, node names, numbers */
--font-ui:'Inter', system-ui, sans-serif; /* body, labels, UI */

/* Motion (respect prefers-reduced-motion) */
--dur-fast:160ms; --dur:280ms; --dur-slow:2.4s;
```

**Realm theming.** Screens set `--accent` to the active realm's color; every accent-driven element (active nav, glows, node "available" state, CTAs) reads `--accent`, so a realm reskins automatically.

**Typography rule.** Cinzel for display/headings/brand/node names/big numbers (the fantasy voice); Inter for everything functional. A defined scale (e.g. 26/19/16/14/13/12/11) lives with the tokens.

---

## 2. Asset inventory (repo map — reuse, never regenerate)

Every visual asset has a home and a path. Components reference these; they never invent or fetch elsewhere.

| Class | Path | Contents | Rule |
|---|---|---|---|
| Illustrated art | `public/art/heroes/` `worlds/` `tiles/` `bosses/` `ui/` | Hero crests, realm maps, opening tiles, boss stills/cinematics | Reuse only (produced per `asset-production-manifest.md`). Missing → request, don't generate ad hoc. |
| Icons | the SVG icon kit → a React `<Icon name=…>` set | UI glyphs (flame, map, seal, shield, lock, play, crown…) | Use the kit only. No inline random SVGs, no mixing icon libraries. New glyph → add to the kit first. |
| Textures / backgrounds | `public/textures/` | Obsidian base, parchment, ember-glow, subtle noise | Prefer CSS (gradients + noise) for atmosphere; use an image only where richer texture is needed. List each here with size. |
| Fonts | self-host or Google Fonts | Cinzel, Inter | Loaded once globally. |
| Seals / wax stamps | coded SVG (per landing rework) | Realm-tinted gold/dim seals | Coded, not raster. |

> Note on textures/backgrounds: most "obsidian + glow" atmosphere is **CSS-generated** (cheap, crisp, themeable). Only a few ambient textures justify a real image asset — and ambient images are the *only* thing that may be AI-generated (ambiance only, never UI/text/icons), then stored here with a path.

---

## 3. UI primitives (build once, compose everywhere)

The shared component kit. **Screens are assembled from these — they don't restyle.** Each primitive uses only §1 tokens.

- **AppShell** — TopBar + NavRail (desktop) / BottomNav (mobile).
- **TopBar** — logo, realm chip, StreakFlame, IqRing, hero avatar, Pro badge.
- **NavRail / BottomNav** — the 5 sections + secondary; active state via `--accent`.
- **Panel / Card** — the ornate gold-hairline obsidian surface (with optional corner flourishes).
- **Button** — `primary` (gold fill, Cinzel) / `secondary` (hairline) / `ghost`.
- **Badge / Chip** — Pro, status, ECO, realm tag.
- **MapMedallion** — node states: conquered / available / locked / boss (the map nodes).
- **Board** — the chess board (one styling, reused by Test/Learn/Drill/Boss).
- **SealStamp** — the wax-seal earn animation + Passport seal.
- **IqRing** — the Opening IQ gauge.
- **StatBar** — W/D/L bar (win/draw/loss tokens).
- **ExplorerRow** — move + popularity bar + eval (the Lichess-style row).
- **ProgressRing / StreakFlame / EmptyState / Toast.**

Each primitive is documented with its props + which tokens it consumes. A new visual need → extend or add a primitive here (and to /preview), never a one-off in a screen.

---

## 4. /preview — the living style guide

A dev route that renders: the full token set (swatches, type scale, radii, glows), every primitive in all its states, and a couple of sample composed screens. It exists so drift is caught by eye. Update it whenever a token or primitive changes. (This was scoped in M1 — keep it current.)

---

## 5. Build workflow (per screen) — the process

When building or changing any screen, Claude Code must:
1. **Read** `art-direction-bible.md` + this doc + the screen's spec (`screen-wireframe-spec.md` / `in-app-architecture-spec.md`).
2. **Compose** the screen from existing **primitives** (§3) + **tokens** (§1) only.
3. **Need a new look?** Add/extend a **primitive or token** in the kit (and render it in /preview) first, then use it. Never inline a one-off style.
4. **Need imagery?** Use an existing asset from the **inventory** (§2) by path. If it's missing, **STOP and ask** — don't generate or substitute.
5. **No** raw hex / px / font names / shadow recipes; **no** new icon libraries; tokens + the icon kit only.
6. Respect `prefers-reduced-motion` and a11y, driven by tokens.
7. End by listing which primitives/tokens/assets were used and any new ones added.

---

## 6. CLAUDE.md enforcement block (paste into CLAUDE.md)

```
## Design system (authority: design-system-and-process.md + art-direction-bible.md)
- Use design TOKENS only (theme.ts / tokens.css). Never hardcode hex, px, font names, or shadows.
- Compose screens from the shared UI PRIMITIVES. If one is missing, add it to the kit (+ /preview) before using it. No one-off inline styles.
- Use ASSETS from the inventory by path (public/art, the icon kit, public/textures). Never generate or substitute a missing asset — STOP and request it. No mixing icon libraries.
- Cinzel = display/headings/brand/node-names/big-numbers; Inter = UI/body.
- Active realm sets --accent; accent-driven elements read --accent.
- Respect prefers-reduced-motion and a11y. Keep /preview current.
- If a task would require breaking a rule above, extend the system instead of improvising.
```
