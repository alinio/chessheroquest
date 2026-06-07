// Sentry — browser/client init. DSN-gated: no-op until NEXT_PUBLIC_SENTRY_DSN is set.
// EU: use an EU-region DSN. Privacy-first: no default PII, replays off by default.
// TODO: set NEXT_PUBLIC_SENTRY_DSN (EU project).
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  sendDefaultPii: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
