import { ARCHETYPE_BY_KEY, type ExampleDnaResult } from "../exampleData";
import { Panel } from "./Panel";
import { AnimatedCrest } from "./AnimatedCrest";

/**
 * The landing DNA Card (kickoff §6 + pass 2 §2) — THE main visual CTA driver and
 * the viral artifact, styled as a collectible RPG card: ornate glass frame with
 * an archetype-colored glow rim (violet = Strategist), filigree corners, a foil
 * sheen on hover, and the Opening IQ as glowing treasure. Not a SaaS panel.
 *
 * The crest PNG sits on pure black, so `mix-blend-mode: screen` drops the
 * background over the dark card (assets §3).
 */
interface DNACardProps {
  data: ExampleDnaResult;
  /** The hero card is illustrative → tag it "EXAMPLE" (guardrail §9). */
  showExampleTag?: boolean;
  className?: string;
}

export function DNACard({
  data,
  showExampleTag = true,
  className = "",
}: DNACardProps) {
  const meta = ARCHETYPE_BY_KEY[data.archetype];

  return (
    <Panel
      variant="glass"
      glow={meta.colorVar}
      interactive
      className={`w-full max-w-sm ${className}`}
      innerClassName="px-6 pb-6 pt-5"
    >
      {/* archetype foil accent at the top edge */}
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${meta.colorVar}, transparent)`,
        }}
        aria-hidden
      />

      <header className="flex items-center justify-between">
        <p className="font-display text-text-low text-[0.62rem] uppercase tracking-[0.32em]">
          Your Chess DNA
        </p>
        {showExampleTag && (
          <span className="rounded-chip border border-hairline px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-text-low">
            Example
          </span>
        )}
      </header>

      {/* archetype crest + name — clipped to a dark "coin" so the crest reads
          cleanly even on the glass card (backdrop-blur isolates mix-blend). */}
      <div className="mt-4 flex flex-col items-center">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at center, ${meta.colorVar}55, transparent 72%)`,
            }}
          />
          <div className="relative h-[4.6rem] w-[4.6rem] overflow-hidden rounded-full bg-abyss/80 ring-1 ring-gold/25">
            <AnimatedCrest
              archetype={data.archetype}
              size={74}
              className="h-full w-full"
            />
          </div>
        </div>
        <p
          className="font-display mt-2 text-lg font-bold tracking-wide"
          style={{ color: meta.colorVar }}
        >
          {meta.label}
        </p>
      </div>

      {/* The hero number — Opening IQ as glowing gold treasure */}
      <div className="mt-4 text-center">
        <p className="font-display text-text-mid text-[0.62rem] uppercase tracking-[0.25em]">
          Opening IQ
        </p>
        <p
          className="font-display text-gold-bright mt-1 text-6xl font-black leading-none tabular-nums"
          style={{ textShadow: "0 0 28px rgba(227,178,60,0.45)" }}
        >
          {data.openingIq}
        </p>
        <p className="text-text-mid mt-1 text-sm">Top {data.topPercent}%</p>
      </div>

      {/* best opening / biggest weakness */}
      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-card border border-hairline/60 bg-abyss/40 p-3">
          <dt className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wide text-text-low">
            <span className="text-state-solid" aria-hidden>
              ◆
            </span>
            Best Opening
          </dt>
          <dd className="mt-0.5 font-medium text-text-hi">{data.bestOpening}</dd>
        </div>
        <div className="rounded-card border border-hairline/60 bg-abyss/40 p-3">
          <dt className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wide text-text-low">
            <span className="text-state-leak" aria-hidden>
              ▲
            </span>
            Biggest Weakness
          </dt>
          <dd className="mt-0.5 font-medium text-text-hi">
            {data.biggestWeakness}
          </dd>
        </div>
      </dl>

      <footer className="mt-5 text-center text-[0.62rem] uppercase tracking-[0.25em] text-text-low">
        chessheroquest.com
      </footer>
    </Panel>
  );
}
