"use client";
import { BossScreen } from "@/src/ui/world/BossScreen";

export default function Page() {
  if (process.env.NODE_ENV === "production") return <div style={{ padding: 40, color: "#aaa", fontFamily: "system-ui" }}>dev-only</div>;
  return <BossScreen />;
}
