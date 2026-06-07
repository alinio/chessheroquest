/**
 * DNA Results (reveal S2) — faithful reproduction of docs/mockups/mockup-dna-results-rpg.html.
 * Immersive, NO AppShell. Full-bleed results-reveal-bg + DNA card (frame + corners,
 * détouré crowned sigil, IQ ring, traits, best/weakness) + Share/Download + Save block.
 * Accent = the ARCHETYPE colour (the only archetype-driven screen). Data-driven.
 */
import type { CSSProperties } from "react";
import "./dna-results.css";
import { ASSETS, getArchetypeSigil, type Archetype } from "@/src/lib/assets";
import { IconCrown } from "@/src/ui/shell/icons";
import type { DnaFixture } from "@/src/dev/fixtures";

const ARCH_ACCENT: Record<Archetype, string> = {
  warrior: "#e0413b",
  strategist: "#8a7bd8",
  defender: "#4fb477",
  trickster: "#46c7d8",
};
const RING_C = 2 * Math.PI * 56; // r = 56

export function DnaResultsScreen({ dna }: { dna: DnaFixture }) {
  const filled = Math.max(0, Math.min(1, dna.iq / 1000)) * RING_C;

  return (
    <div className="chq-dna" style={{ "--accent": ARCH_ACCENT[dna.archetype] } as CSSProperties}>
      <div className="stage">
        <div className="bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ASSETS.backgrounds.resultsReveal} alt="" />
        </div>

        <div className="topleft"><IconCrown /> Your Chess DNA</div>
        {dna.sample && <p className="sample">Sample data — take the Test &amp; Quiz for your real result</p>}

        {/* DNA CARD */}
        <div className="card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="frame-img" src={ASSETS.dnaCard.frame} alt="" />
          <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />

          <div className="dna-medal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getArchetypeSigil(dna.archetype)} alt="" />
          </div>
          <h1 className="arch-name">{dna.archetypeName}</h1>

          <div className="ring">
            <svg width="128" height="128" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="10" />
              <circle cx="64" cy="64" r="56" fill="none" stroke="url(#chq-dna-ring)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${filled} ${RING_C}`} />
              <defs>
                <linearGradient id="chq-dna-ring" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#cda845" />
                  <stop offset="1" stopColor="#f1d680" />
                </linearGradient>
              </defs>
            </svg>
            <div className="val"><span className="n">{dna.iq}</span><span className="u">IQ</span></div>
          </div>

          <p className="match">Top {dna.topPercent}% · {dna.matchPercent}% match</p>

          <div className="traits">
            {dna.traits.map((t) => <span className="trait" key={t}>{t}</span>)}
          </div>

          <div className="kv">
            <div className="box"><div className="k">Best opening</div><div className="v">{dna.best}</div></div>
            <div className="box"><div className="k">Biggest weakness</div><div className="v">{dna.weakness}</div></div>
          </div>
        </div>

        <div className="cta">
          <button className="btn-ghost" type="button">Share</button>
          <button className="btn-gold" type="button">Download card</button>
        </div>

        <div className="save">
          <h4 className="serif">Save your progress</h4>
          <p>Keep your Opening IQ, hero and streak across devices. No password.</p>
        </div>
      </div>
    </div>
  );
}
