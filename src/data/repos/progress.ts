/**
 * Progress repository — persists and reads a user's real progression (data layer).
 * The DNA Test seeds the first Opening IQ snapshot + archetype; the Dashboard
 * reads the latest snapshot. This is what replaces the seed numbers with truth.
 */
import { desc, eq } from "drizzle-orm";
import { db } from "@/src/data/db";
import { dnaResults, openingIqSnapshots, users } from "@/db/schema";
import { getDueCount } from "@/src/data/repos/cards";
import type { DnaResult } from "@/src/domain/dna/types";

/** Persist a completed DNA Test: result row + initial IQ snapshot + user archetype. */
export async function saveDnaResult(userId: string, result: DnaResult): Promise<void> {
  await db.insert(dnaResults).values({
    userId,
    archetype: result.archetype,
    initialIq: result.initialIq,
    percentile: result.percentile,
    raw: result,
  });

  await db.insert(openingIqSnapshots).values({
    userId,
    value: result.initialIq,
    core: result.core,
    breadthBonus: 0,
  });

  await db
    .update(users)
    .set({ archetype: result.archetype, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

export interface UserProgress {
  /** Latest Opening IQ (0–1000). */
  iq: number;
  /** Core competence [0,1] behind that IQ. */
  core: number;
  archetype: (typeof users.$inferSelect)["archetype"];
  xp: number;
  streakCount: number;
  streakLastActiveDay: number | null;
  /** Cards due for review now — the Daily Quest size. */
  dueCount: number;
}

/** The user's current progression, or null if they haven't taken the DNA Test yet. */
export async function getProgress(userId: string): Promise<UserProgress | null> {
  const snapshot = await db
    .select()
    .from(openingIqSnapshots)
    .where(eq(openingIqSnapshots.userId, userId))
    .orderBy(desc(openingIqSnapshots.createdAt))
    .limit(1);
  const latest = snapshot[0];
  if (!latest) return null;

  const userRow = await db
    .select({
      archetype: users.archetype,
      xp: users.xp,
      streakCount: users.streakCount,
      streakLastActiveDay: users.streakLastActiveDay,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  const u = userRow[0];
  const dueCount = await getDueCount(userId, new Date());

  return {
    iq: latest.value,
    core: latest.core,
    archetype: u?.archetype ?? null,
    xp: u?.xp ?? 0,
    streakCount: u?.streakCount ?? 0,
    streakLastActiveDay: u?.streakLastActiveDay ?? null,
    dueCount,
  };
}

/** The user's latest DNA result (the full shareable object), or null. */
export async function getLatestDnaResult(userId: string): Promise<DnaResult | null> {
  const rows = await db
    .select({ raw: dnaResults.raw })
    .from(dnaResults)
    .where(eq(dnaResults.userId, userId))
    .orderBy(desc(dnaResults.createdAt))
    .limit(1);
  return (rows[0]?.raw as DnaResult | undefined) ?? null;
}
