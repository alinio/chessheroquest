import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Panel } from "@/src/features/landing/components/Panel";
import { OrnamentalDivider } from "@/src/features/landing/components/OrnamentalDivider";
import { CategoryNav } from "@/src/features/blog/components/CategoryNav";
import { PostCard } from "@/src/features/blog/components/PostCard";
import {
  allPosts,
  categoryOf,
  featuredPost,
  formatDate,
  readingMinutes,
} from "@/src/features/blog/lib";
import { SITE, ORG } from "@/src/lib/site";

const TITLE = "Chess Blog — Openings, Training & Strategy";
const DESCRIPTION =
  "Guides, opening repertoires and training tips to help you learn chess openings, find your playing style, and gain Elo — the RPG of chess openings.";

export const metadata: Metadata = {
  title: "Chess Blog",
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: `${SITE.url}/blog`,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: TITLE }],
  },
};

export default function BlogHome() {
  const featured = featuredPost();
  const rest = allPosts().filter((p) => p.slug !== featured?.slug);
  const fcat = featured ? categoryOf(featured) : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE.url}/blog#blog`,
    name: TITLE,
    url: `${SITE.url}/blog`,
    description: DESCRIPTION,
    inLanguage: SITE.lang,
    publisher: { "@type": "Organization", name: ORG.name, url: SITE.url },
    blogPost: allPosts().map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE.url}/blog/${p.slug}`,
      datePublished: p.date,
      dateModified: p.updated ?? p.date,
    })),
  };

  return (
    <section className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mx-auto max-w-2xl text-center">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          The ChessHeroQuest Chronicle
        </p>
        <h1 className="font-display mt-3 text-4xl font-black leading-tight text-text-hi sm:text-5xl">
          Chess openings, training &amp; strategy
        </h1>
        <p className="mt-4 text-base leading-relaxed text-text-mid sm:text-lg">
          Learn your openings, fix your weaknesses, and gain Elo — guides from
          the RPG of chess openings.
        </p>
        <OrnamentalDivider className="mt-7" />
      </header>

      <div className="mt-8">
        <CategoryNav />
      </div>

      {/* Featured */}
      {featured && (
        <Link href={`/blog/${featured.slug}`} className="group mt-10 block">
          <Panel variant="ornate" glow={fcat?.accent} interactive innerClassName="overflow-hidden">
           <div className="md:grid md:grid-cols-2 md:items-stretch">
            <div className="relative aspect-[16/9] md:aspect-auto md:min-h-full">
              <Image
                src={featured.cover}
                alt={featured.title}
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>
            <div className="flex flex-col justify-center p-5 sm:p-7">
              {fcat && (
                <span
                  className="self-start rounded-chip border px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide"
                  style={{ color: fcat.accent, borderColor: `${fcat.accent}88` }}
                >
                  Featured · {fcat.name}
                </span>
              )}
              <h2 className="font-display mt-3 text-2xl font-bold leading-tight text-text-hi group-hover:text-gold-bright sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-text-mid">
                {featured.excerpt}
              </p>
              <p className="mt-4 text-[0.7rem] uppercase tracking-wide text-text-low">
                {formatDate(featured.date)} · {readingMinutes(featured)} min read
              </p>
            </div>
           </div>
          </Panel>
        </Link>
      )}

      {/* Grid */}
      <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <li key={p.slug}>
            <PostCard post={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
