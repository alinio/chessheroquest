import Image from "next/image";
import type { CSSProperties } from "react";
import { LANDING_ASSETS } from "../assets";
import { ARCHETYPE_BY_KEY, type ExampleDnaResult } from "../exampleData";

/**
 * The landing DNA Card (kickoff §6) — THE main visual CTA driver and the viral
 * artifact. A precious object: thin gold border, dark glass, archetype-tinted
 * crest, the Opening IQ as glowing treasure. Screenshot/share-clean.
 *
 * Server component (no interactivity) → ships in the SSR HTML for SEO and instant
 * paint. The crest PNG sits on pure black, so `mix-blend-mode: screen` drops the
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
  const tint: CSSProperties = { color: meta.colorVar };
  const tintBg: CSSProperties = { backgroundColor: meta.colorVar };

  return (
    <article
      className={`relative w-full max-w-sm overflow-hidden rounded-card border border-gold/40 bg-surface/70 p-6 shadow-2xl backdrop-blur-xl ${className}`}
      style={{ boxShadow: "0 28px 70px -16px rgba(0,0,0,0.8)" }}
    >
      {/* archetype color wash at the top edge */}
      <div className="absolute inset-x-0 top-0 h-1" style={tintBg} aria-hidden />

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

      {/* archetype crest + name */}
      <div className="mt-4 flex flex-col items-center">
        <div
          className="relative flex h-24 w-24 items-center justify-center rounded-full"
          style={{
            background: `radial-gradient(circle at center, ${meta.colorVar}33, transparent 70%)`,
          }}
        >
          <Image
            src={LANDING_ASSETS.crests[data.archetype]}
            alt={`${meta.label} crest`}
            width={96}
            height={96}
            className="h-20 w-20 object-contain [mix-blend-mode:screen]"
          />
        </div>
        <p
          className="font-display mt-2 text-lg font-bold tracking-wide"
          style={tint}
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
        <div className="rounded-card bg-raised p-3">
          <dt className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wide text-text-low">
            <span className="text-state-solid" aria-hidden>
              ◆
            </span>
            Best Opening
          </dt>
          <dd className="mt-0.5 font-medium text-text-hi">{data.bestOpening}</dd>
        </div>
        <div className="rounded-card bg-raised p-3">
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
    </article>
  );
}
