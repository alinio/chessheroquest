# ChessHeroQuest — Screen Wireframe & Layout Spec (Doc 4 of 4)

**Scope:** every screen, in journey order, at wireframe granularity — zones, exact dimensions/spacing, tokens (from Doc 2), asset refs (Doc 2 §4 / Doc 3), states, interactions, responsive deltas, reduced-motion. Claude Code should not need to invent layout after this.
**Reads with:** Doc 1 (GDD logic), Doc 2 (tokens/assets/Higgsfield), Doc 3 (boss catalog).

**How to read:** ASCII blocks are **mobile-first (≤640)**; "**Desktop:**" notes the ≥1025 deltas. `[C]`=coded, `[HF]`=Higgsfield asset, `[SVG]`=vector. Tokens like `--gold-3`, `H2`, `frame--hero` are defined in Doc 2. All px are logical.

---

## 0. SHARED APP SHELL

### 0.1 Top bar — height **64px**, `--bg-obsidian`, 1px `--line` bottom, padding `0 20px` (mobile) / `0 32px` (desktop), content vertically centered.
```
┌───────────────────────────────────────────────┐
│ [◆ mark 32]  CHESSHEROQUEST     [IQ 428] [🔥12] [◯]│
└───────────────────────────────────────────────┘
```
- **Left:** logo mark `[SVG]` 32×32 + wordmark (Cinzel, `--gold` gradient). **Mobile: mark only**, wordmark hidden <768.
- **Right cluster (gap 16):** Opening IQ pill `[C]` (number Cinzel 600 16px gold + "IQ" micro `--text-muted`) · streak flame `[SVG]`+count · avatar `[C]` 32px circle, `--line` ring.
- On immersive screens (Map/Boss): top bar becomes **transparent overlay** with a subtle gradient scrim.

### 0.2 Mobile bottom nav — height **56px** + safe-area, `--bg-panel`, 1px `--line` top. 5 items, icon 24px + label Micro 11px.
`[ Map ] [ Drill ] [ Daily ] [ Passport ] [ Profile ]` — active = `--gold-3` icon+label + 2px gold top indicator; inactive = `--text-muted`. **Desktop:** replaced by a 220px left rail (same items, icon+label rows) OR top-bar links — pick the left rail for the app section.

---

## 1. TEST — position screen
**Purpose:** answer 20 opening positions fast; no correctness shown mid-test (keeps IQ honest).
```
┌──────────────── top bar ────────────────┐
│ POSITION 7 / 20                          │
│ ▓▓▓▓▓▓▓░░░░░░░░░░  (progress 4px)         │
│                         ⏱ 0:12 (subtle)  │
│        ┌───────────────────┐             │
│        │                   │             │
│        │   BOARD 360×360   │             │
│        │                   │             │
│        └───────────────────┘             │
│            Best move?                     │
│   [ Bc5 ]  [ Nf6 ]  [ Be7 ]  [ f5 ]      │
│            I'm not sure (skip)            │
└──────────────────────────────────────────┘
```
- **Progress** `[C]`: caps Micro `--text-2` + bar 4px, fill `--gold` gradient. **Timer** `[C]` top-right, `--text-muted`, informational only.
- **Board** `[C]` chessground, 360×360 mobile (margins 20) / **Desktop 480**, centered, max content 560. Warm dark theme (light `#B89B72` / dark `#3A2E22`). Pieces `[SVG]`.
- **Move chips** `[C]`: pills, height 48, `--bg-raised`, radius 999, Inter 600 15, gap 12, wrap to 2 rows if 4. Hover: `--gold-4` border. **Tap → select (gold fill 120ms) → auto-advance**; NO right/wrong feedback.
- **Background** `[HF]` ambient (`bg-hall.mp4`) at opacity .12 + obsidian. **Reduced-motion:** no ambient, no transitions, instant advance.

---

