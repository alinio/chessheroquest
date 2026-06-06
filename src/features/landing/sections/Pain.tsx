import { CTAButton } from "../components/CTAButton";
import { Microcopy } from "../components/Microcopy";
import { OrnamentalDivider } from "../components/OrnamentalDivider";
import { SectionBackdrop } from "../components/SectionBackdrop";
import { Reveal } from "../components/Reveal";
import { LANDING_ASSETS } from "../assets";
import { PAIN } from "../copy";

/**
 * S2 · Pain (kickoff §S2 + pass 2 §3 + assets v2). Names the frustration over the
 * ominous board backdrop (bg-pain video, dark gradient overlay) plus a low ember
 * glow — not a black void. Copy verbatim.
 */
export function Pain() {
  return (
    <section className="relative overflow-hidden px-5 py-28">
      <SectionBackdrop
        video={LANDING_ASSETS.backdrops.pain.video}
        poster={LANDING_ASSETS.backdrops.pain.poster}
        opacity={0.38}
      />
      {/* low ominous ember glow over the board */}
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
