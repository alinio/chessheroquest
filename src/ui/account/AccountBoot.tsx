"use client";

import { useEffect, useRef } from "react";
import { useEntitlement } from "@/src/ui/entitlement/useEntitlement";
import { bootMigrate, fetchAccount, pushSnapshot } from "./useAccount";

/**
 * Headless: handles first-sign-in migration (?welcome=1 → push local if the
 * account is empty, else pull server → local + reload) and best-effort sync when
 * the tab is hidden. Mounted on the world screen.
 */
export function AccountBoot() {
  const signedIn = useRef(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const welcome = new URLSearchParams(window.location.search).get("welcome");
      if (welcome === "1") {
        const result = await bootMigrate();
        if (cancelled) return;
        if (result === "pulled") {
          window.location.replace("/world"); // rehydrate stores from restored localStorage
          return;
        }
        window.history.replaceState(null, "", "/world");
      }
      // Always reconcile entitlement from the server (overrides any local cache).
      const acct = await fetchAccount();
      if (cancelled) return;
      signedIn.current = acct.signedIn;
      useEntitlement.getState().hydrate(Boolean(acct.isPro), acct.plan ?? "free");
    })();

    const onHide = () => {
      if (document.visibilityState === "hidden" && signedIn.current) void pushSnapshot(true);
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);

  return null;
}
