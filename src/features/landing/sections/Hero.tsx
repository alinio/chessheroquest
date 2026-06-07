import { HeroMedia } from "../components/HeroMedia";
import { CTAButton } from "../components/CTAButton";
import { SocialProof } from "../components/SocialProof";
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
            <p className="mt-5 max-w-md text-xs leading-relaxed text-text-low">
              Powered by Stockfish and millions of real master games — real
              analysis, never guesswork.
            </p>
          </Reveal>
          <Reveal index={4}>
            <div className="mt-7">
              <CTAButton section="hero" label={HERO.ctaLabel} />
            </div>
          </Reveal>
          <Reveal index={5}>
            <SocialProof className="mt-6 justify-center md:justify-start" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
