import Link from "next/link";
import { allCategories } from "../lib";

/** Accent-coded category chips. `active` highlights the current category slug. */
export function CategoryNav({ active }: { active?: string }) {
  return (
    <nav className="flex flex-wrap items-center justify-center gap-2">
      <Link
        href="/blog"
        className={`rounded-chip border px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-wide transition-colors ${
          active === undefined
            ? "border-gold bg-gold/15 text-gold"
            : "border-hairline text-text-low hover:text-text-hi"
        }`}
      >
        All
      </Link>
      {allCategories().map((c) => {
        const on = c.slug === active;
        return (
          <Link
            key={c.slug}
            href={`/blog/category/${c.slug}`}
            className="rounded-chip border px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-wide transition-colors"
            style={{
              borderColor: on ? c.accent : "var(--color-hairline)",
              color: on ? "#0F1015" : c.accent,
              backgroundColor: on ? c.accent : "transparent",
            }}
          >
            {c.name}
          </Link>
        );
      })}
    </nav>
  );
}
