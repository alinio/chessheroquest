/**
 * GET /api/cron/streak-rescue — daily Vercel cron. Emails CONSENTING players
 * whose streak is one missed day from breaking (trained yesterday, not yet
 * today, ≥3 days banked). Value, not manipulation (LAW #5): one nudge, only
 * when something real is at stake, only to consentMarketing users.
 * Secured with CRON_SECRET (Vercel sends it as a Bearer token).
 */
import { NextResponse } from "next/server";
import { and, eq, gte } from "drizzle-orm";
import { db } from "@/src/data/db";
import { users } from "@/db/schema";
import { dayIndex } from "@/src/domain/gamification/streak";
import { sendEmail } from "@/src/lib/email";

export const maxDuration = 60;

const BATCH_CAP = 200;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const yesterday = dayIndex(new Date()) - 1;
  const atRisk = await db
    .select({ email: users.email, name: users.displayName, streak: users.streakCount })
    .from(users)
    .where(
      and(
        eq(users.consentMarketing, true),
        eq(users.streakLastActiveDay, yesterday),
        gte(users.streakCount, 3),
      ),
    )
    .limit(BATCH_CAP);

  let sent = 0;
  for (const u of atRisk) {
    const ok = await sendEmail({
      to: u.email,
      subject: `Your ${u.streak}-day streak ends tonight 🔥`,
      html: `
        <h2 style="margin:0 0 12px;font-size:22px;color:#f1d680;">${u.streak} days of training — one session from breaking.</h2>
        <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#ece3cf;">
          ${u.name ?? "Hero"}, your drills are due and the flame is burning low.
          Five minutes clears today's review and keeps the streak alive.</p>
        <a href="https://chessheroquest.com/train"
           style="display:inline-block;background:linear-gradient(180deg,#f1d680,#cda845);color:#2a2008;font-weight:700;font-size:15px;padding:13px 28px;border-radius:999px;text-decoration:none;">
          Relight it — 5 minutes →</a>`,
    });
    if (ok) sent++;
  }

  return NextResponse.json({ ok: true, candidates: atRisk.length, sent });
}
