"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlayerProfileSummary } from "@/src/domain/games/types";

type Status = "idle" | "loading" | "done" | "error";

interface GameSyncState {
  summary: PlayerProfileSummary | null;
  status: Status;
  error: string | null;
  sync: (username: string) => Promise<void>;
  disconnect: () => void;
}

/** Stored locally now; migrates to the account when M9 lands (chq-* snapshot). */
export const useGameSync = create<GameSyncState>()(
  persist(
    (set) => ({
      summary: null,
      status: "idle",
      error: null,
      async sync(username) {
        const u = username.trim();
        if (!u) return;
        set({ status: "loading", error: null });
        try {
          const r = await fetch(`/api/lichess/sync?username=${encodeURIComponent(u)}`);
          if (r.status === 429) { set({ status: "error", error: "Lichess is rate-limiting — try again in a minute." }); return; }
          if (!r.ok) { set({ status: "error", error: "Sync failed — please try again." }); return; }
          const summary = (await r.json()) as PlayerProfileSummary;
          set({ summary, status: "done", error: null });
        } catch {
          set({ status: "error", error: "Network error — please try again." });
        }
      },
      disconnect() {
        set({ summary: null, status: "idle", error: null });
      },
    }),
    { name: "chq-game-sync" },
  ),
);
