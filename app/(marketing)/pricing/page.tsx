/**
 * /pricing — the plans (master-vision §21). Public; if signed in, the checkout
 * carries the user id so the webhook can reconcile the purchase.
 */
import type { Metadata } from "next";
import { auth } from "@/src/lib/auth";
import { PLANS } from "@/src/lib/plans";
import { CheckoutButton } from "@/src/ui/billing/CheckoutButton";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "ChessHeroQuest plans — start free, or go Pro (monthly, annual or lifetime) for unlimited opening training, full Road to Elo, and every realm.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing — ChessHeroQuest",
    description:
      "Start free, or go Pro for unlimited opening training and your full Road to Elo.",
    url: "https://chessheroquest.com/pricing",
  },
};

export default async function PricingPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const email = session?.user?.email ?? undefined;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="text-center">
        <p className="font-display text-gold text-xs uppercase tracking-[0.3em]">
          Become an Opening Hero
        </p>
        <h1 className="font-display text-text-hi mt-1 text-3xl font-bold">Choose your path</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`bg-surface rounded-card flex flex-col gap-4 border p-5 ${
              plan.highlight ? "border-gold" : "border-hairline"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-text-hi text-lg font-bold">{plan.name}</h2>
                {plan.highlight && (
                  <span className="bg-gold text-abyss rounded-chip px-2 py-0.5 text-[0.6rem] font-bold uppercase">
                    Popular
                  </span>
                )}
              </div>
              <p className="mt-1">
                <span className="font-display text-gold-bright text-3xl font-black">
                  {plan.priceLabel}
                </span>{" "}
                <span className="text-text-low text-sm">{plan.cadence}</span>
              </p>
            </div>

            <ul className="flex flex-1 flex-col gap-1.5 text-sm">
              {plan.features.map((f) => (
                <li key={f} className="text-text-mid flex gap-2">
                  <span className="text-gold">✦</span>
                  {f}
                </li>
              ))}
            </ul>

            <CheckoutButton plan={plan} userId={userId} email={email} />
          </div>
        ))}
      </div>

      <p className="text-text-low text-center text-xs">
        Lifetime is a limited launch offer. Prices in USD, billed via Paddle.
      </p>
    </main>
  );
}
