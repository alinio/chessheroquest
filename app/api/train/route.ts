/**
 * POST /api/train — record a training session (auth required). Logs each attempt
 * (the moat) and advances the user's streak + XP. Validated with Zod.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/src/lib/auth";
import { recordTraining } from "@/src/data/repos/stats";
import { getOpeningMastery } from "@/src/data/repos/openings";

const BodySchema = z.object({
  mode: z.enum(["learn", "drill", "review", "sparring", "dna_test"]),
  /** Curated path the session trained — when present, the response carries the
      line's POST-session mastery (drives the inline GOLD celebration). */
  pathId: z.string().min(1).optional(),
  attempts: z
    .array(
      z.object({
        correct: z.boolean(),
        latencyMs: z.number().int().min(0),
        fen: z.string().min(1).optional(),
      }),
    )
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

  const outcome = await recordTraining(
    session.user.id,
    parsed.data.mode,
    parsed.data.attempts,
  );

  // Real post-session mastery of the trained line (never computed client-side).
  let mastery: { state: string; studied: number; total: number } | null = null;
  if (parsed.data.pathId) {
    const m = (await getOpeningMastery(session.user.id))[parsed.data.pathId];
    if (m) mastery = { state: m.state, studied: m.studied, total: m.total };
  }

  return NextResponse.json({ ok: true, ...outcome, mastery });
}
