import { TestDemo } from "../components/TestDemo";
import { ArchetypeCard } from "../components/ArchetypeCard";
import { OrnamentalDivider } from "../components/OrnamentalDivider";
import { Reveal } from "../components/Reveal";
import { WHAT_YOU_GET } from "../copy";
import { ARCHETYPES } from "../exampleData";

/**
 * S3 · What you get (kickoff §S3 + pass 2 §4/§5) — the expanded reward, now
 * SHOWING the mechanic in coded motion (positions flash → IQ counts up → DNA Card
 * reveals) instead of a static duplicate card, plus the four archetype crests
 * with plain-language blurbs. Copy verbatim.
 */
export function WhatYouGet() {
  return (
    <section className="relative px-5 py-24">
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
          <Reveal index={2}>
            <OrnamentalDivider className="mt-8" />
          </Reveal>
        </div>

        {/* coded test demo: test → score → reveal */}
        <Reveal className="mt-12">
          <TestDemo />
        </Reveal>

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
