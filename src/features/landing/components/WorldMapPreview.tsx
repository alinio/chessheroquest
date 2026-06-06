import Image from "next/image";
import { LANDING_ASSETS } from "../assets";
import { KINGDOMS_PREVIEW } from "../exampleData";

/**
 * World Map preview (kickoff §6/§S5). The map UI is coded; the kingdom artwork
 * is the Higgsfield illustration set. Conquered tiles glow gold; locked tiles
 * dim + desaturate (assets §3). Rendered as ONE consistent framed set (same tile
 * size + border treatment).
 */
export function WorldMapPreview() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {KINGDOMS_PREVIEW.map((k) => (
        <li
          key={k.key}
          className={`group relative aspect-[4/5] overflow-hidden rounded-card border ${
            k.conquered
              ? "border-gold shadow-[0_0_24px_-6px_rgba(227,178,60,0.5)]"
              : "border-hairline"
          }`}
        >
          <Image
            src={LANDING_ASSETS.kingdoms[k.key]}
            alt={`${k.name} kingdom`}
            fill
            sizes="(max-width: 640px) 50vw, 200px"
            className={`object-cover transition duration-500 ${
              k.conquered
                ? "saturate-100"
                : "opacity-60 saturate-[0.4] group-hover:opacity-80"
            }`}
          />
          {/* legibility gradient for the label */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-abyss via-abyss/60 to-transparent p-2 pt-6">
            <p className="font-display text-xs font-semibold text-text-hi">
              {k.name}
            </p>
            <p
              className={`text-[0.6rem] uppercase tracking-wide ${
                k.conquered ? "text-gold" : "text-text-low"
              }`}
            >
              {k.conquered ? "★ Conquered" : "Locked"}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
