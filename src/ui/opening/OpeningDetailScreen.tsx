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

export function OpeningDetailScreen({
  openingId,
  name,
  mastery,
}: {
  openingId: OpeningId;
  name?: string;
  /** Real coverage from getOpeningMastery; absent = not started yet. */
  mastery?: OpeningMasteryView | null;
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
