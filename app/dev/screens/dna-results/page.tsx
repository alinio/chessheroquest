"use client";
import { DnaResultsScreen } from "@/src/ui/result/DnaResultsScreen";
import { DEMO_DNA } from "@/src/dev/fixtures";

export default function Page() {
  if (process.env.NODE_ENV === "production") return <div style={{ padding: 40, color: "#aaa", fontFamily: "system-ui" }}>dev-only</div>;
  return <DnaResultsScreen dna={DEMO_DNA} />;
}
