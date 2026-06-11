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
  comments: [
    "Stake the centre and open lines for the bishop and queen.",
    "Black claims an equal share of the centre.",
    "Develop with tempo — already hitting e5.",
    "Defend e5 and develop a piece.",
    "The Italian bishop, aimed straight at f7 — Black's softest point.",
    "Black mirrors, eyeing f2 in return.",
    "Prepare d4 and make a luft for the bishop.",
    "Develop and put pressure on e4.",
    "The 'Pianissimo' — quietly supporting e4; a slow maneuvering battle.",
    "Black solidifies symmetrically. A rich strategic middlegame awaits.",
  ],
};

export const SCANDINAVIAN_MAINLINE: CuratedPath = {
  id: "scandinavian-mainline",
  name: "Scandinavian Defense — Mainline",
  eco: "B01",
  archetype: "trickster",
  description:
    "Strike at the center immediately, recapture with the queen, and reroute to a sturdy setup.",
  moves: ["e4", "d5", "exd5", "Qxd5", "Nc3", "Qa5", "d4", "Nf6", "Nf3", "c6"],
  comments: [
    "White stakes the centre — and offers the Scandinavian its target.",
    "Strike the centre immediately, before White builds it.",
    "Accept — declining gives Black easy equality.",
    "Recapture with the queen; she will be chased, but Black has a plan.",
    "Develop with tempo on the queen.",
    "The classical square: safe, active, with pins against c3 in the air.",
    "Claim the full centre while Black regroups.",
    "Develop and control e4.",
    "Natural development; White enjoys the space.",
    "The key move: a retreat square for the queen and a granite structure.",
  ],
};

export const CARO_KANN_CLASSICAL: CuratedPath = {
  id: "caro-kann-classical",
  name: "Caro-Kann Defense — Classical",
  eco: "B18",
  archetype: "defender",
  description:
    "A rock-solid reply to 1.e4: develop the light-squared bishop before locking the pawn chain.",
  moves: ["e4", "c6", "d4", "d5", "Nc3", "dxe4", "Nxe4", "Bf5", "Ng3", "Bg6"],
  comments: [
    "White claims the centre.",
    "Prepare ...d5 with pawn support — solidity first.",
    "Take the full centre while it is offered.",
    "The challenge arrives, fully supported.",
    "Defend e4 by developing.",
    "Trade in the centre to free Black's game.",
    "Recapture and centralize.",
    "The whole point: the light-squared bishop gets out BEFORE ...e6.",
    "Hit the bishop and reroute the knight.",
    "Keep the bishop on its best diagonal; the wall is ready.",
  ],
};

export const EVANS_GAMBIT: CuratedPath = {
  id: "evans-gambit",
  name: "Evans Gambit",
  eco: "C51",
  archetype: "warrior",
  description:
    "Sacrifice a pawn to rip open lines, seize the center, and launch a furious attack.",
  moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "b4", "Bxb4", "c3", "Ba5"],
  comments: [
    "Open lines — the gambit will need them.",
    "Black holds the centre.",
    "Develop with a threat.",
    "Defend and develop.",
    "Eye f7 — the Italian setup.",
    "Black mirrors confidently.",
    "The Evans! A pawn for time, the centre, and open lines.",
    "Accepting is critical — otherwise, why allow it?",
    "Hit the bishop and prepare d4 with tempo.",
    "Keep the pin on c3; the main battle begins.",
  ],
};

export const KINGS_GAMBIT: CuratedPath = {
  id: "kings-gambit",
  name: "King's Gambit Accepted",
  eco: "C37",
  archetype: "warrior",
  description: "Offer the f-pawn for rapid development and a roaring kingside attack.",
  moves: ["e4", "e5", "f4", "exf4", "Nf3", "g5", "Bc4", "Bg7", "d4", "d6"],
  comments: [
    "Open lines for a direct attack.",
    "Black accepts the classical battle.",
    "The King's Gambit: a pawn for the f-file and a raging initiative.",
    "Take it — the only real test of the gambit.",
    "Stop ...Qh4+ and develop.",
    "Black clings to the extra pawn — and loosens his kingside.",
    "Aim at f7 while Black grabs space.",
    "Reinforce the long diagonal and shelter the king.",
    "Build the full centre; White's lead in development grows.",
    "Black supports the g5 chain and frees the bishop.",
  ],
};

