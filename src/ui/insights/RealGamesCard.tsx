"use client";

/**
 * "Your real games" — renders the SYNCED Lichess/Chess.com summary from the
 * game-sync store (real platform data only). No sync yet → honest empty state
 * with the Connect CTA. The proof-it's-working card (DESIGN.md content voice).
 */
import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { useGameSync } from "@/src/ui/games/useGameSync";

const useHydrated = () =>
  useSyncExternalStore(() => () => {}, () => true, () => false);

export function RealGamesCard({
  savedUsernames,
}: {
  /** Account-linked usernames (server) — auto-resyncs on a fresh device. */
  savedUsernames?: { lichess?: string | null; chesscom?: string | null };
}) {
  const hydrated = useHydrated();
  const summary = useGameSync((s) => s.summary);
  const status = useGameSync((s) => s.status);
  const sync = useGameSync((s) => s.sync);

  // Fresh device / cleared storage but the account knows the usernames →
  // re-pull the public games automatically (real data, no tokens involved).
  useEffect(() => {
    if (!hydrated || summary || status !== "idle") return;
    const lichess = savedUsernames?.lichess ?? undefined;
    const chesscom = savedUsernames?.chesscom ?? undefined;
    if (lichess || chesscom) void sync({ lichess, chesscom });
  }, [hydrated, summary, status, savedUsernames, sync]);

  const top = summary?.byOpening.slice(0, 4) ?? [];

  return (
    <section className="ins-card">
      <p className="ct">Your real games</p>
      {!hydrated || !summary || summary.totalGames === 0 ? (
        <>
          <div className="conn">{status === "loading" ? "Syncing your games…" : "No platform connected"}</div>
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55, margin: "6px 0 14px" }}>
            Connect Lichess or Chess.com to measure your openings on real games —
            proof your training is working.
          </p>
          <Link className="btn-ghost sm" href="/sync">Connect your games →</Link>
        </>
      ) : (
        <>
          <div className="conn">
            {summary.sources.map((p) => (
              <span key={p}>
                <span className="badge">{p === "lichess" ? "Lichess" : "Chess.com"}</span>{" "}
                @{summary.usernames[p]}
              </span>
            ))}
            <Link className="btn-ghost sm" href="/sync" style={{ marginLeft: "auto" }}>Re-sync</Link>
          </div>
          <div className="perf">
            {top.map((o) => (
              <div className="perf-row" key={o.openingFamily}>
                <span className="nm">{o.openingFamily}</span>
                <span className="gm">{o.games} games</span>
                <span className={`wr ${o.scorePct >= 55 ? "up" : o.scorePct < 48 ? "down" : "flat"}`}>
                  {o.scorePct}%
                </span>
              </div>
            ))}
          </div>
          <p style={{ color: "var(--faint)", fontSize: 11, marginTop: 10 }}>
            {summary.totalGames} rated games · last 12 months
          </p>
        </>
      )}
    </section>
  );
}
