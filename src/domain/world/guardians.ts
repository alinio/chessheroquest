/**
 * Opening Guardians (mini-bosses) — name/title/lore/taunt from the catalog (flavor;
 * truth is the curated lines + chess.js). Challenges are derived from the real
 * curated line tree (the player must play the correct moves from memory).
 *
 * TODO: full Guardian line set — Two Knights / Fried Liver tactics + Evans Gambit
 * deviation (catalog §1.1) pending curation (GDD §11). Seed = the main line.
 */
import { Chess } from "chess.js";
import { ITALIAN_TREE, mainLine, playerPlies } from "./italian";
import type { OpeningLineTree } from "./types";
import type { CuratedPath } from "@/src/domain/repertoire/types";
import { fenAfter } from "@/src/domain/repertoire/line";

export interface Guardian {
  openingId: string;
  name: string;
  title: string;
  lore: string;
  /** Authored taunt (catalog/GDD flavor — never LLM-generated). */
  taunt: string;
  art: string;
}

/**
 * The full 20-guardian roster. Names, titles and lore are AUTHORED in
 * docs/opening-boss-catalog.md (original CHQ flavor — chess truth lives in the
 * curated lines, never here).
 */
export const GUARDIANS: Record<string, Guardian> = {
  // —— Ember Marches (Warrior)
  italian: {
    openingId: "italian",
    name: "Aldovrandi",
    title: "The Roman Edge",
    lore: "A Renaissance condottiero who duels with two crossed bishop-blades aimed at the king's throat.",
    taunt: "Your king's gate is f7 — and my blades already know the road.",
    art: "/art/bosses/boss-warrior-italian.webp",
  },
  "kings-gambit": {
    openingId: "kings-gambit",
    name: "Pyrrhus",
    title: "The Unbridled",
    lore: "A flame-wreathed warrior-king who sets his own pawns alight to clear a path to glory.",
    taunt: "I burn my own pawns for the open file — what will YOU sacrifice?",
    art: "/art/bosses/boss-warrior-kingsgambit.webp",
  },
  scotch: {
    openingId: "scotch",
    name: "Bruce",
    title: "Of the Broken Center",
    lore: "A highland warlord who cleaves the board's center with a single d4 blow.",
    taunt: "One blow at d4 and your centre is rubble.",
    art: "/art/bosses/boss-warrior-scotch.webp",
  },
  "smith-morra": {
    openingId: "smith-morra",
    name: "Mordra",
    title: "The Pawn-Reaper",
    lore: "A gambit-sorcerer who sows a single pawn and reaps a storm of attacking pieces.",
    taunt: "Take my pawn. Every storm begins with a single seed.",
    art: "/art/bosses/boss-warrior-morra.webp",
  },
  "sicilian-dragon": {
    openingId: "sicilian-dragon",
    name: "Vesuvio",
    title: "The Dragon of the Long Diagonal",
    lore: "A true dragon coiled along the a1–h8 diagonal, breathing fire the length of the board.",
    taunt: "My diagonal is long — and your king stands at the end of it.",
    art: "/art/bosses/boss-warrior-dragon.webp",
  },
  // —— Obsidian Court (Strategist)
  "ruy-lopez": {
    openingId: "ruy-lopez",
    name: "Bishop Rui",
    title: "The Spanish Inquisitor",
    lore: "A towering ecclesiastic who pins and converts, patient and merciless.",
    taunt: "Your knight on c6 is already mine — it just doesn't know it yet.",
    art: "/art/bosses/boss-strategist-ruylopez.webp",
  },
  "queens-gambit": {
    openingId: "queens-gambit",
    name: "Regina Velata",
    title: "The Veiled Queen",
    lore: "A regal sorceress-queen who offers a jeweled pawn as bait and closes the trap with the whole board.",
    taunt: "Take the pawn, child. The board will close around you.",
    art: "/art/bosses/boss-strategist-queensgambit.webp",
  },
  "nimzo-indian": {
    openingId: "nimzo-indian",
    name: "Aron",
    title: "Of the Bound Knight",
    lore: "A mystic strategist who binds enemies in invisible chains before they can move.",
    taunt: "Move, then. Oh — you can't.",
    art: "/art/bosses/boss-strategist-nimzo.webp",
  },
  catalan: {
    openingId: "catalan",
    name: "Conde Catalan",
    title: "The Architect of Light",
    lore: "A geometer-noble who channels a single bishop into a ray that cuts the board in half.",
    taunt: "From g2 I see your whole kingdom.",
    art: "/art/bosses/boss-strategist-catalan.webp",
  },
  english: {
    openingId: "english",
    name: "Albion",
    title: "The Flank Sovereign",
    lore: "A sovereign who commands from the wing, mirroring and outflanking every plan.",
    taunt: "You watch the centre. I am already behind you.",
    art: "/art/bosses/boss-strategist-english.webp",
  },
  // —— Aegis Bastion (Defender)
  london: {
    openingId: "london",
    name: "Warden Locke",
    title: "The Stone Wall",
    lore: "A fortress-warden who never advances and never breaks; he simply outlasts you.",
    taunt: "Come. Break yourself upon me.",
    art: "/art/bosses/boss-defender-london.webp",
  },
  "caro-kann": {
    openingId: "caro-kann",
    name: "Karran",
    title: "The Patient Wall",
    lore: "A hooded sentinel of the chain who waits, unbreakable, for the enemy to overreach.",
    taunt: "Strike when you wish. The wall was here before you.",
    art: "/art/bosses/boss-defender-carokann.webp",
  },
  french: {
    openingId: "french",
    name: "Geneviève",
    title: "Of the Chain",
    lore: "A chevalière who fights from behind a fortified pawn chain, striking only at its base.",
    taunt: "My chain bends; it does not break. Yours will.",
    art: "/art/bosses/boss-defender-french.webp",
  },
  slav: {
    openingId: "slav",
    name: "Stanislav",
    title: "The Unmoved",
    lore: "A bogatyr who stands upon a frozen river; nothing crosses without his leave.",
    taunt: "The river is frozen — and you do not have my leave.",
    art: "/art/bosses/boss-defender-slav.webp",
  },
  petroff: {
    openingId: "petroff",
    name: "Petrov",
    title: "The Mirror Sentinel",
    lore: "A knight who answers every strike with its perfect reflection.",
    taunt: "Whatever you bring, I return it — polished.",
    art: "/art/bosses/boss-defender-petroff.webp",
  },
  // —— Mirage Bazaar (Trickster)
  scandinavian: {
    openingId: "scandinavian",
    name: "Sigrún",
    title: "The Northern Mirage",
    lore: "A skald-trickster who lures the queen into the open as a glittering feint.",
    taunt: "Chase my queen across the snow — I'll be home before you.",
    art: "/art/bosses/boss-trickster-scandinavian.webp",
  },
  budapest: {
    openingId: "budapest",
    name: "Béla",
    title: "The Thermal Phantom",
    lore: "An illusionist who rises from the bath-house steam to snatch a pawn and vanish.",
    taunt: "Blink — and your pawn is steam.",
    art: "/art/bosses/boss-trickster-budapest.webp",
  },
  stafford: {
    openingId: "stafford",
    name: "The Imp of Stafford",
    title: "The Gift-Giver",
    lore: "A grinning imp who hands you a knight like a gift, then snaps a trap shut.",
    taunt: "A free knight, friend! Take it. I insist.",
    art: "/art/bosses/boss-trickster-stafford.webp",
  },
  "blackmar-diemer": {
    openingId: "blackmar-diemer",
    name: "Diemer",
    title: "The Flame-Juggler",
    lore: "A street-magician who juggles burning pawns and sets the open file alight.",
    taunt: "Two pawns for a file of fire — a bargain!",
    art: "/art/bosses/boss-trickster-blackmardiemer.webp",
  },
  englund: {
    openingId: "englund",
    name: "Hartlaub",
    title: "The Mad",
    lore: "A court jester whose opening “blunder” hides a noose of threats.",
    taunt: "A jester's blunder? Look again. Look AGAIN.",
    art: "/art/bosses/boss-trickster-englund.webp",
  },
};

