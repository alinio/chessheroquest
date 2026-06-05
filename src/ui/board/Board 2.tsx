"use client";

import { Chessboard, type ChessboardOptions } from "react-chessboard";
import type { CSSProperties } from "react";

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

export function Board({
  position,
  onPieceDrop,
  squareStyles,
  orientation = "white",
  allowDragging = true,
}: BoardProps) {
  const options: ChessboardOptions = {
    position,
    onPieceDrop,
    squareStyles,
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
