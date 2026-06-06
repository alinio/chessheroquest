/**
 * /train — the Openings hub (precursor to the World Map). Lists the curated
 * lines with the user's coverage (positions studied) so the collection visibly
 * "colours in". Each opening opens Learn or Drill.
 */
import Link from "next/link";
import { auth } from "@/src/lib/auth";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import type { Archetype } from "@/src/domain/repertoire/types";
import { getOpeningCoverage } from "@/src/data/repos/openings";

const ARCHETYPE_LABEL: Record<Archetype, string> = {
  warrior: "Aggressive Warrior",
  strategist: "Strategist",
  defender: "Defender",
  trickster: "Trickster",
};

export default async function TrainHubPage() {
  const session = await auth();
  const coverage = session?.user?.id ? await getOpeningCoverage(session.user.id) : {};

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-5 px-4 py-6">
      <header className="text-center">
        <p className="font-display text-gold text-xs uppercase tracking-[0.3em]">Openings</p>
        <h1 className="font-display text-text-hi text-2xl font-bold">Choose a line</h1>
      </header>

      <div className="flex flex-col gap-3">
        {STARTER_PATHS.map((p) => {
          const cov = coverage[p.id];
          const total = cov?.total ?? p.moves.length;
          const studied = cov?.studied ?? 0;
          const pct = total === 0 ? 0 : Math.round((studied / total) * 100);
          const conquered = total > 0 && studied >= total;

          return (
            <div key={p.id} className="bg-surface border-hairline rounded-card border p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-display text-text-hi truncate">{p.name}</p>
                  <p className="text-text-low text-xs">
                    {p.eco} · {ARCHETYPE_LABEL[p.archetype]}
                  </p>
                </div>
                {conquered && (
                  <span className="bg-gold text-abyss rounded-chip shrink-0 px-2 py-0.5 text-[0.6rem] font-bold uppercase">
                    Conquered
                  </span>
                )}
              </div>

              <div className="bg-raised mt-3 h-1.5 w-full overflow-hidden rounded-chip">
                <div
                  className={`h-full rounded-chip ${conquered ? "bg-gold" : "bg-state-solid"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-text-low mt-1 text-xs tabular-nums">
                {studied}/{total} positions
              </p>

              <div className="mt-3 flex gap-2">
                <Link
                  href={`/train/${p.id}`}
                  className="rounded-chip bg-gold text-abyss inline-flex min-h-[44px] flex-1 items-center justify-center text-sm font-semibold"
                >
                  Learn
                </Link>
                <Link
                  href={`/drill/${p.id}`}
                  className="rounded-chip border-hairline text-text-mid inline-flex min-h-[44px] flex-1 items-center justify-center border text-sm"
                >
                  Drill
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
