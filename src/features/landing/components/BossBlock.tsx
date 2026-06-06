"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { LANDING_ASSETS } from "../assets";
import { BOSS } from "../copy";
import { useIsClient, useReducedMotion } from "../hooks";
import { Panel } from "./Panel";
import { CTAButton } from "./CTAButton";

/**
 * Boss section (Round 2 boss fix) — a single centered column with the guardian
 * cinematic as the centerpiece: eyebrow → H2 → tag → line → VIDEO (ornate frame
 * hugging a 16:9 clip, edge-to-edge) → CTA below (never overlapping the video).
 * The clip is a one-shot (the hand moving the queen): plays once in view then
 * holds its last frame — no hard loop. Reduced-motion → poster only.
 */
export function BossBlock() {
  return (
    <div className="mx-auto flex max-w-[1040px] flex-col items-center text-center">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.32em] text-warrior">
        {BOSS.kicker}
      </p>
      <h3 className="font-display mt-3 text-3xl font-bold text-text-hi sm:text-4xl">
        {BOSS.h2}
      </h3>
      <span className="mt-3 inline-flex rounded-chip border border-warrior/50 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-warrior">
        e.g. {BOSS.tag}
      </span>
      <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-[#E9E9EE]">
        {BOSS.body}
      </p>

      {/* ornate frame hugging the 16:9 video */}
      <Panel variant="ornate" className="mt-8 w-full" innerClassName="p-1.5">
        <div className="relative aspect-video w-full overflow-hidden rounded-[12px]">
          <BossVideo />
        </div>
      </Panel>

      <div className="mt-8">
        <CTAButton section="kingdoms" label={BOSS.ctaLabel} />
      </div>
    </div>
  );
}

function BossVideo() {
  const isClient = useIsClient();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement | null>(null);
  const stillOnly = !isClient || reduce;

  useEffect(() => {
    if (stillOnly) return;
    const v = ref.current;
    if (!v || typeof IntersectionObserver === "undefined") return;
    let played = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting && !played) {
          played = true;
          v.play().catch(() => {});
        }
      },
      { threshold: 0.4 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [stillOnly]);

  if (stillOnly) {
    return (
      <Image
        src={LANDING_ASSETS.boss.poster}
        alt="A giant guardian over the chessboard"
        fill
        sizes="(max-width: 1080px) 100vw, 1040px"
        className="object-cover"
      />
    );
  }

  return (
    <video
      ref={ref}
      muted
      playsInline
      preload="none"
      poster={LANDING_ASSETS.boss.poster}
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source src={LANDING_ASSETS.boss.video} type="video/mp4" />
    </video>
  );
}
