# CHESSHEROQUEST — VISUAL ASSETS MANIFEST

> Source of truth for every generated visual asset in the app.
> Generation campaign tracker + folder map + Claude Code wiring.
> Art direction: heroic dark-fantasy — **obsidian base + gold ornamentation**, with a **per-archetype accent colour** (already established in the canon archetype art): Warrior = crimson/red, Strategist = violet/purple, Defender = emerald/green, Trickster = cyan/teal. Cinzel display type. Reference mockup: `mockup-hub-rpg.html`. All future art must match the archetype set's painted, premium-collectible look.
> Priority tags: **P1** = MVP, **P2** = V1, **P3** = V2/V3.
> Status: ⬜ todo · 🟡 generated, not validated · ✅ validated & placed in repo.

---

## 0. Generate vs. keep-as-code

**Generate (raster, via Higgsfield):** characters, bosses, coach, backgrounds, textures, kingdom art, DNA Card frame, painted medallions, rank insignia, emblems/sigils.

**Do NOT generate — build as SVG/CSS in Claude Code:** nav icons, XP / gem / streak / heart icons, Opening-IQ gauge, progress bars, dividers, buttons, tooltips, badges that are purely typographic. Crisper, themeable, lighter, free.

---

## 1. Folder structure (Next.js — static assets in `public/`)

```
public/
  assets/
    brand/         # og-image, app-icon, wordmark (if raster)
    archetypes/    # the 4 hero archetypes (portrait + avatar crop)
    backgrounds/   # full-bleed screen backgrounds (16:9 / 9:16)
    textures/      # tileable obsidian / parchment / stone
    nodes/         # quest-map medallion states
    dna-card/      # shareable DNA card frame + overlays
    coach/         # the AI mentor character
    kingdoms/      # per-opening art (banner / emblem / boss)
      caro-kann/
      italian/
      ...
    badges/        # rank insignia, mastery seals
    passport/      # collection cover + stamps
```

Central typed registry: `src/lib/assets.ts` — every component imports paths from here, **never hard-coded string literals**.

---

## 2. Naming & format conventions

- **kebab-case**, descriptive: `warrior-portrait.png`, `quest-map-bg.webp`.
- **State suffixes:** `-active`, `-completed`, `-locked`, `-hover`.
- **Format:** PNG (transparency: characters, emblems, frames) · WebP (backgrounds/textures, smaller). Claude Code can batch-convert + emit `@2x` retina variants.
- **Recommended Higgsfield aspect ratios** in the table below.

---

## 3. Asset list

### P1 — Core / MVP

| Asset | File | Folder | Ratio | Where used | Status |
|---|---|---|---|---|---|
| Warrior archetype | `warrior-portrait.png` | archetypes | 3:4 | DNA Results, Profile, DNA Card | ✅ done (canon) |
| Strategist archetype | `strategist-portrait.png` | archetypes | 3:4 | idem | ✅ done (canon) |
| Defender archetype | `defender-portrait.png` | archetypes | 3:4 | idem | ✅ done (canon) |
| Trickster archetype | `trickster-portrait.png` | archetypes | 3:4 | idem | ✅ done (canon) |
| Archetype sigils ×4 | `sigil-<archetype>.png` | archetypes | 1:1 | nav/profile/cards (small) | ✅ done (medallion badges) |
| DNA Card frame | `frame.png` | dna-card | 4:5 | S2 shareable card (viral loop) | ⬜ |
| Quest Map background | `quest-map-bg.webp` | backgrounds | 16:9 | Quest/Map hub | ⬜ |
| Today hero background | `today-hero-bg.webp` | backgrounds | 16:9 | Today landing | ⬜ |
| DNA Test ambient bg | `dna-test-bg.webp` | backgrounds | 16:9 | S1 test surface | ⬜ |
| Results reveal bg | `results-reveal-bg.webp` | backgrounds | 16:9 | S2 reveal moment | ⬜ |
| Obsidian texture | `obsidian.webp` | textures | 1:1 tile | global surfaces | ⬜ |
| Parchment texture | `parchment.webp` | textures | 1:1 tile | Passport / Learn | ⬜ |
| Node — active | `node-active.png` | nodes | 1:1 | Quest Map | ✅ chosen → place |
| Node — completed | `node-completed.png` | nodes | 1:1 | Quest Map | ✅ chosen → place |
| Node — locked | `node-locked.png` | nodes | 1:1 | Quest Map | ✅ chosen → place |
| Node — boss | `node-boss.png` | nodes | 1:1 | Quest Map | ✅ chosen → place |
| AI Coach / mentor | `mentor.png` | coach | 3:4 | Learn, onboarding, empty states | ⬜ |
| OG / social share image | `og-image.png` | brand | 1.91:1 | meta tags | ⬜ |
| App icon | `app-icon.png` | brand | 1:1 | PWA / favicon base | ⬜ |

### P2 — V1

