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
import { getDueCount } from "@/src/data/repos/cards";
import { getOpeningMastery } from "@/src/data/repos/openings";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { sendEmail } from "@/src/lib/email";

export const maxDuration = 60;

const BATCH_CAP = 200;

const STATE_ORDER = { leak: 0, review: 1, solid: 2, gold: 3 } as const;

/** The user's most fragile started line (leaks first, then fading) — or null. */
function fragileLine(mastery: Awaited<ReturnType<typeof getOpeningMastery>>): string | null {
  const candidates = STARTER_PATHS
    .map((p) => ({ name: p.name, m: mastery[p.id] }))
    .filter((x): x is { name: string; m: NonNullable<typeof x.m> } =>
      Boolean(x.m && x.m.studied > 0 && (x.m.state === "leak" || x.m.state === "review")),
    )
    .sort(
      (a, b) =>
        STATE_ORDER[a.m.state] - STATE_ORDER[b.m.state] ||
        a.m.studied / a.m.total - b.m.studied / b.m.total,
    );
  return candidates[0]?.name ?? null;
}

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
    .select({ id: users.id, email: users.email, name: users.displayName, streak: users.streakCount })
    .from(users)
    .where(
      and(
        eq(users.consentMarketing, true),
        eq(users.streakLastActiveDay, yesterday),
        gte(users.streakCount, 3),
      ),
    )
    .limit(BATCH_CAP);

  const now = new Date();
  let sent = 0;
  for (const u of atRisk) {
    // What is REALLY at stake tonight: due-card count + the most fragile line
    // (repos only — if the data doesn't exist, the generic copy stands).
    const [dueCount, mastery] = await Promise.all([
      getDueCount(u.id, now),
      getOpeningMastery(u.id),
    ]);
    const fragile = fragileLine(mastery);
    const enriched = dueCount > 0 && fragile;

    const body = enriched
      ? `${u.name ?? "Hero"}, ${dueCount} position${dueCount === 1 ? " is" : "s are"} due tonight,
          and your ${fragile} is the one fading fastest. Five minutes holds the line.`
      : `${u.name ?? "Hero"}, your drills are due and the flame is burning low.
          Five minutes clears today's review and keeps the streak alive.`;
    const cta = enriched
      ? { href: "https://chessheroquest.com/review", label: "Hold the line — 5 min →" }
      : { href: "https://chessheroquest.com/train", label: "Relight it — 5 minutes →" };

    const ok = await sendEmail({
      to: u.email,
      subject: `Your ${u.streak}-day streak ends tonight`,
      html: `
        <h2 style="margin:0 0 12px;font-size:22px;color:#f1d680;">${u.streak} days of training — one session from breaking.</h2>
        <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#ece3cf;">
          ${body}</p>
        <a href="${cta.href}"
           style="display:inline-block;background:linear-gradient(180deg,#f1d680,#cda845);color:#2a2008;font-weight:700;font-size:15px;padding:13px 28px;border-radius:999px;text-decoration:none;">
          ${cta.label}</a>`,
    });
    if (ok) sent++;
  }

  return NextResponse.json({ ok: true, candidates: atRisk.length, sent });
}
