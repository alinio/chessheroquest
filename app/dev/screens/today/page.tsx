"use client";
import { TodayScreen } from "@/src/ui/today/TodayScreen";
import { DEMO_PLAYER } from "@/src/dev/fixtures";

export default function Page() {
  if (process.env.NODE_ENV === "production") return <div style={{ padding: 40, color: "#aaa", fontFamily: "system-ui" }}>dev-only</div>;
  return <TodayScreen player={DEMO_PLAYER} />;
}
