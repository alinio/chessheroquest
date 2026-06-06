# ChessHeroQuest — Game Design Document (GDD)

**Status:** authoritative game-design spec. Hand this to Claude Code alongside the existing repo docs. It supersedes/expands the game-loop section of `master-vision.md`.

**Reconciliation notes (read first):**
- **Opening IQ is the brand metric, scale 0–1000** (the DNA card on the landing shows "Opening IQ 428"). The raw test produces an internal 0–100 accuracy that is calibrated into the 0–1000 IQ. Do not change the public scale.
- **Truth rule (non-negotiable):** every score, eval, "best move", and weakness comes from **Stockfish (WASM) + an ECO/opening database + master-games stats**. **Never an LLM.** The LLM is only for flavor text/UX copy, never for chess truth.
- **Scope discipline:** this doc locks the FULL vision, but §10 bounds the **vertical slice (MVP)**. Build the slice first. Do not build 4 worlds before 1 world is validated on real testers.

---

## 1. Player journey (overview)

```
LANDING → free Chess DNA Test (20 positions)
        → Style Quiz (16 questions)
        → RESULT: Opening IQ + Chess DNA archetype + strengths/weaknesses + recommended Hero
        → HERO SELECT screen (4 heroes shown as premium cards, 1 recommended)
        → [FREE] play recommended Hero's World 1: Opening 1 (Learn + Drill) → beat Mini-Boss 1  ← first win
        → [PAYWALL] continue → Pro (all heroes/worlds, unlimited drills, Lichess, analytics)
        → WORLD MAP (Mario-style nodes) → openings → mini-bosses → World End-Boss (gauntlet)
        → World mastered → unlock next Hero → repeat
        → DAILY LOOP (SRS review + daily quest + streak) drives retention
```

---

## 2. Onboarding

### 2.1 Chess DNA Test — 20 positions (FREE, no signup to begin)

**Goal:** measure real opening skill (→ Opening IQ) AND capture a style signal (→ archetype), in ~2 minutes.

**Format:**
- 20 positions, each from the **opening phase** (≈ moves 3–10, few pieces developed — must visually read as an *opening*, not a middlegame).
- Each position presents **3–4 candidate moves** (not free move entry — keeps it fast on mobile and controls scoring).
- **Adaptive difficulty:** start at medium; a correct/strong answer raises difficulty of the next position, a weak one lowers it (puzzle-rush style). This converges on a skill estimate faster than fixed difficulty.

**Position schema (data model):**
```json
{
  "id": "pos_017",
  "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
  "opening_eco": "C50",
  "opening_name": "Italian Game",
  "side_to_move": "black",
  "difficulty": 3,            // 1–5, drives adaptive logic
  "candidates": [
    { "move": "Bc5",  "quality": 1.0, "axes": { "positional": 2, "mainline": 1 } },
    { "move": "Nf6",  "quality": 1.0, "axes": { "aggression": 2, "tactical": 2 } },
    { "move": "Be7",  "quality": 0.6, "axes": { "solid": 2, "passive": 1 } },
    { "move": "f5",   "quality": 0.2, "axes": { "risk": 3, "offbeat": 2 } }
  ]
}
```
- `quality` (0–1) = move soundness from Stockfish eval (best move = 1.0, dubious = low). Drives the **Opening IQ** score.
- `axes` = style tags. Drives the **archetype** vector (see §2.3). A move can be both sound AND stylistic (e.g. Nf6 above is good *and* aggressive).

**Example anchor positions (the full 20 require chess curation — see §11):**
1. Italian after `1.e4 e5 2.Nf3 Nc6 3.Bc4` (FEN above) — choice reveals classical(positional) vs sharp(aggressive) vs passive(solid) vs offbeat.
2. A **trap-recognition** position (e.g. avoid/spring a known opening trap) — loads the tactical/trickster axis + tests real awareness.
3. A **structure choice** (solid setup vs committal pawn push) — loads solid/positional vs risk axes.

**Scoring → Opening IQ (0–1000):**
1. Raw accuracy (0–100) = difficulty-weighted sum of `quality` over the 20 answers (harder positions answered well count more).
2. Calibrate to a **percentile** against the population of test-takers (cold-start: anchor to Lichess rating bands until you have enough data).
3. Map percentile → **0–1000** IQ. Display IQ + "Top X%" on the DNA card.
4. **Strengths/weaknesses:** group positions by opening/theme; the openings handled best = "best opening", worst = "biggest weakness". (Far more accurate later if Lichess is connected — see §9.)

