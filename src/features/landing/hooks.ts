"use client";

import { useSyncExternalStore } from "react";

/**
 * SSR-safe client/media hooks via `useSyncExternalStore` — the idiomatic React
 * 19 way to read browser-only state without `setState`-in-effect (which triggers
 * cascading renders). Server snapshot is the safe default (false) so the SSR HTML
 * is the poster-only / no-embers baseline; the real value resolves after hydration.
 */

const noop = () => () => {};

/** False during SSR, true once hydrated on the client. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

/** Live media-query match. Defaults to `false` on the server. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

/** Mobile light-cut breakpoint (kickoff §8). */
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
