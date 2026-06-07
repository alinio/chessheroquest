"use client";

/**
 * The typed event taxonomy — the analytics CONTRACT. Every call site uses
 * `track(name, props)` / `identify(id)`; no raw provider calls anywhere else.
 * Funnel + game-loop + Lichess events (game-design-doc funnel).
 *
 * Sinks: (1) PostHog when consent is granted + key is set (provider.ts, no-op
 * otherwise); (2) the first-party anonymous /api/app-track funnel sink (no PII).
 * purchase_complete is SERVER-side only (Paddle webhook) — never call from client.
 */
import { providerCapture, providerIdentify } from "./provider";

export interface EventMap {
  // ── Funnel ──
  landing_view: undefined;
  cta_click: { location: string };
  test_start: undefined;
  test_position_answered: { positionId: string; opening: string; questionType: "skill" | "style"; correct?: boolean };
  test_complete: { scoreRaw: number };
  quiz_start: undefined;
  quiz_answered: { q: number };
  quiz_complete: undefined;
  result_view: { openingIQ: number; archetype: string; strongest?: string; weakness?: string };
  dna_card_shared: { method: string };
  hero_view: undefined;
  hero_selected: { hero: string; recommended: boolean };
  paywall_view: { source: string };
  plan_selected: { plan: string };
  checkout_start: { plan: string };
  /** SERVER-ONLY (Paddle webhook, M9b). Do not call from the client. */
  purchase_complete: { plan: string };
  signup_start: { method: string };
  signup_complete: undefined;
  // ── Game loop (CP2) ──
  world_view: { realm: string };
  opening_node_open: { opening: string };
  learn_start: { opening: string };
  learn_complete: { opening: string };
  drill_start: { opening: string };
  drill_complete: { opening: string; dueCount: number };
  boss_start: { opening: string; difficulty: string };
  boss_result: { opening: string; difficulty: string; win: boolean };
  seal_earned: { opening: string };
  // ── Lichess (CP2) ──
  lichess_sync_start: undefined;
  lichess_sync_complete: { games: number; openingsCovered: number };
}

type Name = keyof EventMap;
type Args<E extends Name> = EventMap[E] extends undefined ? [] : [props: EventMap[E]];

/** Typed event tracking — the only way the app emits analytics. */
export function track<E extends Name>(event: E, ...args: Args<E>): void {
  const props = (args[0] ?? undefined) as Record<string, string | number | boolean | undefined> | undefined;
  // PostHog (consent + key gated inside the provider)
  void providerCapture(event, props);
  // First-party anonymous funnel sink (no PII) — kept for our own dashboards.
  try {
    void fetch("/api/app-track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event, props: props ?? {} }),
      keepalive: true,
    });
  } catch {
    /* analytics must never break the app */
  }
}

/** Stitch the anonymous id to the signed-in account (CP2 / M9a sign-in). */
export function identify(accountId: string, props?: Record<string, string | number | boolean>): void {
  void providerIdentify(accountId, props);
}
