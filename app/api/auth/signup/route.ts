/**
 * POST /api/auth/signup — create a free account (email + password). Captures the
 * minor-safety fields at signup (LAW #5) and defaults the profile to private.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/src/data/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/src/lib/password";
import { ageBandFromBirthYear } from "@/src/lib/age";

const BodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  displayName: z.string().min(1).max(64).optional(),
  birthYear: z.number().int().min(1900).max(2025).optional(),
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

  const { email, password, displayName, birthYear } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);
  if (existing[0]) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const currentYear = new Date().getUTCFullYear();
  const ageBand = birthYear ? ageBandFromBirthYear(birthYear, currentYear) : null;

  await db.insert(users).values({
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
    displayName: displayName ?? null,
    birthYear: birthYear ?? null,
    ageBand,
    profilePublic: false, // private by default (LAW #5)
    consentAt: new Date(),
  });

  return NextResponse.json({ ok: true });
}
