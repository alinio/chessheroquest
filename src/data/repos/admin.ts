/**
 * Admin repository — EVERY back-office query lives here (server-only via db →
 * env.ts guard). Phase A is read-only: real aggregates, no invented numbers.
 *
 * Honesty contract: a metric is `null` when its source table has no rows at all
 * (the UI shows "No data yet"); a real 0 over real rows is shown as 0.
 *
 * Two account systems coexist on purpose (Phase-0 rebuild):
 *  - `users`          — legacy/credentials accounts (Auth.js), per-user progression.
 *  - `account_states` — Phase-0 email-keyed accounts; `plan` mirrors the VERIFIED
 *    Paddle webhook, so premium/revenue estimates read from here.
 */
import { and, count, countDistinct, desc, eq, gte, ilike, ne, sql } from "drizzle-orm";
import { db } from "@/src/data/db";
import {
  accountStates,
  achievements,
  auditLogs,
  dnaResults,
  mastery,
  openingIqSnapshots,
  pathTemplates,
  trainingEvents,
  users,
} from "@/db/schema";

/* ----------------------------------------------------------------- pricing */

/** USD prices per plan (master-vision §21). Estimation only — Paddle is the
 * source of truth and lands in Phase C. */
export const PLAN_PRICES_USD = {
  pro_monthly: 9.99,
  pro_annual: 79,
  lifetime: 129,
} as const;

/* ----------------------------------------------------------------- helpers */

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 86_400_000);
}

/** Escape LIKE wildcards so a search for "100%" matches literally. */
function escapeLike(q: string): string {
  return q.replace(/[\\%_]/g, (m) => `\\${m}`);
}

function toDate(v: string | Date | null): Date | null {
  if (v == null) return null;
  return v instanceof Date ? v : new Date(v);
}

async function usersTableHasRows(): Promise<boolean> {
  return (await db.select({ one: sql<number>`1` }).from(users).limit(1)).length > 0;
}

async function trainingEventsHasRows(): Promise<boolean> {
  return (
    (await db.select({ one: sql<number>`1` }).from(trainingEvents).limit(1)).length > 0
  );
}

async function achievementsHasRows(): Promise<boolean> {
  return (
    (await db.select({ one: sql<number>`1` }).from(achievements).limit(1)).length > 0
  );
}

async function accountStatesHasRows(): Promise<boolean> {
  return (
    (await db.select({ one: sql<number>`1` }).from(accountStates).limit(1)).length > 0
  );
}

/* --------------------------------------------------------- dashboard: KPIs */

export interface DailySignups {
  /** YYYY-MM-DD (UTC) */
  day: string;
  count: number;
}

export interface AccountsKpis {
  totalUsers: number;
  newLast7d: number;
  /** One entry per day for the last 7 days (oldest first), zero-filled. */
  signupsByDay: DailySignups[];
}

export async function getAccountsKpis(): Promise<AccountsKpis> {
  const since = daysAgo(7);
  const [totalRow] = await db.select({ n: count() }).from(users);
  const [recentRow] = await db
    .select({ n: count() })
    .from(users)
    .where(gte(users.createdAt, since));
  const byDay = await db
    .select({
      day: sql<string>`to_char(${users.createdAt} at time zone 'utc', 'YYYY-MM-DD')`,
      n: count(),
    })
    .from(users)
    .where(gte(users.createdAt, since))
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  // Zero-fill the 7-day window so the sparkline has a fixed time axis.
  const map = new Map(byDay.map((r) => [r.day, r.n]));
  const signupsByDay: DailySignups[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
    signupsByDay.push({ day, count: map.get(day) ?? 0 });
  }

  return {
    totalUsers: totalRow?.n ?? 0,
    newLast7d: recentRow?.n ?? 0,
    signupsByDay,
  };
}

export interface ActivityKpis {
  active24h: number | null;
  active7d: number | null;
  drills7d: number | null;
  duelsWon7d: number | null;
}

