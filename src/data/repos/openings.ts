/**
 * Opening coverage (data layer) — how many positions of each opening the user has
 * studied (has an FSRS card for). Powers the "collection colours in" progression
 * on the Openings hub (master-vision §10), keyed by path slug.
 */
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/src/data/db";
import { pathTemplates, nodes, cards } from "@/db/schema";

export interface OpeningCoverage {
  studied: number;
  total: number;
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
