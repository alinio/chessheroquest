/**
 * /quest — Quest Map (realm hub). Server component: builds the realm's five
 * nodes from the user's REAL mastery (gold = conquered, first non-gold =
 * available, rest locked). Default realm = the player's archetype home;
 * ?realm= lets the player visit any realm (Realms screen links here).
 */
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { getProgress } from "@/src/data/repos/progress";
import { getOpeningMastery } from "@/src/data/repos/openings";
import { getAchievements } from "@/src/data/repos/achievements";
import { ARCHETYPE_REALM, ASSETS, OPENING_NAMES, REALM_NAMES, type OpeningId, type RealmId } from "@/src/lib/assets";
import { OPENING_TO_PATH, OPENING_LINES } from "@/src/lib/opening-paths";
import { KINGDOM_BOSSES, PATH_SIDE } from "@/src/domain/world/guardians";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { fenAfter, moveSquaresAt } from "@/src/domain/repertoire/line";
import { QuestMapScreen } from "@/src/ui/quest/QuestMapScreen";
import { EmptyKingdom } from "@/src/ui/shell/EmptyKingdom";
import type { QuestMapFixture, QuestNode } from "@/src/dev/fixtures";

/** Canonical node layout (left%, top%) — the path climbs to the boss at the summit. */
const NODE_POS = [
  { x: 12, y: 86 },
  { x: 28, y: 74 },
  { x: 48, y: 67 },
  { x: 36, y: 48 },
  { x: 60, y: 41 },
] as const;

const REALM_SUB: Record<RealmId, string> = {
  "ember-marches": "Realm of the Warrior",
  "obsidian-court": "Realm of the Strategist",
  "aegis-bastion": "Realm of the Defender",
  "mirage-bazaar": "Realm of the Trickster",
};

const REALM_IDS: readonly RealmId[] = ["ember-marches", "obsidian-court", "aegis-bastion", "mirage-bazaar"];

export default async function QuestPage({
  searchParams,
}: {
  searchParams: Promise<{ realm?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const progress = await getProgress(session.user.id);
  if (!progress) {
    return (
      <EmptyKingdom
        section="Quest"
        line="The realm map charts your conquest of 5 openings, node by node, up to the Kingdom Boss. It unlocks once the DNA test has drawn your profile — about 2 minutes."
      />
    );
  }

  const { realm: realmParam } = await searchParams;
  const home = progress.archetype ? ARCHETYPE_REALM[progress.archetype] : "obsidian-court";
  const realm: RealmId = REALM_IDS.includes(realmParam as RealmId) ? (realmParam as RealmId) : home;

  const [mastery, achievements] = await Promise.all([
    getOpeningMastery(session.user.id),
    getAchievements(session.user.id),
  ]);
  // Real conquest dates: the opening_conquered achievement per mainline path.
  const conqueredDates = new Map(
    achievements
      .filter((a) => a.type === "opening_conquered")
      .map((a) => [a.key, a.createdAt] as const),
  );
  const fmtDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const openingIds = (Object.keys(ASSETS.openings) as OpeningId[]).filter(
    (id) => ASSETS.openings[id].realm === realm,
  );

  let availableGiven = false;
  const nodes: QuestNode[] = openingIds.slice(0, NODE_POS.length).map((id, i) => {
    const pathId = OPENING_TO_PATH[id];
    const state = pathId ? mastery[pathId]?.state : undefined;
    let nodeState: QuestNode["state"];
    if (state === "gold") {
      nodeState = "conquered";
    } else if (!availableGiven) {
      nodeState = "available";
      availableGiven = true;
    } else {
      nodeState = "locked";
    }
    // Node dossier: the line's REAL tabiya (fenAfter over the curated
    // mainline) + lines-at-gold count — the panel the map opens on.
    const lineIds = OPENING_LINES[id] ?? [];
    const path = pathId ? STARTER_PATHS.find((p) => p.id === pathId) : undefined;
    return {
      id,
      name: OPENING_NAMES[id],
      state: nodeState,
      x: NODE_POS[i]!.x,
      y: NODE_POS[i]!.y,
      pathId: pathId ?? null,
      linesDone: lineIds.filter((lid) => mastery[lid]?.state === "gold").length,
      linesTotal: lineIds.length,
      tabiyaFen: path ? fenAfter(path, path.moves.length) : null,
      side: path ? (PATH_SIDE[path.id] ?? "white") : "white",
      lastMove: path ? moveSquaresAt(path, path.moves.length - 1) : null,
      conqueredAt:
        nodeState === "conquered" && pathId && conqueredDates.has(pathId)
          ? fmtDate(conqueredDates.get(pathId)!)
          : null,
    };
  });

  const conquered = nodes.filter((n) => n.state === "conquered").length;
  const continueId = nodes.find((n) => n.state === "available")?.id ?? nodes[0]!.id;
  const boss = KINGDOM_BOSSES[realm]!;

  const quest: QuestMapFixture = {
    realm,
    realmName: REALM_NAMES[realm].replace(/^The\s+/, ""),
    realmSub: REALM_SUB[realm],
    nodes,
    bossName: boss.name,
    bossX: 50,
    bossY: 14,
    conquered,
    total: nodes.length,
    continueId,
  };

  return <QuestMapScreen quest={quest} />;
}
