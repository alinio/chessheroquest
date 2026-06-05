# OPENING HERO — DESIGN / UI BRIEF (Execution · Step 2)

> Art direction: **Epic Fantasy RPG — dark & premium.** Platform: **mobile-first.**
> Goal: an identity that feels like a premium RPG of chess mastery — the anti-Chess.com (clinical) and anti-Duolingo (childish). Tokens are concrete starting points, exploitable by Claude Code, to refine in mockups.

---

## 1. The one critical design tension (read first)

A gamified chess trainer lives or dies on this: **the board must stay clean, legible and serious — the epic treatment goes around it, never on it.**

- **The board = the workbench.** Pieces and squares stay highly readable. No ornate squares, no fantasy piece sets that hurt recognition, no decorative noise on the playing surface.
- **The wrapper = the epic layer.** HUD, World Map, cards, ranks, progression, transitions carry the dark premium fantasy mood.

Break this rule and the product becomes unusable for actual training. Everything below respects it.

---

## 2. Aesthetic direction

Chess reimagined as a **medieval-fantasy realm of mastery**: kingdoms to conquer, a hero's ascent, heraldry and prestige. **Dark, golden, premium** — noble and epic, never cartoonish, never grim/horror (the audience skews young → heroic, not frightening). Think illuminated codex meets a refined dark game UI: deep inked backgrounds, localized golden glows, heraldic seals, dramatic depth.

**The one unforgettable thing:** the **Opening IQ** rendered as a heroic, golden, living number — the score you obsess over and show off.

---

## 3. Design tokens (starter — refine in mockups)

```css
/* Backgrounds — deep, rich, never flat black */
--bg-abyss:    #0F1015;  /* app background (inked night) */
--bg-surface:  #191B24;  /* cards, sheets */
--bg-raised:   #232636;  /* raised panels */
--hairline:    #2E3142;  /* borders, dividers */

/* Premium accent — prestige, IQ, "conquered" */
--gold:        #E3B23C;
--gold-bright: #F4CE6A;  /* glow / highlight */
--gold-deep:   #9A7A22;  /* shadow side */

/* Archetype signature colors (DNA tribes) */
--warrior:     #C0392B;  /* crimson — Aggressive Warrior */
--strategist:  #6C5CE7;  /* royal violet — Strategist */
--defender:    #1E9E6A;  /* emerald — Defender */
--trickster:   #17A2A2;  /* teal — Trickster */

/* Mastery states (ALWAYS paired with an icon/shape, see §7) */
--state-gold:  #E3B23C;  /* conquered / mastered */
--state-solid: #3FB371;  /* solid */
--state-review:#E0922B;  /* due for review */
--state-leak:  #D1495B;  /* leak / failed */

/* Text */
--text-hi:     #F3EEE2;  /* parchment white */
--text-mid:    #B9B6AC;
--text-low:    #7C7E8C;

/* Board (legible "carved stone / parchment", NOT ornate) */
--sq-light:    #E8DFC8;  /* ivory parchment */
--sq-dark:     #6E5B4A;  /* warm stone */
--sq-hint:     rgba(227,178,60,0.35); /* gold move hint */

/* Radius & space */
--r-card: 16px; --r-chip: 999px;   /* board stays sharp/square */
/* spacing scale: 4 · 8 · 12 · 16 · 24 · 32 · 48 */
```

---

## 4. Typography

Avoid generic UI fonts (no Inter/Roboto/Arial). Three roles:

- **Display (titles, ranks, kingdom names):** **Cinzel** — Roman/heraldic serif, epic and *legible*. Used sparingly for impact (rank, kingdom, "Boss Defeated").
- **Body / UI:** **Manrope** (or Hanken Grotesk) — modern, highly legible, slight character; carries all functional UI, crucial on mobile.
- **Opening IQ & key numbers:** the hero number uses the display weight in **gold**, oversized, with a glow — it must feel like treasure. Smaller stats use Manrope tabular figures.

