/**
 * /boss/[slug] — the Opening Guardian duel for one curated path (the Prove
 * step). Immersive, no shell. Playable anonymously; victories persist only for
 * signed-in players (cards + streak + XP via /api/guardian).
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { GUARDIANS } from "@/src/domain/world/guardians";
import { PATH_TO_OPENING } from "@/src/lib/opening-paths";
import { ASSETS, OPENING_NAMES } from "@/src/lib/assets";
import { GuardianDuel } from "@/src/ui/boss/GuardianDuel";

export const metadata: Metadata = {
  title: "Opening Guardian — ChessHeroQuest",
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

  return (
    <GuardianDuel
      path={path}
      guardian={guardian}
      realm={ASSETS.openings[openingId].realm}
      openingName={OPENING_NAMES[openingId]}
      userId={session?.user?.id}
    />
  );
}
