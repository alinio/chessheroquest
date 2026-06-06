/**
 * POST /api/coach — server-side, cached AI explanation (LAW #2). Validates the
 * verified-fact payload with Zod, then delegates to the cached coach service.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCoachExplanation } from "@/src/data/ai-coach";

const BodySchema = z.object({
  fen: z.string().min(1),
  move: z.string().optional(),
  bestMove: z.string().optional(),
  evalCp: z.number().optional(),
  eco: z.string().optional(),
  openingName: z.string().optional(),
  level: z.number().optional(),
});

export async function POST(request: Request) {
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

  try {
    const explanation = await getCoachExplanation(parsed.data);
    return NextResponse.json({ explanation });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Coach unavailable" },
      { status: 500 },
    );
  }
}
