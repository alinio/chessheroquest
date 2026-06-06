"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import type { PieceDropHandlerArgs } from "react-chessboard";
import Link from "next/link";
import { Board } from "@/src/ui/board/Board";
import { CoachSheet } from "@/src/ui/screens/CoachSheet";
import type { CuratedPath } from "@/src/domain/repertoire/types";
import { fenAfter, expectedMoveAt } from "@/src/domain/repertoire/line";
import { newCard, reviewCard } from "@/src/domain/srs/fsrs";

interface DrillItem {
  ply: number;
  fen: string;
  expected: string;
}
interface DrillResult {
  ply: number;
  fen: string;
  correct: boolean;
  intervalMs: number;
  latencyMs: number;
}
type Feedback = "idle" | "correct" | "wrong";

function buildItems(path: CuratedPath): DrillItem[] {
  const items: DrillItem[] = [];
  for (let ply = 0; ply < path.moves.length; ply++) {
    const expected = expectedMoveAt(path, ply);
    if (expected === null) break;
    items.push({ ply, fen: fenAfter(path, ply), expected });
  }
  return items;
}

const sideToMove = (fen: string): "white" | "black" =>
  fen.split(" ")[1] === "b" ? "black" : "white";

function formatInterval(ms: number): string {
  const minutes = Math.max(1, Math.round(ms / 60_000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h`;
  return `${Math.round(hours / 24)} j`;
}

/**
 * Drill one curated line: recall each move. Every position is graded through
 * FSRS (LAW #6) — the resulting review interval is surfaced so the hidden engine
 * is verifiable. Cards are session-local for now (persistence lands with auth).
 */
export function Drill({ path, userId }: { path: CuratedPath; userId?: string }) {
  const items = useMemo(() => buildItems(path), [path]);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [boardFen, setBoardFen] = useState(items[0]?.fen ?? "");
  const [results, setResults] = useState<DrillResult[]>([]);
  const [done, setDone] = useState(items.length === 0);
  // On a wrong answer we pause auto-advance and coach the player on the line.
  const [pending, setPending] = useState<DrillResult | null>(null);
  const [coach, setCoach] = useState<{ open: boolean; loading: boolean; text: string | null }>({
    open: false,
    loading: false,
    text: null,
  });
  const questStartRef = useRef(0);

  const current = items[index];

  // (Re)start the per-question timer whenever a new position is shown.
  useEffect(() => {
    questStartRef.current = performance.now();
  }, [index]);

  // Advance to the next position, or finish the session (persist for signed-in
  // users: streak + XP + FSRS cards + moat events).
  const commit = useCallback(
    (result: DrillResult) => {
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
              mode: "drill",
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
        return false; // illegal — chess.js is the truth
      }

      const correct = san === current.expected;
      const now = new Date();
      const card = reviewCard(newCard(now), correct, now);
      const result: DrillResult = {
        ply: current.ply,
        fen: current.fen,
        correct,
        intervalMs: card.due.getTime() - now.getTime(),
        latencyMs: Math.round(performance.now() - questStartRef.current),
      };

      setBoardFen(game.fen());
      setFeedback(correct ? "correct" : "wrong");

      if (correct) {
        window.setTimeout(() => commit(result), 700);
      } else {
        // Pause and coach: explain why the line's move is stronger. The verified
        // best move is GIVEN to the coach (LAW #2) — it never analyses for itself.
        setPending(result);
        setCoach({ open: true, loading: true, text: null });
        fetch("/api/coach", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            fen: current.fen,
            move: san,
            bestMove: current.expected,
            openingName: path.name,
            eco: path.eco,
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
    [current, feedback, commit, path],
  );

  const onContinue = useCallback(() => {
    if (!pending) return;
    const next = pending;
    setPending(null);
    setCoach((c) => ({ ...c, open: false }));
    commit(next);
  }, [pending, commit]);

  const restart = useCallback(() => {
    setIndex(0);
    setResults([]);
    setFeedback("idle");
    setDone(items.length === 0);
    setBoardFen(items[0]?.fen ?? "");
    setPending(null);
    setCoach({ open: false, loading: false, text: null });
  }, [items]);

  if (done) {
    const correct = results.filter((r) => r.correct).length;
    return (
      <section className="flex flex-1 flex-col gap-5">
        <header className="text-center">
          <p className="font-display text-gold text-xs uppercase tracking-[0.3em]">
            Drill complete
          </p>
          <p className="font-display text-text-hi text-3xl font-bold tabular-nums">
            {correct}/{results.length}
          </p>
          <p className="text-text-mid text-sm">{path.name}</p>
        </header>

        <div className="bg-surface rounded-card divide-hairline divide-y">
          {results.map((r, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span className={r.correct ? "text-state-solid" : "text-state-leak"}>
                {r.correct ? "✓" : "✗"} move {r.ply + 1}
              </span>
              <span className="text-text-mid">
                next review in {formatInterval(r.intervalMs)}
              </span>
            </div>
          ))}
        </div>

        <p className="text-text-low text-center text-xs">
          FSRS scheduled each position — correct answers wait longer, misses come back sooner.
        </p>

        <button
          type="button"
          onClick={restart}
          className="rounded-chip bg-gold text-abyss mx-auto min-h-[48px] px-8 font-semibold"
        >
          Drill again
        </button>
        <Link href="/train" className="text-text-low text-center text-sm underline">
          Back to training
        </Link>
      </section>
    );
  }

  if (!current) return null;

  return (
    <section className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-text-mid text-sm">
          {sideToMove(boardFen) === "white" ? "White" : "Black"} to play
        </p>
        <p className="font-display text-gold text-sm tabular-nums">
          {index + 1}/{items.length}
        </p>
      </div>

      <div className="w-full max-w-[min(92vw,520px)] self-center">
        <Board
          position={boardFen}
          onPieceDrop={onPieceDrop}
          orientation={sideToMove(current.fen)}
          allowDragging={feedback === "idle"}
        />
      </div>

      <p className="min-h-[1.5rem] text-center text-sm" aria-live="polite">
        {feedback === "correct" ? (
          <span className="text-state-solid">✓ Correct</span>
        ) : feedback === "wrong" ? (
          <span className="text-state-leak">✗ Not the line — here&apos;s why</span>
        ) : (
          <span className="text-text-low">Recall the move.</span>
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

      <CoachSheet
        open={coach.open}
        loading={coach.loading}
        text={coach.text}
        onClose={onContinue}
      />
    </section>
  );
}
