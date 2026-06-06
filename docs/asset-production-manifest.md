# ChessHeroQuest — Asset Production Manifest (Doc 5)

**Purpose:** the complete inventory of every visual asset the full game needs, so nothing is missed and Claude Code/the art pipeline have an exact checklist with dimensions and paths.

**Two asset sources (hard rule — same as the rest of the project):**
- **`HF`** = Higgsfield illustration — *large atmospheric art only* (heroes, world maps, opening tiles, boss figures, ambient scenes). Generated still-first (then optional image-to-video). `nano_banana_pro`, **2 credits / still**.
- **`SVG`** = coded / vector — *everything crisp, small, or systematic* (icons, badges, medals, seals, frames, gauges, node markers, chess pieces, logo). Built by Claude Code or sourced as an icon set. **Never Higgsfield** — AI garbles small/symbolic/text-bearing art.

**Status key:** ✅ exists (Higgsfield job done — download & place) · ⬜ to generate · 🔧 to build (code).

---

## A. HIGGSFIELD ILLUSTRATIONS

### A1 · Heroes — `public/art/heroes/` — 3:4, 1024×1365, webp
| File | Hero | Status |
|---|---|---|
| `hero-warrior.webp` | Aggressive Warrior (crimson) | ✅ |
| `hero-strategist.webp` | Strategist (purple) | ✅ |
| `hero-defender.webp` | Defender (emerald) | ✅ |
| `hero-trickster.webp` | Trickster (cyan) | ✅ |

### A2 · Crests — `public/art/heroes/` — 1:1, static webp + animated mp4 720p
`crest-{warrior|strategist|defender|trickster}.webp` ✅ · `crest-{…}-anim.mp4` ✅ (4 each).

### A3 · World maps — `public/art/worlds/` — 9:16, 1080×1920, webp — **scenery only, path/nodes coded on top**
| File | World | Status |
|---|---|---|
| `world-warrior-map.webp` | The Ember Marches (volcanic) | ⬜ |
| `world-strategist-map.webp` | The Obsidian Court (astral) | ⬜ |
| `world-defender-map.webp` | The Aegis Bastion (fortress) | ⬜ |
| `world-trickster-map.webp` | The Mirage Bazaar (illusion) | ⬜ |

### A4 · Opening tiles — `public/art/tiles/` — 1:1, 1024², webp (kingdom-style)
| File | Opening / World | Status |
|---|---|---|
| `tile-italian.webp` | Italian / Warrior | ✅ |
| `tile-sicilian.webp` | Sicilian Dragon / Warrior | ✅ |
| `tile-french.webp` | French / Defender | ✅ |
| `tile-carokann.webp` | Caro-Kann / Defender | ✅ |
| `tile-london.webp` | London / Defender | ✅ |
| `tile-kingsgambit.webp` | King's Gambit / Warrior | ⬜ |
| `tile-scotch.webp` | Scotch / Warrior | ⬜ |
| `tile-morra.webp` | Smith-Morra / Warrior | ⬜ |
| `tile-ruylopez.webp` | Ruy Lopez / Strategist | ⬜ |
| `tile-queensgambit.webp` | Queen's Gambit / Strategist | ⬜ |
| `tile-nimzo.webp` | Nimzo-Indian / Strategist | ⬜ |
| `tile-catalan.webp` | Catalan / Strategist | ⬜ |
| `tile-english.webp` | English / Strategist | ⬜ |
| `tile-slav.webp` | Slav / Defender | ⬜ |
| `tile-petroff.webp` | Petroff / Defender | ⬜ |
| `tile-scandinavian.webp` | Scandinavian / Trickster | ⬜ |
| `tile-budapest.webp` | Budapest / Trickster | ⬜ |
| `tile-stafford.webp` | Stafford / Trickster | ⬜ |
| `tile-blackmardiemer.webp` | Blackmar-Diemer / Trickster | ⬜ |
| `tile-englund.webp` | Englund / Trickster | ⬜ |

*(5 exist, 15 to generate.)*

### A5 · Mini-Boss (Opening Guardian) stills — `public/art/bosses/` — 3:4, 1024×1365, webp — all ⬜
| File | Boss (from catalog) |
|---|---|
| `boss-warrior-italian.webp` | Aldovrandi, the Roman Edge |
| `boss-warrior-kingsgambit.webp` | Pyrrhus the Unbridled |
| `boss-warrior-scotch.webp` | Bruce of the Broken Center |
| `boss-warrior-morra.webp` | Mordra, the Pawn-Reaper |
| `boss-warrior-dragon.webp` | Vesuvio, the Dragon of the Long Diagonal |
| `boss-strategist-ruylopez.webp` | Bishop Rui, the Spanish Inquisitor |
| `boss-strategist-queensgambit.webp` | Regina Velata, the Veiled Queen |
| `boss-strategist-nimzo.webp` | Aron of the Bound Knight |
| `boss-strategist-catalan.webp` | Conde Catalan, the Architect of Light |
| `boss-strategist-english.webp` | Albion, the Flank Sovereign |
| `boss-defender-london.webp` | Warden Locke, the Stone Wall |
| `boss-defender-carokann.webp` | Karran, the Patient Wall |
| `boss-defender-french.webp` | Geneviève of the Chain |
| `boss-defender-slav.webp` | Stanislav the Unmoved |
| `boss-defender-petroff.webp` | Petrov, the Mirror Sentinel |
| `boss-trickster-scandinavian.webp` | Sigrún, the Northern Mirage |
| `boss-trickster-budapest.webp` | Béla, the Thermal Phantom |
| `boss-trickster-stafford.webp` | The Imp of Stafford |
| `boss-trickster-blackmardiemer.webp` | Diemer the Flame-Juggler |
| `boss-trickster-englund.webp` | Hartlaub the Mad |

