/**
 * /train — Today / Train dashboard (the daily loop). Server component: loads
 * the user's REAL progression (IQ, streak, due cards, focus openings) and
 * feeds the cockpit. New users (no DNA Test yet) get the first-quest prompt.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { getProgress } from "@/src/data/repos/progress";
import { getOpeningMastery } from "@/src/data/repos/openings";
import { isStreakAlive } from "@/src/domain/gamification/streak";
import { pickFocusOpenings } from "@/src/domain/gamification/focus";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { TodayScreen, type TodayData } from "@/src/ui/today/TodayScreen";
import { ASSETS } from "@/src/lib/assets";
import { PictureBg } from "@/src/ui/PictureBg";

export default async function TodayPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const progress = await getProgress(session.user.id);
  if (!progress) {
    return (
      <main className="today-v2 today-first">
        <section className="today-hero">
          <div className="bg">
            <PictureBg landscape={ASSETS.backgrounds.today} portrait={ASSETS.backgrounds.todayPortrait} />
          </div>
          <div className="focal">
            <p className="eyebrow gold">Your quest begins</p>
            <h1 className="serif">Take the Chess DNA Test</h1>
            <p className="sub">
              8 positions reveal how you really play — your archetype, your Opening IQ,
              and exactly where you&apos;re losing games.
            </p>
            <Link className="btn-gold cta" href="/dna-test">Start the test →</Link>
          </div>
        </section>
      </main>
    );
  }

  const mastery = await getOpeningMastery(session.user.id);
  const refs = STARTER_PATHS.map((p) => ({
    slug: p.id,
    name: p.name,
    state: mastery[p.id]?.state ?? ("leak" as const),
  }));
  const focus = pickFocusOpenings(refs);
  const strongest =
    refs.find((r) => r.state === "gold")?.name ?? focus.boss?.name ?? null;

  const data: TodayData = {
    streakDays: isStreakAlive(
      { count: progress.streakCount, lastActiveDay: progress.streakLastActiveDay },
      new Date(),
    )
      ? progress.streakCount
      : 0,
    xp: progress.xp,
    dueDrills: progress.dueCount,
    eloGoal: progress.eloGoal,
    eloPct: Math.round(Math.min(1, progress.iq / 1000) * 100),
    strongest,
    recommended: focus.boss ? { slug: focus.boss.slug, name: focus.boss.name } : null,
    weakest: focus.weakest ? { slug: focus.weakest.slug, name: focus.weakest.name } : null,
  };

  return <TodayScreen data={data} />;
}
