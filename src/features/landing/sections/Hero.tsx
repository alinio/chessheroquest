import { HeroMedia } from "../components/HeroMedia";
import { EmbersOverlay } from "../components/EmbersOverlay";
import { DNACard } from "../components/DNACard";
import { CTAButton } from "../components/CTAButton";
import { Reveal } from "../components/Reveal";
import { HERO } from "../copy";
import { EXAMPLE_DNA } from "../exampleData";
import type { HeadlineCopy } from "../variants";

/**
 * S1 · Hero (kickoff §S1). Cinematic background with the H1 + DNA Card over the
 * negative space (left on desktop, top on mobile). The DNA Card is the
 * centerpiece visual; the board art is only ambiance (kickoff §1).
 *
 * The H1/sub are channel-aware (§4) and resolved on the server → in the SSR HTML.
 */
export function Hero({ headline }: { headline: HeadlineCopy }) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
      <HeroMedia />
      <EmbersOverlay />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-5 py-16 md:grid-cols-2">
        {/* copy column (negative space) */}
        <div className="max-w-xl">
          <Reveal>
            <p className="font-display text-gold text-xs font-semibold uppercase tracking-[0.32em]">
              {headline.kicker}
            </p>
          </Reveal>
          <Reveal index={1}>
            <h1 className="font-display mt-4 text-4xl font-black leading-[1.05] text-text-hi sm:text-5xl lg:text-6xl">
              {headline.h1}
            </h1>
          </Reveal>
          <Reveal index={2}>
            <p className="mt-5 max-w-md text-base text-text-mid sm:text-lg">
              {headline.sub}
            </p>
          </Reveal>
          <Reveal index={3}>
            <div className="mt-7 flex flex-col items-start gap-3">
              <CTAButton section="hero" label={HERO.ctaLabel} />
              <p className="text-xs text-text-low">{HERO.microcopy}</p>
            </div>
          </Reveal>
        </div>

        {/* DNA Card centerpiece — glass so the cinematic shows through, floating
            with a pulsing gold halo, pushed down on desktop so the crown breathes. */}
        <Reveal index={2} className="flex justify-center md:justify-end">
          <div className="animate-[chq-float_6s_ease-in-out_infinite] [will-change:transform] md:mt-16">
            <div className="rounded-card animate-[chq-card-glow_4.5s_ease-in-out_infinite]">
              <DNACard data={EXAMPLE_DNA} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
