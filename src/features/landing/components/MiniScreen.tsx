import Image from "next/image";
import { LANDING_ASSETS } from "../assets";
import { MiniBoard, type MiniPosition } from "./MiniBoard";
import { OpeningIQGauge } from "./OpeningIQGauge";

/**
 * Coded mini screen-mockups for the three steps (Round 2 §4 + fix). Each fills a
 * shared, equal-height frame (same padding / radius / border / bg) so the three
 * read as ONE product at the SAME scale. Content is vertically centered.
 */
export function MiniScreen({ kind }: { kind: "test" | "result" | "train" }) {
  if (kind === "test") return <TestScreen />;
  if (kind === "result") return <ResultScreen />;
  return <TrainScreen />;
}

// Italian Game after 1.e4 e5 2.Nf3 Nc6 3.Bc4 — an early, readable opening.
const ITALIAN: MiniPosition = {
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
};

/** Shared screen frame — identical across all three mockups. */
function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col justify-center rounded-xl border border-gold/30 bg-abyss/70 p-3 shadow-[inset_0_1px_0_rgba(244,206,106,0.15)]">
      {children}
    </div>
  );
}

function TestScreen() {
  return (
    <Screen>
      <p className="mb-1.5 text-[0.58rem] uppercase tracking-wide text-text-low">
        Position 7 / 20
      </p>
      <div className="flex justify-center">
        <MiniBoard position={ITALIAN} size={120} />
      </div>
      <p className="mt-1.5 text-center text-[0.68rem] font-medium text-text-hi">
        Best move?
      </p>
      <div className="mt-1.5 grid grid-cols-2 gap-2">
        <span className="rounded-chip border border-gold/40 bg-gold/10 py-1 text-center text-[0.68rem] font-semibold text-gold">
          Bc5
        </span>
        <span className="rounded-chip border border-hairline py-1 text-center text-[0.68rem] text-text-mid">
          Nf6
        </span>
      </div>
    </Screen>
  );
}

function ResultScreen() {
  return (
    <Screen>
      <div className="flex flex-col items-center">
        <OpeningIQGauge value={428} size={112} />
        <div className="mt-1.5 flex items-center gap-1.5">
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
        <span className="text-[0.6rem] uppercase tracking-wide text-text-low">
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
