"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "@/src/ui/design-system/theme.css";
import { inter } from "@/src/ui/design-system/fonts";
import { GradientDefs, LockIcon, Medal } from "@/src/ui/design-system/icons";
import { OrnateFrame } from "@/src/ui/design-system/OrnateFrame";
import { HERO_ACCENTS } from "@/src/ui/design-system/tokens";
import { BRAND_LOGO, HERO_ART, CREST_ART } from "@/src/ui/design-system/art";
import { WORLDS } from "@/src/domain/recommend/worlds";
import { ARCHETYPES, type Archetype } from "@/src/domain/style-quiz/types";
import { useStyleQuiz } from "@/src/ui/style-quiz/useStyleQuiz";
import { useEntitlement } from "@/src/ui/entitlement/useEntitlement";
import { AccountBoot } from "@/src/ui/account/AccountBoot";
import { track } from "@/src/lib/track";
import { useHeroSelect } from "./useHeroSelect";

type Tier = "free" | "premium";
type PlanKey = "monthly" | "yearly" | "lifetime";

const PLANS: Record<PlanKey, { label: string; price: string; per: string; short: string; badge?: string }> = {
  monthly: { label: "Monthly", price: "$9.99", per: "/mo", short: "$9.99/mo" },
  yearly: { label: "Yearly", price: "$79", per: "/yr", short: "$79/yr", badge: "Save 34%" },
  lifetime: { label: "Lifetime", price: "$129", per: "once", short: "$129", badge: "Best value" },
};

const FREE_BENEFITS = [
  "Your hero's first opening — full Learn, Drill & the Opening Guardian",
  "Your Opening IQ + shareable Chess DNA card",
];
const PREMIUM_BENEFITS = [
  "Master every opening & variation — across all 4 kingdoms",
  "Raise your win rate — stop losing in the first 10 moves",
  "Boost your ELO with drills that stick (spaced repetition)",
  "Level up faster — Hard mode + unlimited drills",
  "Train on your real games with Lichess + weakness analytics",
];

function useHydrated() {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}

const eyebrow = { fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase" } as const;
const cleanLabel = (a: Archetype) => HERO_ACCENTS[a].label.replace("Aggressive ", "");

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className={`chq-root chq-checker ${inter.variable}`} style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <GradientDefs />
      <AccountBoot />
      <header style={{ height: 92, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px", borderBottom: "1px solid var(--chq-line)" }}>
        <Image src={BRAND_LOGO} alt="ChessHeroQuest" width={1478} height={418} priority style={{ height: 76, width: "auto" }} />
      </header>
      <main style={{ flex: 1, width: "100%", padding: "24px 0 56px" }}>{children}</main>
    </div>
  );
}

/* The payoff — what mastering the game looks like (illustrative target). */
function PromiseVisual() {
  return (
    <div style={{ marginTop: 18, position: "relative", overflow: "hidden", borderRadius: "var(--chq-r-card)", border: "1px solid var(--chq-gold-4)", background: "var(--chq-raised)", padding: "18px 20px" }}>
      <Image src="/landing/passport-tome.png" alt="" fill sizes="700px" style={{ objectFit: "cover", opacity: 0.1 }} />
      <div style={{ position: "relative" }}>
        <p style={{ ...eyebrow, color: "var(--chq-gold-3)", fontSize: 10, textAlign: "center" }}>The payoff</p>
        <div style={{ display: "flex", gap: 5, justifyContent: "center", flexWrap: "wrap", margin: "12px 0" }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="chq-pulse" style={{ width: 14, height: 14, borderRadius: "50%", background: "var(--chq-gold-gradient)", boxShadow: "0 0 6px rgba(217,162,39,.5)", animationDelay: `${i * 70}ms` }} />
          ))}
        </div>
        <p className="chq-display chq-gold-text" style={{ fontSize: 18, fontWeight: 700, textAlign: "center", margin: 0 }}>Opening Passport — 20 / 20 sealed</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
          <Medal tier="gold" size={38} />
          <span style={{ color: "var(--chq-text-1)", fontSize: 13.5 }}>Opening IQ <b style={{ color: "var(--chq-gold-2)" }}>900+</b></span>
          <span style={{ color: "var(--chq-text-1)", fontSize: 13.5 }}>Win rate <b style={{ color: "#2FB67A" }}>↑↑</b></span>
          <span style={{ color: "var(--chq-text-1)", fontSize: 13.5 }}>ELO <b style={{ color: "var(--chq-gold-2)" }}>climbing</b></span>
        </div>
        <p style={{ color: "var(--chq-text-muted)", fontSize: 11.5, textAlign: "center", marginTop: 12 }}>This is where the quest leads — every seal a mastered opening, ready for any opponent.</p>
      </div>
    </div>
  );
}

