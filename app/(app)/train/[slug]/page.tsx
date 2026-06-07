/**
 * /train/[slug] — Opening detail (banner + crest + Learn/Drill + realm Boss-Fight).
 * Lives under /train so the active tab is Train. The line board trainer moved to
 * /train/[slug]/learn.
 * TODO(real-data): verify slug ↔ OpeningId alignment; wire mastery (x/20 lines) from
 * getOpeningMastery.
 */
import { OpeningDetailScreen } from "@/src/ui/opening/OpeningDetailScreen";
import { OPENING_NAMES, type OpeningId } from "@/src/lib/assets";

export default async function OpeningDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = slug as OpeningId;
  return <OpeningDetailScreen openingId={id} name={OPENING_NAMES[id]} />;
}
