/**
 * Achievements repository — awards specialized titles when openings are conquered
 * (mastery = gold) and reads them back for the profile. Idempotent: one title per
 * (user, opening) via the unique index.
 */
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/src/data/db";
import { achievements } from "@/db/schema";
import { getOpeningMastery } from "@/src/data/repos/openings";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { openingTitle } from "@/src/domain/achievements";

type AchievementInsert = {
  userId: string;
  type: "opening_conquered" | "collector" | "guardian_defeated";
  key: string;
  title: string;
};

/** Achievement key for a Guardian victory on a curated path. */
const guardianKey = (pathId: string) => `guardian:${pathId}`;

/**
 * Record a Guardian-duel victory (idempotent — one per path). Powers the
 * Passport seal (= gold mastery AND Guardian defeated). Best-effort: a missing
 * enum value (migration 0010 not applied yet) must never break the victory flow.
 */
export async function recordGuardianVictory(
  userId: string,
  pathId: string,
  guardianName: string,
): Promise<void> {
  try {
    await db
      .insert(achievements)
      .values({
        userId,
        type: "guardian_defeated",
        key: guardianKey(pathId),
        title: `${guardianName} defeated`,
      })
      .onConflictDoNothing({ target: [achievements.userId, achievements.key] });
  } catch (err) {
    console.error("recordGuardianVictory failed (non-fatal)", err);
  }
}

/** Guardian victories by curated path id → victory date. */
export async function getGuardianVictories(userId: string): Promise<Record<string, Date>> {
  const rows = await db
    .select({ key: achievements.key, createdAt: achievements.createdAt })
    .from(achievements)
    .where(and(eq(achievements.userId, userId), eq(achievements.type, "guardian_defeated")));
  const out: Record<string, Date> = {};
  for (const r of rows) {
    if (r.key.startsWith("guardian:")) out[r.key.slice("guardian:".length)] = r.createdAt;
  }
  return out;
}

/** Award titles for every conquered (gold) opening, plus Collector when all are done. */
export async function reconcileOpeningAchievements(userId: string): Promise<void> {
  const mastery = await getOpeningMastery(userId);
  const conquered = STARTER_PATHS.filter((p) => mastery[p.id]?.state === "gold");
  if (conquered.length === 0) return;

  const values: AchievementInsert[] = conquered.map((p) => ({
    userId,
    type: "opening_conquered",
    key: p.id,
    title: openingTitle(p.id, p.name),
  }));

  if (conquered.length === STARTER_PATHS.length) {
    values.push({
      userId,
      type: "collector",
      key: "opening-collector",
      title: "Opening Collector",
    });
  }

  await db
    .insert(achievements)
    .values(values)
    .onConflictDoNothing({ target: [achievements.userId, achievements.key] });
}

export interface Achievement {
  title: string;
  key: string;
  type: "opening_conquered" | "collector" | "guardian_defeated";
  createdAt: Date;
}

export async function getAchievements(userId: string): Promise<Achievement[]> {
  return db
    .select({
      title: achievements.title,
      key: achievements.key,
      type: achievements.type,
      createdAt: achievements.createdAt,
    })
    .from(achievements)
    .where(eq(achievements.userId, userId))
    .orderBy(desc(achievements.createdAt));
}
