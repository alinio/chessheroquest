/**
 * /world/learn — Module 6b: guided Learn walkthrough of the seed opening's main
 * line (real curated FENs), then seeds the SRS cards. ?opening= selects the line.
 */
import type { Metadata } from "next";
import { LearnScreen } from "@/src/ui/world/LearnScreen";

export const metadata: Metadata = { title: "Learn — ChessHeroQuest" };

export default function LearnPage() {
  return <LearnScreen />;
}
