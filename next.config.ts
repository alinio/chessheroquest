import type { NextConfig } from "next";

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
};

export default nextConfig;
