"use client";

import Link from "next/link";
import { useCountUp } from "@/src/ui/hooks/useCountUp";
import { rankForIq } from "@/src/domain/iq/calibration";
import {
  projectedEloGain,
  roadProgress,
  type EloGoal,
} from "@/src/domain/gamification/road";
import { generateDailyQuests, type QuestType } from "@/src/domain/gamification/quests";
import { xpProgress } from "@/src/domain/gamification/xp";

/**
 * PREVIEW seed — replaced by the player's real persisted state once auth lands.
 * Lets the S4 hero hub render end-to-end against the real domain functions.
 */
const SEED = {
  openingIq: 412,
  goal: 1200 as EloGoal,
  streakDays: 5,
  xp: 320,
  dueCount: 8,
  weakestOpening: "Caro-Kann Defense",
  bossOpening: "Italian Game",
};

const QUEST_LINK: Record<QuestType, string> = {
  daily_quest: "/drill",
  weakness_battle: "/drill",
  boss_fight: "/train",
};

/**
 * The hero's hub (master-vision screen S4) — the daily landing surface. Opening
 * IQ as glowing gold treasure, the Road-to-Elo gauge, streak flame, and the 3
 * daily "missions". Built from the real domain (iq/gamification); the numbers
 * become live with persistence.
 */
export function Dashboard() {
  const iq = useCountUp(SEED.openingIq);
  const rank = rankForIq(SEED.openingIq);
  const progress = roadProgress(SEED.openingIq, SEED.goal);
  const eloGain = projectedEloGain(SEED.openingIq);
  const xp = xpProgress(SEED.xp);
  const quests = generateDailyQuests({
    dueCount: SEED.dueCount,
    weakestOpeningName: SEED.weakestOpening,
    bossOpeningName: SEED.bossOpening,
  });

  return (
    <div className="flex flex-col gap-7">
      {/* Hero — Opening IQ as treasure */}
      <section className="text-center">
        <p className="font-display text-text-mid text-xs uppercase tracking-[0.3em]">
          Opening IQ
        </p>
        <p
          className="font-display text-gold-bright text-7xl font-black leading-none tabular-nums"
          style={{ textShadow: "0 0 32px rgba(227,178,60,0.5)" }}
        >
          {iq}
        </p>
        <p className="font-display text-gold mt-1 text-sm">{rank}</p>
      </section>

      {/* Road to Elo gauge */}
      <section className="bg-surface rounded-card p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-mid">Road to {SEED.goal}</span>
          <span className="text-gold tabular-nums">
            +{eloGain} Elo · {Math.round(progress * 100)}%
          </span>
        </div>
        <div className="bg-raised mt-2 h-2.5 w-full overflow-hidden rounded-chip">
          <div className="bg-gold h-full rounded-chip" style={{ width: `${progress * 100}%` }} />
        </div>
        <p className="text-text-low mt-2 text-xs">
          Projected estimate — refined as you train.
        </p>
      </section>

      {/* Streak + level */}
      <section className="grid grid-cols-2 gap-3">
        <div className="bg-surface rounded-card flex flex-col items-center p-4">
          <p className="text-3xl leading-none" aria-hidden>🔥</p>
          <p className="font-display text-text-hi mt-1 text-xl font-bold tabular-nums">
            {SEED.streakDays}
          </p>
          <p className="text-text-low text-xs">day streak</p>
        </div>
        <div className="bg-surface rounded-card flex flex-col justify-center p-4">
          <p className="font-display text-text-hi text-xl font-bold">Lv {xp.level}</p>
          <div className="bg-raised mt-2 h-2 w-full overflow-hidden rounded-chip">
            <div
              className="bg-strategist h-full rounded-chip"
              style={{ width: `${xp.needed === 0 ? 0 : (xp.into / xp.needed) * 100}%` }}
            />
          </div>
          <p className="text-text-low mt-1 text-xs tabular-nums">
            {xp.into}/{xp.needed} XP
          </p>
        </div>
      </section>

      {/* The 3 daily missions */}
      <section className="flex flex-col gap-3">
        <p className="font-display text-text-hi text-sm uppercase tracking-[0.2em]">
          Today&apos;s missions
        </p>
        {quests.map((q) => (
          <Link
            key={q.type}
            href={QUEST_LINK[q.type]}
            className="bg-surface border-hairline rounded-card flex items-center justify-between border p-4"
          >
            <div className="min-w-0">
              <p className="text-text-hi font-medium">{q.title}</p>
              <p className="text-text-mid truncate text-xs">{q.description}</p>
            </div>
            <span className="text-gold shrink-0 pl-3 text-sm tabular-nums">
              +{q.xpReward} XP
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
