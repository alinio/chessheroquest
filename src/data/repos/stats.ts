/**
 * Training stats repository — records a session's attempts (the moat data,
 * §30) and advances the user's streak + XP. The streak logic is the pure domain
 * function; this just persists its result.
 */
import { eq, sql } from "drizzle-orm";
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

export interface TrainingStats {
  /** % correct over the last 7 days, or null when no answers yet. */
  accuracy: number | null;
  drillsThisWeek: number;
  /** All-time answered positions (drill + review + sparring). */
  cardsReviewed: number;
}

/** Real Insights numbers from the training_events log (never fabricated). */
export async function getTrainingStats(userId: string): Promise<TrainingStats> {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const rows = await db
    .select({ correct: trainingEvents.correct, createdAt: trainingEvents.createdAt, mode: trainingEvents.mode })
    .from(trainingEvents)
    .where(eq(trainingEvents.userId, userId));

  const answered = rows.filter((r) => r.mode !== "dna_test" && r.correct !== null);
  const week = answered.filter((r) => r.createdAt >= weekAgo);
  const weekCorrect = week.filter((r) => r.correct).length;

  return {
    accuracy: week.length > 0 ? Math.round((weekCorrect / week.length) * 100) : null,
    drillsThisWeek: week.length,
    cardsReviewed: answered.length,
  };
}

/**
 * Best (longest) training streak ever, derived from the training_events log —
 * the longest run of consecutive active days (day index = floor(epochMs/86400000),
 * matching the streak domain). Never less than the current streak.
 */
export async function getBestStreak(userId: string, currentStreak: number): Promise<number> {
  const rows = await db
    .selectDistinct({
      day: sql<number>`floor(extract(epoch from ${trainingEvents.createdAt}) / 86400)::int`,
    })
    .from(trainingEvents)
    .where(eq(trainingEvents.userId, userId));

  const days = rows.map((r) => r.day).sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  let prev: number | null = null;
  for (const d of days) {
    run = prev !== null && d === prev + 1 ? run + 1 : 1;
    if (run > best) best = run;
    prev = d;
  }
  return Math.max(best, currentStreak);
}

/**
 * Flat XP bonus for event victories (Guardian defeated). XP only — never IQ
 * (LAW #1: the IQ moves exclusively with measured competence).
 */
export async function awardXpBonus(userId: string, amount: number): Promise<void> {
  await db
    .update(users)
    .set({ xp: sql`${users.xp} + ${amount}`, updatedAt: new Date() })
    .where(eq(users.id, userId));
}
