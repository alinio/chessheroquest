/**
 * /train — Today / Train dashboard (the daily loop). Rendered inside the hub
 * AppShell (applied by app/(app)/layout.tsx).
 * TODO(real-data): DEMO_PLAYER is a placeholder — wire IQ/streak/daily goal/Due
 * Drills/recommended/strongest/weakness from the real player + SRS state.
 */
import { TodayScreen } from "@/src/ui/today/TodayScreen";
import { DEMO_PLAYER } from "@/src/dev/fixtures";

export default function TodayPage() {
  return <TodayScreen player={DEMO_PLAYER} />;
}
