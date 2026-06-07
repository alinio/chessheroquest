/**
 * Passport / Collection — faithful reproduction of docs/mockups/mockup-passport-rpg.html
 * (<main class="passport">). Rendered inside <AppShell active="passport">. Cover hero +
 * 4 realm sections (Ember/Obsidian/Aegis/Mirage), each a 5-card grid. Sealed = full-colour
 * détouré emblem + mastered stamp; locked = grayscale+dim emblem (CSS) + locked stamp.
 */
import type { CSSProperties } from "react";
import "@/src/ui/shell/hub.css";
import {
  ASSETS, getOpeningArt, getArchetypeSigil, PLACEHOLDER,
  type OpeningId, type RealmId, type Archetype,
} from "@/src/lib/assets";
import type { DemoOpening } from "@/src/dev/fixtures";

const REALMS_ORDER: { id: RealmId; name: string; accent: string; archetype: Archetype }[] = [
  { id: "ember-marches", name: "Ember Marches", accent: "var(--ember)", archetype: "warrior" },
  { id: "obsidian-court", name: "Obsidian Court", accent: "var(--violet)", archetype: "strategist" },
  { id: "aegis-bastion", name: "Aegis Bastion", accent: "var(--emerald)", archetype: "defender" },
  { id: "mirage-bazaar", name: "Mirage Bazaar", accent: "var(--cyan)", archetype: "trickster" },
];
const OPENING_IDS = Object.keys(ASSETS.openings) as OpeningId[];

export function PassportScreen({ openings }: { openings: DemoOpening[] }) {
  const sealed = new Set(openings.filter((o) => o.mastered).map((o) => o.id));
  const nameOf = (id: OpeningId) => openings.find((o) => o.id === id)?.name ?? id;
  const total = OPENING_IDS.length;
  const sealedCount = OPENING_IDS.filter((id) => sealed.has(id)).length;

  return (
    <main className="passport">
      {/* COVER HERO — full cover, never cropped */}
      <section className="cover-hero">
        <div className="cover-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ASSETS.passport.cover} alt="Opening Passport" />
        </div>
        <div className="cover-meta">
          <p className="eyebrow">Opening Passport</p>
          <p className="big serif">{sealedCount} / {total} Sealed</p>
          <div className="pbar"><span style={{ width: `${(sealedCount / total) * 100}%` }} /></div>
          <p className="sub">Master an opening, then defeat its Realm Guardian to seal it in your Passport.</p>
        </div>
      </section>

      {/* 4 realm sections */}
      {REALMS_ORDER.map((r) => {
        const list = OPENING_IDS.filter((id) => ASSETS.openings[id].realm === r.id);
        const sealedN = list.filter((id) => sealed.has(id)).length;
        return (
          <section className="realm-sec" key={r.id} style={{ "--accent": r.accent } as CSSProperties}>
            <div className="realm-head">
              <span className="rh-crest">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getArchetypeSigil(r.archetype)} alt="" />
              </span>
              <h3 className="serif">{r.name}</h3>
              <span className="rh-count">{sealedN} / {list.length} sealed</span>
            </div>
            <div className="op-grid">
              {list.map((id) => {
                const isSealed = sealed.has(id);
                const emblem = getOpeningArt(id)?.emblem ?? PLACEHOLDER;
                return (
                  <div key={id} className={`op ${isSealed ? "sealed" : "locked"}`}>
                    <span className={`seal ${isSealed ? "" : "locked"}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={isSealed ? ASSETS.passport.stampMastered : ASSETS.passport.stampLocked} alt={isSealed ? "sealed" : "locked"} />
                    </span>
                    <div className="op-medal">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={emblem} alt="" />
                    </div>
                    <span className="op-name">{nameOf(id)}</span>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}
