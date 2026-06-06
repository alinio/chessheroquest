/**
 * Landing analytics (kickoff §10 — LOCKED §11.11).
 *
 * The 11 funnel events, plus a `track()` util that attaches the per-session
 * source context to EVERY event. We capture `headline_variant` + `utm_source` +
 * `utm_campaign` + `device_type` ONCE on `landing_view` (here) and replay it on
 * every downstream event, so the full funnel (view → CTA → test → signup) is
 * attributable per channel and per hook.
 *
 * Transport is a thin POST to `/api/track` (stubbed: console in dev). Swap the
 * stub for a real sink later — this interface stays stable.
 */
import type { HeadlineVariant } from "./variants";

export type LandingEvent =
  | "landing_view"
  | "hero_cta_click"
  | "sticky_cta_click"
  | "pain_section_cta_click"
  | "kingdoms_cta_click"
  | "final_cta_click"
  | "dna_test_started"
  | "dna_test_completed"
  | "dna_card_generated"
  | "signup_started"
  | "signup_completed";

export type DeviceType = "mobile" | "desktop";

/** The source context stamped onto every event (kickoff §10). */
export interface SessionContext {
  headline_variant: HeadlineVariant;
  utm_source: string | null;
  utm_campaign: string | null;
  device_type: DeviceType;
}

/** Section that fired a CTA event — feeds the `section` dimension. */
export type CtaSection =
  | "hero"
  | "sticky"
  | "pain"
  | "kingdoms"
  | "final";

// Module-level singleton: set once when the provider mounts (client only).
let sessionContext: SessionContext | null = null;

/** Read UTM + device from the live URL/window (client only). */
export function captureSessionContext(
  headlineVariant: HeadlineVariant,
): SessionContext {
  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  const device: DeviceType =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(max-width: 767px)").matches
        ? "mobile"
        : "desktop"
      : "desktop";

  return {
    headline_variant: headlineVariant,
    utm_source: params.get("utm_source"),
    utm_campaign: params.get("utm_campaign"),
    device_type: device,
  };
}

/** Fire `landing_view` and lock in the session context for the funnel. */
export function initLandingAnalytics(headlineVariant: HeadlineVariant): void {
  sessionContext = captureSessionContext(headlineVariant);
  send("landing_view", {});
}

/** Track an event, merging the captured session context (kickoff §10). */
export function track(
  event: LandingEvent,
  extra: Record<string, unknown> = {},
): void {
  send(event, extra);
}

function send(event: LandingEvent, extra: Record<string, unknown>): void {
  const payload = {
    event,
    ts: typeof performance !== "undefined" ? performance.now() : null,
    ...(sessionContext ?? {}),
    ...extra,
  };

  if (typeof window === "undefined") return;

  // Fire-and-forget; keepalive lets the beacon survive a navigation (CTA → /dna).
  try {
    void fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Analytics must never break the page (guardrail: value, not fragility).
  }
}
