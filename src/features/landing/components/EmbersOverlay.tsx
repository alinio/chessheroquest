"use client";

import { LANDING_ASSETS } from "../assets";
import { useIsClient, useReducedMotion, useIsMobile } from "../hooks";

/**
 * Ambient embers (assets §3 "Embers"). A low-opacity looping video composited
 * with `mix-blend-mode: screen` (drops the black bg) behind dark sections.
 *
 * OFF under `prefers-reduced-motion` AND on the mobile light-cut (kickoff §7/§8):
 * mobile gets the clean static page — embers are a desktop nicety only. Also off
 * during SSR (poster-only baseline) until hydration confirms the environment.
 */
export function EmbersOverlay() {
  const isClient = useIsClient();
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();

  if (!isClient || reduce || isMobile) return null;

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40 [mix-blend-mode:screen]"
    >
      <source src={LANDING_ASSETS.ambient.embers} type="video/mp4" />
    </video>
  );
}
