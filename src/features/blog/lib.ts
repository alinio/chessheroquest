import { CATEGORIES, POSTS } from "./content";
import type { Category, Post } from "./types";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Newest first. */
export function allPosts(): Post[] {
  return [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function allCategories(): Category[] {
  return CATEGORIES;
}

export function postsByCategory(slug: string): Post[] {
  return allPosts().filter((p) => p.category === slug);
}

export function categoryOf(post: Post): Category | undefined {
  return CATEGORIES.find((c) => c.slug === post.category);
}

export function featuredPost(): Post | undefined {
  const posts = allPosts();
  return posts.find((p) => p.featured) ?? posts[0];
}

/** Same-category first, then fill from the rest. */
export function relatedPosts(post: Post, n = 2): Post[] {
  const others = allPosts().filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...same, ...rest].slice(0, n);
}

export function readingMinutes(post: Post): number {
  const words = post.body.reduce((n, b) => {
    if ("text" in b) return n + b.text.split(/\s+/).length;
    if ("items" in b) return n + b.items.join(" ").split(/\s+/).length;
    return n;
  }, 0);
  return Math.max(1, Math.round(words / 200));
}

/** Deterministic, locale-stable (no `new Date()` parsing surprises in SSR). */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
