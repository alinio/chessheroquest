/**
 * Opening detail — faithful reproduction of docs/mockups/mockup-opening-rpg.html
 * (<main class="opening">). Rendered inside <AppShell active="quest">. Breadcrumb +
 * banner hero (16:9 cover) + détouré emblem crest overlapping the banner + title +
 * mastery bar + actions + Boss-Fight block (the OPENING'S REALM boss). Gold accent
 * only — the banner carries the opening's identity.
 */
import "@/src/ui/shell/hub.css";
import { getOpeningArt, getOpeningRealm, getRealmBoss, REALM_NAMES, PLACEHOLDER, type OpeningId } from "@/src/lib/assets";

const pretty = (id: string) => id.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
const noThe = (s: string) => s.replace(/^The\s+/, "");

export function OpeningDetailScreen({ openingId, name }: { openingId: OpeningId; name?: string }) {
  const art = getOpeningArt(openingId);
  const realm = getOpeningRealm(openingId);
  const realmFull = realm ? REALM_NAMES[realm] : "—";
  const realmShort = realm ? noThe(REALM_NAMES[realm]) : "—";
  const title = name ?? pretty(openingId);

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

      <p className="lead">Master this opening through Learn &amp; Drill, then face the Realm Guardian to seal it in your Passport.</p>

      <div className="mastery">
        <div className="bar"><span style={{ width: "45%" }} /></div>
        <span className="m-label">Mastery · Learning — 9 / 20 lines</span>
      </div>

      <div className="actions">
        <button className="btn-gold" type="button">Learn the lines →</button>
        <button className="btn-ghost" type="button">Drill</button>
      </div>

      {/* BOSS FIGHT ENTRY — the opening's REALM boss */}
      {realm && (
        <section className="boss">
          <div className="boss-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getRealmBoss(realm)} alt="" />
          </div>
          <div className="boss-inner">
            <div>
              <p className="eyebrow gold">Boss Fight</p>
              <h3 className="serif">Face the {realmShort} Guardian</h3>
              <p className="muted">Defeat the Guardian to seal {title} in your Passport.</p>
            </div>
            <button className="btn-gold" type="button">Enter →</button>
          </div>
        </section>
      )}
    </main>
  );
}
