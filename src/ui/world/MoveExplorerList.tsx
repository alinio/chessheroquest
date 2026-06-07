"use client";

/**
 * Reusable explorer-style candidate-move list (chess-curation-spec §5b), reskinned
 * to our gold-on-obsidian identity (NOT a green Chessbook clone). Used by the Learn
 * flow (clickable candidates that branch the board) and by the DNA test as
 * POST-ANSWER enrichment (read-only option stats). Stats come only from snapshotted
 * `explorer` data; rows without it simply omit the numbers (never fabricated).
 */
import type { CSSProperties } from "react";
import type { ExplorerStats } from "@/src/domain/world/explorer";

export interface ExplorerRow {
  san: string;
  name: string;
  explain?: string;
  explorer?: ExplorerStats;
  /** Main-line / best move — visually emphasised. */
  highlight?: boolean;
  tag?: { label: string; tone?: "gold" | "good" | "bad" };
  onClick?: () => void;
}

const eyebrow = { fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase" } as const;

function tagBg(tone?: "gold" | "good" | "bad") {
  if (tone === "bad") return "#d1495b";
  if (tone === "good") return "#3fb371";
  return "var(--chq-gold-gradient)";
}

export function MoveExplorerList({ rows, compact = false, ariaLabel = "Candidate moves" }: { rows: ExplorerRow[]; compact?: boolean; ariaLabel?: string }) {
  return (
    <div role="list" aria-label={ariaLabel} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {rows.map((r, i) => {
        const pop = r.explorer?.popularityPct;
        const interactive = Boolean(r.onClick);
        const common: CSSProperties = {
          display: "grid",
          gridTemplateColumns: "52px 1fr auto",
          gap: 10,
          alignItems: "center",
          width: "100%",
          textAlign: "left",
          padding: compact ? "9px 11px" : "11px 13px",
          borderRadius: "var(--chq-r-panel)",
          cursor: interactive ? "pointer" : "default",
          background: r.highlight ? "rgba(217,162,39,.10)" : "var(--chq-panel)",
          border: `1px solid ${r.highlight ? "var(--chq-gold-4)" : "var(--chq-line)"}`,
        };
        const inner = (
          <>
            <span className="chq-display" style={{ fontSize: 16, fontWeight: 700, color: r.highlight ? "var(--chq-gold-2)" : "var(--chq-text-1)", whiteSpace: "nowrap" }}>{r.san}</span>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--chq-text-1)" }}>{r.name}</span>
                {r.tag && <span style={{ ...eyebrow, fontSize: 8, padding: "2px 6px", borderRadius: 999, fontWeight: 700, color: "#08080A", background: tagBg(r.tag.tone) }}>{r.tag.label}</span>}
              </span>
              {!compact && r.explain && <span style={{ display: "block", fontSize: 12, color: "var(--chq-text-2)", lineHeight: 1.4, marginTop: 3 }}>{r.explain}</span>}
              {pop != null && (
                <span style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 5 }}>
                  <span style={{ flex: 1, maxWidth: 130, height: 5, borderRadius: 3, background: "var(--chq-raised)", overflow: "hidden" }}>
                    <span style={{ display: "block", width: `${pop}%`, height: "100%", background: "var(--chq-gold-gradient)" }} />
                  </span>
                  <span style={{ fontSize: 11, color: "var(--chq-text-2)", whiteSpace: "nowrap" }}>{pop}% play this</span>
                </span>
              )}
            </span>
            <span style={{ fontSize: 12, color: "var(--chq-text-muted)", whiteSpace: "nowrap", justifySelf: "end" }}>
              {r.explorer?.eval ? `engine ${r.explorer.eval}` : "—"}
            </span>
          </>
        );
        return interactive ? (
          <button key={`${r.san}-${i}`} type="button" onClick={r.onClick} style={common}>{inner}</button>
        ) : (
          <div key={`${r.san}-${i}`} role="listitem" style={common}>{inner}</div>
        );
      })}
    </div>
  );
}
