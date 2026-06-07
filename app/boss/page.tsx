/**
 * /boss — Opening Guardian (pre-fight). Immersive, no shell.
 * TODO(real-data): derive the Guardian from the current opening's realm (?opening=) —
 * name/subtitle/description/taunt from a boss table; wire "Begin the duel" to the actual
 * board fight (legacy src/ui/world/BossScreen is preserved, not yet routed).
 */
import type { Metadata } from "next";
import { BossFightScreen } from "@/src/ui/boss/BossFightScreen";
import { DEMO_BOSS } from "@/src/dev/fixtures";

export const metadata: Metadata = { title: "Opening Guardian — ChessHeroQuest", robots: { index: false } };

export default function BossPage() {
  return <BossFightScreen boss={DEMO_BOSS} />;
}
