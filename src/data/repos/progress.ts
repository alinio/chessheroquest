/**
 * Progress repository — persists and reads a user's real progression (data layer).
 * The DNA Test seeds the first Opening IQ snapshot + archetype; the Dashboard
 * reads the latest snapshot. This is what replaces the seed numbers with truth.
 */
import { desc, eq } from "drizzle-orm";
import { db } from "@/src/data/db";
import { dnaResults, openingIqSnapshots, users } from "@/db/schema";
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
    .select({ archetype: users.archetype })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return {
    iq: latest.value,
    core: latest.core,
    archetype: userRow[0]?.archetype ?? null,
  };
}
