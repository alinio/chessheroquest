import { DNACard } from "../components/DNACard";
import { OpeningIQGauge } from "../components/OpeningIQGauge";
import { ArchetypeCard } from "../components/ArchetypeCard";
import { Reveal } from "../components/Reveal";
import { WHAT_YOU_GET } from "../copy";
import { ARCHETYPES, EXAMPLE_DNA } from "../exampleData";

/**
 * S3 · What you get (kickoff §S3) — the expanded reward. Shows the actual
 * artifacts you walk away with: the Opening IQ Gauge, the DNA Card, and the four
 * archetype crests. Copy verbatim.
 */
export function WhatYouGet() {
  return (
    <section className="relative border-t border-hairline bg-surface/40 px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-bold leading-tight text-text-hi sm:text-4xl">
              {WHAT_YOU_GET.h2}
            </h2>
          </Reveal>
          <Reveal index={1}>
            <p className="mt-5 text-base leading-relaxed text-text-mid sm:text-lg">
              {WHAT_YOU_GET.body}
            </p>
          </Reveal>
        </div>

        {/* IQ Gauge + DNA Card */}
        <div className="mt-14 grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <Reveal className="flex justify-center">
            <OpeningIQGauge value={EXAMPLE_DNA.openingIq} />
          </Reveal>
          <Reveal index={1} className="flex justify-center md:justify-start">
            <DNACard data={EXAMPLE_DNA} />
          </Reveal>
        </div>

        {/* the four tribes */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ARCHETYPES.map((a, i) => (
            <Reveal key={a.key} index={i}>
              <ArchetypeCard archetype={a} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
