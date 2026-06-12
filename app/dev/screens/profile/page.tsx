"use client";
import { AppShell } from "@/src/ui/shell/AppShell";
import { ProfileScreen, type ProfileData } from "@/src/ui/profile/ProfileScreen";
import { DEMO_PLAYER } from "@/src/dev/fixtures";
import { getArchetypeSigil, getArchetypeArt } from "@/src/lib/assets";

const DEMO: ProfileData = {
  name: "Alex",
  email: "alex@example.com",
  archetype: "strategist",
  realmName: "The Obsidian Court",
  joined: "Mar 2026",
  dominantTitle: "Queen's Gambit Scholar",
  level: 14,
  xpInto: 740,
  xpNeeded: 1450,
  iq: DEMO_PLAYER.openingIq,
  iqDelta: 118,
  iqTrend: [624, 640, 655, 661, 688, 700, 711, 742],
  practicalElo: 1500,
  rankName: "Opening Grandmaster",
  seals: DEMO_PLAYER.openings.filter((o) => o.mastered).map((o) => ({ id: o.id, name: o.name })),
  totalOpenings: 20,
  bestStreak: 21,
  drillsAnswered: 1240,
  eloGoal: 1500,
  dna: null,
};

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
      <ProfileScreen data={DEMO} />
    </AppShell>
  );
}
