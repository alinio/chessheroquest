"use client";

/**
 * "At the board" — Profile proof card. Reads the game-sync store (real rated
 * games from Lichess/Chess.com) and names the player's BEST opening on real
 * boards. Acquired facts only: renders nothing until games are synced — the
 * connect flow lives in Insights, never duplicated here.
 */
import { useEffect, useSyncExternalStore } from "react";
import { useGameSync } from "@/src/ui/games/useGameSync";

const useHydrated = () =>
  useSyncExternalStore(() => () => {}, () => true, () => false);

export function AtTheBoardCard({
  savedUsernames,
}: {
  savedUsernames?: { lichess?: string | null; chesscom?: string | null };
}) {
  const hydrated = useHydrated();
  const summary = useGameSync((s) => s.summary);
  const status = useGameSync((s) => s.status);
  const sync = useGameSync((s) => s.sync);

  // Fresh device, known usernames → re-pull public games (same as Insights).
  useEffect(() => {
    if (!hydrated || summary || status !== "idle") return;
    const li = savedUsernames?.lichess ?? undefined;
    const cc = savedUsernames?.chesscom ?? undefined;
    if (li || cc) void sync({ lichess: li, chesscom: cc });
  }, [hydrated, summary, status, savedUsernames, sync]);

  if (!hydrated || !summary || summary.totalGames === 0) return null;

  // Best opening on real boards: highest score among meaningfully-played
  // openings (≥5 games), falling back to the most-played one.
  const meaningful = summary.byOpening.filter((o) => o.games >= 5);
  const pool = meaningful.length > 0 ? meaningful : summary.byOpening;
  const best = [...pool].sort((a, b) => b.scorePct - a.scorePct)[0];
  if (!best) return null;

  return (
    <section className="pf-card">
      <p className="ct">At the board</p>
      <p className="pf-board-line">
        Your <b>{best.openingFamily}</b> scores <b>{best.scorePct}%</b> over{" "}
        {best.games} rated games.
      </p>
      <p className="pf-board-foot">
        Tracked from your synced real games — proof it&apos;s working.
      </p>
    </section>
  );
}
