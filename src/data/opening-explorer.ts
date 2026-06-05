/**
 * Opening Explorer service — the cache-first entry point the rest of the app
 * uses. Hits Lichess only on a cache miss, then persists the response. Keeps the
 * truth source (LAW #2) behind one function so callers never fetch directly.
 */
import {
  fetchOpeningExplorer,
  mostPlayedMove,
  rankedMoves,
  type ExplorerOptions,
  type ExplorerResponse,
  type RankedMove,
} from "@/src/data/lichess";
import {
  explorerCacheKey,
  readExplorerCache,
  writeExplorerCache,
} from "@/src/data/repos/explorer-cache";

/** Cache-first Opening Explorer read. */
export async function getOpeningExplorer(
  fen: string,
  opts: ExplorerOptions = {},
): Promise<ExplorerResponse> {
  const key = explorerCacheKey(fen, opts);
  const cached = await readExplorerCache(key);
  if (cached) return cached;

  const data = await fetchOpeningExplorer(fen, opts);
  await writeExplorerCache(key, fen, data);
  return data;
}

/** The most-played ("correct") move for a position, cache-first. */
export async function getMostPlayedMove(
  fen: string,
  opts: ExplorerOptions = {},
): Promise<RankedMove | null> {
  return mostPlayedMove(await getOpeningExplorer(fen, opts));
}

export { rankedMoves };
