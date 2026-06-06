# ChessHeroQuest — Art Direction & Design Bible (Doc 2 of 3)

**Scope:** the locked visual system + every screen's layout/dimensions/formats + the coded-vs-Higgsfield asset matrix + the Higgsfield generation playbook + the progression / level-up design mechanics.
**Companion:** Doc 3 = Opening & Boss Catalog (rosters, variations, named bosses + per-boss design briefs) — fills the templates defined here.
**Quality bar:** the landing's ornate-gold kingdom cards. Every element matches that or better.

---

## 1. DESIGN TOKENS

### 1.1 Color
| Token | Hex | Use |
|---|---|---|
| `--bg-obsidian` | `#08080A` | app background base |
| `--bg-panel` | `#0D0D10` | cards / panels |
| `--bg-raised` | `#14141A` | raised inner blocks |
| `--line` | `#1C1C22` | borders / dividers |
| `--gold-1` | `#FCEBB6` | highlight (top of gradient) |
| `--gold-2` | `#F3CF77` | gold mid |
| `--gold-3` | `#D9A227` | gold core |
| `--gold-4` | `#A9781A` | gold deep (bottom of gradient) |
| `--text-1` | `#E9E9EE` | primary text |
| `--text-2` | `#A7A7B2` | secondary text |
| `--text-muted` | `#6E6E78` | captions / eyebrows |
| `--locked` | `#3A3A44` | locked state (dashed) |

**Gold gradient (signature):** `linear-gradient(180deg,#FCEBB6 0%,#F3CF77 38%,#D9A227 72%,#A9781A 100%)`. Used on: logo, CTA buttons, IQ numbers, frame borders, seals.

**Hero accent palette** (each: base / glow / border-rgba):
| Hero | Base | Glow | Border |
|---|---|---|---|
| Aggressive Warrior | `#E0413B` | `rgba(224,65,59,.45)` | `rgba(224,65,59,.6)` |
| Strategist | `#8B6CFF` | `rgba(139,108,255,.45)` | `rgba(139,108,255,.6)` |
| Defender | `#2FB67A` | `rgba(47,182,122,.45)` | `rgba(47,182,122,.6)` |
| Trickster | `#38C7D6` | `rgba(56,199,214,.45)` | `rgba(56,199,214,.6)` |

### 1.2 Typography
- **Display / headings / hero & boss names / IQ numbers:** **Cinzel** (600/700), all-caps, `letter-spacing:.04em`. Large initials trick on the wordmark only.
- **Body / UI:** **Inter** (400/500/600).
- **Type scale (px / line-height):** Display-XL 56/1.05 · Display-L 40/1.1 · H1 30/1.15 · H2 24/1.2 · H3 20/1.25 · Body-L 16/1.6 · Body 15/1.6 · Small 13/1.5 · Micro 11/1.4 (eyebrow, caps, `letter-spacing:.14em`).
- **IQ number:** Cinzel 700, 64–88px, gold gradient text.

### 1.3 Spacing / radius / elevation
- 4px base grid. Scale: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64.
- Radii: card `18px` · panel `14px` · inner-frame `12px` · chip/pill `999px`.
- Glow (gold): `0 0 18px rgba(217,162,39,.30)`. Hero-accent glow uses the hero `glow` token.

### 1.4 The Ornate Gold Frame (signature component — reuse everywhere)
- 1px gold-gradient border + 4 **SVG corner flourishes** (~28×28px each, the landing kingdom-card ornament).
- Inner: `--bg-panel`, subtle inner shadow `inset 0 1px 0 rgba(255,255,255,.04)`, faint radial vignette.
- Variants: `frame--gold` (default), `frame--hero` (border + glow take the hero accent), `frame--locked` (dashed `--locked`, no glow, 55% opacity).
- Used on: DNA card, hero cards, map nodes, boss frames, passport, drill panel.

---

## 2. LAYOUT SYSTEM
- **Breakpoints:** mobile ≤640 · tablet 641–1024 · desktop ≥1025. **Mobile-first.**
- **Grid:** 12-col desktop (gutter 24, margin 32) · 4-col mobile (gutter 16, margin 20). App max-width 1120px; immersive screens (map, boss) go full-bleed.
- **App shell:**
  - **Top bar (64px):** logo (left) · Opening IQ pill + streak flame (center/right) · profile/avatar (right).
  - **Main canvas** (scrollable).
  - **Mobile bottom nav (56px):** Map · Drill · Daily · Passport · Profile (icon + micro label).

---

## 3. SCREEN-BY-SCREEN SPEC (layout · dimensions · assets)

