/**
 * Today / Train — focal redesign (global direction): one job, "what do I do now?".
 * 3 zones only — thin HUD · cinematic HERO action card (realm illustration + focal
 * light + one gold CTA) · one coach line. No dashboard grid. Rendered inside AppShell.
 */
import "@/src/ui/shell/hub.css";
import { ASSETS } from "@/src/lib/assets";
import type { DemoPlayer } from "@/src/dev/fixtures";

export function TodayScreen({ player }: { player: DemoPlayer }) {
  const eloPct = Math.round(Math.min(1, player.openingIq / 1000) * 100);

  return (
    <main className="today-v2">
      {/* thin HUD */}
      <div className="today-hud">
        <span className="h"><b>{player.openingIq}</b> IQ</span>
        <span className="h flame">🔥 {player.streakDays}</span>
        <span className="h">+{player.xpToday} XP today</span>
        <span className="sep" />
        <span className="h">Top {player.topPercent}%</span>
      </div>

      {/* cinematic HERO — the one thing to do now */}
      <section className="today-hero">
        <div className="bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ASSETS.backgrounds.today} alt="" />
        </div>
        <div className="focal">
          <p className="eyebrow gold">Daily training</p>
          <h1 className="serif">{player.dueDrills} drills due</h1>
          <p className="sub">Clear today&apos;s review, then push <b style={{ color: "var(--gold-bright)" }}>{player.recommended.name}</b>.</p>
          <button className="btn-gold cta" type="button">Start drills →</button>
        </div>
        {/* Road to Elo — thin secondary sliver */}
        <div className="road">
          <div className="rl"><span>Road to Elo · {player.eloGoal}</span><span>Strongest · {player.strongest}</span></div>
          <div className="bar"><span style={{ width: `${eloPct}%` }} /></div>
        </div>
      </section>

      {/* coach — one discreet line */}
      <div className="today-coach">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ASSETS.coach.mentor} alt="" />
        <p>After your drills, try one new line in <b>{player.recommended.name}</b> — your fastest path up the ladder.</p>
      </div>
    </main>
  );
}
