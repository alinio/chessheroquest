"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import type { CSSProperties } from "react";
import type { PieceDropHandlerArgs } from "react-chessboard";
import { Board } from "./Board";
import type { CuratedPath } from "@/src/domain/repertoire/types";
import { expectedMoveAt } from "@/src/domain/repertoire/line";
import { CoachSheet } from "@/src/ui/screens/CoachSheet";

type Feedback = "idle" | "correct" | "wrong";
interface CoachState {
  open: boolean;
  loading: boolean;
  text: string | null;
}

/** Standard initial position FEN — computed once, never read from a ref in render. */
const STARTING_FEN = new Chess().fen();

/**
 * Walk a curated line: the player must find each mainline move in turn.
 * Move legality and SAN come from chess.js — the engine is the truth (LAW #2);
 * the component holds only UI state. The mutable game lives in a ref so chess.js
 * stays the single source of board truth across renders.
 */
export function LineTrainer({ path }: { path: CuratedPath }) {
  const gameRef = useRef(new Chess());
  const [fen, setFen] = useState(STARTING_FEN);
  const [ply, setPly] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [coach, setCoach] = useState<CoachState>({ open: false, loading: false, text: null });

  const total = path.moves.length;
  const done = ply >= total;

  const onPieceDrop = useCallback(
    ({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
      if (done || targetSquare === null) return false;
      const game = gameRef.current;

      let san: string;
      try {
        // chess.js decides legality — illegal throws → reject the drop.
        san = game.move({ from: sourceSquare, to: targetSquare, promotion: "q" }).san;
      } catch {
        return false;
      }

      if (san !== expectedMoveAt(path, ply)) {
        game.undo(); // legal but off-book → snap back
        setFeedback("wrong");
        return false;
      }

      setFen(game.fen());
      setPly((p) => p + 1);
      setLastMove({ from: sourceSquare, to: targetSquare });
      setFeedback("correct");
      return true;
    },
    [path, ply, done],
  );

  const reset = useCallback(() => {
    gameRef.current = new Chess();
    setFen(gameRef.current.fen());
    setPly(0);
    setFeedback("idle");
    setLastMove(null);
  }, []);

  const squareStyles = useMemo<Record<string, CSSProperties>>(() => {
    if (!lastMove) return {};
    const hint: CSSProperties = { backgroundColor: "var(--color-sq-hint)" };
    return { [lastMove.from]: hint, [lastMove.to]: hint };
  }, [lastMove]);

  // Summon the cached AI coach to explain the next move at the current position.
  // Only verified facts are sent (LAW #2): the engine's FEN + the line's move.
  const askCoach = useCallback(async () => {
    setCoach({ open: true, loading: true, text: null });
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fen: gameRef.current.fen(),
          bestMove: expectedMoveAt(path, ply) ?? undefined,
          openingName: path.name,
          eco: path.eco,
        }),
      });
      const data = await res.json();
      setCoach({
        open: true,
        loading: false,
        text: res.ok ? data.explanation : (data.error ?? "Coach unavailable."),
      });
    } catch {
      setCoach({ open: true, loading: false, text: "Coach unavailable." });
    }
  }, [path, ply]);

  return (
    <div className="flex w-full flex-col gap-4">
      {/* HUD — line identity + progress */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-text-hi truncate text-lg">{path.name}</p>
          <p className="text-text-low text-xs">
            {path.eco} · {path.archetype}
          </p>
        </div>
        <p className="font-display text-gold shrink-0 text-sm tabular-nums">
          {Math.min(ply, total)}/{total}
        </p>
      </div>

      {/* Board — spans the width on mobile (DESIGN.md §8) */}
      <div className="w-full max-w-[min(92vw,520px)] self-center">
        <Board
          position={fen}
          onPieceDrop={onPieceDrop}
          squareStyles={squareStyles}
          allowDragging={!done}
        />
      </div>

      {/* The idea behind the move just played (authored pedagogy, per ply). */}
      {ply > 0 && path.comments?.[ply - 1] && (
        <p className="text-text-mid border-hairline rounded-lg border px-3 py-2 text-sm leading-relaxed" aria-live="polite">
          <span className="text-gold font-semibold">{path.moves[ply - 1]}</span>{" "}
          — {path.comments[ply - 1]}
        </p>
      )}

      {/* Feedback (quick + clean, no slow animation) + thumb-zone control */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm" aria-live="polite">
          {done ? (
            <span className="text-state-solid">✓ Line complete</span>
          ) : feedback === "wrong" ? (
            <span className="text-state-leak">✗ Off the line — try again</span>
          ) : (
            <span className="text-text-mid">Your move: find the line.</span>
          )}
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={askCoach}
            className="rounded-chip bg-gold text-abyss min-h-[44px] px-4 py-2 text-sm font-semibold"
          >
            Coach
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-chip border-hairline text-text-mid min-h-[44px] border px-4 py-2 text-sm"
          >
            Recommencer
          </button>
        </div>
      </div>

      <CoachSheet
        open={coach.open}
        loading={coach.loading}
        text={coach.text}
        onClose={() => setCoach((c) => ({ ...c, open: false }))}
      />
    </div>
  );
}
