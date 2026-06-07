import { describe, it, expect } from "vitest";
import { QUIZ_QUESTIONS } from "./questions";
import { scoreArchetypes, recommend, extractProfile, buildQuizResult } from "./scoring";
import type { QuizAnswers } from "./types";

describe("style quiz questions (GDD §2.2)", () => {
  it("has 16 questions: 8 archetype + 8 profile", () => {
    expect(QUIZ_QUESTIONS).toHaveLength(16);
    expect(QUIZ_QUESTIONS.filter((q) => q.kind === "archetype")).toHaveLength(8);
    expect(QUIZ_QUESTIONS.filter((q) => q.kind === "profile")).toHaveLength(8);
  });

  it("every archetype option carries at least one archetype weight; profile options carry a value", () => {
    for (const q of QUIZ_QUESTIONS) {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      if (q.kind === "archetype") {
        for (const o of q.options) {
          expect(Object.keys(o.weights).length).toBeGreaterThanOrEqual(1);
        }
      } else {
        for (const o of q.options) expect(o.value).toBeTruthy();
      }
    }
  });
});

/** Pick, for each archetype question, the option giving the most to `archetype`. */
function leanInto(archetype: "warrior" | "strategist" | "defender" | "trickster"): QuizAnswers {
  const answers: QuizAnswers = {};
  for (const q of QUIZ_QUESTIONS) {
    if (q.kind !== "archetype") continue;
    let best = 0;
    let bestVal = -1;
    q.options.forEach((o, i) => {
      const w = o.weights[archetype] ?? 0;
      if (w > bestVal) {
        bestVal = w;
        best = i;
      }
    });
    answers[q.id] = best;
  }
  return answers;
}

describe("archetype scoring", () => {
  it("leaning into an archetype makes it the recommendation", () => {
    for (const a of ["warrior", "strategist", "defender", "trickster"] as const) {
      const rec = recommend(QUIZ_QUESTIONS, leanInto(a));
      expect(rec.primary).toBe(a);
      expect(rec.matchPercent).toBeGreaterThan(25);
      expect(rec.matchPercent).toBeLessThanOrEqual(100);
      expect(rec.reasons.length).toBeGreaterThan(0);
      expect(rec.reasons.length).toBeLessThanOrEqual(3);
    }
  });

  it("scoreArchetypes ignores profile questions", () => {
    const answers: QuizAnswers = { q9: 4, q14: 0 }; // profile only
    const scores = scoreArchetypes(QUIZ_QUESTIONS, answers);
    expect(scores.warrior + scores.strategist + scores.defender + scores.trickster).toBe(0);
  });

  it("is deterministic", () => {
    const a = leanInto("strategist");
    expect(recommend(QUIZ_QUESTIONS, a)).toEqual(recommend(QUIZ_QUESTIONS, a));
  });

  it("extractProfile maps profile fields to chosen values", () => {
    const answers: QuizAnswers = { q9: 2, q13: 1, q16: 0 };
    const profile = extractProfile(QUIZ_QUESTIONS, answers);
    expect(profile.currentRating).toBe("1200-1600");
    expect(profile.colorPreference).toBe("black");
    expect(profile.connectAccount).toBe("lichess");
  });

  it("buildQuizResult combines recommendation + profile", () => {
    const answers = { ...leanInto("warrior"), q9: 1, q14: 0 };
    const result = buildQuizResult(QUIZ_QUESTIONS, answers);
    expect(result.primary).toBe("warrior");
    expect(result.profile.currentRating).toBe("800-1200");
    expect(result.scores.warrior).toBeGreaterThan(0);
  });
});
