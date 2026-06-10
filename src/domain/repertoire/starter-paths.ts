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

export const SCOTCH_CLASSICAL: CuratedPath = {
  id: "scotch-classical",
  name: "Scotch Game — Classical",
  eco: "C45",
  archetype: "warrior",
  description: "Open the centre on move three and fight for the initiative with active pieces.",
  moves: ["e4", "e5", "Nf3", "Nc6", "d4", "exd4", "Nxd4", "Bc5", "Be3", "Qf6"],
};

export const SMITH_MORRA_GAMBIT: CuratedPath = {
  id: "smith-morra-gambit",
  name: "Smith-Morra Gambit — Accepted",
  eco: "B21",
  archetype: "warrior",
  description: "Give a pawn against the Sicilian for open lines and fast, aggressive development.",
  moves: ["e4", "c5", "d4", "cxd4", "c3", "dxc3", "Nxc3", "Nc6", "Nf3", "d6"],
};

export const RUY_LOPEZ_CLOSED: CuratedPath = {
  id: "ruy-lopez-closed",
  name: "Ruy Lopez — Closed",
  eco: "C84",
  archetype: "strategist",
  description: "The Spanish torture: pressure the e5 pawn and outmaneuver slowly, piece by piece.",
  moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6", "O-O", "Be7"],
};

export const NIMZO_INDIAN_RUBINSTEIN: CuratedPath = {
  id: "nimzo-indian-rubinstein",
  name: "Nimzo-Indian — Rubinstein",
  eco: "E40",
  archetype: "strategist",
  description: "Pin the knight with Bb4 and fight for control of e4 without committing pawns early.",
  moves: ["d4", "Nf6", "c4", "e6", "Nc3", "Bb4", "e3", "O-O", "Bd3", "d5"],
};

export const CATALAN_OPEN: CuratedPath = {
  id: "catalan-open",
  name: "Catalan — Mainline",
  eco: "E01",
  archetype: "strategist",
  description: "Fianchetto the king's bishop and squeeze the queenside down the long diagonal.",
  moves: ["d4", "Nf6", "c4", "e6", "g3", "d5", "Nf3", "Be7", "Bg2", "O-O"],
};

export const ENGLISH_FOUR_KNIGHTS: CuratedPath = {
  id: "english-four-knights",
  name: "English Opening — Four Knights",
  eco: "A28",
  archetype: "strategist",
  description: "A reversed Sicilian: flexible development first, then strike at the centre on your terms.",
  moves: ["c4", "e5", "Nc3", "Nf6", "Nf3", "Nc6", "g3", "d5", "cxd5", "Nxd5"],
};

export const PETROFF_CLASSICAL: CuratedPath = {
  id: "petroff-classical",
  name: "Petroff Defense — Classical",
  eco: "C42",
  archetype: "defender",
  description: "Answer the attack on e5 with a counterattack on e4 — symmetry as a shield.",
  moves: ["e4", "e5", "Nf3", "Nf6", "Nxe5", "d6", "Nf3", "Nxe4", "d4", "d5"],
};

export const STAFFORD_GAMBIT: CuratedPath = {
  id: "stafford-gambit",
  name: "Stafford Gambit — Mainline",
  eco: "C42",
  archetype: "trickster",
  description: "Sacrifice a pawn in the Petroff to lay vicious traps around the enemy king.",
  moves: ["e4", "e5", "Nf3", "Nf6", "Nxe5", "Nc6", "Nxc6", "dxc6", "d3", "Bc5"],
};

export const BLACKMAR_DIEMER_GAMBIT: CuratedPath = {
  id: "blackmar-diemer-gambit",
  name: "Blackmar-Diemer Gambit — Accepted",
  eco: "D00",
  archetype: "warrior",
  description: "Offer a pawn after 1.d4 to open the f-file and attack from the very first moves.",
  moves: ["d4", "d5", "e4", "dxe4", "Nc3", "Nf6", "f3", "exf3", "Nxf3", "g6"],
};

/* —— Second lines (variation depth): one more major theory branch per flagship
   opening. Same certification: every move legal via chess.js (line.test.ts). */

