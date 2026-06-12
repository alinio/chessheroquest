/**
 * /insights — analytics hub section (inside AppShell, active = Insights).
 * Server component: REAL numbers only — IQ snapshots, training_events stats,
 * domain Road-to-Elo projection, FSRS mastery weaknesses. Synced real games
 * render client-side from the game-sync store (RealGamesCard).
 */
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { getProgress, getIqTrend, getLinkedAccounts } from "@/src/data/repos/progress";
import { getTrainingStats } from "@/src/data/repos/stats";
import { getOpeningMastery } from "@/src/data/repos/openings";
import { roadProgress, projectedEloGain, type EloGoal, ELO_GOALS } from "@/src/domain/gamification/road";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { fenAfter, moveSquaresAt } from "@/src/domain/repertoire/line";
import { PATH_SIDE } from "@/src/domain/world/guardians";
import { toOpeningFamily } from "@/src/domain/games/openingFamily";
import { PATH_TO_OPENING } from "@/src/lib/opening-paths";
import { OPENING_NAMES } from "@/src/lib/assets";
import { InsightsScreen, type FixFirstBoard, type InsightsData, type InsightsWeakness } from "@/src/ui/insights/InsightsScreen";
import { EmptyKingdom } from "@/src/ui/shell/EmptyKingdom";

const STATE_ORDER = { leak: 0, review: 1, solid: 2, gold: 3 } as const;

export default async function InsightsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const progress = await getProgress(session.user.id);
  if (!progress) {
    return (
      <EmptyKingdom
        section="Insights"
        line="Your Opening IQ trend, drill accuracy and real-game results live here. Take the DNA test to set your baseline — every number after that is earned."
      />
    );
  }

  const [trend, stats, mastery, linked] = await Promise.all([
    getIqTrend(session.user.id),
    getTrainingStats(session.user.id),
    getOpeningMastery(session.user.id),
    getLinkedAccounts(session.user.id),
  ]);

  const goal: EloGoal = (ELO_GOALS as readonly number[]).includes(progress.eloGoal)
    ? (progress.eloGoal as EloGoal)
    : 1200;

  // Weakest = started openings with the lowest mastery (leaks first).
  const weakest = STARTER_PATHS
    .map((p) => ({ path: p, m: mastery[p.id] }))
    .filter((x): x is { path: (typeof STARTER_PATHS)[number]; m: NonNullable<typeof x.m> } => Boolean(x.m && x.m.studied > 0))
    .sort((a, b) => STATE_ORDER[a.m.state] - STATE_ORDER[b.m.state] || a.m.studied / a.m.total - b.m.studied / b.m.total)
    .filter((x) => x.m.state === "leak" || x.m.state === "review")
    .slice(0, 3);

  const weaknesses: InsightsWeakness[] = weakest.map((x) => ({
    name: x.path.name,
    state: x.m.state,
    studied: x.m.studied,
    total: x.m.total,
  }));

  // #1 leak's critical position: the line's REAL tabiya (fenAfter, LAW #2).
  // The synced-games cross-reference happens client-side (FixFirstGames) — the
  // sync summary lives in the browser store; we only ship the family key.
  let fixFirst: FixFirstBoard | null = null;
  const top = weakest[0];
  if (top && top.path.moves.length > 0) {
    const openingId = PATH_TO_OPENING[top.path.id];
    fixFirst = {
      fen: fenAfter(top.path, top.path.moves.length),
      orientation: PATH_SIDE[top.path.id] ?? "white",
      lastMove: moveSquaresAt(top.path, top.path.moves.length - 1),
      slug: top.path.id,
      family: toOpeningFamily(openingId ? OPENING_NAMES[openingId] : top.path.name),
      minutes: Math.max(2, Math.ceil(Math.ceil(top.path.moves.length / 2) / 2)),
    };
  }

  const data: InsightsData = {
    openingIq: progress.iq,
    iqDelta: trend.length >= 2 ? progress.iq - trend[0]! : 0,
    iqTrend: trend.length >= 2 ? trend : [progress.iq, progress.iq],
    eloGoal: goal,
    roadPct: Math.round(roadProgress(progress.iq, goal) * 100),
    projectedGain: projectedEloGain(progress.iq),
    accuracy: stats.accuracy,
    drillsThisWeek: stats.drillsThisWeek,
    cardsReviewed: stats.cardsReviewed,
    weaknesses,
    fixFirst,
  };

  return <InsightsScreen data={data} savedUsernames={linked} />;
}