/* Commercial value-prop box above the hero chooser. */
function BenefitsBox({ tier, plan, setTier, setPlan, onGoPremium }: { tier: Tier; plan: PlanKey; setTier: (t: Tier) => void; setPlan: (p: PlanKey) => void; onGoPremium: () => void }) {
  const premium = tier === "premium";
  const benefits = premium ? PREMIUM_BENEFITS : FREE_BENEFITS;
  return (
    <div style={{ maxWidth: 720, margin: "0 auto 8px", padding: "0 20px" }}>
      <OrnateFrame>
        <div style={{ padding: "22px 24px", textAlign: "center" }}>
          <p style={{ ...eyebrow, color: "var(--chq-gold-3)" }}>Your quest</p>
          <h2 className="chq-display chq-gold-text" style={{ fontSize: 24, fontWeight: 700, margin: "6px 0 0" }}>Become the King of Openings</h2>
          <p style={{ color: "var(--chq-text-2)", fontSize: 14, lineHeight: 1.55, margin: "8px auto 0", maxWidth: 560 }}>
            Conquer each opening to earn its seal and fill your <b style={{ color: "var(--chq-text-1)" }}>Opening Passport</b> — all 20 across the four realms. Master them and you walk into any game ready for <b style={{ color: "var(--chq-text-1)" }}>any opponent</b>. Most players lose in the first 10 moves; you&apos;ll win there.
          </p>

          {/* Free / Premium toggle */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <div className="chq-seg" role="tablist" aria-label="Free or Premium">
              <button type="button" data-active={!premium} onClick={() => setTier("free")}>Free</button>
              <button type="button" data-active={premium} onClick={() => setTier("premium")}>Premium</button>
            </div>
          </div>

          {/* benefit list for the selected tier */}
          <ul style={{ listStyle: "none", padding: 0, margin: "16px auto 0", maxWidth: 460, textAlign: "left", display: "flex", flexDirection: "column", gap: 7 }}>
            {benefits.map((b) => (
              <li key={b} style={{ display: "flex", gap: 8, alignItems: "flex-start", color: "var(--chq-text-1)", fontSize: 13.5, lineHeight: 1.45 }}>
                <span style={{ color: premium ? "var(--chq-gold-3)" : "var(--chq-defender, #2FB67A)", flexShrink: 0 }}>✓</span> {b}
              </li>
            ))}
          </ul>

          {premium && (
            <>
              <PromiseVisual />
              <div style={{ display: "flex", justifyContent: "center", marginTop: 16, flexWrap: "wrap", gap: 8 }}>
                <div className="chq-seg" role="tablist" aria-label="Billing plan">
                  {(Object.keys(PLANS) as PlanKey[]).map((k) => (
                    <button key={k} type="button" data-active={plan === k} onClick={() => setPlan(k)}>{PLANS[k].label} · {PLANS[k].price}</button>
                  ))}
                </div>
              </div>
              <p style={{ ...eyebrow, fontSize: 10, color: "var(--chq-gold-3)", marginTop: 8 }}>
                {PLANS[plan].label}: {PLANS[plan].price} {PLANS[plan].per}{PLANS[plan].badge ? ` · ${PLANS[plan].badge}` : ""}
              </p>
              <button type="button" className="chq-cta" onClick={onGoPremium} style={{ marginTop: 14 }}>
                Go Premium · {PLANS[plan].short} →
              </button>
            </>
          )}
          {!premium && (
            <p style={{ color: "var(--chq-text-muted)", fontSize: 12, marginTop: 14 }}>
              Tap <b style={{ color: "var(--chq-gold-3)" }}>Premium</b> to see everything you unlock.
            </p>
          )}
        </div>
      </OrnateFrame>
    </div>
  );
}

function HeroCard({ archetype, recommended, matchPercent, tier, onEnter, onGoPremium }: { archetype: Archetype; recommended: boolean; matchPercent: number | null; tier: Tier; onEnter: () => void; onGoPremium: () => void }) {
  const accent = HERO_ACCENTS[archetype];
  const world = WORLDS[archetype];
  const premium = tier === "premium";
  const totalVar = world.openings.reduce((s, o) => s + o.variations, 0);

  return (
    <OrnateFrame variant="hero" hero={archetype} corners={false} style={{ width: 300, flexShrink: 0, scrollSnapAlign: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ position: "relative", aspectRatio: "1 / 1", width: "100%", overflow: "hidden" }}>
          <Image src={HERO_ART[archetype]} alt={`The ${cleanLabel(archetype)}`} fill sizes="300px" style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--chq-panel) 4%, rgba(13,13,16,.15) 45%, transparent)" }} />
          <div style={{ position: "absolute", left: 12, top: 12, width: 44, height: 44, borderRadius: "50%", border: `1px solid ${accent.border}`, background: "rgba(8,8,10,.7)", display: "grid", placeItems: "center", backdropFilter: "blur(4px)" }}>
            <Image src={CREST_ART[archetype]} alt="" width={40} height={40} style={{ height: 30, width: 30, objectFit: "contain", mixBlendMode: "screen" }} />
          </div>
          {recommended && (
            <span style={{ position: "absolute", right: 12, top: 12, ...eyebrow, fontSize: 9, background: "var(--chq-gold-gradient)", color: "#08080A", padding: "5px 9px", borderRadius: "var(--chq-r-pill)", fontWeight: 700 }}>★ Recommended</span>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 5, padding: "0 16px 16px", flex: 1 }}>
          <h2 className="chq-display" style={{ fontSize: 22, color: accent.base, textTransform: "uppercase", margin: 0 }}>The {cleanLabel(archetype)}</h2>
          <p style={{ ...eyebrow, color: "var(--chq-text-2)", fontSize: 10 }}>{world.name}</p>
          <p style={{ color: "var(--chq-text-2)", fontSize: 13, fontStyle: "italic", margin: 0 }}>{world.tagline}</p>
          {recommended && matchPercent != null && (
            <p style={{ color: "var(--chq-gold-3)", fontSize: 13, fontWeight: 600, margin: 0 }}>{matchPercent}% match with your Chess DNA</p>
          )}

          <p style={{ ...eyebrow, color: "var(--chq-text-muted)", fontSize: 9, marginTop: 6 }}>5 openings · {totalVar} variations</p>
          <ul style={{ listStyle: "none", padding: 0, margin: "2px 0 0", display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
            {world.openings.map((o, i) => {
              const unlocked = premium || i === 0;
              return (
                <li key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6, fontSize: 12.5 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, color: unlocked ? "var(--chq-text-1)" : "var(--chq-text-muted)" }}>
                    {unlocked ? <span style={{ color: accent.base }}>✓</span> : <LockIcon size={12} />}
                    {o.name}
                  </span>
                  <span style={{ ...eyebrow, fontSize: 9, color: "var(--chq-text-muted)", whiteSpace: "nowrap" }}>{o.variations} var</span>
                </li>
              );
            })}
          </ul>

          {!premium && (
            <p style={{ color: "var(--chq-text-muted)", fontSize: 11, marginTop: 8, lineHeight: 1.4 }}>
              <LockIcon size={11} /> Premium unlocks all {totalVar} variations + Hard mode, Lichess &amp; analytics.
            </p>
          )}

          {premium ? (
            <button type="button" className="chq-cta" onClick={onGoPremium} style={{ marginTop: 12, width: "100%" }}>Master all openings →</button>
          ) : (
            <button type="button" className="chq-cta" onClick={onEnter} style={{ marginTop: 12, width: "100%" }}>Start your quest — free →</button>
          )}
        </div>
      </div>
    </OrnateFrame>
  );
}

