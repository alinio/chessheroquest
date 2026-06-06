/**
 * Chess DNA Test (Module 2) — domain types. Pure, framework-free.
 * Truth model: each option carries its engine-derived centipawn loss vs the best
 * move (best = 0). Scoring reads these stored tags — deterministic, no runtime
 * engine needed (GDD §9: truth = engine + curated data, never an LLM).
 */
export type Side = "white" | "black";

export interface TestOption {
  /** Move in SAN, legal in the position's FEN. */
  san: string;
  /** Centipawn loss vs the engine best move (best move = 0). */
  centipawnLoss: number;
  isBest: boolean;
}

export interface TestPosition {
  id: string;
  /** Real, verifiable opening-phase position. */
  fen: string;
  sideToMove: Side;
  /** Human opening-family label, e.g. "Italian Game". */
  openingFamily: string;
  /** ECO code, e.g. "C50". */
  eco: string;
  /** 1–5, drives the adaptive engine. */
  difficulty: number;
  prompt: string;
  /** 2–4 candidate moves. */
  options: TestOption[];
  explanation?: string;
}

export interface Answer {
  positionId: string;
  openingFamily: string;
  difficulty: number;
  /** Index into the position's options, or null = skipped ("I'm not sure"). */
  chosen: number | null;
  centipawnLoss: number;
  isBest: boolean;
  /** Answer quality in [0,1] (0 cp loss = 1, blunder = 0). */
  quality: number;
  latencyMs?: number;
}

export interface FamilyPerformance {
  family: string;
  positions: number;
  /** Mean answer quality for this family, 0–1. */
  avgQuality: number;
}

export interface TestResult {
  answers: Answer[];
  positionsAnswered: number;
  /** Difficulty-weighted aggregate accuracy, 0–1. */
  rawAccuracy: number;
  /** Highest difficulty reached during the adaptive run. */
  difficultyReached: number;
  /** PROVISIONAL Opening IQ on the public 0–1000 scale (calibration stub). */
  openingIq: number;
  byFamily: FamilyPerformance[];
  strongestFamily: string | null;
  weakestFamily: string | null;
  /** ISO timestamp; set by the caller (kept out of pure logic for determinism). */
  completedAt?: string;
}
