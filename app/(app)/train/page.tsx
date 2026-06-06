/**
 * /train — the Openings hub (precursor to the World Map). Each line shows its
 * mastery state (the kingdom colour: leak → review → solid → gold/conquered),
 * derived from coverage + FSRS retention. Opens Learn or Drill.
 */
import Link from "next/link";
import { auth } from "@/src/lib/auth";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import type { Archetype } from "@/src/domain/repertoire/types";
import type { MasteryState } from "@/src/domain/mastery";
import { getOpeningMastery } from "@/src/data/repos/openings";

const ARCHETYPE_LABEL: Record<Archetype, string> = {
  warrior: "Aggressive Warrior",
  strategist: "Strategist",
  defender: "Defender",
  trickster: "Trickster",
};

// State always carries an icon + label, never colour alone (DESIGN.md §9).
const STATE_META: Record<MasteryState, { label: string; icon: string; bar: string; text: string }> = {
  leak: { label: "Leak", icon: "▲", bar: "bg-state-leak", text: "text-state-leak" },
  review: { label: "Review", icon: "◆", bar: "bg-state-review", text: "text-state-review" },
  solid: { label: "Solid", icon: "●", bar: "bg-state-solid", text: "text-state-solid" },
  gold: { label: "Conquered", icon: "★", bar: "bg-gold", text: "text-gold" },
};

export default async function TrainHubPage() {
  const session = await auth();
  const mastery = session?.user?.id ? await getOpeningMastery(session.user.id) : {};

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-5 px-4 py-6">
      <header className="text-center">
        <p className="font-display text-gold text-xs uppercase tracking-[0.3em]">Openings</p>
        <h1 className="font-display text-text-hi text-2xl font-bold">Choose a line</h1>
      </header>

      <div className="flex flex-col gap-3">
        {STARTER_PATHS.map((p) => {
          const m = mastery[p.id];
          const total = m?.total ?? p.moves.length;
          const studied = m?.studied ?? 0;
          const state = m?.state ?? "leak";
          const meta = STATE_META[state];
          const pct = total === 0 ? 0 : Math.round((studied / total) * 100);

          return (
            <div key={p.id} className="bg-surface border-hairline rounded-card border p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-display text-text-hi truncate">{p.name}</p>
                  <p className="text-text-low text-xs">
                    {p.eco} · {ARCHETYPE_LABEL[p.archetype]}
                  </p>
                </div>
                <span className={`shrink-0 text-xs font-semibold ${meta.text}`}>
                  <span aria-hidden>{meta.icon} </span>
                  {meta.label}
                </span>
              </div>

              <div className="bg-raised mt-3 h-1.5 w-full overflow-hidden rounded-chip">
                <div className={`h-full rounded-chip ${meta.bar}`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-text-low mt-1 text-xs tabular-nums">{studied}/{total} positions</p>

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
