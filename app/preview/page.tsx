/**
 * /preview — Module 1 design-system showcase. Renders every token, the
 * OrnateFrame, the full SVG/icon kit (static + parametric) and the App Shell,
 * on the obsidian theme. Dev/QA surface; not part of the player flow.
 */
import type { CSSProperties, ReactNode } from "react";
import { Lightbulb, SkipForward, Share2, Settings, ChevronRight, Volume2 } from "lucide-react";
import { AppShell } from "@/src/ui/design-system/AppShell";
import { OrnateFrame } from "@/src/ui/design-system/OrnateFrame";
import { HERO_ACCENTS, TYPE_SCALE, type HeroKey } from "@/src/ui/design-system/tokens";
import {
  LogoMark,
  FrameCorner,
  MapNode,
  Medal,
  PassportSeal,
  OpeningIQGauge,
  ProgressBar,
  StreakFlame,
  LockIcon,
  ShieldIcon,
  Icon,
} from "@/src/ui/design-system/icons";

export const metadata = { title: "Design System — ChessHeroQuest", robots: { index: false } };

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginTop: 40 }}>
      <h2
        className="chq-display"
        style={{
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "var(--chq-gold-3)",
          margin: "0 0 16px",
          paddingBottom: 8,
          borderBottom: "1px solid var(--chq-line)",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

const grid: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 14 };
const card: CSSProperties = {
  background: "var(--chq-panel)",
  border: "1px solid var(--chq-line)",
  borderRadius: "var(--chq-r-panel)",
  padding: "18px 14px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: 8,
};
const label: CSSProperties = { fontSize: 13, fontWeight: 600, color: "var(--chq-text-1)" };
const mono: CSSProperties = { fontFamily: "ui-monospace, monospace", fontSize: 11, color: "var(--chq-gold-3)" };
const stage: CSSProperties = { height: 92, display: "flex", alignItems: "center", justifyContent: "center" };

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div style={card}>
      <div style={{ ...stage, height: 56, width: "100%" }}>
        <div style={{ width: "100%", height: 48, borderRadius: 10, background: value, border: "1px solid rgba(255,255,255,.06)" }} />
      </div>
      <div style={label}>{name}</div>
      <div style={mono}>{value}</div>
    </div>
  );
}

const COLOR_TOKENS = [
  ["obsidian", "#08080A"],
  ["panel", "#0D0D10"],
  ["raised", "#14141A"],
  ["line", "#1C1C22"],
  ["gold-1", "#FCEBB6"],
  ["gold-2", "#F3CF77"],
  ["gold-3", "#D9A227"],
  ["gold-4", "#A9781A"],
  ["text-1", "#E9E9EE"],
  ["text-2", "#A7A7B2"],
  ["text-muted", "#6E6E78"],
  ["locked", "#3A3A44"],
] as const;

const TYPE_ROWS: { key: keyof typeof TYPE_SCALE; sample: string; display?: boolean }[] = [
  { key: "displayXl", sample: "Display XL", display: true },
  { key: "displayL", sample: "Display L", display: true },
  { key: "h1", sample: "Heading 1", display: true },
  { key: "h2", sample: "Heading 2", display: true },
  { key: "h3", sample: "Heading 3", display: true },
  { key: "bodyL", sample: "Body large — Inter for all UI and copy." },
  { key: "body", sample: "Body — Inter, highly legible on mobile." },
  { key: "small", sample: "Small — captions and secondary." },
  { key: "micro", sample: "MICRO — EYEBROW CAPS" },
];

