/**
 * /world — Module 6a: the selected hero's World Map (nodes on the world art) +
 * the Opening Node panel. Learn/Drill/Boss route on to 6b/6c/M7.
 */
import type { Metadata } from "next";
import { WorldMapScreen } from "@/src/ui/world/WorldMapScreen";

export const metadata: Metadata = { title: "Your World — ChessHeroQuest" };

export default function WorldPage() {
  return <WorldMapScreen />;
}
