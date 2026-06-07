/**
 * GET /api/account/state — current session + saved snapshot.
 * POST /api/account/sync { state } — save the snapshot for the signed-in account.
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/src/data/db";
import { accountStates } from "@/db/schema";
import { verifySession, SESSION_COOKIE } from "@/src/lib/session";

async function sessionEmail(): Promise<string | null> {
  const jar = await cookies();
  return verifySession(jar.get(SESSION_COOKIE)?.value);
}

export async function GET() {
  const email = await sessionEmail();
  if (!email) return NextResponse.json({ signedIn: false, isPro: false, plan: "free" });
  const rows = await db
    .select({ state: accountStates.state, isPro: accountStates.isPro, plan: accountStates.plan })
    .from(accountStates)
    .where(eq(accountStates.email, email))
    .limit(1);
  const row = rows[0];
  return NextResponse.json({
    signedIn: true,
    email,
    state: row?.state ?? null,
    isPro: row?.isPro ?? false, // server-verified (M9b) — the entitlement source of truth
    plan: row?.plan ?? "free",
  });
}
