"use client";

/**
 * "Your real games" — THE sync section, self-sufficient inside Insights:
 * inline Lichess / Chess.com connect (public usernames, no tokens), synced
 * per-opening results from real rated games, re-sync and disconnect. Real
 * platform data only — the proof-it's-working card (DESIGN.md content voice).
 */
import { useEffect, useState, useSyncExternalStore } from "react";
import { useGameSync } from "@/src/ui/games/useGameSync";

const useHydrated = () =>
  useSyncExternalStore(() => () => {}, () => true, () => false);

const inputStyle = {
  flex: "1 1 150px",
  minWidth: 0,
  minHeight: 40,
  padding: "0 12px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid var(--line-soft)",
  color: "var(--parchment)",
  fontSize: 13,
} as const;

export function RealGamesCard({
  savedUsernames,
}: {
  /** Account-linked usernames (server) — auto-resyncs on a fresh device. */
  savedUsernames?: { lichess?: string | null; chesscom?: string | null };
}) {
  const hydrated = useHydrated();
  const summary = useGameSync((s) => s.summary);
  const status = useGameSync((s) => s.status);
  const error = useGameSync((s) => s.error);
  const sync = useGameSync((s) => s.sync);
  const disconnect = useGameSync((s) => s.disconnect);
  const [lichess, setLichess] = useState("");
  const [chesscom, setChesscom] = useState("");

  // Fresh device / cleared storage but the account knows the usernames →
  // re-pull the public games automatically (real data, no tokens involved).
  useEffect(() => {
    if (!hydrated || summary || status !== "idle") return;
    const li = savedUsernames?.lichess ?? undefined;
    const cc = savedUsernames?.chesscom ?? undefined;
    if (li || cc) void sync({ lichess: li, chesscom: cc });
  }, [hydrated, summary, status, savedUsernames, sync]);

  const top = summary?.byOpening.slice(0, 4) ?? [];
  const loading = status === "loading";

  return (
    <section className="ins-card">
      <p className="ct">Your real games</p>
      {!hydrated || !summary || summary.totalGames === 0 ? (
        <>
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55, margin: "8px 0 12px" }}>
            Enter your Lichess or Chess.com username — we read your <b style={{ color: "var(--parchment)" }}>public rated games</b> (last
            12 months) and score every opening you actually play. No password, no account link.
          </p>
          <form
            style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}
            onSubmit={(e) => {
              e.preventDefault();
              if (lichess.trim() || chesscom.trim()) void sync({ lichess, chesscom });
            }}
          >
            <input
              style={inputStyle}
              placeholder="Lichess username"
              value={lichess}
              onChange={(e) => setLichess(e.target.value)}
              disabled={loading}
              aria-label="Lichess username"
            />
            <input
              style={inputStyle}
              placeholder="Chess.com username"
              value={chesscom}
              onChange={(e) => setChesscom(e.target.value)}
              disabled={loading}
              aria-label="Chess.com username"
            />
            <button
              type="submit"
              className="btn-ghost sm"
              disabled={loading || (!lichess.trim() && !chesscom.trim())}
              style={{ minHeight: 40 }}
            >
              {loading ? "Syncing…" : "Sync my games →"}
            </button>
          </form>
          {loading && (
            <p style={{ color: "var(--faint)", fontSize: 12, marginTop: 10 }} aria-live="polite">
              Reading your rated games — up to a minute for active players.
            </p>
          )}
          {error && (
            <p style={{ color: "#e0726b", fontSize: 12, marginTop: 10 }} aria-live="polite">{error}</p>
          )}
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
            <span style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button
                type="button"
                className="btn-ghost sm"
                disabled={loading}
                onClick={() => void sync({ lichess: summary.usernames.lichess, chesscom: summary.usernames.chesscom })}
              >
                {loading ? "Syncing…" : "Re-sync"}
              </button>
              <button type="button" className="btn-ghost sm" onClick={disconnect}>Disconnect</button>
            </span>
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
            {summary.totalGames} rated games · last 12 months · public data only
          </p>
        </>
      )}
    </section>
  );
}
