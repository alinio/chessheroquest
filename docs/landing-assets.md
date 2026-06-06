# ChessHeroQuest — Landing Assets & Wiring

> Use alongside `claude-code-landing-kickoff.md`. **This supersedes the placeholder media section (§6) of the kickoff:** the hero is now real video + poster, and the Map / DNA Cards / sections use the real assets below.

---

## 1. Download → rename → place

Download each asset from its Higgsfield generation, rename as below, and drop into **`public/landing/`**. (Job IDs are listed so you can find each one in your Higgsfield library.)

### Hero — video (loops)
| Asset | Job ID | Save as | Format |
|---|---|---|---|
| Hero desktop loop | `e89bb303-fb6a-44d1-8d7b-121d19ad6293` | `hero-desktop.mp4` | mp4 |
| Hero mobile loop | `965aac98-7e96-4aec-9541-4a0c15a89f8a` | `hero-mobile.mp4` | mp4 |

### Hero — stills (poster / reduced-motion fallback)
| Asset | Job ID | Save as | Format |
|---|---|---|---|
| Hero desktop still | `684c739e-bbaa-4fb0-a5f7-200357fc05fe` | `hero-desktop-poster.webp` | webp |
| Hero mobile still | `b287728d-6d68-4282-80c4-bdd026c303c0` | `hero-mobile-poster.webp` | webp |

### Opening Kingdoms (World Map)
| Kingdom | Job ID | Save as |
|---|---|---|
| Italian Game | `004baf83-b2ff-4827-8ad7-8f80a57b42e6` | `kingdom-italian.webp` |
| Sicilian Defense | `7e0c58a3-75fe-4b5a-a3e4-399da2131eec` | `kingdom-sicilian.webp` |
| French Defense | `adff3313-76b6-4105-836a-5959ee950550` | `kingdom-french.webp` |
| Caro-Kann (style anchor) | `9f35ec42-577f-4722-8e83-33003d7b119e` | `kingdom-caro-kann.webp` |
| London System | `f5bf42f5-cbdd-4d9c-9d82-93698d170380` | `kingdom-london.webp` |

### Archetype crests (DNA Card / Archetype cards)
| Archetype | Job ID | Save as |
|---|---|---|
| Strategist (violet) | `2f2f18ab-0099-4290-bb2e-fc3bddb5179e` | `crest-strategist.png` |
| Aggressive Warrior (crimson) | `024a47ce-432e-47b6-95ee-0d1d62bea0eb` | `crest-warrior.png` |
| Defender (emerald) | `c0a42a30-7e9f-435e-a7db-e53b50df6976` | `crest-defender.png` |
| Trickster (teal) | `e73388d3-892f-4111-ad18-59070445c14f` | `crest-trickster.png` |

### Ambient
| Asset | Job ID | Save as | Format |
|---|---|---|---|
| Embers loop | `e71b54ac-87d8-43ac-8260-fb8bfe4c6d7e` | `embers-loop.mp4` | mp4 |
| DNA reveal flourish | `e62dbd2b-1742-49a4-8e4a-7bdb45dacd94` | `dna-reveal-flourish.mp4` | mp4 |

---

## 2. Pre-processing (run before wiring — chq-landing skill has the ffmpeg recipe)

- **Videos** (`hero-desktop.mp4`, `hero-mobile.mp4`, `embers-loop.mp4`): strip audio + re-encode **all-keyframe** for seamless looping; also export a **`.webm`** sibling for smaller payloads. Keep H.264 mp4 as fallback.
- **Stills + kingdoms**: export optimized **webp** (quality ~80), max width 1600px desktop / 1080px mobile poster / 1024px kingdoms.
- **Crests**: keep PNG; they're on pure black — in the UI, drop the black with `mix-blend-mode: screen` (or `lighten`) on a dark card, or mask. Target ~512px.

---

## 3. Wiring (replaces kickoff §6)

**Centralize all paths in one config** (`src/features/landing/assets.ts` or similar):
```
hero.desktop.video / hero.desktop.poster
hero.mobile.video  / hero.mobile.poster
kingdoms.{italian,sicilian,french,caroKann,london}
crests.{strategist,warrior,defender,trickster}
ambient.embers
```

**Hero (S1):**
- `<video autoPlay muted loop playsInline>` with `poster`. Desktop source = `hero-desktop.*`, mobile source = `hero-mobile.*` (swap via media query / two `<source>` + `media`, or render the right one client-side after mount). webm first, mp4 fallback.
- `prefers-reduced-motion: reduce` → render the **poster still only**, no `<video>`.
- Keep H1 + DNA Card over the **negative space**: left on desktop, top on mobile. The video must never block first paint (poster shows instantly).

**World Map / Kingdoms (S5):**
- Feed the 5 kingdom webp into `WorldMapPreview`, each mapped to its opening. Conquered = full color/gold; locked = dim + subtle desaturate. They already share one framed style — render them as a consistent set (same tile size + border treatment).

**DNA Card + Archetype cards (S1 hero example + S3):**
- Map `crests.{archetype}` into the `DNACard` crest slot and the four `ArchetypeCard`s. Tint/glow already baked per archetype (violet/crimson/emerald/teal). Drop the black bg via blend mode on the dark card.

**Embers (ambient):**
- Optional low-opacity looping `<video>` layer behind dark sections (`mix-blend-mode: screen`, opacity ~0.4, `pointer-events:none`). **Off** under `prefers-reduced-motion` and on the mobile light cut.

**DNA reveal flourish (result screen, not the pre-test landing):**
- Plays once behind the `DNACard` at the moment the result is revealed (golden ring forming). `mix-blend-mode: screen` on the dark card, `pointer-events:none`. This belongs to the **DNA result / test-complete screen**, not the marketing landing — wire it there when that screen is built. **Off** under `prefers-reduced-motion`.

---

## 4. Notes
- Hero videos are **720p** — fine for a compressed, behind-text web loop. If you ever want crisper, upscale the *exact* validated clips (Topaz) rather than regenerating.
- Everything else (DNA Card, IQ Gauge, World Map UI, copy) stays **coded** per the kickoff + `DESIGN.md`. These assets only dress the coded components.

*Place at `docs/landing-assets.md`. Paste into Claude Code together with the kickoff.*
