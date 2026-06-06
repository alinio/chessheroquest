# ChessHeroQuest — Opening & Boss Catalog (Doc 3 of 3)

**Scope:** the four Hero Worlds, every opening + its real named variations, and a fully named boss roster (20 Opening Guardians + 4 Kingdom Bosses) with drop-in Higgsfield design briefs.
**Uses:** the style rules, accents, asset formats and the Higgsfield prompt templates from Doc 2 (Art Direction Bible). Each design brief below fills the `[SLOTS]` of those templates.
**Note:** rosters/variations are accurate to standard opening theory but the *playable line trees, traps and boss move-sequences* still need chess curation (GDD §11). Names & lore are original to ChessHeroQuest.

**Per-boss entry format (consistent — Claude Code & the asset pipeline read this directly):**
- **Name · Title · Lore** (flavor, LLM-free truth elsewhere)
- **Tests** — what the boss fight throws at the player
- **Design brief** — drop into Doc 2 Higgsfield template (figure · attire/props · pose · palette · mood/lighting)
- **Asset** — file + format + dimensions

---

## 0. NAMING & WORLD CONVENTIONS
- Mini-Boss = **Opening Guardian** (one per opening). World Boss = **Kingdom Boss / the Gauntlet** (one per world). Never "monster".
- Each World has: a **name**, an **accent** (Doc 2), a **mood**, a **map background** (Higgsfield 9:16, scenery only — path/nodes coded on top).
- Accent hues: Warrior crimson `#E0413B` · Strategist royal-purple `#8B6CFF` · Defender emerald `#2FB67A` · Trickster cyan `#38C7D6`. Every boss brief uses its world accent as the glow color (a guardian may add a secondary opening hue).

---

# 1. WARRIOR WORLD — "The Ember Marches"
**Accent:** crimson `#E0413B`. **Mood:** volcanic battlefield, molten-gold lava veins, ash sky, war-forged. Aggression, gambits, sacrifice for initiative.
**Map background** `[HF 9:16]`: a tall ascent up a volcanic war-road — cracked obsidian cliffs, rivers of molten gold, a fortress silhouette at the summit, crimson glow, empty winding path (no markers).
**Roster (5):** Italian Game · King's Gambit · Scotch Game · Smith-Morra Gambit · Sicilian Dragon.

### 1.1 Italian Game — `C50–C54` · White
- **Identity:** classical bishop to c4, fast development aimed at f7. Main line `1.e4 e5 2.Nf3 Nc6 3.Bc4`.
- **Variations:** Giuoco Piano · Giuoco Pianissimo · Evans Gambit · Two Knights Defense · Fried Liver Attack (Fegatello) · Traxler Counterattack · Møller Attack · Hungarian Defense.
- **Mini-Boss — Aldovrandi, the Roman Edge** · *Guardian of the Italian Game.* A Renaissance condottiero who duels with two crossed bishop-blades aimed at the king's throat.
  - **Tests:** Giuoco Piano main line + Two Knights / Fried Liver tactics + the Evans Gambit deviation.
  - **Design brief:** a tall Renaissance war-knight in molten-gold ornate plate with a crimson cape; two slender bishop-shaped blades crossed before him; standing on a cracked marble-and-obsidian dueling floor; confident forward lean; crimson rim-light, gold reflections, ash drifting.
  - **Asset:** `boss-warrior-italian.webp` · 3:4 · 1024×1365.
### 1.2 King's Gambit — `C30–C39` · White
- **Identity:** `1.e4 e5 2.f4` — burn the f-pawn for a roaring attack.
- **Variations:** KGA · KGD · Falkbeer Countergambit · Kieseritzky · Muzio · Allgaier · Bishop's Gambit · Fischer Defense · Cunningham.
- **Mini-Boss — Pyrrhus the Unbridled** · *Guardian of the King's Gambit.* A flame-wreathed warrior-king who sets his own pawns alight to clear a path to glory.
  - **Tests:** KGA Kieseritzky main line + Muzio sacrifice + Falkbeer counter.
  - **Design brief:** a bare-chested berserker-king in scorched gold pauldrons and a molten crown; one hand hurling a burning pawn forward; surrounded by f-file flames; wild victorious roar; intense crimson-orange firelight, embers everywhere.
  - **Asset:** `boss-warrior-kingsgambit.webp` · 3:4 · 1024×1365.
