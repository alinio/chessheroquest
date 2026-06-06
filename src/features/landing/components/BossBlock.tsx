"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { LANDING_ASSETS } from "../assets";
import { BOSS } from "../copy";
import { useIsClient, useReducedMotion } from "../hooks";
import { Panel } from "./Panel";
import { CTAButton } from "./CTAButton";

/**
 * Boss section (Round 2 §6). The giant-guardian cinematic inside an ornate gold
 * frame, 16:9 contained (scales down cleanly on mobile — no crop). The clip is a
 * one-shot (the hand moving the queen), so it plays ONCE in view then holds its
 * last frame — never hard-loops. `prefers-reduced-motion` → poster only.
 */
export function BossBlock() {
  return (
    <Panel variant="ornate" innerClassName="grid gap-6 p-5 md:grid-cols-2 md:items-center md:p-6">
      <div className="order-2 md:order-1">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-warrior">
          {BOSS.kicker}
        </p>
        <h3 className="font-display mt-2 text-2xl font-bold text-text-hi sm:text-3xl">
          {BOSS.h2}
        </h3>
        <span className="mt-3 inline-flex rounded-chip border border-warrior/50 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-warrior">
          e.g. {BOSS.tag}
        </span>
        <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-[#E9E9EE]">
          {BOSS.body}
        </p>
        <div className="mt-5">
          <CTAButton section="kingdoms" label={BOSS.ctaLabel} />
        </div>
      </div>

      {/* ornate-framed 16:9 video */}
      <div className="order-1 md:order-2">
        <div className="relative aspect-video overflow-hidden rounded-xl border border-gold/40 shadow-[0_0_30px_-10px_rgba(227,178,60,0.5)]">
          <BossVideo />
        </div>
      </div>
    </Panel>
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
        sizes="(max-width: 768px) 100vw, 520px"
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
