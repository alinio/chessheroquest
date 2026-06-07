"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SrsCard } from "@/src/domain/world/types";

/**
 * SRS card store, persisted (account sync = M9). 6b seeds the initial cards on
 * Learn completion; 6c implements the SM-2 review scheduler over them.
 */
interface SrsState {
  cards: Record<string, SrsCard[]>; // openingId → cards
  seedOpening: (openingId: string, refs: string[]) => void;
  setCards: (openingId: string, cards: SrsCard[]) => void;
  reset: () => void;
}

export const useSrs = create<SrsState>()(
  persist(
    (set) => ({
      cards: {},
      seedOpening: (openingId, refs) =>
        set((s) => {
          const existing = s.cards[openingId] ?? [];
          const have = new Set(existing.map((c) => c.ref));
          const now = Date.now();
          const added: SrsCard[] = refs
            .filter((r) => !have.has(r))
            .map((ref) => ({ id: `${openingId}:${ref}`, openingId, ref, due: now, interval: 0, ease: 2.5, reps: 0, lapses: 0 }));
          if (added.length === 0) return {};
          return { cards: { ...s.cards, [openingId]: [...existing, ...added] } };
        }),
      setCards: (openingId, cards) => set((s) => ({ cards: { ...s.cards, [openingId]: cards } })),
      reset: () => set({ cards: {} }),
    }),
    { name: "chq-srs-v1" },
  ),
);

export const dueCount = (cards: SrsCard[] | undefined, now: number): number =>
  (cards ?? []).filter((c) => c.due <= now).length;
