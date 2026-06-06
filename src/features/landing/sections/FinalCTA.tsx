import Image from "next/image";
import { CTAButton } from "../components/CTAButton";
import { Microcopy } from "../components/Microcopy";
import { Panel } from "../components/Panel";
import { Reveal } from "../components/Reveal";
import { LANDING_ASSETS } from "../assets";
import { FINAL } from "../copy";

/**
 * S6 · Final CTA (kickoff §S6 + Round 2 §8) — the closing hero moment. The
 * luminous king-in-the-cathedral image sits behind a glass CTA panel so the
 * altar glow reads around/through it; a soft top/bottom gradient keeps the
 * headline legible. Static image → no LCP/motion cost, works on mobile +
 * reduced-motion. Fires `final_cta_click`.
 */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden px-5 py-28">
      {/* cathedral-king backdrop */}
      <Image
        src={LANDING_ASSETS.kingHall}
        alt=""
        fill
        sizes="100vw"
        aria-hidden
        className="object-cover"
      />
      {/* legibility — darken top/bottom, let the king glow through the middle */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-abyss/85 via-abyss/35 to-abyss/90"
      />

      <Reveal className="relative mx-auto max-w-2xl">
        <Panel variant="glass" innerClassName="px-6 py-12 text-center sm:px-12">
          <h2 className="font-display text-3xl font-black leading-tight text-text-hi sm:text-5xl [text-wrap:balance]">
            Discover your Opening{" "}
            <span className="whitespace-nowrap">IQ — free.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-text-mid sm:text-lg">
            {FINAL.body}
          </p>
          <div className="mt-9 flex flex-col items-center gap-3">
            <CTAButton section="final" label={FINAL.ctaLabel} />
            <Microcopy items={["Free", "~2 minutes", "no signup to begin"]} />
          </div>
        </Panel>
      </Reveal>
    </section>
  );
}
