import type { TestPosition } from "./types";

/**
 * Curated bank for the Chess DNA Test.
 *
 * CHESS-TRUTH BAR (Marc audit P0#4): every established main line is CORRECT —
 * a titled player must never see a ✗ on a move they teach. Skill positions may
 * carry MULTIPLE isBest options (all cp 0); when every candidate is main-line
 * theory the position is a STYLE fork instead (no wrong answer, archetype window,
 * excluded from IQ). FENs + lineSan validated by dna-test.test.ts; per-option
 * centipawnLoss values are SEED ESTIMATES (sound ordering) pending Stockfish
 * verification. Explorer stats appear ONLY where a real Lichess snapshot was
 * curated (never invented — LAW #2).
 */
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
      { san: "Bf5", centipawnLoss: 0, isBest: false, optionNote: "4...Bf5 — the Classical: develop the light-squared bishop ACTIVELY, outside the pawn chain, before it gets buried. Principled and harmonious.", archetypeLean: "strategist", explorer: { popularityPct: 58, mastersPct: 61, eval: "=", peerResults: { whitePct: 49, drawPct: 9, blackPct: 42 }, ratingBand: "1400–1800", snapshotDate: "2026-06-07" } },
      { san: "Nd7", centipawnLoss: 0, isBest: false, optionNote: "4...Nd7 — the Karpov: flexible and patient. You prepare ...Ngf6 without committing the bishop, keeping a solid, resilient structure.", archetypeLean: "defender", explorer: { popularityPct: 28, eval: "=", ratingBand: "1400–1800", snapshotDate: "2026-06-07" } },
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
      "The Italian Game points the bishop straight at f7 — the soft spot in Black's camp before castling. Two replies are absolute main lines: develop the bishop and mirror White, or counterattack e4 with the knight. Both score full marks — only the passive and the reckless lose ground here.",
    prompt: "Best move?",
    options: [
      { san: "Bc5", centipawnLoss: 0, isBest: true, optionNote: "3...Bc5 — the Giuoco Piano: mirror White, develop with tempo, point at f2. A classical main line.", explorer: { popularityPct: 46, eval: "=", ratingBand: "1400–1800", snapshotDate: "2026-06-07" } },
      { san: "Nf6", centipawnLoss: 0, isBest: true, optionNote: "3...Nf6 — the Two Knights: every bit as strong, counterattacking e4 and inviting the sharpest lines in the Italian.", explorer: { popularityPct: 38, eval: "=", ratingBand: "1400–1800", snapshotDate: "2026-06-07" } },
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
      { san: "Na5", centipawnLoss: 0, isBest: true, optionNote: "5...Na5 — the main line: chase the c4-bishop and sidestep the f7 fork entirely.", explorer: { popularityPct: 64, eval: "=", ratingBand: "1400–1800", snapshotDate: "2026-06-07" } },
      { san: "b5", centipawnLoss: 25, isBest: false, optionNote: "5...b5 — the Ulvestad: sharp and double-edged, harassing the bishop with the b-pawn.", explorer: { popularityPct: 12, eval: "+0.4", ratingBand: "1400–1800", snapshotDate: "2026-06-07" } },
      { san: "Nxd5", centipawnLoss: 130, isBest: false, optionNote: "5...Nxd5?! — the trap: 6.Nxf7! and the Fried Liver crashes onto f7.", explorer: { popularityPct: 22, eval: "+1.3", ratingBand: "1400–1800", snapshotDate: "2026-06-07" } },
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
    contextRpg: "The Spanish bishop pins its gaze on the knight that guards e5. Black to move.",
    explanationRpg:
      "The Ruy Lopez quietly asks how Black will deal with the pressure on c6 and, through it, on e5. Two answers are world-championship main lines: put the question to the bishop at once, or develop and counterattack with the Berlin knight. Slower defenses concede space; weakening the kingside is far worse.",
    prompt: "Best move?",
    options: [
      { san: "a6", centipawnLoss: 0, isBest: true, optionNote: "3...a6 — the Morphy Defense: ask the bishop its intentions immediately. The most played move in all of chess theory." },
      { san: "Nf6", centipawnLoss: 0, isBest: true, optionNote: "3...Nf6 — the Berlin Defense: develop and hit e4 right away. A world-championship-grade main line." },
      { san: "d6", centipawnLoss: 25, isBest: false, optionNote: "3...d6 — the Steinitz: solid but cramped; Black accepts a passive game without asking White a single question." },
      { san: "f6", centipawnLoss: 120, isBest: false, optionNote: "3...f6? — weakens the king's diagonal and blocks the natural knight square. The one thing e5 did not need." },
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
    questionType: "style",
    contextRpg: "Black answers your king's pawn from the wing — the Sicilian. White to move.",
    explanationRpg:
      "Against the Sicilian, White chooses a philosophy, not just a move. Opening the centre with Nf3 and d4, restraining it with the Alapin's c3, or closing it with Nc3 — all three are fully established theory. There is no wrong answer here: your pick says how you like to fight.",
    prompt: "Your move?",
    options: [
      { san: "Nf3", centipawnLoss: 0, isBest: false, optionNote: "2.Nf3 — the Open Sicilian: prepare d4, open the centre, and head for the sharpest, most theoretical battles chess has.", archetypeLean: "warrior" },
      { san: "c3", centipawnLoss: 0, isBest: false, optionNote: "2.c3 — the Alapin: build the full centre on YOUR terms and steer the game into structures you know better than your opponent.", archetypeLean: "strategist" },
      { san: "Nc3", centipawnLoss: 0, isBest: false, optionNote: "2.Nc3 — the Closed Sicilian: keep the centre shut, develop behind it, and outplay Black slowly on the kingside.", archetypeLean: "defender" },
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
    contextRpg: "Your queen stands proud on d5 — and White's knight just developed with tempo against her. Black to move.",
    explanationRpg:
      "The whole Scandinavian rests on answering this knight well. The classical a5 square and the modern d6 square are both established main lines — the queen stays active and out of reach. Retreating home loses the tempo battle; staying central walks into more development with tempo.",
    prompt: "Best move?",
    options: [
      { san: "Qa5", centipawnLoss: 0, isBest: true, optionNote: "3...Qa5 — the classical square: active, safe, eyeing the c3-knight along the rank. The traditional main line." },
      { san: "Qd6", centipawnLoss: 0, isBest: true, optionNote: "3...Qd6 — the modern treatment (Tiviakov's weapon): flexible, central, and harder to harass than it looks." },
      { san: "Qd8", centipawnLoss: 15, isBest: false, optionNote: "3...Qd8 — playable but meek: White develops freely and Black has spent two tempi going nowhere." },
      { san: "Qe5+", centipawnLoss: 55, isBest: false, optionNote: "3...Qe5+?! — one check, then the queen becomes a target again. Tempo after tempo slips away." },
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
    contextRpg: "The centre opened on move three — White's knight now rules d4. Black to move.",
    explanationRpg:
      "In the Scotch, Black's two main lines are equals: develop the bishop with a direct hit on the d4-knight (the Classical), or develop the king's knight and pressure e4 (inviting the Mieses). Both score full marks. Slower moves hand White the big centre for free.",
    prompt: "Best move?",
    options: [
      { san: "Bc5", centipawnLoss: 0, isBest: true, optionNote: "4...Bc5 — the Classical: develop with a threat against the knight and eye f2. A full main line." },
      { san: "Nf6", centipawnLoss: 0, isBest: true, optionNote: "4...Nf6 — develop and hit e4, inviting the famous Mieses endgame battles. Equally main-line." },
      { san: "g6", centipawnLoss: 15, isBest: false, optionNote: "4...g6 — a playable sideline, but it gives White a free hand in the centre for a move." },
      { san: "a6", centipawnLoss: 30, isBest: false, optionNote: "4...a6 — too slow: the centre is already open, and this move fights for none of it." },
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
    questionType: "style",
    contextRpg: "White throws the f-pawn forward on move two — the King's Gambit. A duel is offered. Black to move.",
    explanationRpg:
      "The King's Gambit is an invitation, and theory blesses three different answers: take the pawn and hold it (the critical test), decline with rapid development, or strike back in the centre. All three are respected — what you choose says everything about your chess temperament.",
    prompt: "Your move?",
    options: [
      { san: "exf4", centipawnLoss: 0, isBest: false, optionNote: "2...exf4 — Accepted: take the pawn and make White prove the attack. The critical, principled test.", archetypeLean: "warrior" },
      { san: "Bc5", centipawnLoss: 0, isBest: false, optionNote: "2...Bc5 — the Classical Decline: ignore the bait, develop with a threat, and keep the position under control.", archetypeLean: "strategist" },
      { san: "d5", centipawnLoss: 0, isBest: false, optionNote: "2...d5 — the Falkbeer: answer a gambit with a gambit and seize the initiative yourself.", archetypeLean: "trickster" },
    ],
  },
];

/** Test length = whole bank, capped at the 20 the design targets. */
export const TEST_LENGTH = Math.min(20, DNA_TEST_BANK.length);