export async function getActivityKpis(): Promise<ActivityKpis> {
  const [hasEvents, hasAchievements] = await Promise.all([
    trainingEventsHasRows(),
    achievementsHasRows(),
  ]);

  let active24h: number | null = null;
  let active7d: number | null = null;
  let drills7d: number | null = null;
  if (hasEvents) {
    const [a24] = await db
      .select({ n: countDistinct(trainingEvents.userId) })
      .from(trainingEvents)
      .where(gte(trainingEvents.createdAt, daysAgo(1)));
    const [a7] = await db
      .select({ n: countDistinct(trainingEvents.userId) })
      .from(trainingEvents)
      .where(gte(trainingEvents.createdAt, daysAgo(7)));
    const [d7] = await db
      .select({ n: count() })
      .from(trainingEvents)
      .where(
        and(eq(trainingEvents.mode, "drill"), gte(trainingEvents.createdAt, daysAgo(7))),
      );
    active24h = a24?.n ?? 0;
    active7d = a7?.n ?? 0;
    drills7d = d7?.n ?? 0;
  }

  let duelsWon7d: number | null = null;
  if (hasAchievements) {
    const [w7] = await db
      .select({ n: count() })
      .from(achievements)
      .where(
        and(
          eq(achievements.type, "guardian_defeated"),
          gte(achievements.createdAt, daysAgo(7)),
        ),
      );
    duelsWon7d = w7?.n ?? 0;
  }

  return { active24h, active7d, drills7d, duelsWon7d };
}

export interface FunnelKpis {
  /** Saved DNA tests (dna_results rows) — a DB proxy, not client analytics. */
  dnaTests: number;
  /** Legacy/credentials accounts (users rows). */
  accounts: number;
  /** Phase-0 premium accounts (account_states.plan != 'free'); null = table empty. */
  premium: number | null;
  dnaToAccountRate: number | null;
  accountToPremiumRate: number | null;
}

export async function getFunnelKpis(): Promise<FunnelKpis> {
  const [dnaRow] = await db.select({ n: count() }).from(dnaResults);
  const [usersRow] = await db.select({ n: count() }).from(users);
  const hasStates = await accountStatesHasRows();

  let premium: number | null = null;
  if (hasStates) {
    const [p] = await db
      .select({ n: count() })
      .from(accountStates)
      .where(ne(accountStates.plan, "free"));
    premium = p?.n ?? 0;
  }

  const dnaTests = dnaRow?.n ?? 0;
  const accounts = usersRow?.n ?? 0;
  return {
    dnaTests,
    accounts,
    premium,
    dnaToAccountRate: dnaTests > 0 ? accounts / dnaTests : null,
    accountToPremiumRate: accounts > 0 && premium != null ? premium / accounts : null,
  };
}

export interface RevenueKpis {
  /** false = account_states is empty → "No data yet". */
  hasData: boolean;
  monthlyCount: number;
  annualCount: number;
  lifetimeCount: number;
  /** Premium rows whose plan string matches no known plan (webhook fallback). */
  unknownPlanCount: number;
  /** Monthly + annual/12 — lifetime excluded by definition. */
  estimatedMrrUsd: number | null;
  /** Lifetime count × price, one-off (not MRR). */
  lifetimeOneOffUsd: number | null;
}

export async function getRevenueKpis(): Promise<RevenueKpis> {
  const hasData = await accountStatesHasRows();
  if (!hasData) {
    return {
      hasData,
      monthlyCount: 0,
      annualCount: 0,
      lifetimeCount: 0,
      unknownPlanCount: 0,
      estimatedMrrUsd: null,
      lifetimeOneOffUsd: null,
    };
  }

  const rows = await db
    .select({ plan: accountStates.plan, n: count() })
    .from(accountStates)
    .where(ne(accountStates.plan, "free"))
    .groupBy(accountStates.plan);

  let monthlyCount = 0;
  let annualCount = 0;
  let lifetimeCount = 0;
  let unknownPlanCount = 0;
  for (const r of rows) {
    // "monthly" is the historical webhook fallback when no price ID matched.
    if (r.plan === "pro_monthly" || r.plan === "monthly") monthlyCount += r.n;
    else if (r.plan === "pro_annual") annualCount += r.n;
    else if (r.plan === "lifetime") lifetimeCount += r.n;
    else unknownPlanCount += r.n;
  }

  return {
    hasData,
    monthlyCount,
    annualCount,
    lifetimeCount,
    unknownPlanCount,
    estimatedMrrUsd:
      monthlyCount * PLAN_PRICES_USD.pro_monthly +
      (annualCount * PLAN_PRICES_USD.pro_annual) / 12,
    lifetimeOneOffUsd: lifetimeCount * PLAN_PRICES_USD.lifetime,
  };
}

