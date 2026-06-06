# ChessHeroQuest — LANDING BUILD PROMPT (v3 · FINAL / build-ready)

> Locked after Claude × ChatGPT iteration. Single source of truth for building the landing. Paste into Claude Code. Copy is final (English, US spelling). Positioning: a **premium viral quiz funnel**, not a SaaS page. One goal: the free Chess DNA Test.

---

## 0. Instructions to Claude Code (read first)

1. Read `DESIGN.md`, `.claude/skills/chq-landing/SKILL.md`, `docs/master-vision.md`, `docs/user-flows.md` before building.
2. Build in `app/(marketing)/` with its own layout (no app chrome). **Mobile-first, not adapted later.**
3. Use the copy in §5 **verbatim**.
4. Respect the **two asset classes** (§4): build the coded components; use placeholder media for the Higgsfield assets now (dark poster + gold gradients + optional WebGL embers), wire real assets into `public/landing/` later.
5. **Build order:** sections + coded components (with placeholders) → scroll effects/juice → mobile light cut → then drop in Higgsfield assets. **Still-first; video optional/later.**
6. Guardrails in §9 are non-negotiable.

---

## 1. The one rule

Spectacle serves the CTA. The DNA Test is reachable in **one tap from the top** (sticky bar) and is the loudest moment of every section. The DNA Card is the hero visual; the cinematic board is only ambiance.

---

## 2. Tech build spec

Next App Router, `app/(marketing)/` · GSAP + `@gsap/react` + ScrollTrigger · Lenis smooth scroll · optional three.js embers (lazy, mobile-off) · Tailwind with `DESIGN.md` tokens · recipes from the `chq-landing` skill (scroll-scrub hero, pinned IQ reveal, kingdom gallery, glass, dissolve footer). SSR all text. Respect `prefers-reduced-motion`. Compress every asset.

---

## 3. Asset split (do NOT confuse)

**Coded components (build in-app, dynamic, crisp, share-ready):** DNA Card · Opening IQ Gauge · World Map · Passport Preview · Archetype Cards · CTA UI · Share Cards.

**Higgsfield (ambiance + illustration ONLY → `public/landing/`):** hero cinematic background · kingdom illustrations · archetype crest illustrations · ambient embers/dust · optional hero video loop · optional reward/reveal flourish.

**Never** generate UI cards, readable text, or fake UI in Higgsfield.

---

## 4. Channel-aware H1 (dynamic by traffic source)

Switch the H1/sub by `utm_source` / `utm_campaign` / keyword; **default = the Chess DNA variant.**
- **Default / Meta / organic / shared:** H1 *What's your Chess DNA?* — sub *Take the free 2-minute test to reveal your Opening IQ, your chess style, and the opening weaknesses holding back your rating.*
- **Google Ads / pain intent:** H1 *Stop losing games before move 10.* — sub *Discover your Opening IQ and train the opening weaknesses holding back your rating.*
- **Retargeting / returning:** H1 *Your Opening IQ is waiting.* — sub *Finish the free Chess DNA Test and unlock your personalized opening path.*

---

## 5. Sections + final copy (6, verbatim)

### S0 · Sticky CTA bar
**Take the Free Chess DNA Test →**

### S1 · Hero  *(cinematic Higgsfield bg + coded DNA Card preview as the centerpiece; H1 per §4)*
- Kicker: **THE RPG OF CHESS OPENINGS**
- H1 (default): **What's your Chess DNA?**
- Sub: **Take the free 2-minute test to reveal your Opening IQ, your chess style, and the opening weaknesses holding back your rating.**
- CTA: **Take the Free Chess DNA Test**
- Microcopy: *Free · no signup to begin · ~2 minutes*
- **DNA Card preview (example data — label it "example"):**
  > YOUR CHESS DNA · **Strategist** · Opening IQ **428** · Top **38%** · Best Opening: **London System** · Biggest Weakness: **Sicilian Defense**

### S2 · Pain
- H2: **You're losing games before move 10.**
- Body: **You hit a position you don't understand. You walk into a trap you'd never seen. "Study your openings," they say — then bury you in 300 variations you'll never remember. Start with the one score that shows where you actually stand.**
- CTA: **Take the Free Chess DNA Test**

