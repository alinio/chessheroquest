"use client";

import type { CSSProperties } from "react";
import type { Archetype } from "@/src/domain/repertoire/types";
import type { DnaResult } from "@/src/domain/dna/types";

interface ArchetypeMeta {
  label: string;
  tagline: string;
  colorVar: string;
}

/** Display metadata for each DNA tribe (master-vision §9 / DESIGN.md archetype colors). */
export const ARCHETYPE_META: Record<Archetype, ArchetypeMeta> = {
  warrior: { label: "Warrior", tagline: "Attack relentlessly", colorVar: "var(--color-warrior)" },
  strategist: { label: "Strategist", tagline: "Outmaneuver, then crush", colorVar: "var(--color-strategist)" },
  defender: { label: "Defender", tagline: "Unbreakable and patient", colorVar: "var(--color-defender)" },
  trickster: { label: "Trickster", tagline: "Surprise and bewilder", colorVar: "var(--color-trickster)" },
};

/**
 * The shareable DNA Card — the first pride object (master-vision §11, §28.12).
 * A precious object: thin gold border, deep shadow, the archetype's signature
 * color, the Opening IQ rendered as treasure. Built to be screenshot-shared.
 */
export function DnaCard({ result }: { result: DnaResult }) {
  const meta = ARCHETYPE_META[result.archetype];
  const crest: CSSProperties = { backgroundColor: meta.colorVar };

  return (
    <article
      className="bg-surface border-gold/40 relative mx-auto w-full max-w-sm overflow-hidden rounded-card border p-6 shadow-2xl"
      style={{ boxShadow: "0 24px 60px -12px rgba(0,0,0,0.7)" }}
    >
      {/* archetype color wash at the top */}
      <div className="absolute inset-x-0 top-0 h-1" style={crest} aria-hidden />

      <header className="flex items-center justify-between">
        <p className="font-display text-text-low text-[0.65rem] uppercase tracking-[0.3em]">
          Chess DNA
        </p>
        <span
          className="inline-flex h-7 items-center rounded-chip px-3 text-xs font-semibold text-abyss"
          style={crest}
        >
          {meta.label}
        </span>
      </header>

      {/* The hero number — Opening IQ as glowing gold treasure */}
      <div className="mt-6 text-center">
        <p className="font-display text-text-mid text-xs uppercase tracking-[0.25em]">
          Opening IQ
        </p>
        <p
          className="font-display text-gold-bright mt-1 text-7xl font-black leading-none tabular-nums"
          style={{ textShadow: "0 0 28px rgba(227,178,60,0.45)" }}
        >
          {result.initialIq}
        </p>
        <p className="text-text-mid mt-2 text-sm">{result.rank}</p>
      </div>

      {/* breakdown */}
      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div className="bg-raised rounded-card p-3">
          <dt className="text-text-low text-xs">Strength</dt>
          <dd className="text-text-hi mt-0.5 font-medium">
            {ARCHETYPE_META[result.strongestArchetype].label}
          </dd>
        </div>
        <div className="bg-raised rounded-card p-3">
          <dt className="text-text-low text-xs">Train next</dt>
          <dd className="text-text-hi mt-0.5 font-medium">
            {ARCHETYPE_META[result.weakestArchetype].label}
          </dd>
        </div>
      </dl>

      <footer className="text-text-low mt-6 text-center text-[0.65rem] uppercase tracking-[0.25em]">
        chessheroquest.com
      </footer>
    </article>
  );
}