export default function PreviewPage() {
  return (
    <AppShell iq={428} streak={7} active="map">
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 20px 96px" }}>
        <p className="chq-display" style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--chq-text-muted)", margin: 0 }}>
          Module 1
        </p>
        <h1 className="chq-display chq-gold-text" style={{ fontSize: 30, fontWeight: 700, margin: "4px 0 6px" }}>
          Design System
        </h1>
        <p style={{ color: "var(--chq-text-2)", fontSize: 15, maxWidth: 680, lineHeight: 1.6, margin: 0 }}>
          Every token, frame, mark and component on the obsidian theme — built straight from the Art Direction Bible &amp; SVG kit.
        </p>

        {/* COLORS */}
        <Section title="Color tokens">
          <div style={grid}>
            {COLOR_TOKENS.map(([n, v]) => (
              <Swatch key={n} name={n} value={v} />
            ))}
          </div>
        </Section>

        {/* GOLD GRADIENT */}
        <Section title="Signature gold gradient">
          <div style={{ ...card, alignItems: "stretch" }}>
            <div style={{ height: 40, borderRadius: 10, background: "var(--chq-gold-gradient)" }} />
            <div className="chq-display chq-gold-text" style={{ fontSize: 56, fontWeight: 700, textAlign: "center", lineHeight: 1 }}>
              428
            </div>
            <div style={{ ...mono, textAlign: "center" }}>linear-gradient(180deg, #FCEBB6 → #A9781A)</div>
          </div>
        </Section>

        {/* HERO ACCENTS */}
        <Section title="Hero accents (recolor per world)">
          <div style={grid}>
            {(Object.keys(HERO_ACCENTS) as HeroKey[]).map((k) => {
              const a = HERO_ACCENTS[k];
              return (
                <div key={k} style={card}>
                  <div style={stage}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: a.base, boxShadow: `0 0 16px ${a.glow}` }} />
                  </div>
                  <div style={label}>{a.label}</div>
                  <div style={mono}>{a.base}</div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* TYPOGRAPHY */}
        <Section title="Typography — Cinzel (display) · Inter (UI)">
          <div style={{ ...card, alignItems: "stretch", gap: 14 }}>
            {TYPE_ROWS.map(({ key, sample, display }) => {
              const t = TYPE_SCALE[key];
              return (
                <div key={key} style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                  <span style={{ ...mono, minWidth: 72, textAlign: "right" }}>{t.size}px</span>
                  <span
                    className={display ? "chq-display" : undefined}
                    style={{ fontSize: t.size, lineHeight: t.line, color: "var(--chq-text-1)", textTransform: display ? "uppercase" : "none" }}
                  >
                    {sample}
                  </span>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ORNATE FRAME */}
        <Section title="Ornate gold frame — gold · hero · locked">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
            <OrnateFrame>
              <div style={{ padding: 22 }}>
                <div className="chq-display" style={{ color: "var(--chq-text-1)", fontSize: 16 }}>frame · gold</div>
                <p style={{ color: "var(--chq-text-2)", fontSize: 13, marginTop: 6 }}>Default — gradient border + corner flourishes + vignette.</p>
              </div>
            </OrnateFrame>
            {(Object.keys(HERO_ACCENTS) as HeroKey[]).map((k) => (
              <OrnateFrame key={k} variant="hero" hero={k}>
                <div style={{ padding: 22 }}>
                  <div className="chq-display" style={{ color: HERO_ACCENTS[k].base, fontSize: 16 }}>{HERO_ACCENTS[k].label}</div>
                  <p style={{ color: "var(--chq-text-2)", fontSize: 13, marginTop: 6 }}>frame · hero accent</p>
                </div>
              </OrnateFrame>
            ))}
            <OrnateFrame variant="locked">
              <div style={{ padding: 22, display: "flex", alignItems: "center", gap: 10 }}>
                <LockIcon size={22} />
                <div>
                  <div className="chq-display" style={{ color: "var(--chq-text-2)", fontSize: 16 }}>frame · locked</div>
                  <p style={{ color: "var(--chq-text-muted)", fontSize: 13, marginTop: 4 }}>Unlock with Pro</p>
                </div>
              </div>
            </OrnateFrame>
          </div>
        </Section>

        {/* LOGO & FRAME MARKS */}
        <Section title="Logo &amp; frame mark">
          <div style={grid}>
            <div style={card}>
              <div style={stage}><LogoMark size={56} /></div>
              <div style={label}>Crown mark</div>
              <div style={mono}>LogoMark</div>
            </div>
            <div style={card}>
              <div style={stage}><FrameCorner size={64} /></div>
              <div style={label}>Frame corner</div>
              <div style={mono}>FrameCorner ×4</div>
            </div>
          </div>
        </Section>

        {/* MAP NODES */}
        <Section title="Map nodes — 4 states">
          <div style={grid}>
            {([
              ["Locked", <MapNode key="l" state="locked" />],
              ["Available", <MapNode key="a" state="available" />],
              ["In progress · 62%", <MapNode key="p" state="inProgress" progress={0.62} />],
              ["Conquered", <MapNode key="c" state="conquered" />],
            ] as const).map(([name, node]) => (
              <div key={name} style={card}>
                <div style={stage}>{node}</div>
                <div style={label}>{name}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* MEDALS & SEAL */}
        <Section title="Mastery medals &amp; passport seal">
          <div style={grid}>
            <div style={card}>
              <div style={{ ...stage, gap: 14 }}>
                <Medal tier="bronze" />
                <Medal tier="silver" />
                <Medal tier="gold" />
              </div>
              <div style={label}>Bronze / Silver / Gold</div>
              <div style={mono}>beat Easy / Medium / Hard</div>
            </div>
            <div style={card}>
              <div style={stage}><PassportSeal /></div>
              <div style={label}>Passport seal</div>
              <div style={mono}>PassportSeal</div>
            </div>
          </div>
        </Section>

        {/* GAUGES & BARS */}
        <Section title="Gauges &amp; bars">
          <div style={grid}>
            <div style={card}>
              <div style={stage}><OpeningIQGauge value={428} size={96} /></div>
              <div style={label}>Opening IQ gauge</div>
              <div style={mono}>270° · value/1000</div>
            </div>
            <div style={{ ...card, alignItems: "stretch", justifyContent: "center" }}>
              <div style={{ width: "100%" }}><ProgressBar value={0.59} /></div>
              <div style={{ ...label, marginTop: 12 }}>XP / progress bar</div>
              <div style={mono}>59%</div>
            </div>
          </div>
        </Section>

        {/* STREAK & STATUS */}
        <Section title="Streak &amp; status">
          <div style={grid}>
            <div style={card}>
              <div style={{ ...stage, gap: 18 }}>
                <StreakFlame state="active" count={7} />
                <StreakFlame state="risk" />
                <StreakFlame state="broken" />
              </div>
              <div style={label}>Active / at-risk / broken</div>
            </div>
            <div style={card}>
              <div style={{ ...stage, gap: 18 }}>
                <LockIcon size={36} />
                <ShieldIcon size={36} />
              </div>
              <div style={label}>Lock · Shield</div>
            </div>
          </div>
        </Section>

        {/* LUCIDE */}
        <Section title="Generic icons (lucide, gold-themed)">
          <div style={{ ...card, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 22, flexWrap: "wrap" }}>
            {[Lightbulb, SkipForward, Share2, Settings, Volume2, ChevronRight].map((G, i) => (
              <Icon key={i} icon={G} size={26} />
            ))}
          </div>
        </Section>
      </div>
    </AppShell>
  );
}
