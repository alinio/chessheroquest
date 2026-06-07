"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Panel } from "@/src/features/landing/components/Panel";
import { CTAButton } from "@/src/features/landing/components/CTAButton";
import { useReducedMotion } from "@/src/features/landing/hooks";

/**
 * Exit-intent popup — fires once per session to push the free Chess DNA Test.
 * Desktop: mouse leaves through the top of the viewport. Mobile (no real exit
 * intent): a fast scroll back toward the top after the visitor has scrolled
 * deep. Dismiss via ✕ / backdrop / Esc. Heroic-RPG styling. reduced-motion → no
 * animation. Mounted on the home + all blog pages (never on the test itself).
 */
const KEY = "chq_exit_shown";

export function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const firedRef = useRef(false);

  const fire = useCallback(() => {
    if (firedRef.current) return;
    try {
      if (sessionStorage.getItem(KEY)) return;
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* sessionStorage may be unavailable — still show once */
    }
    firedRef.current = true;
    setOpen(true);
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) {
        firedRef.current = true;
        return;
      }
    } catch {
      /* ignore */
    }

    // Don't fire on initial load — give the visitor a moment first.
    let armed = false;
    const armTimer = window.setTimeout(() => {
      armed = true;
    }, 5000);

    const onMouseOut = (e: MouseEvent) => {
      if (armed && !e.relatedTarget && e.clientY <= 4) fire();
    };

    let lastY = window.scrollY;
    let maxY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      maxY = Math.max(maxY, y);
      // scrolled deep, then snapped back up near the top → likely leaving
      if (armed && maxY > 800 && y < 320 && y < lastY - 10) fire();
      lastY = y;
    };

    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(armTimer);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
    };
  }, [fire]);

  // Esc to close + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chq-exit-title"
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${
        reduce ? "" : "animate-[chq-fade-in_0.25s_ease-out]"
      }`}
      onClick={() => setOpen(false)}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div
        className={`relative w-full max-w-md ${reduce ? "" : "animate-[chq-pop_0.3s_cubic-bezier(0.22,1,0.36,1)]"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Panel variant="ornate" glow="var(--color-gold)" innerClassName="p-6 text-center sm:p-8">
          {/* close */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-hairline text-text-low transition-colors hover:border-gold/60 hover:text-gold"
          >
            ✕
          </button>

          {/* emblem */}
          <div className="mx-auto h-16 w-16 [filter:drop-shadow(0_0_16px_rgba(227,178,60,0.5))]">
            <Image src="/icon.png" alt="" width={64} height={64} className="h-16 w-16 object-contain" />
          </div>

          <p className="font-display mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Wait, challenger
          </p>
          <h2
            id="chq-exit-title"
            className="font-display mt-2 text-2xl font-bold leading-tight text-text-hi sm:text-3xl"
          >
            Don&apos;t leave your Chess DNA undiscovered
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-[0.95rem] leading-relaxed text-text-mid">
            Two minutes reveals your Opening IQ, your play style, and the exact
            openings to master next — free, no signup to begin.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3">
            <CTAButton section="final" label="Take the free Chess DNA Test" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[0.72rem] uppercase tracking-wide text-text-low transition-colors hover:text-text-mid"
            >
              Maybe later
            </button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
