"use client";
import { useParams } from "next/navigation";
import { AppShell } from "@/src/ui/shell/AppShell";
import { OpeningDetailScreen } from "@/src/ui/opening/OpeningDetailScreen";
import { DEMO_PLAYER } from "@/src/dev/fixtures";
import { getArchetypeSigil, getArchetypeArt, type OpeningId } from "@/src/lib/assets";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  if (process.env.NODE_ENV === "production") return <div style={{ padding: 40, color: "#aaa", fontFamily: "system-ui" }}>dev-only</div>;
  const name = DEMO_PLAYER.openings.find((o) => o.id === id)?.name;
  return (
    <AppShell
      active="quest"
      realmName="The Obsidian Court"
      realmCrest={getArchetypeSigil("strategist")}
      heroAvatar={getArchetypeArt("strategist")}
      streak={DEMO_PLAYER.streakDays}
      iq={DEMO_PLAYER.openingIq}
    >
      <OpeningDetailScreen openingId={id as OpeningId} name={name} />
    </AppShell>
  );
}