export const SICILIAN_DRAGON: CuratedPath = {
  id: "sicilian-dragon",
  name: "Sicilian Defense — Dragon",
  eco: "B70",
  archetype: "warrior",
  description: "Fianchetto the dragon bishop and storm down the long diagonal.",
  moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "g6"],
  comments: [
    "White opens the game.",
    "The Sicilian: trade a wing pawn for a central one later.",
    "Prepare d4.",
    "Restrain e5 and open the c8-bishop's path.",
    "Open the centre.",
    "The thematic trade: Black gets the half-open c-file.",
    "Centralize.",
    "Develop with pressure on e4.",
    "Defend e4.",
    "The Dragon: the bishop will breathe fire down the long diagonal.",
  ],
};

export const QUEENS_GAMBIT_DECLINED: CuratedPath = {
  id: "queens-gambit-declined",
  name: "Queen's Gambit Declined",
  eco: "D35",
  archetype: "strategist",
  description: "A classical, rock-solid centre — patient maneuvering and a small edge.",
  moves: ["d4", "d5", "c4", "e6", "Nc3", "Nf6", "Bg5", "Be7", "e3", "O-O"],
  comments: [
    "Claim the centre on the queen's wing.",
    "Meet it symmetrically.",
    "The Queen's Gambit: offer a wing pawn to deflect d5.",
    "Decline — keep the centre intact, solid as stone.",
    "Add pressure on d5.",
    "Defend d5 and develop.",
    "Pin the defender of d5.",
    "Break the pin calmly.",
    "Solidify and open the f1-bishop.",
    "King safety first; the classical battle is set.",
  ],
};

export const LONDON_SYSTEM: CuratedPath = {
  id: "london-system",
  name: "London System",
  eco: "D02",
  archetype: "strategist",
  description: "A reliable setup you can play against almost anything: Bf4, e3, c3.",
  moves: ["d4", "d5", "Nf3", "Nf6", "Bf4", "e6", "e3", "c5", "c3", "Nc6"],
  comments: [
    "The London begins: a system, not a duel of theory.",
    "Black stakes the centre.",
    "Develop flexibly.",
    "Black mirrors.",
    "The London bishop — OUT before the pawn chain closes.",
    "Open the f8-bishop; the c8-bishop waits its turn.",
    "The wall takes shape.",
    "Black hits the base at d4.",
    "Reinforce d4 — the c3-d4-e3 triangle holds everything.",
    "Pile on d4; the middlegame plans are drawn.",
  ],
};

export const SLAV_DEFENSE: CuratedPath = {
  id: "slav-defense",
  name: "Slav Defense",
  eco: "D17",
  archetype: "defender",
  description: "Support the centre with c6 and keep the light-squared bishop free.",
  moves: ["d4", "d5", "c4", "c6", "Nf3", "Nf6", "Nc3", "dxc4", "a4", "Bf5"],
  comments: [
    "White claims the centre.",
    "Symmetry.",
    "The Queen's Gambit.",
    "The Slav: support d5 WITHOUT locking in the c8-bishop.",
    "Develop toward the kingside.",
    "Defend d5 and develop.",
    "More pressure on d5.",
    "Take — and make White work to win the pawn back.",
    "Stop ...b5; the c4 pawn will come home.",
    "The point of it all: the bishop is free and active.",
  ],
};

export const FRENCH_DEFENSE: CuratedPath = {
  id: "french-defense",
  name: "French Defense — Classical",
  eco: "C11",
  archetype: "defender",
  description: "A sturdy pawn chain; counterattack the base with patience.",
  moves: ["e4", "e6", "d4", "d5", "Nc3", "Nf6", "Bg5", "Be7", "e5", "Nfd7"],
  comments: [
    "White opens.",
    "The French: prepare ...d5 behind a modest wall.",
    "Full centre.",
    "The counter-strike arrives.",
    "Defend e4.",
    "Pressure e4 again.",
    "Pin the attacker.",
    "Break the pin calmly.",
    "Gain space and evict the knight — the chain locks.",
    "Reroute; Black will strike the chain's base with ...c5.",
  ],
};

