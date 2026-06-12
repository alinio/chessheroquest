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
import { getOpeningMastery } from "@/src/data/repos/openings";
import { getGuardianVictories } from "@/src/data/repos/achievements";
import { medallionState, type PassportProgress } from "@/src/domain/passport";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { OPENING_TO_PATH } from "@/src/lib/opening-paths";
import { OPENING_NAMES, type OpeningId } from "@/src/lib/assets";
import { sendEmail } from "@/src/lib/email";

export const maxDuration = 60;

const BATCH_CAP = 200;

const WEEK_MS = 7 * 86_400_000;

interface SealsStory {
  /** "The {opening} was sealed this week — {x} of 20." (real seal + victory date). */
  sealedThisWeek: { opening: string; sealedCount: number; totalOpenings: number } | null;
  /** Gold line awaiting only its Guardian — truly one duel away. */
  closest: string | null;
}

/** Seal movement this week (gold mastery + Guardian victory date) — repos only. */
function sealsStory(
  mastery: Awaited<ReturnType<typeof getOpeningMastery>>,
  wins: Record<string, Date>,
  now: Date,
): SealsStory {
  const openings = Object.entries(OPENING_TO_PATH) as [OpeningId, string][];
  let sealedCount = 0;
  let newest: { opening: string; at: Date } | null = null;
  let closest: string | null = null;

  for (const [openingId, pathId] of openings) {
    const m = mastery[pathId];
    const entry: PassportProgress | null = m
      ? { studied: m.studied, total: m.total, state: m.state, guardianDefeated: Boolean(wins[pathId]) }
      : null;
    const state = medallionState(entry);
    if (state === "sealed") {
      sealedCount++;
      const at = wins[pathId];
      if (at && now.getTime() - at.getTime() <= WEEK_MS && (!newest || at > newest.at)) {
        newest = { opening: OPENING_NAMES[openingId], at };
      }
    } else if (state === "ready" && !closest) {
      closest = OPENING_NAMES[openingId];
    }
  }

  return {
    sealedThisWeek: newest
      ? { opening: newest.opening, sealedCount, totalOpenings: openings.length }
      : null,
    closest,
  };
}

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

  const now = new Date();
  let sent = 0;
  for (const u of actives) {
    const [trend, stats, mastery, wins] = await Promise.all([
      getIqTrend(u.id),
      getTrainingStats(u.id),
      getOpeningMastery(u.id),
      getGuardianVictories(u.id),
    ]);
    if (trend.length === 0 || stats.cardsReviewed === 0) continue; // nothing real to report
    const iq = trend[trend.length - 1]!;
    const delta = trend.length >= 2 ? iq - trend[0]! : 0;

    // Seal movement + the week's worst leak (repos only — absent data, absent line).
    const seals = sealsStory(mastery, wins, now);
    const leak = STARTER_PATHS
      .filter((p) => {
        const m = mastery[p.id];
        return m && m.studied > 0 && m.state === "leak";
      })
      .sort((a, b) => {
        const ma = mastery[a.id]!;
        const mb = mastery[b.id]!;
        return ma.studied / ma.total - mb.studied / mb.total;
      })[0] ?? null;

    const storyLines: string[] = [];
    if (seals.sealedThisWeek) {
      storyLines.push(
        `The ${seals.sealedThisWeek.opening} was sealed this week — ${seals.sealedThisWeek.sealedCount} of ${seals.sealedThisWeek.totalOpenings}.`,
      );
    } else if (seals.closest) {
      storyLines.push(`Closest seal: ${seals.closest}, one duel away.`);
    }
    if (leak) {
      storyLines.push(`One leak still open: the ${leak.name}.`);
    }
    const storyHtml = storyLines.length
      ? `<p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#ece3cf;">${storyLines.join("<br/>")}</p>`
      : "";

    const cta = leak
      ? { href: `https://chessheroquest.com/drill/${leak.id}`, label: `Patch the ${leak.name} — 3 min →` }
      : { href: "https://chessheroquest.com/insights", label: "See the full picture →" };

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
        ${storyHtml}
        <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#ece3cf;">
          ${u.name ?? "Hero"}, ${
            delta > 0
              ? `your IQ climbed ${delta} points this window — the drills are working.`
              : stats.drillsThisWeek > 0
                ? "steady week at the board — retention is built exactly like this."
                : "the board missed you this week. One session puts the engine back to work."
          }</p>
        <a href="${cta.href}"
           style="display:inline-block;background:linear-gradient(180deg,#f1d680,#cda845);color:#2a2008;font-weight:700;font-size:15px;padding:13px 28px;border-radius:999px;text-decoration:none;">
          ${cta.label}</a>`,
    });
    if (ok) sent++;
  }

  return NextResponse.json({ ok: true, candidates: actives.length, sent });
}
