"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import type { PieceDropHandlerArgs } from "react-chessboard";
import Link from "next/link";
import { Board } from "@/src/ui/board/Board";
import { ModeChip } from "@/src/ui/board/ModeChip";
import { NotationStrip } from "@/src/ui/board/NotationStrip";
import { CoachSheet } from "@/src/ui/screens/CoachSheet";
import type { DueCard } from "@/src/data/repos/cards";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { plyOfFen } from "@/src/domain/repertoire/line";
import { PATH_SIDE } from "@/src/domain/world/guardians";

interface ReviewResult {
  fen: string;
  correct: boolean;
  latencyMs: number;
}
type Feedback = "idle" | "correct" | "wrong";

const sideToMove = (fen: string): "white" | "black" =>
  fen.split(" ")[1] === "b" ? "black" : "white";

/**
 * Daily Quest — recall the moves for the positions FSRS says are due, across all
 * openings (master-vision §13.1). Each answer reschedules its card; a wrong one
 * pauses and summons the coach.
 */
export function Review({ items, userId }: { items: DueCard[]; userId?: string }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [boardFen, setBoardFen] = useState(items[0]?.fen ?? "");
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [done, setDone] = useState(items.length === 0);
  const [pending, setPending] = useState<ReviewResult | null>(null);
  const [coach, setCoach] = useState<{ open: boolean; loading: boolean; text: string | null }>({
    open: false,
    loading: false,
    text: null,
  });
  const startRef = useRef(0);

  const current = items[index];

  // Re-anchor the card in its curated line — jumping between openings, the
  // player needs the context back every card: line, side, path so far.
  const path = current ? STARTER_PATHS.find((x) => x.name === current.opening) : undefined;
  const playerSide: "white" | "black" = path ? (PATH_SIDE[path.id] ?? "white") : current ? sideToMove(current.fen) : "white";
  const cardPly = path && current ? plyOfFen(path, current.fen) : -1;

  useEffect(() => {
    startRef.current = performance.now();
  }, [index]);

  const commit = useCallback(
    (result: ReviewResult) => {
      setResults((r) => [...r, result]);
      const nextItem = items[index + 1];
      if (!nextItem) {
        setDone(true);
        if (userId) {
          const finalResults = [...results, result];
          void fetch("/api/train", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              mode: "review",
              attempts: finalResults.map((r) => ({
                correct: r.correct,
                latencyMs: r.latencyMs,
                fen: r.fen,
              })),
            }),
          });
        }
        return;
      }
      setIndex(index + 1);
      setBoardFen(nextItem.fen);
      setFeedback("idle");
    },
    [index, items, results, userId],
  );

  const onPieceDrop = useCallback(
    ({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
      if (!current || feedback !== "idle" || targetSquare === null) return false;

      const game = new Chess(current.fen);
      let san: string;
      try {
        san = game.move({ from: sourceSquare, to: targetSquare, promotion: "q" }).san;
      } catch {
        return false;
      }

      const correct = san === current.expected;
      const result: ReviewResult = {
        fen: current.fen,
        correct,
        latencyMs: Math.round(performance.now() - startRef.current),
      };
      setBoardFen(game.fen());
      setFeedback(correct ? "correct" : "wrong");

      if (correct) {
        window.setTimeout(() => commit(result), 700);
      } else {
        setPending(result);
        setCoach({ open: true, loading: true, text: null });
        fetch("/api/coach", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            fen: current.fen,
            move: san,
            bestMove: current.expected,
            openingName: current.opening,
          }),
        })
          .then((r) => r.json())
          .then((d) =>
            setCoach({
              open: true,
              loading: false,
              text: d.explanation ?? d.error ?? "Coach unavailable.",
            }),
          )
          .catch(() => setCoach({ open: true, loading: false, text: "Coach unavailable." }));
      }

      return true;
    },
    [current, feedback, commit],
  );

  const onContinue = useCallback(() => {
    if (!pending) return;
    const next = pending;
    setPending(null);
    setCoach((c) => ({ ...c, open: false }));
    commit(next);
  }, [pending, commit]);

  if (done) {
    const correct = results.filter((r) => r.correct).length;
    return (
      <section className="flex flex-1 flex-col items-center gap-5 py-4 text-center">
        <p className="font-display text-gold text-xs uppercase tracking-[0.3em]">Quest complete</p>
        {results.length > 0 ? (
          <p className="font-display text-text-hi text-3xl font-bold tabular-nums">
            {correct}/{results.length}
          </p>
        ) : (
          <p className="text-text-mid max-w-xs text-sm">
            Nothing due right now — your memory is fresh. Learn a new line instead.
          </p>
        )}
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Link
            href="/train"
            className="rounded-chip bg-gold text-abyss inline-flex min-h-[48px] items-center justify-center px-6 font-semibold"
          >
            Explore openings
          </Link>
          <Link href="/train" className="text-text-low text-sm underline">
            Back to your hub
          </Link>
        </div>
      </section>
    );
  }

  if (!current) return null;

  return (
    <section className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-text-mid truncate text-sm">
          {current.opening}
          <span className="text-text-low"> · You play {playerSide === "white" ? "White" : "Black"}</span>
        </p>
        <p className="font-display text-gold shrink-0 text-sm tabular-nums">
          {index + 1}/{items.length}
        </p>
      </div>

      <div className="flex flex-col items-center gap-2 self-center">
        <ModeChip mode="recall" />
        {path && cardPly > 0 && (
          <NotationStrip sans={path.moves} currentPly={cardPly} variant="path" />
        )}
      </div>

      <div className="w-full max-w-[min(92vw,520px)] self-center">
        <Board
          position={boardFen}
          onPieceDrop={onPieceDrop}
          orientation={playerSide}
          allowDragging={feedback === "idle"}
        />
      </div>

      <p className="min-h-[1.5rem] text-center text-sm" aria-live="polite">
        {feedback === "correct" ? (
          <span className="text-state-solid">✓ Remembered</span>
        ) : feedback === "wrong" ? (
          <span className="text-state-leak">✗ Not quite — here&apos;s why</span>
        ) : (
          <span className="text-text-low">
            {sideToMove(current.fen) === "white" ? "White" : "Black"} to play — recall the move.
          </span>
        )}
      </p>

      {pending && (
        <button
          type="button"
          onClick={onContinue}
          className="rounded-chip bg-gold text-abyss mx-auto min-h-[44px] px-8 text-sm font-semibold"
        >
          Continue
        </button>
      )}

      <CoachSheet open={coach.open} loading={coach.loading} text={coach.text} onClose={onContinue} />
    </section>
  );
}