## 2. STYLE QUIZ — question screen
**Purpose:** 16 preference questions → archetype recommendation (does not touch IQ).
```
┌──────────────── top bar ────────────────┐
│ ● ● ● ● ○ ○ … (16 dots)                   │
│                                          │
│  H2: When you get a chance to attack…    │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ Go for the kill, even if risky      │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │ Build up, then strike when safe     │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │ Stay solid, let them overextend     │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │ Look for a shot they won't expect   │ │
│  └────────────────────────────────────┘ │
│            ← Back                         │
└──────────────────────────────────────────┘
```
- **Progress dots** `[C]`: filled `--gold-3`, empty `--line`.
- **Question** `[C]` H2 Cinzel, max-width 520, margin-bottom 24.
- **Option cards** `[C]`: full-width, min-height 64, `--bg-panel`, radius 14, padding 16, Inter 600 15, gap 12. Hover: `--gold-4` border + lift 2px. **Tap → gold border + auto-advance 200ms.** **Desktop:** 2×2 grid, gap 16. No imagery (speed).

---

## 3. RESULT / DNA CARD
**Purpose:** the payoff + shareable artifact; routes to Hero Select (NOT pricing).
```
┌──────────────── top bar ────────────────┐
│        YOUR CHESS DNA                     │
│   ╔══════════════════════════════════╗   │  ← frame--hero (accent = archetype)
│   ║   (◉ animated crest 96)           ║   │
│   ║   THE STRATEGIST                  ║   │
│   ║   OPENING IQ                      ║   │
│   ║      428          Top 18%         ║   │
│   ║  ┌──────────┐  ┌──────────┐       ║   │
│   ║  │BEST       │  │BIGGEST    │      ║   │
│   ║  │Ruy Lopez  │  │Weakness:  │      ║   │
│   ║  │           │  │Gambits    │      ║   │
│   ║  └──────────┘  └──────────┘       ║   │
│   ║        chessheroquest.com         ║   │
│   ╚══════════════════════════════════╝   │
│   [ Share ]   [ Download card ]           │
│   ──────────────────────────────         │
│        Meet your Hero  →   (primary CTA)  │
└──────────────────────────────────────────┘
```
- **Card** `[C] frame--hero`: on-screen responsive (max-width 360 mobile / 420 desktop). **Share export renders at 1080×1350** `[C]→webp` (4:5).
- **Crest** `[HF]` animated 96px circular (autoplay-muted-loop) on-screen → **static webp** in export. **Reduced-motion:** static crest.
- **IQ number** Cinzel 700 **80px**, `--gold` gradient text. **Archetype name** Cinzel, accent color. **Top %** Small `--text-2`.
- **Mini-panels** `[C]` ×2: `--bg-raised`, radius 12, eyebrow Micro + value Body. (Best Opening / Biggest Weakness from the test.)
- **Buttons:** Share + Download = secondary (`--line` border). **Primary CTA → Hero Select.** Pricing is NOT here.

---

## 4. HERO SELECT
**Purpose:** choose the Hero (a choice, separate from pricing).
```
┌──────────────── top bar ────────────────┐
│  Choose your Hero                         │
│  Recommended for your Chess DNA           │
│  ╔═══════════════════════╗  ⟵ recommended │
│  ║ [ HERO ART 3:4 ]      ║  (frame--hero, │
│  ║ ◉crest  THE STRATEGIST║   ribbon+glow) │
│  ║ "Outmaneuver, then…"  ║                │
│  ║ ★ 87% match           ║                │
│  ║ • strong in sharp pos ║                │
│  ║ • prefers main lines  ║                │
│  ╚═══════════════════════╝                │
│  ┌─────────┐┌─────────┐┌─────────┐        │
│  │WARRIOR  ││DEFENDER ││TRICKSTER│  ← locked│
│  │ 🔒 Pro  ││ 🔒 Pro  ││ 🔒 Pro  │        │
│  └─────────┘└─────────┘└─────────┘        │
│  You can switch heroes anytime.           │
│  Start as the Strategist  →  (primary)    │
└──────────────────────────────────────────┘
```
- **Recommended card** `[C] frame--hero`: hero art `[HF]` 3:4 (≈320 tall desktop) `object-fit:cover` top · crest `[HF]` badge · name (accent, Cinzel) · tagline · **gold "Recommended" ribbon** · match % · 2–3 reason bullets.
- **Other 3** `[C] frame--locked`: art dimmed 55%, gold lock `[SVG]`, "Unlock with Pro". Tappable → preview + paywall.
- **Mobile:** recommended full-width on top, others in a horizontal snap row. **Desktop:** 4 across, recommended scaled 1.08 + ribbon. **CTA → starts the recommended Hero's World 1 (free).**

