"use client";

/**
 * Provider-agnostic analytics adapter. Default = PostHog (EU host) loaded lazily
 * ONLY when consent is granted AND an env key is present; otherwise a no-op.
 * Swap providers by reimplementing this file — no call site references PostHog.
 *
 * ENV (never hardcoded):
 *   NEXT_PUBLIC_POSTHOG_KEY   — project key (EU project)
 *   NEXT_PUBLIC_POSTHOG_HOST  — defaults to https://eu.i.posthog.com
 * TODO: set NEXT_PUBLIC_POSTHOG_KEY (EU) — analytics is a no-op until then.
 */
import type { PostHog } from "posthog-js";
import { getConsent, getAnonId } from "./consent";

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

let ph: PostHog | null = null;
let loading: Promise<void> | null = null;

/** True only when a key is configured AND the user has granted consent. */
export function analyticsEnabled(): boolean {
  return Boolean(KEY) && getConsent() === "granted";
}

async function ensure(): Promise<void> {
  if (!analyticsEnabled() || ph) return;
  if (!loading) {
    loading = import("posthog-js").then((m) => {
      ph = m.default;
      ph.init(KEY as string, {
        api_host: HOST,
        person_profiles: "identified_only", // no profile until identify() — privacy-first
        capture_pageview: false,
        autocapture: false,
        bootstrap: { distinctID: getAnonId() },
      });
    });
  }
  await loading;
}

export async function providerCapture(event: string, props?: AnalyticsProps): Promise<void> {
  if (!analyticsEnabled()) return;
  await ensure();
  ph?.capture(event, props);
}

export async function providerIdentify(id: string, props?: AnalyticsProps): Promise<void> {
  if (!analyticsEnabled()) return;
  await ensure();
  ph?.identify(id, props);
}

/** Warm the provider after consent is granted (so the first event isn't delayed). */
export function providerWarm(): void {
  void ensure();
}

/** Stop capturing + drop the identity (consent withdrawn). */
export function providerOptOut(): void {
  try {
    ph?.opt_out_capturing();
    ph?.reset();
  } catch {
    /* never throw from analytics */
  }
}
