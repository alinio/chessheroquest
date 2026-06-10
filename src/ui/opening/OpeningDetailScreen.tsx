/**
 * Opening detail — banner hero + détouré emblem crest + REAL mastery bar +
 * Learn/Drill actions + the Opening Guardian entry. Rendered inside
 * <AppShell active="quest">. Gold accent only — the banner carries identity.
 */
import "@/src/ui/shell/hub.css";
import Link from "next/link";
import { getOpeningArt, getOpeningRealm, getRealmBoss, REALM_NAMES, PLACEHOLDER, type OpeningId } from "@/src/lib/assets";
import { OPENING_TO_PATH } from "@/src/lib/opening-paths";
import { GUARDIANS } from "@/src/domain/world/guardians";
import type { MasteryState } from "@/src/domain/mastery";

const pretty = (id: string) => id.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
const noThe = (s: string) => s.replace(/^The\s+/, "");

const STATE_LABEL: Record<MasteryState, string> = {
  leak: "Leak — start here",
  review: "Review — refresh the line",
  solid: "Solid — close to gold",
  gold: "Gold — conquered",
};

export interface OpeningMasteryView {
  studied: number;
  total: number;
  state: MasteryState;
}

export interface OpeningLineView {
  id: string;
  name: string;
  mastery: OpeningMasteryView | null;
}

export function OpeningDetailScreen({
  openingId,
  name,
  mastery,
  lines = [],
}: {
  openingId: OpeningId;
  name?: string;
  /** Real coverage from getOpeningMastery; absent = not started yet. */
  mastery?: OpeningMasteryView | null;
  /** Every curated line of this opening (mainline first), with real mastery. */
  lines?: OpeningLineView[];
}) {
  const art = getOpeningArt(openingId);
  const realm = getOpeningRealm(openingId);
  const realmFull = realm ? REALM_NAMES[realm] : "—";
  const realmShort = realm ? noThe(REALM_NAMES[realm]) : "—";
  const title = name ?? pretty(openingId);
  const pathId = OPENING_TO_PATH[openingId];
  const guardian = GUARDIANS[openingId];
  const pct = mastery && mastery.total > 0 ? Math.round((mastery.studied / mastery.total) * 100) : 0;

  return (
    <main className="opening">
      <nav className="crumb">Quest <span>›</span> {realmShort} <span>›</span> <b>{title}</b></nav>

      {/* BANNER HERO (16:9 cover) */}
      <section className="banner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={art?.banner ?? PLACEHOLDER} alt={title} />
      </section>

      {/* détouré emblem crest overlapping the banner */}
      <div className="op-head">
        <div className="op-crest">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={art?.emblem ?? PLACEHOLDER} alt="" />
        </div>
        <div>
          <p className="eyebrow">{realmFull}</p>
          <h1 className="serif">{title}</h1>
        </div>
      </div>

      <p className="lead">Master this opening through Learn &amp; Drill, then face its Guardian to push it toward the Passport seal.</p>

      <div className="mastery">
        <div className="bar"><span style={{ width: `${pct}%` }} /></div>
        <span className="m-label">
          {mastery
            ? `${STATE_LABEL[mastery.state]} · ${mastery.studied} / ${mastery.total} positions`
            : "Not started — learn the first line"}
        </span>
      </div>

      <div className="actions">
        {pathId ? (
          <>
            <Link className="btn-gold" href={`/train/${pathId}/learn`}>Learn the line →</Link>
            <Link className="btn-ghost" href={`/drill/${pathId}`}>Drill</Link>
          </>
        ) : (
          <Link className="btn-gold" href="/train">Back to training →</Link>
        )}
      </div>

      {/* CURATED LINES — every branch of this opening, with real mastery */}
      {lines.length > 1 && (
        <section className="op-lines">
          <p className="eyebrow gold">Lines</p>
          {lines.map((l) => {
            const sub = l.name.includes("—") ? l.name.split("—")[1]!.trim() : l.name;
            return (
              <div className="op-line" key={l.id}>
                <span className="ol-name">{sub}</span>
                <span className="ol-state">
                  {l.mastery ? `${STATE_LABEL[l.mastery.state].split(" — ")[0]} · ${l.mastery.studied}/${l.mastery.total}` : "Not started"}
                </span>
                <span className="ol-actions">
                  <Link className="btn-ghost sm" href={`/train/${l.id}/learn`}>Learn</Link>
                  <Link className="btn-ghost sm" href={`/drill/${l.id}`}>Drill</Link>
                </span>
              </div>
            );
          })}
        </section>
      )}

      {/* OPENING GUARDIAN ENTRY */}
      {realm && guardian && pathId && (
        <section className="boss">
          <div className="boss-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getRealmBoss(realm)} alt="" />
          </div>
          <div className="boss-inner">
            <div>
              <p className="eyebrow gold">Opening Guardian</p>
              <h3 className="serif">{guardian.name} — {guardian.title}</h3>
              <p className="muted">Play your side of the {title} from memory — win to push it toward <b style={{ color: "var(--gold-bright)" }}>gold</b>.</p>
            </div>
            <Link className="btn-gold" href={`/boss/${pathId}`}>Enter →</Link>
          </div>
        </section>
      )}
    </main>
  );
}
