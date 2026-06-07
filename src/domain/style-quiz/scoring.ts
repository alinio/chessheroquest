/**
 * Style Quiz — archetype scoring (pure, deterministic: same answers → same DNA).
 *
 * NOTE (GDD §2.3): the full style vector should also fold in the *axes* of the
 * moves chosen in the DNA test. The M2 bank stores cp-loss truth but no style
 * axes yet, so the recommendation here is from the quiz alone.
 * TODO: blend test-move style axes once the bank carries them (GDD §11 curation).
 */
import {
  ARCHETYPES,
  type Archetype,
  type ProfileAnswers,
  type QuizAnswers,
  type QuizQuestion,
  type Recommendation,
  type QuizResult,
} from "./types";

function emptyScores(): Record<Archetype, number> {
  return { warrior: 0, strategist: 0, defender: 0, trickster: 0 };
}

export function scoreArchetypes(
  questions: readonly QuizQuestion[],
  answers: QuizAnswers,
): Record<Archetype, number> {
  const scores = emptyScores();
  for (const q of questions) {
    if (q.kind !== "archetype") continue;
    const idx = answers[q.id];
    const opt = idx != null ? q.options[idx] : undefined;
    if (!opt) continue;
    for (const a of ARCHETYPES) scores[a] += opt.weights[a] ?? 0;
  }
  return scores;
}

export function extractProfile(
  questions: readonly QuizQuestion[],
  answers: QuizAnswers,
): ProfileAnswers {
  const profile: ProfileAnswers = {};
  for (const q of questions) {
    if (q.kind !== "profile") continue;
    const idx = answers[q.id];
    const opt = idx != null ? q.options[idx] : undefined;
    if (opt) profile[q.field] = opt.value;
  }
  return profile;
}

export function recommend(
  questions: readonly QuizQuestion[],
  answers: QuizAnswers,
): Recommendation {
  const scores = scoreArchetypes(questions, answers);

  // Rank by score; stable tiebreak by canonical archetype order (deterministic).
  const ranked = [...ARCHETYPES].sort(
    (a, b) => scores[b] - scores[a] || ARCHETYPES.indexOf(a) - ARCHETYPES.indexOf(b),
  );
  const primary = ranked[0]!;
  const secondary = scores[ranked[1]!] > 0 ? ranked[1]! : null;

  const total = ARCHETYPES.reduce((s, a) => s + scores[a], 0);
  // How strongly the primary dominates the style vector (focused player → higher).
  const matchPercent = total > 0 ? Math.round((100 * scores[primary]) / total) : 25;

  const reasons: string[] = [];
  for (const q of questions) {
    if (q.kind !== "archetype") continue;
    const idx = answers[q.id];
    const opt = idx != null ? q.options[idx] : undefined;
    if (opt && (opt.weights[primary] ?? 0) > 0 && opt.reason && !reasons.includes(opt.reason)) {
      reasons.push(opt.reason);
    }
  }

  return { primary, secondary, scores, matchPercent, reasons: reasons.slice(0, 3) };
}

export function buildQuizResult(
  questions: readonly QuizQuestion[],
  answers: QuizAnswers,
): QuizResult {
  return {
    ...recommend(questions, answers),
    profile: extractProfile(questions, answers),
  };
}
