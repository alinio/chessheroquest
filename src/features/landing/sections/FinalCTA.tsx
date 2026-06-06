import { CTAButton } from "../components/CTAButton";
import { Microcopy } from "../components/Microcopy";
import { Panel } from "../components/Panel";
import { SectionBackdrop } from "../components/SectionBackdrop";
import { Reveal } from "../components/Reveal";
import { LANDING_ASSETS } from "../assets";
import { FINAL } from "../copy";

/**
 * S6 · Final CTA (kickoff §S6 + pass 2 §3) — the last loud moment inside an ornate
 * frame, a radial gold glow behind the CTA and a faint echo of the hero king.
 * Copy verbatim; "IQ — free." kept on one line. Fires `final_cta_click`.
 */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden px-5 py-28">
      <SectionBackdrop
        video={LANDING_ASSETS.backdrops.hall.video}
        poster={LANDING_ASSETS.backdrops.hall.poster}
        opacity={0.5}
      />
      {/* faint king echo */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[15rem] leading-none text-gold/[0.04] sm:text-[22rem]"
      >
        ♔
      </span>
      {/* radial gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_45%_at_50%_55%,rgba(227,178,60,0.12),transparent_70%)]"
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
