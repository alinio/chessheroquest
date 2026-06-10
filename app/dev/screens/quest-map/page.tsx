"use client";
import { AppShell } from "@/src/ui/shell/AppShell";
import { QuestMapScreen } from "@/src/ui/quest/QuestMapScreen";
import { DEMO_PLAYER, DEMO_QUEST } from "@/src/dev/fixtures";
import { getArchetypeSigil, getArchetypeArt } from "@/src/lib/assets";

export default function Page() {
  if (process.env.NODE_ENV === "production") return <div style={{ padding: 40, color: "#aaa", fontFamily: "system-ui" }}>dev-only</div>;
  return (
    <AppShell
      active="quest"
      realmName="The Ember Marches"
      realmCrest={getArchetypeSigil("warrior")}
      heroAvatar={getArchetypeArt("warrior")}
      streak={DEMO_PLAYER.streakDays}
      iq={DEMO_PLAYER.openingIq}
    >
      <QuestMapScreen quest={DEMO_QUEST} />
    </AppShell>
  );
}
