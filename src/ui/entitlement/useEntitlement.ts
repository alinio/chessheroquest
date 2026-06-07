"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * THE single entitlement source read by M5 gating + M6/M7 unlocks.
 * M9b: the value is SERVER-VERIFIED — set only by `hydrate()` from
 * GET /api/account/state (which reflects the verified Paddle webhook). The
 * persisted copy is a cache for instant paint; the server overrides it on every
 * load (see AccountBoot), so editing localStorage can't grant Pro.
 */
export type Plan = "free" | "monthly" | "annual" | "lifetime";

interface EntitlementState {
  isPro: boolean;
  plan: Plan;
  hydrate: (isPro: boolean, plan: Plan) => void;
  clear: () => void;
}

export const useEntitlement = create<EntitlementState>()(
  persist(
    (set) => ({
      isPro: false,
      plan: "free",
      hydrate: (isPro, plan) => set({ isPro, plan }),
      clear: () => set({ isPro: false, plan: "free" }),
    }),
    { name: "chq-entitlement-v1" },
  ),
);
