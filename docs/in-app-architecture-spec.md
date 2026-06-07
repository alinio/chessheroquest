# ChessHeroQuest — In-App Architecture (post-auth / Pro)

**Scope.** This is the logged-in, paid game — the app *after* sign-up + payment. It defines the navigation, the section map, the persistent shell, and the exact composition of every screen. It is the connective tissue that ties together the individual screens.

**Relationship to existing specs.** The detailed per-screen specs already live in `docs/screen-wireframe-spec.md` (Test, Quiz, Result, Hero Select, World Map, Opening Node, Learn, Drill, Boss, Paywall, Passport). This doc references those and adds the **shell + navigation + the new connective screens** (Today/Train, in-app Profile, Account/Settings, Realms overview). Where a screen already has a spec, this doc gives its in-app role + entry points, not a re-spec.

**Constants.** Mobile-first. Gold-on-obsidian. Reuse design tokens + components. Realms/accents: Ember Marches `#E0413B` (Warrior) · Obsidian Court `#8B6CFF` (Strategist) · Aegis Bastion `#2FB67A` (Defender) · Mirage Bazaar `#38C7D6` (Trickster). This doc describes the **Pro** state (everything unlocked); free-tier locks are handled per Hero Select / Paywall specs.

---

## 1. Navigation model

The app has **4 primary destinations** + secondary items reachable from the profile/account.

**Primary (always reachable):**
| Destination | Icon | Role |
|---|---|---|
| **Today** | flame | The daily habit loop — due drills, streak, next session. Default landing for returning users. |
| **Quest** (Map) | map/crown | The realm map hub — opening nodes, progression, the emotional centre. |
| **Passport** | seal | The seal collection across the 4 realms; progress + milestones. |
| **Profile** | hero crest | Chess DNA, Opening IQ, strongest/weakness, synced-games stats, DNA card. |

**Secondary (from Profile header / overflow):** Realms overview · Account & Billing · Settings · Connected accounts (Lichess/Chess.com) · Help · Sign out.

**Mobile (canonical, mobile-first):** a **bottom tab bar** with the 4 primary destinations. The top bar carries identity/status (see §2). Secondary items live behind the Profile screen + a top-right menu. (A "menu on the right" is a desktop pattern; on mobile the bottom bar is primary.)

**Desktop:** a **vertical nav rail** (can sit left or right — your sketch puts it right; left is the web convention, support whichever we pick) holding the 4 primary + the secondary items below a divider. The **Quest map fills the centre canvas**. The top bar persists.

**Default landing after login:** returning users → **Today** (drives the daily habit, Duolingo-style). First session after sign-up → **Quest** with a guided pulse on the recommended first opening node. *(Recommendation — confirm.)*

---

## 2. Persistent app shell

Present on every in-app screen.

**Top bar (left → right):**
- Brand **LogoMark** (the real wordmark — fixes the generic-crown issue on the test page).
- Current **realm name** + accent dot (themes the screen).
- **Streak flame** + day count (tap → Today).
- **Opening IQ** chip (e.g. "IQ 428") (tap → Profile).
- **Hero crest avatar** (tap → Profile / overflow menu); **Pro** badge.

**Navigation:** bottom tab bar (mobile) / side rail (desktop), per §1.

**Global elements:** realm-accent theming applied to the active screen; toast/notification area (seal earned, streak saved, drill due); reduced-motion respected everywhere.

---

## 3. Section map

| Section | Purpose | Tier | Entry |
|---|---|---|---|
| Today (Train) | Daily SRS + streak + next session | Pro | Primary tab (default) |
| Quest (Map) | Realm map hub; opening nodes; progression | Pro | Primary tab |
| Opening Node | One opening's detail + actions | Pro | From a map node |
| Learn | Guided opening walkthrough (explorer-style) | Pro | From Opening Node — spec §7 |
| Drill | SRS review session (SM-2) | Pro | From Opening Node / Today — spec §7 |
| Boss Fight | Opening Guardian / Kingdom Boss | Pro | From Opening Node / realm — spec §8 |
| Passport | Seal collection + milestones | Pro | Primary tab |
| Profile (Chess DNA) | DNA, IQ, strongest/weakness, synced stats, DNA card | Pro | Primary tab |
| Realms overview | The 4 worlds; switch realm; Kingdom Boss status | Pro | From Quest / Profile |
| Account & Billing | Subscription (Paddle), plan, delete account | Pro | From Profile |
| Settings | Board theme, sound, reduced-motion, language, notifications | Pro | From Profile |
| Connected accounts | Lichess / Chess.com connect, disconnect, re-sync | Pro | From Profile / Settings |

---

## 4. Per-screen composition

For each: **Purpose · Layout · Components · Data · States · Actions.**

### 4.1 Quest (Realm Map) — the hub *(most detail)*
- **Purpose:** the emotional centre; see your realm, what's conquered, what's next.
- **Layout:** realm map art as full canvas (mobile: scroll/pannable; desktop: centred); nodes placed on it; realm header overlay top; "Continue" CTA bottom.
- **Components:** realm header (name + accent + "X/Y openings conquered" + Kingdom Boss status, locked until all openings done); **opening nodes** (`MapNode`) with states; connecting path showing progression order; realm switcher (chip row of the 4 realms); Continue CTA (jumps to recommended action).
- **Data:** realm + node states from progress; recommended next from Road to Elo.
- **States (per node):** locked · available · in-progress (learning/drilling) · conquered (gold + seal); Kingdom Boss node locked → unlocked when all openings conquered.
- **Actions:** tap node → Opening Node panel; switch realm; Continue.

