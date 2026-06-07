import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Route the legacy DNA entry point into the new Phase-0 flow so the landing's
      // "Take the test" CTA lands testers in the rebuilt app. Reversible (302).
      { source: "/dna", destination: "/dna-test", permanent: false },
    ];
  },
};

export default nextConfig;
