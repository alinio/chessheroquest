"use client";

/**
 * Consent + anonymous identity for analytics (EU/privacy-first).
 * Analytics provider is loaded ONLY after consent === "granted" (see provider.ts).
 * The anonymous id is a random, non-PII id stored locally; on sign-in it is
 * stitched to the account id via identify() (CP2 / M9a).
 */
const CONSENT_KEY = "chq-analytics-consent"; // "granted" | "denied"
const ANON_KEY = "chq-anon-id";

export type Consent = "granted" | "denied" | "unset";

export function getConsent(): Consent {
  if (typeof window === "undefined") return "unset";
  const v = window.localStorage.getItem(CONSENT_KEY);
  return v === "granted" || v === "denied" ? v : "unset";
}

export function setConsent(c: "granted" | "denied"): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, c);
}

export function getAnonId(): string {
  if (typeof window === "undefined") return "anon";
  let id = window.localStorage.getItem(ANON_KEY);
  if (!id) {
    const rand = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
    id = `anon_${rand}`;
    window.localStorage.setItem(ANON_KEY, id);
  }
  return id;
}
