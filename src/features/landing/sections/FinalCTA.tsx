import { EmbersOverlay } from "../components/EmbersOverlay";
import { CTAButton } from "../components/CTAButton";
import { Reveal } from "../components/Reveal";
import { FINAL } from "../copy";

/**
 * S6 · Final CTA (kickoff §S6). The last loud moment — the same one action,
 * free. Copy verbatim. The "final" section fires `final_cta_click`.
 */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-hairline bg-abyss px-5 py-28">
      <EmbersOverlay />
      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-black leading-tight text-text-hi sm:text-5xl">
            {FINAL.h2}
          </h2>
        </Reveal>
        <Reveal index={1}>
          <p className="mt-5 text-base leading-relaxed text-text-mid sm:text-lg">
            {FINAL.body}
          </p>
        </Reveal>
        <Reveal index={2}>
          <div className="mt-9 flex flex-col items-center gap-3">
            <CTAButton section="final" label={FINAL.ctaLabel} />
            <p className="text-xs text-text-low">{FINAL.microcopy}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