---

## 5. WORLD MAP  *(immersive, full-bleed)*
**Purpose:** the Mario-style node journey of one Hero's World.
```
┌─ transparent top bar (IQ / streak) ──────┐
│              ★ KINGDOM BOSS (96)          │  ← top of vertical scroll
│               │                           │
│              ◉ in-progress (72)           │
│             ╱                             │
│            ◉ conquered ★                  │
│            │                              │
│            ◉ available (gold pulse)       │
│           ╱                               │
│          ◯ locked (dashed)                │
│   [ HF MAP BACKGROUND 9:16, parallax ]    │
│ ────────────────────────────────────────  │
│  ▸ Continue: Caro-Kann — Drill   (banner) │
└──────────────────────────────────────────┘  [bottom nav]
```
- **Background** `[HF]` themed scenery, 1080×1920, **vertical scroll**, 2–3 parallax layers.
- **Path + nodes** `[C/SVG]` overlaid: winding SVG path; opening nodes 72px, **Kingdom Boss node 96px** with boss-accent glow at the summit. Node states per Doc 2 §6.1 (locked dashed / available gold-pulse / in-progress arc / conquered gold-star + lit tile + gold path segment).
- **Bottom banner** `[C]`: current objective + Continue. **Tap node → Opening Node panel (§6).** **Reduced-motion:** static bg, no pulse/parallax.

---

## 6. OPENING NODE panel  *(bottom sheet / modal)*
**Purpose:** hub for one opening (Learn/Drill/Review/Boss).
```
│  ╔══════════════ frame--gold ═══════════╗ │
│  ║ [tile 1:1 120] Caro-Kann   B12  ⬛Black║ │
│  ║                         🥈 Silver     ║ │
│  ║ [ Learn ][ Drill ][ Review ][ Boss ] ║ │
│  ║ ────────────────────────────────────║ │
│  ║  <tab content>                       ║ │
│  ║  Learn: line preview + "Start" CTA   ║ │
│  ╚══════════════════════════════════════╝ │
```
- **Header:** opening tile `[HF]` 1:1 120px · name H3 · ECO + side badge `[C]` · mastery medal `[SVG]` (bronze/silver/gold) top-right.
- **Tabs** `[C]`: underline-gold active. Content swaps: **Learn** (line walkthrough preview + Start) · **Drill** (Due/Mastered counts + Start) · **Review** (due list) · **Boss** (difficulty + Enter).
- **Mobile:** bottom sheet ~85% height, drag-to-dismiss. **Desktop:** centered modal 560 wide.

---

## 7. DRILL UI
**Purpose:** SRS reps on an opening line.
```
┌──────────────── top bar ────────────────┐
│ Caro-Kann · Main Line     Due 7 · Mast 12 │
│        ┌───────────────────┐             │
│        │   BOARD 360/480   │             │
│        └───────────────────┘             │
│  Black to move — play the main line       │
│  ✓ Correct!  …c5 was the move  (feedback) │
│  [ Hint ]        [ Skip ]      [ Next → ] │
└──────────────────────────────────────────┘
```
- **Header** `[C]`: line name + SRS counts (`--text-2`).
- **Board** `[C]` as §1. **Prompt** Body. **Feedback zone** `[C]`: ✓ `--success` / ✗ `--danger` + the correct move/line shown after the attempt; then auto-advance or **Next**. **Controls** `[C]`: Hint (reveals arrow), Skip, Next. Free tier: drill counter caps (~20/day) with a soft "limit reached → Pro" nudge.

