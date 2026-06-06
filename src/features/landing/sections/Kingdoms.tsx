import { WorldMapPreview } from "../components/WorldMapPreview";
import { BossPreview } from "../components/BossPreview";
import { PassportPreview } from "../components/PassportPreview";
import { EmbersOverlay } from "../components/EmbersOverlay";
import { CTAButton } from "../components/CTAButton";
import { Reveal } from "../components/Reveal";
import { KINGDOMS } from "../copy";

/**
 * S5 · Kingdoms preview (kickoff §S5) — compact 3-part: Map · Boss · Passport
 * (LOCKED §11.5). Shows the post-test game without leaving the funnel: the CTA
 * still drives back to the free DNA Test. Copy verbatim.
 */
export function Kingdoms() {
  return (
    <section className="relative overflow-hidden border-t border-hairline bg-surface/40 px-5 py-24">
      <EmbersOverlay />
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
        </div>

        {/* Part 1 — Kingdom Map */}
        <Reveal className="mt-12">
          <WorldMapPreview />
        </Reveal>

        {/* Parts 2 & 3 — Boss Fight + Opening Passport */}
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