/* TODO: replace with real testimonials before public launch (illustrative for now). */
const TESTIMONIALS = [
  { name: "Maya R.", role: "Rapid · 1480", photo: "https://randomuser.me/api/portraits/women/68.jpg", quote: "I used to freeze the second my opponent left book. Now I actually have a plan — I went from blundering around move 6 to reaching middlegames I understand. +180 rating in a single month." },
  { name: "Daniel K.", role: "Club player", photo: "https://randomuser.me/api/portraits/men/32.jpg", quote: "What finally clicked is the *why*. The Guardian boss fights force you to understand the ideas, not just memorise moves, so the theory holds up when a real game goes off-script." },
  { name: "Priya S.", role: "Blitz · 1620", photo: "https://randomuser.me/api/portraits/women/44.jpg", quote: "The Caro-Kann was my worst opening for years. Two weeks of the spaced-repetition drills and it's now the one I'm most confident in. I'm a proud Defender main now." },
  { name: "Tom B.", role: "Beginner", photo: "https://randomuser.me/api/portraits/men/75.jpg", quote: "As a total beginner I was terrified of openings. Chess DNA pegged me as a Trickster and handed me a Scandinavian full of traps — I win short games against people rated way above me." },
  { name: "Lena M.", role: "Rapid · 1750", photo: "https://randomuser.me/api/portraits/women/65.jpg", quote: "Spaced repetition is the cheat code nobody talks about. My openings are basically on autopilot now, which frees up all my clock and brain for the actual fight." },
  { name: "Carlos V.", role: "Hit 1500", photo: "https://randomuser.me/api/portraits/men/51.jpg", quote: "Cracked 1500 for the first time after months stuck. The Road-to-Elo picks told me exactly which lines to drill for my level instead of wasting time on stuff I'd never face." },
  { name: "Aiko T.", role: "Blitz · 1900", photo: "https://randomuser.me/api/portraits/women/29.jpg", quote: "The Lichess sync was eye-opening — it showed the exact openings where I was hemorrhaging rating. I fixed two of them in a fortnight and the graph finally started climbing." },
  { name: "Sam O.", role: "Casual", photo: "https://randomuser.me/api/portraits/men/12.jpg", quote: "Honestly more fun than grinding puzzles. The world map and boss fights give me a reason to come back every day, and I'm improving without it feeling like homework." },
  { name: "Grace W.", role: "New to chess", photo: "https://randomuser.me/api/portraits/women/90.jpg", quote: "I genuinely didn't know what to play on move one. Now I have a clear plan for both colours and I don't panic anymore. It made chess feel approachable for the first time." },
  { name: "Noah F.", role: "Rapid · 1340", photo: "https://randomuser.me/api/portraits/men/3.jpg", quote: "Beat my older brother for the first time in years — he played something dodgy and I punished it straight from a line I'd drilled. He asked what I'd been using. 😏" },
];

