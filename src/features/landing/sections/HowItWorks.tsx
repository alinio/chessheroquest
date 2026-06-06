import { Reveal } from "../components/Reveal";
import { HOW_IT_WORKS } from "../copy";

/**
 * S4 · How it works (kickoff §S4). Three steps, copy verbatim. Anchored at
 * #how-it-works so the footer "How it works" link scrolls here.
 */
export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-20 border-t border-hairline bg-abyss px-5 py-24"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="font-display text-center text-3xl font-bold leading-tight text-text-hi sm:text-4xl">
            {HOW_IT_WORKS.h2}
          </h2>
        </Reveal>

        <ol className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {HOW_IT_WORKS.steps.map((step, i) => (
            <Reveal key={step.n} index={i} as="li">
              <div className="h-full rounded-card border border-hairline bg-surface p-6">
                <span className="font-display inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 text-lg font-black text-gold">
                  {step.n}
                </span>
                <h3 className="font-display mt-4 text-lg font-bold text-text-hi">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-mid">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
