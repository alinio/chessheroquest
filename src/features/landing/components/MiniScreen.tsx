import Image from "next/image";
import { LANDING_ASSETS } from "../assets";
import { MiniBoard, type MiniPosition } from "./MiniBoard";
import { OpeningIQGauge } from "./OpeningIQGauge";

/**
 * Coded mini screen-mockups for the three steps (Round 2 §4) — small, realistic
 * UI previews (not AI video, not abstract icons). Swap for real screen recordings
 * once the product ships. All coded HTML/SVG in the ornate frame language.
 */
export function MiniScreen({ kind }: { kind: "test" | "result" | "train" }) {
  if (kind === "test") return <TestScreen />;
  if (kind === "result") return <ResultScreen />;
  return <TrainScreen />;
}

const DEMO_POS: MiniPosition = {
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
  highlight: [5, 5],
};

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gold/30 bg-abyss/70 p-3 shadow-[inset_0_1px_0_rgba(244,206,106,0.15)]">
      {children}
    </div>
  );
}

function TestScreen() {
  return (
    <Screen>
      <p className="mb-2 text-[0.6rem] uppercase tracking-wide text-text-low">
        Position 7 / 20
      </p>
      <div className="flex justify-center">
        <MiniBoard position={DEMO_POS} size={132} />
      </div>
      <p className="mt-2 text-center text-[0.7rem] font-medium text-text-hi">
        Best move?
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <span className="rounded-chip border border-gold/40 bg-gold/10 py-1 text-center text-[0.7rem] font-semibold text-gold">
          Bc4
        </span>
        <span className="rounded-chip border border-hairline py-1 text-center text-[0.7rem] text-text-mid">
          d3
        </span>
      </div>
    </Screen>
  );
}

function ResultScreen() {
  return (
    <Screen>
      <div className="flex flex-col items-center">
        <OpeningIQGauge value={428} size={108} />
        <div className="mt-1 flex items-center gap-1.5">
          <Image
            src={LANDING_ASSETS.crests.strategist}
            alt=""
            width={22}
            height={22}
            className="h-5 w-5 object-contain [mix-blend-mode:screen]"
          />
          <span className="font-display text-sm font-bold text-strategist">
            Strategist
          </span>
        </div>
        <span className="mt-1 text-[0.7rem] text-text-mid">Top 38%</span>
      </div>
    </Screen>
  );
}

function TrainScreen() {
  const quests = [
    { label: "Daily Quest", done: true },
    { label: "Fix a weak line", done: true },
    { label: "Beat the Italian boss", done: false },
  ];
  return (
    <Screen>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[0.62rem] uppercase tracking-wide text-text-low">
          Day streak
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-bold text-gold">
          <span className="animate-[chq-crest-pulse_2s_ease-in-out_infinite]">
            🔥
          </span>
          12
        </span>
      </div>
      <ul className="space-y-1.5">
        {quests.map((q) => (
          <li
            key={q.label}
            className="flex items-center gap-2 rounded-md border border-hairline/70 bg-surface/60 px-2 py-1.5"
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full text-[0.6rem] ${
                q.done
                  ? "bg-state-solid text-abyss"
                  : "border border-hairline text-text-low"
              }`}
            >
              {q.done ? "✓" : ""}
            </span>
            <span
              className={`text-[0.72rem] ${q.done ? "text-text-mid line-through" : "text-text-hi"}`}
            >
              {q.label}
            </span>
          </li>
        ))}
      </ul>
    </Screen>
  );
}
