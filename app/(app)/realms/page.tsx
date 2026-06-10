/**
 * /realms — the 4-worlds overview (inside AppShell).
 * TODO(real-data): per-realm sealed counts + current realm from the player's progress.
 */
"use client";
import { RealmsScreen } from "@/src/ui/realms/RealmsScreen";
import { DEMO_REALMS } from "@/src/dev/fixtures";

export default function RealmsPage() {
  return <RealmsScreen realms={DEMO_REALMS} />;
}
