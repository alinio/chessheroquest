/**
 * /world/drill — Module 6c: drill the seed opening's line from memory
 * (chess.js-validated) with an SM-2 spaced-repetition scheduler. ?opening= selects.
 */
import type { Metadata } from "next";
import { DrillScreen } from "@/src/ui/world/DrillScreen";

export const metadata: Metadata = { title: "Drill — ChessHeroQuest" };

export default function DrillPage() {
  return <DrillScreen />;
}
