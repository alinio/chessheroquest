/**
 * /insights — analytics hub section (inside AppShell, active = Insights).
 * Server component: REAL numbers only — IQ snapshots, training_events stats,
 * domain Road-to-Elo projection, FSRS mastery weaknesses. Synced real games
 * render client-side from the game-sync store (RealGamesCard).
 */
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { getProgress, getIqTrend } from "@/src/data/repos/progress";
import { getTrainingStats } from "@/src/data/repos/stats";
import { getOpeningMastery } from "@/src/data/repos/openings";
import { roadProgress, projectedEloGain, type EloGoal, ELO_GOALS } from "@/src/domain/gamification/road";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { InsightsScreen, type InsightsData, type InsightsWeakness } from "@/src/ui/insights/InsightsScreen";

const STATE_ORDER = { leak: 0, review: 1, solid: 2, gold: 3 } as const;

export default async function InsightsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const progress = await getProgress(session.user.id);
  if (!progress) redirect("/train"); // first-quest prompt lives there

  const [trend, stats, mastery] = await Promise.all([
    getIqTrend(session.user.id),
    getTrainingStats(session.user.id),
    getOpeningMastery(session.user.id),
  ]);

  const goal: EloGoal = (ELO_GOALS as readonly number[]).includes(progress.eloGoal)
    ? (progress.eloGoal as EloGoal)
    : 1200;

  // Weakest = started openings with the lowest mastery (leaks first).
  const weaknesses: InsightsWeakness[] = STARTER_PATHS
    .map((p) => ({ name: p.name, m: mastery[p.id] }))
    .filter((x): x is { name: string; m: NonNullable<typeof x.m> } => Boolean(x.m && x.m.studied > 0))
    .sort((a, b) => STATE_ORDER[a.m.state] - STATE_ORDER[b.m.state] || a.m.studied / a.m.total - b.m.studied / b.m.total)
    .slice(0, 3)
    .filter((x) => x.m.state !== "gold")
    .map((x) => ({ name: x.name, state: x.m.state, studied: x.m.studied, total: x.m.total }));

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
  };

  return <InsightsScreen data={data} />;
}
