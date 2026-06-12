/**
 * /train/[slug] — Opening detail (banner + crest + REAL mastery + Learn/Drill +
 * Guardian entry). Lives under /train so the active tab is Train. The slug is
 * an OpeningId (art registry); training routes resolve via OPENING_TO_PATH.
 */
import { notFound } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { getOpeningMastery } from "@/src/data/repos/openings";
import { getDueSlugs } from "@/src/data/repos/cards";
import { OpeningDetailScreen, type OpeningLineView, type OpeningMasteryView } from "@/src/ui/opening/OpeningDetailScreen";
import { OPENING_NAMES, ASSETS, type OpeningId } from "@/src/lib/assets";
import { OPENING_TO_PATH, OPENING_LINES } from "@/src/lib/opening-paths";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";

export default async function OpeningDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!(slug in ASSETS.openings)) notFound();
  const id = slug as OpeningId;

  // Real coverage for this opening's curated lines (when signed in + started).
  let mastery: OpeningMasteryView | null = null;
  let lines: OpeningLineView[] = [];
  const session = await auth();
  const pathId = OPENING_TO_PATH[id];
  if (session?.user?.id && pathId) {
    const [all, due] = await Promise.all([
      getOpeningMastery(session.user.id),
      getDueSlugs(session.user.id, new Date()),
    ]);
    mastery = all[pathId] ?? null;
    lines = (OPENING_LINES[id] ?? []).map((lineId) => {
      const path = STARTER_PATHS.find((p) => p.id === lineId);
      const moves = path?.moves.length ?? 0;
      return {
        id: lineId,
        name: path?.name ?? lineId,
        mastery: all[lineId] ?? null,
        // Real line length + the honest session estimate (player moves ≈ half).
        moves: moves > 0 ? moves : undefined,
        minutes: moves > 0 ? Math.max(2, Math.ceil(Math.ceil(moves / 2) / 2)) : undefined,
        dueToday: due.has(lineId),
      };
    });
  }

  return <OpeningDetailScreen openingId={id} name={OPENING_NAMES[id]} mastery={mastery} lines={lines} />;
}
