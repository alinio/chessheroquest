/**
 * POST /api/account/sync { state } — persist the client snapshot for the signed-in
 * account. 401 if not signed in.
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/src/data/db";
import { accountStates } from "@/db/schema";
import { verifySession, SESSION_COOKIE } from "@/src/lib/session";

const BodySchema = z.object({ state: z.record(z.string(), z.string()) });

export async function POST(request: Request) {
  const jar = await cookies();
  const email = await verifySession(jar.get(SESSION_COOKIE)?.value);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = BodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid state" }, { status: 400 });

  await db
    .update(accountStates)
    .set({ state: parsed.data.state, updatedAt: new Date() })
    .where(eq(accountStates.email, email));

  return NextResponse.json({ ok: true });
}
