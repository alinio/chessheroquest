"use client";

import { snapshotLocal, restoreLocal, snapshotIsEmpty, type Snapshot } from "@/src/lib/account-snapshot";
import { useEntitlement, type Plan } from "@/src/ui/entitlement/useEntitlement";

/** Request a passwordless magic link (dev: logged to the server console). */
export async function requestMagicLink(email: string): Promise<boolean> {
  try {
    const r = await fetch("/api/account/request-link", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return r.ok;
  } catch {
    return false;
  }
}

export interface AccountInfo {
  signedIn: boolean;
  email?: string;
  state?: Snapshot | null;
  /** Server-verified Pro (M9b). */
  isPro?: boolean;
  plan?: Plan;
}

/** Hydrate the entitlement store from server-verified state (the source of truth). */
export async function syncEntitlement(): Promise<boolean> {
  const acct = await fetchAccount();
  const isPro = Boolean(acct.isPro);
  useEntitlement.getState().hydrate(isPro, acct.plan ?? "free");
  return isPro;
}

export async function fetchAccount(): Promise<AccountInfo> {
  try {
    const r = await fetch("/api/account/state");
    return r.ok ? ((await r.json()) as AccountInfo) : { signedIn: false };
  } catch {
    return { signedIn: false };
  }
}

export async function pushSnapshot(keepalive = false): Promise<void> {
  try {
    await fetch("/api/account/sync", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ state: snapshotLocal() }),
      keepalive,
    });
  } catch {
    /* offline — local stays the fallback */
  }
}

/** First sign-in migration: push local if the account is empty, else pull → local. */
export async function bootMigrate(): Promise<"pushed" | "pulled" | "none"> {
  const acct = await fetchAccount();
  if (!acct.signedIn) return "none";
  if (snapshotIsEmpty(acct.state)) {
    await pushSnapshot();
    return "pushed";
  }
  restoreLocal(acct.state ?? {});
  return "pulled";
}
