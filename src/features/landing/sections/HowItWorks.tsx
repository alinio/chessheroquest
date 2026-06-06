import { Panel } from "../components/Panel";
import { StepIcon } from "../components/StepIcon";
import { OrnamentalDivider } from "../components/OrnamentalDivider";
import { Reveal } from "../components/Reveal";
import { HOW_IT_WORKS } from "../copy";

/**
 * S4 · How it works (kickoff §S4 + pass 2 §6). Three steps in ornate panels, each
 * with a coded micro-illustration (positions flashing → ring filling → streak),
 * revealed on scroll. Copy verbatim. Anchored for the footer link.
 */
const ICON_BY_STEP = ["positions", "score", "streak"] as const;

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
              <Panel variant="ornate" interactive innerClassName="h-full p-6">
                <div className="flex items-center justify-between">
                  <span className="font-display inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 text-lg font-black text-gold">
                    {step.n}
                  </span>
                  <StepIcon kind={ICON_BY_STEP[i] ?? "positions"} />
                </div>
                <h3 className="font-display mt-4 text-lg font-bold text-text-hi">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-mid">
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
