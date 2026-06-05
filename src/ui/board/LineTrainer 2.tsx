"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import type { CSSProperties } from "react";
import type { PieceDropHandlerArgs } from "react-chessboard";
import { Board } from "./Board";
import type { CuratedPath } from "@/src/domain/repertoire/types";
import { expectedMoveAt } from "@/src/domain/repertoire/line";

type Feedback = "idle" | "correct" | "wrong";

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

      {/* Feedback (quick + clean, no slow animation) + thumb-zone control */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm" aria-live="polite">
          {done ? (
            <span className="text-state-solid">✓ Ligne complétée</span>
          ) : feedback === "wrong" ? (
            <span className="text-state-leak">✗ Pas la ligne — réessaie</span>
          ) : (
            <span className="text-text-mid">À toi de jouer : trouve le bon coup.</span>
          )}
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-chip border-hairline text-text-mid min-h-[44px] border px-4 py-2 text-sm"
        >
          Recommencer
        </button>
      </div>
    </div>
  );
}