export const BUDAPEST_GAMBIT: CuratedPath = {
  id: "budapest-gambit",
  name: "Budapest Gambit",
  eco: "A52",
  archetype: "trickster",
  description: "A surprise gambit against 1.d4 — quick piece play for the pawn.",
  moves: ["d4", "Nf6", "c4", "e5", "dxe5", "Ng4", "Nf3", "Nc6", "Bf4", "Bb4"],
  comments: [
    "White opens on the queenside.",
    "Flexible development.",
    "Grab space.",
    "The Budapest! A pawn for rapid, annoying piece play.",
    "Accept the offered pawn.",
    "Chase the pawn at once.",
    "Hold e5 for the moment.",
    "More pressure on e5.",
    "Cling to the pawn.",
    "Pin, develop, and keep the initiative as rent for the pawn.",
  ],
};

export const ENGLUND_GAMBIT: CuratedPath = {
  id: "englund-gambit",
  name: "Englund Gambit",
  eco: "A40",
  archetype: "trickster",
  description: "A cheeky 1...e5 against 1.d4 — set traps and regain the pawn.",
  moves: ["d4", "e5", "dxe5", "Nc6", "Nf3", "Qe7", "Nc3", "Nxe5", "Nxe5", "Qxe5"],
  comments: [
    "White opens.",
    "The Englund: a shock pawn offer on move one.",
    "Accept — and walk the trap-laden path.",
    "Attack e5 immediately.",
    "Defend it.",
    "Add pressure — and load the famous ...Qb4+ tricks.",
    "Develop past the cheap shots.",
    "Regain the pawn.",
    "Trade pawns in the centre.",
    "Material is level — Black got an open game for free.",
  ],
};

export const SCOTCH_CLASSICAL: CuratedPath = {
  id: "scotch-classical",
  name: "Scotch Game — Classical",
  eco: "C45",
  archetype: "warrior",
  description: "Open the centre on move three and fight for the initiative with active pieces.",
  moves: ["e4", "e5", "Nf3", "Nc6", "d4", "exd4", "Nxd4", "Bc5", "Be3", "Qf6"],
  comments: [
    "Open game.",
    "The classical reply.",
    "Develop with a threat.",
    "Defend e5 with the knight.",
    "The Scotch: open the centre on move three.",
    "Practically forced.",
    "A strong centralized knight.",
    "The Classical: hit the knight and target f2.",
    "Defend the knight, contest the diagonal.",
    "Renew the pressure on d4 — this tension defines the line.",
  ],
};

export const SMITH_MORRA_GAMBIT: CuratedPath = {
  id: "smith-morra-gambit",
  name: "Smith-Morra Gambit — Accepted",
  eco: "B21",
  archetype: "warrior",
  description: "Give a pawn against the Sicilian for open lines and fast, aggressive development.",
  moves: ["e4", "c5", "d4", "cxd4", "c3", "dxc3", "Nxc3", "Nc6", "Nf3", "d6"],
  comments: [
    "Open the game with the king pawn.",
    "The Sicilian.",
    "The Morra: offer a pawn to rip open the central files.",
    "Accept the offered pawn.",
    "The point — recapture into instant development.",
    "Take again; the true test of the gambit.",
    "A development lead and the c- and d-files for the rooks.",
    "Develop and brace.",
    "Pieces out fast — every tempo IS the compensation.",
    "Black holds e5 and keeps a low profile.",
  ],
};

export const RUY_LOPEZ_CLOSED: CuratedPath = {
  id: "ruy-lopez-closed",
  name: "Ruy Lopez — Closed",
  eco: "C84",
  archetype: "strategist",
  description: "The Spanish torture: pressure the e5 pawn and outmaneuver slowly, piece by piece.",
  moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6", "O-O", "Be7"],
  comments: [
    "Open game.",
    "Classical.",
    "Threaten e5.",
    "Defend e5 with the knight.",
    "The Spanish: pressure the defender of e5.",
    "The Morphy move: put the question to the bishop.",
    "Keep the pressure's promise.",
    "Develop and hit e4.",
    "Castle — e4 is tactically immune for now.",
    "The Closed Spanish: a long, rich strategic war begins.",
  ],
};

