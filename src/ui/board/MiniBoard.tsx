"use client";

/**
 * MiniBoard — read-only position preview, the chess-first CTA surface.
 * Rule (target-experience-spec §B1): it always shows THE position the click
 * will train — never a generic/decorative diagram. Every FEN comes from
 * fenAfter() over a curated path or the real SRS queue (LAW #2).
 * Wrap it in a Link: clicks fall through (pointer-events: none inside) —
 * the board IS the button.
 */
import { useId } from "react";
import { Chessboard, type ChessboardOptions } from "react-chessboard";
import type { CSSProperties } from "react";
import "./board-ui.css";

export type MiniBoardSize = "hero" | "card" | "chip";

const lightSquareStyle: CSSProperties = { backgroundColor: "var(--color-sq-light, #e8dfc8)" };
const darkSquareStyle: CSSProperties = { backgroundColor: "var(--color-sq-dark, #6e5b4a)" };
/** Gold last-move highlight — the one flourish the board rule allows. */
const lastMoveStyle: CSSProperties = {
  backgroundColor: "var(--color-sq-hint, rgba(227, 178, 60, 0.35))",
};

export function MiniBoard({
  fen,
  orientation = "white",
  lastMove,
  size = "card",
  px,
  caption,
}: {
  fen: string;
  orientation?: "white" | "black";
  /** Highlighted in gold (e.g. the move that led to this position). */
  lastMove?: { from: string; to: string } | null;
  /** hero ~380px · card ~96px · chip ~72px. */
  size?: MiniBoardSize;
  /** Pixel override for in-between uses (e.g. the quest dossier ~140px). */
  px?: number;
  /** Optional one-line legend under the board (e.g. "Italian Game · White to move"). */
  caption?: React.ReactNode;
}) {
  const id = useId();

  const squareStyles: Record<string, CSSProperties> = lastMove
    ? { [lastMove.from]: lastMoveStyle, [lastMove.to]: lastMoveStyle }
    : {};

  const options: ChessboardOptions = {
    id,
    position: fen,
    boardOrientation: orientation,
    allowDragging: false,
    allowDrawingArrows: false,
    squareStyles,
    lightSquareStyle,
    darkSquareStyle,
    animationDurationInMs: 0,
    showNotation: false,
  };

  return (
    <span
      className={`chq-miniboard chq-miniboard--${size}`}
      style={px ? { maxWidth: `${px}px` } : undefined}
      aria-hidden="true"
    >
      <span className="board-frame" style={{ display: "block" }}>
        <Chessboard options={options} />
      </span>
      {caption && <span className="mb-caption" style={{ display: "block" }}>{caption}</span>}
    </span>
  );
}
