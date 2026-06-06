/**
 * Curated starter paths for the MVP (build order #1: "load one path — 2-3
 * curated openings"). Hand-encoded editorial lines, one per DNA archetype,
 * each a calm, playable beginner mainline. Every move is certified legal by
 * chess.js in line.test.ts.
 */
import type { CuratedPath } from "./types";

export const ITALIAN_GIUOCO_PIANISSIMO: CuratedPath = {
  id: "italian-giuoco-pianissimo",
  name: "Italian Game — Giuoco Pianissimo",
  eco: "C50",
  archetype: "strategist",
  description:
    "The classical Italian: quiet development, a strong center, and a slow strategic build-up.",
  moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6", "d3", "d6"],
};

export const SCANDINAVIAN_MAINLINE: CuratedPath = {
  id: "scandinavian-mainline",
  name: "Scandinavian Defense — Mainline",
  eco: "B01",
  archetype: "trickster",
  description:
    "Strike at the center immediately, recapture with the queen, and reroute to a sturdy setup.",
  moves: ["e4", "d5", "exd5", "Qxd5", "Nc3", "Qa5", "d4", "Nf6", "Nf3", "c6"],
};

export const CARO_KANN_CLASSICAL: CuratedPath = {
  id: "caro-kann-classical",
  name: "Caro-Kann Defense — Classical",
  eco: "B18",
  archetype: "defender",
  description:
    "A rock-solid reply to 1.e4: develop the light-squared bishop before locking the pawn chain.",
  moves: ["e4", "c6", "d4", "d5", "Nc3", "dxe4", "Nxe4", "Bf5", "Ng3", "Bg6"],
};

export const EVANS_GAMBIT: CuratedPath = {
  id: "evans-gambit",
  name: "Evans Gambit",
  eco: "C51",
  archetype: "warrior",
  description:
    "Sacrifice a pawn to rip open lines, seize the center, and launch a furious attack.",
  moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "b4", "Bxb4", "c3", "Ba5"],
};

export const KINGS_GAMBIT: CuratedPath = {
  id: "kings-gambit",
  name: "King's Gambit Accepted",
  eco: "C37",
  archetype: "warrior",
  description: "Offer the f-pawn for rapid development and a roaring kingside attack.",
  moves: ["e4", "e5", "f4", "exf4", "Nf3", "g5", "Bc4", "Bg7", "d4", "d6"],
};

export const SICILIAN_DRAGON: CuratedPath = {
  id: "sicilian-dragon",
  name: "Sicilian Defense — Dragon",
  eco: "B70",
  archetype: "warrior",
  description: "Fianchetto the dragon bishop and storm down the long diagonal.",
  moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "g6"],
};

export const QUEENS_GAMBIT_DECLINED: CuratedPath = {
  id: "queens-gambit-declined",
  name: "Queen's Gambit Declined",
  eco: "D35",
  archetype: "strategist",
  description: "A classical, rock-solid centre — patient maneuvering and a small edge.",
  moves: ["d4", "d5", "c4", "e6", "Nc3", "Nf6", "Bg5", "Be7", "e3", "O-O"],
};

export const LONDON_SYSTEM: CuratedPath = {
  id: "london-system",
  name: "London System",
  eco: "D02",
  archetype: "strategist",
  description: "A reliable setup you can play against almost anything: Bf4, e3, c3.",
  moves: ["d4", "d5", "Nf3", "Nf6", "Bf4", "e6", "e3", "c5", "c3", "Nc6"],
};

export const SLAV_DEFENSE: CuratedPath = {
  id: "slav-defense",
  name: "Slav Defense",
  eco: "D17",
  archetype: "defender",
  description: "Support the centre with c6 and keep the light-squared bishop free.",
  moves: ["d4", "d5", "c4", "c6", "Nf3", "Nf6", "Nc3", "dxc4", "a4", "Bf5"],
};

export const FRENCH_DEFENSE: CuratedPath = {
  id: "french-defense",
  name: "French Defense — Classical",
  eco: "C11",
  archetype: "defender",
  description: "A sturdy pawn chain; counterattack the base with patience.",
  moves: ["e4", "e6", "d4", "d5", "Nc3", "Nf6", "Bg5", "Be7", "e5", "Nfd7"],
};

export const BUDAPEST_GAMBIT: CuratedPath = {
  id: "budapest-gambit",
  name: "Budapest Gambit",
  eco: "A52",
  archetype: "trickster",
  description: "A surprise gambit against 1.d4 — quick piece play for the pawn.",
  moves: ["d4", "Nf6", "c4", "e5", "dxe5", "Ng4", "Nf3", "Nc6", "Bf4", "Bb4"],
};

export const ENGLUND_GAMBIT: CuratedPath = {
  id: "englund-gambit",
  name: "Englund Gambit",
  eco: "A40",
  archetype: "trickster",
  description: "A cheeky 1...e5 against 1.d4 — set traps and regain the pawn.",
  moves: ["d4", "e5", "dxe5", "Nc6", "Nf3", "Qe7", "Nc3", "Nxe5", "Nxe5", "Qxe5"],
};

export const STARTER_PATHS: CuratedPath[] = [
  ITALIAN_GIUOCO_PIANISSIMO,
  SCANDINAVIAN_MAINLINE,
  CARO_KANN_CLASSICAL,
  EVANS_GAMBIT,
  KINGS_GAMBIT,
  SICILIAN_DRAGON,
  QUEENS_GAMBIT_DECLINED,
  LONDON_SYSTEM,
  SLAV_DEFENSE,
  FRENCH_DEFENSE,
  BUDAPEST_GAMBIT,
  ENGLUND_GAMBIT,
];
