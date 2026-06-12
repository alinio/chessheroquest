/**
 * Admin fortress — Phase A access control (LAW #7, ADMIN.md).
 *
 * Phase A uses an environment allowlist (ADMIN_EMAILS, comma-separated) so no
 * migration is needed; a real `role` column in the DB + RBAC arrives in Phase B.
 *
 * Security posture: a non-admin must not even learn the route exists, so
 * `requireAdmin()` renders the 404 page (`notFound()`) instead of a telling 403.
 */
import { notFound } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { env } from "@/src/lib/env";

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
}

/**
 * Server guard for every admin page, layout, server action and route handler
 * (defense in depth — the layout alone does not protect server actions).
 * No session or email not on the allowlist → 404, never a talking 403.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await auth();
  const email = session?.user?.email;
  const userId = session?.user?.id;
  if (!email || !userId || !isAdminEmail(email)) notFound();
  return { userId, email: email.trim().toLowerCase() };
}
