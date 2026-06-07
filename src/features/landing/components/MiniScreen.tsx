import Image from "next/image";
import { LANDING_ASSETS } from "../assets";
import { MiniBoard, type MiniPosition } from "./MiniBoard";
import { WaxSeal } from "./WaxSeal";

/**
 * Coded mini screen-mockups for the three journey steps AFTER the reveal:
 * DISCOVER → TRAIN → CONQUER. (The Opening IQ / archetype / Road-to-Elo reveal
 * lives in S3 and is intentionally NOT duplicated here.) Each fills the shared,
 * equal-height frame so the three read as one product at the same scale.
 * All sample data is illustrative. // TODO: demo data, not live.
 */
export function MiniScreen({
  kind,
}: {
  kind: "discover" | "train" | "conquer";
}) {
  if (kind === "discover") return <DiscoverScreen />;
  if (kind === "train") return <TrainScreen />;
  return <ConquerScreen />;
}

// Italian Game after 1.e4 e5 2.Nf3 Nc6 3.Bc4 — a readable test position.
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
};

/** Shared screen frame — identical across all three mockups. */
function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col justify-center rounded-xl border border-gold/30 bg-abyss/70 p-3 shadow-[inset_0_1px_0_rgba(244,206,106,0.15)]">
      {children}
    </div>
  );
}

/** DISCOVER — the free test (board thumbnail + a light badge). No reveal here. */
function DiscoverScreen() {
  return (
    <Screen>
      <div className="flex justify-center">
        <MiniBoard position={ITALIAN} size={124} />
      </div>
      <p className="mt-3 text-center text-[0.7rem] font-medium text-text-hi">
        Best move?
      </p>
      <div className="mt-2 flex justify-center">
        <span className="rounded-chip border border-gold/40 bg-gold/10 px-3 py-1 text-[0.62rem] font-semibold text-gold">
          20 positions · ~2 min · no signup
        </span>
      </div>
    </Screen>
  );
}

/** TRAIN — pick your hero + opening, keep the daily streak. */
function TrainScreen() {
  const quests = [
    { label: "Daily Quest", done: true },
    { label: "Learn your opening", done: true },
    { label: "Fix a weak line", done: false },
  ];
  return (
    <Screen>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Image
            src={LANDING_ASSETS.crests.strategist}
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 object-contain [mix-blend-mode:screen]"
          />
          <span className="text-text-low">+</span>
          <span className="relative block h-7 w-7 overflow-hidden rounded-md border border-gold/30">
            {/* opening tile — reuse existing art (public/art/tiles) */}
            <Image
              src="/art/tiles/tile-ruylopez.png"
              alt=""
              fill
              sizes="28px"
              className="object-cover"
            />
          </span>
        </div>
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

/** CONQUER — beat the Guardians/Kingdom Bosses, earn the seals. */
function ConquerScreen() {
  // earned vs locked seals (illustrative) tinted with the realm accent.
  const seals = [true, true, false, false];
  return (
    <Screen>
      <div className="mx-auto h-[150px] w-[116px] overflow-hidden rounded-lg border border-gold/30">
        {/* boss still — reuse existing art (public/art/bosses) */}
        <Image
          src="/art/bosses/boss-strategist-ruylopez.png"
          alt="An Opening Guardian"
          width={232}
          height={300}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-3 flex items-center justify-center gap-2">
        {seals.map((earned, i) => (
          <WaxSeal key={i} earned={earned} accent="#8B6CFF" size={34} />
        ))}
      </div>
      <p className="mt-2 text-center text-[0.6rem] uppercase tracking-wide text-text-low">
        Seals earned
      </p>
    </Screen>
  );
}
