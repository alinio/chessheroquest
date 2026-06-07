import type { TestPosition } from "./types";

/**
 * SEED bank for the Chess DNA Test.
 *
 * TODO: full 20-position curated bank pending (GDD §11). FENs + lineSan + the best
 * move per position are established theory; per-option `centipawnLoss` values are
 * SEED ESTIMATES (sound ordering) flagged for Stockfish verification. RPG copy is
 * AUTHORED per position (never LLM); uncurated positions carry `// TODO` copy
 * rather than invented chess content. dna-test.test.ts validates every FEN/SAN.
 */
const TODO_NOTE = "// TODO: curated optionNote (GDD §11)";
const TODO_CTX = ""; // UI falls back to line + side when context isn't authored yet
const TODO_EXPL = "// TODO: curated explanation (GDD §11)";

export const DNA_TEST_BANK: TestPosition[] = [
  {
    id: "caro-kann-b15",
    fen: "rnbqkbnr/pp2pppp/2p5/8/3PN3/8/PPP2PPP/R1BQKBNR b KQkq - 0 4",
    sideToMove: "black",
    openingName: "Caro-Kann Defense",
    openingFamily: "Caro-Kann Defense",
    eco: "B15",
    lineSan: ["e4", "c6", "d4", "d5", "Nc3", "dxe4", "Nxe4"],
    difficulty: 3,
    questionType: "style",
    contextRpg: "A classical, well-trodden crossroads — the knight sits proud on e4. Black to move.",
    explanationRpg:
      "This is the Caro-Kann Defense, Classical main line. After 4.Nxe4 Black has two fully respected ways to meet the knight — both are main-line theory, so there is no wrong answer here. Your pick is a window into how you like to play.",
    prompt: "Your move?",
    options: [
      { san: "Bf5", centipawnLoss: 0, isBest: false, optionNote: "4...Bf5 — the Classical: develop the light-squared bishop ACTIVELY, outside the pawn chain, before it gets buried. Principled and harmonious.", archetypeLean: "strategist" },
      { san: "Nd7", centipawnLoss: 0, isBest: false, optionNote: "4...Nd7 — the Karpov: flexible and patient. You prepare ...Ngf6 without committing the bishop, keeping a solid, resilient structure.", archetypeLean: "defender" },
    ],
  },
  {
    id: "italian-c50",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    sideToMove: "black",
    openingName: "Italian Game",
    openingFamily: "Italian Game",
    eco: "C50",
    lineSan: ["e4", "e5", "Nf3", "Nc6", "Bc4"],
    difficulty: 2,
    questionType: "skill",
    contextRpg: "The bishop swings to c4, aimed across the board. Black to move.",
    explanationRpg:
      "The Italian Game points the bishop straight at f7 — the soft spot in Black's camp before castling. The classical reply develops a piece, contests the centre, and aims at f2 in return.",
    prompt: "Best move?",
    options: [
      { san: "Bc5", centipawnLoss: 0, isBest: true, optionNote: "3...Bc5 — the Giuoco Piano: mirror White, develop with tempo, point at f2. The classical main line." },
      { san: "Nf6", centipawnLoss: 10, isBest: false, optionNote: "3...Nf6 — the Two Knights: also excellent, counterattacking e4 and inviting sharp play." },
      { san: "Be7", centipawnLoss: 35, isBest: false, optionNote: "3...Be7 — the Hungarian: solid but passive; the bishop simply does less here." },
      { san: "f5", centipawnLoss: 140, isBest: false, optionNote: "3...f5?! — the Rousseau Gambit: it lashes out but fatally weakens the king before castling." },
    ],
  },
  {
    id: "fried-liver-c57",
    fen: "r1bqkb1r/ppp2ppp/2n2n2/3Pp1N1/2B5/8/PPPP1PPP/RNBQK2R b KQkq - 0 5",
    sideToMove: "black",
    openingName: "Two Knights Defense",
    openingFamily: "Two Knights Defense",
    eco: "C57",
    lineSan: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "Ng5", "d5", "exd5"],
    difficulty: 4,
    questionType: "skill",
    contextRpg: "White's knight has leapt to g5 and the d5-pawn just fell. The bishop and knight both glare at f7. Black to move.",
    explanationRpg:
      "The tempting recapture walks straight into the Fried Liver Attack: 5...Nxd5?! 6.Nxf7! Kxf7 7.Qf3+ and White's pieces crash through. The sound defender chases the bishop first and keeps the king safe.",
    prompt: "Best move?",
    options: [
      { san: "Na5", centipawnLoss: 0, isBest: true, optionNote: "5...Na5 — the main line: chase the c4-bishop and sidestep the f7 fork entirely." },
      { san: "b5", centipawnLoss: 25, isBest: false, optionNote: "5...b5 — the Ulvestad: sharp and double-edged, harassing the bishop with the b-pawn." },
      { san: "Nxd5", centipawnLoss: 130, isBest: false, optionNote: "5...Nxd5?! — the trap: 6.Nxf7! and the Fried Liver crashes onto f7." },
    ],
  },
  {
    id: "ruy-lopez-c60",
    fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    sideToMove: "black",
    openingName: "Ruy Lopez",
    openingFamily: "Ruy Lopez",
    eco: "C60",
    lineSan: ["e4", "e5", "Nf3", "Nc6", "Bb5"],
    difficulty: 2,
    questionType: "skill",
    contextRpg: TODO_CTX,
    explanationRpg: TODO_EXPL,
    prompt: "Best move?",
    options: [
      { san: "a6", centipawnLoss: 0, isBest: true, optionNote: TODO_NOTE },
      { san: "Nf6", centipawnLoss: 8, isBest: false, optionNote: TODO_NOTE },
      { san: "d6", centipawnLoss: 25, isBest: false, optionNote: TODO_NOTE },
      { san: "f6", centipawnLoss: 120, isBest: false, optionNote: TODO_NOTE },
    ],
  },
  {
    id: "sicilian-b20",
    fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    sideToMove: "white",
    openingName: "Sicilian Defense",
    openingFamily: "Sicilian Defense",
    eco: "B20",
    lineSan: ["e4", "c5"],
    difficulty: 1,
    questionType: "skill",
    contextRpg: TODO_CTX,
    explanationRpg: TODO_EXPL,
    prompt: "Best move?",
    options: [
      { san: "Nf3", centipawnLoss: 0, isBest: true, optionNote: TODO_NOTE },
      { san: "c3", centipawnLoss: 10, isBest: false, optionNote: TODO_NOTE },
      { san: "Nc3", centipawnLoss: 12, isBest: false, optionNote: TODO_NOTE },
      { san: "d4", centipawnLoss: 30, isBest: false, optionNote: TODO_NOTE },
    ],
  },
  {
    id: "scandinavian-b01",
    fen: "rnb1kbnr/ppp1pppp/8/3q4/8/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 3",
    sideToMove: "black",
    openingName: "Scandinavian Defense",
    openingFamily: "Scandinavian Defense",
    eco: "B01",
    lineSan: ["e4", "d5", "exd5", "Qxd5", "Nc3"],
    difficulty: 2,
    questionType: "skill",
    contextRpg: TODO_CTX,
    explanationRpg: TODO_EXPL,
    prompt: "Best move?",
    options: [
      { san: "Qa5", centipawnLoss: 0, isBest: true, optionNote: TODO_NOTE },
      { san: "Qd6", centipawnLoss: 8, isBest: false, optionNote: TODO_NOTE },
      { san: "Qd8", centipawnLoss: 15, isBest: false, optionNote: TODO_NOTE },
      { san: "Qe5", centipawnLoss: 55, isBest: false, optionNote: TODO_NOTE },
    ],
  },
  {
    id: "scotch-c45",
    fen: "r1bqkbnr/pppp1ppp/2n5/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4",
    sideToMove: "black",
    openingName: "Scotch Game",
    openingFamily: "Scotch Game",
    eco: "C45",
    lineSan: ["e4", "e5", "Nf3", "Nc6", "d4", "exd4", "Nxd4"],
    difficulty: 3,
    questionType: "skill",
    contextRpg: TODO_CTX,
    explanationRpg: TODO_EXPL,
    prompt: "Best move?",
    options: [
      { san: "Nf6", centipawnLoss: 0, isBest: true, optionNote: TODO_NOTE },
      { san: "Bc5", centipawnLoss: 10, isBest: false, optionNote: TODO_NOTE },
      { san: "g6", centipawnLoss: 15, isBest: false, optionNote: TODO_NOTE },
      { san: "a6", centipawnLoss: 30, isBest: false, optionNote: TODO_NOTE },
    ],
  },
  {
    id: "kings-gambit-c30",
    fen: "rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq - 0 2",
    sideToMove: "black",
    openingName: "King's Gambit",
    openingFamily: "King's Gambit",
    eco: "C30",
    lineSan: ["e4", "e5", "f4"],
    difficulty: 3,
    questionType: "skill",
    contextRpg: TODO_CTX,
    explanationRpg: TODO_EXPL,
    prompt: "Best move?",
    options: [
      { san: "exf4", centipawnLoss: 0, isBest: true, optionNote: TODO_NOTE },
      { san: "d5", centipawnLoss: 12, isBest: false, optionNote: TODO_NOTE },
      { san: "Bc5", centipawnLoss: 18, isBest: false, optionNote: TODO_NOTE },
      { san: "Nf6", centipawnLoss: 35, isBest: false, optionNote: TODO_NOTE },
    ],
  },
];

/** Test length = whole bank, capped at the 20 the design targets. */
export const TEST_LENGTH = Math.min(20, DNA_TEST_BANK.length);
