/**
 * /welcome — the coach's one-time Arrival diagnosis, served on REAL data
 * (F2 fix: every account — free or Pro — sees ITS result, never a demo).
 * No session → create the account first; no DNA on file → the hub's
 * first-quest prompt takes over.
 */
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { getLatestDnaResult } from "@/src/data/repos/progress";
import { learnHref } from "@/src/lib/opening-paths";
import type { OpeningId } from "@/src/lib/assets";
import type { ArrivalFixture } from "@/src/dev/fixtures";
import { WelcomeClient } from "./WelcomeClient";

/** Test-bank opening families → art/route OpeningId. */
const FAMILY_TO_OPENING: Record<string, OpeningId> = {
  "Caro-Kann Defense": "caro-kann",
  "Italian Game": "italian",
  "Two Knights Defense": "italian",
  "Ruy Lopez": "ruy-lopez",
  "Sicilian Defense": "sicilian-dragon",
  "Scandinavian Defense": "scandinavian",
  "Scotch Game": "scotch",
  "King's Gambit": "kings-gambit",
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default async function WelcomePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signup");

  const raw = (await getLatestDnaResult(session.user.id)) as
    | (Record<string, unknown> & {
        archetype: "warrior" | "strategist" | "defender" | "trickster";
        initialIq: number;
        percentile: number;
        strongestFamily?: string;
        weakestFamily?: string | null;
        strongestPct?: number;
        weakestPct?: number;
        weakFen?: string;
        weakOrientation?: "white" | "black";
        weakEco?: string;
      })
    | null;

  // Legacy result without the diagnosis extras, or no test yet → the hub handles it.
  if (!raw?.weakFen || !raw.weakestFamily || !raw.strongestFamily) redirect("/train");

  const weaknessId = FAMILY_TO_OPENING[raw.weakestFamily] ?? "italian";
  const arrival: ArrivalFixture = {
    archetype: raw.archetype,
    archetypeName: cap(raw.archetype),
    iq: raw.initialIq,
    topPercent: raw.percentile,
    strength: raw.strongestFamily,
    strengthWin: raw.strongestPct ?? 100,
    weakness: raw.weakestFamily,
    weaknessLine: raw.weakEco ?? "",
    weaknessWin: raw.weakestPct ?? 0,
    weakFen: raw.weakFen,
    weakOrientation: raw.weakOrientation ?? "white",
    firstSessionLines: 3,
    firstSessionMin: 6,
    strengthId: FAMILY_TO_OPENING[raw.strongestFamily] ?? "italian",
    weaknessId,
  };

  return <WelcomeClient arrival={arrival} learnUrl={learnHref(weaknessId) ?? "/train"} />;
}
