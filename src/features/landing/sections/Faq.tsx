import { OrnamentalDivider } from "../components/OrnamentalDivider";
import { Reveal } from "../components/Reveal";

/**
 * S5.5 · FAQ — a real, visible Q&A (native <details> accordion: accessible,
 * no JS, content in the SSR HTML) plus a matching FAQPage JSON-LD for rich
 * results + answer engines (AI Overviews / ChatGPT / Perplexity). Q&A and schema
 * are generated from the SAME data so they always agree (Google requirement).
 */
const FAQ: { q: string; a: string }[] = [
  {
    q: "What is the Chess DNA Test?",
    a: "A free, ~2-minute assessment — 20 chess positions plus a short style quiz — that reveals your Opening IQ, your Chess DNA archetype (your playing style), your strongest opening, and your biggest weakness.",
  },
  {
    q: "Is it free? Do I need an account?",
    a: "Yes, it's completely free and there's no signup to begin. You only create an account if you want to save your progress and keep training your openings over time.",
  },
  {
    q: "How long does it take?",
    a: "About two minutes — 20 quick \"best move?\" positions and a few questions about your level and how you like to play.",
  },
  {
    q: "What is Opening IQ?",
    a: "Opening IQ is your opening-skill score from 0 to 1000, shown with a percentile, so you can see exactly where you stand and track your progress as you train.",
  },
  {
    q: "Will it actually help me gain Elo?",
    a: "It pinpoints the openings holding back your rating and builds a personalized Road to Elo — the exact openings to train next — then 5-minute daily practice with spaced repetition so they actually stick.",
  },
  {
    q: "Is the analysis accurate?",
    a: "Yes. It's powered by Stockfish and millions of real master games — real analysis, never guesswork.",
  },
  {
    q: "Do I need to know chess theory already?",
    a: "No. ChessHeroQuest is built for beginner-to-intermediate players (roughly 800–1800). It teaches the ideas behind openings instead of 300 variations to memorize.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export function Faq() {
  return (
    <section className="relative px-5 py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-bold leading-tight text-text-hi sm:text-4xl">
              Frequently asked questions
            </h2>
          </Reveal>
          <Reveal index={1}>
            <OrnamentalDivider className="mt-8" />
          </Reveal>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} index={i} as="div">
              <details className="group rounded-card border border-hairline bg-surface/40 transition-colors open:border-gold/40 hover:border-gold/30">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
                  <span className="font-display text-base font-bold text-text-hi sm:text-lg">
                    {f.q}
                  </span>
                  <span
                    aria-hidden
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gold/40 text-gold transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="px-4 pb-4 text-[0.95rem] leading-relaxed text-text-mid sm:px-5 sm:pb-5">
                  {f.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
