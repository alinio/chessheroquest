/**
 * Realms — overview of the 4 worlds (Ember/Obsidian/Aegis/Mirage). Each card shows the
 * realm's crest + accent, progress (sealed/total), the current-realm badge, and an
 * Enter CTA. Rendered inside AppShell (active = Quest). Data-driven.
 */
import type { CSSProperties } from "react";
import Link from "next/link";
import "@/src/ui/shell/hub.css";
import { getArchetypeSigil } from "@/src/lib/assets";
import type { RealmEntry } from "@/src/dev/fixtures";

export function RealmsScreen({ realms }: { realms: RealmEntry[] }) {
  return (
    <main className="realms">
      <div className="ins-head">
        <p className="eyebrow gold">Realms</p>
        <h2 className="serif">Four worlds, one repertoire.</h2>
        <p className="sub">Each realm holds 5 openings. Seal them all, beat the Realm Boss, claim the realm.</p>
      </div>

      <div className="realm-grid">
        {realms.map((r) => (
          <section key={r.id} className={`rc${r.current ? " cur" : ""}`} style={{ "--accent": r.accent } as CSSProperties}>
            <div className="rc-top">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="rc-crest" src={getArchetypeSigil(r.archetype)} alt="" />
              <div>
                <h3 className="serif">{r.name}</h3>
                <div className="sub">{r.sub}</div>
              </div>
              {r.current && <span className="cur-badge">Current</span>}
            </div>

            <div className="prog">
              <div className="pl"><span><b>{r.sealed}</b> / {r.total} sealed</span><span>{Math.round((r.sealed / r.total) * 100)}%</span></div>
              <div className="rbar"><span style={{ width: `${(r.sealed / r.total) * 100}%` }} /></div>
            </div>

            <div className="rc-foot">
              <Link className="btn-ghost" href={`/quest?realm=${r.id}`} style={{ textDecoration: "none", display: "inline-block" }}>
                {r.current ? "Continue →" : "Enter realm →"}
              </Link>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
