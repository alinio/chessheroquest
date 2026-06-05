/**
 * Daily quests (domain — pure). The ~5-minute daily loop (master-vision §13):
 * Daily Quest (due positions) · Weakness Battle (weakest line) · Boss Fight.
 * Generated from real state (due cards, weakest opening) — rewards learning,
 * never grind metrics (§12.0).
 */
import { XP_REWARDS } from "./xp";

export type QuestType = "daily_quest" | "weakness_battle" | "boss_fight";

export interface Quest {
  type: QuestType;
  title: string;
  description: string;
  xpReward: number;
  /** How many items to clear (cards, drills, or 1 boss). */
  target: number;
}

export interface DailyContext {
  /** Number of SRS cards due now. */
  dueCount: number;
  /** Name of the weakest opening, or null if none flagged. */
  weakestOpeningName: string | null;
  /** Name of the opening offered as today's boss, or null. */
  bossOpeningName: string | null;
}

const DAILY_MIN = 1;
const DAILY_MAX = 10;

export function generateDailyQuests(ctx: DailyContext): Quest[] {
  const quests: Quest[] = [];

  const dueTarget = Math.min(DAILY_MAX, Math.max(DAILY_MIN, ctx.dueCount || 5));
  quests.push({
    type: "daily_quest",
    title: "Daily Quest",
    description: `Review ${dueTarget} due position${dueTarget === 1 ? "" : "s"}`,
    xpReward: XP_REWARDS.questComplete,
    target: dueTarget,
  });

  if (ctx.weakestOpeningName) {
    quests.push({
      type: "weakness_battle",
      title: "Weakness Battle",
      description: `Drill your weakest line: ${ctx.weakestOpeningName}`,
      xpReward: XP_REWARDS.weaknessBattle,
      target: 5,
    });
  }

  if (ctx.bossOpeningName) {
    quests.push({
      type: "boss_fight",
      title: "Boss Fight",
      description: `Challenge the ${ctx.bossOpeningName}`,
      xpReward: XP_REWARDS.bossDefeated,
      target: 1,
    });
  }

  return quests;
}
