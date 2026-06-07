/**
 * /dna-test — Module 2: the free, no-signup Chess DNA Test (20-position adaptive,
 * seed bank). Built fresh on the M1 design system; the legacy /dna stays live until
 * the new flow (M2→M3→M4) is complete and ready to take over.
 */
import type { Metadata } from "next";
import { DnaTestScreen } from "@/src/ui/dna-test/DnaTestScreen";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Chess DNA Test — ChessHeroQuest",
  description: "Discover your Chess DNA: 20 positions, your Opening IQ, your style. Free, ~2 minutes, no signup.",
};

export default function DnaTestPage() {
  return <DnaTestScreen />;
}
