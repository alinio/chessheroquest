"use client";
import { BossFightScreen } from "@/src/ui/boss/BossFightScreen";
import { DEMO_BOSS } from "@/src/dev/fixtures";

export default function Page() {
  if (process.env.NODE_ENV === "production") return <div style={{ padding: 40, color: "#aaa", fontFamily: "system-ui" }}>dev-only</div>;
  return <BossFightScreen boss={DEMO_BOSS} />;
}