---

## 8. MINI-BOSS — Opening Guardian  *(immersive)*
**Purpose:** validate an opening vs the engine.
```
┌─ transparent top bar ────────────────────┐
│   OPENING GUARDIAN                         │
│   ALDOVRANDI, THE ROMAN EDGE   (accent)    │
│        [ Easy ] [ Medium ] [ Hard ]        │  ← pre-fight selector
│   ░░ boss art HF 3:4 dimmed behind ░░      │
│        ┌───────────────────┐               │
│        │   BOARD           │               │
│        └───────────────────┘               │
│   Survive the opening ▓▓▓▓▓░░░  ♥♥          │
└────────────────────────────────────────────┘
```
- **Boss art** `[HF]` 3:4 backdrop (or 16:9 in an ornate boss-accent frame), **dimmed to ~40%** once the fight starts so the board reads. Optional **idle animation** `[HF i2v]` → still on reduced-motion.
- **Eyebrow** "OPENING GUARDIAN" Micro + **boss name** Cinzel accent. **Difficulty pills** `[C]` shown before start (Easy=tutorial / Medium=validates / Hard=mastery).
- **Line-progress bar** `[C]` ("Survive the opening" — fills on correct moves) + **lives** `[SVG]` hearts (mistakes allowed by difficulty). **Win → Victory moment (§11).** Lose → retry (always allowed).

---

## 9. WORLD END-BOSS — Gauntlet  *(immersive, climax)*
**Purpose:** ~10 variations across the World, timed; conquering unlocks the next Hero.
```
┌─ transparent top bar ────────────────────┐
│ ⏱ 1:30      🛡🛡       VARIATION 3 / 10     │
│   ░░ boss cinematic/art HF 16:9 framed ░░  │
│        ┌───────────────────┐               │
│        │   BOARD           │               │
│        └───────────────────┘               │
│        ( ⬜White / ⬛Black toggle if mixed ) │
└────────────────────────────────────────────┘
```
- **Boss** `[HF]` 16:9 still/cinematic, larger, boss-accent frame. **HUD** `[C]`: timer (top-left), lives as shields (top-center), variation counter "3/10" (top-right). Side toggle only if the World mixes colors. Tighter, higher-contrast styling than mini-boss. **Win → Kingdom Boss cinematic + world lights up + next-Hero gate breaks (§11).**

---

## 10. OPENING PASSPORT
**Purpose:** collection / long-term goal.
```
┌──────────────── top bar ────────────────┐
│ [tome HF]  Opening Passport   12/20 sealed│
│  EMBER MARCHES                            │
│  [🟡][🟡][⬚][⬚][⬚]                          │
│  OBSIDIAN COURT                           │
│  [🟡][🟡][🟡][⬚][⬚]                          │
│  AEGIS BASTION / MIRAGE BAZAAR …          │
└──────────────────────────────────────────┘ [bottom nav]
```
- **Header** `[HF]` `passport-tome.webp` + title + sealed count.
- **Seals** `[C/SVG]`: filled = gold wax seal (opening mark) + name; empty = dashed `--locked` ring. Grouped by World (label = world name in world accent). Grid 3-col mobile / **Desktop 5-col**. Seal 64px. Tap → opening detail/node.

---