### 2.2 Style Quiz — 16 questions

Subjective preference layer. **Does NOT touch Opening IQ** (keeps the score objective). Feeds the archetype recommendation + the variation-matching engine. Each style answer adds weights to the four archetype scores. Profile questions (9–16) are stored for personalization, not archetype scoring.

**Playstyle (archetype-weighted):**
1. **When you get a chance to attack, you…** — Go for the kill, even risky `[Warrior+2 risk+1]` · Build up, strike when safe `[Strategist+2]` · Stay solid, let them overextend `[Defender+2]` · Look for a shot they won't expect `[Trickster+2]`
2. **Your ideal position is…** — Sharp double-edged chaos `[Warrior+2]` · A small lasting edge `[Strategist+2]` · A rock-solid fortress `[Defender+2]` · A weird position only you understand `[Trickster+2]`
3. **A pawn sacrifice for initiative?** — Love it `[Warrior+1 Trickster+1]` · Only if sound `[Strategist+1]` · Keep my material `[Defender+2]`
4. **Vs a stronger player you…** — Complicate with tactics `[Warrior+1 Trickster+1]` · Play solid, wait for errors `[Defender+2]` · Outplay positionally `[Strategist+2]`
5. **Opening theory you'll memorize?** — A lot, I love prep `[Strategist+2]` · Some `[Warrior+1]` · As little as possible, give me a system `[Defender+2]` · I'd rather learn traps `[Trickster+2]`
6. **You win most often by…** — Attacking the king `[Warrior+2]` · Slowly squeezing `[Strategist+2]` · Punishing mistakes `[Defender+2]` · Springing a trap `[Trickster+2]`
7. **Risk appetite?** — I love sharp risky lines `[Warrior+1 Trickster+1]` · I prefer safe sound positions `[Defender+1 Strategist+1]`
8. **Openings you're drawn to?** — Aggressive gambits `[Warrior+2]` · Classical main lines `[Strategist+2]` · Solid & reliable `[Defender+2]` · Offbeat & surprising `[Trickster+2]`

**Profile (stored, not archetype-scored):**
9. Current rating? `<800 / 800–1200 / 1200–1600 / 1600–2000 / 2000+ / I don't know`
10. Target rating? (same bands)
11. How often do you play? `Daily / Few times a week / Weekly / Rarely`
12. Main time control? `Bullet / Blitz / Rapid / Classical`
13. You mostly play… `White / Black / Both`
14. Main goal? `Climb rating fast / Stop losing in the opening / Have fun / Master specific openings`
15. Biggest frustration? `I get crushed early / I don't know what to play / I blank out of theory / I get bored in slow games`
16. Connect an account for deeper analysis? `Lichess / Chess.com / Not now`

### 2.3 Scoring engine — archetype assignment

- **Style vector** = sum of archetype weights from (a) Style Quiz answers + (b) the `axes` of the moves chosen in the test. Test signal and stated signal are both used; if they conflict (plays solid but wants to attack), that gap is surfaced as a hook ("You play like a Defender but you crave attacks").
- **Recommended archetype** = highest composite score. Show a **match %** (e.g. 87%) and 2–3 bullet reasons drawn from the actual data ("You performed well in sharp positions", "You prefer attacking play", "Your biggest weakness is solid defenses").
- Players are blends; show the **primary** archetype, optionally a secondary as flavor. Deterministic: same answers → same DNA (this reproducibility is what separates it from a personality quiz).

### 2.4 Result + Hero Select screen
- Show the **DNA Card** (Opening IQ, archetype, Top %, best opening, biggest weakness) — the shareable artifact.
- Below: the **4 Heroes as premium cards** (same aesthetic as the landing archetype cards), the recommended one badged **"Recommended for you"** with the match % and reasons. The other 3 are **visible but locked**.
- **This is a CHOICE screen, not a price screen.** Pricing (Free vs Pro) is a **separate** step after the player commits to start (see §8). Never merge "which hero" with "what you pay".

---

## 3. The 4 Heroes (archetypes)

Each Hero = an identity + a style + a World (a set of openings matched to that style) + an accent color. **Opening rosters below are a proposal to validate with a chess curator; openings may appear in more than one World.** Continuity with the landing's 5 kingdoms (Italian, Sicilian, French, Caro-Kann, London) is preserved.