### 1.3 Scotch Game — `C44–C45` · White
- **Identity:** `1.e4 e5 2.Nf3 Nc6 3.d4` — smash the center open early.
- **Variations:** Scotch Gambit · Classical (Schmidt) · Mieses Variation · Göring Gambit · Steinitz Variation.
- **Mini-Boss — Bruce of the Broken Center** · *Guardian of the Scotch.* A highland warlord who cleaves the board's center with a single d4 blow.
  - **Tests:** Scotch Classical & Mieses + Göring Gambit deviation.
  - **Design brief:** a towering highland warlord, tartan-wrapped over crimson-bronze plate, a great claymore mid-swing splitting a stone chessboard; stag-skull pauldron; standing in cold mist lit by molten-gold cracks; powerful downward strike pose; crimson rim-light through fog.
  - **Asset:** `boss-warrior-scotch.webp` · 3:4 · 1024×1365.
### 1.4 Smith-Morra Gambit — `B21` · White (vs Sicilian)
- **Identity:** `1.e4 c5 2.d4 cxd4 3.c3` — give a pawn to flood the open lines.
- **Variations:** Accepted · Declined · Siberian Trap · Chicago Defense · Finegold Defense.
- **Mini-Boss — Mordra, the Pawn-Reaper** · *Guardian of the Morra.* A gambit-sorcerer who sows a single pawn and reaps a storm of attacking pieces.
  - **Tests:** Morra Accepted main development + Siberian Trap awareness.
  - **Design brief:** a hooded gambit-sorcerer in crimson-and-gold robes, a bone scythe trailing glowing pawn-runes that rise into spectral pieces; gaunt commanding figure over a board sprouting sigils; arms spread summoning; crimson glow, swirling ash and gold sparks.
  - **Asset:** `boss-warrior-morra.webp` · 3:4 · 1024×1365.
### 1.5 Sicilian Dragon — `B70–B79` · Black
- **Identity:** `…d6, …Nf6, …g6, …Bg7` — the fianchetto bishop is a dragon down the long diagonal.
- **Variations:** Yugoslav Attack · Classical · Levenfish · Accelerated Dragon · Hyperaccelerated.
- **Mini-Boss — Vesuvio, the Dragon of the Long Diagonal** · *Guardian of the Dragon.* A true dragon coiled along the a1–h8 diagonal, breathing fire the length of the board.
  - **Tests:** Yugoslav Attack main line (opposite-side castling race) + Accelerated move-order.
  - **Design brief:** a colossal obsidian-scaled dragon coiled diagonally, molten-gold underbelly, breathing a stream of fire along a glowing diagonal of board squares; wings half-spread; head low and menacing toward the viewer; crimson-and-gold inferno light, embers and heat-haze.
  - **Asset:** `boss-warrior-dragon.webp` · 3:4 · 1024×1365. **Animation** (i2v, optional): slow breathing + diagonal fire flicker glow, everything solid, seamless loop → `boss-warrior-dragon-anim.mp4`.

### ⚔️ KINGDOM BOSS — **Ignar, the Crowned Conflagration** · *Warlord of the Ember Marches.*
A colossal armored war-king enthroned on a heap of molten swords at the volcano's summit; the final gauntlet of every Warrior opening.
- **Tests (Gauntlet):** ~10 variations across all five openings, timed, White attacking lines + the Dragon as Black.
- **Design brief** `[HF 16:9]`: an immense crowned war-king in blackened-gold full plate fused with lava, seated on a throne of fused swords above a vast cracked-obsidian chess arena; molten-gold cape; raising a flaming greatsword as a challenge; apocalyptic crimson-orange sky, falling embers, awe-inspiring scale, cinematic.
- **Asset:** `endboss-warrior.webp` · 16:9 · 1920×1080. **Cinematic** (i2v): slow ember fall + cape/flame drift + glow pulse → `endboss-warrior-cinematic.mp4` (poster = still).

