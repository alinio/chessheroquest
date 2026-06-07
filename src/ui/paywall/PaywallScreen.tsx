"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import "@/src/ui/design-system/theme.css";
import { inter } from "@/src/ui/design-system/fonts";
import { GradientDefs, LogoMark } from "@/src/ui/design-system/icons";
import { Button } from "@/src/ui/design-system/Button";
import { HERO_ACCENTS, type HeroKey } from "@/src/ui/design-system/tokens";
import { useEntitlement } from "@/src/ui/entitlement/useEntitlement";
import { fetchAccount, syncEntitlement } from "@/src/ui/account/useAccount";
import { track } from "@/src/lib/track";
import { SaveProgress } from "@/src/ui/account/SaveProgress";
import { openCheckout, paddleConfigured, type ProPlan } from "./paddle";

function useHydrated() {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}

const eyebrow = { fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase" } as const;

const PLANS: { id: ProPlan; label: string; price: string; per: string; badge?: string; best?: boolean }[] = [
  { id: "monthly", label: "Monthly", price: "$9.99", per: "/mo" },
  { id: "annual", label: "Yearly", price: "$79", per: "/yr", badge: "Save 34%" },
  { id: "lifetime", label: "Lifetime", price: "$129", per: "one-time", badge: "Best value", best: true },
];

const BULLETS = [
  "Unlimited drills + full spaced repetition",
  "All 4 Heroes & Worlds",
  "Hard difficulty — true mastery",
  "Connect Lichess — train on your real games",
  "Deep analytics & your Road to Elo",
];

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh", position: "relative", display: "flex", flexDirection: "column" }}>
      <GradientDefs />
      {/* scene-throne backdrop missing → coded fallback. TODO: public/art/scene-throne.webp */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, background: "radial-gradient(900px 500px at 50% -5%, rgba(217,162,39,.10), transparent 60%), #08080A" }} />
      <header style={{ position: "relative", zIndex: 1, height: 56, display: "flex", alignItems: "center", gap: 8, padding: "0 20px" }}>
        <LogoMark size={24} />
        <span className="chq-display chq-gold-text" style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>Go Pro</span>
      </header>
      <main style={{ position: "relative", zIndex: 1, flex: 1, width: "100%", maxWidth: 640, margin: "0 auto", padding: "12px 20px 48px" }}>{children}</main>
    </div>
  );
}

export function PaywallScreen() {
  const router = useRouter();
  const mounted = useHydrated();
  const isPro = useEntitlement((s) => s.isPro);
  const [busy, setBusy] = useState<ProPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const acct = await fetchAccount();
      if (cancelled) return;
      setEmail(acct.email ?? null);
      await syncEntitlement(); // reflect server-verified Pro on load
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!mounted) return <Shell><p style={{ color: "var(--chq-text-muted)" }}>Loading…</p></Shell>;

  const params = new URLSearchParams(window.location.search);
  const heroParam = params.get("hero") as HeroKey | null;
  const hardParam = params.get("hard");
  const headline = heroParam && HERO_ACCENTS[heroParam]
    ? `Unlock The ${HERO_ACCENTS[heroParam].label.replace("Aggressive ", "")}`
    : hardParam
      ? "Unlock Hard mode"
      : "Unlock your full journey";

  if (isPro || done) {
    return (
      <Shell>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 12, alignItems: "center", marginTop: 40 }}>
          <h1 className="chq-display chq-gold-text" style={{ fontSize: 28, fontWeight: 700 }}>You&apos;re Pro ✦</h1>
          <p style={{ color: "var(--chq-text-2)", fontSize: 14 }}>All heroes, worlds, and Hard mode are unlocked.</p>
          <Button variant="primary" onClick={() => router.push("/hero-select")}>Continue →</Button>
        </div>
      </Shell>
    );
  }

  const choose = async (plan: ProPlan) => {
    setError(null);
    if (!email) {
      setError("Save your progress (sign in) first — Pro is tied to your account.");
      return;
    }
    if (!paddleConfigured(plan)) {
      setError("Checkout needs Paddle sandbox credentials (NEXT_PUBLIC_PADDLE_* env). The plan is configured; add sandbox keys to test the flow.");
      return;
    }
    setBusy(plan);
    const opened = await openCheckout(plan, email, async () => {
      // Server-verified: poll the webhook-updated entitlement (no client-trust).
      for (let i = 0; i < 6; i++) {
        if (await syncEntitlement()) {
          track("pro_unlocked", { plan });
          setDone(true);
          setBusy(null);
          return;
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
      setBusy(null);
      setError("Payment received — finalizing your Pro access. Refresh in a moment.");
    });
    if (!opened) {
      setBusy(null);
      setError("Couldn't open Paddle checkout — check the client token / price ID.");
    }
  };

  return (
    <Shell>
      <h1 className="chq-display" style={{ fontSize: 28, color: "var(--chq-text-1)", textAlign: "center", margin: "8px 0 6px" }}>{headline}</h1>
      <p style={{ ...eyebrow, color: "var(--chq-text-muted)", textAlign: "center", marginBottom: 18 }}>The tools that actually make you improve</p>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 auto 20px", maxWidth: 360, display: "flex", flexDirection: "column", gap: 8 }}>
        {BULLETS.map((b) => (
          <li key={b} style={{ color: "var(--chq-text-2)", fontSize: 14 }}>
            <span style={{ color: "var(--chq-gold-3)" }}>✓</span> {b}
          </li>
        ))}
      </ul>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, maxWidth: 360, margin: "0 auto" }}>
        {PLANS.map((p) => (
          <div
            key={p.id}
            style={{
              background: "var(--chq-panel)",
              border: `1px solid ${p.best ? "var(--chq-gold-3)" : "var(--chq-line)"}`,
              borderRadius: "var(--chq-r-panel)",
              padding: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="chq-display" style={{ fontSize: 16, color: "var(--chq-text-1)" }}>{p.label}</span>
                {p.badge && (
                  <span style={{ ...eyebrow, fontSize: 9, color: "#08080A", background: "var(--chq-gold-gradient)", padding: "3px 7px", borderRadius: "var(--chq-r-pill)", fontWeight: 700 }}>{p.badge}</span>
                )}
              </div>
              <div style={{ color: "var(--chq-text-2)", fontSize: 13, marginTop: 2 }}>
                <b style={{ color: "var(--chq-text-1)" }}>{p.price}</b> {p.per}
              </div>
            </div>
            <Button variant={p.best ? "primary" : "ghost"} onClick={() => choose(p.id)} disabled={busy !== null}>
              {busy === p.id ? "Opening…" : "Choose"}
            </Button>
          </div>
        ))}
      </div>

      {!email && (
        <div style={{ maxWidth: 360, margin: "16px auto 0" }}>
          <SaveProgress />
        </div>
      )}

      {error && <p style={{ color: "var(--chq-state-leak, #d1495b)", fontSize: 12, textAlign: "center", marginTop: 14, maxWidth: 360, marginInline: "auto" }}>{error}</p>}

      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 22 }}>
        <button type="button" onClick={() => router.back()} style={{ background: "transparent", border: 0, color: "var(--chq-text-muted)", fontSize: 13, cursor: "pointer" }}>Maybe later</button>
      </div>
    </Shell>
  );
}
