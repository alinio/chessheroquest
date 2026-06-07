/**
 * GET /api/lichess/sync?username=… — pull a user's public rated games from Lichess
 * and return an aggregated PlayerProfileSummary. Runs server-side (UA + rate limits).
 * Not found / no games → 200 with an empty summary (emptyReason). Real data only.
 */
import { NextResponse } from "next/server";
import { lichessSource, SyncError } from "@/src/domain/games/lichess";
import { aggregate } from "@/src/domain/games/aggregate";
import { DEFAULT_SYNC_OPTIONS } from "@/src/domain/games/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: Request) {
  const username = (new URL(req.url).searchParams.get("username") ?? "").trim();
  if (!username) return NextResponse.json({ error: "username required" }, { status: 400 });

  try {
    const games = await lichessSource.fetchGames(username, DEFAULT_SYNC_OPTIONS);
    const summary = aggregate(games, {
      usernames: { lichess: username },
      sources: ["lichess"],
      emptyReason: "No public rated games found in the last 12 months.",
    });
    return NextResponse.json(summary);
  } catch (e) {
    if (e instanceof SyncError && e.code === "not_found") {
      const empty = aggregate([], {
        usernames: { lichess: username },
        sources: ["lichess"],
        emptyReason: `No Lichess account “${username}” found, or it has no public rated games.`,
      });
      return NextResponse.json(empty);
    }
    if (e instanceof SyncError && e.code === "rate_limited") {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }
    return NextResponse.json({ error: "sync_failed" }, { status: 502 });
  }
}