---

# 2. STRATEGIST WORLD — "The Obsidian Court"
**Accent:** royal-purple `#8B6CFF`. **Mood:** regal astral hall, starlit black marble, violet nebula light, geometric order. Positional mastery, deep theory, the slow squeeze.
**Map background** `[HF 9:16]`: a tall climb through a floating astral palace — black-marble terraces, violet star-fields, suspended geometric arches, a distant throne hall, empty winding path.
**Roster (5):** Ruy Lopez · Queen's Gambit · Nimzo-Indian · Catalan · English Opening.

### 2.1 Ruy Lopez (Spanish) — `C60–C99` · White
- **Identity:** `1.e4 e5 2.Nf3 Nc6 3.Bb5` — pressure the knight, build a lasting bind.
- **Variations:** Morphy Defense · Berlin Defense · Closed · Marshall Attack · Exchange · Open · Schliemann (Jaenisch) · Steinitz · Breyer · Chigorin · Zaitsev.
- **Mini-Boss — Bishop Rui, the Spanish Inquisitor** · *Guardian of the Spanish.* A towering ecclesiastic who pins and converts, patient and merciless.
  - **Tests:** Closed Ruy main line + Berlin wall + Marshall gambit awareness.
  - **Design brief:** a tall stern bishop-inquisitor in violet-and-gold vestments and a high mitre, a long golden crozier pinning a fallen knight piece to the floor; black-marble cathedral with violet light shafts; commanding upright pose; purple rim-light, gold filigree glints.
  - **Asset:** `boss-strategist-ruylopez.webp` · 3:4 · 1024×1365.
### 2.2 Queen's Gambit — `D06–D69` · White
- **Identity:** `1.d4 d5 2.c4` — offer a wing pawn to dominate the center.
- **Variations:** QGD Orthodox · QGA · Tarrasch · Semi-Tarrasch · Cambridge Springs · Lasker Defense · Exchange · Vienna · Albin Countergambit · Chigorin.
- **Mini-Boss — Regina Velata, the Veiled Queen** · *Guardian of the Gambit.* A regal sorceress-queen who offers a jeweled pawn as bait and closes the trap with the whole board.
  - **Tests:** QGD Orthodox/Exchange main lines + QGA + Albin counter deviation.
  - **Design brief:** a tall veiled queen in a flowing violet gown patterned with a chessboard, gold crown and filigree, extending one hand offering a glowing jeweled pawn; behind her a cloak that unfurls into ranks of pieces; serene, dangerous poise; soft purple-gold court light, drifting motes.
  - **Asset:** `boss-strategist-queensgambit.webp` · 3:4 · 1024×1365. **Animation** (i2v, optional): cloak/pawn shimmer, solid figure → `boss-strategist-queensgambit-anim.mp4`.
### 2.3 Nimzo-Indian — `E20–E59` · Black
- **Identity:** `1.d4 Nf6 2.c4 e6 3.Nc3 Bb4` — pin and control with the dark-square bishop.
- **Variations:** Rubinstein · Classical (Capablanca) · Sämisch · Leningrad · Hübner · Kmoch · Fischer.
- **Mini-Boss — Aron of the Bound Knight** · *Guardian of the Nimzo.* A mystic strategist who binds enemies in invisible chains before they can move.
  - **Tests:** Rubinstein & Classical main lines + the doubled-pawn structural ideas.
  - **Design brief:** a lean robed strategist in indigo-violet mystic robes with gold geometric trim, one hand outstretched casting glowing chains that bind a kneeling knight piece; floating board-squares around him; calm authoritative gesture; purple astral light, fine gold linework, star motes.
  - **Asset:** `boss-strategist-nimzo.webp` · 3:4 · 1024×1365.
