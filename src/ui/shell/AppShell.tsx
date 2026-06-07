/**
 * Reusable hub shell — ported from docs/mockups/mockup-today-rpg.html.
 * Left rail (Train/Quest/Insights/Passport/Profile + Realms/Account/Settings/Sign out)
 * + persistent top bar (realm crest, streak/IQ chips, hero avatar + PRO). Shared by
 * Today / Quest / Insights / Passport / Profile. Immersive screens (Boss/DNA/Learn/
 * Drill) render WITHOUT this shell. Rail hidden < 880px.
 */
import type { ReactNode } from "react";
import { inter } from "@/src/ui/design-system/fonts";
import "./hub.css";
import {
  IconFlame, IconMap2, IconChartLine, IconAward, IconShield,
  IconMap, IconCreditCard, IconSettings, IconLogout, IconCrown,
} from "./icons";

export type HubNav = "train" | "quest" | "insights" | "passport" | "profile";

const PRIMARY: { key: HubNav; label: string; Icon: typeof IconFlame }[] = [
  { key: "train", label: "Train", Icon: IconFlame },
  { key: "quest", label: "Quest", Icon: IconMap2 },
  { key: "insights", label: "Insights", Icon: IconChartLine },
  { key: "passport", label: "Passport", Icon: IconAward },
  { key: "profile", label: "Profile", Icon: IconShield },
];

export function AppShell({
  active,
  realmName,
  realmCrest,
  heroAvatar,
  streak,
  iq,
  pro = true,
  children,
}: {
  active: HubNav;
  realmName: string;
  realmCrest: string;
  heroAvatar: string;
  streak: number;
  iq: number;
  pro?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`chq-hub ${inter.variable}`}>
      <div className="app">
        {/* LEFT RAIL */}
        <aside className="rail">
          <div className="brand">
            <span className="crown"><IconCrown /></span>
            <span className="wordmark">ChessHeroQuest</span>
          </div>
          {PRIMARY.map(({ key, label, Icon }) => (
            <button key={key} type="button" className={`nav-item${active === key ? " active" : ""}`}>
              <Icon />
              {label}
            </button>
          ))}
          <div className="rail-divider" />
          <button type="button" className="nav-sub"><IconMap />Realms</button>
          <button type="button" className="nav-sub"><IconCreditCard />Account</button>
          <button type="button" className="nav-sub"><IconSettings />Settings</button>
          <div className="rail-spacer" />
          <button type="button" className="nav-sub"><IconLogout />Sign out</button>
        </aside>

        {/* FRAME */}
        <div className="frame">
          <header className="topbar">
            <div className="realm">
              <span className="realm-crest">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={realmCrest} alt="" />
              </span>
              <span className="realm-name serif">{realmName}</span>
            </div>
            <div className="topbar-right">
              <span className="chip streak"><IconFlame />{streak}</span>
              <span className="chip iq">{iq} IQ</span>
              <span className="hero-av">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroAvatar} alt="" />
                {pro && <span className="pro">PRO</span>}
              </span>
            </div>
          </header>

          {children}
        </div>
      </div>
    </div>
  );
}
