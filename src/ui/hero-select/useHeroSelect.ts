"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Archetype } from "@/src/domain/style-quiz/types";

/** Persisted hero choice (resume on refresh; account sync is M9). */
interface HeroSelectState {
  selectedHero: Archetype | null;
  selectHero: (hero: Archetype) => void;
  reset: () => void;
}

export const useHeroSelect = create<HeroSelectState>()(
  persist(
    (set) => ({
      selectedHero: null,
      selectHero: (hero) => set({ selectedHero: hero }),
      reset: () => set({ selectedHero: null }),
    }),
    { name: "chq-hero-select-v1" },
  ),
);
