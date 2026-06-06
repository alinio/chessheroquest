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
import { users } from "@/db/schema";
import { env } from "@/src/lib/env";
import { getPaddle } from "@/src/data/integrations/paddle";
import { planByPriceId, mapPaddleStatus } from "@/src/lib/plans";

interface PaddleEventDataShape {
  id?: string;
  customerId?: string;
  status?: string;
  items?: Array<{ price?: { id?: string } }>;
  customData?: { userId?: string } | null;
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
  if (!userId) return NextResponse.json({ ok: true }); // nothing to reconcile

  const priceId = data.items?.[0]?.price?.id;
  const plan = priceId ? planByPriceId(priceId) : null;

  const updates: Partial<typeof users.$inferInsert> = { updatedAt: new Date() };
  const type = String(event.eventType);

  switch (type) {
    case "subscription.created":
    case "subscription.updated":
    case "subscription.activated":
      if (plan) updates.plan = plan;
      updates.subscriptionStatus = mapPaddleStatus(data.status ?? "active");
      if (data.id) updates.paddleSubscriptionId = data.id;
      if (data.customerId) updates.paddleCustomerId = data.customerId;
      break;
    case "subscription.canceled":
      updates.subscriptionStatus = "canceled";
      break;
    case "transaction.completed":
      // One-time purchase (e.g. Lifetime).
      if (plan) updates.plan = plan;
      updates.subscriptionStatus = "active";
      if (data.customerId) updates.paddleCustomerId = data.customerId;
      break;
    default:
      return NextResponse.json({ ok: true });
  }

  await db.update(users).set(updates).where(eq(users.id, userId));
  return NextResponse.json({ ok: true });
}
