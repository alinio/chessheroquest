"use client";
import { PassportScreen } from "@/src/ui/passport/PassportScreen";
import { DEMO_PLAYER } from "@/src/dev/fixtures";

export default function Page() {
  if (process.env.NODE_ENV === "production") return <div style={{ padding: 40, color: "#aaa", fontFamily: "system-ui" }}>dev-only</div>;
  return <PassportScreen openings={DEMO_PLAYER.openings} />;
}
