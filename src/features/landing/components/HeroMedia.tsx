"use client";

import Image from "next/image";
import { useState } from "react";
import { LANDING_ASSETS } from "../assets";
import { useIsClient, useReducedMotion, useIsMobile } from "../hooks";

/**
 * Hero cinematic background (kickoff §S1 / assets §3).
 *
 * Strategy (still-first, LOCKED §11.7):
 *  1. The POSTER renders immediately (SSR) so first paint is instant and the
 *     video never blocks LCP — desktop/mobile chosen by CSS media query.
 *  2. AFTER hydration, if motion is allowed, the matching `<video>` fades in on
 *     top (autoPlay muted loop playsInline). Under `prefers-reduced-motion` we
 *     stay on the poster only — no `<video>` at all (assets §3).
 *
 * The board art sits low/right (desktop) and low (mobile); the H1 + DNA Card own
 * the negative space above/left (guardrail §9).
 */
export function HeroMedia() {
  const isClient = useIsClient();
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const [ready, setReady] = useState(false);

  const showVideo = isClient && !reduce;
  const media = isMobile
    ? LANDING_ASSETS.hero.mobile
    : LANDING_ASSETS.hero.desktop;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* Static poster layer — always present, instant paint. */}
      <Image
        src={LANDING_ASSETS.hero.desktop.poster}
        alt=""
        fill
        priority
        sizes="(min-width: 768px) 100vw, 1px"
        className="hidden object-cover md:block"
      />
      <Image
        src={LANDING_ASSETS.hero.mobile.poster}
        alt=""
        fill
        priority
        sizes="(max-width: 767px) 100vw, 1px"
        className="object-cover md:hidden"
      />

      {/* Video layer — mounts client-side, fades in when it can play. */}
      {showVideo && (
        <video
          key={isMobile ? "mobile" : "desktop"}
          autoPlay
          muted
          loop
          playsInline
          poster={media.poster}
          onCanPlay={() => setReady(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          {media.video.map((src) => (
            <source
              key={src}
              src={src}
              type={src.endsWith(".webm") ? "video/webm" : "video/mp4"}
            />
          ))}
        </video>
      )}

      {/* Legibility overlay — left-weighted on desktop (copy lives left), bottom-
          weighted on mobile (copy lives lower). Crown stays visible. */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(8,9,14,0.55),rgba(8,9,14,0.2)_45%,rgba(8,9,14,0.9))] md:bg-[linear-gradient(90deg,rgba(8,9,14,0.9)_0%,rgba(8,9,14,0.5)_45%,rgba(8,9,14,0.12)_100%)]" />
    </div>
  );
}
