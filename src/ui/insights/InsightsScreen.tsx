/**
 * Insights — the analytics / "is this making me better?" screen (hub section).
 * REAL data only: Opening-IQ trend from snapshots, Road-to-Elo from the domain
 * projection (framed as an estimate, never an invented "current Elo"), weekly
 * stats from training_events, synced real games (client store), and weakest
 * openings from FSRS mastery. SVG/CSS charts only. Honest empty states.
 */
import "@/src/ui/shell/hub.css";
import { getRankInsignia } from "@/src/lib/assets";
import type { MasteryState } from "@/src/domain/mastery";
import { RealGamesCard } from "./RealGamesCard";

export interface InsightsWeakness {
  name: string;
  state: MasteryState;
  studied: number;
  total: number;
}

export interface InsightsData {
  openingIq: number;
  /** IQ change across the trend window (real snapshots — may be 0). */
  iqDelta: number;
  /** Oldest → newest snapshot values; length ≥ 2 (padded with current). */
  iqTrend: number[];
  eloGoal: number;
  /** Road fill 0–100 from roadProgress (domain). */
  roadPct: number;
  /** Estimated practical Elo gain at the current IQ (transparent estimate). */
  projectedGain: number;
  /** 7-day drill accuracy %, or null before the first answers. */
  accuracy: number | null;
  drillsThisWeek: number;
  cardsReviewed: number;
  weaknesses: InsightsWeakness[];
}

const STATE_LABEL: Record<MasteryState, string> = {
  leak: "Leak",
  review: "Review",
  solid: "Solid",
  gold: "Gold",
};

function iqPaths(trend: number[]) {
  const W = 100, H = 40;
  const min = Math.min(...trend), max = Math.max(...trend);
  const span = max - min || 1;
  const pts = trend.map((v, i): [number, number] => [(i / (trend.length - 1)) * W, H - ((v - min) / span) * (H - 4) - 2]);
  const line = "M" + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L");
  return { line, area: `${line} L${W},${H} L0,${H} Z` };
}

export function InsightsScreen({ data }: { data: InsightsData }) {
  const { line, area } = iqPaths(data.iqTrend.length >= 2 ? data.iqTrend : [data.openingIq, data.openingIq]);

  return (
    <main className="insights">
      <div className="ins-head">
        <p className="eyebrow gold">Insights</p>
        <h2 className="serif">Your opening game, measured.</h2>
        <p className="sub">Tracked from your drills and your synced real games — proof it&apos;s working.</p>
      </div>

      <div className="ins-grid">
        {/* Opening IQ trend */}
        <section className="ins-card ins-iq">
          <p className="ct">Opening IQ · recent trend</p>
          <p className="big">
            {data.openingIq}
            <small style={data.iqDelta > 0 ? { color: "#6fd89a" } : undefined}>
              {data.iqDelta > 0 ? `+${data.iqDelta} over this window` : data.iqDelta < 0 ? `${data.iqDelta} over this window` : "your baseline — drill to move it"}
            </small>
          </p>
          <svg className="ins-chart" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="chq-iq-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="rgba(241,214,128,.35)" />
                <stop offset="1" stopColor="rgba(241,214,128,0)" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#chq-iq-area)" />
            <path d={line} fill="none" stroke="#f1d680" strokeWidth="1.2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </section>

        {/* Road to Elo */}
        <section className="ins-card">
          <p className="ct">Road to Elo · {data.eloGoal}</p>
          <div className="elo-row" style={{ marginTop: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getRankInsignia(data.eloGoal)} alt="" />
            <div style={{ flex: 1 }}>
              <div><span className="num">{data.roadPct}%</span> <span style={{ color: "var(--muted)", fontSize: 13 }}>of the road</span></div>
              <div className="bar" style={{ marginTop: 8 }}><span style={{ width: `${data.roadPct}%` }} /></div>
              <p style={{ color: "var(--faint)", fontSize: 11, marginTop: 8 }}>
                Openings at this IQ are worth an estimated +{data.projectedGain} Elo of practical strength.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="ins-stats">
        <div className="ins-stat">
          <span className="n">{data.accuracy != null ? `${data.accuracy}%` : "—"}</span>
          <span className="k">Drill accuracy · 7d</span>
        </div>
        <div className="ins-stat"><span className="n">{data.drillsThisWeek}</span><span className="k">Drills this week</span></div>
        <div className="ins-stat"><span className="n">{data.cardsReviewed}</span><span className="k">Positions answered</span></div>
      </div>

      <div className="ins-two">
        {/* real games — client card reads the sync store */}
        <RealGamesCard />

        {/* weaknesses from real FSRS mastery */}
        <section className="ins-card">
          <p className="ct">Focus — weakest openings</p>
          {data.weaknesses.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55, marginTop: 8 }}>
              Drill your first lines and your leaks will surface here.
            </p>
          ) : (
            data.weaknesses.map((w) => {
              const pct = w.total > 0 ? Math.round((w.studied / w.total) * 100) : 0;
              return (
                <div className="weak-row" key={w.name}>
                  <div className="wl">{w.name}<span>{STATE_LABEL[w.state]} · {w.studied}/{w.total} positions</span></div>
                  <div className="wbar"><span style={{ width: `${Math.max(pct, 4)}%` }} /></div>
                </div>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