export type Difficulty = "easy" | "medium" | "hard";

export const DIFFICULTY: Record<Difficulty, { label: string; mistakesAllowed: number; hints: boolean; validates: boolean; pro: boolean }> = {
  easy: { label: "Easy", mistakesAllowed: Number.POSITIVE_INFINITY, hints: true, validates: false, pro: false },
  medium: { label: "Medium", mistakesAllowed: 1, hints: false, validates: true, pro: false },
  hard: { label: "Hard", mistakesAllowed: 0, hints: false, validates: true, pro: true },
};

export interface Challenge {
  fenBefore: string;
  expectedSan: string;
  isCritical: boolean;
}

const START_FEN = new Chess().fen();

/** The fight = the player's moves in the curated line, played from memory. */
export function guardianChallenges(tree: OpeningLineTree): Challenge[] {
  const line = mainLine(tree);
  return playerPlies(tree).map((ply) => ({
    fenBefore: ply > 0 ? line[ply - 1]!.fen : START_FEN,
    expectedSan: line[ply]!.san,
    isCritical: Boolean(line[ply]!.isCritical),
  }));
}

export const GUARDIAN_TREES: Record<string, OpeningLineTree> = { italian: ITALIAN_TREE };

/* ------------------------------------------------------------------------- */
/* Curated-path duels — the production fight derives its challenges from the  */
/* same CuratedPath the player learned and drilled (chess.js-certified).       */

