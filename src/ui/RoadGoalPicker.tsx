"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ELO_GOALS, type EloGoal } from "@/src/domain/gamification/road";

/** Pick your Road-to-Elo destination (master-vision §5). Persists + refreshes. */
export function RoadGoalPicker({ current }: { current: number }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function pick(goal: EloGoal) {
    if (goal === current || saving) return;
    setSaving(true);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ eloGoal: goal }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <section className="flex flex-col gap-2">
      <p className="font-display text-text-hi text-sm uppercase tracking-[0.2em]">Road to Elo</p>
      <div className="grid grid-cols-4 gap-2">
        {ELO_GOALS.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => pick(g)}
            disabled={saving}
            className={`rounded-card min-h-[44px] text-sm font-semibold ${
              g === current
                ? "bg-gold text-abyss"
                : "bg-surface border-hairline text-text-mid border"
            }`}
          >
            {g}
          </button>
        ))}
      </div>
    </section>
  );
}
