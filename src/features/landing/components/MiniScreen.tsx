import Image from "next/image";
import { MiniBoard, type MiniPosition } from "./MiniBoard";
import { WaxSeal } from "./WaxSeal";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { fenAfter } from "@/src/domain/repertoire/line";

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

/** FEN board field → MiniBoard ranks ("." for empties). */
function ranksFromFen(fen: string): string[] {
  return fen
    .split(" ")[0]!
    .split("/")
    .map((row) => row.replace(/\d/g, (d) => ".".repeat(Number(d))));
}

// The TRAIN mock shows a REAL drill position: the Caro-Kann's second curated
// line (vs the Advance), at the ply where it is Black — the player — to move.
// Derived via fenAfter over the real path (LAW #2: never a hand-drawn diagram).
const CARO_LINE_2 = STARTER_PATHS.find((p) => p.id === "caro-kann-advance");
const TRAIN_POS: MiniPosition | null = CARO_LINE_2
  ? { ranks: ranksFromFen(fenAfter(CARO_LINE_2, 5)) }
  : null;

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
          8 positions · ~2 min · no signup
        </span>
      </div>
    </Screen>
  );
}

/** TRAIN — a real drill moment: your line, your move, your streak. */
function TrainScreen() {
  return (
    <Screen>
      <div className="mb-2 flex items-center justify-end">
        <span className="inline-flex items-center gap-1 rounded-chip border border-gold/40 bg-gold/10 px-2 py-0.5 text-[0.62rem] font-semibold text-gold">
          <span className="animate-[chq-crest-pulse_2s_ease-in-out_infinite]">
            🔥
          </span>
          12-day streak
        </span>
      </div>
      <div className="flex justify-center">
        {TRAIN_POS ? <MiniBoard position={TRAIN_POS} size={116} /> : null}
      </div>
      <div className="mt-3 flex justify-center">
        <span className="rounded-chip border border-gold/40 bg-gold/10 px-3 py-1 text-[0.62rem] font-semibold text-gold">
          Your move — Caro-Kann, line 2
        </span>
      </div>
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
          src="/art/bosses/boss-strategist-ruylopez.webp"
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
