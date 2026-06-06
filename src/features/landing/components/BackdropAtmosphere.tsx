"use client";

import { LANDING_ASSETS } from "../assets";
import { useIsClient, useReducedMotion, useIsMobile } from "../hooks";
import { GrainOverlay } from "./GrainOverlay";

/**
 * Page-wide atmosphere (kickoff pass 2 §3/§8). A single fixed layer behind all
 * content: deep charcoal→black gradient, faint chessboard watermark, vignette,
 * film grain, and a drifting ember/dust loop. Sections render transparent on top
 * so this shows through — no more dead-black voids.
 *
 * Embers are OFF under reduced-motion and on the mobile light-cut.
 */
export function BackdropAtmosphere() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      {/* deep base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(125%_85%_at_50%_-10%,#1b1d29_0%,#0f1015_46%,#070810_100%)]" />

      {/* faint chessboard watermark */}
      <div className="absolute inset-0 opacity-[0.022] [background-image:repeating-conic-gradient(#f3eee2_0_25%,transparent_0_50%)] [background-size:128px_128px]" />

      {/* localized warm pools top-center + lower-right (echo the hero light) */}
      <div className="absolute inset-0 bg-[radial-gradient(40%_30%_at_72%_8%,rgba(227,178,60,0.10),transparent_70%)]" />

      <GrainOverlay opacity={0.04} />

      {/* vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_240px_70px_rgba(0,0,0,0.85)]" />

      <PageEmbers />
    </div>
  );
}

function PageEmbers() {
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
      className="absolute inset-0 h-full w-full object-cover opacity-25 [mix-blend-mode:screen]"
    >
      <source src={LANDING_ASSETS.ambient.embers} type="video/mp4" />
    </video>
  );
}
