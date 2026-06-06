import type { ReactNode } from "react";
import { Map, Target, CalendarCheck, Stamp, User } from "lucide-react";
import "./theme.css";
import { inter } from "./fonts";
import { GradientDefs, LogoMark, StreakFlame } from "./icons";
import { Icon } from "./icons/Icon";

/**
 * Shared App Shell (art-direction-bible §2) — top bar (64px) + scrollable main +
 * mobile bottom nav (56px). Presentational for M1: IQ / streak / active tab are
 * props; tabs are not yet wired (their screens land in later modules).
 */
const NAV = [
  { key: "map", label: "Map", icon: Map },
  { key: "drill", label: "Drill", icon: Target },
  { key: "daily", label: "Daily", icon: CalendarCheck },
  { key: "passport", label: "Passport", icon: Stamp },
  { key: "profile", label: "Profile", icon: User },
] as const;

export type NavKey = (typeof NAV)[number]["key"];

export function AppShell({
  children,
  iq = 428,
  streak = 7,
  active = "map",
}: {
  children: ReactNode;
  iq?: number;
  streak?: number;
  active?: NavKey;
}) {
  return (
    <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <GradientDefs />

      {/* Top bar — 64px */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-4"
        style={{
          height: 64,
          background: "rgba(8,8,10,.82)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--chq-line)",
        }}
      >
        <div className="flex items-center gap-2">
          <LogoMark size={28} />
          <span className="chq-display chq-gold-text" style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase" }}>
            ChessHeroQuest
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Opening IQ pill */}
          <span
            className="flex items-center gap-1.5"
            style={{
              height: 32,
              padding: "0 12px",
              borderRadius: "var(--chq-r-pill)",
              background: "var(--chq-raised)",
              border: "1px solid var(--chq-line)",
            }}
          >
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, letterSpacing: 1.5, color: "var(--chq-text-2)" }}>
              IQ
            </span>
            <span className="chq-display chq-gold-text" style={{ fontSize: 15, fontWeight: 700 }}>
              {iq}
            </span>
          </span>

          <StreakFlame state="active" count={streak} size={22} />

          {/* Avatar */}
          <span
            className="flex items-center justify-center"
            style={{
              width: 34,
              height: 34,
              borderRadius: "var(--chq-r-pill)",
              background: "var(--chq-raised)",
              border: "1px solid var(--chq-line)",
            }}
          >
            <Icon icon={User} size={18} color="var(--chq-text-2)" />
          </span>
        </div>
      </header>

      {/* Main canvas */}
      <main className="flex-1 overflow-y-auto" style={{ paddingBottom: 72 }}>
        {children}
      </main>

      {/* Mobile bottom nav — 56px */}
      <nav
        className="fixed inset-x-0 bottom-0 z-20 flex items-stretch justify-around"
        style={{
          height: 56,
          background: "rgba(8,8,10,.92)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid var(--chq-line)",
        }}
      >
        {NAV.map(({ key, label, icon: Glyph }) => {
          const on = key === active;
          return (
            <button
              key={key}
              type="button"
              className="flex flex-1 flex-col items-center justify-center gap-0.5"
              aria-current={on ? "page" : undefined}
              style={{ color: on ? "var(--chq-gold-3)" : "var(--chq-text-muted)", background: "transparent", border: 0 }}
            >
              <Glyph size={20} strokeWidth={1.75} />
              <span style={{ fontSize: 10, letterSpacing: ".06em", textTransform: "uppercase" }}>{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