### S3 · What you get  *(expanded reward)*
- H2: **In two minutes, you'll know your game.**
- Body: **Your Opening IQ. Your Chess DNA archetype. Your strongest opening. Your biggest weakness. And a Road to Elo with the exact openings to train next — built for how you actually play.**
- Visual: DNA Card · Opening IQ Gauge · the 4 archetype crests.

### S4 · How it works
- H2: **Your opening quest starts in three steps.**
- **1 — Take the free Chess DNA Test:** 20 positions. Around 2 minutes. No signup to begin.
- **2 — Get your Opening IQ:** see your style, your strongest opening, your biggest weakness, and your Road to Elo.
- **3 — Train 5 minutes a day:** complete daily quests, fix weak lines, and build openings you'll actually remember.

### S5 · Kingdoms preview  *(compact, 3-part)*
- H2: **Then the real game begins.**
- Body: **Every opening becomes a kingdom to conquer. Train it, beat its boss, and add it to your Opening Passport.**
- Visual: a compact 3-part preview — Kingdom Map · Boss Fight · Opening Passport.
- CTA: **Start with the Free Chess DNA Test**

### S6 · Final CTA
- H2: **Discover your Opening IQ — free.**
- Body: **Take the 2-minute Chess DNA Test and reveal the openings shaping your game.**
- CTA: **Take the Free Chess DNA Test**
- Microcopy: *Free · ~2 minutes · no signup to begin*

### Footer  *(dissolve to black)*
Wordmark **ChessHeroQuest** · tagline **The RPG of chess openings.** · Links: How it works · Log in · Privacy · Terms. **No pricing on this page.**

---

## 6. Coded components (build, not generate)

- **DNA Card** — archetype, Opening IQ, percentile, best opening, biggest weakness. Thin gold border, archetype-colored crest (Higgsfield illustration inside), dark glass. Screenshot/share-perfect — the viral artifact.
- **Opening IQ Gauge** — gold ring + count-up animation; the hero number.
- **World Map** — kingdoms layout, conquered = gold; map UI coded, kingdom artwork from Higgsfield.
- **Passport Preview, Archetype Cards, CTA UI, Share Cards** — all coded in the design system.

---

## 7. Higgsfield prompts (production-grade)

> **Generation notes (Claude — read before spending credits):**
> • **Negative prompts:** not every Higgsfield model accepts a separate negative-prompt field (several video models ignore it). If the chosen model has no negative field, **fold the exclusions into the main prompt**. Verify per model.
> • **Chess geometry:** generative models frequently distort boards/pieces. Treat the hero board as **atmospheric**, not an accurate position; correctness lives in the coded UI. **Generate several variants, keep the best.**
> • **Still-first:** generate and validate the hero still before spending on video.
> • **Credits:** account is on free tier (limited credits) — generate the cheapest still first, evaluate, fund before video.

### 7.1 Hero still — desktop 16:9 (primary hero asset)
> Cinematic premium dark-fantasy chess scene designed specifically as a SaaS landing page hero background. A refined ornate chessboard sits in the lower-right third of the frame, with elegant obsidian and brushed-gold chess pieces, perfectly recognizable and not distorted. Warm golden light softly pools over the board, while the left half of the image remains deep, clean, dark negative space for headline text and UI overlay. Subtle golden dust motes and a few restrained embers drift in the air. Volumetric god rays cut softly through the darkness. Luxury black-and-gold palette, high contrast, premium editorial composition, elegant, uncluttered, cinematic, photorealistic, ultra-detailed, shallow atmospheric depth. No text, no UI, no logos, no watermark, no people, no extra pieces, no clutter. 16:9.

*Negative (separate field or folded in):* cartoon, childish, colorful fantasy, oversaturated, messy composition, low-quality chess pieces, distorted board, unreadable pieces, too many particles, fake text, watermark, UI elements, logo, people, hands, random objects, cheap mobile game aesthetic, horror, blood, weapons.

### 7.2 Hero still — mobile 9:16
> Cinematic premium dark-fantasy chess scene designed specifically for a mobile landing page hero. A refined ornate chessboard sits in the lower third of the frame, with elegant obsidian and brushed-gold chess pieces, perfectly recognizable and not distorted. The upper half of the image is clean deep dark negative space reserved for headline text, CTA and a coded DNA Card overlay. Warm golden light glows softly from the chessboard, subtle golden dust motes and restrained embers, volumetric light through darkness, luxury black-and-gold palette, premium editorial composition, uncluttered, cinematic, photorealistic, ultra-detailed. No text, no UI, no logos, no watermark, no people. 9:16.

