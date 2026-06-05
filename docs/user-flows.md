# CHESSHEROQUEST — USER FLOWS

> Derived from the frozen master vision. This defines the screens and journeys; it feeds DESIGN.md and ARCHITECTURE.md.
> Scope tags: **[MVP]** · **[V1]** · **[V2/V3]**.

---

## A. Screen inventory (the bridge to the design brief)

| # | Screen | Scope | Notes |
|---|---|---|---|
| S1 | **Chess DNA Test** | MVP | Adaptive board test, 20 positions |
| S2 | **DNA Results + DNA Card** | MVP | IQ, archetype, best/weakest, percentile, shareable card |
| S3 | **Onboarding** (goal + repertoire) | MVP | Road-to-Elo pick + starter repertoire |
| S4 | **Home / Dashboard** | MVP | IQ, Road progress, streak, daily quests |
| S5 | **Training screen** (the board) | MVP | Hosts the 4 modes; the core surface |
| S6 | **World Map** | V1 | Kingdoms, mastery coloring |
| S7 | **Kingdom / Opening detail** | V1 | Lines, mastery %, boss entry |
| S8 | **Passport / Collection** | V1 | Mastered vs locked checklist |
| S9 | **Weekly Progress Report** | V1 | Weekly ritual + shareable |
| S10 | **Profile** (public) | V2 | Identity showcase |
| S11 | **Paywall / Pricing** | MVP | Free→paid |
| S12 | **Settings** | MVP | Account, notifications, privacy |
| S13 | **Leagues / Leaderboards / Hall of Fame** | V2/V3 | Social competition |

---

## B. Flow 1 — Acquisition → DNA Test → Activation **[MVP]**
*The single most important flow. It is the funnel and the viral loop.*

1. **Entry** (ad / shared card / SEO) → CTA **"Take the Free Chess DNA Test."** No signup required to start.
2. **S1 Chess DNA Test** — 20 adaptive positions on the board. Each: show position → player picks a move → difficulty adapts (CAT logic). ~2 min. Progress indicator (e.g. "7/20"). No login wall yet.
3. **S2 Results** — reveal animation → **Opening IQ** + **DNA archetype** + best opening + weakest opening + global percentile + recommended path. Honest, test-derived wording (no fabricated game stats).
4. **Generate DNA Card** → shareable image (avatar, archetype, IQ, percentile, back-link). Two actions: **Share** (viral loop) and **Start my path**.
5. **Signup wall** — "Create a free account to start your path and save your DNA." (email / Google / Apple). *Placed after value is shown, before the path begins.*
6. **S3 Onboarding** — pick **Road to Elo** goal (1000/1200/1500/1800) → confirm **starter repertoire** auto-assigned from the archetype.
7. **First guided lesson** (Learn mode, S5) — coach IA explains the first line's idea → **first Daily Quest** → **first XP + first IQ tick**. **← Activation moment.**
8. Land on **S4 Dashboard**.

**Decision points:** skip-share (still proceed) · abandon test (offer "resume") · already has account (→ login → Dashboard).

---

## C. Flow 2 — Daily session loop **[MVP core]**
*The retention engine.*

1. **Open app → S4 Dashboard.** Above the fold: current **Opening IQ**, **Road progress %**, **streak**, **today's 3 quests**.
2. **Daily Quest** — ~10 **due** SRS positions (Review mode). +XP.
3. **Weakness Battle** — targeted Drill on the weakest/red opening. +XP.
4. **Boss Fight** — one opening challenge (Sparring). +XP. *(boss content V1; MVP can ship Quest + Weakness only.)*
5. **Feedback** — IQ ticks up, kingdom segments recolor, streak preserved, celebration juice.
6. **Session end** — short recap + next achievable goal + (optional) share a milestone card.

**Edge:** nothing due today → offer "learn a new line" or light review. **Streak rule:** counts only if **training done** (not app open).

---

## D. Flow 3 — Learn / explore a new opening (breadth mission) **[V1]**

1. **S6 World Map** → tap a locked/partial **kingdom**.
2. **S7 Kingdom detail** → "Start learning."
3. **Learn mode (S5)** — line unfolds move by move; coach IA explains ideas, plans, traps.
4. **Drill mode** — active recall on the new lines; instant correction with "why."
5. New positions enter **SRS** (resurface over days).
6. Once retention threshold met across branches → **Boss Fight** → pass → **kingdom turns gold** (mastered) → **Passport (S8)** updates → BreadthBonus to IQ (capped, see master-vision §4).

---

## E. Flow 4 — The 4 training modes (board micro-interactions) **[MVP: Learn + Drill + Review; Sparring V1]**

- **Learn** — app plays both sides slowly; player advances; coach IA panel explains each key move. No scoring.
- **Drill** — app plays the opponent reply (frequency-weighted); player must find *their* move. Correct → advance. Wrong → highlight + AI "why your move is weaker" → retry → card scheduled.
- **Review (SRS)** — a queue of **due** cards (mixed openings); same recall interaction; updates FSRS state. Invisible scheduler.
- **Sparring** — app plays a full opening, varying replies by real frequency; player scores "correct moves in a row before leaving theory." Score to beat.

**Shared board states:** your-move / opponent-auto-move / correct / wrong+explain / line-complete.

---

## F. Flow 5 — Long-term progression + Weekly Report **[V1]**

1. Accumulated IQ crosses thresholds → **progression rank** updates (Opening Explorer → … → Opening Hero), shown on Dashboard/profile.
2. **S9 Weekly Progress Report** (weekly trigger, in-app + email): "+17 IQ · +2 kingdoms · +1 boss · Road to 1200: 58%." Celebrates real progression only; stays motivating on weak weeks (comeback + next goal, never regression). Shareable.
3. New kingdoms unlock; **seasonal bosses** appear monthly (V2). Collection (Passport) trends toward completion → the 12-month "still something to discover" loop.

---

## G. Flow 6 — Social sharing & growth loop **[card MVP; rest V1/V2]**

Any pride moment → **status card** (DNA, level-up, rank promotion, boss defeated, streak milestone, Road progress) → one-tap to X/Reddit/Discord/IG → card carries back-link to the DNA Test → new visitor enters Flow 1. *Self-reinforcing flywheel.*

---

## H. Flow 7 — Free → Paid conversion **[MVP]**

- **Free** delivers: DNA Test, 1 path, basic training, basic gamification, DNA card.
- **Upgrade prompts (contextual, not nagging):** when hitting a free limit (e.g. wanting a 2nd opening/path, unlimited reviews, boss/seasonal content, advanced stats).
- **S11 Paywall** — Free / Hero Pro $9.99 mo / $79 yr / Lifetime $129 (limited launch). Emphasis on recurring; annual as the value pick.
- Post-purchase → unlock + return to where they were.

---

## I. MVP flow priority (build focus)

**Ship first (MVP):** Flow 1 (DNA Test → activation) · Flow 2 (daily loop: Quest + Weakness) · Flow 4 (Learn + Drill + Review) · Flow 7 (paywall) · DNA card (Flow 6).
**Then V1:** Flow 3 (explore/World Map), Sparring + Boss, Flow 5 (ranks + Weekly Report), Passport.
**Later V2/V3:** profiles, leagues, leaderboards, seasonal competition, Hall of Fame, clans.
