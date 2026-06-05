# OPENING HERO — MASTER PRODUCT DOCUMENT (FINAL — FROZEN)

> **The Duolingo of Chess Openings.**
> Definitive, frozen product vision. Built on the validated Founder Final Vision (breadth-first mission, single North Star, Chess DNA Test, Opening Collection, Road to Elo).
> **Final validated additions integrated:** Weekly Progress Report (§29), Strategic Data Moat (§30), Hall of Fame (§28.15, V3). **Rejected (final):** Chess Legends (§0). **Status:** frozen — next phase is execution, not ideation.

---

## 0. Status

- **FROZEN.** The product vision is final and no longer open to ideation. Future changes only from real user feedback or market data.
- Founder decisions settled (mission, North Star, DNA Test, collection, Road to Elo, pricing).
- The Opening IQ **formula** is specified (§4) — the design is complete; only constants remain to calibrate (§27).
- Non-negotiables: Opening IQ correlates with real strength (§4.1); hidden SRS engine (§18); cadred AI (§17); engage-through-value gamification (§12.0); **social = multiplier over a proven learning core, never the core (§28.0)**.
- **Final validated additions (integrated):** Weekly Progress Report (§29, V1) · Strategic Data Moat formalized (§30) · Hall of Fame (§28.15, V3).
- **Rejected — final, for traceability:** *Chess Legends* ("You are Kasparov / Tal / Fischer"). Reasons: credibility risk with the chess community, mockery risk, style/strength confusion, and dilution of Chess DNA. **Chess DNA archetypes remain the sole identity framework. No Chess Legends layer is to be added.**
- **Next phase = execution** (landing page, user flows, UX/UI, database & technical architecture, Claude Code dev plan, MVP build order). Future work is execution quality, not new product concepts.

---

## 1. Vision & mission

The Duolingo of Chess Openings. Mission: help players **discover, master, and remember openings forever**, build a complete opening culture, and become an *Opening Hero*. The long-term vision is breadth — "become capable of understanding and playing many openings," not "master one repertoire." There's always a new opening to explore → natural 12-month+ retention (content never runs out). Elo gain is the **consequence**; opening mastery is the **core mission**.

---

## 2. Positioning

- **Advertised promise (converts cold traffic):** *"Stop losing in the opening. Gain Elo faster."*
- **Vehicle that delivers it (retains):** *"Master the World of Chess Openings."*

Pain hook outside (ads, landing); mastery vision inside (product + 12-month retention).

---

## 3. Core belief & the big idea

Most players know only a few openings and play them for years. Opening Hero **democratizes openings** and turns study into an adventure across the whole world of openings. **Every opening is collectible** — mastery becomes like collecting Pokémon; completing the collection is a core engagement engine (§12.6, §28.2).

---

## 4. North Star — Opening IQ + the formula

Single obsession metric (scale **0–1000**), distinct from real Elo. No second score. A separate calibration projects IQ → estimated real-Elo impact, powering Road to Elo (§5).

### 4.1 Founding law (non-negotiable)
**Opening IQ may only rise when real opening competence rises.** No IQ for time spent or volume. The formula honors this even though the mission is breadth-first.

