# ADMIN.md — ChessHeroQuest Back-Office

The founder cockpit. **Separate from the player app.** Owned by agents `admin-ops` and `admin-growth`.

---

## Principles (read first)

1. **Security (LAW #7).** Admin is a separate, **RBAC-gated** zone (admin role only), on its own route segment `/app/(admin)` (or `admin.` subdomain), behind admin middleware + **2FA**, with an **audit log on every sensitive action** (refund, comp, ban, data export, role change). Never reachable by players. Treat it like a bank back-office.
2. **Aggregate, don't rebuild.** Most modules surface data from tools already in use (Paddle, Sentry, Klaviyo/Instantly, Google Search Console, Bing). The admin is a **cockpit** that integrates via APIs/embeds and adds only what's missing — never a re-implementation of Sentry, a ticketing system, or an ESP.
3. **Phased — not MVP.** Ship a **minimal admin at launch** (user management + basic financials + Sentry surface), then grow. The SEO/content cluster comes once there's traffic and content to manage.
4. **Function over fantasy.** The admin does **not** use the gaming DA (`DESIGN.md`). It's an internal, dense, functional dashboard. Readability and speed over theme.

---

## Cluster A — Operations & Business → agent `admin-ops`

| # | Module | What it does | Source | Phase |
|---|---|---|---|---|
| 1 | **Dashboard** | KPI overview: MRR, active users, retention, free→paid, avg Opening IQ | aggregates B+DB | V1 |
| 2 | **User management** | search/detail, subscription & progression, actions (refund/comp/ban/reset) **+ audit log** | DB + Paddle | MVP-min |
| 3 | **Financial analytics** | MRR, churn, LTV, conversion & revenue by plan | Paddle + DB | MVP-min → V1 |
| 4 | **Cancellation insights** | churn reasons, cohorts, exit-survey data | Paddle cancellations + collected reasons | V1 |
| 5 | **Support tickets** | integrate **Crisp/Intercom** (do NOT build ticketing) | 3rd-party | V1 |
| 6 | **Sentry bugs** | surface Sentry issues via API/embed; deep-link out | Sentry API | MVP-min |

## Cluster B — Growth, SEO & Content → agent `admin-growth`

| # | Module | What it does | Source | Phase |
|---|---|---|---|---|
| 7 | **Email sequences** | pilot **Klaviyo/Instantly** via API (already in use); don't rebuild an ESP | 3rd-party API | V1/V2 |
| 8 | **Blog AI editor** | author/edit SEO-structured posts with Claude assistance | DB + AI pipeline | V1 |
| 9 | **Search Console + AI** | pull GSC data (queries, clicks, impressions, positions) + AI recommendations | GSC API + AI | V2 |
| 10 | **Indexing (Google/Bing)** | submit URLs via **Google Indexing API** + **Bing IndexNow** | 3rd-party API | V2 |
| 11 | **Internal linking AI** | Claude-assisted internal-link suggestions across blog/site | DB + AI | V2 |
| 12 | **SEO tools** | audit / meta / keyword utilities | mixed | V2 |

---

## Tech notes

- **Isolation:** admin code under `/app/(admin)` + `src/features/admin/`; admin-only API routes behind RBAC middleware; `audit_logs` table for every sensitive action.
- **Integrations** live in `src/data/integrations/` — one typed, Zod-validated wrapper per service (paddle, sentry, gsc, bing, klaviyo, instantly, crisp). Keys server-side only.
- **AI-assisted modules** (blog editor, internal linking, GSC recommendations) reuse the cached server-side AI pipeline pattern (LAW #2: AI explains/suggests, humans/data decide; never auto-publish without review).
- **Never expose admin data or routes to the player app.** Separate auth scope; players can never reach admin.

> Build order for admin: **MVP-min** (user management + basic financials + Sentry) → **V1** (dashboard, cancellation insights, support, blog editor, email) → **V2** (GSC+AI, indexing, internal linking, SEO tools). Don't build ahead of having users and content.
