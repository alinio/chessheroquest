"use client";

import { useEffect, useRef, useState } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import type { Plan } from "@/src/lib/plans";

/**
 * Opens a Paddle checkout overlay for a plan. customData.userId lets the webhook
 * reconcile the purchase to the user (server-verified). The Free plan has no
 * checkout.
 */
export function CheckoutButton({
  plan,
  userId,
  email,
}: {
  plan: Plan;
  userId?: string;
  email?: string;
}) {
  const paddleRef = useRef<Paddle | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) return;
    const environment =
      process.env.NEXT_PUBLIC_PADDLE_ENV === "production" ? "production" : "sandbox";
    initializePaddle({ environment, token }).then((p) => {
      if (p) {
        paddleRef.current = p;
        setReady(true);
      }
    });
  }, []);

  const isFree = plan.id === "free";

  function openCheckout() {
    if (!paddleRef.current || !plan.priceId) return;
    paddleRef.current.Checkout.open({
      items: [{ priceId: plan.priceId, quantity: 1 }],
      ...(email ? { customer: { email } } : {}),
      ...(userId ? { customData: { userId } } : {}),
      settings: { displayMode: "overlay", theme: "dark" },
    });
  }

  if (isFree) {
    return (
      <button
        type="button"
        disabled
        className="rounded-chip border-hairline text-text-mid min-h-[44px] w-full border text-sm"
      >
        Included
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openCheckout}
      disabled={!ready || !plan.priceId}
      className="rounded-chip bg-gold text-abyss min-h-[44px] w-full font-semibold disabled:opacity-60"
    >
      {ready ? `Choose ${plan.name}` : "Loading…"}
    </button>
  );
}
