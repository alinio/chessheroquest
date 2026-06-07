/**
 * /hero-select — Module 5: all 4 heroes; the player's M3 archetype is free, the
 * other 3 are Pro-locked. Select free → /world (M6 stub); locked → /paywall (M8).
 */
import type { Metadata } from "next";
import { HeroSelectScreen } from "@/src/ui/hero-select/HeroSelectScreen";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Choose your Hero — ChessHeroQuest",
  description: "Pick your chess hero and enter their world.",
};

export default function HeroSelectPage() {
  return <HeroSelectScreen />;
}
