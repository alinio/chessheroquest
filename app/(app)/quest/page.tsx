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
import { ARCHETYPE_REALM, ASSETS, OPENING_NAMES, REALM_NAMES, type OpeningId, type RealmId } from "@/src/lib/assets";
import { OPENING_TO_PATH } from "@/src/lib/opening-paths";
import { KINGDOM_BOSSES } from "@/src/domain/world/guardians";
import { QuestMapScreen } from "@/src/ui/quest/QuestMapScreen";
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
  if (!progress) redirect("/train"); // first-quest prompt lives there

  const { realm: realmParam } = await searchParams;
  const home = progress.archetype ? ARCHETYPE_REALM[progress.archetype] : "obsidian-court";
  const realm: RealmId = REALM_IDS.includes(realmParam as RealmId) ? (realmParam as RealmId) : home;

  const mastery = await getOpeningMastery(session.user.id);
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
    return { id, name: OPENING_NAMES[id], state: nodeState, x: NODE_POS[i]!.x, y: NODE_POS[i]!.y };
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
