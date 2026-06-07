"use client";

import { useState, useSyncExternalStore } from "react";
import "@/src/ui/design-system/theme.css";
import { Button } from "@/src/ui/design-system/Button";
import type { GameResult, OpeningPerf } from "@/src/domain/games/types";
import { useGameSync } from "./useGameSync";

type PlatformChoice = "lichess" | "chesscom" | "both";

const eyebrow = { fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase" } as const;
function useHydrated() {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}
const formDot = (r: GameResult) => (r === "win" ? "#3fb371" : r === "draw" ? "var(--chq-text-muted)" : "#d1495b");

function PerfRow({ o, tag }: { o: OpeningPerf; tag?: { label: string; tone: "good" | "bad" } }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
      <span style={{ flex: "0 0 150px", fontSize: 13, color: "var(--chq-text-1)", display: "flex", alignItems: "center", gap: 6 }}>
        {o.openingFamily}
        {tag && <span style={{ ...eyebrow, fontSize: 7.5, padding: "1px 5px", borderRadius: 999, fontWeight: 700, color: "#08080A", background: tag.tone === "good" ? "#3fb371" : "#e0a13b" }}>{tag.label}</span>}
      </span>
      <div style={{ flex: 1, height: 8, borderRadius: 4, background: "var(--chq-panel)", overflow: "hidden", minWidth: 60 }}>
        <div style={{ width: `${o.scorePct}%`, height: "100%", background: "var(--chq-gold-gradient)" }} />
      </div>
      <span style={{ flex: "0 0 44px", textAlign: "right", fontSize: 13, color: "var(--chq-gold-2)", fontWeight: 600 }}>{o.scorePct}%</span>
      <span style={{ flex: "0 0 74px", textAlign: "right", fontSize: 11, color: "var(--chq-text-muted)" }}>{o.wins}/{o.draws}/{o.losses}</span>
    </div>
  );
}

const inputStyle = { flex: "1 1 200px", minHeight: 46, padding: "0 14px", borderRadius: "var(--chq-r-pill)", background: "var(--chq-raised)", border: "1px solid var(--chq-line)", color: "var(--chq-text-1)", fontSize: 15 } as const;

export function GameSync() {
  const mounted = useHydrated();
  const { summary, status, error, sync, disconnect } = useGameSync();
  const [platform, setPlatform] = useState<PlatformChoice>("lichess");
  const [lichess, setLichess] = useState("");
  const [chesscom, setChesscom] = useState("");

  if (!mounted) return <p style={{ color: "var(--chq-text-muted)" }}>Loading…</p>;

  const doSync = () =>
    sync({
      lichess: platform !== "chesscom" ? lichess : undefined,
      chesscom: platform !== "lichess" ? chesscom : undefined,
    });
  const canSync = (platform !== "chesscom" && lichess.trim()) || (platform !== "lichess" && chesscom.trim());

  if (!summary) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <p className="chq-display chq-gold-text" style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>See the game behind your games</p>
        <p style={{ color: "var(--chq-text-2)", fontSize: 14, lineHeight: 1.6, margin: "10px 0 16px" }}>
          Sync your real games to see your per-opening win rates and sharpen your Chess DNA. Public games only; nothing is posted.
        </p>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <div className="chq-seg" role="tablist" aria-label="Platform">
            <button type="button" data-active={platform === "lichess"} onClick={() => setPlatform("lichess")}>Lichess</button>
            <button type="button" data-active={platform === "chesscom"} onClick={() => setPlatform("chesscom")}>Chess.com</button>
            <button type="button" data-active={platform === "both"} onClick={() => setPlatform("both")}>Both</button>
          </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); doSync(); }} style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {platform !== "chesscom" && <input value={lichess} onChange={(e) => setLichess(e.target.value)} placeholder="Lichess username" aria-label="Lichess username" autoCapitalize="none" spellCheck={false} style={inputStyle} />}
          {platform !== "lichess" && <input value={chesscom} onChange={(e) => setChesscom(e.target.value)} placeholder="Chess.com username" aria-label="Chess.com username" autoCapitalize="none" spellCheck={false} style={inputStyle} />}
          <Button type="submit" disabled={status === "loading" || !canSync}>{status === "loading" ? "Syncing…" : "Sync games"}</Button>
        </form>
        {status === "loading" && <p style={{ color: "var(--chq-text-muted)", fontSize: 12, marginTop: 12 }}>Pulling your last 12 months of rated games…</p>}
        {error && status === "error" && <p style={{ color: "#d1495b", fontSize: 13, marginTop: 12 }}>{error}</p>}
      </div>
    );
  }

  if (summary.totalGames === 0) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <p style={{ color: "var(--chq-text-2)", fontSize: 15, lineHeight: 1.6 }}>{summary.emptyReason ?? "No games found."}</p>
        <Button variant="ghost" onClick={disconnect} style={{ margin: "16px auto 0" }}>Try again</Button>
      </div>
    );
  }

  const who = summary.sources.map((p) => `${p === "lichess" ? "Lichess" : "Chess.com"} · ${summary.usernames[p]}`).join("  +  ");
  return (
    <div style={{ maxWidth: 580, margin: "0 auto", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
        <p className="chq-display chq-gold-text" style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Your games</p>
        <span style={{ ...eyebrow, color: "var(--chq-text-muted)", fontSize: 10 }}>{summary.totalGames} rated · {who}</span>
      </div>

      {summary.notes?.map((n) => <p key={n} style={{ color: "var(--chq-gold-3)", fontSize: 12, marginTop: 8 }}>⚠ {n}</p>)}

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", margin: "14px 0 4px", alignItems: "center" }}>
        <span style={{ ...eyebrow, color: "var(--chq-text-muted)", fontSize: 10 }}>Recent form</span>
        <span style={{ display: "flex", gap: 4 }}>{summary.recentForm.map((r, i) => <span key={i} title={r} style={{ width: 9, height: 9, borderRadius: "50%", background: formDot(r) }} />)}</span>
        {summary.byColor.map((c) => (
          <span key={c.color} style={{ fontSize: 12, color: "var(--chq-text-2)" }}>{c.color === "white" ? "♔" : "♚"} {c.scorePct}% <span style={{ color: "var(--chq-text-muted)" }}>({c.games})</span></span>
        ))}
      </div>

      <p style={{ ...eyebrow, color: "var(--chq-gold-3)", fontSize: 10, marginTop: 16 }}>By opening · score% (W/D/L)</p>
      <div style={{ marginTop: 4 }}>
        {summary.byOpening.map((o) => (
          <PerfRow key={o.openingFamily} o={o} tag={summary.strongest?.openingFamily === o.openingFamily ? { label: "Strongest", tone: "good" } : summary.weakest?.openingFamily === o.openingFamily ? { label: "Focus", tone: "bad" } : undefined} />
        ))}
      </div>

      {summary.sources.length > 1 && (
        <p style={{ color: "var(--chq-text-muted)", fontSize: 11, marginTop: 12 }}>Your own results merge across platforms. Note: Lichess and Chess.com ratings aren&apos;t equivalent, so we don&apos;t blend rating bands.</p>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
        <Button variant="ghost" onClick={() => sync(summary.usernames)}>Re-sync</Button>
        <Button variant="ghost" onClick={disconnect}>Disconnect &amp; delete</Button>
      </div>
      <p style={{ color: "var(--chq-text-muted)", fontSize: 11, marginTop: 10 }}>Stored only on this device. {/* TODO: migrate to account on M9; OAuth connect later */}</p>
    </div>
  );
}
