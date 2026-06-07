/**
 * World / opening loop (Module 6) — domain types. Pure.
 * Chess truth (lines, FENs) is curated ECO data, never an LLM; explanations are
 * authored. The full line tree + SRS scheduling are filled in 6b/6c.
 */
export type Side = "white" | "black";
export type MasteryTier = "none" | "bronze" | "silver" | "gold";

export interface LineNode {
  /** Move in SAN, legal in the parent position. */
  san: string;
  /** Position AFTER the move (verifiable FEN). */
  fen: string;
  /** Authored idea/explanation (curation, not runtime-generated). */
  comment?: string;
  isCritical?: boolean;
  /** Continuations; main line = children[0], branches = variations/traps. */
  children?: LineNode[];
}

export interface OpeningLineTree {
  openingId: string;
  eco: string;
  name: string;
  side: Side;
  /** Ply-1 options (main line first). */
  root: LineNode[];
}

/** SM-2 spaced-repetition card (scheduler implemented in 6c). */
export interface SrsCard {
  id: string;
  openingId: string;
  /** Line/position key this card drills. */
  ref: string;
  due: number; // epoch ms
  interval: number; // days
  ease: number; // SM-2 ease factor
  reps: number;
  lapses: number;
}

export interface OpeningProgress {
  linesLearned: number;
  drillAccuracy: number; // 0..1
  srsDueCount: number;
  masteryTier: MasteryTier;
  conquered: boolean;
}

export const EMPTY_PROGRESS: OpeningProgress = {
  linesLearned: 0,
  drillAccuracy: 0,
  srsDueCount: 0,
  masteryTier: "none",
  conquered: false,
};