> **Asset legend:** `[C]` coded (SVG/HTML/board lib) · `[HF]` Higgsfield raster/video · `[SVG]` vector asset.

### 3.1 Test position screen
- Layout: progress bar "POSITION n/20" (top) → board (center) → "Best move?" → 2–4 move chips → subtle timer.
- **Board** `[C]` — chessground (Lichess lib) or react-chessboard. Size: 360px mobile / 480px desktop, square. Custom **piece set** `[SVG]` (start clean, swap to gold/obsidian set later). Board theme: dark walnut + obsidian squares (`#B89B72`/`#3A2E22` warm, or neutral).
- Move chips `[C]`: pill, `--bg-raised`, gold border on hover/select, Inter 600 15px.
- Background `[HF]`: faint ambient (reuse `bg-hall.mp4` at 0.15 opacity) + obsidian.

### 3.2 Style Quiz screen
- One question per view. H2 question (Cinzel) → 2–4 **option cards** `[C]` (full-width stacked mobile, 2×2 desktop), `--bg-panel`, gold border on select, 64px min-height. Progress dots top. No imagery needed (keep fast).

### 3.3 Result / DNA Card  *(already built — lock these specs)*
- **On-screen:** responsive ornate card, hero-accent `frame--hero`.
- **Share export `[C]→PNG`:** render at **1080×1350 (4:5)** for IG/social. Elements: "YOUR CHESS DNA / EXAMPLE" micro caps · **crest** `[HF]` 96px circular · archetype name (accent, Cinzel) · "OPENING IQ" + number (gold, 80px) · "Top X%" · two mini-panels (Best Opening / Biggest Weakness) · `chessheroquest.com` footer.
- Crest slot uses the animated crest `[HF]` on-screen (autoplay-muted-loop, reduced-motion → static webp), static PNG in the export.

### 3.4 Hero Select
- 4 **hero cards** `[C] frame--hero` in a row (desktop) / horizontal snap-scroll (mobile).
- Card: **hero art `[HF]` 3:4** (top, `object-fit:cover`, ~320px tall desktop) → small circular **crest `[HF]`** badge → archetype name (accent) → tagline → recommended ones get a gold **"Recommended for you"** ribbon + match % + 2–3 reason bullets. Locked heroes: `frame--locked` + gold lock icon `[SVG]` + "Unlock with Pro".
- Card width 280px desktop.

### 3.5 World Map  *(immersive, full-bleed)*
- **Background `[HF]`** = a tall, themed landscape (hero-colored mood), **portrait 1080×1920**, vertical-scroll. The model only makes the *scenery* — never the path/nodes.
- **Path + nodes `[C/SVG]` overlaid:** a winding SVG path; nodes positioned along it. Node = 72px circle, ornate ring. States in §6.1.
- Each opening = one node; the World End-Boss = the final, larger node (96px) with a boss-accent glow.
- Parallax: 2–3 layers on scroll (reduced-motion off).

### 3.6 Opening node panel (opens on node tap)
- Sheet/modal `frame--gold`. Header: **opening "tile" `[HF]` 1:1** (the kingdom-style illustration, ~120px) + opening name + ECO + side badge.
- Tabs `[C]`: **Learn · Drill · Review · Boss**. Mastery indicator (bronze/silver/gold) top-right.

### 3.7 Drill UI
- Board `[C]` (as 3.1) + prompt + instant feedback (✓ green / ✗ red + the correct line) + SRS state ("Due: 7 · Mastered: 12"). Minimal, fast, repeatable.

