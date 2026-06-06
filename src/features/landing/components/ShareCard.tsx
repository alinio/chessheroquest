import { DNACard } from "./DNACard";
import type { ExampleDnaResult } from "../exampleData";

/**
 * Share Card (kickoff §6) — the social-export frame around the DNA Card. Same
 * precious object, wrapped with a share-ready footer so a screenshot reads as a
 * standalone artifact ("brag, then bring a friend"). Coded, design-system pure.
 *
 * Used at the DNA result moment (post-test) and available to the landing for any
 * share affordance; the pre-test landing leads with the plain DNA Card.
 */
export function ShareCard({ data }: { data: ExampleDnaResult }) {
  return (
    <div className="relative inline-block rounded-[20px] bg-gradient-to-b from-gold/20 to-transparent p-[1px]">
      <div className="rounded-[19px] bg-abyss p-4">
        <DNACard data={data} showExampleTag={false} />
        <p className="mt-3 text-center text-[0.65rem] uppercase tracking-[0.25em] text-gold">
          What's your Chess DNA? · chessheroquest.com
        </p>
      </div>
    </div>
  );
}
