---
name: chq-landing
description: >-
  Conventions and ready-made recipes for the ChessHeroQuest marketing landing —
  a cinematic, scroll-driven, effects-heavy front door whose only job is to push
  visitors into the free Chess DNA Test. USE THIS SKILL whenever working on the
  landing: the hero, the scroll-scrubbed background video, pinned/scrubbed
  sections, the Opening IQ reveal, the World Map showcase, the archetype cards,
  glass panels, GSAP ScrollTrigger pins, Lenis smooth scroll, WebGL ambiance,
  the dissolve-to-black footer, or "add a section / swap the hero video / change
  a scroll animation" — even if the file/stack isn't named. It captures the
  architecture, the brand tokens (shared with DESIGN.md), the ffmpeg video-swap
  command, the pinned-scrub pattern in Next/React, the one-card gallery, the
  glass + gold conventions, where Higgsfield assets slot in, and the
  performance/conversion guardrails. The landing is SEPARATE from the mobile-first
  product app — different rules.
---

# ChessHeroQuest landing

The cinematic front door. Dark, warm, premium fantasy: a full-screen background video that scrubs with scroll, glowing gold accents, glass UI, pinned scroll reveals. It is **marketing, not the app** — the app (dashboard, board, training) stays clean and functional; the landing is allowed to be spectacular.

## THE ONE RULE (read first)

**Spectacle serves the CTA.** The landing has a single job: get the visitor to **"Take the free Chess DNA Test."** Every effect must push the message or the conversion. If an animation doesn't aid comprehension or desire, cut it. The DNA Test must be reachable in **one tap from the top** (sticky CTA). Break this and you have a beautiful page that converts nothing.

## Project facts

- **Lives in:** the Next app, marketing segment → `app/(marketing)/page.tsx` (+ section components). Separate layout from `(app)`; no bottom-tab app chrome.
- **Stack:** Next (App Router) · **GSAP + @gsap/react (`useGSAP`) + ScrollTrigger** · **Lenis** (smooth scroll) · optional **three.js** for ambient embers/particles (lazy-loaded) · scroll-scrubbed hero `<video>` · Tailwind with `DESIGN.md` tokens.
- **Assets:** `public/landing/` — `hero.mp4` (Higgsfield-generated, scrubbed), `kingdom-*.jpg`, `archetype-*.png`, ambiance loops. Re-encode video all-keyframe (recipe 1).
- **Deploy:** same Next app / Vercel. Marketing on the apex domain, app on `app.` subdomain.
- **Section order (top→bottom):** `#hero` → `#pain` (you lose in the opening) → `#iq` (the Opening IQ reveal) → `#map` (World Map showcase) → `#dna` (the 4 archetypes) → `#how` (3 steps) → `#proof` (shareable cards / social proof) → `#pricing` → `#cta` (final DNA Test) → `footer` (dissolve to black).

## Brand tokens

Reuse `DESIGN.md` (dark abyss bg, `--gold` accent, Cinzel display + Manrope body, archetype colors). The landing may push **further** than the app: larger display scale, more gold glow, cinematic spacing, heavier motion. Same identity, more drama. Never introduce a different palette.

## Layer architecture (z-index)

Background fixed; content scrolls over it. Keep the stack intact:

| element | z | role |
|---|---|---|
| `.hero-video` (`#herov`) | 0 | fixed full-screen video, `object-fit:cover`, scrubbed by scroll |
| `.bg-tint` | 1 | radial/linear darken for text legibility over bright frames |
| `#embers` (WebGL, optional) | 2 | particle ambiance; **`mix-blend-mode:screen`** on the wrapper so black drops out; lazy-loaded; off on mobile/reduced-motion |
| `#page` (sections) | 10 | all content |
| `#cursor` (optional) | 100 | custom cursor ring (`mix-blend-mode:difference`) |

Footer is a full-bleed black band; the video dissolves to black above it via CSS gradient (recipe 5).

## Recipes

### 1. Scroll-scrubbed hero video (Higgsfield asset)
Re-encode to **all-keyframe** so scrub seeks are smooth (raw clips jerk):
```bash
ffmpeg -y -i "<higgsfield-clip.mp4>" -an -c:v libx264 -preset slow -crf 18 \
  -g 1 -keyint_min 1 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart public/landing/hero.mp4
```
Map scroll → `video.currentTime` in the Lenis `scroll` handler (skip redundant seeks: only set if delta > 0.008). Confirm `readyState===4`.

