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

export const STARTER_PATHS: CuratedPath[] = [
  ITALIAN_GIUOCO_PIANISSIMO,
  SCANDINAVIAN_MAINLINE,
  CARO_KANN_CLASSICAL,
  EVANS_GAMBIT,
];
