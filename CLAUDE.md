## Product & design source of truth (read before coding)
- docs/game-design-doc.md        — game logic, plans, scoring, build order
- docs/art-direction-bible.md    — design tokens, dimensions, assets, Higgsfield rules
- docs/opening-boss-catalog.md   — openings, variations, bosses, design briefs
- docs/screen-wireframe-spec.md  — exact screen-by-screen layouts
- docs/in-app-architecture-spec.md — logged-in shell, navigation, section map, connective screens (post-auth/Pro)
- docs/chess-curation-spec.md     — chess content data contract (test positions / line trees / explorer; truth = curated data + engine, NEVER an LLM)


# CLAUDE.md — ChessHeroQuest.com

> **What this is.** ChessHeroQuest is the Duolingo-meets-RPG of chess openings (vision docs may call it "Opening Hero" — same product, renamed). Players take a free **Chess DNA Test**, get an **Opening IQ**, pick a **Road to Elo**, and conquer **opening kingdoms** through daily quests, drilling, bosses, ranks and leagues. It sells **progression**, not knowledge.

This file is the shared brain for all agents. Read it before doing anything. The full vision is frozen in `docs/master-vision.md`; flows in `docs/user-flows.md`; design in `DESIGN.md`; code structure in `ARCHITECTURE.md`.

---

## THE LAWS (non-negotiable — never violate, no exceptions)

1. **Opening IQ must correlate with real playing strength.** It rises only when real competence rises — never for time spent or volume. It is computed `calibrate(Core + BreadthBonus)` where breadth has diminishing returns and is capped by Core (see `docs/master-vision.md` §4). Any feature that lets IQ climb without real improvement is a bug.
2. **Engine + database = truth. The LLM NEVER decides or evaluates a chess move.** Move legality/lines/frequencies come from chess.js + the Lichess Opening Explorer API + ECO data; evaluations come from Stockfish. The AI (Claude API) only *explains* in natural language, from verified inputs, and its output is cached. Never source chess truth from model knowledge.
3. **The board stays clean and legible.** The epic/fantasy treatment goes *around* the board (HUD, map, cards, transitions), never on the squares or pieces. Legibility > decoration, always.
4. **Mobile-first.** Thumb-zone actions, ≥44px targets, board spans width, bottom-tab nav, light payloads.
5. **Engage through value, not manipulation.** Reward real learning. No dark patterns, no energy/timer gating, **no paid gambling-style loot boxes**. The audience skews young → keep everything age-appropriate (epic/noble, never grim/violent) and privacy-safe (public profiles private by default for minors).
6. **SRS (FSRS) is the hidden retention engine.** Every position the player must answer is an SRS card; FSRS schedules reviews. It is invisible to the user (behind quests/IQ/map) but it powers retention and the Retention component of the IQ.
7. **The admin is a fortress.** The back-office is a separate, RBAC-gated zone (admin role only) behind 2FA, with an audit log on every sensitive action, never reachable by players. Aggregate existing tools (Paddle, Sentry, Klaviyo/Instantly, GSC, Bing) — never rebuild them. AI in admin suggests/drafts; humans review and publish. See `ADMIN.md`.

---

## DATA SOURCES (the truth layer)

- **Lichess Opening Explorer API** (free) — real move frequencies, win rates, lines per position. The primary opening database.
- **Stockfish (WASM, client-side)** — position evaluations. Free, no server cost.
- **ECO opening files (PGN, open source)** — opening structure and names.
- **Curated starter repertoires** — editorial selection of beginner lines (human-curated, the one place chess expertise is encoded by hand).
- **Claude API** — explanation/coaching only, from verified inputs, **cached** (positions are finite and shared → marginal cost → ~0).

---

## THE AGENT TEAM

Specialized subagents in `.claude/agents/`. Delegate by domain; each owns its area and respects THE LAWS.

| Agent | Owns | Use it for |
|---|---|---|
| **chess-engine** | board, chess.js, Stockfish WASM, Lichess API, opening trees, PGN/ECO | anything touching chess truth or the playing surface |
| **iq-srs** | FSRS + Opening IQ formula (Core+Breadth) + scheduling + Road-to-Elo projection | the core algorithmic/business logic |
| **backend** | Next API routes, auth, Neon/Postgres access, Paddle billing, AI-coach pipeline + cache | server, data access, integrations |
| **frontend** | React/Next components, screens, mobile-first UI, board UI, motion/juice (follows DESIGN.md) | anything the user sees |
| **gamification** | XP, quests, streak, ranks, badges, weekly report | the engagement layer |
| **qa** | tests + consistency/guardrail review | verifying THE LAWS hold before merge |
| **admin-ops** | back-office: dashboard, users, financials, cancellation, support, Sentry | business operations & monitoring (see ADMIN.md) |
| **admin-growth** | back-office: email sequences, blog AI editor, Search Console, indexing, internal linking, SEO | content / SEO / growth (see ADMIN.md) |

**Workflow:** the main session acts as **orchestrator/tech-lead** — it plans, decomposes, and delegates to the right specialist, then routes **every** change through **qa (the global reviewer)** for quality + security + coherence + THE LAWS before integrating. Keep changes small and testable. When unsure which agent owns something, it's usually chess-engine (truth), iq-srs (scoring), or backend (data) before frontend.

---

## CONVENTIONS

- TypeScript **strict**. Validate all external/boundary input with **Zod**.
- **No business logic in components.** Domain logic (IQ, SRS, gamification) lives in pure, tested modules.
- Critical logic (Opening IQ, FSRS) **must have unit tests**.
- Secrets server-side only; never ship keys to the client. AI calls go through the backend.
- Follow `DESIGN.md` tokens for all styling. Follow `ARCHITECTURE.md` for structure.

---

## MVP BUILD ORDER (what to build first)

1. Board core (react-chessboard + chess.js) + load one curated path.
2. Chess DNA Test (20 adaptive positions) → initial IQ + archetype + shareable DNA card.
3. Drill mode + FSRS scheduling.
4. Opening IQ engine (Core only; BreadthBonus deferred to V1).
5. Road-to-Elo + minimal daily loop (Daily Quest + Weakness Battle) → XP + streak.
6. Dashboard (IQ graph + Road progress).
7. AI coach (cached) for Learn + mistake explanations.
8. Auth + Paddle (Free / Pro monthly+annual / Lifetime launch).

Deferred: World Map, bosses, Sparring, Passport, Weekly Report (V1); profiles, leagues, leaderboards, seasonal, Hall of Fame, clans (V2/V3).

## Terminology (canonical — use verbatim)
- **Archetypes** (single word, no adjectives): **Warrior · Strategist · Defender · Trickster**. (Never "Aggressive Warrior".)
- **Realms** (one per archetype): **Ember Marches** (Warrior) · **Obsidian Court** (Strategist) · **Aegis Bastion** (Defender) · **Mirage Bazaar** (Trickster).
- **Opening Guardian** = the boss of a SINGLE opening (one per opening). **Kingdom Boss** = the end boss of a WHOLE realm (the Gauntlet). Total **24 = 20 Opening Guardians + 4 Kingdom Bosses**. Never use a bare "boss" for a specific tier.
- **Opening IQ** = the 0–1000 skill score. **Opening Passport** = the seal collection (one seal per mastered opening). **Road to Elo** = the recommended-openings-to-train-next plan.
