"use client";

import { useState, useSyncExternalStore } from "react";
import "@/src/ui/design-system/theme.css";
import { Button } from "@/src/ui/design-system/Button";
import type { GameResult, OpeningPerf } from "@/src/domain/games/types";
import { useGameSync } from "./useGameSync";

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

export function GameSync() {
  const mounted = useHydrated();
  const { summary, status, error, sync, disconnect } = useGameSync();
  const [username, setUsername] = useState("");

  if (!mounted) return <p style={{ color: "var(--chq-text-muted)" }}>Loading…</p>;

  if (!summary) {
    return (
      <div style={{ maxWidth: 460, margin: "0 auto", textAlign: "center" }}>
        <p className="chq-display chq-gold-text" style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>See the game behind your games</p>
        <p style={{ color: "var(--chq-text-2)", fontSize: 14, lineHeight: 1.6, margin: "10px 0 18px" }}>
          Sync your <b style={{ color: "var(--chq-text-1)" }}>Lichess</b> username to see your real per-opening win rates — and sharpen your Chess DNA result. Public games only; nothing is posted.
        </p>
        <form
          onSubmit={(e) => { e.preventDefault(); sync(username); }}
          style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}
        >
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Lichess username"
            aria-label="Lichess username"
            autoCapitalize="none"
            spellCheck={false}
            style={{ flex: "1 1 220px", minHeight: 46, padding: "0 14px", borderRadius: "var(--chq-r-pill)", background: "var(--chq-raised)", border: "1px solid var(--chq-line)", color: "var(--chq-text-1)", fontSize: 15 }}
          />
          <Button type="submit" disabled={status === "loading" || !username.trim()}>
            {status === "loading" ? "Syncing…" : "Sync games"}
          </Button>
        </form>
        {status === "loading" && <p style={{ color: "var(--chq-text-muted)", fontSize: 12, marginTop: 12 }}>Pulling your last 12 months of rated games…</p>}
        {error && status === "error" && <p style={{ color: "#d1495b", fontSize: 13, marginTop: 12 }}>{error}</p>}
      </div>
    );
  }

  const u = summary.usernames.lichess;
  if (summary.totalGames === 0) {
    return (
      <div style={{ maxWidth: 460, margin: "0 auto", textAlign: "center" }}>
        <p style={{ color: "var(--chq-text-2)", fontSize: 15, lineHeight: 1.6 }}>{summary.emptyReason ?? "No games found."}</p>
        <Button variant="ghost" onClick={disconnect} style={{ margin: "16px auto 0" }}>Try another username</Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
        <p className="chq-display chq-gold-text" style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Your games · {u}</p>
        <span style={{ ...eyebrow, color: "var(--chq-text-muted)", fontSize: 10 }}>{summary.totalGames} rated · Lichess</span>
      </div>

      {/* recent form + color split */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", margin: "14px 0 4px", alignItems: "center" }}>
        <span style={{ ...eyebrow, color: "var(--chq-text-muted)", fontSize: 10 }}>Recent form</span>
        <span style={{ display: "flex", gap: 4 }}>
          {summary.recentForm.map((r, i) => <span key={i} title={r} style={{ width: 9, height: 9, borderRadius: "50%", background: formDot(r) }} />)}
        </span>
        {summary.byColor.map((c) => (
          <span key={c.color} style={{ fontSize: 12, color: "var(--chq-text-2)" }}>
            {c.color === "white" ? "♔" : "♚"} {c.scorePct}% <span style={{ color: "var(--chq-text-muted)" }}>({c.games})</span>
          </span>
        ))}
      </div>

      <p style={{ ...eyebrow, color: "var(--chq-gold-3)", fontSize: 10, marginTop: 16 }}>By opening · score% (W/D/L)</p>
      <div style={{ marginTop: 4 }}>
        {summary.byOpening.map((o) => (
          <PerfRow
            key={o.openingFamily}
            o={o}
            tag={summary.strongest?.openingFamily === o.openingFamily ? { label: "Strongest", tone: "good" } : summary.weakest?.openingFamily === o.openingFamily ? { label: "Focus", tone: "bad" } : undefined}
          />
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
        <Button variant="ghost" onClick={() => sync(u ?? "")}>Re-sync</Button>
        <Button variant="ghost" onClick={disconnect}>Disconnect &amp; delete</Button>
      </div>
      <p style={{ color: "var(--chq-text-muted)", fontSize: 11, marginTop: 10 }}>
        Stored only on this device. “Disconnect &amp; delete” wipes it. {/* TODO: migrate to account on M9; OAuth connect later */}
      </p>
    </div>
  );
}
