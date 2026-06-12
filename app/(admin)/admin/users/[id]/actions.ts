"use server";

/**
 * Admin · user server actions (Phase B). LAW #7 protocol, every action:
 *   1. requireAdmin() FIRST — defense in depth (the layout protects nothing here);
 *   2. zod-validate the payload;
 *   3. STRICT audit-of-intent write (action + actor + target + before/after) —
 *      neon-http has no transactions, so the audit row goes in BEFORE the
 *      mutation and a failed audit insert aborts the action entirely;
 *   4. mutate, revalidate the fiche, return inline state (useActionState).
 *
 * Extra rails:
 *  - role changes are reserved to ADMIN_EMAILS allowlist admins (anti-escalation
 *    — a DB-role admin must never mint or unmake admins);
 *  - an admin can never delete/anonymize themself nor drop their own role;
 *  - destructive actions (delete/anonymize) require re-typing the target's
 *    exact email, compared server-side.
 */
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/src/lib/admin";
import { env } from "@/src/lib/env";
import { issueMagicLink } from "@/src/lib/magic-link";
import {
  anonymizeUserRows,
  anonymizedEmailFor,
  deleteUserCascade,
  getActionTarget,
  grantPremiumPlan,
  logAdminAction,
  revokePremiumPlan,
  setUserRole,
  type AdminActionTarget,
} from "@/src/data/repos/admin";

export interface ActionState {
  ok: boolean;
  message: string;
}

const IdSchema = z.object({ userId: z.string().uuid() });
const RoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["user", "admin"]),
});
const ConfirmSchema = z.object({
  userId: z.string().uuid(),
  confirmEmail: z.string().min(3).max(320),
});

function fail(message: string): ActionState {
  return { ok: false, message };
}

/** Server-side re-typed-email check for destructive actions (trim + lowercase). */
function emailConfirmed(target: AdminActionTarget, confirmEmail: string): boolean {
  return confirmEmail.trim().toLowerCase() === target.email.trim().toLowerCase();
}

/* -------------------------------------------------- premium (grant / revoke) */

export async function grantPremiumAction(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = IdSchema.safeParse({ userId: formData.get("userId") });
  if (!parsed.success) return fail("Invalid payload.");
  const target = await getActionTarget(parsed.data.userId);
  if (!target) return fail("User not found.");

  await logAdminAction({
    actorUserId: admin.userId,
    action: "admin_grant_premium",
    targetType: "user",
    targetId: target.id,
    metadata: {
      email: target.email,
      before: { plan: target.accountPlan ?? "free", isPro: target.isPro },
      after: { plan: "lifetime", isPro: true },
    },
  });
  try {
    await grantPremiumPlan(target.email);
  } catch {
    return fail("Grant failed (entitlement write error). Audit row recorded.");
  }
  revalidatePath(`/admin/users/${target.id}`);
  return { ok: true, message: `Premium (lifetime) granted to ${target.email}.` };
}

export async function revokePremiumAction(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = IdSchema.safeParse({ userId: formData.get("userId") });
  if (!parsed.success) return fail("Invalid payload.");
  const target = await getActionTarget(parsed.data.userId);
  if (!target) return fail("User not found.");

  await logAdminAction({
    actorUserId: admin.userId,
    action: "admin_revoke_premium",
    targetType: "user",
    targetId: target.id,
    metadata: {
      email: target.email,
      before: { plan: target.accountPlan ?? "free", isPro: target.isPro },
      after: { plan: "free", isPro: false },
    },
  });
  try {
    await revokePremiumPlan(target.email);
  } catch {
    return fail("Revoke failed (entitlement write error). Audit row recorded.");
  }
  revalidatePath(`/admin/users/${target.id}`);
  return { ok: true, message: `Premium revoked — ${target.email} is back to free.` };
}

/* ----------------------------------------------------------------- magic link */

export async function sendMagicLinkAction(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = IdSchema.safeParse({ userId: formData.get("userId") });
  if (!parsed.success) return fail("Invalid payload.");
  const target = await getActionTarget(parsed.data.userId);
  if (!target) return fail("User not found.");

  await logAdminAction({
    actorUserId: admin.userId,
    action: "admin_send_magic_link",
    targetType: "user",
    targetId: target.id,
    // Never log the token — only the fact a link was issued, and to whom.
    metadata: { email: target.email },
  });
  try {
    await issueMagicLink(target.email, env.NEXT_PUBLIC_APP_URL);
  } catch {
    return fail("Magic-link send failed. Audit row recorded.");
  }
  revalidatePath(`/admin/users/${target.id}`);
  return { ok: true, message: `Magic link sent to ${target.email} (valid 15 min).` };
}

