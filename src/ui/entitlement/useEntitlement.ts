"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * THE single entitlement source of truth (read by M5 gating, M6/M7 unlocks).
 * Phase-0: set client-side from the Paddle success callback (M8).
 * TODO: server-side entitlement verification + Paddle webhook (M9) — this client
 * value is NOT secure yet; M9b makes the server the source of truth.
 */
export type Plan = "free" | "monthly" | "annual" | "lifetime";

interface EntitlementState {
  isPro: boolean;
  plan: Plan;
  setPro: (plan: Plan) => void;
  clear: () => void;
}

export const useEntitlement = create<EntitlementState>()(
  persist(
    (set) => ({
      isPro: false,
      plan: "free",
      setPro: (plan) => set({ isPro: plan !== "free", plan }),
      clear: () => set({ isPro: false, plan: "free" }),
    }),
    { name: "chq-entitlement-v1" },
  ),
);
