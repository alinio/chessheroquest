import { Panel } from "../components/Panel";
import { MiniScreen } from "../components/MiniScreen";
import { OrnamentalDivider } from "../components/OrnamentalDivider";
import { Reveal } from "../components/Reveal";
import { HOW_IT_WORKS } from "../copy";

/**
 * S4 · How it works (kickoff §S4 + Round 2 §4). Three steps, each with a coded
 * mini screen-mockup (test → result → training) so the product reads "at a
 * glance". Revealed on scroll. Anchored for the footer link.
 */
const SCREEN_BY_STEP = ["test", "result", "train"] as const;

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

        <ol className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {HOW_IT_WORKS.steps.map((step, i) => (
            <Reveal key={step.n} index={i} as="li">
              <Panel variant="ornate" interactive innerClassName="h-full p-5">
                <MiniScreen kind={SCREEN_BY_STEP[i] ?? "test"} />
                <div className="mt-4 flex items-center gap-3">
                  <span className="font-display inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/50 text-base font-black text-gold">
                    {step.n}
                  </span>
                  <h3 className="font-display text-base font-bold leading-tight text-text-hi">
                    {step.title}
                  </h3>
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
