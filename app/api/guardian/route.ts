/**
 * POST /api/guardian — record a Guardian-duel victory (auth required).
 * Validates the claim against the curated path (server-side: enough correct
 * player plies, within the medium mistake budget), then records the sparring
 * session (FSRS cards + streak + per-move XP) and the flat Guardian bonus.
 * The Passport seal itself stays mastery-driven (LAW #1 — no shortcuts).
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/src/lib/auth";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { DIFFICULTY, PATH_SIDE, pathChallenges } from "@/src/domain/world/guardians";
import { GUARDIANS } from "@/src/domain/world/guardians";
import { PATH_TO_OPENING } from "@/src/lib/opening-paths";
import { XP_REWARDS } from "@/src/domain/gamification/xp";
import { recordTraining, awardXpBonus } from "@/src/data/repos/stats";
import { recordGuardianVictory } from "@/src/data/repos/achievements";

const BodySchema = z.object({
  pathId: z.string().min(1),
  attempts: z
    .array(
      z.object({
        correct: z.boolean(),
        latencyMs: z.number().int().min(0),
        fen: z.string().min(1),
      }),
    )
    .min(1)
    .max(60),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const path = STARTER_PATHS.find((p) => p.id === parsed.data.pathId);
  if (!path) {
    return NextResponse.json({ error: "Unknown path" }, { status: 400 });
  }

  // Victory sanity: every challenge answered correctly, mistakes within budget.
  const side = PATH_SIDE[path.id] ?? "white";
  const required = pathChallenges(path, side).length;
  const correct = parsed.data.attempts.filter((a) => a.correct).length;
  const wrong = parsed.data.attempts.length - correct;
  if (correct < required || wrong > DIFFICULTY.medium.mistakesAllowed) {
    return NextResponse.json({ error: "Duel not won" }, { status: 422 });
  }

  const outcome = await recordTraining(session.user.id, "sparring", parsed.data.attempts);
  await awardXpBonus(session.user.id, XP_REWARDS.bossDefeated);

  // Mark the Guardian as defeated (idempotent) — with gold mastery this is
  // what stamps the Passport seal (seal = gold AND Guardian beaten).
  const openingId = PATH_TO_OPENING[path.id];
  const guardian = openingId ? GUARDIANS[openingId] : undefined;
  await recordGuardianVictory(session.user.id, path.id, guardian?.name ?? "Guardian");

  return NextResponse.json({
    ok: true,
    xp: outcome.xp + XP_REWARDS.bossDefeated,
    streakCount: outcome.streakCount,
    bonus: XP_REWARDS.bossDefeated,
  });
}
