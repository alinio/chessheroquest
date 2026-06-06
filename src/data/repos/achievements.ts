/**
 * Achievements repository — awards specialized titles when openings are conquered
 * (mastery = gold) and reads them back for the profile. Idempotent: one title per
 * (user, opening) via the unique index.
 */
import { desc, eq } from "drizzle-orm";
import { db } from "@/src/data/db";
import { achievements } from "@/db/schema";
import { getOpeningMastery } from "@/src/data/repos/openings";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { openingTitle } from "@/src/domain/achievements";

type AchievementInsert = {
  userId: string;
  type: "opening_conquered" | "collector";
  key: string;
  title: string;
};

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
  createdAt: Date;
}

export async function getAchievements(userId: string): Promise<Achievement[]> {
  return db
    .select({
      title: achievements.title,
      key: achievements.key,
      createdAt: achievements.createdAt,
    })
    .from(achievements)
    .where(eq(achievements.userId, userId))
    .orderBy(desc(achievements.createdAt));
}
