/**
 * /style-quiz — Module 3: the 16-question Style Quiz → archetype recommendation.
 * Follows the DNA test in the new flow; ends in a stub (DNA Card = M4).
 */
import type { Metadata } from "next";
import { StyleQuizScreen } from "@/src/ui/style-quiz/StyleQuizScreen";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Chess DNA — Style Quiz",
  description: "16 quick questions to reveal your chess archetype and your recommended Hero.",
};

export default function StyleQuizPage() {
  return <StyleQuizScreen />;
}
