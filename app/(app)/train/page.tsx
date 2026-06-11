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
import { getDueCards } from "@/src/data/repos/cards";
import { isStreakAlive } from "@/src/domain/gamification/streak";
import { pickFocusOpenings } from "@/src/domain/gamification/focus";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { fenAfter, moveSquaresAt, plyOfFen } from "@/src/domain/repertoire/line";
import { PATH_SIDE } from "@/src/domain/world/guardians";
import type { CuratedPath } from "@/src/domain/repertoire/types";
import { TodayScreen, type TodayBoardView, type TodayData } from "@/src/ui/today/TodayScreen";
import { ASSETS } from "@/src/lib/assets";
import { PictureBg } from "@/src/ui/PictureBg";

/**
 * The line's tabiya (its final curated position) as a preview board — the
 * mission cards never show a generic diagram, only the position the click
 * will train (fenAfter over the real path, LAW #2).
 */
function tabiyaBoard(path: CuratedPath | undefined): TodayBoardView | null {
  if (!path || path.moves.length === 0) return null;
  return {
    fen: fenAfter(path, path.moves.length),
    orientation: PATH_SIDE[path.id] ?? "white",
    lastMove: moveSquaresAt(path, path.moves.length - 1),
  };
}

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

  const recommendedPath = focus.boss
    ? STARTER_PATHS.find((p) => p.id === focus.boss!.slug)
    : undefined;
  const weakestPath = focus.weakest
    ? STARTER_PATHS.find((p) => p.id === focus.weakest!.slug)
    : undefined;

  // ---- the day's board (hero): the FIRST due SRS card, re-anchored into its
  // curated line for orientation + last-move context. All clear → the
  // recommended line two moves in (the position Learn opens on).
  let dueFen: string | null = null;
  let dueOrientation: "white" | "black" = "white";
  let dueLineName: string | null = null;
  let dueLastMove: { from: string; to: string } | null = null;

  if (progress.dueCount > 0) {
    const [first] = await getDueCards(session.user.id, new Date(), 1);
    const path = first ? STARTER_PATHS.find((p) => p.name === first.opening) : undefined;
    if (first && path) {
      const ply = plyOfFen(path, first.fen);
      if (ply >= 0) {
        dueFen = first.fen;
        dueOrientation = PATH_SIDE[path.id] ?? "white";
        dueLineName = path.name;
        dueLastMove = ply > 0 ? moveSquaresAt(path, ply - 1) : null;
      }
    }
  } else if (recommendedPath && recommendedPath.moves.length >= 2) {
    dueFen = fenAfter(recommendedPath, 2);
    dueOrientation = PATH_SIDE[recommendedPath.id] ?? "white";
    dueLineName = recommendedPath.name;
    dueLastMove = moveSquaresAt(recommendedPath, 1);
  }

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
    dueFen,
    dueOrientation,
    dueLineName,
    dueLastMove,
    weaknessBoard: tabiyaBoard(weakestPath),
    bossBoard: tabiyaBoard(recommendedPath),
  };

  return <TodayScreen data={data} />;
}
