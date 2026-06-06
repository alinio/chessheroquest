"use client";

import { useCallback, useRef, useState } from "react";
import { Chess } from "chess.js";
import type { PieceDropHandlerArgs } from "react-chessboard";
import Link from "next/link";
import { Board } from "@/src/ui/board/Board";
import { useCountUp } from "@/src/ui/hooks/useCountUp";
import { DnaCard, ARCHETYPE_META } from "./DnaCard";
import {
  DNA_QUESTION_BANK,
  DNA_TEST_LENGTH,
} from "@/src/domain/dna/question-bank";
import { selectNextQuestion } from "@/src/domain/dna/adaptive";
import { scoreDna } from "@/src/domain/dna/scoring";
import type { DnaQuestion, DnaAnswer, DnaResult } from "@/src/domain/dna/types";

type Phase = "intro" | "question" | "result";
type Feedback = "idle" | "correct" | "wrong";

const FEEDBACK_MS = 700;

function sideToMove(fen: string): "white" | "black" {
  return fen.split(" ")[1] === "b" ? "black" : "white";
}

export function DnaTest({ userId }: { userId?: string }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [asked, setAsked] = useState<DnaQuestion[]>([]);
  const [answers, setAnswers] = useState<DnaAnswer[]>([]);
  const [current, setCurrent] = useState<DnaQuestion | null>(null);
  const [boardFen, setBoardFen] = useState<string>("");
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [result, setResult] = useState<DnaResult | null>(null);
  const startRef = useRef(0);

  const begin = useCallback(() => {
    const first = selectNextQuestion(DNA_QUESTION_BANK, new Set(), []);
    if (!first) return;
    setAsked([first]);
    setAnswers([]);
    setCurrent(first);
    setBoardFen(first.fen);
    setFeedback("idle");
    setResult(null);
    setPhase("question");
    startRef.current = performance.now();
  }, []);

  const onPieceDrop = useCallback(
    ({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
      if (!current || feedback !== "idle" || targetSquare === null) return false;

      // Independent position per question: a fresh game just validates this move.
      const game = new Chess(current.fen);
      let san: string;
      try {
        san = game.move({ from: sourceSquare, to: targetSquare, promotion: "q" }).san;
      } catch {
        return false; // illegal — chess.js is the truth
      }

      const correct = san === current.expectedMove;
      const answer: DnaAnswer = {
        questionId: current.id,
        chosenMove: san,
        correct,
        latencyMs: Math.round(performance.now() - startRef.current),
      };
      const nextAnswers = [...answers, answer];

      setBoardFen(game.fen());
      setFeedback(correct ? "correct" : "wrong");
      setAnswers(nextAnswers);

      // Decide what comes next using values captured at drop time.
      const askedIds = new Set(asked.map((q) => q.id));
      const finished = asked.length >= DNA_TEST_LENGTH;
      const next = finished
        ? null
        : selectNextQuestion(DNA_QUESTION_BANK, askedIds, nextAnswers);

      window.setTimeout(() => {
        if (!next) {
          const finalResult = scoreDna(asked, nextAnswers);
          setResult(finalResult);
          setPhase("result");
          // Persist for signed-in users (seeds their Opening IQ). Fire-and-forget.
          if (userId) {
            void fetch("/api/dna-test", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(finalResult),
            });
          }
          return;
        }
        setAsked((a) => [...a, next]);
        setCurrent(next);
        setBoardFen(next.fen);
        setFeedback("idle");
        startRef.current = performance.now();
      }, FEEDBACK_MS);

      return true;
    },
    [current, feedback, answers, asked, userId],
  );

  if (phase === "intro") {
    return (
      <section className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <p className="font-display text-gold text-xs uppercase tracking-[0.35em]">
          Chess DNA Test
        </p>
        <h1 className="font-display text-text-hi max-w-md text-4xl font-bold leading-tight">
          Discover your Chess DNA
        </h1>
        <p className="text-text-mid max-w-sm">
          {DNA_TEST_LENGTH}{" "}positions. Find the best move in each. We&apos;ll reveal
          your archetype and seed your Opening IQ.
        </p>
        <button
          type="button"
          onClick={begin}
          className="rounded-chip bg-gold text-abyss min-h-[48px] px-8 text-base font-semibold shadow-lg"
        >
          Begin the test
        </button>
      </section>
    );
  }

  if (phase === "question" && current) {
    const index = asked.length; // 1-based position in the run
    return (
      <section className="flex w-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-text-mid text-sm">
            {sideToMove(boardFen) === "white" ? "White" : "Black"} to play
          </p>
          <p className="font-display text-gold text-sm tabular-nums">
            {index}/{DNA_TEST_LENGTH}
          </p>
        </div>

        {/* progress rail */}
        <div className="bg-raised h-1.5 w-full overflow-hidden rounded-chip">
          <div
            className="bg-gold h-full rounded-chip transition-[width] duration-300"
            style={{ width: `${(index / DNA_TEST_LENGTH) * 100}%` }}
          />
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
            <span className="text-state-solid">✓ Best move</span>
          ) : feedback === "wrong" ? (
            <span className="text-state-leak">✗ Not the strongest move</span>
          ) : (
            <span className="text-text-low">Find the best move.</span>
          )}
        </p>
      </section>
    );
  }

  if (phase === "result" && result) {
    return <DnaResultView result={result} onRetake={begin} />;
  }

  return null;
}

function DnaResultView({
  result,
  onRetake,
}: {
  result: DnaResult;
  onRetake: () => void;
}) {
  const iq = useCountUp(result.initialIq);
  const meta = ARCHETYPE_META[result.archetype];

  return (
    <section className="flex flex-1 flex-col items-center gap-6 py-4 text-center">
      <p className="font-display text-text-low text-xs uppercase tracking-[0.35em]">
        Your Chess DNA
      </p>
      <h2 className="font-display text-3xl font-bold" style={{ color: meta.colorVar }}>
        {meta.label}
      </h2>

      {/* dramatic IQ reveal (count-up) above the shareable card */}
      <div>
        <p className="text-text-mid text-xs uppercase tracking-[0.25em]">Opening IQ</p>
        <p
          className="font-display text-gold-bright text-8xl font-black leading-none tabular-nums"
          style={{ textShadow: "0 0 32px rgba(227,178,60,0.5)" }}
        >
          {iq}
        </p>
        <p className="text-text-mid mt-1 text-sm">{result.rank}</p>
      </div>

      <DnaCard result={result} />

      <div className="flex w-full max-w-sm flex-col gap-3">
        <Link
          href="/train"
          className="rounded-chip bg-gold text-abyss flex min-h-[48px] items-center justify-center px-6 text-base font-semibold"
        >
          Start your Road
        </Link>
        <button
          type="button"
          onClick={onRetake}
          className="rounded-chip border-hairline text-text-mid min-h-[44px] border px-6 text-sm"
        >
          Retake the test
        </button>
      </div>
    </section>
  );
}
