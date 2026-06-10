/**
 * /train/[slug] — Opening detail (banner + crest + REAL mastery + Learn/Drill +
 * Guardian entry). Lives under /train so the active tab is Train. The slug is
 * an OpeningId (art registry); training routes resolve via OPENING_TO_PATH.
 */
import { notFound } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { getOpeningMastery } from "@/src/data/repos/openings";
import { OpeningDetailScreen, type OpeningMasteryView } from "@/src/ui/opening/OpeningDetailScreen";
import { OPENING_NAMES, ASSETS, type OpeningId } from "@/src/lib/assets";
import { OPENING_TO_PATH } from "@/src/lib/opening-paths";

export default async function OpeningDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!(slug in ASSETS.openings)) notFound();
  const id = slug as OpeningId;

  // Real coverage for this opening's curated path (when signed in + started).
  let mastery: OpeningMasteryView | null = null;
  const session = await auth();
  const pathId = OPENING_TO_PATH[id];
  if (session?.user?.id && pathId) {
    const all = await getOpeningMastery(session.user.id);
    mastery = all[pathId] ?? null;
  }

  return <OpeningDetailScreen openingId={id} name={OPENING_NAMES[id]} mastery={mastery} />;
}
