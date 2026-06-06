/**
 * Pricing plans (master-vision §21). Price IDs are public (used client-side at
 * checkout) and read from NEXT_PUBLIC_* env. Pure mapping helpers are tested.
 */
export type PlanId = "free" | "pro_monthly" | "pro_annual" | "lifetime";

export type SubscriptionStatus =
  | "none"
  | "active"
  | "past_due"
  | "paused"
  | "canceled";

export interface Plan {
  id: PlanId;
  name: string;
  priceLabel: string;
  cadence: string;
  priceId: string | undefined;
  highlight?: boolean;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    priceLabel: "$0",
    cadence: "forever",
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_FREE,
    features: ["Chess DNA Test", "1 path", "Basic training", "Shareable DNA card"],
  },
  {
    id: "pro_monthly",
    name: "Hero Pro",
    priceLabel: "$9.99",
    cadence: "/month",
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY,
    highlight: true,
    features: [
      "Unlimited openings & paths",
      "All training modes",
      "Boss + seasonal bosses",
      "Advanced stats & Road tracking",
    ],
  },
  {
    id: "pro_annual",
    name: "Hero Pro — Annual",
    priceLabel: "$79",
    cadence: "/year",
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_ANNUAL,
    features: ["Everything in Pro", "~$6.6/mo — best value"],
  },
  {
    id: "lifetime",
    name: "Lifetime",
    priceLabel: "$129",
    cadence: "once",
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_LIFETIME,
    features: ["Everything, forever", "Limited launch offer"],
  },
];

/** Map a Paddle price ID back to our plan id (used by the webhook). */
export function planByPriceId(priceId: string): PlanId | null {
  return PLANS.find((p) => p.priceId === priceId)?.id ?? null;
}

/** Normalize a Paddle subscription status to ours. */
export function mapPaddleStatus(paddleStatus: string): SubscriptionStatus {
  switch (paddleStatus) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
      return "past_due";
    case "paused":
      return "paused";
    case "canceled":
      return "canceled";
    default:
      return "none";
  }
}
