/**
 * POST /api/settings — update the signed-in user's Road-to-Elo goal.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/data/db";
import { users } from "@/db/schema";

const BodySchema = z.object({
  eloGoal: z.union([z.literal(1000), z.literal(1200), z.literal(1500), z.literal(1800)]),
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
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await db
    .update(users)
    .set({ eloGoal: parsed.data.eloGoal, updatedAt: new Date() })
    .where(eq(users.id, session.user.id));

  return NextResponse.json({ ok: true });
}
