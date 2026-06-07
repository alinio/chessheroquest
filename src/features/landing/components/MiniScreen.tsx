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
  highlight: [3, 2], // c5 — the answer square (…Bc5)
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
        <span className="inline-flex items-center justify-center gap-1 rounded-chip border border-gold bg-gold/15 py-1 text-center text-[0.68rem] font-semibold text-gold shadow-[0_0_14px_-4px_rgba(227,178,60,0.8)]">
          Bc5 <span aria-hidden>✓</span>
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
        <OpeningIQGauge value={428} size={92} />
        <div className="mt-1 flex items-center gap-1.5">
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
      </div>

      {/* what the report shows you */}
      <div className="mt-3 space-y-1.5">
        <StatRow label="Strongest" value="Italian Game" color="#2FB67A" />
        <StatRow label="Weakness" value="Sicilian Dragon" color="#E0413B" />
        <div className="pt-0.5">
          <div className="flex items-center justify-between text-[0.55rem] uppercase tracking-wide text-text-low">
            <span>Road to Elo</span>
            <span>1400 → 1600</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-chip border border-hairline bg-abyss">
            <div className="h-full w-2/5 rounded-chip bg-gradient-to-r from-gold-deep via-gold to-gold-bright" />
          </div>
        </div>
      </div>
    </Screen>
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
    <div className="flex items-center justify-between rounded-md border border-hairline/70 bg-surface/60 px-2 py-1">
      <span className="flex items-center gap-1.5 text-[0.6rem] uppercase tracking-wide text-text-low">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        {label}
      </span>
      <span className="text-[0.7rem] font-medium text-text-hi">{value}</span>
    </div>
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
