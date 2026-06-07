import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrnamentalDivider } from "@/src/features/landing/components/OrnamentalDivider";
import { CategoryNav } from "@/src/features/blog/components/CategoryNav";
import { PostCard } from "@/src/features/blog/components/PostCard";
import {
  allCategories,
  getCategory,
  postsByCategory,
} from "@/src/features/blog/lib";
import { SITE, ORG } from "@/src/lib/site";

export function generateStaticParams() {
  return allCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return {};
  const title = `${cat.name} — Chess Blog`;
  return {
    title: `${cat.name} articles`,
    description: cat.description,
    alternates: { canonical: `/blog/category/${cat.slug}` },
    openGraph: {
      title,
      description: cat.description,
      type: "website",
      url: `${SITE.url}/blog/category/${cat.slug}`,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();

  const posts = postsByCategory(cat.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE.url}/blog/category/${cat.slug}#collection`,
    name: `${cat.name} — Chess Blog`,
    url: `${SITE.url}/blog/category/${cat.slug}`,
    description: cat.description,
    inLanguage: SITE.lang,
    isPartOf: { "@type": "Blog", "@id": `${SITE.url}/blog#blog` },
    publisher: { "@type": "Organization", name: ORG.name, url: SITE.url },
  };

  return (
    <section className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mx-auto max-w-2xl text-center">
        <p
          className="font-display text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: cat.accent }}
        >
          Category
        </p>
        <h1 className="font-display mt-3 text-4xl font-black leading-tight text-text-hi sm:text-5xl">
          {cat.name}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-text-mid sm:text-lg">
          {cat.description}
        </p>
        <OrnamentalDivider className="mt-7" />
      </header>

      <div className="mt-8">
        <CategoryNav active={cat.slug} />
      </div>

      {posts.length > 0 ? (
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <li key={p.slug}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-12 text-center text-text-low">
          No articles here yet — check back soon.
        </p>
      )}
    </section>
  );
}
