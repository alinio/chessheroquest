/**
 * GET /api/cron/weekly-report — weekly Vercel cron (Sunday). Emails CONSENTING
 * active players their real week: IQ + delta, positions answered, 7-day
 * accuracy. Honest numbers only — the email IS the Insights screen's promise
 * ("proof it's working") delivered to the inbox. Secured with CRON_SECRET.
 */
import { NextResponse } from "next/server";
import { and, eq, gte, isNotNull } from "drizzle-orm";
import { db } from "@/src/data/db";
import { users } from "@/db/schema";
import { getIqTrend } from "@/src/data/repos/progress";
import { getTrainingStats } from "@/src/data/repos/stats";
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

  // Consenting players active within the last 14 days (no spam to the lapsed).
  const cutoff = Math.floor(Date.now() / 86_400_000) - 14;
  const actives = await db
    .select({ id: users.id, email: users.email, name: users.displayName })
    .from(users)
    .where(
      and(
        eq(users.consentMarketing, true),
        isNotNull(users.streakLastActiveDay),
        gte(users.streakLastActiveDay, cutoff),
      ),
    )
    .limit(BATCH_CAP);

  let sent = 0;
  for (const u of actives) {
    const [trend, stats] = await Promise.all([getIqTrend(u.id), getTrainingStats(u.id)]);
    if (trend.length === 0 || stats.cardsReviewed === 0) continue; // nothing real to report
    const iq = trend[trend.length - 1]!;
    const delta = trend.length >= 2 ? iq - trend[0]! : 0;

    const ok = await sendEmail({
      to: u.email,
      subject: `Your week at the board — Opening IQ ${iq}${delta > 0 ? ` (+${delta})` : ""}`,
      html: `
        <h2 style="margin:0 0 12px;font-size:22px;color:#f1d680;">Your opening game, measured.</h2>
        <table style="width:100%;border-collapse:collapse;margin:0 0 18px;">
          <tr>
            <td style="padding:12px;border:1px solid rgba(205,168,69,.18);border-radius:8px;text-align:center;">
              <div style="font-size:26px;font-weight:700;color:#f1d680;">${iq}</div>
              <div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#9c9484;">Opening IQ${delta !== 0 ? ` · ${delta > 0 ? "+" : ""}${delta}` : ""}</div>
            </td>
            <td style="padding:12px;border:1px solid rgba(205,168,69,.18);border-radius:8px;text-align:center;">
              <div style="font-size:26px;font-weight:700;color:#f1d680;">${stats.drillsThisWeek}</div>
              <div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#9c9484;">Drills this week</div>
            </td>
            <td style="padding:12px;border:1px solid rgba(205,168,69,.18);border-radius:8px;text-align:center;">
              <div style="font-size:26px;font-weight:700;color:#f1d680;">${stats.accuracy != null ? `${stats.accuracy}%` : "—"}</div>
              <div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#9c9484;">Accuracy · 7d</div>
            </td>
          </tr>
        </table>
        <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#ece3cf;">
          ${u.name ?? "Hero"}, ${
            delta > 0
              ? `your IQ climbed ${delta} points this window — the drills are working.`
              : stats.drillsThisWeek > 0
                ? "steady week at the board — retention is built exactly like this."
                : "the board missed you this week. One session puts the engine back to work."
          }</p>
        <a href="https://chessheroquest.com/insights"
           style="display:inline-block;background:linear-gradient(180deg,#f1d680,#cda845);color:#2a2008;font-weight:700;font-size:15px;padding:13px 28px;border-radius:999px;text-decoration:none;">
          See the full picture →</a>`,
    });
    if (ok) sent++;
  }

  return NextResponse.json({ ok: true, candidates: actives.length, sent });
}
