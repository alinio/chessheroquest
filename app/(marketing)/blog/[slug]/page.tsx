import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Panel } from "@/src/features/landing/components/Panel";
import { CTAButton } from "@/src/features/landing/components/CTAButton";
import { Prose } from "@/src/features/blog/components/Prose";
import { PostCard } from "@/src/features/blog/components/PostCard";
import {
  allPosts,
  categoryOf,
  formatDate,
  getPost,
  readingMinutes,
  relatedPosts,
} from "@/src/features/blog/lib";
import { SITE, ORG } from "@/src/lib/site";

export function generateStaticParams() {
  return allPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `${SITE.url}/blog/${post.slug}`;
  const cover = `${SITE.url}${post.cover}`;
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: cover, width: 1200, height: 675, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [cover],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const cat = categoryOf(post);
  const related = relatedPosts(post, 3);
  const url = `${SITE.url}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.excerpt,
        image: `${SITE.url}${post.cover}`,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        author: { "@type": "Organization", name: post.author, url: SITE.url },
        publisher: {
          "@type": "Organization",
          name: ORG.name,
          url: SITE.url,
          logo: { "@type": "ImageObject", url: ORG.logo },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        inLanguage: SITE.lang,
        keywords: post.tags.join(", "),
        articleSection: cat?.name,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Blog", item: `${SITE.url}/blog` },
          ...(cat
            ? [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: cat.name,
                  item: `${SITE.url}/blog/category/${cat.slug}`,
                },
              ]
            : []),
          {
            "@type": "ListItem",
            position: cat ? 3 : 2,
            name: post.title,
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-[0.7rem] uppercase tracking-wide text-text-low">
        <Link href="/blog" className="transition-colors hover:text-text-hi">
          Blog
        </Link>
        {cat && (
          <>
            <span aria-hidden>/</span>
            <Link
              href={`/blog/category/${cat.slug}`}
              className="transition-colors hover:text-text-hi"
              style={{ color: cat.accent }}
            >
              {cat.name}
            </Link>
          </>
        )}
      </nav>

      <h1 className="font-display mt-4 text-3xl font-black leading-tight text-text-hi sm:text-4xl">
        {post.title}
      </h1>
      <p className="mt-3 text-[0.78rem] uppercase tracking-wide text-text-low">
        By {post.author} · {formatDate(post.date)} · {readingMinutes(post)} min read
      </p>

      <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-card border border-hairline">
        <Image
          src={post.cover}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
          priority
        />
      </div>

      <p className="mt-6 text-lg leading-relaxed text-text-hi">{post.excerpt}</p>

      <div className="mt-6">
        <Prose blocks={post.body} />
      </div>

      {/* CTA */}
      <Panel variant="ornate" className="mt-12" innerClassName="p-6 text-center sm:p-8">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-gold">
          Your move
        </p>
        <h2 className="font-display mt-2 text-2xl font-bold text-text-hi sm:text-3xl">
          Discover your Chess DNA — free
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed text-text-mid">
          A 2-minute test reveals your Opening IQ, your style, and the exact
          openings to train next. No signup to begin.
        </p>
        <div className="mt-6 flex justify-center">
          <CTAButton section="final" label="Take the free Chess DNA Test" />
        </div>
      </Panel>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-xl font-bold text-text-hi">Keep reading</h2>
          <ul className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
