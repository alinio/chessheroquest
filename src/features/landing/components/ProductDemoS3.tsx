"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MiniBoard, type MiniPosition } from "./MiniBoard";
import { OpeningIQGauge } from "./OpeningIQGauge";
import { Panel } from "./Panel";
import { LANDING_ASSETS } from "../assets";
import { useReducedMotion } from "../hooks";

/**
 * S3 product demo — a self-contained, deterministic 15s clip of the real flow,
 * coded (no AI video / external assets) so it stays crisp and screen-recordable.
 *
 * Timeline (the stepper advances each stage):
 *   0:00–0:03  TEST   — board from a FEN, "Best move?", select Bc5 → next position
 *   0:03–0:06  QUIZ   — a style-quiz question (level + play style), select an answer
 *   0:06–0:09  SCORE  — OpeningIQGauge sweeps + counts to 428, "Top 38%"
 *   0:09–0:12  DNA    — gauge compacts to a corner; Strategist + strongest/weakness
 *   0:12–end   ROAD   — "Train next" openings + a kingdoms-map glimpse; HOLD here
 *
 * The TEST (level) and QUIZ (style) are the two assessment inputs (GDD) — the
 * quiz is what explains the "Strategist" archetype. Autoplays once in view, holds
 * the final frame, offers a replay. prefers-reduced-motion → composed final frame.
 *
 * TODO: demo data, not live (428 · Strategist · Top 38% · quiz Q&A · strongest/weakest · train-next).
 */
const STAGE_MS = [3000, 3000, 3000, 3000] as const; // TEST→QUIZ→SCORE→DNA→ROAD

// Position 7/20 — Italian Game after 1.e4 e5 2.Nf3 Nc6 3.Bc4 (Black to move).
const POS7: MiniPosition = {
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
};
// Position 8/20 — after 3...Bc5 (the selected move, now on the board).
const POS8: MiniPosition = {
  ranks: [
    "r.bqk.nr",
    "pppp.ppp",
    "..n.....",
    "..b.p...",
    "..B.P...",
    ".....N..",
    "PPPP.PPP",
    "RNBQK..R",
  ],
  highlight: [3, 2], // c5
};

const TRAIN_NEXT = ["Caro-Kann", "French", "Nimzo-Indian"]; // TODO: demo data
const MAP = [
  { name: "Italian", conquered: true },
  { name: "London" },
  { name: "Caro-Kann" },
  { name: "French" },
  { name: "Sicilian" },
];

// Style-quiz sample (QUESTION 5 / 16). TODO: demo data, not live.
const QUIZ_QUESTION = "You reach a winning position. You…";
const QUIZ_OPTIONS = ["Go for the kill", "Convert slowly", "Set one last trap"];
const QUIZ_PICK = 1; // "Convert slowly" → hints the Strategist archetype

const STEPS = ["Test", "Quiz", "Score", "DNA", "Road to Elo"] as const;

