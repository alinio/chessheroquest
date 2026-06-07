import { Panel } from "../components/Panel";
import { MiniScreen } from "../components/MiniScreen";
import { OrnamentalDivider } from "../components/OrnamentalDivider";
import { Reveal } from "../components/Reveal";
import { HOW_IT_WORKS } from "../copy";

/**
 * S4 · How it works. Three equal-height cards = the journey AFTER the reveal:
 * DISCOVER → TRAIN → CONQUER. (The Opening IQ / archetype / Road-to-Elo reveal is
 * owned by S3 "See the game behind your games" — not duplicated here.) Each card:
 * fixed-height mockup zone → phase eyebrow + number badge + title → description.
 */
const SCREEN_BY_STEP = ["discover", "train", "conquer"] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-20 px-5 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="font-display text-center text-3xl font-bold leading-tight text-text-hi sm:text-4xl">
            {HOW_IT_WORKS.h2}
          </h2>
        </Reveal>
        <Reveal index={1}>
          <OrnamentalDivider className="mt-8" />
        </Reveal>

        <ol className="mt-12 grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          {HOW_IT_WORKS.steps.map((step, i) => (
            <Reveal key={step.n} index={i} as="li" className="h-full">
              <Panel
                variant="ornate"
                interactive
                className="h-full"
                innerClassName="flex h-full flex-col p-5"
              >
                {/* fixed mockup zone → keeps every title row on the same line */}
                <div className="h-[244px]">
                  <MiniScreen kind={SCREEN_BY_STEP[i] ?? "discover"} />
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <span className="font-display inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/50 text-base font-black text-gold">
                    {step.n}
                  </span>
                  <div>
                    <p className="font-display text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-gold">
                      {step.phase}
                    </p>
                    <h3 className="font-display text-base font-bold leading-tight text-text-hi">
                      {step.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#E9E9EE]">
                  {step.body}
                </p>
              </Panel>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
