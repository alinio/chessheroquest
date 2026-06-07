import Image from "next/image";
import Link from "next/link";
import { Panel } from "./Panel";
import { CTA_HREF } from "../copy";

/**
 * Kingdoms preview (Round-3) — curated opening tiles spanning all four realms
 * (catalog mapping), each framed with its realm accent + a realm chip, so the
 * four realms are visually distinct. Italian is the conquered example. A 6th
 * "scope" teaser card backs the 20-opening claim. Uses existing tiles only.
 */
interface Tile {
  opening: string;
  realm: string;
  accent: string;
  img: string;
  conquered?: boolean;
}

const TILES: Tile[] = [
  {
    opening: "Italian Game",
    realm: "Ember Marches",
    accent: "#E0413B",
    img: "/landing/kingdom-italian.png",
    conquered: true,
  },
  {
    opening: "King's Gambit",
    realm: "Ember Marches",
    accent: "#E0413B",
    img: "/art/tiles/tile-kingsgambit.png",
  },
  {
    opening: "Ruy Lopez",
    realm: "Obsidian Court",
    accent: "#8B6CFF",
    img: "/art/tiles/tile-ruylopez.png",
  },
  {
    opening: "Caro-Kann",
    realm: "Aegis Bastion",
    accent: "#2FB67A",
    img: "/landing/kingdom-caro-kann.png",
  },
  {
    opening: "Scandinavian",
    realm: "Mirage Bazaar",
    accent: "#38C7D6",
    img: "/art/tiles/tile-scandinavian.png",
  },
];

export function WorldMapPreview() {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {TILES.map((t) => (
        <li key={t.opening}>
          <Panel
            variant="ornate"
            glow={t.accent}
            interactive
            innerClassName="p-1.5"
          >
            <div className="relative aspect-square overflow-hidden rounded-[12px]">
              <Image
                src={t.img}
                alt={`${t.opening} — ${t.realm}`}
                fill
                sizes="(max-width: 640px) 50vw, 220px"
                className={`object-cover transition duration-500 ${
                  t.conquered
                    ? "saturate-100"
                    : "opacity-70 saturate-[0.7] group-hover:opacity-90"
                }`}
              />
              {/* realm chip */}
              <span
                className="absolute left-2 top-2 rounded-chip border px-2 py-0.5 text-[0.52rem] font-semibold uppercase tracking-wide backdrop-blur-sm"
                style={{
                  color: t.accent,
                  borderColor: `${t.accent}88`,
                  backgroundColor: "rgba(8,9,14,0.6)",
                }}
              >
                {t.realm}
              </span>
              {!t.conquered && (
                <span
                  aria-hidden
                  className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 text-2xl text-text-hi/70 [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]"
                >
                  🔒
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-abyss via-abyss/65 to-transparent p-2 pt-7">
                <p className="font-display text-xs font-semibold text-text-hi">
                  {t.opening}
                </p>
                {t.conquered ? (
                  <p
                    className="text-[0.6rem] font-semibold uppercase tracking-wide"
                    style={{ color: t.accent }}
                  >
                    ★ Conquered
                  </p>
                ) : (
                  <p className="text-[0.58rem] leading-tight text-text-low">
                    Conquer it in training to unlock
                  </p>
                )}
              </div>
            </div>
          </Panel>
        </li>
      ))}

      {/* scope teaser card — backs the "20 openings" claim */}
      <li>
        <Link href={CTA_HREF} className="group block h-full">
          <Panel variant="ornate" interactive innerClassName="h-full p-1.5">
            <div className="flex aspect-square flex-col items-center justify-center rounded-[12px] bg-abyss/50 p-4 text-center">
              <p className="font-display text-3xl font-black text-gold">+15</p>
              <p className="mt-1 font-display text-sm font-bold text-text-hi">
                more openings
              </p>
              <p className="mt-1.5 text-[0.62rem] uppercase tracking-wide text-text-low">
                20 kingdoms · 4 realms
              </p>
              <span className="mt-3 rounded-chip border border-gold/60 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-wide text-gold transition-colors group-hover:bg-gold group-hover:text-abyss">
                Take the test
              </span>
            </div>
          </Panel>
        </Link>
      </li>
    </ul>
  );
}
