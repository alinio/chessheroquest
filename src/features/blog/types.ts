/**
 * Blog content model — typed, file-based (no CMS, no markdown dep). Article
 * bodies are an ordered list of semantic blocks so headings render as real
 * h2/h3 (SEO) and styling stays in our control (heroic-RPG prose). Inline
 * markdown (**bold**, [text](/href), `code`) is supported inside text fields.
 */
export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "callout"; title?: string; text: string }
  | { type: "img"; src: string; alt: string; caption?: string };

export interface Category {
  slug: string;
  name: string;
  /** One-line description (used on the category page + meta description). */
  description: string;
  /** Realm-accent hex for the category's heroic color coding. */
  accent: string;
}

export interface Post {
  slug: string;
  title: string;
  /** ~150-char summary — cards + meta description. */
  excerpt: string;
  category: string; // Category.slug
  tags: string[];
  /** ISO date (YYYY-MM-DD). */
  date: string;
  updated?: string;
  author: string;
  /** Cover image path under /public (reuse existing art — never invent). */
  cover: string;
  /** Featured on the blog home hero. */
  featured?: boolean;
  body: Block[];
}
