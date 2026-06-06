/**
 * POST /api/train — record a training session (auth required). Logs each attempt
 * (the moat) and advances the user's streak + XP. Validated with Zod.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/src/lib/auth";
import { recordTraining } from "@/src/data/repos/stats";

const BodySchema = z.object({
  mode: z.enum(["learn", "drill", "review", "sparring", "dna_test"]),
  attempts: z
    .array(z.object({ correct: z.boolean(), latencyMs: z.number().int().min(0) }))
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
  return NextResponse.json({ ok: true, ...outcome });
}
