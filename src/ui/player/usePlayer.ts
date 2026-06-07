"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Minimal player profile — XP for now (streak/level + account sync land in M9). */
interface PlayerState {
  xp: number;
  addXp: (n: number) => void;
  reset: () => void;
}

export const usePlayer = create<PlayerState>()(
  persist(
    (set) => ({
      xp: 0,
      addXp: (n) => set((s) => ({ xp: s.xp + n })),
      reset: () => set({ xp: 0 }),
    }),
    { name: "chq-player-v1" },
  ),
);
