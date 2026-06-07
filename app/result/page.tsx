/**
 * /result — Module 4: the Chess DNA payoff. Reads the persisted M2 (Opening IQ +
 * per-opening) and M3 (archetype + match% + reasons) results, renders the full
 * profile + a pixel-exact 1080×1350 shareable DNA card, and routes on to Hero
 * Select (M5). Runnable standalone with flagged sample data.
 */
import type { Metadata } from "next";
import { ResultScreen } from "@/src/ui/result/ResultScreen";

export const metadata: Metadata = {
  title: "Your Chess DNA — ChessHeroQuest",
  description: "Your Opening IQ, your archetype, your strengths and weaknesses — and your Road to Elo.",
};

export default function ResultPage() {
  return <ResultScreen />;
}
