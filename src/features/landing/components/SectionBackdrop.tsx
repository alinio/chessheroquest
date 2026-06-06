"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useIsClient, useReducedMotion, useIsMobile } from "../hooks";

/**
 * Ambient section backdrop video (assets v2 integration brief). A low-opacity
 * `object-cover` loop behind a section, with a dark gradient overlay so the
 * headline stays fully legible. Plays only in view (IntersectionObserver), and
 * falls back to the poster still under `prefers-reduced-motion` / SSR. Pure
 * ambiance — never the explainer (the S3 demo stays coded).
 */
export function SectionBackdrop({
  video,
  poster,
  opacity = 0.35,
}: {
  video: string;
  poster: string;
  opacity?: number;
}) {
  const isClient = useIsClient();
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLVideoElement | null>(null);
  // Poster-only on mobile (light cut) — backdrops are heavy; crests still loop.
  const stillOnly = !isClient || reduce || isMobile;

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
      { threshold: 0.05 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {stillOnly ? (
        <Image
          src={poster}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ opacity }}
        />
      ) : (
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity }}
        >
          <source src={video} type="video/mp4" />
        </video>
      )}
      {/* legibility overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-abyss/85 via-abyss/55 to-abyss/85" />
    </div>
  );
}
