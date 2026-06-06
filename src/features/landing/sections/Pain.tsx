import { CTAButton } from "../components/CTAButton";
import { Microcopy } from "../components/Microcopy";
import { OrnamentalDivider } from "../components/OrnamentalDivider";
import { Reveal } from "../components/Reveal";
import { PAIN } from "../copy";

/**
 * S2 · Pain (kickoff §S2 + pass 2 §3). Names the frustration over a dramatic
 * backdrop — an oversized fallen-king silhouette and a low ominous ember glow —
 * not a black void. Copy verbatim.
 */
export function Pain() {
  return (
    <section className="relative overflow-hidden px-5 py-28">
      {/* oversized faint king silhouette */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[16rem] leading-none text-text-hi/[0.035] sm:text-[26rem]"
      >
        ♚
      </span>
      {/* low ominous ember glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(55%_60%_at_50%_100%,rgba(193,57,43,0.13),transparent_72%)]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-bold leading-tight text-text-hi sm:text-4xl">
            {PAIN.h2}
          </h2>
        </Reveal>
        <Reveal index={1}>
          <OrnamentalDivider className="mt-6" />
        </Reveal>
        <Reveal index={2}>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-mid sm:text-lg">
            {PAIN.body}
          </p>
        </Reveal>
        <Reveal index={3}>
          <div className="mt-9 inline-flex flex-col items-center gap-3">
            <CTAButton section="pain" label={PAIN.ctaLabel} />
            <Microcopy items={["Free", "no signup to begin", "~2 minutes"]} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
