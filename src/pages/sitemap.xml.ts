import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import destinyEn from '../data/destiny-en.json';
import { SITE_URL } from '../lib/brand';

const SITE = SITE_URL;
const LAST_BUILD = new Date().toISOString().split('T')[0];

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog')).filter((post: CollectionEntry<'blog'>) => !post.data.noindex);
  const pages = await getCollection('pages');

  // Build a map of blog slug → lastmod for dynamic dates
  const blogDates = new Map<string, string>();
  for (const p of posts) {
    const date = p.data.updatedDate ?? p.data.pubDate;
    const d = date ? new Date(date).toISOString().split('T')[0] : LAST_BUILD;
    blogDates.set(p.id, d);
  }

  const urls: { loc: string; alt?: string; priority: string; changefreq: string; lastmod?: string }[] = [
    { loc: '/', alt: '/zh', priority: '1.0', changefreq: 'weekly', lastmod: LAST_BUILD },
    { loc: '/calculator.html', alt: '/zh/calculator.html', priority: '0.9', changefreq: 'monthly', lastmod: LAST_BUILD },
    { loc: '/chinese-name.html', priority: '0.9', changefreq: 'monthly', lastmod: LAST_BUILD },
    { loc: '/blog.html', priority: '0.9', changefreq: 'weekly', lastmod: LAST_BUILD },
    { loc: '/chinese-zodiac-years.html', priority: '0.8', changefreq: 'monthly', lastmod: LAST_BUILD },
    { loc: '/love-match.html', alt: '/zh/love-match.html', priority: '0.9', changefreq: 'monthly', lastmod: LAST_BUILD },
    { loc: '/palm-reading.html', alt: '/zh/palm-reading.html', priority: '0.8', changefreq: 'monthly', lastmod: LAST_BUILD },
    { loc: '/leaderboard.html', priority: '0.8', changefreq: 'daily', lastmod: LAST_BUILD },
    { loc: '/faq.html', priority: '0.8', changefreq: 'monthly', lastmod: LAST_BUILD },
    { loc: '/pricing.html', priority: '0.8', changefreq: 'monthly', lastmod: LAST_BUILD },
    { loc: '/methodology.html', priority: '0.8', changefreq: 'monthly', lastmod: LAST_BUILD },
    { loc: '/test-cases.html', priority: '0.8', changefreq: 'monthly', lastmod: LAST_BUILD },
    { loc: '/about.html', priority: '0.5', changefreq: 'monthly', lastmod: LAST_BUILD },
    { loc: '/editorial-policy.html', priority: '0.3', changefreq: 'yearly', lastmod: LAST_BUILD },
    { loc: '/privacy-policy.html', priority: '0.3', changefreq: 'yearly', lastmod: LAST_BUILD },
    { loc: '/terms-of-service.html', priority: '0.3', changefreq: 'yearly', lastmod: LAST_BUILD },
    { loc: '/zh', alt: '/', priority: '0.9', changefreq: 'weekly', lastmod: LAST_BUILD },
    { loc: '/zh/calculator.html', alt: '/calculator.html', priority: '0.9', changefreq: 'monthly', lastmod: LAST_BUILD },
    { loc: '/zh/love-match.html', alt: '/love-match.html', priority: '0.9', changefreq: 'monthly', lastmod: LAST_BUILD },
    { loc: '/zh/palm-reading.html', alt: '/palm-reading.html', priority: '0.8', changefreq: 'monthly', lastmod: LAST_BUILD },
  ];
  for (const p of posts) {
    urls.push({
      loc: `/${p.id}.html`,
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: blogDates.get(p.id) || LAST_BUILD,
    });
  }
  for (const p of pages) {
    if (!urls.some((u) => u.loc === `/${p.id}.html`))
    urls.push({ loc: `/${p.id}.html`, priority: '0.5', changefreq: 'monthly', lastmod: LAST_BUILD });
  }
  for (const d of destinyEn) {
    urls.push({ loc: `/${d.slug}.html`, alt: `/zh/${d.slug}.html`, priority: '0.7', changefreq: 'yearly', lastmod: LAST_BUILD });
    urls.push({ loc: `/zh/${d.slug}.html`, alt: `/${d.slug}.html`, priority: '0.7', changefreq: 'yearly', lastmod: LAST_BUILD });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map((u) => {
    const isZh = u.loc.startsWith('/zh');
    const enLoc = isZh ? u.alt! : u.loc;
    const zhLoc = isZh ? u.loc : u.alt;
    return `  <url>
    <loc>${SITE}${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${zhLoc ? `
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${enLoc}"/>
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="${SITE}${zhLoc}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${enLoc}"/>` : ''}
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
};
