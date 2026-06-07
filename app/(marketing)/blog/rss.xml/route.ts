import { allPosts, categoryOf } from "@/src/features/blog/lib";
import { SITE } from "@/src/lib/site";

export const dynamic = "force-static";

const cdata = (s: string) => `<![CDATA[${s}]]>`;

export function GET() {
  const items = allPosts()
    .map((p) => {
      const url = `${SITE.url}/blog/${p.slug}`;
      const cat = categoryOf(p);
      return `
    <item>
      <title>${cdata(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>
      ${cat ? `<category>${cdata(cat.name)}</category>` : ""}
      <description>${cdata(p.excerpt)}</description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ChessHeroQuest Blog</title>
    <link>${SITE.url}/blog</link>
    <atom:link href="${SITE.url}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>${SITE.descriptionShort}</description>
    <language>en-US</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