*Negative:* cartoon, childish, clutter, oversaturated colors, messy fantasy castle, distorted chessboard, fake text, watermark, UI, people, hands, too many particles, horror, cheap mobile game aesthetic.

### 7.3 Hero video loop — desktop 16:9 (optional, only after the still is validated)
> Slow cinematic push-in over a refined ornate chessboard placed in the lower-right third of a dark premium fantasy hall. Elegant obsidian and brushed-gold chess pieces, recognizable and stable, warm golden light pooling over the board, subtle dust motes and very restrained embers drifting upward, soft volumetric god rays through deep black negative space on the left for landing page text and UI overlay. Smooth slow camera movement, luxury black-and-gold palette, premium cinematic atmosphere, elegant and uncluttered. No text, no UI, no logos, no watermark, no people, no hands, no extra objects. Seamless loop, 10 seconds, 16:9.

*Motion notes:* slow push-in only · no fast camera · no piece movement · no board deformation · no explosions · subtle embers · keep negative space for UI.
*Negative:* fast zoom, shaky camera, distorted chess pieces, moving pieces, chaotic particles, colorful magic, cartoon, horror, fake text, watermark, people, hands, cluttered background.
*Post:* re-encode all-keyframe (ffmpeg in the `chq-landing` skill).

### 7.4 Hero video loop — mobile 9:16 (optional)
> Slow cinematic push-in over a refined ornate chessboard placed in the lower third of a vertical mobile composition. Elegant obsidian and brushed-gold chess pieces, recognizable and stable, warm golden light, subtle dust motes and restrained embers, deep dark negative space in the top half for headline text and UI overlay, premium black-and-gold dark fantasy atmosphere, elegant and uncluttered, photorealistic cinematic look. No text, no UI, no logos, no watermark, no people, no hands. Seamless loop, 10 seconds, 9:16.

### 7.5 Kingdom illustration — template (inside the coded World Map)
> Premium dark-fantasy illustration of the [OPENING_NAME] as a chess opening kingdom. The scene should feel like a collectible realm inside a chess RPG map: [MOTIF]. Dark cinematic atmosphere, warm gold accents, subtle chess-inspired architecture, elegant atmospheric depth, luxury black-and-gold grading, refined and uncluttered composition. No text, no UI, no logos, no watermark, no people, no characters, no battle scene. High-detail, premium concept art, suitable for a polished SaaS landing page.

*Negative:* cartoon, childish mobile game, oversaturated, messy castle, fake text, watermark, people, battle, violence, horror, clutter, low detail, cheap fantasy art.

*Motifs:*
- **Italian Kingdom** — a warm Renaissance-inspired stone city with elegant arches, golden sunrise light, marble courtyards and subtle chessboard geometry in the architecture. Calm, classical, graceful.
- **Sicilian Empire** — a dramatic volcanic island fortress above a dark coastline, restrained embers, molten gold light in cracks of black stone, powerful and dangerous but elegant.
- **French Fortress** — a cold gothic fortress surrounded by mist, tall defensive walls, candle-gold windows, quiet strength, disciplined and imposing.
- **Caro-Kann Citadel** — a solid stone citadel at dusk, symmetrical walls, calm emerald-gold accents, unbreakable defensive feeling, stable and trustworthy.
- **London Kingdom** — a foggy lantern-lit stone bridge and clocktower city, deep navy atmosphere, warm golden lamps, quiet strategic confidence.

### 7.6 Archetype crests (decorative emblems inside the coded DNA Card / archetype cards)
No text. Transparent background if available, else pure black.
- **Aggressive Warrior** — Premium heraldic crest for a chess RPG archetype called Aggressive Warrior. Obsidian shield, brushed-gold rim, subtle crimson glow, crossed chess knights and sharp tactical motifs, elegant and noble, not violent, dark fantasy premium style, centered emblem, high detail. No text, no logo, no watermark.
- **Strategist** — …obsidian and brushed-gold seal, royal violet glow, chess rook and geometric planning lines, elegant, intelligent, controlled…
- **Defender** — …obsidian shield with brushed-gold rim, emerald glow, fortress and chess king motifs, calm and unbreakable, noble…
- **Trickster** — …obsidian seal with brushed-gold rim, teal glow, subtle mask motif combined with a chess knight, clever and mysterious but elegant…

