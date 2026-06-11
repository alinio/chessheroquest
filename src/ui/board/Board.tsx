"use client";

import { Chessboard, type ChessboardOptions } from "react-chessboard";
import type { SquareHandlerArgs } from "react-chessboard";
import { Chess, type Square } from "chess.js";
import { useCallback, useMemo, useState, type CSSProperties } from "react";

export interface BoardProps {
  /** Current position as a FEN string. */
  position: string;
  /** Returns true to accept the drop, false to snap back. */
  onPieceDrop?: ChessboardOptions["onPieceDrop"];
  /** Per-square overrides (e.g. gold last-move / hint highlights). */
  squareStyles?: Record<string, CSSProperties>;
  orientation?: "white" | "black";
  allowDragging?: boolean;
}

/*
 * DESIGN.md "board rule": the board stays clean, legible and serious — the epic
 * treatment goes AROUND it, never on it. Squares use the legible parchment/stone
 * tokens; the only flourish is the gold move hint. No ornate pieces.
 */
const lightSquareStyle: CSSProperties = { backgroundColor: "var(--color-sq-light)" };
const darkSquareStyle: CSSProperties = { backgroundColor: "var(--color-sq-dark)" };
const dropSquareStyle: CSSProperties = {
  boxShadow: "inset 0 0 0 3px var(--color-gold)",
};

/* Tap-tap selection chrome — same gold language as the drag hints. */
const selectedStyle: CSSProperties = {
  boxShadow: "inset 0 0 0 3px var(--color-gold)",
  backgroundColor: "var(--color-sq-hint)",
};
const targetDotStyle: CSSProperties = {
  backgroundImage: "radial-gradient(circle, var(--color-sq-hint) 24%, transparent 26%)",
};
const targetCaptureStyle: CSSProperties = {
  backgroundImage: "radial-gradient(circle, transparent 56%, var(--color-sq-hint) 58%)",
};

export function Board({
  position,
  onPieceDrop,
  squareStyles,
  orientation = "white",
  allowDragging = true,
}: BoardProps) {
  // Tap-tap: tap a piece of the side to move → legal targets light up; tap a
  // target → the move is submitted through the SAME onPieceDrop contract the
  // drag path uses. One implementation, every game screen inherits it.
  // The selection is keyed to its position: when a move lands (new FEN) any
  // stale selection silently dies — no effect, no cascading render.
  const [sel, setSel] = useState<{ position: string; square: string } | null>(null);
  const selected = sel && sel.position === position ? sel.square : null;
  const setSelected = useCallback(
    (square: string | null) => setSel(square ? { position, square } : null),
    [position],
  );

  // chess.js is the move model (LAW #2) — it alone says what is selectable/legal.
  const game = useMemo(() => {
    try {
      return new Chess(position);
    } catch {
      return null;
    }
  }, [position]);

  const targets = useMemo(() => {
    if (!game || !selected) return new Set<string>();
    return new Set(
      game.moves({ square: selected as Square, verbose: true }).map((m) => m.to as string),
    );
  }, [game, selected]);

  const onSquareClick = useCallback(
    ({ piece, square }: SquareHandlerArgs) => {
      if (!onPieceDrop || !allowDragging || !game) return;

      if (selected) {
        if (square === selected) {
          setSelected(null);
          return;
        }
        if (targets.has(square)) {
          const src = game.get(selected as Square);
          onPieceDrop({
            piece: {
              isSparePiece: false,
              position: position,
              pieceType: src ? `${src.color}${src.type.toUpperCase()}` : "",
            },
            sourceSquare: selected,
            targetSquare: square,
          });
          setSelected(null);
          return;
        }
      }

      // Select (or re-select) a piece of the side to move; anything else clears.
      if (piece && game.get(square as Square)?.color === game.turn()) {
        setSelected(square);
      } else {
        setSelected(null);
      }
    },
    [onPieceDrop, allowDragging, game, selected, setSelected, targets, position],
  );

  const mergedSquareStyles = useMemo<Record<string, CSSProperties>>(() => {
    const out: Record<string, CSSProperties> = { ...squareStyles };
    if (selected) {
      out[selected] = { ...out[selected], ...selectedStyle };
      for (const t of targets) {
        out[t] = { ...out[t], ...(game?.get(t as Square) ? targetCaptureStyle : targetDotStyle) };
      }
    }
    return out;
  }, [squareStyles, selected, targets, game]);

  const options: ChessboardOptions = {
    position,
    onPieceDrop,
    onSquareClick,
    squareStyles: mergedSquareStyles,
    boardOrientation: orientation,
    allowDragging,
    lightSquareStyle,
    darkSquareStyle,
    dropSquareStyle,
    animationDurationInMs: 200,
    showNotation: true,
  };

  return <Chessboard options={options} />;
}
