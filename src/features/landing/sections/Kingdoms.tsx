import { WorldMapPreview } from "../components/WorldMapPreview";
import { BossBlock } from "../components/BossBlock";
import { PassportBlock } from "../components/PassportBlock";
import { OrnamentalDivider } from "../components/OrnamentalDivider";
import { Reveal } from "../components/Reveal";
import { KINGDOMS } from "../copy";

/**
 * S5 · Kingdoms preview (kickoff §S5 + pass 2 §7) — the gorgeous kingdom cards are
 * the hero of this section; Boss + Passport stay compact and intriguing (one
 * clarifying line each), the real mechanics discovered in the app. The CTA still
 * drives back to the free DNA Test. Copy verbatim.
 */
export function Kingdoms() {
  return (
    <section className="relative px-5 py-24">
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-bold leading-tight text-text-hi sm:text-4xl">
              {KINGDOMS.h2}
            </h2>
          </Reveal>
          <Reveal index={1}>
            <p className="mt-5 text-base leading-relaxed text-text-mid sm:text-lg">
              {KINGDOMS.body}
            </p>
          </Reveal>
          <Reveal index={2}>
            <p className="font-display mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-gold sm:text-base">
              20 openings · 4 realms · 24 bosses to conquer
            </p>
          </Reveal>
          <Reveal index={3}>
            <OrnamentalDivider className="mt-8" />
          </Reveal>
        </div>

        {/* Part 1 — Kingdom Map (the hero of the section) */}
        <Reveal className="mt-12">
          <WorldMapPreview />
        </Reveal>

        {/* Part 2 — Boss section (guardian cinematic) */}
        <Reveal className="mt-24 sm:mt-32">
          <BossBlock />
        </Reveal>

        {/* Part 3 — Opening Passport (tome + seal stamps) */}
        <Reveal className="mt-20 sm:mt-28">
          <PassportBlock />
        </Reveal>
      </div>
    </section>
  );
}
