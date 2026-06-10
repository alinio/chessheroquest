# SaaS Presentation Spec — the pedagogical loop, screen by screen

> Companion to `DESIGN.md` (visual authority) and `docs/master-vision.md` (product
> authority). This spec freezes HOW the app presents itself: the learning loop,
> the onboarding, the daily-return mechanics, and the content voice. Written
> 2026-06-11 alongside the Today-cockpit / Quest-map / onboarding implementation.

## 1. The product in one sentence

A player **works** their chess openings (Learn), **fixes** them into memory
(Drill, FSRS), **proves** them in quests against Opening Guardians (Boss), and
**seals** each validated opening into their Passport — 20 seals, one repertoire.

Everything on screen must serve one of those four verbs. If a surface doesn't
advance Learn → Drill → Prove → Seal, it doesn't ship.

## 2. The two registers (visual law — see DESIGN.md)

- **Cathedral**: arrival, DNA reveal, conquest, boss victory, paywall, share cards.
- **Workbench**: drilling, Insights, Passport, settings.
- **Today/Train** is the only sanctioned hybrid: cathedral band (the day's single
  directive over the realm illustration) above a workbench row (the 3 daily
  missions from the real quest engine).

## 3. Onboarding (pedagogy before mechanics)

1. **Anonymous funnel**: `/dna-test` (free, no signup) → result + archetype +
   IQ → hero-select → paywall → `/welcome` (ArrivalScreen: the coach's diagnosis,
   board-first — "We found where you're losing").
2. **First hub visit**: the `HowItWorks` overlay (src/ui/onboarding/HowItWorks.tsx)
   presents the 4-verb loop once — Learn / Drill / Prove / Seal — with the
   promise line: *"5 minutes a day. Your Opening IQ only rises when you actually
   improve."* Dismissed → persisted (`chq.howitworks.v1`), never shown again.
3. **No-DNA fallback**: `/train` without progress renders the first-quest hero
   ("Your quest begins — take the Chess DNA Test"), never an empty dashboard.

## 4. The daily-return engine (Today = /train)

Server-wired to real state (`getProgress`, `getDueCount`, `getOpeningMastery`,
`pickFocusOpenings`) — never fixtures in production paths.

| Zone | Content | Source |
|---|---|---|
| HUD | streak flame (with "Streak lost — relight it today" state) · Level + XP progress | `isStreakAlive`, `xpProgress` |
| Hero | ONE directive: "N drills due" → `/review`, or "All clear — push X" → learn | `dueCount`, focus |
| Missions | Daily Quest (+50 XP) · Weakness Battle (+40 XP) · Boss Fight (+150 XP) | `generateDailyQuests` — real rewards, real targets |
| Road | Road to Elo sliver + strongest line | `eloGoal`, IQ |
| Coach | one line, names the next opening | focus |

Return mechanics: streak (loss-state is visible, relighting is one tap away),
due cards (FSRS makes tomorrow's session exist by design), missions reset daily,
the next seal is always named. **Never** energy gates, never fake urgency (LAW #5).

## 5. Validation of learning (the credibility core)

- Mastery states per opening: `leak → review → solid → gold` (engine-computed,
  color + icon, never color alone).
- **Prove** = the Guardian fight: a player only seals an opening by performing
  its lines under test conditions — not by watching, not by time spent.
- Opening IQ rises only with real competence (LAW #1) and is recalibrated by
  synced real games (Lichess/Chess.com) on Insights — "proof it's working".
- The Passport is therefore a **certificate**, not a sticker book: 1 seal =
  1 opening validated against its Guardian.

## 6. Content voice — the coach-herald (see DESIGN.md)

Diagnosis + lore, in that order. Numbers carry consequences; CTAs name their
target; fantasy names the containers, never the chess. Reference lines:
"We found where you're losing." · "Fix my Sicilian →" · "Win it → a seal in
your Passport." · "Tracked from your synced real games — proof it's working."

## 7. Known gaps (honest backlog, ordered)

1. **Real-data wiring**: `/quest`, `/insights`, `/realms` still render demo
   fixtures (TODO(real-data) markers in pages). The Quest map needs per-user
   node states from `getOpeningMastery` + realm progression.
2. **Boss fight surface**: the Guardian fight exists as `/boss` demo; the
   Prove step needs its production route + win→seal write path.
3. **Starter-path coverage**: 12 curated paths for 20 openings — 8 openings
   (scotch, smith-morra, ruy-lopez, nimzo-indian, catalan, english, petroff,
   stafford, blackmar-diemer) have no learnable line yet (`OPENING_TO_PATH`
   falls back to `/review`).
4. **Mobile bottom-tab nav**: LAW #4 says mobile-first; the hub rail simply
   hides under 880px with no bottom tabs replacement.
5. **Assets**: portrait variants for the 5 app backgrounds (16:9 sources crop
   ~60% on phones); `_raw/` masters out of `public/`; orphan purge (~120 MB)
   — see audit 2026-06-11.
6. **R1 editorial asymmetry** (Insights/Profile magazine layout) — deliberate
   risk, not yet taken.
