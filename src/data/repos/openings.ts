/**
 * Opening coverage (data layer) — how many positions of each opening the user has
 * studied (has an FSRS card for). Powers the "collection colours in" progression
 * on the Openings hub (master-vision §10), keyed by path slug.
 */
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/src/data/db";
import { pathTemplates, nodes, cards } from "@/db/schema";
import { retention } from "@/src/domain/srs/fsrs";
import { rowToCard } from "@/src/data/repos/cards";
import { masteryState, type MasteryState } from "@/src/domain/mastery";

export interface OpeningCoverage {
  studied: number;
  total: number;
}

export interface OpeningMastery extends OpeningCoverage {
  state: MasteryState;
}

export async function getOpeningCoverage(
  userId: string,
): Promise<Record<string, OpeningCoverage>> {
  const rows = await db
    .select({
      slug: pathTemplates.slug,
      total: sql<number>`count(distinct ${nodes.id})::int`,
      studied: sql<number>`count(distinct ${cards.nodeId})::int`,
    })
    .from(pathTemplates)
    .innerJoin(nodes, eq(nodes.pathTemplateId, pathTemplates.id))
    .leftJoin(cards, and(eq(cards.nodeId, nodes.id), eq(cards.userId, userId)))
    .groupBy(pathTemplates.slug);

  const out: Record<string, OpeningCoverage> = {};
  for (const r of rows) {
    out[r.slug] = { studied: r.studied, total: r.total };
  }
  return out;
}

/** Coverage + the derived mastery state (kingdom colour) per opening. */
export async function getOpeningMastery(
  userId: string,
): Promise<Record<string, OpeningMastery>> {
  const coverage = await getOpeningCoverage(userId);

  // Average FSRS retention per opening, computed now (decays over time).
  const cardRows = await db
    .select({ card: cards, slug: pathTemplates.slug })
    .from(cards)
    .innerJoin(nodes, eq(nodes.id, cards.nodeId))
    .innerJoin(pathTemplates, eq(pathTemplates.id, nodes.pathTemplateId))
    .where(eq(cards.userId, userId));

  const now = new Date();
  const agg: Record<string, { sum: number; n: number }> = {};
  for (const r of cardRows) {
    const slot = (agg[r.slug] ??= { sum: 0, n: 0 });
    slot.sum += retention(rowToCard(r.card), now);
    slot.n += 1;
  }

  const out: Record<string, OpeningMastery> = {};
  for (const [slug, cov] of Object.entries(coverage)) {
    const a = agg[slug];
    const avgRetention = a && a.n > 0 ? a.sum / a.n : 0;
    out[slug] = { ...cov, state: masteryState(cov.studied, cov.total, avgRetention) };
  }
  return out;
}
