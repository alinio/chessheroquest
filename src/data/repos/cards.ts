/**
 * FSRS card persistence (data layer). A card = the user's memory state for one
 * position (node). Reviews survive across sessions, so the hidden retention
 * engine (LAW #6) is real, not session-local. Cards are keyed by (user, node);
 * nodes are resolved by FEN (seeded by scripts/seed-openings.mjs).
 */
import { and, asc, eq, lte, sql as dsql } from "drizzle-orm";
import { db } from "@/src/data/db";
import { cards, nodes, pathTemplates } from "@/db/schema";
import { newCard, reviewCard, type Card } from "@/src/domain/srs/fsrs";

export type CardRow = typeof cards.$inferSelect;

export function rowToCard(row: CardRow): Card {
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

export interface DueCard {
  fen: string;
  /** The move to recall from this position (SAN). */
  expected: string;
  /** Opening this position belongs to. */
  opening: string;
}

/** The user's due cards (across all openings), soonest-due first — the Daily Quest. */
export async function getDueCards(
  userId: string,
  now: Date,
  limit = 10,
): Promise<DueCard[]> {
  const rows = await db
    .select({ fen: nodes.fen, move: nodes.move, opening: pathTemplates.name })
    .from(cards)
    .innerJoin(nodes, eq(nodes.id, cards.nodeId))
    .innerJoin(pathTemplates, eq(pathTemplates.id, nodes.pathTemplateId))
    .where(and(eq(cards.userId, userId), lte(cards.dueAt, now)))
    .orderBy(asc(cards.dueAt))
    .limit(limit);

  return rows
    .filter((r) => r.move)
    .map((r) => ({ fen: r.fen, expected: r.move!, opening: r.opening }));
}

/** Curated path slugs with at least one due card — the per-line "due today". */
export async function getDueSlugs(userId: string, now: Date): Promise<Set<string>> {
  const rows = await db
    .select({ slug: pathTemplates.slug })
    .from(cards)
    .innerJoin(nodes, eq(nodes.id, cards.nodeId))
    .innerJoin(pathTemplates, eq(pathTemplates.id, nodes.pathTemplateId))
    .where(and(eq(cards.userId, userId), lte(cards.dueAt, now)))
    .groupBy(pathTemplates.slug);
  return new Set(rows.map((r) => r.slug));
}

/** Number of the user's cards due at `now` — powers the Daily Quest. */
export async function getDueCount(userId: string, now: Date): Promise<number> {
  const rows = await db
    .select({ c: dsql<number>`count(*)::int` })
    .from(cards)
    .where(and(eq(cards.userId, userId), lte(cards.dueAt, now)));
  return rows[0]?.c ?? 0;
}
