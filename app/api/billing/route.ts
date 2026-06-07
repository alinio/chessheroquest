/**
 * POST /api/billing — Paddle webhook. Verifies the signature with the raw body
 * (PADDLE_WEBHOOK_SECRET), then reconciles the user's plan/subscription from the
 * VERIFIED event (never trusts the client). The price ID maps to our plan; the
 * Paddle status maps to ours. The user is matched via customData.userId set at
 * checkout.
 */
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/src/data/db";
import { users, accountStates } from "@/db/schema";
import { env } from "@/src/lib/env";
import { getPaddle } from "@/src/data/integrations/paddle";
import { planByPriceId, mapPaddleStatus } from "@/src/lib/plans";

interface PaddleEventDataShape {
  id?: string;
  customerId?: string;
  status?: string;
  items?: Array<{ price?: { id?: string } }>;
  /** userId = legacy app; chqEmail = the new module-flow account (M9b). */
  customData?: { userId?: string; chqEmail?: string } | null;
}

export async function POST(request: Request) {
  if (!env.PADDLE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhooks not configured" }, { status: 503 });
  }

  const signature = request.headers.get("paddle-signature") ?? "";
  const rawBody = await request.text();

  let event;
  try {
    event = await getPaddle().webhooks.unmarshal(rawBody, env.PADDLE_WEBHOOK_SECRET, signature);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  if (!event) return NextResponse.json({ ok: true });

  const data = event.data as unknown as PaddleEventDataShape;
  const userId = data.customData?.userId;
  const chqEmail = data.customData?.chqEmail?.toLowerCase();
  const priceId = data.items?.[0]?.price?.id;
  const plan = priceId ? planByPriceId(priceId) : null;
  const type = String(event.eventType);

  const activates =
    type === "subscription.created" ||
    type === "subscription.updated" ||
    type === "subscription.activated" ||
    type === "transaction.completed";
  const cancels = type === "subscription.canceled";
  if (!activates && !cancels) return NextResponse.json({ ok: true });

  // Legacy app users (matched via customData.userId).
  if (userId) {
    const updates: Partial<typeof users.$inferInsert> = { updatedAt: new Date() };
    if (activates) {
      if (plan) updates.plan = plan;
      updates.subscriptionStatus = mapPaddleStatus(data.status ?? "active");
      if (data.id) updates.paddleSubscriptionId = data.id;
      if (data.customerId) updates.paddleCustomerId = data.customerId;
    } else {
      updates.subscriptionStatus = "canceled";
    }
    await db.update(users).set(updates).where(eq(users.id, userId));
  }

  // New module-flow accounts (M9b) — server-verified Pro, keyed by email.
  if (chqEmail) {
    if (activates) {
      const proPlan = plan ?? "monthly";
      await db
        .insert(accountStates)
        .values({ email: chqEmail, isPro: true, plan: proPlan, paddleCustomerId: data.customerId, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: accountStates.email,
          set: { isPro: true, plan: proPlan, paddleCustomerId: data.customerId, updatedAt: new Date() },
        });
    } else {
      await db.update(accountStates).set({ isPro: false, plan: "free", updatedAt: new Date() }).where(eq(accountStates.email, chqEmail));
    }
  }

  return NextResponse.json({ ok: true });
}