### 2.4 Catalan — `E00–E09` · White
- **Identity:** `1.d4 Nf6 2.c4 e6 3.g3` — a fianchetto bishop as a beam down the long diagonal.
- **Variations:** Open Catalan · Closed Catalan.
- **Mini-Boss — Conde Catalan, the Architect of Light** · *Guardian of the Catalan.* A geometer-noble who channels a single bishop into a ray that cuts the board in half.
  - **Tests:** Open vs Closed Catalan main structures + the long-diagonal pressure.
  - **Design brief:** an elegant architect-noble in violet-gold, holding a crystalline fianchetto bishop emitting a golden ray along a glowing diagonal; cathedral of floating geometry behind; poised, precise stance; purple ambient with a bright gold diagonal beam.
  - **Asset:** `boss-strategist-catalan.webp` · 3:4 · 1024×1365.
### 2.5 English Opening — `A10–A39` · White
- **Identity:** `1.c4` — flank control, a reversed Sicilian, flexible and deep.
- **Variations:** Symmetrical · Reversed Sicilian · Four Knights · Botvinnik System · Hedgehog · Mikenas-Carls · Anglo-Indian.
- **Mini-Boss — Albion, the Flank Sovereign** · *Guardian of the English.* A sovereign who commands from the wing, mirroring and outflanking every plan.
  - **Tests:** Symmetrical & Reversed-Sicilian structures + Botvinnik setup.
  - **Design brief:** a regal commander on a violet moor at dusk, gold-trimmed cloak, a c-file banner raised, a faint mirrored double of himself behind (the reversed-Sicilian motif); commanding outstretched arm; cool purple fog, gold edge-light.
  - **Asset:** `boss-strategist-english.webp` · 3:4 · 1024×1365.

### ♛ KINGDOM BOSS — **Theron the Eternal, Regent of the Obsidian Court** · *Grandmaster of the Court.*
The supreme strategist on an astral throne, the entire board reflected in the starfield around him; the final gauntlet of positional mastery.
- **Tests (Gauntlet):** ~10 variations across all five openings, timed, mostly White positional lines + Nimzo as Black.
- **Design brief** `[HF 16:9]`: a serene, immense grandmaster-king on a floating obsidian throne above a vast mirrored chess arena, violet nebula and stars wheeling behind, a cloak woven from constellations, one hand resting on a glowing king piece; transcendent, intimidatingly calm; deep purple-and-gold cosmic light, cinematic scale.
- **Asset:** `endboss-strategist.webp` · 16:9 · 1920×1080. **Cinematic** (i2v): slow star drift + cloak shimmer + glow pulse → `endboss-strategist-cinematic.mp4`.

---

# 3. DEFENDER WORLD — "The Aegis Bastion"
**Accent:** emerald `#2FB67A`. **Mood:** ancient unbreakable fortress, mossy stone, ivy, calm green dawn light, deep water moats. Solid systems, patience, counterpunch.
**Map background** `[HF 9:16]`: a tall climb up a colossal fortress — layered stone ramparts, ivy and moss, emerald torch-glow, a great keep at the summit, mist and still water, empty winding path.
**Roster (5):** London System · Caro-Kann · French Defense · Slav Defense · Petroff Defense.

### 3.1 London System — `D02 / A48` · White
- **Identity:** a solid system: `d4, Bf4, e3, Nf3, c3` — same setup vs almost anything.
- **Variations:** Classical London · Jobava London · Accelerated London.
- **Mini-Boss — Warden Locke, the Stone Wall** · *Guardian of the London.* A fortress-warden who never advances and never breaks; he simply outlasts you.
  - **Tests:** Classical London setup vs ...d5 and ...g6 systems + Jobava aggression.
  - **Design brief:** a broad armored warden in emerald-trimmed grey stone-plate, a vast tower-shield carved with the London pawn-setup, planted immovably before a portcullis; ivy creeping over his armor; rooted, arms-crossed-behind-shield stance; soft emerald torchlight, mossy stone.
  - **Asset:** `boss-defender-london.webp` · 3:4 · 1024×1365.
