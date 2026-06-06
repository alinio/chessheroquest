import type { TestPosition } from "./types";

/**
 * SEED bank for the Chess DNA Test.
 *
 * TODO: full 20-position curated bank pending (GDD §11). This is a small SEED of
 * real, verifiable opening positions. The FENs and the best move per position are
 * established theory; the per-option `centipawnLoss` values are SEED ESTIMATES
 * (ordering is sound) flagged for replacement by Stockfish verification during
 * curation — src/data/stockfish.ts is the engine wired for exactly that.
 *
 * Never invent FENs/evals: the dna-test.test.ts suite loads every position into
 * chess.js and asserts the FEN is valid, side-to-move matches, and every option
 * is a legal move — so a bad transcription fails the build.
 */
export const DNA_TEST_BANK: TestPosition[] = [
  {
    id: "italian-c50",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    sideToMove: "black",
    openingFamily: "Italian Game",
    eco: "C50",
    difficulty: 2,
    prompt: "Best move?",
    options: [
      { san: "Bc5", centipawnLoss: 0, isBest: true },
      { san: "Nf6", centipawnLoss: 10, isBest: false },
      { san: "Be7", centipawnLoss: 35, isBest: false },
      { san: "f5", centipawnLoss: 140, isBest: false },
    ],
    explanation: "3...Bc5 (Giuoco Piano) develops with tempo and eyes f2; ...f5 lashes out and just weakens the king.",
  },
  {
    id: "ruy-lopez-c60",
    fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    sideToMove: "black",
    openingFamily: "Ruy Lopez",
    eco: "C60",
    difficulty: 2,
    prompt: "Best move?",
    options: [
      { san: "a6", centipawnLoss: 0, isBest: true },
      { san: "Nf6", centipawnLoss: 8, isBest: false },
      { san: "d6", centipawnLoss: 25, isBest: false },
      { san: "f6", centipawnLoss: 120, isBest: false },
    ],
    explanation: "3...a6 (Morphy Defense) questions the bishop immediately; 3...Nf6 (Berlin) is also fully sound.",
  },
  {
    id: "sicilian-b20",
    fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    sideToMove: "white",
    openingFamily: "Sicilian Defense",
    eco: "B20",
    difficulty: 1,
    prompt: "Best move?",
    options: [
      { san: "Nf3", centipawnLoss: 0, isBest: true },
      { san: "c3", centipawnLoss: 10, isBest: false },
      { san: "Nc3", centipawnLoss: 12, isBest: false },
      { san: "d4", centipawnLoss: 30, isBest: false },
    ],
    explanation: "2.Nf3 is the flexible Open Sicilian move order; 2.d4 immediately just gives back the centre after ...cxd4.",
  },
  {
    id: "scandinavian-b01",
    fen: "rnb1kbnr/ppp1pppp/8/3q4/8/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 3",
    sideToMove: "black",
    openingFamily: "Scandinavian Defense",
    eco: "B01",
    difficulty: 2,
    prompt: "Best move?",
    options: [
      { san: "Qa5", centipawnLoss: 0, isBest: true },
      { san: "Qd6", centipawnLoss: 8, isBest: false },
      { san: "Qd8", centipawnLoss: 15, isBest: false },
      { san: "Qe5", centipawnLoss: 55, isBest: false },
    ],
    explanation: "3...Qa5 keeps the queen active and safe; 3...Qe5 lands in the centre but invites tempo-gaining attacks.",
  },
  {
    id: "caro-kann-b15",
    fen: "rnbqkbnr/pp2pppp/2p5/8/3PN3/8/PPP2PPP/R1BQKBNR b KQkq - 0 4",
    sideToMove: "black",
    openingFamily: "Caro-Kann Defense",
    eco: "B15",
    difficulty: 3,
    prompt: "Best move?",
    options: [
      { san: "Bf5", centipawnLoss: 0, isBest: true },
      { san: "Nd7", centipawnLoss: 8, isBest: false },
      { san: "Nf6", centipawnLoss: 25, isBest: false },
    ],
    explanation: "4...Bf5 (Classical) develops the problem bishop outside the pawn chain; 4...Nf6 allows 5.Nxf6+ wrecking the structure.",
  },
  {
    id: "scotch-c45",
    fen: "r1bqkbnr/pppp1ppp/2n5/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4",
    sideToMove: "black",
    openingFamily: "Scotch Game",
    eco: "C45",
    difficulty: 3,
    prompt: "Best move?",
    options: [
      { san: "Nf6", centipawnLoss: 0, isBest: true },
      { san: "Bc5", centipawnLoss: 10, isBest: false },
      { san: "g6", centipawnLoss: 15, isBest: false },
      { san: "a6", centipawnLoss: 30, isBest: false },
    ],
    explanation: "4...Nf6 hits e4 and is the main equalizer; 4...Bc5 is the other principled try.",
  },
  {
    id: "kings-gambit-c30",
    fen: "rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq f3 0 2",
    sideToMove: "black",
    openingFamily: "King's Gambit",
    eco: "C30",
    difficulty: 3,
    prompt: "Best move?",
    options: [
      { san: "exf4", centipawnLoss: 0, isBest: true },
      { san: "d5", centipawnLoss: 12, isBest: false },
      { san: "Bc5", centipawnLoss: 18, isBest: false },
      { san: "Nf6", centipawnLoss: 35, isBest: false },
    ],
    explanation: "2...exf4 accepts the gambit and is the critical test; 2...d5 (Falkbeer) is the principled counter-gambit.",
  },
  {
    id: "fried-liver-c57",
    fen: "r1bqkb1r/ppp2ppp/2n2n2/3Pp1N1/2B5/8/PPPP1PPP/RNBQK2R b KQkq - 0 5",
    sideToMove: "black",
    openingFamily: "Two Knights Defense",
    eco: "C57",
    difficulty: 4,
    prompt: "Best move?",
    options: [
      { san: "Na5", centipawnLoss: 0, isBest: true },
      { san: "b5", centipawnLoss: 25, isBest: false },
      { san: "Nxd5", centipawnLoss: 130, isBest: false },
    ],
    explanation: "5...Na5 hits the bishop and is the sound main line; 5...Nxd5?! walks into 6.Nxf7! — the Fried Liver Attack.",
  },
];

/** Test length = whole bank, capped at the 20 the design targets. */
export const TEST_LENGTH = Math.min(20, DNA_TEST_BANK.length);
