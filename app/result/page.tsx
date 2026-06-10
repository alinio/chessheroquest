/**
 * /result — Chess DNA reveal (S2). Immersive, no shell.
 * TODO(real-data): map the persisted M2 (Opening IQ + per-opening) + M3 (archetype +
 * match% + traits) into DnaFixture; fall back to sample when no test taken. The legacy
 * ResultScreen (real profile + 1080×1350 share card + Save) is preserved in
 * src/ui/result/ResultScreen — port Share/Download/Save wiring onto this screen.
 */
import type { Metadata } from "next";
import { DnaResultsScreen } from "@/src/ui/result/DnaResultsScreen";
import { DEMO_DNA } from "@/src/dev/fixtures";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Your Chess DNA — ChessHeroQuest",
  description: "Your Opening IQ, your archetype, your strengths and weaknesses — and your Road to Elo.",
};

export default function ResultPage() {
  return <DnaResultsScreen dna={DEMO_DNA} />;
}
