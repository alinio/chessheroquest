/**
 * Reusable hub shell — left rail (desktop) + bottom tab bar (mobile, LAW #4) +
 * persistent top bar (realm crest, streak/IQ chips, hero avatar + PRO). Shared
 * by Today / Quest / Insights / Passport / Profile. Immersive screens (Boss /
 * DNA / Learn / Drill) render WITHOUT this shell. Real data comes from the
 * (app) layout; null-ish props render neutral (no fake numbers, ever).
 */
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import "./hub.css";
import {
  IconFlame, IconMap2, IconChartLine, IconAward, IconShield,
  IconMap, IconLogout, IconSettings,
} from "./icons";
import { Nudge, nudgeSeen } from "@/src/ui/onboarding/Nudge";

export type HubNav = "train" | "quest" | "insights" | "passport" | "profile";

const PRIMARY: { key: HubNav; label: string; Icon: typeof IconFlame }[] = [
  { key: "train", label: "Train", Icon: IconFlame },
  { key: "quest", label: "Quest", Icon: IconMap2 },
  { key: "insights", label: "Insights", Icon: IconChartLine },
  { key: "passport", label: "Passport", Icon: IconAward },
  { key: "profile", label: "Profile", Icon: IconShield },
];

/**
 * In-session chip motion: when a chip's value CHANGES (prev tracked via ref),
 * count to the new value over 400ms and flash gold once. The initial mount
 * never animates; prefers-reduced-motion jumps straight to the new value.
 */
function useChipPulse(value: number | null): { shown: number | null; pulse: number } {
  const prevRef = useRef<number | null>(null);
  const [anim, setAnim] = useState<number | null>(null);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = value;
    if (value == null || prev == null || prev === value) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let first = true;
    const t0 = performance.now();
    const step = (t: number) => {
      if (first) {
        first = false;
        setPulse((k) => k + 1); // ONE gold flash per change
      }
      const p = Math.min(1, (t - t0) / 400);
      setAnim(Math.round(prev + (value - prev) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
      else setAnim(null);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return { shown: anim, pulse };
}

function deriveActive(pathname: string | null): HubNav {
  if (!pathname) return "train";
  if (pathname.includes("/world") || pathname.includes("/quest") || pathname.includes("/realms")) return "quest";
  if (pathname.includes("/insights")) return "insights";
  if (pathname.includes("/passport")) return "passport";
  if (pathname.includes("/profile")) return "profile";
  return "train";
}

export function AppShell({
  active,
  realmName = "ChessHeroQuest",
  realmCrest = null,
  heroAvatar = null,
  streak = null,
  iq = null,
  pro = false,
  children,
}: {
  active?: HubNav;
  realmName?: string;
  realmCrest?: string | null;
  heroAvatar?: string | null;
  streak?: number | null;
  iq?: number | null;
  pro?: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const current = active ?? deriveActive(pathname);

  // Data-driven topbar motion: count-up + one gold flash when a value changes.
  const streakChip = useChipPulse(streak);
  const iqChip = useChipPulse(iq);

  // First-encounter nudges (spec §B5): ONE visible max, priority seal > IQ >
  // streak. The seal slot is consumed by the full-screen SealCelebration; the
  // IQ nudge fires the first time a non-null IQ is on screen, streak follows.
  const [nudge, setNudge] = useState<"iq" | "streak" | null>(null);
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (iq != null && !nudgeSeen("iq")) {
        setNudge("iq");
      } else if (streak != null && streak >= 2 && !nudgeSeen("streak")) {
        setNudge("streak");
      }
    }, 600);
    return () => window.clearTimeout(t);
  }, [iq, streak]);

  return (
    <div className="chq-hub">
      <div className="app">
        {/* LEFT RAIL (desktop) */}
        <aside className="rail">
          <div className="brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo.png" alt="ChessHeroQuest" style={{ height: 42, width: "auto" }} />
          </div>
          {PRIMARY.map(({ key, label, Icon }) => (
            <Link key={key} href={`/${key}`} className={`nav-item${current === key ? " active" : ""}`} aria-current={current === key ? "page" : undefined}>
              <Icon />
              {label}
            </Link>
          ))}
          <div className="rail-divider" />
          <Link href="/realms" className="nav-sub"><IconMap />Realms</Link>
          <Link href="/train?intro=1" className="nav-sub" onClick={() => window.dispatchEvent(new Event("chq:intro"))}><IconSettings />How it works</Link>
          <div className="rail-spacer" />
          <button type="button" className="nav-sub" onClick={() => signOut({ callbackUrl: "/" })}>
            <IconLogout />Sign out
          </button>
        </aside>

        {/* FRAME */}
        <div className="frame">
          <header className="topbar">
            {/* Realm identity only when it exists — never a fake brand fallback. */}
            {realmCrest && (
              <div className="realm">
                <span className="realm-crest">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={realmCrest} alt="" />
                </span>
                <span className="realm-name serif">{realmName}</span>
              </div>
            )}
            <div className="topbar-right">
              {/* Labeled chips — a chess player never has to guess a number. */}
              {streak != null && (
                <span className="chq-nudge-anchor">
                  <span
                    key={`streak-${streakChip.pulse}`}
                    className={`chip streak${streakChip.pulse > 0 ? " pulse" : ""}`}
                    title="Training streak — consecutive days trained"
                  >
                    <IconFlame />{streakChip.shown ?? streak}<small>day streak</small>
                  </span>
                  {nudge === "streak" && (
                    <Nudge
                      concept="streak"
                      text={`Day ${streak} of your streak — consecutive days trained. One session a day keeps the flame alive.`}
                      onDismiss={() => setNudge(null)}
                    />
                  )}
                </span>
              )}
              {iq != null && (
                <span className="chq-nudge-anchor">
                  <span
                    key={`iq-${iqChip.pulse}`}
                    className={`chip iq${iqChip.pulse > 0 ? " pulse" : ""}`}
                    title="Opening IQ (0–1000) — rises only when your real opening skill rises"
                  >
                    {iqChip.shown ?? iq}<small>Opening IQ</small>
                  </span>
                  {nudge === "iq" && (
                    <Nudge
                      concept="iq"
                      text="Your Opening IQ. It only rises when your moves on the board get better — never for logging in."
                      link={{ href: "/insights", label: "See the trend" }}
                      onDismiss={() => setNudge(null)}
                    />
                  )}
                </span>
              )}
              {heroAvatar && (
                <span className="hero-av">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={heroAvatar} alt="" />
                  {pro && <span className="pro">PRO</span>}
                </span>
              )}
            </div>
          </header>

          {children}
        </div>
      </div>

      {/* BOTTOM TAB BAR (mobile — thumb zone, LAW #4) */}
      <nav className="tabbar" aria-label="Main">
        {PRIMARY.map(({ key, label, Icon }) => (
          <Link key={key} href={`/${key}`} className={`tab${current === key ? " active" : ""}`} aria-current={current === key ? "page" : undefined}>
            <Icon />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
