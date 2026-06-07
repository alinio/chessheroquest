"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { QUIZ_QUESTIONS } from "@/src/domain/style-quiz/questions";
import { buildQuizResult } from "@/src/domain/style-quiz/scoring";
import type { QuizAnswers, QuizResult } from "@/src/domain/style-quiz/types";

/**
 * Client state for the Style Quiz, persisted to localStorage (resume on refresh).
 * Pure archetype logic lives in the domain — this only sequences the questions.
 */
interface StyleQuizState {
  index: number;
  answers: QuizAnswers;
  finished: boolean;
  result: QuizResult | null;
  select: (optionIndex: number) => void;
  back: () => void;
  reset: () => void;
}

export const useStyleQuiz = create<StyleQuizState>()(
  persist(
    (set, get) => ({
      index: 0,
      answers: {},
      finished: false,
      result: null,

      select: (optionIndex) => {
        const { index, answers } = get();
        const q = QUIZ_QUESTIONS[index];
        if (!q) return;
        const nextAnswers = { ...answers, [q.id]: optionIndex };
        if (index + 1 >= QUIZ_QUESTIONS.length) {
          set({
            answers: nextAnswers,
            finished: true,
            result: { ...buildQuizResult(QUIZ_QUESTIONS, nextAnswers), completedAt: new Date().toISOString() },
          });
        } else {
          set({ answers: nextAnswers, index: index + 1 });
        }
      },

      back: () => {
        const { index } = get();
        if (index > 0) set({ index: index - 1, finished: false });
      },

      reset: () => set({ index: 0, answers: {}, finished: false, result: null }),
    }),
    { name: "chq-style-quiz-v1" },
  ),
);
