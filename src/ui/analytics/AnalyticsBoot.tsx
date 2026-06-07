"use client";

/**
 * Mount once on app pages. Renders a consent banner until the user chooses, and
 * warms the analytics provider once consent is granted. Analytics stays a no-op
 * until BOTH consent is granted AND the provider key is set (provider.ts).
 */
import { useState, useSyncExternalStore } from "react";
import "@/src/ui/design-system/theme.css";
import { getConsent, setConsent } from "@/src/analytics/consent";
import { providerWarm, providerOptOut } from "@/src/analytics/provider";

function useHydrated() {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}

export function AnalyticsBoot() {
  const mounted = useHydrated();
  const [consent, setConsentState] = useState<"granted" | "denied" | "unset">("unset");

  // Read stored consent once mounted; warm the provider if already granted.
  const stored = mounted ? getConsent() : "unset";
  const current = consent === "unset" ? stored : consent;
  if (mounted && current === "granted") providerWarm();

  if (!mounted || current !== "unset") return null;

  const decide = (c: "granted" | "denied") => {
    setConsent(c);
    setConsentState(c);
    if (c === "granted") providerWarm();
    else providerOptOut();
  };

  return (
    <div role="dialog" aria-label="Analytics consent" style={{ position: "fixed", bottom: 12, left: 12, right: 12, zIndex: 60, maxWidth: 520, margin: "0 auto", background: "var(--chq-panel)", border: "1px solid var(--chq-gold-4)", borderRadius: "var(--chq-r-panel)", padding: "14px 16px", boxShadow: "0 10px 30px rgba(0,0,0,.5)" }}>
      <p style={{ color: "var(--chq-text-2)", fontSize: 13, lineHeight: 1.5, margin: 0 }}>
        We use privacy-friendly analytics (PostHog, EU) to improve ChessHeroQuest. No ads, no selling data. You can opt out anytime.
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 12 }}>
        <button type="button" onClick={() => decide("denied")} style={{ background: "transparent", border: "1px solid var(--chq-line)", color: "var(--chq-text-2)", borderRadius: "var(--chq-r-pill)", padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>Decline</button>
        <button type="button" onClick={() => decide("granted")} className="chq-cta" style={{ minHeight: 38, padding: "0 18px", fontSize: 13 }}>Accept</button>
      </div>
    </div>
  );
}