### 3.2 Caro-Kann — `B10–B19` · Black
- **Identity:** `1.e4 c6 2.d4 d5` — a rock-solid pawn structure with no weaknesses.
- **Variations:** Classical · Advance · Exchange · Panov-Botvinnik Attack · Two Knights · Fantasy Variation · Karpov · Bronstein-Larsen.
- **Mini-Boss — Karran, the Patient Wall** · *Guardian of the Caro-Kann.* A hooded sentinel of the chain who waits, unbreakable, for the enemy to overreach.
  - **Tests:** Classical & Advance main lines + Panov-Botvinnik deviation.
  - **Design brief:** a tall hooded sentinel in layered emerald-and-grey scale armor forming an interlocking pawn-chain shield-wall before him; spear grounded, perfectly still; weathered patient face half-shadowed; cool emerald dawn light, faint mist, stone behind.
  - **Asset:** `boss-defender-carokann.webp` · 3:4 · 1024×1365.
### 3.3 French Defense — `C00–C19` · Black
- **Identity:** `1.e4 e6 2.d4 d5` — a locked pawn chain and a counterstrike at the base.
- **Variations:** Advance · Tarrasch · Winawer · Classical · Exchange · Rubinstein · MacCutcheon · Fort Knox.
- **Mini-Boss — Geneviève of the Chain** · *Guardian of the French.* A chevalière who fights from behind a fortified pawn chain, striking only at its base.
  - **Tests:** Advance & Winawer main lines + the ...c5/...f6 chain breaks.
  - **Design brief:** a poised armored chevalière in emerald-and-silver with fleur-de-lis engraving, behind a diagonal wall of interlocked pawn-shields, a rapier ready at the wall's base; elegant defensive guard stance; emerald torch glow on stone, banners, light haze.
  - **Asset:** `boss-defender-french.webp` · 3:4 · 1024×1365.
### 3.4 Slav Defense — `D10–D19` · Black
- **Identity:** `1.d4 d5 2.c4 c6` — solid like the Caro but keeping the light bishop free.
- **Variations:** Main line (Czech) · Chebanenko (a6) · Exchange · Geller Gambit · Soultanbéieff · Schlechter.
- **Mini-Boss — Stanislav the Unmoved** · *Guardian of the Slav.* A bogatyr who stands upon a frozen river; nothing crosses without his leave.
  - **Tests:** Main-line Slav + Exchange + the ...dxc4/...b5 pawn-grab ideas.
  - **Design brief:** a massive Slavic bogatyr in bear-fur over emerald-bronze plate, a round shield and broad axe, standing immovable on cracked river-ice that mirrors him; calm immovable stance, feet planted; cold emerald light, frost mist, faint aurora.
  - **Asset:** `boss-defender-slav.webp` · 3:4 · 1024×1365.
### 3.5 Petroff Defense — `C42–C43` · Black
- **Identity:** `1.e4 e5 2.Nf3 Nf6` — symmetry as a weapon; mirror every blow.
- **Variations:** Classical · Steinitz · Cochrane Gambit · Modern Attack · Nimzowitsch.
- **Mini-Boss — Petrov, the Mirror Sentinel** · *Guardian of the Petroff.* A knight who answers every strike with its perfect reflection.
  - **Tests:** Classical & Modern main lines + Cochrane Gambit awareness.
  - **Design brief:** a knight in flawless mirror-polished emerald-silver armor standing before a giant reflective shield that doubles him; both figure and reflection in identical guard; symmetry composition (near-mirrored halves); cool emerald light, sharp reflections, still water floor.
  - **Asset:** `boss-defender-petroff.webp` · 3:4 · 1024×1365.

### 🛡️ KINGDOM BOSS — **Aegidius, the Last Wall** · *Bastion Keeper of the Aegis.*
A colossal living fortress-golem, ramparts for shoulders and a gate for a chest; the final, unbreakable gauntlet.
- **Tests (Gauntlet):** ~10 variations across all five openings, timed, London as White + the four defenses as Black.
- **Design brief** `[HF 16:9]`: a titanic stone-and-emerald fortress-golem rising from a moat, towers as pauldrons, a glowing emerald gate-heart, ivy and waterfalls down its body, standing astride a vast stone chess arena; immovable colossus pose; calm emerald dawn light, mist, monumental scale, cinematic.
- **Asset:** `endboss-defender.webp` · 16:9 · 1920×1080. **Cinematic** (i2v): waterfall/ivy drift + gate-heart glow pulse → `endboss-defender-cinematic.mp4`.

