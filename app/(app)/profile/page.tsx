/**
 * /profile — the hero card (acquired facts only, target-experience-spec §C).
 * Server component: real progression (IQ trend, level, records), real seals
 * (gold mastery + Guardian defeated), the dominant earned title, the saved
 * DNA card, Road goal picker and sign-out. Nothing here is a to-do.
 */
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { getProgress, getLatestDnaResult, getIqTrend, getLinkedAccounts } from "@/src/data/repos/progress";
import { getAchievements, getGuardianVictories } from "@/src/data/repos/achievements";
import { getOpeningMastery } from "@/src/data/repos/openings";
import { getTrainingStats, getBestStreak } from "@/src/data/repos/stats";
import { rankForIq } from "@/src/domain/iq/calibration";
import { xpProgress } from "@/src/domain/gamification/xp";
import { practicalRankElo } from "@/src/domain/gamification/road";
import { ASSETS, OPENING_NAMES, ARCHETYPE_REALM, REALM_NAMES, type OpeningId } from "@/src/lib/assets";
import { OPENING_TO_PATH } from "@/src/lib/opening-paths";
import { ProfileScreen, type ProfileData, type ProfileSeal } from "@/src/ui/profile/ProfileScreen";
import { EmptyKingdom } from "@/src/ui/shell/EmptyKingdom";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");
  const userId = session.user.id;
  const email = session.user.email ?? "";

  const progress = await getProgress(userId);
  if (!progress || !progress.archetype) {
    return (
      <EmptyKingdom
        section="Profile"
        line="Your hero card lives here — portrait, earned titles, Opening IQ and your seal collection. Take the DNA test to forge it."
      />
    );
  }

  const [dna, titles, trend, mastery, wins, stats, linked] = await Promise.all([
    getLatestDnaResult(userId),
    getAchievements(userId),
    getIqTrend(userId),
    getOpeningMastery(userId),
    getGuardianVictories(userId),
    getTrainingStats(userId),
    getLinkedAccounts(userId),
  ]);
  const bestStreak = await getBestStreak(userId, progress.streakCount);

  // Real seals in passport order: gold mastery AND Guardian defeated.
  const ids = Object.keys(ASSETS.openings) as OpeningId[];
  const seals: ProfileSeal[] = ids
    .filter((id) => {
      const pathId = OPENING_TO_PATH[id];
      return pathId && mastery[pathId]?.state === "gold" && Boolean(wins[pathId]);
    })
    .map((id) => ({ id, name: OPENING_NAMES[id] }));

  // Dominant title = the most recent earned achievement (opening titles first).
  const dominantTitle =
    titles.find((t) => t.type !== "guardian_defeated")?.title ?? titles[0]?.title ?? null;

  const level = xpProgress(progress.xp);
  const realm = ARCHETYPE_REALM[progress.archetype];

  const data: ProfileData = {
    name: progress.displayName ?? email.split("@")[0] ?? "Hero",
    email,
    archetype: progress.archetype,
    realmName: REALM_NAMES[realm],
    joined: progress.createdAt
      ? progress.createdAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : "—",
    dominantTitle,
    level: level.level,
    xpInto: level.into,
    xpNeeded: level.needed,
    iq: progress.iq,
    iqDelta: trend.length >= 2 ? progress.iq - trend[0]! : 0,
    iqTrend: trend.length >= 2 ? trend : [progress.iq, progress.iq],
    practicalElo: practicalRankElo(progress.iq),
    rankName: rankForIq(progress.iq),
    seals,
    totalOpenings: ids.length,
    bestStreak,
    drillsAnswered: stats.cardsReviewed,
    eloGoal: progress.eloGoal,
    dna,
    savedUsernames: linked,
  };

  return <ProfileScreen data={data} />;
}
