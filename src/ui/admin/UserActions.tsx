"use client";

/**
 * Admin · fiche "Actions" card (Phase B). Pure UI — every rule is re-enforced
 * server-side in actions.ts (requireAdmin + zod + audit-of-intent). Inline
 * useActionState feedback per action; destructive actions (anonymize/delete)
 * require re-typing the target's exact email (compared server-side again).
 * Role buttons only render for ADMIN_EMAILS allowlist admins (anti-escalation).
 */
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  anonymizeUserAction,
  deleteUserAction,
  grantPremiumAction,
  revokePremiumAction,
  sendMagicLinkAction,
  setRoleAction,
  type ActionState,
} from "@/app/(admin)/admin/users/[id]/actions";

interface UserActionsProps {
  userId: string;
  email: string;
  /** Phase-0 verified entitlement (account_states). */
  accountPlan: string | null;
  isPro: boolean;
  role: string;
  /** Target is the signed-in admin — self-destructive actions are blocked. */
  isSelf: boolean;
  /** Actor is on the ADMIN_EMAILS env allowlist — only they may change roles. */
  actorViaAllowlist: boolean;
}

function SubmitButton({ label, danger = false }: { label: string; danger?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`a-btn${danger ? " is-danger" : ""}`} disabled={pending}>
      {pending ? "Working…" : label}
    </button>
  );
}

function Feedback({ state }: { state: ActionState | null }) {
  if (!state) return null;
  return (
    <p className={`a-action-msg ${state.ok ? "is-ok" : "is-bad"}`} role="status">
      {state.message}
    </p>
  );
}

export function UserActions({
  userId,
  email,
  accountPlan,
  isPro,
  role,
  isSelf,
  actorViaAllowlist,
}: UserActionsProps) {
  const [grantState, grant] = useActionState(grantPremiumAction, null);
  const [revokeState, revoke] = useActionState(revokePremiumAction, null);
  const [linkState, sendLink] = useActionState(sendMagicLinkAction, null);
  const [roleState, setRole] = useActionState(setRoleAction, null);
  const [anonState, anonymize] = useActionState(anonymizeUserAction, null);
  const [deleteState, remove] = useActionState(deleteUserAction, null);

  const isAdmin = role === "admin";

  return (
    <section className="a-card">
      <h3>Actions</h3>

      {/* --- Premium (grant / revoke) — toggles on the verified entitlement --- */}
      <form action={isPro ? revoke : grant} className="a-action-row">
        <input type="hidden" name="userId" value={userId} />
        <span className="a-action-label">
          Plan: <span className={`a-pill${isPro ? " is-pro" : ""}`}>{accountPlan ?? "free"}</span>
        </span>
        <SubmitButton label={isPro ? "Revoke premium" : "Grant premium (lifetime)"} />
      </form>
      <Feedback state={isPro ? revokeState : grantState} />

      {/* --- Magic link (existing passwordless sign-in, 15 min) --- */}
      <form action={sendLink} className="a-action-row">
        <input type="hidden" name="userId" value={userId} />
        <span className="a-action-label">Sign-in</span>
        <SubmitButton label="Send magic link" />
      </form>
      <Feedback state={linkState} />

      {/* --- Role (allowlist admins ONLY — anti-escalation) --- */}
      {actorViaAllowlist ? (
        <>
          <form action={setRole} className="a-action-row">
            <input type="hidden" name="userId" value={userId} />
            <input type="hidden" name="role" value={isAdmin ? "user" : "admin"} />
            <span className="a-action-label">
              Role: <span className={`a-pill${isAdmin ? " is-warn" : ""}`}>{role}</span>
            </span>
            {isAdmin && isSelf ? (
              <span className="a-action-note">You cannot remove your own role.</span>
            ) : (
              <SubmitButton label={isAdmin ? "Remove admin role" : "Set admin role"} />
            )}
          </form>
          <Feedback state={roleState} />
        </>
      ) : null}

      {/* --- Danger zone (RGPD) — re-type the exact email to confirm --- */}
      <div className="a-danger-zone">
        {isSelf ? (
          <p className="a-action-note">
            This is your own account — delete/anonymize are blocked.
          </p>
        ) : (
          <>
            <details className="a-confirm">
              <summary>Anonymize (RGPD)</summary>
              <p className="a-action-note">
                Keeps aggregate rows, purges all PII, disables sign-in. Type{" "}
                <code>{email}</code> to confirm.
              </p>
              <form action={anonymize} className="a-confirm-body">
                <input type="hidden" name="userId" value={userId} />
                <input
                  className="a-input"
                  name="confirmEmail"
                  type="text"
                  autoComplete="off"
                  placeholder="Re-type the user's email"
                  required
                />
                <SubmitButton label="Anonymize" danger />
              </form>
              <Feedback state={anonState} />
            </details>

            <details className="a-confirm">
              <summary>Delete (RGPD)</summary>
              <p className="a-action-note">
                Full cascade wipe — every user-owned row is destroyed. Type{" "}
                <code>{email}</code> to confirm.
              </p>
              <form action={remove} className="a-confirm-body">
                <input type="hidden" name="userId" value={userId} />
                <input
                  className="a-input"
                  name="confirmEmail"
                  type="text"
                  autoComplete="off"
                  placeholder="Re-type the user's email"
                  required
                />
                <SubmitButton label="Delete permanently" danger />
              </form>
              <Feedback state={deleteState} />
            </details>
          </>
        )}
      </div>

      <p className="a-section-note">
        Every action writes an audit_logs row before mutating (LAW #7).
      </p>
    </section>
  );
}
