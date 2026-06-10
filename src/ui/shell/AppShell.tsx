/**
 * Reusable hub shell — left rail (desktop) + bottom tab bar (mobile, LAW #4) +
 * persistent top bar (realm crest, streak/IQ chips, hero avatar + PRO). Shared
 * by Today / Quest / Insights / Passport / Profile. Immersive screens (Boss /
 * DNA / Learn / Drill) render WITHOUT this shell. Real data comes from the
 * (app) layout; null-ish props render neutral (no fake numbers, ever).
 */
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import "./hub.css";
import {
  IconFlame, IconMap2, IconChartLine, IconAward, IconShield,
  IconMap, IconLogout, IconCrown, IconSettings,
} from "./icons";

export type HubNav = "train" | "quest" | "insights" | "passport" | "profile";

const PRIMARY: { key: HubNav; label: string; Icon: typeof IconFlame }[] = [
  { key: "train", label: "Train", Icon: IconFlame },
  { key: "quest", label: "Quest", Icon: IconMap2 },
  { key: "insights", label: "Insights", Icon: IconChartLine },
  { key: "passport", label: "Passport", Icon: IconAward },
  { key: "profile", label: "Profile", Icon: IconShield },
];

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
  return (
    <div className="chq-hub">
      <div className="app">
        {/* LEFT RAIL (desktop) */}
        <aside className="rail">
          <div className="brand">
            <span className="crown"><IconCrown /></span>
            <span className="wordmark">ChessHeroQuest</span>
          </div>
          {PRIMARY.map(({ key, label, Icon }) => (
            <Link key={key} href={`/${key}`} className={`nav-item${current === key ? " active" : ""}`} aria-current={current === key ? "page" : undefined}>
              <Icon />
              {label}
            </Link>
          ))}
          <div className="rail-divider" />
          <Link href="/realms" className="nav-sub"><IconMap />Realms</Link>
          <Link href="/train?intro=1" className="nav-sub"><IconSettings />How it works</Link>
          <div className="rail-spacer" />
          <button type="button" className="nav-sub" onClick={() => signOut({ callbackUrl: "/" })}>
            <IconLogout />Sign out
          </button>
        </aside>

        {/* FRAME */}
        <div className="frame">
          <header className="topbar">
            <div className="realm">
              {realmCrest ? (
                <span className="realm-crest">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={realmCrest} alt="" />
                </span>
              ) : (
                <span className="realm-crest crown"><IconCrown /></span>
              )}
              <span className="realm-name serif">{realmName}</span>
            </div>
            <div className="topbar-right">
              {streak != null && <span className="chip streak"><IconFlame />{streak}</span>}
              {iq != null && <span className="chip iq">{iq} IQ</span>}
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
