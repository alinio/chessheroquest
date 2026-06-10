"use client";
import { AppShell } from "@/src/ui/shell/AppShell";
import { InsightsScreen } from "@/src/ui/insights/InsightsScreen";
import { DEMO_PLAYER, DEMO_INSIGHTS } from "@/src/dev/fixtures";
import { getArchetypeSigil, getArchetypeArt } from "@/src/lib/assets";

export default function Page() {
  if (process.env.NODE_ENV === "production") return <div style={{ padding: 40, color: "#aaa", fontFamily: "system-ui" }}>dev-only</div>;
  return (
    <AppShell
      active="insights"
      realmName="The Obsidian Court"
      realmCrest={getArchetypeSigil("strategist")}
      heroAvatar={getArchetypeArt("strategist")}
      streak={DEMO_PLAYER.streakDays}
      iq={DEMO_PLAYER.openingIq}
    >
      <InsightsScreen data={DEMO_INSIGHTS} />
    </AppShell>
  );
}
