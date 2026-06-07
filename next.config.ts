import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Serve AVIF/WebP (smaller) with automatic fallback; cache optimized images.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2_678_400, // 31 days
  },
  async redirects() {
    return [
      // Route the legacy DNA entry point into the new Phase-0 flow so the landing's
      // "Take the test" CTA lands testers in the rebuilt app. Reversible (302).
      { source: "/dna", destination: "/dna-test", permanent: false },
    ];
  },
  async headers() {
    // Conservative, broadly-safe security headers (no strict CSP — would risk
    // breaking Paddle/Next inline styles). Applied to every route.
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  // Only upload source maps when a Sentry auth token is configured — keeps the
  // build clean + a no-op until Sentry is wired (TODO: SENTRY_AUTH_TOKEN/ORG/PROJECT).
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
});
