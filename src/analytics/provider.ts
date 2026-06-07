"use client";

/**
 * Provider-agnostic analytics adapter. Current provider = Sentry.
 * Sentry is an error/perf monitor, not a product-analytics funnel — so funnel
 * events are recorded as Sentry BREADCRUMBS (they enrich error context). The real
 * funnel lives in the first-party /api/app-track sink (events.ts). Swap providers
 * by reimplementing this file; no call site references Sentry directly.
 *
 * ENV (never hardcoded): NEXT_PUBLIC_SENTRY_DSN (EU project) — no-op until set.
 * Error monitoring itself initialises in the sentry.*.config files (legitimate
 * interest, no PII); THIS layer (funnel breadcrumbs + identify) is consent-gated.
 */
import * as Sentry from "@sentry/nextjs";
import { getConsent } from "./consent";

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

/** True only when a DSN is configured AND the user has granted consent. */
export function analyticsEnabled(): boolean {
  return Boolean(DSN) && getConsent() === "granted";
}

export async function providerCapture(event: string, props?: AnalyticsProps): Promise<void> {
  if (!analyticsEnabled()) return;
  Sentry.addBreadcrumb({ category: "funnel", message: event, level: "info", data: props });
}

export async function providerIdentify(id: string, props?: AnalyticsProps): Promise<void> {
  if (!analyticsEnabled()) return;
  Sentry.setUser({ id, ...(props ?? {}) });
}

/** Nothing to warm — Sentry initialises via instrumentation. */
export function providerWarm(): void {}

/** Consent withdrawn — drop the identity. */
export function providerOptOut(): void {
  try {
    Sentry.setUser(null);
  } catch {
    /* never throw from analytics */
  }
}
