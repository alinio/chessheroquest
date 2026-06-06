"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DNA_TEST_BANK, TEST_LENGTH } from "@/src/domain/dna-test/bank";
import {
  START_DIFFICULTY,
  nextTargetDifficulty,
  makeAnswer,
  selectNextPosition,
} from "@/src/domain/dna-test/adaptive";
import { buildResult } from "@/src/domain/dna-test/scoring";
import type { Answer, TestResult } from "@/src/domain/dna-test/types";

/**
 * Client state for the DNA test run, persisted to localStorage (resume on
 * refresh, per ARCHITECTURE: Zustand for light UI state; account/save is M9).
 * All chess logic lives in the pure domain — this store only sequences it.
 */
interface DnaTestState {
  started: boolean;
  finished: boolean;
  currentId: string | null;
  target: number;
  answers: Answer[];
  result: TestResult | null;
  start: () => void;
  answer: (chosen: number | null, latencyMs?: number) => void;
  reset: () => void;
}

function familyCounts(answers: readonly Answer[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const a of answers) counts[a.openingFamily] = (counts[a.openingFamily] ?? 0) + 1;
  return counts;
}

export const useDnaTest = create<DnaTestState>()(
  persist(
    (set, get) => ({
      started: false,
      finished: false,
      currentId: null,
      target: START_DIFFICULTY,
      answers: [],
      result: null,

      start: () => {
        const first = selectNextPosition(DNA_TEST_BANK, new Set(), START_DIFFICULTY, {});
        set({
          started: true,
          finished: false,
          answers: [],
          result: null,
          target: START_DIFFICULTY,
          currentId: first?.id ?? null,
        });
      },

      answer: (chosen, latencyMs) => {
        const { currentId, answers, target } = get();
        const pos = DNA_TEST_BANK.find((p) => p.id === currentId);
        if (!pos) return;

        const nextAnswers = [...answers, makeAnswer(pos, chosen, latencyMs)];
        const last = nextAnswers[nextAnswers.length - 1]!;
        const nextTarget = nextTargetDifficulty(target, last.quality);

        const finish = () => {
          set({
            answers: nextAnswers,
            finished: true,
            currentId: null,
            target: nextTarget,
            result: { ...buildResult(nextAnswers), completedAt: new Date().toISOString() },
          });
        };

        if (nextAnswers.length >= TEST_LENGTH) return finish();
        const used = new Set(nextAnswers.map((a) => a.positionId));
        const next = selectNextPosition(DNA_TEST_BANK, used, nextTarget, familyCounts(nextAnswers));
        if (!next) return finish();
        set({ answers: nextAnswers, currentId: next.id, target: nextTarget });
      },

      reset: () =>
        set({ started: false, finished: false, currentId: null, target: START_DIFFICULTY, answers: [], result: null }),
    }),
    { name: "chq-dna-test-v1" },
  ),
);
