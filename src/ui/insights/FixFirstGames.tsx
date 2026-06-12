"use client";

/**
 * Real-games cross-reference for the "Fix first" leak: if the player has synced
 * games in this opening family, say how often they played it and their score.
 * The synced summary lives in the CLIENT game-sync store (zustand persist) —
 * cross-referencing client-side is the simplest truthful join (no server copy
 * of the summary exists). Renders nothing when there is no synced match.
 */
import { useSyncExternalStore } from "react";
import { useGameSync } from "@/src/ui/games/useGameSync";

const useHydrated = () =>
  useSyncExternalStore(() => () => {}, () => true, () => false);

export function FixFirstGames({ family }: { family: string }) {
  const hydrated = useHydrated();
  const summary = useGameSync((s) => s.summary);
  if (!hydrated || !summary) return null;

  const match = summary.byOpening.find((o) => o.openingFamily === family);
  if (!match || match.games === 0) return null;

  return (
    <p style={{ color: "var(--muted)", fontSize: 12.5, lineHeight: 1.55, margin: 0 }}>
      You played it {match.games} time{match.games === 1 ? "" : "s"} this year — scoring{" "}
      <b style={{ color: match.scorePct < 48 ? "#e0726b" : "var(--parchment)" }}>{match.scorePct}%</b>.
    </p>
  );
}
