"use client";

import { useEffect } from "react";
import { initLandingAnalytics } from "../analytics";
import type { HeadlineVariant } from "../variants";

/**
 * Fires `landing_view` exactly once and locks in the session context
 * (headline_variant + utm + device_type) for the whole funnel (kickoff §10).
 * Renders nothing. The variant is resolved on the SERVER and passed in, so the
 * analytics dimension matches the H1 the visitor actually saw.
 */
export function LandingAnalytics({ variant }: { variant: HeadlineVariant }) {
  useEffect(() => {
    initLandingAnalytics(variant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
