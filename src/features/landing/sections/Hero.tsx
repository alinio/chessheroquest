import { HeroMedia } from "../components/HeroMedia";
import { HeroDnaCard } from "../components/HeroDnaCard";
import { CTAButton } from "../components/CTAButton";
import { Microcopy } from "../components/Microcopy";
import { Reveal } from "../components/Reveal";
import { HERO } from "../copy";
import type { HeadlineCopy } from "../variants";

/**
 * S1 · Hero (kickoff §S1 + pass 2 §1). Cinematic king + H1 land first; the DNA
 * Card materializes after ~0.6s over the negative space (left on desktop, top on
 * mobile), pushed low-right so the crown + embers stay visible. The board art is
 * only ambiance (kickoff §1).
 */
export function Hero({ headline }: { headline: HeadlineCopy }) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
      <HeroMedia />

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
            <div className="mt-7 inline-flex flex-col items-center gap-3">
              <CTAButton section="hero" label={HERO.ctaLabel} />
              <Microcopy items={["Free", "no signup to begin", "~2 minutes"]} />
            </div>
          </Reveal>
        </div>

        {/* DNA Card centerpiece — delayed reveal, floating, pushed low so the
            crown breathes above it. */}
        <div className="flex justify-center md:mt-20 md:justify-end">
          <HeroDnaCard />
        </div>
      </div>
    </section>
  );
}
