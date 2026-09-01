#!/usr/bin/env node
// Generates sitemap.xml, robots.txt, feed.xml into dist/ after the SSG build,
// and ensures a 404.html exists. Run via `npm run build`.
import { readFileSync, writeFileSync, readdirSync, existsSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const blogDir = resolve(root, 'content/blog');
const SITE = 'https://transferringup.com';
const now = new Date().toISOString();

function parseFm(raw) {
  const m = /^---\s*\n([\s\S]*?)\n---/.exec(raw);
  const data = { title: '', description: '', date: '' };
  if (!m) return data;
  for (const line of m[1].split('\n')) {
    const kv = /^(\w+):\s*(.*)$/.exec(line.trim());
    if (!kv) continue;
    if (kv[1] in data) data[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return data;
}

const posts = existsSync(blogDir)
  ? readdirSync(blogDir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => ({ slug: f.replace(/\.md$/, ''), ...parseFm(readFileSync(resolve(blogDir, f), 'utf8')) }))
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  : [];

const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'monthly' },
  { loc: '/about', priority: '0.8', changefreq: 'monthly' },
  { loc: '/services', priority: '0.8', changefreq: 'monthly' },
  { loc: '/results', priority: '0.8', changefreq: 'monthly' },
  { loc: '/reviews', priority: '0.8', changefreq: 'monthly' },
  { loc: '/faq', priority: '0.7', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.8', changefreq: 'monthly' },
  { loc: '/careers', priority: '0.7', changefreq: 'monthly' },
  { loc: '/blog', priority: '0.8', changefreq: 'weekly' },
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// sitemap.xml
const urls = [
  // Trailing-slash loc to match the canonical URL each page actually serves at
  // (Netlify serves /results/ and 301s /results → /results/). A redirect-free
  // sitemap = cleaner crawl + indexing signals.
  ...staticPages.map(
    (p) => `  <url>\n    <loc>${SITE}${p.loc === '/' ? '/' : p.loc + '/'}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
  ),
  ...posts.map(
    (p) => `  <url>\n    <loc>${SITE}/blog/${p.slug}/</loc>\n    <lastmod>${p.date ? new Date(p.date).toISOString() : now}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`
  ),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
writeFileSync(resolve(dist, 'sitemap.xml'), sitemap);

// robots.txt — crawl everything public; only the client-only app routes
// (which have no prerendered content) are excluded. AI/LLM crawlers are
// explicitly welcomed for answer-engine citation (AEO). Keep this string in
// sync with public/robots.txt.
const aiCrawlers = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Bytespider',
];
const aiCrawlerBlocks = aiCrawlers.map((ua) => `User-agent: ${ua}\nAllow: /`).join('\n\n');
writeFileSync(
  resolve(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n\n# Private app routes (no public content)\nDisallow: /portal/\nDisallow: /submit-review\nDisallow: /admin/\n\n# AI / LLM reference: ${SITE}/llms.txt\n\n# AI / LLM crawlers — explicitly welcomed for answer-engine citation (AEO)\n${aiCrawlerBlocks}\n\nSitemap: ${SITE}/sitemap.xml\n`
);

// feed.xml (RSS 2.0)
const items = posts
  .map(
    (p) => `    <item>\n      <title>${esc(p.title)}</title>\n      <link>${SITE}/blog/${p.slug}</link>\n      <guid>${SITE}/blog/${p.slug}</guid>\n      <description>${esc(p.description)}</description>\n      <pubDate>${p.date ? new Date(p.date).toUTCString() : new Date().toUTCString()}</pubDate>\n    </item>`
  )
  .join('\n');
const feed = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>TransferringUP Blog</title>\n    <link>${SITE}/blog</link>\n    <description>Expert guides on college transfer admissions.</description>\n    <language>en-us</language>\n    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n${items}\n  </channel>\n</rss>\n`;
writeFileSync(resolve(dist, 'feed.xml'), feed);

// Ensure 404.html exists (Netlify serves it with a real 404 status).
// Prefer the prerendered /404 page; fall back to the homepage shell.
const notFound = resolve(dist, '404.html');
const prerendered404 = resolve(dist, '404/index.html');
if (existsSync(prerendered404)) {
  copyFileSync(prerendered404, notFound);
} else if (!existsSync(notFound)) {
  const fallback = resolve(dist, 'index.html');
  if (existsSync(fallback)) copyFileSync(fallback, notFound);
}

console.log(
  `[postbuild] sitemap (${staticPages.length + posts.length} urls), robots.txt, feed.xml (${posts.length} items)${existsSync(notFound) ? ', 404.html' : ''}`
);
