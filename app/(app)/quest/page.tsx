/**
 * /quest — Quest Map (realm hub). Rendered inside the hub AppShell (active = Quest).
 * TODO(real-data): node states (conquered/available/locked), current realm and boss
 * from getOpeningMastery + the player's selected realm.
 */
"use client";
import { QuestMapScreen } from "@/src/ui/quest/QuestMapScreen";
import { DEMO_QUEST } from "@/src/dev/fixtures";

export default function QuestPage() {
  return <QuestMapScreen quest={DEMO_QUEST} />;
}
