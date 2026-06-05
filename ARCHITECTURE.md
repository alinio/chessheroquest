# ARCHITECTURE.md — ChessHeroQuest

A clean, layered, feature-based Next.js codebase. The guiding idea: **isolate the truth layer (chess data), keep domain logic pure and tested, and let the UI consume via hooks.** Mobile-first throughout.

---

## Stack

- **Next.js (App Router) + TypeScript (strict)** — web app + API routes
- **Postgres on Neon + Drizzle ORM** — typed schema & migrations
- **Tailwind CSS** — styling, driven by `DESIGN.md` tokens (CSS variables)
- **chess.js** — move legality, FEN/PGN
- **stockfish.wasm** — client-side evaluation
- **react-chessboard** — board rendering
- **FSRS** (open-source lib) — spaced repetition scheduling
- **Zod** — boundary validation
- **Zustand** — light global UI state (session, current line)
- **Paddle** — subscriptions/billing
- **Anthropic SDK** — AI coach (server-side only, cached)
- **Vitest + Testing Library / Playwright** — unit + e2e

---

## Layers (dependency direction: ui → domain → data)

- **data/** — the truth layer. Wrappers over Lichess API, Stockfish, ECO/PGN, and DB repositories. No business rules here, just reliable access to verified data.
- **domain/** — pure business logic, framework-free, fully unit-tested: `iq` (Core+Breadth formula, Elo calibration/projection), `srs` (FSRS wrapper, card scheduling), `gamification` (xp, quests, streak, ranks). **No React, no DB calls — pure functions.**
- **app/api/** — Next route handlers: orchestrate data + domain, auth, billing, the AI-coach pipeline. Validate input with Zod.
- **ui/** — React components & screens. Consume domain via hooks. **No business logic in components.**

---

## Folder structure

```
/app
  /(marketing)            # public pages (landing later)
  /(app)                  # authenticated app (mobile-first shell, bottom-tab nav)
    /dashboard
    /train                # the board surface (Learn/Drill/Review/Sparring)
    /map                  # World Map (V1)
    /profile
  /(admin)                # SEPARATE admin zone — RBAC + 2FA gated, never reachable by players (see ADMIN.md)
  /api
    /dna-test             # adaptive test → initial IQ
    /train                # serve due cards, record results
    /iq                   # recompute / fetch Opening IQ
    /coach                # AI explanation (server-side, cached)
    /billing              # Paddle webhooks
    /admin                # admin-only routes, behind RBAC middleware
    /auth
/src
  /data
    lichess.ts            # Opening Explorer client (frequencies)
    stockfish.ts          # WASM eval wrapper
    eco.ts                # ECO/PGN loader
    /integrations         # typed wrappers: paddle, sentry, gsc, bing, klaviyo, instantly, crisp
    /repos                # Drizzle repositories (users, cards, repertoires, iq, quests…)
  /domain
    /iq                   # formula (Core+Breadth), calibration, projection — PURE + TESTED
    /srs                  # FSRS scheduling — PURE + TESTED
    /gamification         # xp, quests, streak, ranks — PURE + TESTED
    /repertoire           # opening-tree model, frequency weighting
  /features
    /admin                # ops/ and growth/ back-office features (see ADMIN.md)
  /ui
    /components           # design-system primitives (tokens from DESIGN.md)
    /board                # react-chessboard wrapper + states
    /screens              # composed screens per user flow
  /lib                    # ai client, auth, env, utils, zod schemas
/db
  schema.ts               # Drizzle schema (see data model)
  /migrations
/docs                     # master-vision.md, user-flows.md (reference)
CLAUDE.md  ARCHITECTURE.md  DESIGN.md  ADMIN.md
.claude/agents/*.md
```

---

## Data model (Drizzle tables — core)

`users` · `path_templates` · `user_repertoires` · `nodes` (fen, move, parent_id, is_player_move, frequency, eval, eco) · `cards` (user_id, node_id, fsrs state: stability, difficulty, due_at, lapses) · `quests` · `mastery` (line/kingdom status) · `opening_iq_snapshots` (value + core/breadth breakdown) · `elo_goals` · `dna_results` · `achievements` · `ai_explanation_cache` (key = fen+context hash → explanation). V2/V3: `profiles`, `follows`, `rivals`, `leagues`, `seasonal_events`, `inventory`, `guilds`. Admin: `audit_logs` (every sensitive admin action), `blog_posts`, `cancellation_reasons`. Analytics: `training_events` (every attempt: node, result, latency, mode, timestamp — the raw material for IQ↔Elo calibration). Compliance: `users` carries `birth_year`/age-band + consent flags.

---

## Key rules for "solid & clean"

- **The truth layer is sacred.** Chess facts only ever come from `data/` (Lichess/Stockfish/ECO). Domain & UI never invent moves or evals.
- **Domain is pure & tested.** `iq` and `srs` are the crown jewels — pure functions, exhaustive unit tests, no I/O.
- **AI is a thin, cached service.** `/api/coach` builds context {fen, eval, stats, eco, level} → Claude → explanation → cache by key. Never on the hot path of move validation.
- **Mobile-first & performant.** Stockfish runs in a Web Worker; animations are CSS-first; payloads light.
- **Env & secrets** in server only; typed via `lib/env.ts`; AI/DB keys never reach the client.
- **Validation at every boundary** (API in/out, external data) with Zod.
- **Instrument from day 1.** Log `training_events` for every attempt from the very first build. The IQ↔Elo correlation and the data moat **cannot be reconstructed retroactively** — uncaptured behavior is lost forever.
- **Plan for minors.** Capture age-band + consent at signup; minors' profiles private by default; gate social/V2 features by age. Retrofitting consent (COPPA / GDPR-K) after launch is painful and risky.
