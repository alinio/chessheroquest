"use client";
import { AppShell } from "@/src/ui/shell/AppShell";
import { ProfileScreen } from "@/src/ui/profile/ProfileScreen";
import { DEMO_PLAYER, DEMO_PROFILE } from "@/src/dev/fixtures";
import { getArchetypeSigil, getArchetypeArt } from "@/src/lib/assets";

export default function Page() {
  if (process.env.NODE_ENV === "production") return <div style={{ padding: 40, color: "#aaa", fontFamily: "system-ui" }}>dev-only</div>;
  return (
    <AppShell
      active="profile"
      realmName="The Obsidian Court"
      realmCrest={getArchetypeSigil("strategist")}
      heroAvatar={getArchetypeArt("strategist")}
      streak={DEMO_PLAYER.streakDays}
      iq={DEMO_PLAYER.openingIq}
    >
      <ProfileScreen profile={DEMO_PROFILE} />
    </AppShell>
  );
}