## 11. LEVEL-UP / UNLOCK modal  *(coded moment)*
**Purpose:** the dopamine beats — level up, opening mastered, world unlocked.
```
        ░░ dark overlay 70% ░░
        ✦  (ring fills + gold particle burst)
              LEVEL 5
        +120 XP   🥈 Silver — Caro-Kann
              [ Continue ]
```
- **Animation** `[C]`: ring fill + gold particle burst + number/seal stamps in (Cinzel), ~1.5s, **skippable**. Variants: Level-up · Opening mastered (medal) · **World unlocked** (plays Kingdom Boss cinematic `[HF]` + gate-break + path turns gold). **Reduced-motion:** instant, no particles. Passport seal stamp (§Doc2 6.5) fires here on mastery.

---

## 12. PAYWALL / PRO  *(after first Mini-Boss win)*
**Purpose:** convert at peak momentum; sell improvement tools, not "unlock the game".
```
┌──────────────────────────────────────────┐
│  ░░ scene-throne HF bg + dark overlay ░░   │
│   Unlock your full journey                 │
│   ✓ Unlimited drills + full review         │
│   ✓ All 4 Heroes & Worlds                  │
│   ✓ Connect Lichess — train on real games  │
│   ✓ Deep analytics & Road to Elo           │
│  ┌────────┐ ┌────────┐ ┌──────────────┐   │
│  │Monthly │ │Yearly  │ │ Lifetime      │   │
│  │$9.99   │ │$79 -34%│ │ $129 BEST VALUE│  │
│  │[Choose]│ │[Choose]│ │ [Choose]      │   │
│  └────────┘ └────────┘ └──────────────┘   │
│   Maybe later   ·   Restore purchase       │
└──────────────────────────────────────────┘
```
- **Background** `[HF]` `scene-throne.webp` + 70% dark scrim. **Headline** H1. **Value bullets** `[C]` (improvement framing). **Plan cards** `[C]`: 3 across (desktop) / stacked (mobile), Lifetime badged `--gold` "Best value", Yearly shows savings. Paddle checkout on Choose. **"Maybe later"** returns to the (now capped) free experience.

---

## 13. HOME / DAILY dashboard
**Purpose:** the 5–10 min daily loop hub.
```
┌──────────────── top bar ────────────────┐
│  Good evening, Alain   🔥 12-day streak   │
│  ┌────────────────────────────────────┐  │
│  │ TODAY'S QUEST  Review 10 due lines  │  │
│  │ ▓▓▓▓░░░░░  4/10        [ Go ]        │  │
│  └────────────────────────────────────┘  │
│  ┌──────────────┐ ┌───────────────────┐  │
│  │ DUE REVIEWS 7│ │ CONTINUE YOUR WORLD│  │
│  │ [ Drill ]    │ │ [map thumb] Caro…  │  │
│  └──────────────┘ └───────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │ DAILY BOSS (optional)   [ Enter ]   │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘ [bottom nav]
```
- **Greeting + streak** `[C]`: streak flame state (active gold / at-risk dim / broken gray). **Cards** `[C]` `frame--gold`: Today's Quest (progress bar) · Due Reviews → Drill · Continue World (map thumbnail) · Daily Boss (optional). **Desktop:** 2-col card grid, left rail nav. Reduced-motion: no flame animation.

---

## APPENDIX — screen → primary assets quick map
| # | Screen | HF assets | Coded |
|---|---|---|---|
| 1 | Test | ambient bg | board, chips, progress |
| 2 | Quiz | — | option cards, dots |
| 3 | DNA Result | crest (anim) | card, IQ, panels, export |
| 4 | Hero Select | 4 hero art + crests | cards, ribbon, locks |
| 5 | World Map | world map bg | path, nodes, banner |
| 6 | Opening Node | opening tile | sheet, tabs, medal |
| 7 | Drill | — | board, feedback, controls |
| 8 | Mini-Boss | guardian still (+anim) | board, progress, lives, pills |
| 9 | Gauntlet | end-boss still/cinematic | HUD, board, toggle |
| 10 | Passport | tome | seals grid |
| 11 | Level-up | (world: cinematic) | particle/ring/stamp anim |
| 12 | Paywall | scene-throne | plan cards, bullets |
| 13 | Home | (map thumb) | quest/review/continue cards |
