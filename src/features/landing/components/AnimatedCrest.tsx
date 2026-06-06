"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { LANDING_ASSETS, type LandingArchetypeKey } from "../assets";
import { useIsClient, useReducedMotion } from "../hooks";

/**
 * Animated archetype crest (assets v2 integration brief). Plays the image-to-video
 * crest loop ONLY while in view (IntersectionObserver play/pause → perf stays
 * clean with several on screen), composited with `mix-blend-mode: screen` to drop
 * the black background. Under `prefers-reduced-motion` (and SSR / no-JS) it falls
 * back to the static crest PNG.
 */
export function AnimatedCrest({
  archetype,
  size = 80,
  className = "",
}: {
  archetype: LandingArchetypeKey;
  size?: number;
  className?: string;
}) {
  const isClient = useIsClient();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const shared = `object-contain [mix-blend-mode:screen] ${className}`;

  // SSR + reduced-motion + no-JS → static PNG.
  if (!isClient || reduce) {
    return (
      <Image
        src={LANDING_ASSETS.crests[archetype]}
        alt={`${archetype} crest`}
        width={size}
        height={size}
        className={shared}
      />
    );
  }

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={LANDING_ASSETS.crests[archetype]}
      width={size}
      height={size}
      className={shared}
    >
      <source src={LANDING_ASSETS.crestsAnim[archetype]} type="video/mp4" />
    </video>
  );
}
