/**
 * /boss/[slug] — the Opening Guardian duel for one curated path (the Prove
 * step). Immersive, no shell. Playable anonymously; victories persist only for
 * signed-in players (cards + streak + XP via /api/guardian).
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { getOpeningMastery } from "@/src/data/repos/openings";
import { getGuardianVictories } from "@/src/data/repos/achievements";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { GUARDIANS } from "@/src/domain/world/guardians";
import { OPENING_TO_PATH, OPENING_LINES, PATH_TO_OPENING, realmOpeningIds } from "@/src/lib/opening-paths";
import { ASSETS, OPENING_NAMES, type OpeningId } from "@/src/lib/assets";
import { GuardianDuel } from "@/src/ui/boss/GuardianDuel";

export const metadata: Metadata = {
  title: "Opening Guardian",
  robots: { index: false },
};

export default async function GuardianDuelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const path = STARTER_PATHS.find((p) => p.id === slug);
  const openingId = PATH_TO_OPENING[slug];
  if (!path || !openingId) notFound();

  const guardian = GUARDIANS[openingId];
  if (!guardian) notFound();

  const session = await auth();
  // Real mastery of this line → the single contextual victory CTA
  // (not gold yet → "Drill to gold", gold → the seal moment), plus the
  // current seal count for the one-time SEAL celebration.
  let masteryState = null;
  let sealedBefore: number | null = null;
  let realmDefeated: number | null = null;
  const ids = Object.keys(ASSETS.openings) as OpeningId[];
  const realm = ASSETS.openings[openingId].realm;
  const realmOpenings = realmOpeningIds(realm);
  if (session?.user?.id) {
    const [mastery, wins] = await Promise.all([
      getOpeningMastery(session.user.id),
      getGuardianVictories(session.user.id),
    ]);
    masteryState = mastery[path.id]?.state ?? null;
    sealedBefore = ids.filter((id) => {
      const pid = OPENING_TO_PATH[id];
      return pid && mastery[pid]?.state === "gold" && Boolean(wins[pid]);
    }).length;
    // Realm Guardians defeated AFTER this victory (the count is only shown on
    // the won screen): real guardian_defeated achievements on any of the
    // opening's lines, plus the duel being fought right now.
    realmDefeated = realmOpenings.filter((oid) =>
      (OPENING_LINES[oid] ?? []).some((pid) => pid === slug || Boolean(wins[pid])),
    ).length;
  }

  return (
    <GuardianDuel
      path={path}
      guardian={guardian}
      realm={realm}
      openingName={OPENING_NAMES[openingId]}
      userId={session?.user?.id}
      masteryState={masteryState}
      sealedBefore={sealedBefore}
      totalSeals={ids.length}
      realmDefeated={realmDefeated}
      realmTotal={realmOpenings.length}
    />
  );
}