### 4.2 Today (Train) — the daily driver
- **Purpose:** the habit loop; what to do today.
- **Layout:** streak header; today's goal ring; primary "Start" card; secondary cards below.
- **Components:** **streak flame** + count (+ freeze if any); daily goal progress ring; **Due Drills** card (count "due today" → Start drill session); **Recommended session** card (Road to Elo next opening → Learn/Drill); today's XP earned; quick stats (cards reviewed, accuracy).
- **Data:** SRS due queue; streak; Road to Elo; today's activity.
- **States:** nothing due (offer a recommended Learn / a new opening); streak at risk (nudge); all done today (celebrate).
- **Actions:** Start drills; start recommended session; jump to Quest.

### 4.3 Opening Node (overlay or screen)
- **Purpose:** one opening's hub + actions.
- **Components:** opening name + ECO + realm accent + **tile art**; status (not started / learning / drilling / conquered + seal); main-line breadcrumb preview; **your performance on this opening** (synced-games W/D/L + score%, if synced); **explorer stat strip** (popularity/eval, post-context); the **Opening Guardian** preview (name + still).
- **Actions:** **Learn** · **Drill** · **Fight the Opening Guardian**.
- **States:** locked (Pro/prereq) · available · in-progress · conquered.

### 4.4 Learn *(ref spec §7 + explorer upgrade)*
Interactive board walking the real main line + move breadcrumb + variation name updating + **candidate list with explorer stats + authored caption**. In-app role: launched from Opening Node; on completion, creates/updates SRS cards and marks the opening "learning".

### 4.5 Drill *(ref spec §7)*
SRS review (SM-2): board positions, "your move", grade (again/hard/good/easy), session progress, end-of-session summary (accuracy, cards graduated, next due). Launched from Today or Opening Node.

### 4.6 Boss Fight *(ref spec §8)*
Opening Guardian (per opening) / Kingdom Boss (per realm): boss art + name plate, resolve/health gauges, curated critical lines + Stockfish opponent, difficulty Easy/Medium/Hard. **Win at Medium → conquer:** earn seal (wax-stamp anim), flip map node to gold, mastery/XP, SRS nudge.

### 4.7 Passport
- **Purpose:** the collection; progress + pride.
- **Components:** coded **wax seals** grouped by the 4 realms (earned = gold/realm-tinted, locked = dim); "X/20 sealed" progress; per-realm rows; milestones/achievements; tap a seal → opening + date earned + your stats.
- **States:** empty (no seals yet) → first-seal celebration; per-realm completion → Kingdom Boss unlocked.

### 4.8 Profile (Chess DNA)
- **Purpose:** who you are as a player.
- **Components:** hero crest + archetype + realm; **Opening IQ gauge** + Top X%; **strongest opening / biggest weakness**; **Road to Elo** plan (recommended openings); **synced-games stats** (Lichess/Chess.com per-opening W/D/L, most-played, recent form); **DNA Card** (shareable 1080×1350) + share; level/XP, total seals, streak record; re-take test / re-do quiz.
- **Data:** test + quiz results; synced-game summary; progress.

### 4.9 Account & Billing
Subscription tier + manage/renew via **Paddle**; invoices; **delete account/data** (privacy). 

### 4.10 Settings
Board theme + piece set; sound; **reduced-motion**; language; notifications.

### 4.11 Connected accounts
**Lichess / Chess.com**: connect (username MVP / OAuth later), disconnect, re-sync, last-sync time; per-source status; delete synced data.

### 4.12 Realms overview
The 4 worlds with art + per-realm progress + Kingdom Boss status; switch active realm. (All unlocked at Pro.)

---

## 5. Conventions
- **Realm accent** themes the active screen (header, highlights, node glow).
- **Node states:** locked / available / in-progress / conquered(gold) — one consistent visual language across Map, Opening Node, Passport.
- **Pro state:** this doc = everything unlocked; free locks per Hero Select / Paywall specs.
- **Empty states** authored for: no drills due, no seals yet, no synced games, new realm.
- **Reduced-motion:** every animation has a static fallback.

---

## 6. New screens to build (not yet in the wireframe spec)
1. **Persistent app shell** (top bar + bottom nav / side rail).
2. **Today (Train)** screen — the daily loop.
3. **In-app Profile (Chess DNA)** — the logged-in profile (distinct from the funnel Result).
4. **Account & Billing / Settings / Connected accounts.**
5. **Realms overview.**
(Quest Map, Opening Node, Learn, Drill, Boss, Passport already have specs — wire them into the shell.)

---

## 7. Decisions (locked)
- **Default landing after login:** Today for returning users; Quest (with a guided first node) on the first post-signup session.
- **Leaderboard / social / friends:** OUT for v1 (not in the core loop).
- **XP / levels:** light — a level indicator + per-opening mastery from boss wins; no separate grind.
- **Desktop nav side:** right rail (per the founder's sketch). Easily flippable to left if it tests poorly.
