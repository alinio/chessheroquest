/**
 * /dashboard — the hero's hub (screen S4). Server component: loads the user's
 * REAL progression. New users (no DNA Test yet) get a prompt to take it.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { getProgress } from "@/src/data/repos/progress";
import { getOpeningMastery } from "@/src/data/repos/openings";
import { isStreakAlive } from "@/src/domain/gamification/streak";
import { pickFocusOpenings } from "@/src/domain/gamification/focus";
import type { EloGoal } from "@/src/domain/gamification/road";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { Dashboard } from "@/src/ui/screens/Dashboard";
import { PendingDnaSync } from "@/src/ui/PendingDnaSync";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const progress = await getProgress(session.user.id);
  const mastery = progress ? await getOpeningMastery(session.user.id) : {};
  const focus = pickFocusOpenings(
    STARTER_PATHS.map((p) => ({
      slug: p.id,
      name: p.name,
      state: mastery[p.id]?.state ?? "leak",
    })),
  );

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-7 px-4 py-6">
      <header className="text-center">
        <p className="font-display text-gold text-xs uppercase tracking-[0.3em]">
          ChessHeroQuest
        </p>
        <h1 className="font-display text-text-hi text-2xl font-bold">Your hub</h1>
      </header>

      {progress ? (
        <Dashboard
          iq={progress.iq}
          archetype={progress.archetype}
          goal={progress.eloGoal as EloGoal}
          streakDays={
            isStreakAlive(
              { count: progress.streakCount, lastActiveDay: progress.streakLastActiveDay },
              new Date(),
            )
              ? progress.streakCount
              : 0
          }
          xp={progress.xp}
          dueCount={progress.dueCount}
          weakestName={focus.weakest?.name}
          weakestSlug={focus.weakest?.slug}
          bossName={focus.boss?.name}
          bossSlug={focus.boss?.slug}
        />
      ) : (
        <section className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
          {/* Carry over an anonymous DNA result, then this re-renders with real data. */}
          <PendingDnaSync />
          <p className="text-text-mid max-w-xs">
            You haven&apos;t taken the Chess DNA Test yet — it seeds your Opening IQ.
          </p>
          <Link
            href="/dna"
            className="rounded-chip bg-gold text-abyss inline-flex min-h-[48px] items-center px-8 font-semibold"
          >
            Take the Chess DNA Test
          </Link>
        </section>
      )}
    </main>
  );
}
