/**
 * POST /api/account/request-link { email } — issue a passwordless magic link.
 * The actual issuance (token mint + upsert + send) lives in
 * src/lib/magic-link.ts, shared with the admin "Send magic link" action.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { issueMagicLink } from "@/src/lib/magic-link";

const BodySchema = z.object({ email: z.string().email().max(320) });

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  const origin = new URL(request.url).origin;
  await issueMagicLink(parsed.data.email, origin);

  return NextResponse.json({ ok: true });
}
