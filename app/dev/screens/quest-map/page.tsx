"use client";
import { WorldMapScreen } from "@/src/ui/world/WorldMapScreen";

export default function Page() {
  if (process.env.NODE_ENV === "production") return <div style={{ padding: 40, color: "#aaa", fontFamily: "system-ui" }}>dev-only</div>;
  return <WorldMapScreen />;
}
