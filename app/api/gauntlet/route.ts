/**
 * POST /api/gauntlet — record a Kingdom-Boss gauntlet victory (auth required).
 * Server-side validation: enough correct player plies across ALL the realm's
 * curated paths, within the 2-slip budget. Records the sparring session (FSRS
 * cards + streak + per-move XP) and the kingdomConquered bonus. The realm
 * "claimed" state stays derived from gold mastery (LAW #1).
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/src/lib/auth";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { PATH_SIDE, pathChallenges } from "@/src/domain/world/guardians";
import { realmPathIds } from "@/src/lib/opening-paths";
import { XP_REWARDS } from "@/src/domain/gamification/xp";
import { recordTraining, awardXpBonus } from "@/src/data/repos/stats";

const MISTAKES_ALLOWED = 2;

const BodySchema = z.object({
  realm: z.enum(["ember-marches", "obsidian-court", "aegis-bastion", "mirage-bazaar"]),
  attempts: z
    .array(
      z.object({
        correct: z.boolean(),
        latencyMs: z.number().int().min(0),
        fen: z.string().min(1),
      }),
    )
    .min(1)
    .max(200),
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

  // Victory sanity: every player ply of every realm path answered correctly.
  const paths = realmPathIds(parsed.data.realm)
    .map((id) => STARTER_PATHS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const required = paths.reduce(
    (sum, p) => sum + pathChallenges(p, PATH_SIDE[p.id] ?? "white").length,
    0,
  );
  const correct = parsed.data.attempts.filter((a) => a.correct).length;
  const wrong = parsed.data.attempts.length - correct;
  if (correct < required || wrong > MISTAKES_ALLOWED) {
    return NextResponse.json({ error: "Gauntlet not won" }, { status: 422 });
  }

  const outcome = await recordTraining(session.user.id, "sparring", parsed.data.attempts);
  await awardXpBonus(session.user.id, XP_REWARDS.kingdomConquered);

  return NextResponse.json({
    ok: true,
    xp: outcome.xp + XP_REWARDS.kingdomConquered,
    streakCount: outcome.streakCount,
    bonus: XP_REWARDS.kingdomConquered,
  });
}