export interface EngagementKpis {
  activeStreaks: number | null;
  /** Mean of each user's LATEST opening_iq_snapshots value. */
  avgIq: number | null;
  /** guardian_defeated achievements (Passport-seal proxy: gold mastery check omitted). */
  sealsTotal: number | null;
}

export async function getEngagementKpis(): Promise<EngagementKpis> {
  const [hasUsers, hasAchievements] = await Promise.all([
    usersTableHasRows(),
    achievementsHasRows(),
  ]);

  let activeStreaks: number | null = null;
  if (hasUsers) {
    const [s] = await db
      .select({ n: count() })
      .from(users)
      .where(gte(users.streakCount, 1));
    activeStreaks = s?.n ?? 0;
  }

  // Average of the latest snapshot per user (DISTINCT ON user_id, newest first).
  const latest = db
    .selectDistinctOn([openingIqSnapshots.userId], {
      userId: openingIqSnapshots.userId,
      value: openingIqSnapshots.value,
    })
    .from(openingIqSnapshots)
    .orderBy(openingIqSnapshots.userId, desc(openingIqSnapshots.createdAt))
    .as("latest_iq");
  const [avgRow] = await db
    .select({ avg: sql<number | null>`avg(${latest.value})::float` })
    .from(latest);
  const avgIq = avgRow?.avg ?? null;

  let sealsTotal: number | null = null;
  if (hasAchievements) {
    const [sealRow] = await db
      .select({ n: count() })
      .from(achievements)
      .where(eq(achievements.type, "guardian_defeated"));
    sealsTotal = sealRow?.n ?? 0;
  }

  return { activeStreaks, avgIq, sealsTotal };
}

/* ------------------------------------------------------------- users: list */

export const USERS_PAGE_SIZE = 50;

export interface AdminUserRow {
  id: string;
  email: string;
  createdAt: Date;
  plan: string;
  streakCount: number;
  iq: number | null;
  seals: number;
  lastTrainingAt: Date | null;
}

export interface AdminUserList {
  rows: AdminUserRow[];
  total: number;
  page: number;
  pageCount: number;
}

export async function listUsers(page: number, q?: string): Promise<AdminUserList> {
  const safePage = Math.max(1, Math.floor(page) || 1);
  const where = q?.trim() ? ilike(users.email, `%${escapeLike(q.trim())}%`) : undefined;

  const [rows, [totalRow]] = await Promise.all([
    db
      .select({
        id: users.id,
        email: users.email,
        createdAt: users.createdAt,
        plan: users.plan,
        streakCount: users.streakCount,
        iq: sql<number | null>`(select s.value from opening_iq_snapshots s where s.user_id = ${users.id} order by s.created_at desc limit 1)`,
        seals: sql<number>`(select count(*)::int from achievements a where a.user_id = ${users.id} and a.type = 'guardian_defeated')`,
        lastTrainingAt: sql<string | null>`(select max(e.created_at) from training_events e where e.user_id = ${users.id})`,
      })
      .from(users)
      .where(where)
      .orderBy(desc(users.createdAt))
      .limit(USERS_PAGE_SIZE)
      .offset((safePage - 1) * USERS_PAGE_SIZE),
    db.select({ n: count() }).from(users).where(where),
  ]);

  const total = totalRow?.n ?? 0;
  return {
    rows: rows.map((r) => ({ ...r, lastTrainingAt: toDate(r.lastTrainingAt) })),
    total,
    page: safePage,
    pageCount: Math.max(1, Math.ceil(total / USERS_PAGE_SIZE)),
  };
}

/* ----------------------------------------------------------- users: detail */

