"use client";
import { AppShell } from "@/src/ui/shell/AppShell";
import { PassportScreen } from "@/src/ui/passport/PassportScreen";
import { DEMO_PLAYER } from "@/src/dev/fixtures";
import { getArchetypeSigil, getArchetypeArt } from "@/src/lib/assets";

export default function Page() {
  if (process.env.NODE_ENV === "production") return <div style={{ padding: 40, color: "#aaa", fontFamily: "system-ui" }}>dev-only</div>;
  return (
    <AppShell
      active="passport"
      realmName="The Obsidian Court"
      realmCrest={getArchetypeSigil("strategist")}
      heroAvatar={getArchetypeArt("strategist")}
      streak={DEMO_PLAYER.streakDays}
      iq={DEMO_PLAYER.openingIq}
    >
      <PassportScreen openings={DEMO_PLAYER.openings} />
    </AppShell>
  );
}
