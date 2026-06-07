/**
 * Chess DNA Test (Module 2) — domain types. Pure, framework-free.
 * Truth model: each option carries its engine-derived centipawn loss vs the best
 * move (best = 0). Scoring reads these stored tags — deterministic, no runtime
 * engine, no LLM (GDD §9). Curated context/explanation prose is AUTHORED per
 * position (never generated at runtime).
 */
import type { Archetype } from "@/src/domain/style-quiz/types";
import type { ExplorerStats } from "@/src/domain/world/explorer";

export type Side = "white" | "black";

/**
 * skill = one best move; scores toward Opening IQ.
 * style = multiple theory-approved moves; NO right/wrong, MUST NOT affect IQ.
 */
export type QuestionType = "skill" | "style";

export interface TestOption {
  /** Move in SAN, legal in the position's FEN. */
  san: string;
  /** Centipawn loss vs the engine best move (best = 0). Meaningful for skill only. */
  centipawnLoss: number;
  isBest: boolean;
  /** Authored note revealed after answering (the teaching moment). */
  optionNote: string;
  /** For style forks: which playstyle this choice leans toward (secondary signal). */
  archetypeLean?: Archetype;
  /** §5b explorer snapshot — REVEALED POST-ANSWER ONLY (never before; would coach + inflate IQ). */
  explorer?: ExplorerStats;
}

export interface TestPosition {
  id: string;
  /** Real, verifiable opening-phase position. */
  fen: string;
  sideToMove: Side;
  /** Opening name, e.g. "Caro-Kann Defense" (the scoring family key too). */
  openingName: string;
  /** Back-compat alias used by per-family scoring. */
  openingFamily: string;
  /** ECO code/family, e.g. "B19". */
  eco: string;
  /** Real SAN moves that reach this position (rendered as pre-answer context). */
  lineSan: string[];
  /** 1–5, drives the adaptive engine (skill positions only). */
  difficulty: number;
  questionType: QuestionType;
  /** SHORT pre-answer orientation copy — NO hint toward the answer. */
  contextRpg: string;
  /** RICH post-answer teaching copy. */
  explanationRpg: string;
  /** Prompt label override; defaults by questionType. */
  prompt: string;
  /** 2–4 candidate moves. */
  options: TestOption[];
}

export interface Answer {
  positionId: string;
  openingFamily: string;
  difficulty: number;
  questionType: QuestionType;
  /** Index into the position's options, or null = skipped ("I'm not sure"). */
  chosen: number | null;
  centipawnLoss: number;
  isBest: boolean;
  /** Answer quality in [0,1] (skill only; style answers are not scored). */
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
  /** Difficulty-weighted aggregate accuracy over SKILL answers, 0–1. */
  rawAccuracy: number;
  /** Highest skill difficulty reached during the adaptive run. */
  difficultyReached: number;
  /** PROVISIONAL Opening IQ on the public 0–1000 scale (calibration stub). */
  openingIq: number;
  byFamily: FamilyPerformance[];
  strongestFamily: string | null;
  weakestFamily: string | null;
  completedAt?: string;
}
