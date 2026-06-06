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
  dim = 1,
}: {
  video: string;
  poster: string;
  opacity?: number;
  /** Overlay darkness multiplier — lower = more of the loop shows through. */
  dim?: number;
}) {
  const isClient = useIsClient();
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLVideoElement | null>(null);
  // Poster-only on mobile (light cut) — backdrops are heavy; crests still loop.
  const stillOnly = !isClient || reduce || isMobile;

  // Re-run when the <video> actually mounts (after hydration swaps out the SSR
  // poster) — otherwise the ref is null on first mount and play() never fires.
  useEffect(() => {
    if (stillOnly) return;
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
  }, [stillOnly]);

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
          style={{ opacity, filter: "brightness(1.4) contrast(1.05) saturate(1.05)" }}
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
          style={{ opacity, filter: "brightness(1.4) contrast(1.05) saturate(1.05)" }}
        >
          <source src={video} type="video/mp4" />
        </video>
      )}
      {/* overlay — near-opaque at the top/bottom edges so the loop fades into the
          adjacent dark sections (no hard rectangle cut), open in the middle */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, rgba(15,16,21,0.97) 0%, rgba(15,16,21,${0.5 * dim}) 14%, rgba(15,16,21,${0.18 * dim}) 50%, rgba(15,16,21,${0.55 * dim}) 86%, rgba(15,16,21,0.97) 100%)`,
        }}
      />
    </div>
  );
}