| Hero | Identity | Style | Accent | Proposed opening roster (4–5) |
|---|---|---|---|---|
| **Aggressive Warrior** | Attack relentlessly | aggression, risk, tactical, initiative | Crimson red | Italian Game (Evans/Fried Liver lines) [W], King's Gambit [W], Scotch [W], Smith-Morra Gambit vs Sicilian [W], Sicilian Najdorf/Dragon [B, sharp] |
| **Strategist** | Outmaneuver, then crush | positional, low risk, deep theory, mainline | Royal purple | Ruy Lopez [W], Queen's Gambit [W], Caro-Kann [B], Nimzo/QID [B], (Catalan [W]) |
| **Defender** | Unbreakable & patient | solid, counterpunch, simple systems | Emerald green | London System [W], French Defense [B], Slav [B], Petroff [B], Caro-Kann [B] |
| **Trickster** | Surprise & bewilder | offbeat, traps, surprise, low-theory | Cyan | Scandinavian [B], Budapest Gambit [B], Stafford Gambit [B], Blackmar-Diemer [W], From's/Englund Gambit [B] |

Each opening within a World has: main line, key variations, traps/deviations, and is tagged on the same style axes (used later by the variation-matching/recommendation engine).

---

## 4. Worlds & Map

Each Hero has **one World** = a Mario/Duolingo-style **node map** on a fantasy backdrop themed to the Hero's color/mood.

**Map node sequence (per World):**
```
World Gate
  → Opening 1 node → [Learn → Drill → (Review)] → Mini-Boss 1 (Opening Guardian)
  → Opening 2 node → … → Mini-Boss 2
  → … (4–5 openings) …
  → WORLD END-BOSS (Gauntlet)
  → World Mastered → unlocks the next Hero
```

**Per-opening node contains:**
- **Learn** — guided walkthrough of the main line + ideas (board + annotations from ECO/DB + engine, not LLM).
- **Drill** — spaced-repetition reps on the line's moves (see §7). Free = capped; Pro = unlimited.
- **Review** — re-do due/failed lines (SRS).
- **Mini-Boss** — the validation fight (see §5).

