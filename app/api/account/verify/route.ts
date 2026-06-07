/**
 * GET /api/account/verify?email&token — consume the magic link, set the session
 * cookie, and bounce to the world (welcome=1 triggers the localStorage→account
 * migration). Invalid/expired → welcome=err.
 */
import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/src/data/db";
import { accountStates } from "@/db/schema";
import { signSession, SESSION_COOKIE } from "@/src/lib/session";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = (url.searchParams.get("email") ?? "").toLowerCase();
  const token = url.searchParams.get("token") ?? "";

  const rows = await db.select().from(accountStates).where(eq(accountStates.email, email)).limit(1);
  const acct = rows[0];
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const valid =
    acct?.tokenHash != null &&
    acct.tokenExpires != null &&
    acct.tokenHash === tokenHash &&
    acct.tokenExpires.getTime() > Date.now();

  if (!valid) return NextResponse.redirect(new URL("/world?welcome=err", url.origin));

  // Single-use: consume the token.
  await db.update(accountStates).set({ tokenHash: null, tokenExpires: null }).where(eq(accountStates.email, email));

  const jwt = await signSession(email);
  const res = NextResponse.redirect(new URL("/world?welcome=1", url.origin));
  res.cookies.set(SESSION_COOKIE, jwt, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
