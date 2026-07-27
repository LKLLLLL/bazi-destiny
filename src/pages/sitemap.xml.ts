import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import destinyEn from '../data/destiny-en.json';

const SITE = 'https://mybazidestiny.com';
const LASTMOD = '2026-07-27';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  const pages = await getCollection('pages');

  const urls: { loc: string; alt?: string; priority: string }[] = [
    { loc: '/', alt: '/zh/', priority: '1.0' },
    { loc: '/blog.html', priority: '0.9' },
    { loc: '/love-match.html', priority: '0.9' },
    { loc: '/leaderboard.html', priority: '0.8' },
    { loc: '/faq.html', priority: '0.8' },
    { loc: '/about.html', priority: '0.5' },
    { loc: '/editorial-policy.html', priority: '0.3' },
    { loc: '/privacy-policy.html', priority: '0.3' },
    { loc: '/terms-of-service.html', priority: '0.3' },
    { loc: '/zh/', alt: '/', priority: '0.9' },
  ];
  for (const p of posts) urls.push({ loc: `/${p.id}.html`, priority: '0.8' });
  for (const p of pages) {
    if (!urls.some((u) => u.loc === `/${p.id}.html`)) urls.push({ loc: `/${p.id}.html`, priority: '0.5' });
  }
  for (const d of destinyEn) {
    urls.push({ loc: `/${d.slug}.html`, alt: `/zh/${d.slug}.html`, priority: '0.7' });
    urls.push({ loc: `/zh/${d.slug}.html`, alt: `/${d.slug}.html`, priority: '0.7' });
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
    <lastmod>${LASTMOD}</lastmod>
    <priority>${u.priority}</priority>${zhLoc ? `
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${enLoc}"/>
    <xhtml:link rel="alternate" hreflang="zh" href="${SITE}${zhLoc}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${enLoc}"/>` : ''}
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
};
