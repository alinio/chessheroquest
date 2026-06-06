"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LANDING_ASSETS } from "../assets";
import { PASSPORT } from "../copy";
import { useReducedMotion } from "../hooks";
import { Panel } from "./Panel";

/**
 * Opening Passport section (Round 2 §7). The ornate tome illustration anchors the
 * metaphor; the coded seal grid *shows* the collecting mechanic with a
 * scroll-triggered stamp-in (empty slot → gold wax seal slams down with a flash).
 * Filled = bright gold seal; empty = dim dashed slot.
 */
const SEALS = [
  { name: "Italian", done: true },
  { name: "London", done: true },
  { name: "Caro-Kann", done: false },
  { name: "French", done: false },
  { name: "Sicilian", done: false },
];

export function PassportBlock() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Panel
      variant="ornate"
      innerClassName="grid gap-6 p-5 md:grid-cols-2 md:items-center md:p-6"
    >
      <div className="relative mx-auto aspect-square w-full max-w-[16rem] overflow-hidden rounded-xl border border-gold/30">
        <Image
          src={LANDING_ASSETS.passportTome}
          alt="The Opening Passport — an ornate tome with wax seals"
          fill
          sizes="(max-width: 768px) 80vw, 256px"
          className="object-cover"
        />
      </div>

      <div ref={ref}>
        <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          {PASSPORT.title}
        </p>
        <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-[#E9E9EE]">
          {PASSPORT.body}
        </p>
        <ul className="mt-5 grid grid-cols-5 gap-2 sm:gap-3">
          {SEALS.map((s, i) => {
            const animate = started && s.done && !reduce;
            return (
              <li
                key={s.name}
                className="flex flex-col items-center gap-1 text-center"
              >
                <span
                  style={
                    animate
                      ? {
                          animation: `chq-stamp 0.6s ${0.25 + i * 0.35}s cubic-bezier(0.22,1,0.36,1) both`,
                        }
                      : undefined
                  }
                  className={`flex aspect-square w-full items-center justify-center rounded-full border text-sm ${
                    s.done
                      ? "border-gold bg-gold/15 text-gold shadow-[0_0_16px_-4px_rgba(227,178,60,0.7)]"
                      : "border-dashed border-hairline text-text-low"
                  } ${started || !s.done ? "" : "opacity-0"}`}
                >
                  {s.done ? "★" : "○"}
                </span>
                <span className="text-[0.55rem] leading-tight text-text-low">
                  {s.name}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </Panel>
  );
}