const FAQ = [
  { q: "Is it really free?", a: "Yes — take the Chess DNA Test and play your first opening (Learn, Drill & its Opening Guardian) with no signup." },
  { q: "What does Premium unlock?", a: "Every opening and all their variations across the four realms, all 4 heroes, Hard mode, unlimited drills, Lichess sync and weakness analytics." },
  { q: "Do I need an account?", a: "Only to save your progress across devices — you can start instantly without one." },
  { q: "Will this actually raise my rating?", a: "ChessHeroQuest targets the opening phase, where most rating is lost. Drill a real repertoire until it's automatic and you stop giving games away early. Results depend on your practice." },
  { q: "Can I switch heroes?", a: "Anytime. Your Chess DNA suggests one, but every hero's path is open." },
  { q: "Can I cancel?", a: "Yes, cancel anytime. Lifetime is a one-time payment with no renewals." },
];

function Testimonials() {
  const loop = [...TESTIMONIALS, ...TESTIMONIALS]; // duplicated for a seamless marquee
  return (
    <section style={{ margin: "80px auto 0", maxWidth: 1320 }}>
      <div style={{ textAlign: "center", marginBottom: 24, padding: "0 20px" }}>
        <p style={{ ...eyebrow, color: "var(--chq-gold-3)" }}>Heroes who climbed</p>
        <h2 className="chq-display chq-gold-text" style={{ fontSize: 24, fontWeight: 700, margin: "6px 0 0" }}>Players are winning more</h2>
      </div>
      <div className="chq-marquee">
        <div className="chq-marquee-track" style={{ padding: "4px 20px" }}>
          {loop.map((t, i) => (
            <article key={i} style={{ width: 360, flexShrink: 0, background: "var(--chq-panel)", border: "1px solid var(--chq-line)", borderRadius: "var(--chq-r-card)", padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
              <header style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.photo} alt="" width={48} height={48} loading="lazy" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--chq-gold-4)" }} />
                <div>
                  <p style={{ color: "var(--chq-text-1)", fontWeight: 600, fontSize: 15, margin: 0 }}>{t.name}</p>
                  <p style={{ ...eyebrow, fontSize: 9, color: "var(--chq-text-muted)", margin: "2px 0 0" }}>{t.role}</p>
                </div>
                <span style={{ marginLeft: "auto", color: "var(--chq-gold-3)", fontSize: 13, letterSpacing: 1 }}>★★★★★</span>
              </header>
              <p style={{ color: "var(--chq-text-2)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>“{t.quote}”</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section style={{ maxWidth: 720, margin: "80px auto 56px", padding: "0 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <p style={{ ...eyebrow, color: "var(--chq-gold-3)" }}>Questions</p>
        <h2 className="chq-display chq-gold-text" style={{ fontSize: 24, fontWeight: 700, margin: "6px 0 0" }}>Before you begin</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FAQ.map((f) => (
          <details key={f.q} style={{ background: "var(--chq-panel)", border: "1px solid var(--chq-line)", borderRadius: "var(--chq-r-panel)", padding: "12px 16px" }}>
            <summary style={{ cursor: "pointer", color: "var(--chq-text-1)", fontWeight: 600, fontSize: 14, listStyle: "none" }}>{f.q}</summary>
            <p style={{ color: "var(--chq-text-2)", fontSize: 13.5, lineHeight: 1.55, margin: "8px 0 0" }}>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* Illustrated "inside the app" feature tour (real art assets). */
const FEATURES = [
  { img: "/landing/archetype-strategist.png", title: "Discover your Chess DNA", copy: "A 2-minute test reveals your playstyle and a provisional Opening IQ." },
  { img: "/landing/kingdom-italian.png", title: "Learn every line", copy: "Walk each opening move by move — with the idea behind every move." },
  { img: "/landing/kingdom-caro-kann.png", title: "Drill to mastery", copy: "Spaced-repetition drills lock the lines into memory for good." },
  { img: "/landing/scene-guardian-poster.jpg", title: "Beat the Opening Guardians", copy: "A boss for every opening — survive the theory to conquer it." },
  { img: "/art/worlds/world-warrior-map.png", title: "Climb each realm", copy: "Light up the map opening by opening, across four worlds." },
  { img: "/landing/passport-tome.png", title: "Earn your Passport", copy: "Collect all 20 seals and become the King of Openings." },
];

function WhatYouUnlock() {
  return (
    <section style={{ maxWidth: 1040, margin: "80px auto 0", padding: "0 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <p style={{ ...eyebrow, color: "var(--chq-gold-3)" }}>Inside ChessHeroQuest</p>
        <h2 className="chq-display chq-gold-text" style={{ fontSize: 24, fontWeight: 700, margin: "6px 0 0" }}>What you&apos;ll get</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {FEATURES.map((f) => (
          <div key={f.title} style={{ background: "var(--chq-panel)", border: "1px solid var(--chq-line)", borderRadius: "var(--chq-r-card)", overflow: "hidden" }}>
            <div style={{ position: "relative", aspectRatio: "16 / 10", width: "100%" }}>
              <Image src={f.img} alt={f.title} fill sizes="(max-width: 640px) 100vw, 340px" style={{ objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--chq-panel), transparent 60%)" }} />
            </div>
            <div style={{ padding: "14px 16px 18px" }}>
              <h3 className="chq-display" style={{ fontSize: 16, color: "var(--chq-text-1)", margin: 0 }}>{f.title}</h3>
              <p style={{ color: "var(--chq-text-2)", fontSize: 13, lineHeight: 1.5, margin: "6px 0 0" }}>{f.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HeroSelectScreen() {
  const router = useRouter();
  const mounted = useHydrated();
  const quiz = useStyleQuiz((s) => s.result);
  const isPro = useEntitlement((s) => s.isPro);
  const selectHero = useHeroSelect((s) => s.selectHero);
  const [tier, setTier] = useState<Tier>("free");
  const [plan, setPlan] = useState<PlanKey>("yearly");

  if (!mounted) {
    return <Shell><p style={{ color: "var(--chq-text-muted)", textAlign: "center" }}>Loading…</p></Shell>;
  }

  const recommended = quiz?.primary ?? null;
  const matchPercent = quiz?.matchPercent ?? null;
  const ordered: Archetype[] = recommended ? [recommended, ...ARCHETYPES.filter((a) => a !== recommended)] : [...ARCHETYPES];
  const effectiveTier: Tier = isPro ? "premium" : tier;

  const enter = (a: Archetype) => {
    track("hero_selected", { hero: a });
    selectHero(a);
    router.push("/world");
  };

  return (
    <Shell>
      <BenefitsBox tier={tier} plan={plan} setTier={setTier} setPlan={setPlan} onGoPremium={() => router.push(`/paywall?plan=${plan}`)} />

      <div style={{ padding: "56px 20px 0", textAlign: "center", maxWidth: 680, marginInline: "auto" }}>
        <h1 className="chq-display chq-gold-text" style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Choose your Hero</h1>
        <p style={{ ...eyebrow, color: "var(--chq-text-muted)", marginTop: 8 }}>
          {recommended ? "Your Chess DNA points one way — but the choice is yours. Every hero is free to start." : "Pick any hero — the first opening is free."}
        </p>
      </div>

      <div style={{ display: "flex", gap: 16, overflowX: "auto", padding: "16px 20px", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", alignItems: "stretch", justifyContent: "center" }}>
        {ordered.map((a) => (
          <HeroCard
            key={a}
            archetype={a}
            recommended={a === recommended}
            matchPercent={a === recommended ? matchPercent : null}
            tier={effectiveTier}
            onEnter={() => enter(a)}
            onGoPremium={() => router.push(`/paywall?hero=${a}&plan=${plan}`)}
          />
        ))}
      </div>

      <WhatYouUnlock />
      <Testimonials />
      <Faq />
    </Shell>
  );
}