### 4.2 Components (all frequency-weighted)
Coverage (answers for lines you'll face) · Depth (how deep you hold) · Retention (truly remember vs just learned — FSRS) · Accuracy (on the lines opponents really play).

### 4.3 The formula (bottom-up)
**L1 — Position mastery:** `m_pos = retention × accuracy` — `retention∈[0,1]` from FSRS stability (decays if unreviewed → "use it or lose it"); `accuracy` = recent success rate. Cramming contributes little.
**L2 — Opening mastery:** `M_opening = Σ(freq_i × m_pos_i)` over the tree, `freq_i` = real line frequency (Lichess), normalized so frequent branches dominate; depth **saturates** beyond a useful point.
**L3 — Global Opening IQ:** `Opening IQ = calibrate( Core + BreadthBonus )`
- **Core** = frequency-weighted mastery of what you **actually face with your own repertoire** → wins games → correlates with Elo. The bulk of the score.
- **BreadthBonus** = reward for openings mastered **beyond** the core (the collection), with **(1) diminishing returns** (log/√ in number of extra openings) and **(2) a cap proportional to Core** (`BreadthBonus ≤ k × Core`). Depth on what you play stays the gate; **breadth is the dessert, not the meal.**

This rewards breadth (mission + retention) **without ever decoupling the score from real Elo.**

### 4.4 Calibration to Elo
Bootstrap with declared Elo + DNA Test; refine by regressing IQ against observed real Elo as the user base grows (and via optional account linking) → IQ becomes an increasingly accurate strength predictor = **the moat** (formalized as a dedicated section in §30). Exact constants (saturation depth, `k`, decay, weights) are **fit on real data**, not set a priori.

### 4.5 A living score
Retention decays via FSRS → IQ **drops if you stop training** (drives daily return, keeps the score honest — you maintain mastery, you don't bank it). Decay is gentle, not punitive. Ties the IQ to streak + daily loop.

### 4.6 Seeded by the Chess DNA Test
20 adaptive positions → initial Core estimate → initial IQ (communicated as an estimate, refined by use).

---

## 5. Road to Elo

The destination, not the product. User picks Road to 1000/1200/1500/1800. Opening IQ is the **gauge**; a **projected Elo impact** shows ROI; an **optional linked account** overlays the real Elo curve. One North Star (IQ), one destination (Elo goal); mastery is the vehicle.

---

## 6. Chess DNA Test (front door)

Branded **"Discover your Chess DNA"** (identity curiosity → virality). Generates: Opening IQ, playing style, **Chess DNA archetype**, best/weakest opening, global percentile, recommended path.

---

## 7. The funnel (viral loop)

DNA Test (2 min) → Results (IQ + archetype + strengths/weaknesses, honest test-derived wording) → **Generate My DNA Card** (shareable, §11, §28.12) → Personalized path ("Road to 1200…") → free account.
*Optional later booster (never required):* link Chess.com/Lichess to sharpen diagnosis + show real Elo.

---

## 8. Landing page

- **Headline:** Stop Losing In The Opening
- **Subheadline:** Discover your Chess DNA. Train your weaknesses. Gain Elo faster.
- **CTA:** Take The Free Chess DNA Test

---

## 9. Choose your identity (DNA archetypes)

Pick a style, not an opening. Each unlocks a coherent, playable ready-made repertoire:

| Archetype | Unlocks (example) | Style |
|---|---|---|
| Aggressive Warrior | King's Gambit, Evans Gambit, Sicilian Dragon | Attacking |
| Strategist | Queen's Gambit, Catalan, London | Positional |
| Defender | Caro-Kann, Slav, Petroff | Solid |
| Trickster | Englund, Scandinavian, Budapest Gambit | Surprise |

The Core repertoire (an answer to each frequent reply) is what you start mastering; new kingdoms add breadth over time.

---

## 10. Opening World Map & Collection

Each opening is a **kingdom** that colors in as mastered (fragile → solid → conquered/gold). **Launch with ~20 of the most-faced openings below 1500.** Concentration is the anti-encyclopedia strategy. The map *is* the collection; completing it is the long-term quest.

---

## 11. Social-sharing pillar

Every moment of pride = a clean, branded, shareable card (DNA Card, level-up, rank/league promotion, boss defeated, streak milestone, Road progress). One-tap to X/Reddit/Discord/IG; each carries a back-link to the free DNA Test → **every share is an acquisition channel.** Operationalized in the social layer (§28).

---

## 12. Gamification & engagement inventory

### 12.0 Guiding principle
**Engage through value, not manipulation.** Every mechanic rewards real learning (§4.1). **No paid gambling-style loot boxes** (large young audience). Cosmetics fine; random paid crates no. No energy/timer gating.
*Legend: ✅ in concept · ➕ add · ⚠️ care · phase (MVP/V1/V2).*

- **12.1 Progression & mastery** — ✅ Opening IQ (MVP) · ➕ Road to Elo goal gradient (MVP) · ✅ XP & levels (MVP) · ✅ progress gauges (MVP) · ➕ progressive unlocks (V1) · ✅ skill map (V1) · ➕ celebrated milestones (MVP/V1).
- **12.2 Social comparison** — ➕ weekly leagues (V2) · ➕ friend/league leaderboards (V2) · ➕ percentile "Top X%" (MVP on card) · ➕ rivalries (V2) · ⚠️ no all-time global ladder.
- **12.3 Status & identity** — ✅ badges (V1) · ✅ titles (V1) · ➕ avatar/profile (V2) · ➕ shareable cards (MVP card, V1+) · ➕ trophy case (V2).
- **12.4 Habit loops** — ✅ streak on training done (MVP) · ✅ daily quests (MVP) · ➕ reminders (MVP/V1) · ➕ streak freeze (V1) · ⚠️ no energy/lives.
- **12.5 Reward** — ➕ celebration juice (MVP/V1) · ➕ surprise bonuses for clearing weaknesses (V1) ⚠️ reward the right action · ➕ cosmetic loot earned/bought (V2) · ⚠️ no random paid loot boxes.
- **12.6 Investment & collection** — ➕ opening collection / passport (V1 solo, V2 social) · ➕ cosmetics (V2) · ✅ stored progression = lock-in · ✅ something you build.
- **12.7 Scarcity & FOMO** — ➕ seasonal bosses/seasons (V2) · ➕ season pass (V2) ⚠️ earned not paid-to-skip · ➕ limited launch Lifetime.
- **12.8 Challenge & flow** — ➕ adaptive difficulty (MVP test, V1) · ✅ boss fights (V1) · ➕ perfect-run modes (V1).
- **12.9 Meaning & narrative** — ➕ the quest / becoming Opening Hero (MVP framing) · ✅ archetypes (MVP) · ✅ light lore (V1).
- **12.10 Feedback** — ✅ instant correction + AI "why" (MVP) · ✅ clear state viz (MVP/V1) · ➕ sensory juice (V1).

---

## 13. Daily loop (≈ 5 min)

1. **Daily Quest** — ~10 due positions (SRS) — +XP
2. **Weakness Battle** — targeted drill on weakest/red opening — +XP
3. **Boss Fight** — one opening challenge (sparring) — +XP

Algorithm-generated (due cards, red lines, progression), AI-worded to motivate.

*(Weekly cadence: see the Weekly Progress Report, §29.)*

---

## 14. Bosses & seasonal bosses

- **Standard boss** per opening: final mastery test → badge + kingdom turns gold; defines "mastered."
- **Seasonal bosses** (monthly): themed multi-opening challenges → exclusive limited title; FOMO + monthly return. ⚠️ Must require mastering *real, frequent* openings.

---

## 15. Training mechanics

**Learn** (line + AI explanation) · **Drill** (recall + instant correction) · **Review/SRS** (FSRS — retention core) · **Sparring** (full opening vs frequency-weighted opponent).

---

## 16. Ranks & leagues

**Two distinct systems, both anchored on the Opening IQ — no parallel competing scores:**

- **Progression ranks (identity, absolute):** thematic tiers tied to **Opening IQ thresholds**, displayed everywhere (profile, cards, comments):
  Opening Explorer → Opening Hunter → Opening Scholar → Opening Strategist → Opening Master → Opening Grandmaster → Opening Legend → **Opening Hero**.
  Your rank reflects your real mastery level (since IQ is Elo-correlated). *(The rank logic is simple/MVP; public display is V2.)*
- **Weekly leagues (competition, relative):** ~30 players of similar level, promotion/relegation, points earned by training (obey the founding law). **V2** (needs player volume).

---

## 17. AI usage (minimal, cadred)

Engine (Stockfish) + database (Lichess) = truth. **The LLM never decides or evaluates a move.** It only explains a move, explains *why* a mistake is wrong, and words quests/paths. Pipeline: {FEN, move, eval, Lichess stats, ECO, level} → Claude → explanation. **All explanations cached & shared** → token cost → ~0.

---

## 18. Hidden engine — Spaced Repetition (FSRS)

Each position the player must answer is an SRS card; **FSRS** schedules reviews optimally. Invisible (behind quests/IQ/map), it makes learning stick, feeds the *Retention* component (§4.2), and makes the IQ a *living* score (§4.5).

---

## 19. Technical architecture

**App:** Next.js · Vercel · Neon/Postgres · Paddle · Anthropic API.
**Chess bricks (free/OSS):** react-chessboard/chessground · chess.js · **Stockfish WASM (client-side)** · **FSRS** · **Lichess Opening Explorer API** + ECO PGN.
**Flow:** engine + Lichess = truth → server composes context → Claude explains → cache.

---

## 20. Data model (core entities)

User · PathTemplate · UserRepertoire · Node (FEN, move, parent, player/opponent flag, frequency, eval, ECO) · Card (FSRS state) · Quest · Mastery (red/orange/green/gold) · OpeningIQSnapshot (history + Core/Breadth breakdown) · EloGoal · DNAResult (archetype, percentile) · ShareableCard · Achievement/Title · AIExplanationCache · **PublicProfile** (visibility setting; *private by default for minors*) · **OpeningPassport** (mastered/locked kingdoms, completion %) · **Follow/Friendship** · **Rival** (weekly assignment) · *(V2/V3)* LeagueMembership, SeasonalEvent, InventoryItem (cosmetics), Guild/Clan.

---

## 21. Pricing (final)

| Tier | Price | Includes |
|---|---|---|
| **Free** | $0 | Chess DNA Test, 1 path, basic training, basic gamification, shareable DNA card |
| **Hero Pro (monthly)** | **$9.99/mo** | Unlimited openings/paths, all modes, boss + seasonal bosses, advanced stats, Road tracking, full social |
| **Hero Pro (annual)** | **$79/year** (~$6.6/mo) | Same — retention/cash-flow sweet spot |
| **Lifetime** | **$129 — limited launch offer only** | Everything, forever — early-bird cash; capped & time-boxed |

Recurring is the core model; Lifetime at $129 sits well above the $79 annual so it doesn't cannibalize. Keep it capped and time-boxed.

---

## 22. Why people stay 12 months

They pay for **progression**: a climbing Opening IQ, an unbroken streak, kingdoms to conquer, seasonal bosses, the Opening Hero rank, and the **pride of a public opening identity they want to share** — and there's always a new opening to discover. Progress lives in the account → lock-in, as long as the founding law holds and they genuinely get stronger.

---

## 23. Acquisition / GTM

Advertise the pain hook + free DNA Test (not the dominated head term).
- **Google Ads:** "free Chess DNA test" angle + long-tail. Validate volume/CPC in Keyword Planner.
- **Meta Ads:** DNA card shareable → manufacturable intent (founder's turf).
- **Viral loop:** the social flywheel (§28.14) — every shared card/profile back-links to the test.
- **Content/community:** YouTube, r/chess, r/chessbeginners, TikTok traps.
- **SEO long tail:** one page per opening. **Affiliates:** chess creators (Tolt).

---

## 24. Risks & guardrails

| Risk | Guardrail |
|---|---|
| Breadth-first decouples IQ from real Elo | Core/BreadthBonus formula §4.3 (diminishing returns + cap) |
| Over-promising "gain Elo" | Founding law §4.1 + calibration §4.4 |
| Becoming an encyclopedia | ~20 focused openings at launch |
| **Collection ranking rewards speed/volume** | **Ranked on *mastered* kingdoms only (gold = boss + retention); "fastest progress" removed (§28.7)** |
| **Parallel ladders dilute the North Star** | **All ranks/leaderboards anchor on Opening IQ (§16, §28)** |
| **Social cold start (empty = dead)** | **Social layer almost entirely V2/V3; ship after the core is proven (§28.0)** |
| **Drifting into a social network** | **Social = multiplier, not core; don't fight Chess.com's network (§28.0)** |
| **Public profiles + minors** | **Profiles private by default for minors; moderation; COPPA/GDPR-K (§28.1)** |
| Over-gamification / dark patterns | Engage through value §12.0; no paid loot boxes; no energy gating |
| Lifetime cannibalizes recurring | $129, capped & time-boxed |
| SRS forgotten | Hidden FSRS engine §18 |
| RPG/social polish buries the core | Build order: engine first §26 |
| AI token cost | Shared explanation cache §17 |

---

## 25. Success metrics

- **Test→signup conversion** + **DNA card share rate / viral coefficient**
- **Activation:** % finishing onboarding + first quest
- **Retention D1/D7/D30** (queen metric)
- **Opening IQ progression** (must correlate with retention)
- **Passport completion** over time (breadth/collection engagement)
- **Free→paid conversion**, churn, LTV
- **Guardrail metric — real-strength signal:** self-reported or linked Elo gain. *Social/vanity metrics never replace this; if IQ and real Elo diverge, the product is failing regardless of engagement.*

---

## 26. MVP scope & build order (Claude Code)

> Realistic: a few weeks. MVP proves: DNA Test → IQ → card hook converts & spreads; drill+SRS makes people stronger; daily loop + Road frame build the habit.

1. **Board core** — react-chessboard + chess.js; load **one path** (2–3 curated openings).
2. **Chess DNA Test** — 20 adaptive positions → initial IQ + archetype **+ shareable DNA Card** (prioritize — viral hook).
3. **Drill mode + FSRS** — cards per position, scheduling.
4. **Opening IQ engine (Core only)** — L1–L2 + Core of L3 (§4.3); BreadthBonus deferred. Live recompute.
5. **Road to X Elo + Daily loop (minimal)** — goal selection, Daily Quest (SRS) + Weakness Battle (drill) → XP + streak + IQ-tier rank.
6. **Dashboard** — IQ obsession graph + Road progress.
7. **AI coach** — FEN+eval+stats → Claude (cached), for Learn + mistake explanations.
8. **Auth + Paddle** — Free / Pro monthly+annual (+ Lifetime launch offer).

**Phasing of everything else:**
- **V1:** BreadthBonus (after Core calibrates), boss fights, full World Map UI, all 20 openings, Opening Passport (solo view), milestone-share cards, specialized titles.
- **V2:** public profiles, friend system, profile comparison, weekly leagues, collection ranking (mastery-based), DNA leaderboards, kingdom showcase, seasonal competition, weekly rivalries, cosmetics, season pass, optional account import.
- **V3:** clans/guilds.

---

## 27. Open questions (calibration-level)

1. **IQ constants** — saturation depth, breadth cap `k`, decay rate, weights → fit on data (defaults at launch).
2. **The ~20 launch openings** — final list by real frequency below 1500.
3. **Paths** — exact opening set per archetype (must be playable).
4. **"Mastery" threshold** — FSRS stability/accuracy bar to turn a kingdom gold / beat a boss (also gates collection ranking).
5. **IQ-tier rank thresholds** — the Opening IQ cutoffs for Explorer → … → Opening Hero.
6. **Projected Elo impact** — display that informs without over-promising.
7. **Minor-safety defaults** — profile visibility, comparison, and data exposure rules for under-18s.
8. **Lifetime offer** — cap (number) and time-box (window).

---

## 28. Social Competitive Layer (V2 → V3)

### 28.0 Principle & guardrails
Improvement should be **visible** — status retains harder than XP. But: **social is a multiplier over a proven learning core, never the core.** Do **not** drift into "a chess social network" — Chess.com owns network effects with 100M+ users; that fight is lost. Three rules govern this entire layer:
1. **Anchor everything on Opening IQ.** No parallel competing scores.
2. **Reward mastery, never speed/volume.** Collection standings count *mastered* kingdoms (gold = boss + retention), never raw or fast collection.
3. **Phase almost everything to V2/V3.** A social layer is empty and depressing without player volume; ship it only after the core retains.

### 28.1 Public player profile *(V2)*
`openinghero.com/<user>` showing Opening IQ, Chess DNA, rank, Road to Elo, openings mastered, kingdom collection, seasonal titles, achievements, streak, percentile. **Private by default for minors; minor-safety + moderation built in from day one.**

### 28.2 Opening Passport *(solo V1 · social V2)*
A checklist of mastered vs locked kingdoms with completion % (e.g. 12/20). A primary collection mechanic — players want to complete it (Zeigarnik). Counts **mastered** kingdoms only.

### 28.3 Friend system *(V2)* — follow, compare; no messaging needed.
### 28.4 Profile comparison *(V2)* — side-by-side IQ / kingdoms / streak → natural competition.

### 28.5 Progression ranks *(see §16)*
Thematic tiers (Opening Explorer → Opening Hero) tied to **Opening IQ thresholds** — identity displayed everywhere.

### 28.6 Specialized titles *(V1/V2)*
From bosses/mastery: London Grandmaster, Dragon Slayer, French Fortress Master, Catalan Expert, Opening Collector. Public, permanent prestige.

### 28.7 Collection standings *(V2 — corrected)*
Ranks on **kingdoms genuinely mastered** (gold-validated by boss + retention). **"Fastest collection progress" is removed** — it rewarded cramming and broke the founding law. This lets players compete on breadth *without* incentivizing shallow farming.

### 28.8 DNA leaderboards *(V2)*
Per-archetype rankings **ranked on Opening IQ within the archetype** (not a new metric). Players identify with their archetype → tribes.

### 28.9 Kingdom showcase *(V2)* — visual map of conquered (gold) kingdoms; a prestige object.

### 28.10 Seasonal competition *(V2)*
Monthly seasons (Kasparov, Tal, Fischer, Morphy) with seasonal leaderboard + boss + exclusive, no-longer-obtainable titles → FOMO.

### 28.11 Weekly rivalries *(V2)*
System assigns 3 rivals of similar IQ/progress; beat them for bonus XP. Lightweight competition, no direct PvP.

### 28.12 Shareable status cards *(DNA card MVP · rest V1/V2)*
Players share **status**, not training: "Opening IQ 600 reached," "New rank unlocked," "Kingdom conquered," "100-day streak," "Top 10% Strategist," "Dragon Slayer." Each card carries avatar, DNA, rank, IQ, progress + a back-link to the test (§11).

### 28.13 Clans / guilds *(V3)*
Optional opening guilds (The Sicilian Brotherhood, The London Society) with shared XP, challenges, seasonal rankings → long-term community retention.

### 28.14 The social flywheel
DNA Test → DNA Card → share → friends compare → friends join → profiles built → kingdoms collected → titles earned → milestones shared → new users discover Opening Hero → repeat. **Pride in one's opening identity is the engine: the prouder players are, the more they share, the faster the product grows.**

### 28.15 Hall of Fame *(V3)*
A prestige showcase, **V3 only** (requires a large user base — a Hall of Fame with few players is meaningless). Rules: must reward **real mastery**, never pure activity volume; must **never** become a single unreachable global leaderboard. Multiple attainable doors to prestige:
- **Seasonal Champions** · **Highest Opening IQ** · **Kingdom Masters** · **DNA Archetype Champions** · **Opening Hero Legends**.
Prestige must remain aspirational **and attainable** (seasonal renewal + per-archetype + per-category entries), not one inaccessible summit.

---

## 29. Weekly Progress Report (V1)

A weekly ritual that creates a recurring return trigger and extra shareable moments. Delivered weekly (in-app + email/notification, clean opt-out).

**Example — "Weekly Opening Report":** +17 Opening IQ · +2 Kingdoms Conquered · +1 Boss Defeated · Road to 1200: 58%.

**Rules (non-negotiable, per the founding law §4.1):**
- Celebrate **real progression**, never activity volume. **No** "moves played", "time spent", or grind metrics.
- Stay **motivating even in a weak week**: if progression is low (including the natural decay of the living score, §4.5), focus on comeback opportunities and the next achievable goal — **never highlight regression**.
- One well-made weekly touchpoint, not daily spam; GDPR-clean opt-out.
- Shareable as a status card (§11, §28.12) → feeds the flywheel (§28.14).

---

## 30. Strategic Data Moat (long-term competitive advantage)

The moat is **behavioral and longitudinal.** It does **not** exist on day one; it compounds as the user base grows.

**The moat is NOT:** opening knowledge · Lichess data · "more chess data than Chess.com" (impossible — they own the games of 100M+ players).

**The moat IS** the proprietary, aligned data that no one else collects in this form:
1. The relationship between **opening mastery and actual Elo progression** — calibrating Opening IQ into an ever-more-accurate predictor of real strength.
2. **Aggregated FSRS retention and forgetting curves** across openings and positions — what's hardest to remember, the most common leaks by level, the optimal learning order.
3. The growing ability to **predict which training actions generate the highest Elo gains** per unit of effort — a curriculum advantage competitors can't shortcut.
4. The **AI explanation cache** (§17) — marginal cost trending toward zero, a durable cost advantage over any new entrant.

**Implication:** the moat is a reason to win over the **long term**, not a reason to exist at launch. At day zero there is no moat — it is earned at scale. It therefore does **not** substitute for winning the acquisition battle first (the DNA Test funnel, §7, §23). Every retained, progressing user makes the prediction engine sharper and the product harder to replicate.

---

*Master document — FINAL, FROZEN. Concept complete end-to-end; §27 is empirical calibration, not design. Next phase: execution.*