| Asset | File | Folder | Ratio | Where used | Status |
|---|---|---|---|---|---|
| Boss arena background | `boss-arena-bg.webp` | backgrounds | 16:9 | Boss Fight | ⬜ |
| Kingdom banner (per opening) | `kingdoms/<id>/banner.webp` | kingdoms | 16:9 | Opening/Kingdom detail | ⬜ |
| Kingdom emblem (per opening) | `kingdoms/<id>/emblem.png` | kingdoms | 1:1 | Quest Map node label, detail | ⬜ |
| Kingdom boss (per opening) | `kingdoms/<id>/boss.png` | kingdoms | 3:4 | Boss Fight | ✅ already have — skip generation |
| Rank insignia — 1000 | `rank-1000.png` | badges | 1:1 | Profile, Road-to-Elo | ⬜ |
| Rank insignia — 1200 | `rank-1200.png` | badges | 1:1 | idem | ⬜ |
| Rank insignia — 1500 | `rank-1500.png` | badges | 1:1 | idem | ⬜ |
| Rank insignia — 1800 | `rank-1800.png` | badges | 1:1 | idem | ⬜ |
| Mastery seal | `mastery-seal.png` | badges | 1:1 | Passport, Opening detail | ⬜ |
| Passport cover | `cover.webp` | passport | 3:4 | Passport/Collection | ⬜ |
| Passport stamp — mastered | `stamp-mastered.png` | passport | 1:1 | Passport | ⬜ |
| Passport stamp — locked | `stamp-locked.png` | passport | 1:1 | Passport | ⬜ |
| Weekly report frame | `weekly-report-frame.png` | dna-card | 4:5 | Weekly Progress Report (shareable) | ⬜ |

> **Kingdom art scales with curated openings.** Generate a kingdom's 3 assets only when that opening is authored in `chess-curation-spec.md`. Start MVP with the archetype-assigned starter repertoires.

### P3 — V2/V3 (defer)

| Asset | File | Folder | Notes | Status |
|---|---|---|---|---|
| Profile banner variants | `profile-banner-*.webp` | backgrounds | unlockable cosmetics | ⬜ |
| League / Hall of Fame art | `league-*.png` | badges | social competition | ⬜ |
| Avatar frame variants | `avatar-frame-*.png` | badges | progression rewards | ⬜ |

---

## 4. Per-asset workflow (manual, non-technical)

1. **Generate** in the Claude chat (Higgsfield) at the ratio in the table.
2. **Download** the result from the widget (download button).
3. **Rename** to the exact filename above, **drop** into the matching `public/assets/<folder>/`.
4. **Commit** (dev branch).
5. **Flip the status** in this manifest (⬜ → ✅).
6. Once a batch is placed, give Claude Code the wiring prompt (§5).

> There is no direct Higgsfield → GitHub pipe. The download → drop-in-folder → commit step is manual. Claude Code handles everything downstream (registry, optimization, component wiring).

---

## 5. Claude Code — setup prompt (paste once)

```
Crée le système d'assets de ChessHeroQuest.

1. Crée l'arborescence public/assets/ avec les sous-dossiers :
   brand, archetypes, backgrounds, textures, nodes, dna-card, coach, kingdoms, badges, passport.

2. Crée src/lib/assets.ts : un registre TYPÉ qui mappe chaque asset à son chemin public.
   - type ArchetypeId = 'warrior' | 'strategist' | 'defender' | 'trickster'
   - ASSETS = { archetypes: { warrior: '/assets/archetypes/warrior-portrait.png', ... }, backgrounds: {...}, nodes: {...}, ... }
   - helper getArchetypeArt(id: ArchetypeId)
   - aucun chemin d'asset en dur ailleurs dans le code : tout passe par ce registre.

3. Tant qu'un fichier réel n'est pas déposé, affiche un placeholder (rectangle gris + nom du fichier attendu). Ne génère AUCUNE image toi-même.

4. Ajoute un script npm "assets:optimize" qui convertit les backgrounds en WebP et génère les variantes @2x des PNG.

5. Référence-toi à docs/visual-assets.md pour la liste exhaustive et les dossiers.
```

## 5b. Claude Code — wiring prompt (per batch placed)

```
Les assets suivants viennent d'être déposés dans public/assets/ : [liste].
Mets à jour src/lib/assets.ts puis branche-les dans les écrans concernés
(voir colonne "Where used" de docs/visual-assets.md). Remplace les placeholders.
Ne touche pas aux écrans qui n'ont pas encore leurs assets.
```

---

## 6. Recommended generation order

1. **Batch 1 — Archetypes ×4** (foundational, reused everywhere; validates character DA).
2. **Batch 2 — Quest Map bg + node states ×4** (the signature screen).
3. **Batch 3 — DNA Card frame + sigils** (the viral asset).
4. **Batch 4 — Today bg + textures + coach**.
5. **Batch 5 — Boss arena + first kingdom set**.
6. P2/P3 as features land.

Validate look after Batch 1 before scaling.
