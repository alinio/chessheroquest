"use client";
import { ArrivalScreen } from "@/src/ui/onboarding/ArrivalScreen";
import { DEMO_ARRIVAL } from "@/src/dev/fixtures";

export default function Page() {
  if (process.env.NODE_ENV === "production") return <div style={{ padding: 40, color: "#aaa", fontFamily: "system-ui" }}>dev-only</div>;
  return <ArrivalScreen arrival={DEMO_ARRIVAL} />;
}