export function ProductDemoS3() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const [inView, setInView] = useState(false);
  const [runId, setRunId] = useState(0);
  const [stage, setStage] = useState(0); // 0 TEST·1 QUIZ·2 SCORE·3 DNA·4 ROAD
  const [testStep, setTestStep] = useState(0); // 0 idle · 1 select · 2 confirm · 3 advance
  const [quizPicked, setQuizPicked] = useState(false);

  // Toggle inView (don't latch) so the clip restarts each time it re-enters view
  // — the visitor reliably catches the animation from the top, not the held end
  // frame. A higher threshold starts it once the card is properly on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => setInView(!!e?.isIntersecting),
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Master timeline (deterministic). Reduced-motion → final frame. All state
  // changes run from timer callbacks (never synchronously in the effect body).
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      const t = setTimeout(() => {
        setStage(4);
        setTestStep(3);
        setQuizPicked(true);
      }, 0);
      return () => clearTimeout(t);
    }
    const t1 = STAGE_MS[0];
    const t2 = t1 + STAGE_MS[1];
    const t3 = t2 + STAGE_MS[2];
    const t4 = t3 + STAGE_MS[3];
    const timers = [
      setTimeout(() => {
        setStage(0);
        setTestStep(0);
        setQuizPicked(false);
      }, 0),
      setTimeout(() => setStage(1), t1),
      setTimeout(() => setStage(2), t2),
      setTimeout(() => setStage(3), t3),
      setTimeout(() => setStage(4), t4),
    ];
    return () => timers.forEach(clearTimeout);
  }, [inView, reduce, runId]);

  // TEST sub-beats: select Bc5 → confirm → advance one position.
  useEffect(() => {
    if (!inView || reduce || stage !== 0) return;
    const timers = [
      setTimeout(() => setTestStep(1), 900),
      setTimeout(() => setTestStep(2), 1700),
      setTimeout(() => setTestStep(3), 2300),
    ];
    return () => timers.forEach(clearTimeout);
  }, [inView, reduce, stage, runId]);

  // QUIZ sub-beat: tap an answer.
  useEffect(() => {
    if (!inView || reduce || stage !== 1) return;
    const t = setTimeout(() => setQuizPicked(true), 1100);
    return () => clearTimeout(t);
  }, [inView, reduce, stage, runId]);

  const compact = stage >= 3;
  const advanced = testStep >= 3;

  return (
    <Panel variant="ornate" className="mx-auto w-full max-w-xl">
      <div ref={ref} className="p-5 sm:p-6">
        <div className="relative h-[21rem] overflow-hidden sm:h-[20rem]">
          {/* ---- TEST ---- */}
          <Layer show={stage === 0}>
            <p className="text-[0.6rem] uppercase tracking-[0.2em] text-text-low">
              Position {advanced ? 8 : 7} / 20
            </p>
            <div className="mt-2">
              <MiniBoard
                position={
                  advanced
                    ? POS8
                    : testStep >= 1
                      ? { ...POS7, highlight: [3, 2] }
                      : POS7
                }
                size={150}
              />
            </div>
            <p className="mt-2 text-[0.72rem] font-medium text-text-hi">
              Best move?
            </p>
            <div className="mt-2 grid w-44 grid-cols-2 gap-2">
              <MoveButton label="Bc5" selected={testStep >= 1} confirmed={testStep >= 2} />
              <MoveButton label="Nf6" />
            </div>
          </Layer>

          {/* ---- QUIZ (style + level) ---- */}
          <Layer show={stage === 1}>
            <p className="max-w-[20rem] text-[0.62rem] text-text-low">
              A few quick questions on your level and how you play
            </p>
            <p className="mt-2 text-[0.6rem] uppercase tracking-[0.2em] text-text-low">
              Question 5 / 16
            </p>
            <p className="mt-1 font-display text-base font-bold text-text-hi">
              {QUIZ_QUESTION}
            </p>
            <div className="mt-3 flex w-full max-w-[18rem] flex-col gap-2">
              {QUIZ_OPTIONS.map((o, i) => {
                const sel = quizPicked && i === QUIZ_PICK;
                return (
                  <span
                    key={o}
                    className={`inline-flex items-center justify-between rounded-chip border px-3 py-1.5 text-[0.72rem] font-medium transition-colors duration-300 ${
                      sel
                        ? "border-gold bg-gold/15 text-gold shadow-[0_0_14px_-4px_rgba(227,178,60,0.8)]"
                        : "border-hairline text-text-mid"
                    }`}
                  >
                    {o}
                    {sel && <span aria-hidden>✓</span>}
                  </span>
                );
              })}
            </div>
          </Layer>

          {/* ---- GAUGE (persists SCORE → ROAD; travels + compacts) ---- */}
          {stage >= 2 && (
            <div
              className="absolute z-10 transition-all duration-700 ease-out"
              style={{
                top: compact ? "16%" : "47%",
                left: compact ? "80%" : "50%",
                transform: `translate(-50%, -50%) scale(${compact ? 0.5 : 1})`,
              }}
            >
              <OpeningIQGauge value={428} size={168} />
            </div>
          )}
          {/* SCORE caption */}
          <div
            className="pointer-events-none absolute inset-x-0 top-[74%] text-center transition-opacity duration-500"
            style={{ opacity: stage === 2 ? 1 : 0 }}
          >
            <span className="rounded-chip border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-[0.66rem] font-semibold text-gold">
              Top 38%
            </span>
          </div>

          {/* ---- DNA ---- */}
          <Layer show={stage === 3}>
            <div className="relative flex h-20 w-20 items-center justify-center">
              <span
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, var(--color-strategist), transparent 70%)",
                  opacity: 0.45,
                }}
              />
              <Image
                src={LANDING_ASSETS.crests.strategist}
                alt=""
                width={72}
                height={72}
                className="relative h-16 w-16 object-contain [mix-blend-mode:screen]"
              />
            </div>
            <p className="mt-1 font-display text-2xl font-bold text-strategist">
              Strategist
            </p>
            <div className="mt-3 w-full max-w-[18rem] space-y-1.5">
              <StatRow label="Strongest opening" value="Queen's Gambit" color="#2FB67A" />
              <StatRow label="Biggest weakness" value="Sicilian Defense" color="#E0413B" />
            </div>
          </Layer>

          {/* ---- ROAD TO ELO (final frame) ---- */}
          <Layer show={stage === 4}>
            <div className="flex items-center gap-1.5">
              <Image
                src={LANDING_ASSETS.crests.strategist}
                alt=""
                width={20}
                height={20}
                className="h-[18px] w-[18px] object-contain [mix-blend-mode:screen]"
              />
              <span className="font-display text-sm font-bold text-strategist">
                Strategist
              </span>
              <span className="text-[0.62rem] text-text-low">· Top 38%</span>
            </div>

            <p className="mt-3 text-[0.6rem] uppercase tracking-[0.2em] text-text-low">
              Train these next
            </p>
            <ul className="mt-2 flex flex-wrap justify-center gap-2">
              {TRAIN_NEXT.map((name, i) => (
                <li
                  key={name}
                  className="flex items-center gap-1.5 rounded-chip border border-gold/40 bg-gold/10 px-2.5 py-1 text-[0.7rem] font-medium text-gold"
                  style={
                    stage === 4
                      ? { animation: `chq-node 0.45s ${0.15 + i * 0.25}s both` }
                      : undefined
                  }
                >
                  <span aria-hidden>♟</span>
                  {name}
                </li>
              ))}
            </ul>

            {/* kingdoms-map glimpse */}
            <div className="mt-4 flex items-end gap-2">
              {MAP.map((m, i) => (
                <div key={m.name} className="flex flex-col items-center gap-1">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-[0.62rem] ${
                      m.conquered
                        ? "border border-gold bg-gold/20 text-gold shadow-[0_0_12px_-2px_rgba(227,178,60,0.8)]"
                        : "border border-hairline bg-abyss/70 text-text-low"
                    }`}
                  >
                    {m.conquered ? "★" : "🔒"}
                  </span>
                  {i === 0 && (
                    <span className="text-[0.5rem] text-gold">{m.name}</span>
                  )}
                </div>
              ))}
            </div>
          </Layer>
        </div>

        {/* stepper + replay */}
        <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-3">
          <Stepper stage={stage} />
          <button
            type="button"
            onClick={() => setRunId((r) => r + 1)}
            className={`inline-flex items-center gap-1 rounded-chip border border-gold/45 bg-gold/10 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wide text-gold transition-all duration-300 hover:bg-gold/20 ${
              stage === 4 && !reduce
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
            aria-label="Replay the demo"
          >
            ↻ Replay
          </button>
        </div>
      </div>
    </Panel>
  );
}

function Layer({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center transition-opacity duration-500"
      style={{ opacity: show ? 1 : 0, pointerEvents: show ? "auto" : "none" }}
      aria-hidden={!show}
    >
      {children}
    </div>
  );
}

function MoveButton({
  label,
  selected = false,
  confirmed = false,
}: {
  label: string;
  selected?: boolean;
  confirmed?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center gap-1 rounded-chip border py-1.5 text-[0.72rem] font-semibold transition-colors duration-300 ${
        selected
          ? "border-gold bg-gold/15 text-gold shadow-[0_0_14px_-4px_rgba(227,178,60,0.8)]"
          : "border-hairline text-text-mid"
      }`}
    >
      {label}
      {confirmed && <span aria-hidden>✓</span>}
    </span>
  );
}

function StatRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-hairline/70 bg-surface/60 px-2.5 py-1">
      <span className="flex items-center gap-1.5 text-[0.6rem] uppercase tracking-wide text-text-low">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        {label}
      </span>
      <span className="text-[0.72rem] font-medium text-text-hi">{value}</span>
    </div>
  );
}

function Stepper({ stage }: { stage: number }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-1.5">
          {i > 0 && <span className="h-px w-3 bg-hairline" aria-hidden />}
          <span
            className={`rounded-chip px-2 py-0.5 text-[0.56rem] font-semibold uppercase tracking-wide transition-colors duration-300 ${
              i === stage ? "bg-gold/15 text-gold" : "text-text-low"
            }`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
