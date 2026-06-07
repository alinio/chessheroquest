/**
 * Today / Train content — faithful reproduction of docs/mockups/mockup-today-rpg.html
 * (the <main class="today"> block). Rendered inside <AppShell>. Asset slots per the
 * mockup's Asset map: today-hero-bg (1), Ruy-Lopez emblem (2), rank insignia (3),
 * coach mentor (4) — medallions are détourés on transparent containers (no box).
 */
import "@/src/ui/shell/hub.css";
import { ASSETS, getOpeningArt, getRankInsignia, PLACEHOLDER } from "@/src/lib/assets";
import type { DemoPlayer } from "@/src/dev/fixtures";

const RING_C = 2 * Math.PI * 46; // r = 46

export function TodayScreen({ player }: { player: DemoPlayer }) {
  const recEmblem = getOpeningArt(player.recommended.id)?.emblem ?? PLACEHOLDER;
  const rankInsignia = getRankInsignia(player.eloGoal);
  const iqFilled = Math.max(0, Math.min(1, player.openingIq / 1000)) * RING_C;
  const goalPct = Math.round((player.goalDone / player.goalTarget) * 100);
  const eloPct = Math.round(Math.min(1, player.openingIq / 1000) * 100);

  return (
    <main className="today">
      {/* greeting */}
      <div className="greet">
        <div>
          <p className="eyebrow">{realmName(player)}</p>
          <h1 className="serif">Welcome back, {player.name}</h1>
        </div>
        <span className="chip streak">🔥 {player.streakDays}-day streak</span>
      </div>

      {/* two-column core */}
      <div className="grid">
        {/* left column */}
        <div className="col-main">
          {/* PRIMARY ACTION — drills due */}
          <section className="card hero-card">
            <div className="hero-bg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ASSETS.backgrounds.today} alt="" />
            </div>
            <div className="hero-inner">
              <p className="eyebrow gold">Daily training</p>
              <h2 className="serif">{player.dueDrills} drills due</h2>
              <p className="muted">Keep your lines automatic — clear today&apos;s review.</p>
              <button className="btn-gold" type="button">Start drills →</button>
            </div>
          </section>

          {/* RECOMMENDED NEXT */}
          <section className="card rec">
            <div className="medallion sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={recEmblem} alt="" />
            </div>
            <div className="rec-body">
              <p className="eyebrow">Recommended next</p>
              <h3 className="serif">{player.recommended.name}</h3>
              <p className="muted">On your Road to Elo</p>
            </div>
            <div className="rec-actions">
              <button className="btn-gold sm" type="button">Learn</button>
              <button className="btn-ghost" type="button">Drill</button>
            </div>
          </section>
        </div>

        {/* right column */}
        <div className="col-side">
          {/* OPENING IQ */}
          <section className="card iq">
            <div className="ring">
              <svg width="104" height="104" viewBox="0 0 104 104">
                <circle cx="52" cy="52" r="46" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="9" />
                <circle cx="52" cy="52" r="46" fill="none" stroke="url(#chq-iq-ring)" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${iqFilled} ${RING_C}`} />
                <defs>
                  <linearGradient id="chq-iq-ring" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#cda845" />
                    <stop offset="1" stopColor="#f1d680" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="val"><span className="n">{player.openingIq}</span><span className="u">IQ</span></div>
            </div>
            <div className="iq-meta">
              <p className="eyebrow gold">Opening IQ · Top {player.topPercent}%</p>
              <p className="goal-label">Today&apos;s goal · {player.goalDone} / {player.goalTarget} XP</p>
              <div className="bar"><span style={{ width: `${goalPct}%` }} /></div>
              <p className="faint">+{player.xpToday} XP today</p>
            </div>
          </section>

          {/* ROAD TO ELO */}
          <section className="card elo">
            <div className="medallion md rank">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={rankInsignia} alt="" />
            </div>
            <div className="elo-body">
              <p className="eyebrow gold">Road to Elo · Goal {player.eloGoal}</p>
              <div className="bar"><span style={{ width: `${eloPct}%` }} /></div>
              <p className="tags"><b>Strongest</b> {player.strongest} &nbsp;·&nbsp; <b>Focus</b> {player.weakness}</p>
            </div>
          </section>
        </div>
      </div>

      {/* COACH NUDGE */}
      <section className="card coach">
        <div className="coach-av">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ASSETS.coach.mentor} alt="" />
        </div>
        <p>Nice {player.streakDays}-day streak. After your drills, try one new line in <b>{player.recommended.name}</b> — it&apos;s your fastest path up the ladder.</p>
      </section>

      {/* DAILY STATS */}
      <div className="stats">
        <div className="stat"><span className="num serif">{player.cardsReviewed}</span><span className="key">Cards</span></div>
        <div className="stat"><span className="num serif">{player.accuracy}%</span><span className="key">Accuracy</span></div>
        <div className="stat"><span className="num serif">{player.xpToday}</span><span className="key">XP today</span></div>
      </div>
    </main>
  );
}

function realmName(player: DemoPlayer): string {
  return REALM_LABEL[player.realm];
}
const REALM_LABEL: Record<DemoPlayer["realm"], string> = {
  "ember-marches": "The Ember Marches",
  "obsidian-court": "The Obsidian Court",
  "aegis-bastion": "The Aegis Bastion",
  "mirage-bazaar": "The Mirage Bazaar",
};
