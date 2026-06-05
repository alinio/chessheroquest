/**
 * DNA scoring + IQ seeding (pure). Core = difficulty-weighted accuracy → harder
 * questions count more, so the score tracks competence, not volume (LAW #1).
 * The archetype is the tribe the player solved best.
 */
import type { DnaQuestion, DnaAnswer, DnaResult } from "./types";
import type { Archetype } from "@/src/domain/repertoire/types";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import {
  calibrateCoreToIq,
  rankForIq,
  estimatePercentile,
} from "@/src/domain/iq/calibration";

const ARCHETYPES: Archetype[] = ["warrior", "strategist", "defender", "trickster"];

/** Difficulty-weighted accuracy in [0,1] over the answered questions. */
export function computeCore(
  questions: readonly DnaQuestion[],
  answers: readonly DnaAnswer[],
): number {
  const byId = new Map(questions.map((q) => [q.id, q]));
  let gained = 0;
  let possible = 0;
  for (const a of answers) {
    const q = byId.get(a.questionId);
    if (!q) continue;
    possible += q.difficulty;
    if (a.correct) gained += q.difficulty;
  }
  return possible === 0 ? 0 : gained / possible;
}

/** Difficulty-weighted accuracy per archetype (0 if none of its questions were asked). */
function archetypeScores(
  questions: readonly DnaQuestion[],
  answers: readonly DnaAnswer[],
): Record<Archetype, { ratio: number; total: number }> {
  const byId = new Map(questions.map((q) => [q.id, q]));
  const acc: Record<Archetype, { gained: number; possible: number }> = {
    warrior: { gained: 0, possible: 0 },
    strategist: { gained: 0, possible: 0 },
    defender: { gained: 0, possible: 0 },
    trickster: { gained: 0, possible: 0 },
  };
  for (const a of answers) {
    const q = byId.get(a.questionId);
    if (!q) continue;
    acc[q.archetype].possible += q.difficulty;
    if (a.correct) acc[q.archetype].gained += q.difficulty;
  }
  const out = {} as Record<Archetype, { ratio: number; total: number }>;
  for (const arch of ARCHETYPES) {
    const { gained, possible } = acc[arch];
    out[arch] = { ratio: possible === 0 ? 0 : gained / possible, total: possible };
  }
  return out;
}

export function scoreDna(
  questions: readonly DnaQuestion[],
  answers: readonly DnaAnswer[],
): DnaResult {
  const core = computeCore(questions, answers);
  const initialIq = calibrateCoreToIq(core);

  const scores = archetypeScores(questions, answers);
  // Consider only archetypes that actually appeared; deterministic tie-break by
  // ARCHETYPES order. Falls back to the first archetype if nothing was asked.
  const present = ARCHETYPES.filter((a) => scores[a].total > 0);
  const ranked = (present.length > 0 ? present : ARCHETYPES).slice();

  const strongestArchetype = ranked.reduce((best, a) =>
    scores[a].ratio > scores[best].ratio ? a : best,
  );
  const weakestArchetype = ranked.reduce((worst, a) =>
    scores[a].ratio < scores[worst].ratio ? a : worst,
  );

  const recommendedPathId =
    STARTER_PATHS.find((p) => p.archetype === strongestArchetype)?.id ??
    STARTER_PATHS[0]!.id;

  return {
    archetype: strongestArchetype,
    core,
    initialIq,
    rank: rankForIq(initialIq),
    percentile: estimatePercentile(core),
    strongestArchetype,
    weakestArchetype,
    recommendedPathId,
    answered: answers.length,
    correctCount: answers.filter((a) => a.correct).length,
  };
}