Nodes are locked/unlocked sequentially (you must clear node N to reach N+1), shown on the map with locked/unlocked/conquered states (matches the landing's kingdom locked/conquered visual language).

---

## 5. Boss System

**Two boss types. Bosses test OPENING LINES — never a full game to checkmate** (a full game = scope creep into Chess.com territory and off-mission). Win = navigate the opening correctly and reach a sound/favorable position.

### 5.1 Mini-Boss = "Opening Guardian" (one per opening)
You play the opening vs the engine, which throws the main line + key deviations/traps. You must respond correctly over a bounded number of moves.

| Difficulty | Moves tested | Lines | Hints | Mistakes allowed |
|---|---|---|---|---|
| **Easy** (tutorial run) | 6–8 | main line only | yes | unlimited |
| **Medium** (validation) | 8–12 | + secondary variations | few | 1 |
| **Hard** (mastery, optional) | 12–16 | + traps & deviations | none | 0 |

- **Side** = the side the opening belongs to (London = White only; Caro-Kann = Black only). Do **not** force both colors.
- **Validation rule (recommended, less grindy than "beat all difficulties"):** beating **Medium** validates the opening and advances the map. **Easy** is the guided tutorial; **Hard** is optional for a Mastery badge + Opening IQ bonus. *(This is a deliberate softening of the original "beat all 3 difficulties + both colors" idea — that's a retention killer. Flag if you disagree.)*

### 5.2 World End-Boss = "Gauntlet" (one per World)
The climax. The boss runs you through **~10 variations** drawn from the World's openings, **under a time limit**, on the **side(s) the World actually covers** (both colors only if the World mixes White openings and Black defenses). Clear all to conquer the World.

| Difficulty | Variations | Time | Lives (mistakes) |
|---|---|---|---|
| Easy | ~6 | generous | 3 |
| Medium (validation) | ~10 | moderate | 2 |
| Hard (mastery) | ~12 | tight | 0 |

- Beating **Medium** = World mastered → unlocks the next Hero + a Passport seal. **Hard** = optional Mastery.
- **Retries always allowed.** A single slip must never wipe all progress (rage-quit prevention).

### 5.3 Rewards (no shop currency for now — that layer is dropped)
- XP, a **Badge**, a **Passport seal**, map progression, and an **Opening IQ increase** *only if real skill is validated* (so IQ stays meaningful, not a participation trophy).

---

## 6. Progression & Unlock rules

- Player starts with **1 Hero** (the recommended one) unlocked. The other 3 are **visible but locked**.
- **Unlocking other Heroes:** via **Pro** (all unlocked immediately). The earlier "earn a 2nd Hero free by finishing a World" idea is **removed** (it made free too generous and invited multi-accounting).
- **Opening Passport** = collect a seal per opening mastered (matches the landing). Long-term collection goal.
- **Anti-abuse:** intentionally light. The real Pro value is **continuity-based** (your SRS history, Opening IQ trend, Lichess-linked progress) — multi-accounting can't fake that, so the exploit isn't worth anyone's effort. Just require an email to save progress. Do not build fraud detection pre-launch.

---

## 7. Daily Loop (retention)
Keep it doable in **5–10 minutes**:
- **SRS Review** — your due/failed opening lines resurface for reps (spaced repetition). This is the core "you actually remember your openings" mechanic.
- **One Daily Quest** — simple, review-based (e.g. "Review 10 due lines", "Beat the Medium Boss in the London node"). Achievable daily.
- **Streak** — day streak counter (the gamified habit; matches the step-3 mockup on the landing).
- Quests give XP / streak / Passport progress (no currency for now).

---

## 8. Plans — LOCKED

"Which Hero" (a choice) and "What you pay" (Free vs Pro) are **separate screens**. One clean pricing ladder — no à-la-carte character purchases.

| | **Free** | **Pro** — $9.99/mo · $79/yr · $129 lifetime |
|---|---|---|
| Chess DNA Test + result (Opening IQ, archetype, weakness, recommended Hero) | ✅ | ✅ |
| DNA Card (shareable) | ✅ | ✅ |
| Recommended Hero — Opening 1 (Learn + Drill) | ✅ (drills capped, ~20/day) | ✅ |
| Mini-Boss 1 (the first win) | ✅ | ✅ |
| Opening 2+ , World End-Boss, all map nodes | ❌ | ✅ |
| All 4 Heroes / Worlds | ❌ (locked) | ✅ |
| Unlimited drills + full spaced-repetition across all openings | ❌ | ✅ |
| Lichess sync (real-game analysis & drills) | ❌ | ✅ |
| Deep analytics dashboard (IQ trend, weakness map, Road to Elo) | ❌ | ✅ |
| Opening Passport, badges, daily quests/streak | partial | ✅ |

**Paywall placement:** immediately **after the first Mini-Boss win** (peak engagement / dopamine), not before it.

**Pro's pitch is not "unlock the game" — it's "the tools that actually make you improve and let you see it."** (Unlimited practice + truth from your real games + a dashboard that tells you exactly what to fix.)

---

## 9. Data & truth
- **Stockfish (WASM, client-side)** — move quality, evals, boss responses, "best move".
- **ECO + opening database + master-games stats** — opening names, main lines, variation trees, popularity/win-rates (powers Learn, the boss line-trees, and recommendations).
- **Lichess API (OAuth, Pro)** — pull real games → real repertoire, real weaknesses, drills from the player's own opening blunders, before/after improvement tracking. (Lichess first; chess.com API is more restrictive.)
- **LLM** — UX copy / flavor only. **Never** computes a score, eval, or weakness.

---

## 10. Build order (respect the vertical slice)

**Phase 0 — Vertical Slice (MVP). Build ONLY this first:**
- Chess DNA Test (even ~10 curated positions to start) + Style Quiz + scoring → Opening IQ + archetype.
- Result screen + DNA Card + Hero Select (4 cards, recommended).
- **One Hero, one Opening:** Learn + Drill (with SRS) + one **Mini-Boss** (Medium).
- Free→Pro paywall after the first win; Pro unlock flow (Paddle).
- Ship to ~20 real testers. **Does the loop hook? Do they come back day 2?** This is the go/no-go gate.

**Phase 1:** complete World 1 (all its openings + World End-Boss), Lichess sync, analytics dashboard, 2nd Hero unlock.

**Phase 2:** all 4 Worlds, daily quests + streak, Opening Passport, polish.

**Phase 3 (later, previously dropped):** cosmetic shop, single soft currency, item rarities, seasons. Only after retention is proven.

---

## 11. Open items needing chess curation (not code — content)
These are the real bottleneck; flag them as content work, derive programmatically where possible (ECO/DB/engine) and hand-curate the rest:
- The **20 test positions** with tagged candidate moves (sound + style-tagged).
- Each opening's **main line + variation tree + traps** (for Learn, Drill, and boss line-trees).
- Final **opening rosters per Hero** (validate the §3 proposal).
- **Calibration data** for the Opening IQ percentile (cold-start from Lichess rating bands).
