/**
 * /passport — Opening Passport (4 realm sections, sealed/locked). Rendered inside the
 * hub AppShell (active = Passport). Real mastery from getOpeningMastery ("gold" = sealed).
 * TODO(real-data): verify mastery keys ↔ OpeningId (path-template ids may differ); if
 * they don't align, sealed counts read low — tell the founder.
 */
import { auth } from "@/src/lib/auth";
import { getOpeningMastery } from "@/src/data/repos/openings";
import { PassportScreen } from "@/src/ui/passport/PassportScreen";
import { ASSETS, OPENING_NAMES, type OpeningId } from "@/src/lib/assets";

export default async function PassportPage() {
  const session = await auth();
  const mastery = session?.user?.id ? await getOpeningMastery(session.user.id) : {};
  const openings = (Object.keys(ASSETS.openings) as OpeningId[]).map((id) => ({
    id,
    name: OPENING_NAMES[id],
    mastered: mastery[id]?.state === "gold",
  }));
  return <PassportScreen openings={openings} />;
}
