"use client";

import { Chessboard, type ChessboardOptions } from "react-chessboard";
import type { CSSProperties } from "react";

/**
 * Board for the test / learn / drill flows (art-bible §3.1). Warm dark theme
 * (light #B89B72 / dark #3A2E22), instant position swaps (snappy + reduced-motion
 * safe). Display-only by default; pass onPieceDrop + allowDragging to make it
 * interactive (Learn/Drill).
 */
const lightSquareStyle: CSSProperties = { backgroundColor: "#B89B72" };
const darkSquareStyle: CSSProperties = { backgroundColor: "#3A2E22" };

export function TestBoard({
  fen,
  orientation,
  onPieceDrop,
  allowDragging = false,
  squareStyles,
}: {
  fen: string;
  orientation: "white" | "black";
  onPieceDrop?: ChessboardOptions["onPieceDrop"];
  allowDragging?: boolean;
  squareStyles?: Record<string, CSSProperties>;
}) {
  const options: ChessboardOptions = {
    position: fen,
    boardOrientation: orientation,
    allowDragging,
    onPieceDrop,
    squareStyles,
    showNotation: true,
    animationDurationInMs: 0,
    lightSquareStyle,
    darkSquareStyle,
  };
  return <Chessboard options={options} />;
}
