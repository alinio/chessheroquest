import Image from "next/image";
import Link from "next/link";
import { Panel } from "@/src/features/landing/components/Panel";
import { categoryOf, formatDate, readingMinutes } from "../lib";
import type { Post } from "../types";

/** Opening-tile-style collectible card for a blog post. */
export function PostCard({ post }: { post: Post }) {
  const cat = categoryOf(post);
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <Panel
        variant="ornate"
        glow={cat?.accent}
        interactive
        className="h-full"
        innerClassName="flex h-full flex-col overflow-hidden"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={post.cover}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, 360px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-abyss/80 via-transparent to-transparent" />
          {cat && (
            <span
              className="absolute left-3 top-3 rounded-chip border px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide backdrop-blur-sm"
              style={{ color: cat.accent, borderColor: `${cat.accent}88`, backgroundColor: "rgba(8,9,14,0.6)" }}
            >
              {cat.name}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-display text-lg font-bold leading-snug text-text-hi transition-colors group-hover:text-gold-bright">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-3 flex-1 text-[0.9rem] leading-relaxed text-text-mid">
            {post.excerpt}
          </p>
          <p className="mt-3 text-[0.7rem] uppercase tracking-wide text-text-low">
            {formatDate(post.date)} · {readingMinutes(post)} min read
          </p>
        </div>
      </Panel>
    </Link>
  );
}
