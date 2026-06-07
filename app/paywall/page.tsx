/**
 * /paywall — Module 8: Pro paywall + Paddle checkout. Triggered by a locked hero
 * (M5 ?hero=) or Hard mode (M7 ?hard=). On checkout.completed → set the single
 * entitlement source (useEntitlement) → unlocks propagate to M5/M6/M7.
 */
import type { Metadata } from "next";
import { PaywallScreen } from "@/src/ui/paywall/PaywallScreen";

export const metadata: Metadata = { title: "Go Pro — ChessHeroQuest" };

export default function PaywallPage() {
  return <PaywallScreen />;
}
