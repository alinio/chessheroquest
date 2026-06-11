/**
 * /result — the profile reveal: test + quiz → YOUR Chess DNA (real data from
 * both stores; sample fallback only when nothing was taken). The funnel step
 * between the quiz and /hero-select — its primary CTA carries the player there.
 */
import type { Metadata } from "next";
import { ResultScreen } from "@/src/ui/result/ResultScreen";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Your Chess DNA — ChessHeroQuest",
  description: "Your Opening IQ, your archetype, your strengths and weaknesses — and your Road to Elo.",
};

export default function ResultPage() {
  return <ResultScreen />;
}
