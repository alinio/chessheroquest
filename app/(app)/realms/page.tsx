/**
 * /realms — the 4-worlds overview (inside AppShell). Server component: REAL
 * per-realm sealed counts (gold mastery) and the player's home realm.
 */
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { getProgress } from "@/src/data/repos/progress";
import { getOpeningMastery } from "@/src/data/repos/openings";
import { ARCHETYPE_REALM, OPENING_NAMES, type RealmId } from "@/src/lib/assets";
import { OPENING_TO_PATH, realmOpeningIds } from "@/src/lib/opening-paths";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { fenAfter, moveSquaresAt } from "@/src/domain/repertoire/line";
import { KINGDOM_BOSSES, PATH_SIDE } from "@/src/domain/world/guardians";
import { RealmsScreen } from "@/src/ui/realms/RealmsScreen";
import { EmptyKingdom } from "@/src/ui/shell/EmptyKingdom";
import type { RealmEntry, RealmNextLine } from "@/src/dev/fixtures";

const REALM_META: { id: RealmId; name: string; sub: string; archetype: RealmEntry["archetype"]; accent: string }[] = [
  { id: "ember-marches", name: "Ember Marches", sub: "Realm of the Warrior", archetype: "warrior", accent: "#e0413b" },
  { id: "obsidian-court", name: "Obsidian Court", sub: "Realm of the Strategist", archetype: "strategist", accent: "#8a7bd8" },
  { id: "aegis-bastion", name: "Aegis Bastion", sub: "Realm of the Defender", archetype: "defender", accent: "#4fb477" },
  { id: "mirage-bazaar", name: "Mirage Bazaar", sub: "Realm of the Trickster", archetype: "trickster", accent: "#46c7d8" },
];

export default async function RealmsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const progress = await getProgress(session.user.id);
  if (!progress) {
    return (
      <EmptyKingdom
        section="Realms"
        line="Four realms, one per playing style — each holds 5 openings to master. Your DNA test decides which realm is home."
      />
    );
  }

  const mastery = await getOpeningMastery(session.user.id);
  const home = progress.archetype ? ARCHETYPE_REALM[progress.archetype] : null;

  const realms: RealmEntry[] = REALM_META.map((meta) => {
    const ids = realmOpeningIds(meta.id);
    const isSealed = (id: (typeof ids)[number]) => {
      const pathId = OPENING_TO_PATH[id];
      return Boolean(pathId && mastery[pathId]?.state === "gold");
    };
    const sealed = ids.filter(isSealed).length;

    // First unsealed opening (registry order) → its REAL tabiya (fenAfter, LAW #2).
    let next: RealmNextLine | null = null;
    const nextId = ids.find((id) => !isSealed(id));
    if (nextId) {
      const pathId = OPENING_TO_PATH[nextId];
      const path = pathId ? STARTER_PATHS.find((p) => p.id === pathId) : undefined;
      if (path && path.moves.length > 0) {
        next = {
          openingName: OPENING_NAMES[nextId],
          fen: fenAfter(path, path.moves.length),
          orientation: PATH_SIDE[path.id] ?? "white",
          lastMove: moveSquaresAt(path, path.moves.length - 1),
        };
      }
    }

    return {
      ...meta,
      sealed,
      total: ids.length,
      current: meta.id === home,
      next,
      bossName: KINGDOM_BOSSES[meta.id]?.name,
    };
  });

  return <RealmsScreen realms={realms} />;
}