---

# 4. TRICKSTER WORLD — "The Mirage Bazaar"
**Accent:** cyan `#38C7D6`. **Mood:** moonlit illusion-bazaar, silk tents, smoke, masks, floating lanterns, mirror-magic, cyan glow. Surprise, traps, sleight-of-hand.
**Map background** `[HF 9:16]`: a tall climb through a surreal night bazaar — silk pavilions, mirrored archways, floating lanterns, drifting smoke, a grand mirror-hall at the summit, cyan magical glow, empty winding path.
**Roster (5):** Scandinavian · Budapest Gambit · Stafford Gambit · Blackmar-Diemer Gambit · Englund Gambit.

### 4.1 Scandinavian — `B01` · Black
- **Identity:** `1.e4 d5` — drag the fight into the open on move one.
- **Variations:** Mieses-Kotroc (2...Qxd5) · Modern (2...Nf6) · Icelandic Gambit · Portuguese Gambit · Marshall · Gubinsky-Melts.
- **Mini-Boss — Sigrún, the Northern Mirage** · *Guardian of the Scandinavian.* A skald-trickster who lures the queen into the open as a glittering feint.
  - **Tests:** Mieses-Kotroc ...Qa5 main line + Portuguese/Icelandic gambit traps.
  - **Design brief:** a lithe Norse trickster-skald in cyan-and-frost furs and a fox mask, conjuring a mirage-queen of light as a decoy; aurora ribbons and runes swirling; sly beckoning pose; cyan-teal glow, frost sparkles, smoke wisps.
  - **Asset:** `boss-trickster-scandinavian.webp` · 3:4 · 1024×1365.
### 4.2 Budapest Gambit — `A51–A52` · Black
- **Identity:** `1.d4 Nf6 2.c4 e5` — a surprise central thrust that bites.
- **Variations:** Adler · Rubinstein · Alekhine · Fajarowicz.
- **Mini-Boss — Béla, the Thermal Phantom** · *Guardian of the Budapest.* An illusionist who rises from the bath-house steam to snatch a pawn and vanish.
  - **Tests:** Adler & Rubinstein main lines + the ...Ng4/...Bc5 trap motifs.
  - **Design brief:** a translucent phantom-illusionist forming out of cyan steam over a sunken pool, ornate Hungarian mask and robes half-dissolving into vapor; mischievous reaching gesture; teal-cyan glow through steam, wet tile reflections, lantern bokeh.
  - **Asset:** `boss-trickster-budapest.webp` · 3:4 · 1024×1365. **Animation** (i2v, optional): steam drift + form shimmer, face stays solid → `boss-trickster-budapest-anim.mp4`.
### 4.3 Stafford Gambit — `C42` sideline · Black
- **Identity:** `…Nf6 …Nc6 …dxc6` — give a knight to spring mating nets on the unwary.
- **Variations:** main trap lines (…Ng4, …Qh4, …Bc5 nets).
- **Mini-Boss — The Imp of Stafford** · *Guardian of the Stafford.* A grinning imp who hands you a knight like a gift, then snaps a trap shut.
  - **Tests:** the principal Stafford traps + the refutation lines a prepared opponent shows.
  - **Design brief:** a small impish trickster perched on a giant knight piece, offering it forward with a too-wide grin, hidden cyan trap-threads glinting behind; playful menace, leaning toward the viewer; cyan glow, sparks, dark bazaar shadow.
  - **Asset:** `boss-trickster-stafford.webp` · 3:4 · 1024×1365.
