/**
 * Lichess Opening Explorer client — the PRIMARY opening database and a TRUTH
 * source (CLAUDE.md LAW #2). Free, public, no API key. We query the `lichess`
 * database filtered to our sub-1500 audience and treat the MOST-PLAYED move as
 * "the right opening move" (the product's chosen definition of correct).
 *
 * Server-side + cached (see opening-explorer.ts): positions are finite and
 * shared, so cached marginal cost → ~0, and we respect Lichess rate limits +
 * attribution. The response is Zod-validated at this boundary.
 *
 * NOTE: live calls go out to explorer.lichess.org (the hostname per the current
 * Lichess API spec; the old explorer.lichess.ovh now 401s). Since the 2026-02
 * OVH incident the explorer REQUIRES an OAuth bearer token — set
 * LICHESS_API_TOKEN (free personal token, lichess.org/account/oauth/token).
 * Parsing + ranking here are covered by an offline fixture test.
 */
import { z } from "zod";

const EXPLORER_BASE = "https://explorer.lichess.org/lichess";

/** Default audience filter (decision: lichess DB, 1000–1600, blitz+rapid). */
export const EXPLORER_DEFAULTS = {
  ratings: [1000, 1200, 1400, 1600] as number[],
  speeds: ["blitz", "rapid"] as string[],
  moves: 12,
} as const;

export interface ExplorerOptions {
  ratings?: number[];
  speeds?: string[];
  /** Max distinct moves to return. */
  moves?: number;
}

const ExplorerMoveSchema = z.object({
  uci: z.string(),
  san: z.string(),
  white: z.number().int().nonnegative(),
  draws: z.number().int().nonnegative(),
  black: z.number().int().nonnegative(),
  averageRating: z.number().int().nullable().optional(),
});

export const ExplorerResponseSchema = z.object({
  white: z.number().int().nonnegative(),
  draws: z.number().int().nonnegative(),
  black: z.number().int().nonnegative(),
  moves: z.array(ExplorerMoveSchema),
  opening: z.object({ eco: z.string(), name: z.string() }).nullable().optional(),
});

export type ExplorerMove = z.infer<typeof ExplorerMoveSchema>;
export type ExplorerResponse = z.infer<typeof ExplorerResponseSchema>;

export interface RankedMove {
  san: string;
  uci: string;
  /** Total games in which this move was played, at the requested filter. */
  games: number;
  /** Share of listed games (0–1). */
  frequency: number;
  /** Result shares from the mover's perspective is not assumed — raw shares. */
  whiteShare: number;
  drawShare: number;
  blackShare: number;
}

/** Build the Explorer request URL (pure — handy for tests + cache keys). */
export function explorerUrl(fen: string, opts: ExplorerOptions = {}): string {
  const { ratings, speeds, moves } = { ...EXPLORER_DEFAULTS, ...opts };
  const url = new URL(EXPLORER_BASE);
  url.searchParams.set("variant", "standard");
  url.searchParams.set("fen", fen);
  url.searchParams.set("ratings", ratings.join(","));
  url.searchParams.set("speeds", speeds.join(","));
  url.searchParams.set("moves", String(moves));
  url.searchParams.set("topGames", "0");
  url.searchParams.set("recentGames", "0");
  return url.toString();
}

/** Moves sorted by real popularity (most-played first). Pure — testable offline. */
export function rankedMoves(data: ExplorerResponse): RankedMove[] {
  const withGames = data.moves.map((m) => ({ m, games: m.white + m.draws + m.black }));
  const denom = withGames.reduce((s, x) => s + x.games, 0);
  return withGames
    .map(({ m, games }) => ({
      san: m.san,
      uci: m.uci,
      games,
      frequency: denom === 0 ? 0 : games / denom,
      whiteShare: games === 0 ? 0 : m.white / games,
      drawShare: games === 0 ? 0 : m.draws / games,
      blackShare: games === 0 ? 0 : m.black / games,
    }))
    .sort((a, b) => b.games - a.games);
}

/**
 * The product's "correct" opening move for a position: the most-played one.
 * Returns null if Lichess has no data for the position.
 */
export function mostPlayedMove(data: ExplorerResponse): RankedMove | null {
  return rankedMoves(data)[0] ?? null;
}

/** Live fetch + Zod-validate. Prefer the cached service in opening-explorer.ts. */
export async function fetchOpeningExplorer(
  fen: string,
  opts: ExplorerOptions = {},
): Promise<ExplorerResponse> {
  const token = process.env.LICHESS_API_TOKEN;
  const res = await fetch(explorerUrl(fen, opts), {
    headers: {
      // Lichess asks API users to identify themselves.
      "User-Agent": "ChessHeroQuest/0.1 (+https://chessheroquest.com)",
      // Required since 2026-02: unauthenticated explorer requests get 401.
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Lichess Opening Explorer error: HTTP ${res.status}`);
  }
  return ExplorerResponseSchema.parse(await res.json());
}
