"use client";
import { AppShell } from "@/src/ui/shell/AppShell";
import { PassportScreen, type NextSealView, type PassportOpeningView } from "@/src/ui/passport/PassportScreen";
import { DEMO_PLAYER } from "@/src/dev/fixtures";
import { getArchetypeSigil, getArchetypeArt, OPENING_NAMES } from "@/src/lib/assets";
import { OPENING_TO_PATH } from "@/src/lib/opening-paths";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { fenAfter, moveSquaresAt } from "@/src/domain/repertoire/line";
import { GUARDIANS, PATH_SIDE } from "@/src/domain/world/guardians";

/* Demo medallion states (boards still derive from REAL curated paths). */
const READY = new Set(["nimzo-indian"]);
const TRAINING: Record<string, { studied: number; chip: string }> = {
  catalan: { studied: 8, chip: "Solid" },
  "kings-gambit": { studied: 4, chip: "Leak" },
  petroff: { studied: 6, chip: "Fading" },
};

export default function Page() {
  if (process.env.NODE_ENV === "production") return <div style={{ padding: 40, color: "#aaa", fontFamily: "system-ui" }}>dev-only</div>;

  const openings: PassportOpeningView[] = DEMO_PLAYER.openings.map((o) => {
    const pathId = OPENING_TO_PATH[o.id] ?? null;
    const total = STARTER_PATHS.find((p) => p.id === pathId)?.moves.length ?? 10;
    const t = TRAINING[o.id];
    const medallion = o.mastered ? "sealed" : READY.has(o.id) ? "ready" : t ? "training" : "unexplored";
    return {
      id: o.id,
      name: o.name,
      medallion,
      studied: medallion === "sealed" || medallion === "ready" ? total : (t?.studied ?? 0),
      total,
      chip: t?.chip ?? null,
      sealedDate: o.mastered ? "May 14" : null,
      href: null,
    };
  });

  const nsPath = STARTER_PATHS.find((p) => p.id === OPENING_TO_PATH["nimzo-indian"])!;
  const nextSeal: NextSealView = {
    openingId: "nimzo-indian",
    openingName: OPENING_NAMES["nimzo-indian"],
    ready: true,
    studied: nsPath.moves.length,
    total: nsPath.moves.length,
    guardianName: GUARDIANS["nimzo-indian"]!.name,
    guardianArt: GUARDIANS["nimzo-indian"]!.art,
    board: {
      fen: fenAfter(nsPath, nsPath.moves.length),
      orientation: PATH_SIDE[nsPath.id] ?? "white",
      lastMove: moveSquaresAt(nsPath, nsPath.moves.length - 1),
    },
    href: `/boss/${nsPath.id}`,
  };

  return (
    <AppShell
      active="passport"
      realmName="The Obsidian Court"
      realmCrest={getArchetypeSigil("strategist")}
      heroAvatar={getArchetypeArt("strategist")}
      streak={DEMO_PLAYER.streakDays}
      iq={DEMO_PLAYER.openingIq}
    >
      <PassportScreen openings={openings} nextSeal={nextSeal} />
    </AppShell>
  );
}
