/**
 * Training stats repository — records a session's attempts (the moat data,
 * §30) and advances the user's streak + XP. The streak logic is the pure domain
 * function; this just persists its result.
 */
import { eq } from "drizzle-orm";
import { db } from "@/src/data/db";
import { trainingEvents, users } from "@/db/schema";
import { recordActivity, type StreakState } from "@/src/domain/gamification/streak";
import { XP_REWARDS } from "@/src/domain/gamification/xp";
import { upsertCardReview } from "@/src/data/repos/cards";
import { reconcileOpeningAchievements } from "@/src/data/repos/achievements";

export type TrainingMode = "learn" | "drill" | "review" | "sparring" | "dna_test";

export interface TrainingAttempt {
  correct: boolean;
  latencyMs: number;
  /** FEN of the position answered — persists an FSRS card when present. */
  fen?: string;
}

export interface TrainingOutcome {
  xp: number;
  streakCount: number;
}

/** Record a training session: log every attempt, then bump streak + XP. */
export async function recordTraining(
  userId: string,
  mode: TrainingMode,
  attempts: readonly TrainingAttempt[],
): Promise<TrainingOutcome> {
  const now = new Date();

  if (attempts.length > 0) {
    await db.insert(trainingEvents).values(
      attempts.map((a) => ({
        userId,
        mode,
        correct: a.correct,
        latencyMs: a.latencyMs,
      })),
    );
  }

  // Persist the FSRS card for each answered position (cross-session retention).
  for (const a of attempts) {
    if (a.fen) await upsertCardReview(userId, a.fen, a.correct, now);
  }

  const rows = await db
    .select({
      xp: users.xp,
      streakCount: users.streakCount,
      streakLastActiveDay: users.streakLastActiveDay,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  const current = rows[0];
  if (!current) return { xp: 0, streakCount: 0 };

  const state: StreakState = {
    count: current.streakCount,
    lastActiveDay: current.streakLastActiveDay,
  };
  const nextStreak = recordActivity(state, now);
  const correctCount = attempts.filter((a) => a.correct).length;
  const newXp = current.xp + correctCount * XP_REWARDS.drillCorrect;

  await db
    .update(users)
    .set({
      xp: newXp,
      streakCount: nextStreak.count,
      streakLastActiveDay: nextStreak.lastActiveDay,
      updatedAt: now,
    })
    .where(eq(users.id, userId));

  // Award any newly-conquered opening titles (gold mastery).
  await reconcileOpeningAchievements(userId);

  return { xp: newXp, streakCount: nextStreak.count };
}