### 2. Pinned, scroll-scrubbed section (the signature interaction)
In a `"use client"` component, with `useGSAP`:
```js
useGSAP(() => {
  const render = (p) => { /* p 0→1 → set transforms/opacity/blur */ };
  render(0);
  ScrollTrigger.create({
    trigger: '#iq', start: 'top top',
    end: () => '+=' + window.innerHeight * 1.7,   // pin length
    pin: '.iq__pin', scrub: 1,
    onUpdate: (self) => render(self.progress),
  });
}, { scope: containerRef });
```
**Opening IQ reveal:** count the gold number up from 0→target as `p` advances; glow intensifies; word-by-word headline reveal (`o = clamp((p - i/N*0.75)/0.12)`; opacity `0.12+o*0.88`, `blur((1-o)*8px)`, `translateY((1-o)*18px)`). Accent the key word in gold.

### 3. World Map showcase — one kingdom at a time
Cards absolutely positioned, parked LEFT so the right half shows the scrubbing video; scroll swipes one kingdom out left, next in from right. `pos = p*(N-1)`; per card `d = pos-i`; opacity `max(0,1-|d|/0.6)`, `translate(${-d*130}px,-50%) scale(${1-min(|d|,1)*0.06})`, `blur(min(|d|*10,14)px)`. Counter "0N / 0M". Each kingdom = a Higgsfield vignette + name (Italian Kingdom, Sicilian Empire…).

### 4. Glass panels / cards + hover
Frosted surface + gold. Direct children `position:relative; z-index:2` to sit above the glass sheen. Hover lift `translateY(-10px)` + gold border/glow via `color-mix(in srgb, var(--gold) 55%, transparent)`. Buttons: primary (gold gradient) / ghost. The pricing & CTA cards use a dark translucent bg so copy stays legible over bright video frames.

### 5. Footer dissolve-to-black
Footer outside the padded sections (full-bleed). Solid black bg + a gradient above it:
```css
.footer { position:relative; margin-top:30vh; padding:16vh 6vw 8vh; background:var(--bg-abyss); }
.footer::before { content:""; position:absolute; left:0; right:0; bottom:100%; height:45vh;
  background:linear-gradient(to bottom, transparent, var(--bg-abyss)); pointer-events:none; }
```

### 6. Ember / particle ambiance (optional WebGL)
three.js embers/dust, `mix-blend-mode:screen` wrapper, **lazy-loaded on idle** (`import()`), **disabled on mobile and `prefers-reduced-motion`**. Never block first paint.

### 7. The conversion path
A **sticky "Take the free Chess DNA Test" button** from the first scroll. Every section ends pointing back to it. The final `#cta` is the loudest moment. The test itself lives in the app — the landing links into it.

## Higgsfield assets to generate (then store in `public/landing/`)
- **Hero loop** — cinematic dark-fantasy chess realm, a glowing gold board, slow drifting camera (the scrubbed background). Generate ~10s, loopable.
- **Kingdom vignettes** — one atmospheric image per featured opening-kingdom for the World Map showcase.
- **Ambiance loops** — embers/dust/light motes (subtle, behind glass).
Generate once, re-encode video via recipe 1. Higgsfield is for these **assets only** — it does not build the page.

## Performance & accessibility guardrails (non-negotiable)
- **Mobile gets a lighter cut:** poster image or a short light loop instead of the heavy scrubbed video; WebGL off; never tank LCP. The audience is mobile-heavy.
- **`prefers-reduced-motion`:** disable scrubs/parallax/particles; show a static premium layout that still looks high-end.
- **First paint:** hero must not block it — poster first, video enhances. Lazy-load all below-the-fold media; compress hard.
- **SEO:** real SSR text (headlines, copy, CTA) — not an all-canvas page. The DNA Test CTA must be crawlable.
- **Don't bury the CTA** behind effects — one tap from the top, always.

## Gotchas
1. **GSAP in Next** — effects live in `"use client"` components; register `ScrollTrigger` once; use `useGSAP` with a `scope`; `ScrollTrigger.refresh()` after mount; kill triggers on unmount.
2. **Lenis + Next router** — reset/teardown scroll on route change, or pins leak across pages.
3. **Scroll-scrub video** needs the all-keyframe encode (recipe 1) **and** HTTP (never `file://`).
4. **Adding a pin shifts later pins** — read live `ScrollTrigger` values; prefer `invalidateOnRefresh:true`.
5. **No scroll math during SSR/hydration** — guard with mount checks; compute on the client only.
6. **Heavy video on mobile data** — gate by viewport (and Save-Data/connection when available).

> Reference: the uploaded `aura-landing` skill has the raw, proven GSAP/Lenis recipes (pinned scrub, gallery, video freeze math) — borrow the *patterns*, not its brand. This file is the ChessHeroQuest-specific version: our DA, our sections, our conversion goal.
