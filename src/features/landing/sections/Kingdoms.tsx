import { WorldMapPreview } from "../components/WorldMapPreview";
import { BossPreview } from "../components/BossPreview";
import { PassportPreview } from "../components/PassportPreview";
import { CTAButton } from "../components/CTAButton";
import { OrnamentalDivider } from "../components/OrnamentalDivider";
import { Reveal } from "../components/Reveal";
import { KINGDOMS } from "../copy";

/**
 * S5 · Kingdoms preview (kickoff §S5 + pass 2 §7) — the gorgeous kingdom cards are
 * the hero of this section; Boss + Passport stay compact and intriguing (one
 * clarifying line each), the real mechanics discovered in the app. The CTA still
 * drives back to the free DNA Test. Copy verbatim.
 */
export function Kingdoms() {
  return (
    <section className="relative px-5 py-24">
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-bold leading-tight text-text-hi sm:text-4xl">
              {KINGDOMS.h2}
            </h2>
          </Reveal>
          <Reveal index={1}>
            <p className="mt-5 text-base leading-relaxed text-text-mid sm:text-lg">
              {KINGDOMS.body}
            </p>
          </Reveal>
          <Reveal index={2}>
            <OrnamentalDivider className="mt-8" />
          </Reveal>
        </div>

        {/* Part 1 — Kingdom Map (the hero of the section) */}
        <Reveal className="mt-12">
          <WorldMapPreview />
        </Reveal>

        {/* Parts 2 & 3 — Boss Fight + Opening Passport (compact teasers) */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Reveal>
            <BossPreview />
          </Reveal>
          <Reveal index={1}>
            <PassportPreview />
          </Reveal>
        </div>

        <Reveal className="mt-12 flex justify-center">
          <CTAButton section="kingdoms" label={KINGDOMS.ctaLabel} />
        </Reveal>
      </div>
    </section>
  );
}
