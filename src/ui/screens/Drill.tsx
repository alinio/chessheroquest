"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import type { PieceDropHandlerArgs } from "react-chessboard";
import Link from "next/link";
import { Board } from "@/src/ui/board/Board";
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
  const questStartRef = useRef(0);

  const current = items[index];

  // (Re)start the per-question timer whenever a new position is shown.
  useEffect(() => {
    questStartRef.current = performance.now();
  }, [index]);

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
        correct,
        intervalMs: card.due.getTime() - now.getTime(),
        latencyMs: Math.round(performance.now() - questStartRef.current),
      };

      setBoardFen(game.fen());
      setFeedback(correct ? "correct" : "wrong");

      window.setTimeout(() => {
        setResults((r) => [...r, result]);
        const next = index + 1;
        const nextItem = items[next];
        if (!nextItem) {
          setDone(true);
          // Persist the session for signed-in users: streak + XP + moat events.
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
                })),
              }),
            });
          }
          return;
        }
        setIndex(next);
        setBoardFen(nextItem.fen);
        setFeedback("idle");
      }, 700);

      return true;
    },
    [current, feedback, index, items, results, userId],
  );

  const restart = useCallback(() => {
    setIndex(0);
    setResults([]);
    setFeedback("idle");
    setDone(items.length === 0);
    setBoardFen(items[0]?.fen ?? "");
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
          <span className="text-state-leak">✗ Keep this one in review</span>
        ) : (
          <span className="text-text-low">Recall the move.</span>
        )}
      </p>
    </section>
  );
}