/** The 4 Kingdom Bosses (realm gauntlets — catalog flavor, V1 fight pending). */
export const KINGDOM_BOSSES: Record<string, { name: string; title: string }> = {
  "ember-marches": { name: "Ignar", title: "The Crowned Conflagration" },
  "obsidian-court": { name: "Theron the Eternal", title: "Regent of the Obsidian Court" },
  "aegis-bastion": { name: "Aegidius", title: "The Last Wall" },
  "mirage-bazaar": { name: "Vesper", title: "The Hall of Mirrors" },
};

export type GuardianSide = "white" | "black";

/**
 * Which side the player commands per curated path (the repertoire viewpoint:
 * White openings are played as White, defenses as Black).
 */
export const PATH_SIDE: Record<string, GuardianSide> = {
  "italian-giuoco-pianissimo": "white",
  "evans-gambit": "white",
  "kings-gambit": "white",
  "scotch-classical": "white",
  "smith-morra-gambit": "white",
  "ruy-lopez-closed": "white",
  "queens-gambit-declined": "white",
  "catalan-open": "white",
  "english-four-knights": "white",
  "london-system": "white",
  "blackmar-diemer-gambit": "white",
  "sicilian-dragon": "black",
  "nimzo-indian-rubinstein": "black",
  "french-defense": "black",
  "slav-defense": "black",
  "caro-kann-classical": "black",
  "petroff-classical": "black",
  "scandinavian-mainline": "black",
  "budapest-gambit": "black",
  "stafford-gambit": "black",
  "englund-gambit": "black",
  // second lines
  "italian-two-knights": "white",
  "ruy-lopez-exchange": "white",
  "scotch-mieses": "white",
  "sicilian-dragon-yugoslav": "black",
  "queens-gambit-accepted": "white",
  "london-vs-kings-indian": "white",
  "caro-kann-advance": "black",
  "french-advance": "black",
};

export interface PathChallenge {
  /** Half-move index in the path the player must produce. */
  ply: number;
  fenBefore: string;
  expectedSan: string;
}

/**
 * The duel = the player's plies of the curated line, from memory.
 * White answers even plies, Black odd plies (chess.js is the move model).
 */
export function pathChallenges(path: CuratedPath, side: GuardianSide): PathChallenge[] {
  const mine = side === "white" ? 0 : 1;
  const out: PathChallenge[] = [];
  for (let ply = 0; ply < path.moves.length; ply++) {
    if (ply % 2 !== mine) continue;
    out.push({ ply, fenBefore: fenAfter(path, ply), expectedSan: path.moves[ply]! });
  }
  return out;
}
