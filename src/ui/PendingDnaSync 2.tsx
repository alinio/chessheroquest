"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/** localStorage key holding an anonymous DNA result awaiting account attachment. */
export const PENDING_DNA_KEY = "chq_pending_dna";

/**
 * Funnel carry-over: a visitor takes the DNA Test anonymously, then signs up.
 * On the dashboard, this submits the stashed result to seed their Opening IQ,
 * then refreshes so the real numbers appear. No-op if nothing is pending.
 */
export function PendingDnaSync() {
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const raw = localStorage.getItem(PENDING_DNA_KEY);
    if (!raw) return;

    (async () => {
      try {
        const res = await fetch("/api/dna-test", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: raw,
        });
        if (res.ok) {
          localStorage.removeItem(PENDING_DNA_KEY);
          router.refresh();
        }
      } catch {
        /* keep the stash; we'll retry on the next dashboard visit */
      }
    })();
  }, [router]);

  return null;
}
