/**
 * /train — the Openings hub (precursor to the World Map). Lists the curated
 * lines; each opens Learn (line trainer) or Drill (SRS recall).
 */
import Link from "next/link";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import type { Archetype } from "@/src/domain/repertoire/types";

const ARCHETYPE_LABEL: Record<Archetype, string> = {
  warrior: "Aggressive Warrior",
  strategist: "Strategist",
  defender: "Defender",
  trickster: "Trickster",
};

export default function TrainHubPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-5 px-4 py-6">
      <header className="text-center">
        <p className="font-display text-gold text-xs uppercase tracking-[0.3em]">Openings</p>
        <h1 className="font-display text-text-hi text-2xl font-bold">Choose a line</h1>
      </header>

      <div className="flex flex-col gap-3">
        {STARTER_PATHS.map((p) => (
          <div key={p.id} className="bg-surface border-hairline rounded-card border p-4">
            <p className="font-display text-text-hi truncate">{p.name}</p>
            <p className="text-text-low text-xs">
              {p.eco} · {ARCHETYPE_LABEL[p.archetype]}
            </p>
            <p className="text-text-mid mt-1 text-xs">{p.description}</p>
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
        ))}
      </div>
    </main>
  );
}