---

## 5. Component system (the wrapper)

- **Opening IQ counter** — large, golden, animated count-up with a soft glow; the visual centerpiece of the Dashboard.
- **DNA / status cards** — precious objects: thin gold border, dramatic shadow, archetype seal in its signature color, avatar, IQ, percentile. Built to be screenshot-shared (§Flow 6).
- **World Map** — a true fantasy map: kingdoms as named territories (Italian Kingdom, Sicilian Empire, French Fortress…), conquered ones glowing gold.
- **Progress gauges** — Road to Elo and mastery as epic filling bars/rings, not flat web bars.
- **Ranks, badges, titles** — heraldic seals/medals; rank (Opening Explorer → Opening Hero) shown as a crest.
- **Session HUD** — streak as a living **flame**; the 3 daily quests framed as "missions."
- **Coach IA panel** — a bottom sheet ("the mentor's counsel"), parchment-toned, summoned during Learn/Drill.

---

## 6. Screen-by-screen (MVP)

- **S1 — Chess DNA Test:** focused and uncluttered (it's a test) but with an epic intro ("Discover your Chess DNA"). Clean central board, slim progress (e.g. "7/20"), dark premium ambiance. No nav chrome.
- **S2 — DNA Results + Card:** the *wow* moment. Staged reveal → archetype crest in its signature color → **Opening IQ** rising in gold → percentile. The DNA Card is the share artifact and first pride object.
- **S4 — Dashboard / Home (the hero's hub):** Opening IQ heroic up top (gold, animated) · Road-to-Elo gauge · streak flame · the 3 daily "missions." Bottom tab nav (Home · Map · Profile). This is the daily landing surface — it must feel rewarding to open.
- **S5 — Training (the board):** board fills the width (mobile), minimal HUD around it (current mode, line progress), actions in the thumb zone, coach sheet on demand. Move feedback: crisp correct/incorrect (color + icon), fast — **no long animation that slows drilling.**
- **S6 — World Map / S8 — Passport (V1 sketch):** the map as the exploration hub; the Passport as an illuminated codex/collection of conquered kingdoms.

---

## 7. Motion & juice

High-impact moments, not scattered micro-jitter:
- **Dashboard load:** staggered reveal; the IQ counts up with a gold glow.
- **Kingdom conquered:** epic transition to gold + a seal stamped.
- **Boss defeated:** brief epic flash + medal award.
- **Streak:** the flame grows at milestones.
- **Drilling (restraint):** correct/wrong feedback is quick and clean — juice lives on rewards and transitions, **never on every move**. The work stays focused; the celebration is around it.
CSS-first animations for performance on mobile.

---

## 8. Mobile-first rules

- Thumb-zone first: primary actions bottom, one-handed use.
- Board spans full width; controls below it.
- Bottom tab navigation; short sessions; instant resume.
- Touch targets ≥ 44px; the DNA Test and drilling must be flawless on a small screen.
- Keep payload light; prefer CSS/SVG over heavy assets.

---

## 9. Guardrails (non-negotiable)

- **Board legibility > decoration.** Always.
- **Accessibility:** AA contrast; mastery states carry a **second signal** (icon/shape), never color alone (color-blindness). Respect reduced-motion.
- **Age-appropriate:** epic/noble, not violent/horror — the audience skews young.
- **Performance:** smooth on mid-range phones; no animation that delays input during training.
- **No generic AI aesthetic:** no purple-on-white gradients, no default system fonts, no cookie-cutter card grids. Commit to the dark-gold fantasy direction with precision.

---

## 10. Mood references (describe, don't copy IP)

Illuminated medieval codex · heraldry & wax seals · refined dark game UI with localized golden light · parchment-and-ink textures · premium RPG progression screens. The feeling: *opening a treasured grimoire that happens to make you a stronger player.*

---

*Step 2 of execution. Next options: a visual mockup of one key screen (to validate the direction before coding) → then the Technical brief (architecture + database).*