export const NIMZO_INDIAN_RUBINSTEIN: CuratedPath = {
  id: "nimzo-indian-rubinstein",
  name: "Nimzo-Indian — Rubinstein",
  eco: "E40",
  archetype: "strategist",
  description: "Pin the knight with Bb4 and fight for control of e4 without committing pawns early.",
  moves: ["d4", "Nf6", "c4", "e6", "Nc3", "Bb4", "e3", "O-O", "Bd3", "d5"],
  comments: [
    "Queen's pawn.",
    "Control e4 before anything else.",
    "Grab space.",
    "Open the f8-bishop's path.",
    "Prepare e4.",
    "The Nimzo: pin the knight — e4 is frozen.",
    "Rubinstein's calm reply: develop, ask nothing yet.",
    "King safe.",
    "The bishop's best square: watching e4 and the kingside.",
    "Stake the centre; both sides hold their trumps.",
  ],
};

export const CATALAN_OPEN: CuratedPath = {
  id: "catalan-open",
  name: "Catalan — Mainline",
  eco: "E01",
  archetype: "strategist",
  description: "Fianchetto the king's bishop and squeeze the queenside down the long diagonal.",
  moves: ["d4", "Nf6", "c4", "e6", "g3", "d5", "Nf3", "Be7", "Bg2", "O-O"],
  comments: [
    "Queen's pawn.",
    "Flexible.",
    "Grab space on the queenside.",
    "Stay solid — open the f8-bishop.",
    "The Catalan: the g2-bishop will rule the long diagonal.",
    "Black takes the centre while it is offered.",
    "Bring another piece into the fight.",
    "Calm development.",
    "The Catalan bishop arrives — pressure to b7 and far beyond.",
    "Both plans are set: White squeezes, Black must free the c8-bishop.",
  ],
};

export const ENGLISH_FOUR_KNIGHTS: CuratedPath = {
  id: "english-four-knights",
  name: "English Opening — Four Knights",
  eco: "A28",
  archetype: "strategist",
  description: "A reversed Sicilian: flexible development first, then strike at the centre on your terms.",
  moves: ["c4", "e5", "Nc3", "Nf6", "Nf3", "Nc6", "g3", "d5", "cxd5", "Nxd5"],
  comments: [
    "The English: control d5 from the wing.",
    "A reversed Sicilian — Black borrows White's dream setup.",
    "Develop toward d5.",
    "Bring another piece into the fight.",
    "Develop and hit the e5 pawn.",
    "Defend e5 with the knight.",
    "Fianchetto — the reversed Dragon structure.",
    "Black breaks first.",
    "Trade into the structure White wants.",
    "A free, active game — but that g2 bishop will bite all night.",
  ],
};

export const PETROFF_CLASSICAL: CuratedPath = {
  id: "petroff-classical",
  name: "Petroff Defense — Classical",
  eco: "C42",
  archetype: "defender",
  description: "Answer the attack on e5 with a counterattack on e4 — symmetry as a shield.",
  moves: ["e4", "e5", "Nf3", "Nf6", "Nxe5", "d6", "Nf3", "Nxe4", "d4", "d5"],
  comments: [
    "Open the game with the king pawn.",
    "Classical.",
    "Develop with a threat against e5.",
    "The Petroff: counterattack instead of defending.",
    "Take — the main test.",
    "The key move order: kick the knight FIRST (3...Nxe4? loses a pawn).",
    "Retreat — the threat is spent.",
    "NOW take, safely.",
    "Open lines and fight for the initiative.",
    "Anchor the knight's outpost; near-symmetric and rock solid.",
  ],
};

