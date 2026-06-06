/**
 * Channel-aware H1 resolver (kickoff §4 — LOCKED §11.3).
 *
 * Pure + SSR-safe: the marketing page resolves the variant from `searchParams`
 * on the SERVER, so the correct H1 is in the SSR HTML (no flash, no hydration
 * mismatch). The resolved key doubles as the `headline_variant` analytics
 * dimension (§10) so we can measure which hook converts per channel.
 *
 * Precedence: explicit `?v=` override → channel signals (utm/keyword) → default.
 */

export type HeadlineVariant = "default" | "pain" | "retargeting";

export interface HeadlineCopy {
  kicker: string;
  h1: string;
  sub: string;
}

/** Default = the Chess DNA variant (LOCKED §11.3). */
export const HEADLINES: Record<HeadlineVariant, HeadlineCopy> = {
  default: {
    kicker: "THE RPG OF CHESS OPENINGS",
    h1: "What's your Chess DNA?",
    sub: "Take the free 2-minute test to reveal your Opening IQ, your chess style, and the opening weaknesses holding back your rating.",
  },
  pain: {
    kicker: "THE RPG OF CHESS OPENINGS",
    h1: "Stop losing games before move 10.",
    sub: "Discover your Opening IQ and train the opening weaknesses holding back your rating.",
  },
  retargeting: {
    kicker: "THE RPG OF CHESS OPENINGS",
    h1: "Your Opening IQ is waiting.",
    sub: "Finish the free Chess DNA Test and unlock your personalized opening path.",
  },
};

const VALID_OVERRIDES: Record<string, HeadlineVariant> = {
  default: "default",
  dna: "default",
  pain: "pain",
  google: "pain",
  retargeting: "retargeting",
  returning: "retargeting",
};

export interface ResolveInput {
  /** `?v=` hard override (highest precedence). */
  v?: string | null;
  utmSource?: string | null;
  utmCampaign?: string | null;
  /** search keyword if forwarded as a param. */
  keyword?: string | null;
}

function norm(value?: string | null): string {
  return (value ?? "").trim().toLowerCase();
}

export function resolveHeadlineVariant(input: ResolveInput): HeadlineVariant {
  // 1) Explicit override wins — lets us A/B any hook on any URL with `?v=`.
  const override = VALID_OVERRIDES[norm(input.v)];
  if (override) return override;

  const source = norm(input.utmSource);
  const campaign = norm(input.utmCampaign);
  const keyword = norm(input.keyword);
  const haystack = `${source} ${campaign} ${keyword}`;

  // 2) Retargeting / returning intent.
  if (/(retarget|returning|remarket)/.test(haystack)) return "retargeting";

  // 3) Google Ads / pain intent (high commercial intent → lead with the pain).
  if (source === "google" || source === "bing" || /\bpain\b/.test(haystack)) {
    return "pain";
  }

  // 4) Default = Chess DNA (Meta / organic / shared).
  return "default";
}

/** Normalize Next's `searchParams` (string | string[] | undefined) to a scalar. */
export function firstParam(
  value: string | string[] | undefined,
): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}