/* ---------------------------------------------------------------- admin role */

export async function setRoleAction(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  // Anti-escalation: ONLY env-allowlist admins may change roles. A DB-role
  // admin asking politely still gets a refusal (and no audit-side effect).
  if (!admin.viaAllowlist) {
    return fail("Role changes are reserved to ADMIN_EMAILS allowlist admins.");
  }
  const parsed = RoleSchema.safeParse({
    userId: formData.get("userId"),
    role: formData.get("role"),
  });
  if (!parsed.success) return fail("Invalid payload.");
  const target = await getActionTarget(parsed.data.userId);
  if (!target) return fail("User not found.");
  if (target.id === admin.userId && parsed.data.role !== "admin") {
    return fail("You cannot remove your own admin role.");
  }
  if (target.role === parsed.data.role) {
    return fail(`Role is already '${parsed.data.role}'.`);
  }

  await logAdminAction({
    actorUserId: admin.userId,
    action: parsed.data.role === "admin" ? "admin_set_role" : "admin_remove_role",
    targetType: "user",
    targetId: target.id,
    metadata: {
      email: target.email,
      before: { role: target.role },
      after: { role: parsed.data.role },
    },
  });
  try {
    await setUserRole(target.id, parsed.data.role);
  } catch {
    return fail("Role update failed (is migration 0011 applied?). Audit row recorded.");
  }
  revalidatePath(`/admin/users/${target.id}`);
  return {
    ok: true,
    message:
      parsed.data.role === "admin"
        ? `${target.email} is now an admin (DB role).`
        : `Admin role removed from ${target.email}.`,
  };
}

/* ------------------------------------------------------------- RGPD anonymize */

export async function anonymizeUserAction(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = ConfirmSchema.safeParse({
    userId: formData.get("userId"),
    confirmEmail: formData.get("confirmEmail"),
  });
  if (!parsed.success) return fail("Invalid payload — re-type the user's email.");
  const target = await getActionTarget(parsed.data.userId);
  if (!target) return fail("User not found.");
  if (target.id === admin.userId) return fail("You cannot anonymize your own account.");
  if (!emailConfirmed(target, parsed.data.confirmEmail)) {
    return fail("Email confirmation does not match — nothing was changed.");
  }

  const anonEmail = anonymizedEmailFor(target.id);
  await logAdminAction({
    actorUserId: admin.userId,
    action: "admin_anonymize_user",
    targetType: "user",
    targetId: target.id,
    metadata: {
      email: target.email,
      before: { email: target.email, plan: target.accountPlan ?? "free" },
      after: { email: anonEmail, pii: "purged", signIn: "disabled" },
    },
  });
  try {
    await anonymizeUserRows(target.id, target.email);
  } catch {
    return fail("Anonymize failed (write error). Audit row recorded.");
  }
  revalidatePath(`/admin/users/${target.id}`);
  revalidatePath("/admin/users");
  return { ok: true, message: `Anonymized — PII purged, email is now ${anonEmail}.` };
}

/* ---------------------------------------------------------------- RGPD delete */

export async function deleteUserAction(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = ConfirmSchema.safeParse({
    userId: formData.get("userId"),
    confirmEmail: formData.get("confirmEmail"),
  });
  if (!parsed.success) return fail("Invalid payload — re-type the user's email.");
  const target = await getActionTarget(parsed.data.userId);
  if (!target) return fail("User not found.");
  if (target.id === admin.userId) return fail("You cannot delete your own account.");
  if (!emailConfirmed(target, parsed.data.confirmEmail)) {
    return fail("Email confirmation does not match — nothing was deleted.");
  }

  await logAdminAction({
    actorUserId: admin.userId,
    action: "admin_delete_user",
    targetType: "user",
    targetId: target.id,
    metadata: {
      email: target.email,
      before: { email: target.email, role: target.role, plan: target.accountPlan ?? "free" },
      after: { deleted: true, cascade: "all user-owned rows" },
    },
  });
  try {
    await deleteUserCascade(target.id, target.email);
  } catch {
    return fail("Delete failed (write error). Audit row recorded.");
  }
  revalidatePath("/admin/users");
  // The fiche no longer exists — leave it (redirect throws, keep outside try).
  redirect("/admin/users");
}
