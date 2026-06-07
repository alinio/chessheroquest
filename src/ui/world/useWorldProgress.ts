"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EMPTY_PROGRESS, type OpeningProgress } from "@/src/domain/world/types";

/** Per-opening progress, persisted (account sync is M9). */
interface WorldProgressState {
  progress: Record<string, OpeningProgress>;
  update: (openingId: string, patch: Partial<OpeningProgress>) => void;
  reset: () => void;
}

export const useWorldProgress = create<WorldProgressState>()(
  persist(
    (set) => ({
      progress: {},
      update: (openingId, patch) =>
        set((s) => ({
          progress: { ...s.progress, [openingId]: { ...(s.progress[openingId] ?? EMPTY_PROGRESS), ...patch } },
        })),
      reset: () => set({ progress: {} }),
    }),
    { name: "chq-world-progress-v1" },
  ),
);

export const progressFor = (progress: Record<string, OpeningProgress>, id: string): OpeningProgress =>
  progress[id] ?? EMPTY_PROGRESS;
