/**
 * Insights — the analytics / "is this making me better?" screen (hub section).
 * Opening-IQ trend (SVG), Road to Elo, weekly stats, performance on SYNCED real games
 * (Lichess/Chess.com), and weakest openings. Rendered inside AppShell (active=Insights).
 * SVG/CSS charts only (no generated images). Data-driven.
 */
import "@/src/ui/shell/hub.css";
import { getRankInsignia } from "@/src/lib/assets";
import type { InsightsFixture } from "@/src/dev/fixtures";

const TREND_ARROW = { up: "↑", down: "↓", flat: "→" } as const;

function iqPaths(trend: number[]) {
  const W = 100, H = 40;
  const min = Math.min(...trend), max = Math.max(...trend);
  const span = max - min || 1;
  const pts = trend.map((v, i): [number, number] => [(i / (trend.length - 1)) * W, H - ((v - min) / span) * (H - 4) - 2]);
  const line = "M" + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L");
  return { line, area: `${line} L${W},${H} L0,${H} Z` };
}

export function InsightsScreen({ data }: { data: InsightsFixture }) {
  const { line, area } = iqPaths(data.iqTrend);
  const eloPct = Math.round(Math.min(1, data.eloNow / data.eloGoal) * 100);
  const lichess = data.connected.find((c) => c.platform === "lichess");

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
          <p className="ct">Opening IQ · last 12 weeks</p>
          <p className="big">{data.openingIq}<small>Top {data.topPercent}%</small></p>
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
          <p className="ct">Road to Elo</p>
          <div className="elo-row" style={{ marginTop: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getRankInsignia(data.eloGoal)} alt="" />
            <div style={{ flex: 1 }}>
              <div><span className="num">{data.eloNow}</span> <span style={{ color: "var(--muted)", fontSize: 13 }}>→ {data.eloGoal}</span></div>
              <div className="bar" style={{ marginTop: 8 }}><span style={{ width: `${eloPct}%` }} /></div>
              <p style={{ color: "var(--faint)", fontSize: 11, marginTop: 8 }}>Projected from your Opening IQ + synced results.</p>
            </div>
          </div>
        </section>
      </div>

      <div className="ins-stats">
        <div className="ins-stat"><span className="n">{data.accuracy}%</span><span className="k">Drill accuracy</span></div>
        <div className="ins-stat"><span className="n">{data.drillsThisWeek}</span><span className="k">Drills this week</span></div>
        <div className="ins-stat"><span className="n">{data.cardsReviewed}</span><span className="k">Cards reviewed</span></div>
      </div>

      <div className="ins-two">
        {/* real games */}
        <section className="ins-card">
          <p className="ct">Your real games</p>
          <div className="conn">
            {lichess ? <><span className="badge">Lichess</span> @{lichess.username} synced</> : "No platform connected"}
            <button className="btn-ghost sm" type="button" style={{ marginLeft: "auto" }}>Connect Chess.com</button>
          </div>
          <div className="perf">
            {data.openingPerf.map((o) => (
              <div className="perf-row" key={o.name}>
                <span className="nm">{o.name}</span>
                <span className="gm">{o.games} games</span>
                <span className={`wr ${o.trend}`}>{o.winPct}% {TREND_ARROW[o.trend]}</span>
              </div>
            ))}
          </div>
        </section>

        {/* weaknesses */}
        <section className="ins-card">
          <p className="ct">Focus — weakest openings</p>
          {data.weaknesses.map((w) => (
            <div className="weak-row" key={w.name}>
              <div className="wl">{w.name}<span>{w.accuracy}% accuracy</span></div>
              <div className="wbar"><span style={{ width: `${w.accuracy}%` }} /></div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
