/**
 * Admin fortress — access control (LAW #7, ADMIN.md).
 *
 * Phase B: an admin is either
 *  - on the ADMIN_EMAILS env allowlist (break-glass — always active), OR
 *  - `users.role = 'admin'` in the DB (migration 0011).
 *
 * The DB read is wrapped in try/catch on purpose: if migration 0011 is not yet
 * applied in an environment, the allowlist keeps working alone (apply with
 * `npm run db:migrate`). Role CHANGES are reserved to allowlist admins
 * (anti-escalation: a DB-role admin cannot mint other admins).
 *
 * Security posture: a non-admin must not even learn the route exists, so
 * `requireAdmin()` renders the 404 page (`notFound()`) instead of a telling 403.
 */
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/src/lib/auth";
import { env } from "@/src/lib/env";
import { db } from "@/src/data/db";
import { users } from "@/db/schema";

/** Parse a comma-separated allowlist into normalized (lowercase, trimmed) emails. */
export function parseAdminEmails(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0);
}

/**
 * Is this email on the admin allowlist? Comparison is lowercase + trimmed.
 * `allowlist` is injectable for tests; defaults to ADMIN_EMAILS.
 */
export function isAdminEmail(
  email: string | null | undefined,
  allowlist: string | undefined = env.ADMIN_EMAILS,
): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  return parseAdminEmails(allowlist).includes(normalized);
}

export interface AdminSession {
  userId: string;
  email: string;
  /**
   * true when access came from the ADMIN_EMAILS env allowlist (break-glass).
   * Role changes (set/remove admin) are ONLY allowed when this is true —
   * a DB-role admin must never be able to escalate others (or itself back).
   */
  viaAllowlist: boolean;
}

/**
 * Does this user carry `role = 'admin'` in the DB? Failure-safe: any DB error
 * (e.g. migration 0011 not applied yet → column missing) reads as "not admin"
 * so the env allowlist remains the working fallback.
 */
async function hasAdminRole(userId: string): Promise<boolean> {
  try {
    const [row] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    return row?.role === "admin";
  } catch {
    return false;
  }
}

/**
 * Server guard for every admin page, layout, server action and route handler
 * (defense in depth — the layout alone does not protect server actions).
 * No session, or neither allowlisted nor role-admin → 404, never a talking 403.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await auth();
  const email = session?.user?.email;
  const userId = session?.user?.id;
  if (!email || !userId) notFound();
  const viaAllowlist = isAdminEmail(email);
  if (!viaAllowlist && !(await hasAdminRole(userId))) notFound();
  return { userId, email: email.trim().toLowerCase(), viaAllowlist };
}
