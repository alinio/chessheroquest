/**
 * /insights — analytics hub section (inside AppShell, active = Insights).
 * TODO(real-data): build InsightsFixture from the IQ history + synced games
 * (Lichess/Chess.com) aggregation instead of DEMO_INSIGHTS.
 */
"use client";
import { InsightsScreen } from "@/src/ui/insights/InsightsScreen";
import { DEMO_INSIGHTS } from "@/src/dev/fixtures";

export default function InsightsPage() {
  return <InsightsScreen data={DEMO_INSIGHTS} />;
}
