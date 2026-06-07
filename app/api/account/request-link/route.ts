/**
 * POST /api/account/request-link { email } — issue a passwordless magic link.
 * Dev console-link mode: the link is logged to the server console (no email
 * provider yet). TODO: send via email (Resend/SMTP) before testers.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { createHash, randomBytes } from "node:crypto";
import { db } from "@/src/data/db";
import { accountStates } from "@/db/schema";

const BodySchema = z.object({ email: z.string().email().max(320) });

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  const email = parsed.data.email.toLowerCase();
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const tokenExpires = new Date(Date.now() + 15 * 60 * 1000);

  await db
    .insert(accountStates)
    .values({ email, tokenHash, tokenExpires })
    .onConflictDoUpdate({ target: accountStates.email, set: { tokenHash, tokenExpires } });

  const origin = new URL(request.url).origin;
  const link = `${origin}/api/account/verify?email=${encodeURIComponent(email)}&token=${token}`;
  // Dev console-link (M9a) — replaced by an email provider before testers.
  console.log(`\n🔗 ChessHeroQuest magic link for ${email}:\n${link}\n`);

  return NextResponse.json({ ok: true });
}
