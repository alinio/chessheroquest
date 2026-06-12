/**
 * GET /api/explorer?fen=… — real player-choice stats for a position (LAW #2).
 * Single truth source: the cache-first Opening Explorer service (Postgres cache,
 * Lichess on miss — src/data/opening-explorer.ts). Percentages are computed from
 * the REAL game counts; nothing here is authored or invented. An empty `moves`
 * array means Lichess has no data for the position — the UI must say so.
 */
import { NextResponse } from "next/server";
import { Chess } from "chess.js";
import { getOpeningExplorer, rankedMoves } from "@/src/data/opening-explorer";

/**
 * Human label for EXPLORER_DEFAULTS.ratings = [1000,1200,1400,1600]: Lichess
 * rating buckets are lower bounds (1600 covers 1600–1800), so the audience
 * actually spanned is 1000–1800.
 */
const RATING_BAND_LABEL = "1000–1800";

export async function GET(request: Request) {
  const fen = new URL(request.url).searchParams.get("fen");
  if (!fen) {
    return NextResponse.json({ error: "Missing fen" }, { status: 400 });
  }
  try {
    new Chess(fen); // chess.js is the legality gate — reject garbage early
  } catch {
    return NextResponse.json({ error: "Invalid FEN" }, { status: 400 });
  }

  try {
    const data = await getOpeningExplorer(fen);
    const ranked = rankedMoves(data);
    const totalGames = ranked.reduce((s, m) => s + m.games, 0);
    return NextResponse.json(
      {
        fen,
        ratingBand: RATING_BAND_LABEL,
        speeds: "blitz & rapid",
        totalGames,
        opening: data.opening ?? null,
        moves: ranked.map((m) => ({
          san: m.san,
          games: m.games,
          // One decimal of real precision — rounded, never padded.
          pct: Math.round(m.frequency * 1000) / 10,
        })),
      },
      // Opening stats drift slowly; the DB cache behind this never expires.
      { headers: { "cache-control": "public, max-age=86400" } },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Explorer unavailable" },
      { status: 502 },
    );
  }
}
