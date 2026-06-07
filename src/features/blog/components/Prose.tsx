import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Block } from "../types";

/** Minimal inline markdown: **bold**, [text](/href), `code`. */
function inline(text: string): ReactNode[] {
  const re = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\(([^)]+)\))|(`([^`]+)`)/g;
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) {
      out.push(
        <strong key={key++} className="font-semibold text-text-hi">
          {m[2]}
        </strong>,
      );
    } else if (m[3] && m[5]) {
      const href = m[5];
      const label = m[4];
      out.push(
        href.startsWith("/") ? (
          <Link
            key={key++}
            href={href}
            className="font-medium text-gold underline decoration-gold/40 underline-offset-2 transition-colors hover:text-gold-bright"
          >
            {label}
          </Link>
        ) : (
          <a
            key={key++}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gold underline decoration-gold/40 underline-offset-2 transition-colors hover:text-gold-bright"
          >
            {label}
          </a>
        ),
      );
    } else if (m[6]) {
      out.push(
        <code
          key={key++}
          className="rounded bg-raised px-1.5 py-0.5 font-mono text-[0.85em] text-gold"
        >
          {m[7]}
        </code>,
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Prose({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-5">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2
                key={i}
                className="font-display mt-4 text-2xl font-bold leading-tight text-text-hi sm:text-3xl"
              >
                {inline(b.text)}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={i}
                className="font-display mt-2 text-xl font-bold leading-tight text-text-hi"
              >
                {inline(b.text)}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="text-[1.02rem] leading-relaxed text-text-mid">
                {inline(b.text)}
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="flex flex-col gap-2 pl-1">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-2.5 text-[1.02rem] leading-relaxed text-text-mid">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{inline(it)}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="flex flex-col gap-2">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-3 text-[1.02rem] leading-relaxed text-text-mid">
                    <span className="font-display shrink-0 font-bold text-gold">{j + 1}.</span>
                    <span>{inline(it)}</span>
                  </li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="border-l-2 border-gold/60 pl-4 font-display text-lg italic leading-relaxed text-text-hi"
              >
                {inline(b.text)}
                {b.cite && <cite className="mt-1 block text-sm not-italic text-text-low">— {b.cite}</cite>}
              </blockquote>
            );
          case "callout":
            return (
              <aside
                key={i}
                className="rounded-card border border-gold/30 bg-gold/[0.06] p-4 sm:p-5"
              >
                {b.title && (
                  <p className="font-display text-sm font-bold text-gold">{b.title}</p>
                )}
                <p className="mt-1 text-[0.98rem] leading-relaxed text-text-mid">
                  {inline(b.text)}
                </p>
              </aside>
            );
          case "img":
            return (
              <figure key={i} className="my-2">
                <div className="relative aspect-video w-full overflow-hidden rounded-card border border-hairline">
                  <Image src={b.src} alt={b.alt} fill sizes="(max-width: 768px) 100vw, 720px" className="object-cover" />
                </div>
                {b.caption && (
                  <figcaption className="mt-2 text-center text-xs text-text-low">{b.caption}</figcaption>
                )}
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
