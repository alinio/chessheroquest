/**
 * /boss/realm/[realmId] — the Kingdom Boss gauntlet (realm-completion duel).
 * Gated: every opening of the realm must be GOLD (the claim is earned, LAW #1).
 * Not eligible yet → an honest gate screen listing what remains.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { getOpeningMastery } from "@/src/data/repos/openings";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { KINGDOM_BOSSES } from "@/src/domain/world/guardians";
import { realmPathIds } from "@/src/lib/opening-paths";
import { REALM_NAMES, type RealmId } from "@/src/lib/assets";
import { RealmGauntlet } from "@/src/ui/boss/RealmGauntlet";

export const metadata: Metadata = {
  title: "Kingdom Boss — ChessHeroQuest",
  robots: { index: false },
};

const REALM_IDS: readonly RealmId[] = ["ember-marches", "obsidian-court", "aegis-bastion", "mirage-bazaar"];

export default async function RealmGauntletPage({
  params,
}: {
  params: Promise<{ realmId: string }>;
}) {
  const { realmId } = await params;
  if (!REALM_IDS.includes(realmId as RealmId)) notFound();
  const realm = realmId as RealmId;

  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const boss = KINGDOM_BOSSES[realm]!;
  const realmName = REALM_NAMES[realm].replace(/^The\s+/, "");
  const pathIds = realmPathIds(realm);
  const paths = pathIds
    .map((id) => STARTER_PATHS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const mastery = await getOpeningMastery(session.user.id);
  const remaining = paths.filter((p) => mastery[p.id]?.state !== "gold");

  if (remaining.length > 0) {
    return (
      <div className="chq-boss" style={{ ["--accent" as string]: "#cda845", ["--accent-bright" as string]: "#f1d680" }}>
        <div className="stage">
          <div className="glow" />
          <div className="center">
            <p className="eyebrow">The Gauntlet · {realmName}</p>
            <h1 className="name serif">{boss.name}</h1>
            <p className="subtitle">{boss.title}</p>
            <p className="desc">
              The Kingdom Boss only answers a full champion. Bring every opening of the
              realm to <b style={{ color: "var(--gold-bright, #f1d680)" }}>gold</b> first:
            </p>
            <p className="howto">
              {remaining.map((p) => p.name.split(" — ")[0]).join(" · ")} — still to seal.
            </p>
            <Link className="btn-gold" href="/quest">Back to the realm →</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RealmGauntlet
      realm={realm}
      realmName={realmName}
      bossName={boss.name}
      bossTitle={boss.title}
      paths={paths}
      userId={session.user.id}
    />
  );
}