### A6 · Kingdom Boss (World End-Boss) stills — `public/art/bosses/` — 16:9, 1920×1080, webp — all ⬜
| File | Boss |
|---|---|
| `endboss-warrior.webp` | Ignar, the Crowned Conflagration |
| `endboss-strategist.webp` | Theron the Eternal |
| `endboss-defender.webp` | Aegidius, the Last Wall |
| `endboss-trickster.webp` | Vesper, the Hall of Mirrors |

### A7 · Motion (videos — image-to-video, deferred until credits allow)
- `endboss-{world}-cinematic.mp4` ×4 — 16:9 1080p, ~72 cr each ⬜
- `boss-{world}-{opening}-anim.mp4` — marquee mini-bosses (Dragon, Veiled Queen, Thermal Phantom…), ~4–6, ~15–22 cr each ⬜

### A8 · Ambient / UI scenes — `public/art/ui/`
`scene-throne.webp` (paywall/OG, 16:9 + 1200×630) ✅ · `passport-tome.webp` (4:3) ✅ · `embers-loop.mp4` ✅ · `bg-hall.mp4` ✅ · `bg-pain.mp4` ✅.

**Higgsfield still totals:** 43 to generate (4 maps + 15 tiles + 20 mini-boss + 4 end-boss) × 2 cr = **~86 cr**. Videos extra (~400 cr) — later.

---

## B. CODED / SVG ASSETS (built by Claude Code — NOT Higgsfield)

### B1 · Logo & wordmark 🔧 (exists as Alain's ornate crest + Cinzel wordmark)
- App mark (32px header), favicon, full lockup. Crisp at all sizes.

### B2 · Icon set — `src/components/icons/` — single consistent family, gold-themeable, sizes 24 (nav) / 20 (inline) / 16 (small)
Recommend **lucide-react** as the base (already in stack), restyled to the gold/obsidian theme, + a few **custom SVG** for the premium marks. Full list to build/wire:
- **Nav:** map · drill (dumbbell/swords) · daily (calendar/flame) · passport (book) · profile (crown).
- **Actions:** hint (lightbulb) · skip · next (chevron) · share · download · play · settings · back · close.
- **Status:** streak flame (3 states) · check ✓ · cross ✗ · star · life (heart/shield) · timer · lock (Pro) · IQ (custom crown-IQ mark).
- **Custom premium SVG:** crown/logo mark · wax seal base · mastery medals (B3) · ornate frame corners (B6).

### B3 · Mastery medals 🔧 — SVG, 1:1, ~48–64px — bronze / silver / gold (Easy/Medium/Hard). Shown on nodes, opening panels, passport.

### B4 · Passport seals 🔧 — SVG, 64px — one base wax-seal + a per-opening emblem (20). Filled = gold; empty = dashed `--locked` ring.

### B5 · Chess piece set 🔧 — SVG — start with a clean open set (cburnett/merida via chessground); optional custom gold/obsidian set in Phase 2+.

### B6 · UI primitives 🔧 (coded, from Art Bible §1.4 / §6)
- Ornate gold frame (corners + border) — variants gold / hero / locked.
- Map node markers — 4 states (locked / available-pulse / in-progress-arc / conquered-star).
- Opening IQ gauge + number, XP bar, line-progress bar, gauntlet HUD (timer/lives/counter), streak flame states, progress rings.

### B7 · Badges / achievements 🔧 — SVG set for quests/milestones (streak 7/30/100, first win, world cleared, etc.).

---

## C. PRODUCTION METHOD (consistency + budget)
1. **World-by-world.** For each world: generate the **map** + **the world's first mini-boss** → judge it → **reference that job** when generating the other 4 mini-bosses + the end-boss + the tiles, so the whole world is one coherent set (the anchor-then-reference lesson).
2. **Stills before motion.** Cinematics/animations only after the still set exists and credits allow.
3. **Exact dimensions:** generate at the listed aspect, then export/resize to the exact px and webp; re-encode videos all-keyframe + strip audio.
4. **SVG track runs in parallel** — Claude Code builds §B from the Art Bible regardless of Higgsfield progress.

## D. GENERATION ORDER (priority)
1. **MVP world** (the chosen one): map + its missing tiles + 5 mini-boss + 1 end-boss (~10 images ≈ ~20 cr). Gives Claude Code one fully-illustrated world.
2. The other 3 worlds, one at a time (~20 cr each).
3. Cinematics + marquee animations (needs a credit top-up).
4. §B SVG/icons — parallel, no credits.

## E. CREDIT BUDGET vs CURRENT BALANCE
- **Current: 81 credits.**
- One MVP world (stills): **~20 cr** → leaves ~60.
- All 43 stills: **~86 cr** → **need a small top-up** (or do 1–2 worlds now, rest after).
- All cinematics + animations: **~400 cr** → top-up required.
- **Recommendation:** generate the MVP world's stills now (~20 cr), build §B in parallel, top up before the remaining worlds + all motion.
