"use client";

import { useEffect, useRef, useState } from "react";
import { MiniBoard, type MiniPosition } from "./MiniBoard";
import { OpeningIQGauge } from "./OpeningIQGauge";
import { DNACard } from "./DNACard";
import { Panel } from "./Panel";
import { EXAMPLE_DNA } from "../exampleData";
import { useReducedMotion } from "../hooks";

/**
 * Coded test demo (kickoff pass 2 §4) — shows the MECHANIC in code, not an AI
 * video: positions flash by → the Opening IQ gauge counts up → the DNA Card
 * foils in. One slot, cross-faded through three phases, looping while in view.
 * Under reduced-motion it rests on the final reveal. This communicates
 * "we test your openings → score → card" without a narrative video.
 */
const POSITIONS: [MiniPosition, MiniPosition, MiniPosition] = [
  {
    ranks: [
      "rnbqkbnr",
      "pppp.ppp",
      "........",
      "....p...",
      "....P...",
      ".....N..",
      "PPPP.PPP",
      "RNBQKB.R",
    ],
    highlight: [4, 4],
  },
  {
    ranks: [
      "r.bqkbnr",
      "pppp.ppp",
      "..n.....",
      "....p...",
      "..B.P...",
      ".....N..",
      "PPPP.PPP",
      "RNBQK..R",
    ],
    highlight: [4, 2],
  },
  {
    ranks: [
      "rnbqkbnr",
      "pp.ppppp",
      "........",
      "..p.....",
      "....P...",
      "........",
      "PPPP.PPP",
      "RNBQKBNR",
    ],
    highlight: [3, 2],
  },
];

// [phase, position index, duration ms]
const TIMELINE = [
  { phase: "test", pos: 0, ms: 700 },
  { phase: "test", pos: 1, ms: 700 },
  { phase: "test", pos: 2, ms: 700 },
  { phase: "score", pos: 0, ms: 1600 },
  { phase: "reveal", pos: 0, ms: 3000 },
] as const;

const REVEAL_IDX = 4;

export function TestDemo() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const [inView, setInView] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      if (idx !== REVEAL_IDX) {
        const id = setTimeout(() => setIdx(REVEAL_IDX), 0);
        return () => clearTimeout(id);
      }
      return;
    }
    const id = setTimeout(
      () => setIdx((i) => (i + 1) % TIMELINE.length),
      (TIMELINE[idx] ?? TIMELINE[0]).ms,
    );
    return () => clearTimeout(id);
  }, [inView, idx, reduce]);

  const current = TIMELINE[idx] ?? TIMELINE[0];
  const phase = current.phase;
  const testCount = phase === "test" ? idx + 1 : 3;
  const testPosition = POSITIONS[current.pos] ?? POSITIONS[0];

  return (
    <Panel variant="ornate" className="mx-auto w-full max-w-xl">
      <div
        ref={ref}
        className="flex min-h-[26rem] flex-col items-center justify-center gap-5 p-6"
      >
        {/* the cross-faded stage */}
        <div className="relative flex min-h-[18rem] w-full items-center justify-center">
          <Stage show={phase === "test"}>
            <div className="flex flex-col items-center gap-3">
              <MiniBoard position={testPosition} />
              <p className="text-xs font-medium text-text-mid">
                Analyzing your openings…{" "}
                <span className="text-gold tabular-nums">
                  {testCount * 6}/20
                </span>
              </p>
            </div>
          </Stage>

          <Stage show={phase === "score"}>
            <div className="flex flex-col items-center gap-2">
              <OpeningIQGauge value={EXAMPLE_DNA.openingIq} size={180} />
              <p className="text-xs font-medium text-text-mid">
                Scoring your Opening IQ…
              </p>
            </div>
          </Stage>

          <Stage show={phase === "reveal"}>
            <div className="w-[17rem]">
              <DNACard data={EXAMPLE_DNA} />
            </div>
          </Stage>
        </div>

        <PhaseDots phase={phase} />
      </div>
    </Panel>
  );
}

/** Absolutely-stacked cross-fade slot. */
function Stage({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-500 ${
        show
          ? "scale-100 opacity-100"
          : "pointer-events-none scale-95 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

const LABELS = [
  { key: "test", label: "Test openings" },
  { key: "score", label: "Score IQ" },
  { key: "reveal", label: "Reveal DNA" },
] as const;

function PhaseDots({ phase }: { phase: string }) {
  return (
    <div className="flex items-center gap-2">
      {LABELS.map((l, i) => {
        const active = l.key === phase;
        return (
          <div key={l.key} className="flex items-center gap-2">
            {i > 0 && <span className="h-px w-4 bg-hairline" aria-hidden />}
            <span
              className={`rounded-chip px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-wide transition-colors duration-300 ${
                active
                  ? "bg-gold/15 text-gold"
                  : "text-text-low"
              }`}
            >
              {l.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