export const STAFFORD_GAMBIT: CuratedPath = {
  id: "stafford-gambit",
  name: "Stafford Gambit — Mainline",
  eco: "C42",
  archetype: "trickster",
  description: "Sacrifice a pawn in the Petroff to lay vicious traps around the enemy king.",
  moves: ["e4", "e5", "Nf3", "Nf6", "Nxe5", "Nc6", "Nxc6", "dxc6", "d3", "Bc5"],
  comments: [
    "Open the game with the king pawn.",
    "Classical.",
    "Develop with a threat against e5.",
    "A Petroff move order...",
    "Capture — the critical test.",
    "The Stafford: offer the knight rather than recapture.",
    "Almost everyone accepts.",
    "Open the d-file and BOTH bishops — the traps are loaded.",
    "White's safest try.",
    "Eye f2; one careless White move and the tricks begin.",
  ],
};

export const BLACKMAR_DIEMER_GAMBIT: CuratedPath = {
  id: "blackmar-diemer-gambit",
  name: "Blackmar-Diemer Gambit — Accepted",
  eco: "D00",
  archetype: "warrior",
  description: "Offer a pawn after 1.d4 to open the f-file and attack from the very first moves.",
  moves: ["d4", "d5", "e4", "dxe4", "Nc3", "Nf6", "f3", "exf3", "Nxf3", "g6"],
  comments: [
    "Queen's pawn.",
    "Symmetry.",
    "The Blackmar-Diemer: a centre pawn for raw attacking chances.",
    "Accept the offered pawn.",
    "Develop toward the pawn.",
    "Hold the extra pawn on e4.",
    "The point: offer a SECOND pawn to open the f-file.",
    "Take again — the full gambit.",
    "Every White piece will now aim at the kingside.",
    "Black's sturdiest setup: blunt the storm with a fianchetto.",
  ],
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
  comments: [
    "Open the game with the king pawn.",
    "Classical.",
    "Develop with a threat against e5.",
    "Defend e5 with the knight.",
    "The Italian bishop.",
    "The Two Knights: develop and DARE White to attack f7.",
    "Take the dare — a 'duffer's move' that wins real games.",
    "Forced: block the bishop's diagonal.",
    "Take — and threaten the f7 fork.",
    "The mainline: hit the bishop instead of recapturing (5...Nxd5? walks into the storm).",
  ],
};

export const RUY_LOPEZ_EXCHANGE: CuratedPath = {
  id: "ruy-lopez-exchange",
  name: "Ruy Lopez — Exchange",
  eco: "C68",
  archetype: "strategist",
  description: "Trade on c6 and play the long game against the doubled pawns.",
  moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Bxc6", "dxc6", "O-O", "f6"],
  comments: [
    "Open the game with the king pawn.",
    "Classical.",
    "Develop with a threat against e5.",
    "Defend e5 with the knight.",
    "Spanish pressure.",
    "The question.",
    "The Exchange: trade now, and play the endgame all game long.",
    "Keep the bishop pair; accept the doubled pawns.",
    "King safe; the e5 pawn is the long-term target.",
    "Cement e5 forever; Black banks everything on the two bishops.",
  ],
};

export const SCOTCH_MIESES: CuratedPath = {
  id: "scotch-mieses",
  name: "Scotch Game — Mieses",
  eco: "C45",
  archetype: "warrior",
  description: "Chase the knight with e5 and unbalance the game from move six.",
  moves: ["e4", "e5", "Nf3", "Nc6", "d4", "exd4", "Nxd4", "Nf6", "Nxc6", "bxc6", "e5", "Qe7", "Qe2", "Nd5"],
  comments: [
    "Open the game with the king pawn.",
    "Classical.",
    "Develop with a threat against e5.",
    "Defend e5 with the knight.",
    "The Scotch.",
    "Trade pawns in the centre.",
    "Centralize.",
    "Hit e4 — the Mieses invitation.",
    "Damage the structure before worrying about e4.",
    "Recapture toward the centre.",
    "The point: chase the knight with tempo.",
    "Pin the pawn right back.",
    "Defend it; an odd-looking, deeply theoretical stand-off.",
    "The knight finds its perch — imbalance everywhere you look.",
  ],
};

