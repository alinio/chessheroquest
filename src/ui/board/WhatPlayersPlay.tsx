"use client";

/**
 * "What players play here" — the candidate moves at the current position with
 * REAL popularity percentages from /api/explorer (Lichess data, DB-cached;
 * LAW #2). The move our curated line plays is starred "YOUR LINE"; the rest
 * show what everyone else does. No data → an honest empty state, never a
 * fabricated number.
 */
import { useEffect, useState } from "react";
import { MoveExplorerList, type ExplorerRow } from "@/src/ui/world/MoveExplorerList";
import "@/src/ui/design-system/theme.css";

interface ApiMove {
  san: string;
  games: number;
  pct: number;
}
interface ApiResponse {
  ratingBand: string;
  speeds: string;
  totalGames: number;
  opening: { eco: string; name: string } | null;
  moves: ApiMove[];
}

/** Per-session position cache — a learn line revisits positions on restart. */
const positionCache = new Map<string, ApiResponse>();

const MAX_ROWS = 6;
const compact = new Intl.NumberFormat("en", { notation: "compact" });

export function WhatPlayersPlay({ fen, lineSan }: { fen: string; lineSan?: string }) {
  // null = fetch failed for that fen. The fen key makes stale results inert,
  // so no synchronous setState is needed when the position changes.
  const [fetched, setFetched] = useState<{ fen: string; data: ApiResponse | null } | null>(null);

  useEffect(() => {
    if (positionCache.has(fen)) return; // render reads the cache directly
    let cancelled = false;
    fetch(`/api/explorer?fen=${encodeURIComponent(fen)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as ApiResponse;
      })
      .then((data) => {
        positionCache.set(fen, data);
        if (!cancelled) setFetched({ fen, data });
      })
      .catch(() => {
        if (!cancelled) setFetched({ fen, data: null });
      });
    return () => {
      cancelled = true;
    };
  }, [fen]);

  /** undefined = loading · null = error · ApiResponse = ready */
  const data = positionCache.get(fen) ?? (fetched?.fen === fen ? fetched.data : undefined);

  let body: React.ReactNode;
  let meta: string | null = null;

  if (data === undefined) {
    body = <p className="text-text-low text-sm">Loading player stats…</p>;
  } else if (data === null) {
    // Honest failure — the % either come from Lichess or not at all.
    body = <p className="text-text-low text-sm">Explorer data unavailable right now.</p>;
  } else if (data.moves.length === 0) {
    body = <p className="text-text-low text-sm">No explorer data for this position.</p>;
  } else {
    const top = data.moves.slice(0, MAX_ROWS);
    const rows: ExplorerRow[] = top.map((m) => ({
      san: m.san,
      highlight: m.san === lineSan,
      tag: m.san === lineSan ? { label: "★ YOUR LINE", tone: "gold" as const } : undefined,
      explorer: { popularityPct: m.pct, gamesCount: m.games },
    }));
    // Our line's move below the explorer cut-off (or unplayed at this filter):
    // still shown, with an honest "no data" note instead of an invented %.
    if (lineSan && !top.some((m) => m.san === lineSan)) {
      const deep = data.moves.find((m) => m.san === lineSan);
      rows.push({
        san: lineSan,
        highlight: true,
        tag: { label: "★ YOUR LINE", tone: "gold" },
        ...(deep
          ? { explorer: { popularityPct: deep.pct, gamesCount: deep.games } }
          : { name: "No explorer data for this move" }),
      });
    }
    meta = `Lichess players rated ${data.ratingBand} · ${data.speeds} · ${compact.format(data.totalGames)} games`;
    body = <MoveExplorerList rows={rows} compact ariaLabel="What players play here" />;
  }

  return (
    <section className="flex flex-col gap-2" aria-label="What players play here">
      <h2 className="text-text-low text-xs font-semibold tracking-wide uppercase">
        What players play here
      </h2>
      {body}
      {meta && <p className="text-text-low text-[11px]">{meta}</p>}
    </section>
  );
}
