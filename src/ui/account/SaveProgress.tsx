"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/ui/design-system/Button";
import { track, type AppEvent } from "@/src/lib/track";
import { requestMagicLink, fetchAccount } from "./useAccount";

/**
 * "Save your progress" prompt — shown after a payoff (DNA card / first conquest),
 * never as a blocker to starting. Passwordless: enter email → magic link (dev:
 * logged to the server console). Copy is configurable so /result can frame it
 * as "Keep your result" (email capture at the emotional peak — spec §C Funnel).
 */
export function SaveProgress({
  title = "Save your progress",
  sub = "Keep your Opening IQ, hero and streak across devices. No password.",
  cta = "Save",
  trackEvent = "progress_saved",
}: {
  title?: string;
  sub?: string;
  cta?: string;
  trackEvent?: AppEvent;
} = {}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [savedEmail, setSavedEmail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchAccount().then((a) => {
      if (!cancelled && a.signedIn && a.email) setSavedEmail(a.email);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (savedEmail) {
    return (
      <p style={{ color: "var(--chq-text-2)", fontSize: 13, textAlign: "center" }}>
        <span style={{ color: "var(--chq-gold-3)" }}>✓</span> Saved to {savedEmail}
      </p>
    );
  }

  const submit = async () => {
    if (!email.trim()) return;
    setStatus("sending");
    const ok = await requestMagicLink(email.trim());
    if (ok) track(trackEvent);
    setStatus(ok ? "sent" : "error");
  };

  return (
    <div style={{ background: "var(--chq-panel)", border: "1px solid var(--chq-line)", borderRadius: "var(--chq-r-panel)", padding: 16, textAlign: "center" }}>
      <p className="chq-display" style={{ fontSize: 15, color: "var(--chq-text-1)", margin: 0 }}>{title}</p>
      <p style={{ color: "var(--chq-text-muted)", fontSize: 12, margin: "4px 0 12px" }}>
        {sub}
      </p>
      {status === "sent" ? (
        <p style={{ color: "var(--chq-gold-3)", fontSize: 13 }}>
          Check your inbox — your sign-in link is on its way.
        </p>
      ) : (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          <input
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            style={{ flex: 1, minWidth: 180, minHeight: 44, padding: "0 14px", borderRadius: "var(--chq-r-pill)", background: "var(--chq-raised)", border: "1px solid var(--chq-line)", color: "var(--chq-text-1)", fontFamily: "var(--font-inter), sans-serif", fontSize: 15 }}
          />
          <Button variant="primary" onClick={submit} disabled={status === "sending"}>
            {status === "sending" ? "…" : cta}
          </Button>
        </div>
      )}
      {status === "error" && <p style={{ color: "var(--chq-state-leak, #d1495b)", fontSize: 12, marginTop: 8 }}>Something went wrong — try again.</p>}
    </div>
  );
}
