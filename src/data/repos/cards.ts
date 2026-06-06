/**
 * FSRS card persistence (data layer). A card = the user's memory state for one
 * position (node). Reviews survive across sessions, so the hidden retention
 * engine (LAW #6) is real, not session-local. Cards are keyed by (user, node);
 * nodes are resolved by FEN (seeded by scripts/seed-openings.mjs).
 */
import { and, eq, lte, sql as dsql } from "drizzle-orm";
import { db } from "@/src/data/db";
import { cards, nodes } from "@/db/schema";
import { newCard, reviewCard, type Card } from "@/src/domain/srs/fsrs";

type CardRow = typeof cards.$inferSelect;

function rowToCard(row: CardRow): Card {
  return {
    due: row.dueAt,
    stability: row.stability,
    difficulty: row.difficulty,
    elapsed_days: row.elapsedDays,
    scheduled_days: row.scheduledDays,
    reps: row.reps,
    lapses: row.lapses,
    state: row.state,
    last_review: row.lastReview ?? undefined,
  } as Card;
}

function cardToValues(card: Card) {
  return {
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: card.elapsed_days,
    scheduledDays: card.scheduled_days,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    dueAt: card.due,
    lastReview: card.last_review ?? null,
  };
}

/** Review the user's card for the position at `fen`, creating it on first sight. */
export async function upsertCardReview(
  userId: string,
  fen: string,
  correct: boolean,
  now: Date,
): Promise<void> {
  const node = await db.select({ id: nodes.id }).from(nodes).where(eq(nodes.fen, fen)).limit(1);
  const nodeId = node[0]?.id;
  if (!nodeId) return; // position not in the seeded tree — nothing to persist

  const existing = await db
    .select()
    .from(cards)
    .where(and(eq(cards.userId, userId), eq(cards.nodeId, nodeId)))
    .limit(1);
  const prev = existing[0];

  const reviewed = reviewCard(prev ? rowToCard(prev) : newCard(now), correct, now);
  const values = cardToValues(reviewed);

  if (prev) {
    await db.update(cards).set(values).where(eq(cards.id, prev.id));
  } else {
    await db.insert(cards).values({ userId, nodeId, ...values });
  }
}

/** Number of the user's cards due at `now` — powers the Daily Quest. */
export async function getDueCount(userId: string, now: Date): Promise<number> {
  const rows = await db
    .select({ c: dsql<number>`count(*)::int` })
    .from(cards)
    .where(and(eq(cards.userId, userId), lte(cards.dueAt, now)));
  return rows[0]?.c ?? 0;
}
