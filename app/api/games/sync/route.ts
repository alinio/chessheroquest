/**
 * GET /api/games/sync?lichess=<user>&chesscom=<user> — sync one or both platforms
 * and return a merged PlayerProfileSummary (the user's OWN results combine across
 * platforms). One source failing doesn't block the other (note recorded). Real
 * data only; all-empty → empty summary with reasons.
 *
 * Note: Lichess and Chess.com ratings are NOT equivalent — per-opening OWN results
 * merge fine, but any rating-band/peer comparison must stay per-platform/labelled.
 */
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/data/db";
import { users } from "@/db/schema";
import { lichessSource, SyncError } from "@/src/domain/games/lichess";
import { chesscomSource } from "@/src/domain/games/chesscom";
import { mergeSummaries, aggregate } from "@/src/domain/games/aggregate";
import { DEFAULT_SYNC_OPTIONS, type GameSource, type NormalizedGame, type Platform } from "@/src/domain/games/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const lichess = (sp.get("lichess") ?? "").trim();
  const chesscom = (sp.get("chesscom") ?? "").trim();
  if (!lichess && !chesscom) return NextResponse.json({ error: "username required" }, { status: 400 });

  const parts: { games: NormalizedGame[]; username: string; platform: Platform }[] = [];
  const notes: string[] = [];

  const pull = async (source: GameSource, username: string) => {
    try {
      const games = await source.fetchGames(username, DEFAULT_SYNC_OPTIONS);
      parts.push({ games, username, platform: source.platform });
    } catch (e) {
      if (e instanceof SyncError && e.code === "not_found") notes.push(`No ${source.platform} account “${username}” (or no public games).`);
      else if (e instanceof SyncError && e.code === "rate_limited") notes.push(`${source.platform} is rate-limiting — try again shortly.`);
      else notes.push(`${source.platform} sync failed — try again.`);
    }
  };

  if (lichess) await pull(lichessSource, lichess);
  if (chesscom) await pull(chesscomSource, chesscom);

  if (parts.length === 0) {
    const usernames: Partial<Record<Platform, string>> = {};
    if (lichess) usernames.lichess = lichess;
    if (chesscom) usernames.chesscom = chesscom;
    return NextResponse.json(aggregate([], { usernames, sources: [], emptyReason: notes.join(" ") || "No games found." }));
  }

  const summary = mergeSummaries(parts);
  if (notes.length) summary.notes = notes;

  // Signed-in players: remember the linked usernames on the account so the
  // sync follows them across devices (public usernames only — no tokens).
  const session = await auth();
  if (session?.user?.id) {
    const linked: Partial<{ lichessUsername: string; chesscomUsername: string }> = {};
    for (const part of parts) {
      if (part.platform === "lichess") linked.lichessUsername = part.username;
      if (part.platform === "chesscom") linked.chesscomUsername = part.username;
    }
    if (Object.keys(linked).length > 0) {
      await db
        .update(users)
        .set({ ...linked, updatedAt: new Date() })
        .where(eq(users.id, session.user.id));
    }
  }

  return NextResponse.json(summary);
}
