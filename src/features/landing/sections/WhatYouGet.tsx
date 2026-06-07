import { ProductDemoS3 } from "../components/ProductDemoS3";
import { ArchetypeCard } from "../components/ArchetypeCard";
import { OrnamentalDivider } from "../components/OrnamentalDivider";
import { SectionBackdrop } from "../components/SectionBackdrop";
import { CTAButton } from "../components/CTAButton";
import { Reveal } from "../components/Reveal";
import { LANDING_ASSETS } from "../assets";
import { WHAT_YOU_GET, ARCHETYPE_INTRO } from "../copy";
import { ARCHETYPES } from "../exampleData";

/**
 * S3 · What you get (kickoff §S3 + pass 2 §4/§5) — the expanded reward, now
 * SHOWING the mechanic in coded motion (positions flash → IQ counts up → DNA Card
 * reveals) instead of a static duplicate card, plus the four archetype crests
 * with plain-language blurbs. Copy verbatim.
 */
export function WhatYouGet() {
  return (
    <section className="relative overflow-hidden px-5 py-24">
      <SectionBackdrop
        video={LANDING_ASSETS.backdrops.hall.video}
        poster={LANDING_ASSETS.backdrops.hall.poster}
        opacity={0.4}
      />
      <div className="relative mx-auto max-w-6xl">
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

        {/* coded 15s product demo: test → score → DNA → road to elo */}
        <Reveal className="mt-12">
          <ProductDemoS3 />
        </Reveal>

        {/* archetype intro */}
        <div className="mx-auto mt-20 max-w-2xl text-center">
          <Reveal>
            <h3 className="font-display text-2xl font-bold text-text-hi sm:text-3xl">
              {ARCHETYPE_INTRO.title}
            </h3>
          </Reveal>
          <Reveal index={1}>
            <p className="mt-3 text-base text-text-mid">{ARCHETYPE_INTRO.sub}</p>
          </Reveal>
        </div>

        {/* the four tribes */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {ARCHETYPES.map((a, i) => (
            <Reveal key={a.key} index={i}>
              <ArchetypeCard archetype={a} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex justify-center">
          <CTAButton section="hero" label={ARCHETYPE_INTRO.ctaLabel} />
        </Reveal>
      </div>
    </section>
  );
}
