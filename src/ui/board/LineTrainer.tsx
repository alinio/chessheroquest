"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Board } from "./Board";
import { ModeChip } from "./ModeChip";
import { NotationStrip } from "./NotationStrip";
import { WhatPlayersPlay } from "./WhatPlayersPlay";
import type { CuratedPath } from "@/src/domain/repertoire/types";
import { expectedMoveAt, fenAfter, moveSquaresAt } from "@/src/domain/repertoire/line";
import { CoachSheet } from "@/src/ui/screens/CoachSheet";

/** Auto-replay reading speed at the end of the line (~700ms per move). */
const REPLAY_MS = 700;

interface CoachState {
  open: boolean;
  loading: boolean;
  text: string | null;
}

/** Standard initial position FEN — computed once, never read from a ref in render. */
const STARTING_FEN = new Chess().fen();

/**
 * Walk a curated line, GUIDED: the pieces are NOT draggable here — the player
 * steps through the line with one explicit button per move ("Play White's
 * move: Bc4"), reading the idea of each move as it lands. Memorising is
 * Drill's job. SAN/legality still come from chess.js — the engine is the
 * truth (LAW #2); the component holds only UI state.
 */
export function LineTrainer({ path }: { path: CuratedPath }) {
  const gameRef = useRef(new Chess());
  const [fen, setFen] = useState(STARTING_FEN);
  const [ply, setPly] = useState(0);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [coach, setCoach] = useState<CoachState>({ open: false, loading: false, text: null });

  const total = path.moves.length;
  const done = ply >= total;
  /** Whose move the NEXT line move is — named on the button, every move. */
  const sideToPlay = ply % 2 === 0 ? "White" : "Black";

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

  /** Plays the line's next move — the ONLY way the position advances here. */
  const playExpected = useCallback(() => {
    if (done) return;
    const san = expectedMoveAt(path, ply);
    if (!san) return;
    const game = gameRef.current;
    const m = game.move(san); // curated SAN — chess.js certifies legality
    setFen(game.fen());
    setPly((p) => p + 1);
    setLastMove({ from: m.from, to: m.to });
  }, [path, ply, done]);

  const reset = useCallback(() => {
    gameRef.current = new Chess();
    setFen(gameRef.current.fen());
    setPly(0);
    setLastMove(null);
    setReplayPly(null);
    replayStartedRef.current = false;
  }, []);

  // from/to hints stay on the squares: the move that just landed glows gold.
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
      {/* Compact one-line header — line identity + GUIDED contract + progress */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="font-display text-text-hi min-w-0 truncate text-lg">{path.name}</p>
        <p className="text-text-low shrink-0 text-xs">{path.eco}</p>
        <ModeChip mode="guided" />
        <p className="font-display text-gold ml-auto shrink-0 text-sm tabular-nums">
          {Math.min(ply, total)}/{total}
        </p>
      </div>
      <p className="text-text-low text-xs leading-relaxed">
        You don&apos;t move the pieces here — step through the line and read why each move works.
        Drills test your memory after.
      </p>

      {/* Full-width 2-col split: board ~55% | explorer + context ~45%.
          Mobile stacks, board first (DESIGN.md §8). */}
      <div className="grid items-start gap-6 lg:grid-cols-[11fr_9fr]">
        {/* LEFT — the board + the one interaction. During the replay the board
            walks the line from the start (fenAfter — real positions only). */}
        <div className="flex w-full flex-col gap-3">
          <div className="w-full max-w-[min(92vw,560px)] self-center lg:max-w-none">
            <Board
              position={replaying ? fenAfter(path, replayPly ?? 0) : fen}
              squareStyles={squareStyles}
              allowDragging={false}
            />
          </div>

          {!done ? (
            <button
              type="button"
              onClick={playExpected}
              className="rounded-chip bg-gold text-abyss min-h-[52px] w-full px-5 text-base font-semibold"
            >
              ▶ Play {sideToPlay}&apos;s move: {expectedMoveAt(path, ply)} →
            </button>
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
        </div>

        {/* RIGHT — the whole line as a ribbon, the current move's idea, and
            what real players do at this position. */}
        <div className="flex min-w-0 flex-col gap-4">
          <NotationStrip
            sans={path.moves}
            currentPly={replaying ? (replayPly ?? 0) : ply}
            variant="full"
          />

          {/* GUIDED: Learn SHOWS each move + its idea BEFORE it is played
              (memorising from scratch is Drill's job). Nobody is left guessing. */}
          {!done && (
            <div className="border-gold/40 bg-raised/60 rounded-lg border px-4 py-3" aria-live="polite">
              <p className="text-text-low mb-1 text-xs tracking-wide uppercase">
                Move {ply + 1}/{total} · {sideToPlay} plays
              </p>
              <p className="text-sm leading-relaxed">
                <b className="text-gold text-base">{expectedMoveAt(path, ply)}</b>
                {path.comments?.[ply] && (
                  <span className="text-text-mid"> — {path.comments[ply]}</span>
                )}
              </p>
            </div>
          )}

          {/* Variation context: REAL Lichess percentages at the current position,
              our line's move starred. The line shown is one of several playable
              moves — this is where the player sees the alternatives. */}
          <WhatPlayersPlay
            fen={fen}
            lineSan={done ? undefined : (expectedMoveAt(path, ply) ?? undefined)}
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={askCoach}
              className="rounded-chip border-gold/50 text-gold min-h-[44px] border px-4 py-2 text-sm font-semibold"
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
