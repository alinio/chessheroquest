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

      {/* Legibility scrims: darken left (desktop) / top (mobile) for the copy. */}
      <div className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/70 to-transparent md:via-abyss/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-abyss/80 via-transparent to-abyss" />
    </div>
  );
}