*Negative (all crests):* text, letters, logo, watermark, cartoon, childish, cheap mobile game, oversaturated, horror, skulls, weapons, blood, messy details, low detail.

### 7.7 Ambient embers loop
> Minimal premium cinematic loop of slow-drifting golden dust motes and a few restrained embers over a pure deep black background. Elegant, subtle, luxury atmosphere, seamless loop, very slow motion, no text, no UI, no logo, no watermark. 10 seconds.

*Negative:* firestorm, flames, explosions, too many particles, colorful smoke, text, logo, watermark, people, objects.

### 7.8 DNA result reveal flourish (optional, V2)
> A premium dark-gold magical reveal animation for a chess RPG interface: a soft golden ring of light forms slowly in darkness, subtle dust motes, elegant glow, refined luxury effect, designed to sit behind a coded UI card. No text, no UI, no logo, no watermark, no objects, no people. Seamless 5-second loop.

*Negative:* flashy explosion, cartoon magic, oversaturated colors, lightning, text, logo, watermark, clutter, cheap game effect.

---

## 8. Voice & copy

Epic in the visuals, credible in the words. Sell progression honestly — "train the weaknesses holding back your rating," "openings you'll actually remember" — never "watch your rating skyrocket" or "+Elo guaranteed." Second person, short, benefit-first. Landing uses **"Biggest Weakness"** (not "leak"). No fabricated proof or counts.

---

## 9. Build guardrails (non-negotiable)

- Premium feel, never an AI-generated-template look.
- DNA Card = the main visual CTA driver.
- Hero background leaves negative space for copy + coded UI.
- **Mobile designed first.** Video optional; still-first is the approved baseline (hero still + coded UI).
- Pricing stays post-test; no "Go Pro" CTA on this page.
- CTA appears in: hero, sticky bar, S2, S5, final section.
- No fake testimonials, no fake user counts, no guaranteed-Elo promises, no cluttered fantasy copy.
- SEO text SSR · respect `prefers-reduced-motion` · compress every generated asset.

---

## 10. Analytics events (instrument from day one)

Fire these from the marketing layer and persist them to the analytics store (same pipeline as `training_events`). The `headline_variant` field ties each event back to the channel-aware H1 (§4) so we can measure which hook converts per source.

**Events:**
- `landing_view`
- `hero_cta_click`
- `sticky_cta_click`
- `pain_section_cta_click`
- `kingdoms_cta_click`
- `final_cta_click`
- `dna_test_started`
- `dna_test_completed`
- `dna_card_generated`
- `signup_started`
- `signup_completed`

**Every CTA event must carry source context:**
- `section`
- `headline_variant`
- `utm_source`
- `utm_campaign`
- `device_type`

Implementation note: capture `headline_variant`, `utm_source`, `utm_campaign` once on `landing_view` (from the URL / variant resolver) and attach them to every downstream event in the session so the full funnel — view → CTA → test → signup — is attributable per channel and per hook.

---

## 11. Locked decisions (traceability)

1. Coded components: DNA Card, IQ Gauge, Map — locked.
2. Higgsfield: ambiance + illustration only — locked.
3. H1 dynamic by channel (default = Chess DNA) — locked.
4. Section order: hero (reward preview) → pain → expanded reward → how it works → kingdoms → final CTA — locked.
5. Kingdoms section kept but compact (Map · Boss · Passport) — locked.
6. Pricing removed from the pre-test landing — locked.
7. Still-first launch, video optional — locked.
8. DNA Card example uses "Biggest Weakness" — locked.
9. Higgsfield prompts upgraded to production-grade, with Claude's generation notes (§7) — locked.
10. Mobile-first build — locked.
11. Analytics events instrumented day one, every CTA carrying source + headline_variant (§10) — locked.

---

*v3 FINAL — Claude × ChatGPT, converged. Ready to paste into Claude Code.*
