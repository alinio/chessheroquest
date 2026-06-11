/**
 * POST /api/dna-test — persist a signed-in user's completed DNA Test (seeds their
 * first Opening IQ + archetype). Auth required; validated with Zod at the boundary.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/src/lib/auth";
import { saveDnaResult } from "@/src/data/repos/progress";

const Archetype = z.enum(["warrior", "strategist", "defender", "trickster"]);

const BodySchema = z.object({
  archetype: Archetype,
  core: z.number().min(0).max(1),
  initialIq: z.number().int().min(0).max(1000),
  rank: z.string(),
  percentile: z.number().min(0).max(100),
  strongestArchetype: Archetype,
  weakestArchetype: Archetype,
  recommendedPathId: z.string(),
  answered: z.number().int().min(0),
  correctCount: z.number().int().min(0),
  // New-flow extras (optional, kept in the raw jsonb — feed /welcome's real diagnosis)
  strongestFamily: z.string().optional(),
  weakestFamily: z.string().nullable().optional(),
  strongestPct: z.number().min(0).max(100).optional(),
  weakestPct: z.number().min(0).max(100).optional(),
  weakFen: z.string().optional(),
  weakOrientation: z.enum(["white", "black"]).optional(),
  weakEco: z.string().optional(),
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

  await saveDnaResult(session.user.id, parsed.data);
  return NextResponse.json({ ok: true });
}
