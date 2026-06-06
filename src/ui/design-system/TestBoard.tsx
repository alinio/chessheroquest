"use client";

import { Chessboard, type ChessboardOptions } from "react-chessboard";
import type { CSSProperties } from "react";

/**
 * Display-only board for the DNA test (wireframe §1 / art-bible §3.1). Warm dark
 * theme (light #B89B72 / dark #3A2E22), no dragging, instant position swaps
 * (snappy + reduced-motion-safe). The player answers via move chips, not the board.
 */
const lightSquareStyle: CSSProperties = { backgroundColor: "#B89B72" };
const darkSquareStyle: CSSProperties = { backgroundColor: "#3A2E22" };

export function TestBoard({ fen, orientation }: { fen: string; orientation: "white" | "black" }) {
  const options: ChessboardOptions = {
    position: fen,
    boardOrientation: orientation,
    allowDragging: false,
    showNotation: true,
    animationDurationInMs: 0,
    lightSquareStyle,
    darkSquareStyle,
  };
  return <Chessboard options={options} />;
}