export interface AdminUserDetail {
  user: {
    id: string;
    email: string;
    displayName: string | null;
    archetype: string | null;
    ageBand: string | null;
    consentMarketing: boolean;
    consentAt: Date | null;
    profilePublic: boolean;
    plan: string;
    subscriptionStatus: string;
    xp: number;
    streakCount: number;
    eloGoal: number;
    lichessUsername: string | null;
    chesscomUsername: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  /** Phase-0 account row matched by email (verified Paddle entitlement). */
  accountState: {
    plan: string;
    isPro: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  dna: {
    archetype: string;
    initialIq: number;
    percentile: number | null;
    createdAt: Date;
  } | null;
  /** Last 30 snapshots, oldest → newest (sparkline-ready). */
  iqTrend: { value: number; createdAt: Date }[];
  mastery: { opening: string; slug: string; state: string; updatedAt: Date }[];
  achievements: { type: string; key: string; title: string; createdAt: Date }[];
  /** Last 20 training events, newest first. */
  recentEvents: {
    mode: string;
    correct: boolean | null;
    latencyMs: number | null;
    createdAt: Date;
  }[];
}

export async function getUserDetail(id: string): Promise<AdminUserDetail | null> {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!user) return null;

  const [stateRows, dnaRows, iqRows, masteryRows, achievementRows, eventRows] =
    await Promise.all([
      db
        .select({
          plan: accountStates.plan,
          isPro: accountStates.isPro,
          createdAt: accountStates.createdAt,
          updatedAt: accountStates.updatedAt,
        })
        .from(accountStates)
        .where(eq(accountStates.email, user.email.toLowerCase()))
        .limit(1),
      db
        .select({
          archetype: dnaResults.archetype,
          initialIq: dnaResults.initialIq,
          percentile: dnaResults.percentile,
          createdAt: dnaResults.createdAt,
        })
        .from(dnaResults)
        .where(eq(dnaResults.userId, id))
        .orderBy(desc(dnaResults.createdAt))
        .limit(1),
      db
        .select({
          value: openingIqSnapshots.value,
          createdAt: openingIqSnapshots.createdAt,
        })
        .from(openingIqSnapshots)
        .where(eq(openingIqSnapshots.userId, id))
        .orderBy(desc(openingIqSnapshots.createdAt))
        .limit(30),
      db
        .select({
          opening: pathTemplates.name,
          slug: pathTemplates.slug,
          state: mastery.state,
          updatedAt: mastery.updatedAt,
        })
        .from(mastery)
        .innerJoin(pathTemplates, eq(mastery.pathTemplateId, pathTemplates.id))
        .where(eq(mastery.userId, id))
        .orderBy(desc(mastery.updatedAt)),
      db
        .select({
          type: achievements.type,
          key: achievements.key,
          title: achievements.title,
          createdAt: achievements.createdAt,
        })
        .from(achievements)
        .where(eq(achievements.userId, id))
        .orderBy(desc(achievements.createdAt)),
      db
        .select({
          mode: trainingEvents.mode,
          correct: trainingEvents.correct,
          latencyMs: trainingEvents.latencyMs,
          createdAt: trainingEvents.createdAt,
        })
        .from(trainingEvents)
        .where(eq(trainingEvents.userId, id))
        .orderBy(desc(trainingEvents.createdAt))
        .limit(20),
    ]);

  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      archetype: user.archetype,
      ageBand: user.ageBand,
      consentMarketing: user.consentMarketing,
      consentAt: user.consentAt,
      profilePublic: user.profilePublic,
      plan: user.plan,
      subscriptionStatus: user.subscriptionStatus,
      xp: user.xp,
      streakCount: user.streakCount,
      eloGoal: user.eloGoal,
      lichessUsername: user.lichessUsername,
      chesscomUsername: user.chesscomUsername,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    accountState: stateRows[0] ?? null,
    dna: dnaRows[0] ?? null,
    iqTrend: [...iqRows].reverse(),
    mastery: masteryRows,
    achievements: achievementRows,
    recentEvents: eventRows,
  };
}

/* ------------------------------------------------------------------- audit */

// In-memory throttle (per server instance, best-effort): one admin_view audit
// row per actor per hour, not one per page render.
const lastAdminViewLog = new Map<string, number>();
const ADMIN_VIEW_THROTTLE_MS = 60 * 60 * 1000;

/** Best-effort LAW #7 trace: record that an admin opened the back-office. */
export async function logAdminView(actorUserId: string): Promise<void> {
  const now = Date.now();
  const last = lastAdminViewLog.get(actorUserId);
  if (last != null && now - last < ADMIN_VIEW_THROTTLE_MS) return;
  lastAdminViewLog.set(actorUserId, now);
  try {
    await db.insert(auditLogs).values({
      actorUserId,
      action: "admin_view",
      targetType: "admin",
      targetId: "/admin",
    });
  } catch {
    // Best-effort: an audit hiccup must never break the admin itself.
  }
}
