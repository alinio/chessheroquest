import { CTAButton } from "../components/CTAButton";
import { Reveal } from "../components/Reveal";
import { PAIN } from "../copy";

/**
 * S2 · Pain (kickoff §S2). Names the frustration, then points at the one score
 * that fixes the "where do I even stand?" problem. Copy verbatim.
 */
export function Pain() {
  return (
    <section className="relative border-t border-hairline bg-abyss px-5 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-bold leading-tight text-text-hi sm:text-4xl">
            {PAIN.h2}
          </h2>
        </Reveal>
        <Reveal index={1}>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-mid sm:text-lg">
            {PAIN.body}
          </p>
        </Reveal>
        <Reveal index={2}>
          <div className="mt-9 flex justify-center">
            <CTAButton section="pain" label={PAIN.ctaLabel} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
