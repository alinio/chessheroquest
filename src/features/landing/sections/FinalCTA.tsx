import { CTAButton } from "../components/CTAButton";
import { Microcopy } from "../components/Microcopy";
import { Panel } from "../components/Panel";
import { SectionBackdrop } from "../components/SectionBackdrop";
import { Reveal } from "../components/Reveal";
import { LANDING_ASSETS } from "../assets";
import { FINAL } from "../copy";

/**
 * S6 · Final CTA — the closing hero moment. The luminous king-in-the-cathedral
 * loop plays behind a translucent glass CTA panel so the altar glow reads through
 * it. SectionBackdrop handles video + poster + reduced-motion / mobile fallback.
 * Fires `final_cta_click`.
 */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden px-5 py-28">
      <SectionBackdrop
        video={LANDING_ASSETS.kingHall.video}
        poster={LANDING_ASSETS.kingHall.poster}
        opacity={0.85}
        dim={0.5}
      />

      <Reveal className="relative mx-auto max-w-2xl">
        <Panel
          variant="glass"
          transparent
          innerClassName="px-6 py-12 text-center sm:px-12"
        >
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