export const SICILIAN_DRAGON_YUGOSLAV: CuratedPath = {
  id: "sicilian-dragon-yugoslav",
  name: "Sicilian Dragon — vs the Yugoslav",
  eco: "B76",
  archetype: "warrior",
  description: "Castle into the storm: the dragon bishop answers White's pawn avalanche.",
  moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "g6", "Be3", "Bg7", "f3", "O-O"],
  comments: [
    "Open the game with the king pawn.",
    "The Sicilian.",
    "Prepare d4.",
    "Flexible — and Dragon-ready.",
    "Open the centre.",
    "Trade for the half-open c-file.",
    "Centralize.",
    "Develop, hit e4.",
    "Defend e4.",
    "The Dragon.",
    "The Yugoslav setup begins: Be3, Qd2, long castle, pawn storm.",
    "The dragon bishop takes its diagonal.",
    "Blunt ...Ng4 and prepare g4 — the storm is coming.",
    "Castle INTO it — Black's c-file counterplay is exactly as fast.",
  ],
};

export const QUEENS_GAMBIT_ACCEPTED: CuratedPath = {
  id: "queens-gambit-accepted",
  name: "Queen's Gambit — Accepted",
  eco: "D26",
  archetype: "strategist",
  description: "Let Black take c4, reclaim it with tempo, and own the centre.",
  moves: ["d4", "d5", "c4", "dxc4", "Nf3", "Nf6", "e3", "e6", "Bxc4", "c5"],
  comments: [
    "Queen's pawn.",
    "Symmetry.",
    "The gambit.",
    "Accept — concede the centre for free development.",
    "Stop ...e5 and develop.",
    "Bring another piece into the fight.",
    "Open the path to reclaim c4.",
    "Stay solid — open the f8-bishop.",
    "The pawn comes home, with tempo.",
    "The thematic break — equalize space before White rolls forward.",
  ],
};

export const LONDON_VS_KINGS_INDIAN: CuratedPath = {
  id: "london-vs-kings-indian",
  name: "London System — vs the King's Indian setup",
  eco: "A48",
  archetype: "strategist",
  description: "The same reliable wall, tuned against the kingside fianchetto.",
  moves: ["d4", "Nf6", "Nf3", "g6", "Bf4", "Bg7", "e3", "O-O", "Be2", "d6"],
  comments: [
    "London territory.",
    "Flexible.",
    "Bring another piece into the fight.",
    "Black goes King's Indian.",
    "Same London bishop, same plan — that is the system's power.",
    "The fianchetto completes.",
    "The wall.",
    "King safe.",
    "Modest and solid; sharper tries stay in reserve.",
    "Black prepares ...e5 — the central duel of this structure.",
  ],
};

export const CARO_KANN_ADVANCE: CuratedPath = {
  id: "caro-kann-advance",
  name: "Caro-Kann — vs the Advance",
  eco: "B12",
  archetype: "defender",
  description: "Free the bishop before closing the chain — the Caro-Kann's whole point.",
  moves: ["e4", "c6", "d4", "d5", "e5", "Bf5", "Nf3", "e6", "Be2", "Nd7"],
  comments: [
    "Open the game with the king pawn.",
    "The Caro-Kann.",
    "Full centre.",
    "The challenge.",
    "The Advance: lock the chain, grab space.",
    "The point again: the bishop gets OUT before ...e6.",
    "Develop — the calm modern treatment.",
    "Now close the door — the bishop is already outside.",
    "Flexible; pawn-grabbing ideas stay in reserve.",
    "Prepare ...c5, the strike at the chain's base.",
  ],
};

export const FRENCH_ADVANCE: CuratedPath = {
  id: "french-advance",
  name: "French Defense — vs the Advance",
  eco: "C02",
  archetype: "defender",
  description: "Attack the chain at its base: c5 and Qb6 lean on d4 immediately.",
  moves: ["e4", "e6", "d4", "d5", "e5", "c5", "c3", "Nc6", "Nf3", "Qb6"],
  comments: [
    "Open the game with the king pawn.",
    "The French.",
    "Full centre.",
    "Counter-strike.",
    "The Advance: space, and a locked chain.",
    "Hit the base at d4 immediately.",
    "Reinforce the base.",
    "Pile on d4.",
    "Defend d4.",
    "The thematic square: d4 AND b2 under fire at once.",
  ],
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
