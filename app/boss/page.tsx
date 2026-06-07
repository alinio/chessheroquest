/**
 * /boss — Module 7: the seed opening's Opening Guardian fight. Medium validates &
 * conquers the opening (seal + mastery + XP); Easy = tutorial; Hard = Pro mastery.
 * ?opening= selects the Guardian.
 */
import type { Metadata } from "next";
import { BossScreen } from "@/src/ui/world/BossScreen";

export const metadata: Metadata = { title: "Opening Guardian — ChessHeroQuest", robots: { index: false } };

export default function BossPage() {
  return <BossScreen />;
}
