"use client";

import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import type { Plan } from "@/src/ui/entitlement/useEntitlement";

/**
 * Paddle Billing (Paddle.js overlay checkout). Client token + price IDs come from
 * ENV ONLY (never hardcoded). On checkout.completed the caller flips the
 * entitlement.
 *
 * TODO: use a SANDBOX token + sandbox price IDs in dev — the env currently holds
 * production values (set NEXT_PUBLIC_PADDLE_ENV=sandbox + sandbox IDs for review).
 * TODO: server-side entitlement verification + Paddle webhook (M9b) — success here
 * is client-trust only.
 */
export type ProPlan = Exclude<Plan, "free">;

export const PRICE_IDS: Record<ProPlan, string | undefined> = {
  monthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY,
  annual: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_ANNUAL,
  lifetime: process.env.NEXT_PUBLIC_PADDLE_PRICE_LIFETIME,
};

export function paddleConfigured(plan: ProPlan): boolean {
  return Boolean(process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN && PRICE_IDS[plan]);
}

let paddlePromise: Promise<Paddle | undefined> | null = null;
let onComplete: () => void = () => {};

function ensurePaddle(): Promise<Paddle | undefined> {
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  if (!token) return Promise.resolve(undefined);
  if (!paddlePromise) {
    const environment = (process.env.NEXT_PUBLIC_PADDLE_ENV as "sandbox" | "production") ?? "sandbox";
    paddlePromise = initializePaddle({
      token,
      environment,
      eventCallback: (e) => {
        if (e?.name === "checkout.completed") onComplete();
      },
    });
  }
  return paddlePromise;
}

/** Open Paddle checkout for a plan. Returns false if Paddle isn't configured. */
export async function openCheckout(plan: ProPlan, onSuccess: () => void): Promise<boolean> {
  const priceId = PRICE_IDS[plan];
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  if (!token || !priceId) return false;
  onComplete = onSuccess;
  const paddle = await ensurePaddle();
  if (!paddle) return false;
  paddle.Checkout.open({ items: [{ priceId, quantity: 1 }] });
  return true;
}
