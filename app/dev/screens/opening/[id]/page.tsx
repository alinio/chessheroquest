"use client";
import { useParams } from "next/navigation";
import { OpeningDetailScreen } from "@/src/ui/opening/OpeningDetailScreen";
import { DEMO_PLAYER } from "@/src/dev/fixtures";
import type { OpeningId } from "@/src/lib/assets";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  if (process.env.NODE_ENV === "production") return <div style={{ padding: 40, color: "#aaa", fontFamily: "system-ui" }}>dev-only</div>;
  const name = DEMO_PLAYER.openings.find((o) => o.id === id)?.name;
  return <OpeningDetailScreen openingId={id as OpeningId} name={name} />;
}
