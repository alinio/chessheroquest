"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import type { CSSProperties } from "react";
import type { PieceDropHandlerArgs } from "react-chessboard";
import Link from "next/link";
import { Board } from "./Board";
import { ModeChip } from "./ModeChip";
import { NotationStrip } from "./NotationStrip";
import type { CuratedPath } from "@/src/domain/repertoire/types";
import { expectedMoveAt, fenAfter, moveSquaresAt } from "@/src/domain/repertoire/line";
import { CoachSheet } from "@/src/ui/screens/CoachSheet";

/** Auto-replay reading speed at the end of the line (~700ms per move). */
const REPLAY_MS = 700;

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

  /** End-of-line auto-replay: null = inactive, ply = positions shown so far. */
  const [replayPly, setReplayPly] = useState<number | null>(null);
  const replayStartedRef = useRef(false);

  // Line complete → replay it once, full speed-reading pace, skippable.
  // prefers-reduced-motion: no replay at all (final position stands).
  useEffect(() => {
    if (!done || replayStartedRef.current) return;
    replayStartedRef.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // A beat after the last move lands, the replay begins (async — no cascade).
    const t = window.setTimeout(() => setReplayPly(0), REPLAY_MS);
    return () => window.clearTimeout(t);
  }, [done]);

  useEffect(() => {
    if (replayPly === null) return;
    const t = window.setTimeout(() => {
      setReplayPly((p) => (p === null || p >= total ? null : p + 1));
    }, REPLAY_MS);
    return () => window.clearTimeout(t);
  }, [replayPly, total]);

  const replaying = replayPly !== null;
  const skipReplay = useCallback(() => setReplayPly(null), []);

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

  /** Plays the expected move FOR the player (same state path as a correct drop). */
  const playExpected = useCallback(() => {
    if (done) return;
    const san = expectedMoveAt(path, ply);
    if (!san) return;
    const game = gameRef.current;
    const m = game.move(san); // curated SAN — chess.js certifies legality
    setFen(game.fen());
    setPly((p) => p + 1);
    setLastMove({ from: m.from, to: m.to });
    setFeedback("correct");
  }, [path, ply, done]);

  const reset = useCallback(() => {
    gameRef.current = new Chess();
    setFen(gameRef.current.fen());
    setPly(0);
    setFeedback("idle");
    setLastMove(null);
    setReplayPly(null);
    replayStartedRef.current = false;
  }, []);

  const squareStyles = useMemo<Record<string, CSSProperties>>(() => {
    const hint: CSSProperties = { backgroundColor: "var(--color-sq-hint)" };
    if (replaying) {
      if (!replayPly) return {};
      const m = moveSquaresAt(path, replayPly - 1);
      return { [m.from]: hint, [m.to]: hint };
    }
    if (!lastMove) return {};
    return { [lastMove.from]: hint, [lastMove.to]: hint };
  }, [lastMove, replaying, replayPly, path]);

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

      {/* GUIDED contract + the whole line as a ribbon — current move in gold */}
      <div className="flex flex-col items-start gap-2">
        <ModeChip mode="guided" />
        <NotationStrip sans={path.moves} currentPly={replaying ? (replayPly ?? 0) : ply} variant="full" />
      </div>

      {/* GUIDED mode: Learn SHOWS each move + its idea BEFORE you play it
          (memorising from scratch is Drill's job). Nobody is left guessing. */}
      {!done ? (
        <div className="border-gold/40 bg-raised/60 rounded-lg border px-4 py-3" aria-live="polite">
          {ply === 0 && (
            <p className="text-text-low mb-1 text-xs tracking-wide uppercase">
              You play both sides to learn the line — {total} moves, guided.
            </p>
          )}
          <p className="text-sm leading-relaxed">
            <span className="text-text-low">Move {ply + 1}/{total} · play</span>{" "}
            <b className="text-gold text-base">{expectedMoveAt(path, ply)}</b>
            {path.comments?.[ply] && <span className="text-text-mid"> — {path.comments[ply]}</span>}
          </p>
        </div>
      ) : (
        <div className="border-state-solid/40 bg-raised/60 rounded-lg border px-4 py-3">
          <p className="text-state-solid text-sm font-semibold">✓ Line learned.</p>
          {replaying ? (
            <>
              <p className="text-text-mid mt-1 text-sm" aria-live="polite">
                Watch it once at full speed — this is the line you just learned.
              </p>
              <button
                type="button"
                onClick={skipReplay}
                className="rounded-chip border-hairline text-text-mid mt-3 inline-flex min-h-[44px] items-center border px-5 text-sm"
              >
                Skip replay
              </button>
            </>
          ) : (
            <>
              <p className="text-text-mid mt-1 text-sm">
                Now make it stick: drill it from memory — that&apos;s what moves it toward gold.
              </p>
              <Link
                href={`/drill/${path.id}`}
                className="rounded-chip bg-gold text-abyss mt-3 inline-flex min-h-[44px] items-center px-5 text-sm font-semibold"
              >
                Drill this line →
              </Link>
            </>
          )}
        </div>
      )}

      {/* Board — spans the width on mobile (DESIGN.md §8); during the replay it
          walks the line from the start (fenAfter — real positions only). */}
      <div className="w-full max-w-[min(92vw,520px)] self-center">
        <Board
          position={replaying ? fenAfter(path, replayPly ?? 0) : fen}
          onPieceDrop={onPieceDrop}
          squareStyles={squareStyles}
          allowDragging={!done}
        />
      </div>

      {/* Feedback (quick + clean, no slow animation) + thumb-zone control */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm" aria-live="polite">
          {done ? (
            <span className="text-state-solid">✓ Line complete</span>
          ) : feedback === "wrong" ? (
            <span className="text-state-leak">✗ Not that one — play {expectedMoveAt(path, ply)} (shown above)</span>
          ) : (
            <span className="text-text-mid">Make the move on the board.</span>
          )}
        </p>
        <div className="flex shrink-0 flex-wrap justify-end gap-2">
          {!done && (
            <button
              type="button"
              onClick={playExpected}
              className="rounded-chip border-gold/50 text-gold min-h-[44px] border px-4 py-2 text-sm font-semibold"
            >
              Play {expectedMoveAt(path, ply)} →
            </button>
          )}
          <button
            type="button"
            onClick={askCoach}
            className="rounded-chip bg-gold text-abyss min-h-[44px] px-4 py-2 text-sm font-semibold"
          >
            Ask the coach why
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-chip border-hairline text-text-mid min-h-[44px] border px-4 py-2 text-sm"
          >
            Restart
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