export const ITALIAN_TWO_KNIGHTS: CuratedPath = {
  id: "italian-two-knights",
  name: "Italian Game — Two Knights, Ng5",
  eco: "C58",
  archetype: "warrior",
  description: "The sharpest Italian: strike at f7 before Black finishes developing.",
  moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "Ng5", "d5", "exd5", "Na5"],
};

export const RUY_LOPEZ_EXCHANGE: CuratedPath = {
  id: "ruy-lopez-exchange",
  name: "Ruy Lopez — Exchange",
  eco: "C68",
  archetype: "strategist",
  description: "Trade on c6 and play the long game against the doubled pawns.",
  moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Bxc6", "dxc6", "O-O", "f6"],
};

export const SCOTCH_MIESES: CuratedPath = {
  id: "scotch-mieses",
  name: "Scotch Game — Mieses",
  eco: "C45",
  archetype: "warrior",
  description: "Chase the knight with e5 and unbalance the game from move six.",
  moves: ["e4", "e5", "Nf3", "Nc6", "d4", "exd4", "Nxd4", "Nf6", "Nxc6", "bxc6", "e5", "Qe7", "Qe2", "Nd5"],
};

export const SICILIAN_DRAGON_YUGOSLAV: CuratedPath = {
  id: "sicilian-dragon-yugoslav",
  name: "Sicilian Dragon — vs the Yugoslav",
  eco: "B76",
  archetype: "warrior",
  description: "Castle into the storm: the dragon bishop answers White's pawn avalanche.",
  moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "g6", "Be3", "Bg7", "f3", "O-O"],
};

export const QUEENS_GAMBIT_ACCEPTED: CuratedPath = {
  id: "queens-gambit-accepted",
  name: "Queen's Gambit — Accepted",
  eco: "D26",
  archetype: "strategist",
  description: "Let Black take c4, reclaim it with tempo, and own the centre.",
  moves: ["d4", "d5", "c4", "dxc4", "Nf3", "Nf6", "e3", "e6", "Bxc4", "c5"],
};

export const LONDON_VS_KINGS_INDIAN: CuratedPath = {
  id: "london-vs-kings-indian",
  name: "London System — vs the King's Indian setup",
  eco: "A48",
  archetype: "strategist",
  description: "The same reliable wall, tuned against the kingside fianchetto.",
  moves: ["d4", "Nf6", "Nf3", "g6", "Bf4", "Bg7", "e3", "O-O", "Be2", "d6"],
};

export const CARO_KANN_ADVANCE: CuratedPath = {
  id: "caro-kann-advance",
  name: "Caro-Kann — vs the Advance",
  eco: "B12",
  archetype: "defender",
  description: "Free the bishop before closing the chain — the Caro-Kann's whole point.",
  moves: ["e4", "c6", "d4", "d5", "e5", "Bf5", "Nf3", "e6", "Be2", "Nd7"],
};

export const FRENCH_ADVANCE: CuratedPath = {
  id: "french-advance",
  name: "French Defense — vs the Advance",
  eco: "C02",
  archetype: "defender",
  description: "Attack the chain at its base: c5 and Qb6 lean on d4 immediately.",
  moves: ["e4", "e6", "d4", "d5", "e5", "c5", "c3", "Nc6", "Nf3", "Qb6"],
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
  SCOTCH_CLASSICAL,
  SMITH_MORRA_GAMBIT,
  RUY_LOPEZ_CLOSED,
  NIMZO_INDIAN_RUBINSTEIN,
  CATALAN_OPEN,
  ENGLISH_FOUR_KNIGHTS,
  PETROFF_CLASSICAL,
  STAFFORD_GAMBIT,
  BLACKMAR_DIEMER_GAMBIT,
  ITALIAN_TWO_KNIGHTS,
  RUY_LOPEZ_EXCHANGE,
  SCOTCH_MIESES,
  SICILIAN_DRAGON_YUGOSLAV,
  QUEENS_GAMBIT_ACCEPTED,
  LONDON_VS_KINGS_INDIAN,
  CARO_KANN_ADVANCE,
  FRENCH_ADVANCE,
];
