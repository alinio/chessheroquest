"use client";

import Link from "next/link";
import { useCountUp } from "@/src/ui/hooks/useCountUp";
import { rankForIq } from "@/src/domain/iq/calibration";
import { ARCHETYPE_META } from "./DnaCard";
import {
  projectedEloGain,
  roadProgress,
  type EloGoal,
} from "@/src/domain/gamification/road";
import { generateDailyQuests, type QuestType } from "@/src/domain/gamification/quests";
import { xpProgress } from "@/src/domain/gamification/xp";
import type { Archetype } from "@/src/domain/repertoire/types";

export interface DashboardProps {
  /** Real Opening IQ from the user's latest snapshot. */
  iq: number;
  archetype: Archetype | null;
  goal?: EloGoal;
  /** Day streak (0 until daily-loop persistence lands). */
  streakDays?: number;
  /** Total XP (0 until earned). */
  xp?: number;
  /** Cards due for review now. */
  dueCount?: number;
  /** Weakest opening (Weakness Battle target). */
  weakestName?: string;
  weakestSlug?: string;
  /** Boss candidate (strongest not-yet-conquered line). */
  bossName?: string;
  bossSlug?: string;
}

/**
 * The hero's hub (screen S4). Driven by the user's REAL persisted IQ + archetype.
 * Streak/XP default to 0 until the daily-loop persistence is wired.
 */
export function Dashboard({
  iq,
  archetype,
  goal = 1200,
  streakDays = 0,
  xp = 0,
  dueCount = 0,
  weakestName,
  weakestSlug,
  bossName,
  bossSlug,
}: DashboardProps) {
  const questHref = (type: QuestType): string => {
    if (type === "weakness_battle" && weakestSlug) return `/drill/${weakestSlug}`;
    if (type === "boss_fight" && bossSlug) return `/train/${bossSlug}`;
    return "/train";
  };
  const animatedIq = useCountUp(iq);
  const rank = rankForIq(iq);
  const progress = roadProgress(iq, goal);
  const eloGain = projectedEloGain(iq);
  const level = xpProgress(xp);
  const archetypeLabel = archetype ? ARCHETYPE_META[archetype].label : null;

  const quests = generateDailyQuests({
    dueCount,
    weakestOpeningName: weakestName ?? null,
    bossOpeningName: bossName ?? null,
  });

  return (
    <div className="flex flex-col gap-7">
      <section className="text-center">
        <p className="font-display text-text-mid text-xs uppercase tracking-[0.3em]">
          Opening IQ
        </p>
        <p
          className="font-display text-gold-bright text-7xl font-black leading-none tabular-nums"
          style={{ textShadow: "0 0 32px rgba(227,178,60,0.5)" }}
        >
          {animatedIq}
        </p>
        <p className="font-display text-gold mt-1 text-sm">{rank}</p>
        {archetypeLabel && (
          <p className="text-text-low mt-0.5 text-xs">{archetypeLabel}</p>
        )}
      </section>

      <section className="bg-surface rounded-card p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-mid">Road to {goal}</span>
          <span className="text-gold tabular-nums">
            +{eloGain} Elo · {Math.round(progress * 100)}%
          </span>
        </div>
        <div className="bg-raised mt-2 h-2.5 w-full overflow-hidden rounded-chip">
          <div className="bg-gold h-full rounded-chip" style={{ width: `${progress * 100}%` }} />
        </div>
        <p className="text-text-low mt-2 text-xs">Projected estimate — refined as you train.</p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="bg-surface rounded-card flex flex-col items-center p-4">
          <p className="text-3xl leading-none" aria-hidden>🔥</p>
          <p className="font-display text-text-hi mt-1 text-xl font-bold tabular-nums">
            {streakDays}
          </p>
          <p className="text-text-low text-xs">day streak</p>
        </div>
        <div className="bg-surface rounded-card flex flex-col justify-center p-4">
          <p className="font-display text-text-hi text-xl font-bold">Lv {level.level}</p>
          <div className="bg-raised mt-2 h-2 w-full overflow-hidden rounded-chip">
            <div
              className="bg-strategist h-full rounded-chip"
              style={{ width: `${level.needed === 0 ? 0 : (level.into / level.needed) * 100}%` }}
            />
          </div>
          <p className="text-text-low mt-1 text-xs tabular-nums">
            {level.into}/{level.needed} XP
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <p className="font-display text-text-hi text-sm uppercase tracking-[0.2em]">
          Today&apos;s missions
        </p>
        {quests.map((q) => (
          <Link
            key={q.type}
            href={questHref(q.type)}
            className="bg-surface border-hairline rounded-card flex items-center justify-between border p-4"
          >
            <div className="min-w-0">
              <p className="text-text-hi font-medium">{q.title}</p>
              <p className="text-text-mid truncate text-xs">{q.description}</p>
            </div>
            <span className="text-gold shrink-0 pl-3 text-sm tabular-nums">+{q.xpReward} XP</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