### 3.8 Mini-Boss screen — "Opening Guardian"  *(immersive)*
- **Boss art `[HF]`**: portrait **3:4** still as the backdrop OR a **16:9 cinematic** in an ornate frame (boss-accent). Optional **animation `[HF i2v]`** (subtle, idle loop) — reduced-motion → still.
- Overlay `[C]`: boss name (Cinzel, accent) · "OPENING GUARDIAN" eyebrow · difficulty selector (Easy/Medium/Hard pills) · the board · a **line-progress bar** ("Survive the opening" — fills as you play correct moves; the boss's "HP" = your remaining mistakes/lives).
- Win = bar full / position sound → victory modal (§6.4). Lose = retry.

### 3.9 World End-Boss — "Gauntlet"  *(immersive, the climax)*
- **Boss art/cinematic `[HF]`** larger, framed. Overlay `[C]`: **timer** (top), **lives** (hearts/shields), **variation counter** "3/10", the board. Tight, high-stakes feel. Both-color toggle only if the world covers both.

### 3.10 Opening Passport
- `frame--gold` grid of **seal slots** `[C/SVG]`: filled = gold wax seal (the opening's mark) + opening name; empty = dashed dim ring. Optional anchor illustration `[HF] passport-tome.webp` as section header. Stamp-in animation in §6.5.

### 3.11 Level-up / unlock modal — see §6.
### 3.12 Paywall / Pro screen
- Triggered after first Mini-Boss win. Full-screen `[HF]` aspirational backdrop (the `scene-throne` image) + dark overlay. The 3 plan cards (mo/yr/lifetime) `[C]`, lifetime badged "Best value". Copy = "the tools that make you improve" (unlimited drills, Lichess, analytics), not "unlock the game".
### 3.13 Home / Daily dashboard
- Top: Opening IQ + streak. Cards `[C]`: "Today's Quest", "Due reviews (n)", "Continue your World" (with map thumbnail), "Daily Boss" (optional). 5–10 min loop.

---

## 4. ASSET MATRIX (coded vs Higgsfield · format · dimensions)

| Asset | Type | Format | Dimensions | Where | Reduced-motion / fallback |
|---|---|---|---|---|---|
| Logo (crown) | `[SVG]` | svg | scalable | top bar, favicon | — |
| Chess board + pieces | `[C]` | lib + svg pieces | responsive 360–480px | test, drill, boss | — |
| UI (buttons, chips, bars, gauges, nodes, seals, modals) | `[C]` | HTML/CSS/SVG | — | everywhere | — |
| Opening IQ gauge / numbers | `[C]` | SVG + text | — | result, dashboard | — |
| DNA card (on-screen) | `[C]` + crest `[HF]` | DOM | responsive | result | — |
| DNA card (share) | `[C]→PNG` | webp/png | 1080×1350 | share/OG | — |
| Hero character art (×4) | `[HF]` image | webp | **3:4**, 1024×1365 | hero select, profile | static webp |
| Animated crest (×4) | `[HF]` video | mp4 | **1:1** 720p | DNA card, hero card | static crest webp |
| Opening "kingdom" tile (×N) | `[HF]` image | webp | **1:1** 1024² | opening node, passport | — |
| World map background (×4) | `[HF]` image | webp | **9:16** 1080×1920 | world map | — |
| Mini-Boss (Opening Guardian) still (×~18) | `[HF]` image | webp | **3:4** 1024×1365 | mini-boss screen | — |
| Mini-Boss idle animation (hero ones) | `[HF]` video i2v | mp4 | 3:4 / 16:9 720p | mini-boss screen | still |
| World End-Boss still (×4) | `[HF]` image | webp | **16:9** 1920×1080 | gauntlet screen | — |
| World End-Boss cinematic (×4) | `[HF]` video i2v | mp4 1080p | 16:9 | gauntlet intro | poster still |
| Badges / mastery medals | `[SVG]` (prefer) | svg | scalable | rewards, profile | — |
| Passport seals | `[SVG]` (prefer) | svg | scalable | passport | — |
| Ambient backdrops | `[HF]` video | mp4 720–1080p | per screen | various | poster |

**Rule of thumb:** boards, numbers, UI, gauges, nodes, seals, badges = **coded** (crisp, controllable). Characters, bosses, maps, tiles, atmosphere = **Higgsfield** (still-first). Logo = SVG.

---

## 5. HIGGSFIELD GENERATION PLAYBOOK

**Hard rules (learned, non-negotiable):**
- **No readable text, UI, numbers, or logos in any AI image/video** — it comes out garbled. Text/UI is always coded on top.
- **Video = ambiance / single forgiving subjects only** (a creature, a scene, embers). Never a mechanic, board, or narrative.
- **Still-first → image-to-video:** generate the still, validate, then animate THAT still (Seedance image-to-video) for subtle motion. Don't text-to-video complex scenes.
- Always pass `declined_preset_id: 24bae836-2c4a-48e0-89b6-49fcc0b21612` ("IN THE DARK") to generate literally.
- **Match resolution** across a set; re-encode videos all-keyframe + strip audio.
- Style anchor: generate one, then **reference it** for the rest of a set (consistency), like the crests/kingdoms.

**Shared style preamble (prepend to every prompt):**
> "Premium dark epic-fantasy, MMO-RPG splash-art quality, deep obsidian blacks, ornate gold detail, dramatic cinematic lighting, painterly, ultra-detailed, [ACCENT] glow accent. No text, no UI, no letters, no numbers, no watermark, no logos."

| Asset | Model | Aspect / res | Template (fill [SLOTS]) |
|---|---|---|---|
| Hero art | `nano_banana_pro` | 3:4 | "[shared] single chess-themed hero character: [HERO DESCRIPTION], [POSE], isolated on a dark atmospheric background." |
| Opening tile | `nano_banana_pro` | 1:1 | "[shared] an isometric fantasy castle/kingdom representing the [OPENING] opening, [MOOD], inside an ornate gold frame motif." |
| World map bg | `nano_banana_pro` | 9:16 | "[shared] a tall vertical fantasy landscape, [WORLD THEME] mood, a winding path through it (empty, no markers), vast atmospheric depth, room for overlaid nodes." |
| Mini-Boss (Guardian) still | `nano_banana_pro` | 3:4 | "[shared] an imposing 'Opening Guardian' creature/figure: [BOSS DESCRIPTION], looming over a chessboard, [ACCENT] glow, isolated on dark background." |
| World End-Boss still | `nano_banana_pro` | 16:9 | "[shared] an epic boss encounter: [BOSS DESCRIPTION] over a vast chess arena, awe-inspiring scale, cinematic." |
| Boss/idle animation | `seedance_2_0` (i2v from the still) | match | "Animate this exact image: subtle idle motion only — [glow pulse / embers / slow breathing], everything stays solid, no morphing. Seamless loop." |
| Ambient backdrop | `seedance_2_0` (i2v) | per screen | as the bg-hall/bg-pain briefs (low-opacity, slow, forgiving). |

*(Doc 3 fills BOSS DESCRIPTION / HERO DESCRIPTION / OPENING / WORLD THEME / ACCENT per item.)*

---

## 6. PROGRESSION / LEVEL-UP / UPGRADE DESIGN MECHANICS

### 6.1 Map node states `[C/SVG]`
| State | Visual |
|---|---|
| Locked | dashed `--locked` ring, 50% opacity, gray lock icon |
| Available | gold ring + slow **gold pulse** glow, tappable |
| In progress | gold ring with a **partial progress arc** (e.g. 2/4 steps done) |
| Conquered | solid gold ring + **gold star**, opening tile lit, path segment to next node turns gold |

### 6.2 XP & Hero level
- **XP** earned from drills, boss wins, daily quests. Drives a **Hero Level** (prestige/cosmetic), shown as a bar in the profile + a small ring on the avatar. *(Hero Level is separate from Opening IQ — IQ = skill, Level = effort/progress.)*
- **Level-up moment `[C]`:** a coded burst — ring fills, gold particle burst, the new level number stamps in (Cinzel), short fanfare. Modal: "Level N — [reward/title]". ~1.5s, skippable, reduced-motion = instant.

### 6.3 Opening mastery tiers
- Per opening: **Bronze** (beat Easy) · **Silver** (beat Medium = validated) · **Gold** (beat Hard = mastery). Shown as a small medal `[SVG]` on the node + passport. Gold grants an Opening IQ bonus.

### 6.4 Boss victory moment `[C]` (+ optional `[HF]`)
- Screen flash → "GUARDIAN DEFEATED" (Cinzel, accent) → rewards reveal (XP +n, badge, seal). For the **World End-Boss**, play the boss **cinematic `[HF]`** + the world "lights up" (path turns gold) → next-Hero gate unlocks with a lock-break animation.

### 6.5 Passport seal stamp `[C]`
- On mastering an opening: an empty dashed slot → a gold **wax seal stamps in** (scale-down impact + flash + faint smoke), opening name fades in. Satisfying micro-moment; reduced-motion = instant fill.

### 6.6 Unlock / upgrade (Pro) treatment
- Locked content = `frame--locked` + gold lock + "Unlock with Pro". Tapping → the **Paywall (§3.12)**.
- **Paywall placement:** the transition right after the first Mini-Boss victory — momentum carries into the offer.
- Next-Hero gate: shown on the map as a sealed gate; unlocking (via Pro or World completion) plays a gate-break animation.

### 6.7 Streak `[C]`
- Flame icon + day count. States: active (gold flame), at-risk (dim, "play today"), broken (gray). Milestone bursts at 7/30/100.

---

## 7. MOTION & STATES
- Hover: lift 2px + glow. Press: scale .98. Entrance: fade+rise 12px, 200ms, staggered.
- **Always honor `prefers-reduced-motion`:** no autoplay video (poster only), instant state changes, no parallax.
- Loading: gold shimmer skeletons. Empty states: short fantasy-flavored line + CTA.

## 8. NAMING / VOICE (consistency)
- **Hero** (not "class") · **World** (per hero) · **Opening node** · **Opening Guardian** (mini-boss) · **Kingdom Boss / Gauntlet** (world boss) · **Passport seal** · **Opening IQ** (skill) · **Hero Level** (effort) · **Chess DNA**.
- **Never** "monster" / "monstre" — use **Guardian / Boss**. Keep it noble, premium, never cheap-mobile-game.
