"use client";

/**
 * Minimal first-party funnel analytics for the app (M9c). Privacy-respecting:
 * no PII — just the event + small non-identifying props (hero, opening, plan).
 * Fire-and-forget; never blocks or throws. Sink = /api/app-track.
 */
export type AppEvent =
  | "dna_test_started"
  | "dna_test_completed"
  | "result_viewed"
  | "hero_selected"
  | "drill_started"
  | "opening_conquered"
  | "progress_saved"
  | "pro_unlocked";

export function track(event: AppEvent, props?: Record<string, string | number | boolean>): void {
  try {
    void fetch("/api/app-track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event, props: props ?? {} }),
      keepalive: true,
    });
  } catch {
    /* analytics must never break the app */
  }
}
