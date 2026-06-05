/**
 * Chess DNA Test model (domain — pure, framework-free).
 * The test seeds the initial Opening IQ + archetype (master-vision §4.6, §6).
 */
import type { Archetype } from "@/src/domain/repertoire/types";

export interface DnaQuestion {
  id: string;
  /** Position to solve (FEN). Derived from a legality-certified curated line. */
  fen: string;
  /** The intended best move in SAN (the curated mainline continuation). */
  expectedMove: string;
  /** Which DNA tribe this position belongs to. */
  archetype: Archetype;
  /** 1 (easy) … 5 (hard). */
  difficulty: number;
  pathId: string;
  /** Half-move index within the source path. */
  ply: number;
}

export interface DnaAnswer {
  questionId: string;
  /** SAN actually played (empty string if skipped/timed out). */
  chosenMove: string;
  correct: boolean;
  latencyMs: number;
}

export interface DnaResult {
  /** The user's DNA archetype (strongest-performing tribe). */
  archetype: Archetype;
  /** Difficulty-weighted accuracy in [0,1] — the Core proxy (LAW #1). */
  core: number;
  /** Seeded Opening IQ = calibrate(Core). Communicated as an estimate (§4.6). */
  initialIq: number;
  rank: string;
  /** Estimated global percentile (launch default — refined on data, §4.4). */
  percentile: number;
  strongestArchetype: Archetype;
  weakestArchetype: Archetype;
  recommendedPathId: string;
  answered: number;
  correctCount: number;
}
