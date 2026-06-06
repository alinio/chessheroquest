"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MiniBoard, type MiniPosition } from "./MiniBoard";
import { OpeningIQGauge } from "./OpeningIQGauge";
import { Panel } from "./Panel";
import { LANDING_ASSETS } from "../assets";
import { EXAMPLE_DNA } from "../exampleData";
import { useReducedMotion } from "../hooks";

/**
 * Coded concept demo (Round 2 §2) — shows the mechanic in code, not AI video:
 * positions flash by → the Opening IQ counts up to 428 → the Strategist archetype
 * reveals → a short Road to Elo draws with opening nodes lighting up. One slot,
 * one phase at a time (key-based render → no overlap), looping while in view.
 * Reduced-motion rests on the IQ frame.
 */
const POSITIONS: [MiniPosition, MiniPosition, MiniPosition] = [
  { ranks: ["rnbqkbnr", "pppp.ppp", "........", "....p...", "....P...", ".....N..", "PPPP.PPP", "RNBQKB.R"], highlight: [4, 4] },
  { ranks: ["r.bqkbnr", "pppp.ppp", "..n.....", "....p...", "..B.P...", ".....N..", "PPPP.PPP", "RNBQK..R"], highlight: [4, 2] },
  { ranks: ["rnbqkbnr", "pp.ppppp", "........", "..p.....", "....P...", "........", "PPPP.PPP", "RNBQKBNR"], highlight: [3, 2] },
];

const TIMELINE = [
  { phase: "test", pos: 0, ms: 650 },
  { phase: "test", pos: 1, ms: 650 },
  { phase: "test", pos: 2, ms: 650 },
  { phase: "score", pos: 0, ms: 1800 },
  { phase: "archetype", pos: 0, ms: 1700 },
  { phase: "road", pos: 0, ms: 2600 },
] as const;

const SCORE_IDX = 3;
const ROAD = ["Italian", "Caro-Kann", "London"];

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
      if (idx !== SCORE_IDX) {
        const id = setTimeout(() => setIdx(SCORE_IDX), 0);
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

  return (
    <Panel variant="ornate" className="mx-auto w-full max-w-xl">
      <div
        ref={ref}
        className="flex min-h-[24rem] flex-col items-center justify-center gap-6 p-6"
      >
        <div
          key={`${phase}-${idx}`}
          className="flex min-h-[15rem] w-full animate-[chq-fade-in_0.5s_ease-out] items-center justify-center"
        >
          {phase === "test" && (
            <div className="flex flex-col items-center gap-3">
              <MiniBoard position={POSITIONS[current.pos] ?? POSITIONS[0]} />
              <p className="text-sm font-medium text-text-mid">
                Analyzing your openings…{" "}
                <span className="tabular-nums text-gold">{(idx + 1) * 6}/20</span>
              </p>
            </div>
          )}

          {phase === "score" && (
            <div className="flex flex-col items-center gap-2">
              <OpeningIQGauge value={EXAMPLE_DNA.openingIq} size={184} />
              <p className="text-sm font-medium text-text-mid">
                Scoring your Opening IQ…
              </p>
            </div>
          )}

          {phase === "archetype" && (
            <div className="flex flex-col items-center gap-2">
              <p className="font-display text-[0.62rem] uppercase tracking-[0.3em] text-text-low">
                Your Chess DNA
              </p>
              <div className="relative flex h-24 w-24 items-center justify-center">
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full"
                  style={{ background: "radial-gradient(circle, var(--color-strategist), transparent 70%)", opacity: 0.5 }}
                />
                <Image
                  src={LANDING_ASSETS.crests.strategist}
                  alt=""
                  width={84}
                  height={84}
                  className="relative h-20 w-20 object-contain [mix-blend-mode:screen]"
                />
              </div>
              <p className="font-display text-2xl font-bold text-strategist">
                Strategist
              </p>
            </div>
          )}

          {phase === "road" && (
            <div className="flex w-full flex-col items-center gap-4">
              <p className="font-display text-[0.62rem] uppercase tracking-[0.3em] text-text-low">
                Your Road to Elo
              </p>
              <div className="flex items-center gap-2">
                {ROAD.map((name, i) => (
                  <div key={name} className="flex items-center gap-2">
                    {i > 0 && (
                      <span
                        className="h-px w-8 bg-gold/50"
                        style={{ animation: `chq-fade-in 0.4s ${0.2 + i * 0.5}s both` }}
                      />
                    )}
                    <div
                      className="flex flex-col items-center gap-1"
                      style={{ animation: `chq-node 0.5s ${i * 0.5}s both` }}
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold bg-gold/15 text-gold shadow-[0_0_14px_-3px_rgba(227,178,60,0.7)]">
                        ♟
                      </span>
                      <span className="text-[0.6rem] text-text-mid">{name}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-text-mid">
                Train these next — built for how you play.
              </p>
            </div>
          )}
        </div>

        <PhaseDots phase={phase} />
      </div>
    </Panel>
  );
}

const LABELS = [
  { key: "test", label: "Test" },
  { key: "score", label: "Score" },
  { key: "archetype", label: "DNA" },
  { key: "road", label: "Road to Elo" },
] as const;

function PhaseDots({ phase }: { phase: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {LABELS.map((l, i) => (
        <div key={l.key} className="flex items-center gap-1.5">
          {i > 0 && <span className="h-px w-3 bg-hairline" aria-hidden />}
          <span
            className={`rounded-chip px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-wide transition-colors duration-300 ${
              l.key === phase ? "bg-gold/15 text-gold" : "text-text-low"
            }`}
          >
            {l.label}
          </span>
        </div>
      ))}
    </div>
  );
}