### 4.4 Blackmar-Diemer Gambit — `D00` · White
- **Identity:** `1.d4 d5 2.e4 dxe4 3.Nc3` — torch the d-file for raw attacking chances.
- **Variations:** Teichmann · Euwe · Bogoljubow · Ryder Gambit · Lemberger Countergambit.
- **Mini-Boss — Diemer the Flame-Juggler** · *Guardian of the Blackmar-Diemer.* A street-magician who juggles burning pawns and sets the open file alight.
  - **Tests:** Teichmann/Bogoljubow main attacking lines + Ryder gambit + Lemberger counter.
  - **Design brief:** a flamboyant masked juggler in cyan-and-white motley, juggling three burning pawns over an open glowing file, sparks arcing; theatrical mid-toss flourish; cyan-and-ember mixed glow, smoke, lantern-lit bazaar.
  - **Asset:** `boss-trickster-blackmardiemer.webp` · 3:4 · 1024×1365.
### 4.5 Englund Gambit — `A40` · Black
- **Identity:** `1.d4 e5` — a move-one joke that punishes the greedy.
- **Variations:** Englund Gambit Complex · Hartlaub-Charlick · Soller · Felbecker · Mosquito (Zilbermints).
- **Mini-Boss — Hartlaub the Mad** · *Guardian of the Englund.* A court jester whose opening "blunder" hides a noose of threats (the ...Qb4+/...Qxb2 traps).
  - **Tests:** the Englund main trap (…Nge7, …Qb4/…Qe7 nets) + how a calm opponent refutes it.
  - **Design brief:** a wiry jester in cyan-belled motley and a cracked porcelain grin-mask, offering a pawn with one hand while a cyan noose of threat-lines coils from the other; manic theatrical bow; cyan glow, scattered playing-card and chess motifs, smoky stage light.
  - **Asset:** `boss-trickster-englund.webp` · 3:4 · 1024×1365.

### 🃏 KINGDOM BOSS — **Vesper, the Hall of Mirrors** · *Masked Illusionist of the Mirage Bazaar.*
A shapeshifting masked trickster who fights from inside an infinite mirror-hall, every reflection a different gambit; the final gauntlet of deception.
- **Tests (Gauntlet):** ~10 variations across all five openings, timed, mixed colors, heavy on trap-recognition.
- **Design brief** `[HF 16:9]`: a tall androgynous masked illusionist in flowing cyan-and-silver, standing at the center of an infinite hall of mirrors that each show a different masked version mid-trick, a chess arena floor reflecting endlessly; arms spread, theatrical reveal; cyan magical glow, drifting smoke and shards of light, dizzying depth, cinematic.
- **Asset:** `endboss-trickster.webp` · 16:9 · 1920×1080. **Cinematic** (i2v): mirror-shimmer + smoke drift + glow pulse, central figure solid → `endboss-trickster-cinematic.mp4`.

---

# 5. ASSET GENERATION CHECKLIST (what to produce in Higgsfield)
All stills: `nano_banana_pro`, shared style preamble (Doc 2 §5), `declined_preset_id 24bae836-2c4a-48e0-89b6-49fcc0b21612`, world accent as glow. Animations: `seedance_2_0` image-to-video from the validated still (subtle, solid, looped). **Anchor per world:** generate that world's first boss, lock the look, then reference it for the other four so the set is consistent.

| Group | Count | Format | Dims | Files |
|---|---|---|---|---|
| World map backgrounds | 4 | webp | 9:16 1080×1920 | `world-{warrior\|strategist\|defender\|trickster}-map.webp` |
| Mini-Boss (Opening Guardian) stills | 20 | webp | 3:4 1024×1365 | `boss-{world}-{opening}.webp` |
| Kingdom Boss stills | 4 | webp | 16:9 1920×1080 | `endboss-{world}.webp` |
| Kingdom Boss cinematics | 4 | mp4 1080p | 16:9 | `endboss-{world}-cinematic.mp4` |
| Mini-Boss idle animations (optional, marquee bosses) | ~4–6 | mp4 720p | match still | `boss-{world}-{opening}-anim.mp4` |
| Opening tiles (kingdom-style, reuse landing ones where they exist) | 20 | webp | 1:1 1024² | `tile-{opening}.webp` |

**Priority for the vertical slice (GDD §10):** only the chosen MVP Hero's **map** + that hero's **Opening-1 tile** + **Opening-1 mini-boss still**. Generate the rest world-by-world as each World is built — do not pre-generate 50 assets before World 1 ships.
