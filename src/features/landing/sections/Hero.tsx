import { HeroMedia } from "../components/HeroMedia";
import { CTAButton } from "../components/CTAButton";
import { Microcopy } from "../components/Microcopy";
import { Reveal } from "../components/Reveal";
import { HERO } from "../copy";
import type { HeadlineCopy } from "../variants";

/**
 * S1 · Hero — single full-bleed visual (Round 2 hero rebuild / Option B). ONE
 * background layer (cinematic video + mandatory poster) and ONE content layer;
 * no split column, no DNA card fighting the king animation. Content is left on
 * desktop, centered on mobile. The channel-aware H1 is resolved on the server.
 */
export function Hero({ headline }: { headline: HeadlineCopy }) {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <HeroMedia />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-24">
        <div className="mx-auto max-w-[620px] text-center md:mx-0 md:text-left">
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
            <p className="mx-auto mt-5 max-w-md text-base text-text-mid sm:text-lg md:mx-0">
              {headline.sub}
            </p>
          </Reveal>
          <Reveal index={3}>
            <div className="mt-8 inline-flex flex-col items-center gap-3 md:items-start">
              <CTAButton section="hero" label={HERO.ctaLabel} />
              <Microcopy items={["Free", "no signup to begin", "~2 minutes"]} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
