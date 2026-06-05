/**
 * Postgres cache for Lichess Opening Explorer responses (repos layer).
 * Keyed by a hash of the exact request URL (fen + audience filter).
 */
import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/src/data/db";
import { lichessExplorerCache } from "@/db/schema";
import {
  ExplorerResponseSchema,
  explorerUrl,
  type ExplorerOptions,
  type ExplorerResponse,
} from "@/src/data/lichess";

export function explorerCacheKey(fen: string, opts: ExplorerOptions = {}): string {
  return createHash("sha1").update(explorerUrl(fen, opts)).digest("hex");
}

export async function readExplorerCache(key: string): Promise<ExplorerResponse | null> {
  const rows = await db
    .select()
    .from(lichessExplorerCache)
    .where(eq(lichessExplorerCache.cacheKey, key))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  // Re-validate at the boundary: cached JSON is still untrusted input.
  const parsed = ExplorerResponseSchema.safeParse(row.response);
  return parsed.success ? parsed.data : null;
}

export async function writeExplorerCache(
  key: string,
  fen: string,
  response: ExplorerResponse,
): Promise<void> {
  await db
    .insert(lichessExplorerCache)
    .values({ cacheKey: key, fen, response })
    .onConflictDoNothing({ target: lichessExplorerCache.cacheKey });
}
