/* Full SEO/GEO/AEO audit report for transferringup.com — DOCX (docx-js). */
const fs = require('fs');
const os = require('os');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, Header, Footer,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak,
} = require('docx');

const NAVY = '1B2A4A', BLUE = '2563EB', GREEN = '16A34A', AMBER = 'D97706', RED = 'DC2626',
  ORANGE = 'EA580C', ROWALT = 'F8F9FA', BORDER = 'E2E8F0', INK = '1E293B', LIGHTBLUE = 'EFF6FF',
  GREENBG = 'F0FDF4';
const CW = 9360;
const A = (t, o = {}) => new TextRun({ text: t, font: 'Arial', ...o });

const noBorders = { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } };
const thinBorders = { top: { style: BorderStyle.SINGLE, size: 2, color: BORDER }, bottom: { style: BorderStyle.SINGLE, size: 2, color: BORDER }, left: { style: BorderStyle.SINGLE, size: 2, color: BORDER }, right: { style: BorderStyle.SINGLE, size: 2, color: BORDER } };

const cell = (children, w, opts = {}) => new TableCell({
  width: { size: w, type: WidthType.DXA },
  margins: { top: 90, bottom: 90, left: 120, right: 120 },
  verticalAlign: VerticalAlign.CENTER,
  shading: opts.fill ? { type: ShadingType.CLEAR, fill: opts.fill } : undefined,
  borders: opts.borders || thinBorders,
  children: Array.isArray(children) ? children : [children],
});
const p = (runs, o = {}) => new Paragraph({ children: Array.isArray(runs) ? runs : [runs], ...o });
const h1 = (t) => p(A(t, { bold: true, size: 48, color: NAVY }), { spacing: { before: 360, after: 160 } });
const h2 = (t) => p(A(t, { bold: true, size: 36, color: BLUE }), { spacing: { before: 280, after: 120 } });
const body = (t, o = {}) => p(A(t, { size: 22, color: INK, ...o }), { spacing: { after: 100, line: 300 } });

const statusFill = (s) => (s === 'Good' ? GREEN : s === 'Fixed' ? GREEN : s === 'Needs Attention' ? AMBER : RED);
const findingsTable = (rows) => new Table({
  width: { size: CW, type: WidthType.DXA }, columnWidths: [2300, 5260, 1800],
  rows: [
    new TableRow({ tableHeader: true, children: [
      cell(p(A('Signal', { bold: true, color: 'FFFFFF', size: 20 })), 2300, { fill: NAVY }),
      cell(p(A('Finding', { bold: true, color: 'FFFFFF', size: 20 })), 5260, { fill: NAVY }),
      cell(p(A('Status', { bold: true, color: 'FFFFFF', size: 20 }), { alignment: AlignmentType.CENTER }), 1800, { fill: NAVY }),
    ]}),
    ...rows.map(([sig, find, status], i) => new TableRow({ children: [
      cell(p(A(sig, { bold: true, size: 20, color: INK })), 2300, { fill: i % 2 ? ROWALT : 'FFFFFF' }),
      cell(p(A(find, { size: 20, color: INK })), 5260, { fill: i % 2 ? ROWALT : 'FFFFFF' }),
      cell(p(A(status, { bold: true, size: 19, color: 'FFFFFF' }), { alignment: AlignmentType.CENTER }), 1800, { fill: statusFill(status) }),
    ]})),
  ],
});

/* ------------------------ cover ------------------------ */
const coverCell = (label, score, status, fill) => cell([
  p(A(label, { bold: true, size: 20, color: 'FFFFFF' }), { alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
  p(A(String(score), { bold: true, size: 72, color: 'FFFFFF' }), { alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
  p(A(status, { italics: true, size: 18, color: 'FFFFFF' }), { alignment: AlignmentType.CENTER }),
], 3120, { fill, borders: noBorders });

const navyP = (t = '', o = {}) => new Paragraph({ shading: { type: ShadingType.CLEAR, fill: NAVY }, children: t ? [A(t, o.run || {})] : [], ...o.par });

const cover = [
  ...Array.from({ length: 7 }, () => navyP(' ', { par: { spacing: { after: 240 } } })),
  navyP('transferringup.com', { run: { bold: true, size: 72, color: 'FFFFFF' }, par: { alignment: AlignmentType.CENTER, spacing: { after: 200 } } }),
  navyP('SEO / GEO / AEO Audit Report', { run: { size: 36, color: '93C5FD' }, par: { alignment: AlignmentType.CENTER, spacing: { after: 120 } } }),
  navyP('FULL AUDIT', { run: { bold: true, size: 22, color: 'FFFFFF' }, par: { alignment: AlignmentType.CENTER, spacing: { after: 400 } } }),
  new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [3120, 3120, 3120], rows: [ new TableRow({ children: [
    coverCell('SEO', '9/10', 'Strong', GREEN),
    coverCell('GEO', '8/10', 'Strong', GREEN),
    coverCell('AEO', '8/10', 'Strong', GREEN),
  ]})]}),
  ...Array.from({ length: 6 }, () => navyP(' ', { par: { spacing: { after: 240 } } })),
  navyP('Audit date: July 1, 2026', { run: { size: 18, color: '94A3B8' }, par: { alignment: AlignmentType.CENTER, spacing: { after: 60 } } }),
  navyP('Claude Skill and Plugin by Alex Labat', { run: { size: 18, color: '94A3B8' }, par: { alignment: AlignmentType.CENTER } }),
];

/* ------------------------ pages audited ------------------------ */
const pages = [
  ['/', 'Homepage', 'Rich schema; counters prerendered 0.0 — FIXED during audit'],
  ['/about/', 'About / Team', '13 named team members with credentials; strong E-E-A-T'],
  ['/services/', 'Services', '8 service H2s + 16-question FAQ w/ schema'],
  ['/results/', 'Results', 'Stats read 0.0/0 to crawlers — FIXED during audit'],
  ['/reviews/', 'Reviews', 'BBB-verified reviews visible + third-party Review schema'],
  ['/faq/', 'FAQ', '15/16 answers hidden from DOM — FIXED during audit'],
  ['/contact/', 'Contact', 'NAP partial (no address) — footer address added during audit'],
  ['/careers/', 'Careers', 'Indexable, adequate'],
  ['/blog/', 'Blog index', '11 posts, dates shown, no author bylines'],
  ['/blog/is-transferringup-legit…/', 'Reputation article', 'BBB + $400 clarification present; ~1,850 words'],
  ['/blog/is-transferringup-worth-it/', 'Reputation article', 'Cost/value objection handling'],
  ['robots.txt', 'Crawl directives', 'AI crawlers explicitly welcomed; sitemap linked'],
  ['sitemap.xml', 'Sitemap', '20 URLs, lastmod present, canonical-consistent'],
  ['llms.txt', 'AI crawler file', 'BBB accreditation + trust FAQ + key pages'],
];
const pagesTable = new Table({
  width: { size: CW, type: WidthType.DXA }, columnWidths: [2900, 1900, 4560],
  rows: [
    new TableRow({ tableHeader: true, children: [
      cell(p(A('URL', { bold: true, color: 'FFFFFF', size: 20 })), 2900, { fill: NAVY }),
      cell(p(A('Page Type', { bold: true, color: 'FFFFFF', size: 20 })), 1900, { fill: NAVY }),
      cell(p(A('Notes', { bold: true, color: 'FFFFFF', size: 20 })), 4560, { fill: NAVY }),
    ]}),
    ...pages.map(([u, t, n], i) => new TableRow({ children: [
      cell(p(A(u, { size: 19, color: INK })), 2900, { fill: i % 2 ? ROWALT : 'FFFFFF' }),
      cell(p(A(t, { size: 19, color: INK })), 1900, { fill: i % 2 ? ROWALT : 'FFFFFF' }),
      cell(p(A(n, { size: 19, color: INK })), 4560, { fill: i % 2 ? ROWALT : 'FFFFFF' }),
    ]})),
  ],
});

/* ------------------------ priority matrix ------------------------ */
const prio = [
  ['Critical', 'Verify site in Google Search Console, submit sitemap.xml, Request Indexing on /, /reviews/, /faq/ and both reputation articles. Nothing re-ranks or refreshes the AI Overview until Google re-crawls.', 'All', 'Low (~30 min)', 'Massive', RED],
  ['Critical', 'Stat counters prerendered as "0.0 / 0" — crawlers read "0.0 average rating". FIXED + deployed during this audit.', 'GEO', 'Done', 'High', RED],
  ['High', 'FAQ accordion answers absent from DOM (schema/content mismatch). FIXED + deployed during this audit.', 'AEO', 'Done', 'High', ORANGE],
  ['High', 'Privacy Policy & Terms pages do not exist (footer shows dead text). Required by Meta/Google ad policies and a Google trust signal.', 'SEO', 'Medium', 'High', ORANGE],
  ['Medium', 'Add author bylines + Person schema (with credentials) to blog posts; link author to the About page entity.', 'GEO', 'Medium', 'Medium', AMBER],
  ['Medium', 'Create a Google Business Profile and gather reviews on a second third-party platform (e.g. Trustpilot) to corroborate the BBB signal.', 'GEO', 'Medium', 'High', AMBER],
  ['Quick Win', 'Add video testimonials (real students, named schools) — the strongest counter to "AI-generated feedback" claims; AI Overviews increasingly cite video.', 'GEO', 'Medium', 'High', GREEN],
  ['Quick Win', 'Alt-text sweep on decorative/campus images; ensure descriptive alts on team headshots and acceptance-letter images.', 'SEO', 'Low', 'Low', GREEN],
];
const prioTable = new Table({
  width: { size: CW, type: WidthType.DXA }, columnWidths: [1400, 4560, 1000, 1200, 1200],
  rows: [
    new TableRow({ tableHeader: true, children: ['Priority', 'Issue', 'Dim.', 'Effort', 'Impact'].map((t, i) =>
      cell(p(A(t, { bold: true, color: 'FFFFFF', size: 20 })), [1400, 4560, 1000, 1200, 1200][i], { fill: NAVY })) }),
    ...prio.map(([pr, issue, dim, eff, imp, fill], i) => new TableRow({ children: [
      cell(p(A(pr, { bold: true, size: 19, color: 'FFFFFF' }), { alignment: AlignmentType.CENTER }), 1400, { fill }),
      cell(p(A(issue, { size: 19, color: INK })), 4560, { fill: i % 2 ? ROWALT : 'FFFFFF' }),
      cell(p(A(dim, { size: 19, color: INK }), { alignment: AlignmentType.CENTER }), 1000, { fill: i % 2 ? ROWALT : 'FFFFFF' }),
      cell(p(A(eff, { size: 19, color: INK }), { alignment: AlignmentType.CENTER }), 1200, { fill: i % 2 ? ROWALT : 'FFFFFF' }),
      cell(p(A(imp, { size: 19, color: INK }), { alignment: AlignmentType.CENTER }), 1200, { fill: i % 2 ? ROWALT : 'FFFFFF' }),
    ]})),
  ],
});

/* ------------------------ working well ------------------------ */
const wins = [
  'llms.txt is exemplary: leads with BBB A- accreditation, independently verified reviews, a trust FAQ (including the $400 clarification), and links to every key page — exactly what AI crawlers need.',
  'Reviews modeled as independent third-party Review nodes with the Better Business Bureau as publisher — a rare, high-trust schema pattern that directly counters "fake reviews" narratives.',
  'Unique, keyword-targeted titles and meta descriptions on every page; self-referential trailing-slash canonicals that match the sitemap exactly.',
  'Reputation content strategy in place: "Is TransferringUP Legit?" and "Is It Worth It?" own the doubt queries with honest, specific answers (~1,850 words each).',
  'robots.txt explicitly welcomes 11 AI/LLM crawlers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended…) while cleanly blocking private app routes.',
  'Deep E-E-A-T: 13 named team members with schools, GPAs, and outcomes; founder story with verifiable specifics (2.9 GPA → Cornell).',
  'SiteNavigationElement + BreadcrumbList + FAQPage + Organization schema stack, all entity-merged via a stable @id.',
];
const winsTable = new Table({
  width: { size: CW, type: WidthType.DXA }, columnWidths: [CW],
  rows: wins.map((w) => new TableRow({ children: [cell(p([A('✓  ', { bold: true, color: GREEN, size: 20 }), A(w, { size: 20, color: INK })]), CW, { fill: GREENBG })] })),
});

/* ------------------------ exec summary ------------------------ */
const execBox = new Table({
  width: { size: CW, type: WidthType.DXA }, columnWidths: [CW],
  rows: [new TableRow({ children: [cell([
    p(A('transferringup.com enters this audit with an unusually strong technical and trust foundation: clean indexable pages, a 20-URL canonical-consistent sitemap, a deep structured-data stack (Organization entity with BBB A- accreditation, third-party-verified Review nodes, FAQPage, SiteNavigationElement), and an exemplary llms.txt for AI crawlers. The audit surfaced two crawler-visible content defects that were quietly sabotaging the GEO/AEO work: the animated stat counters prerendered as "0.0 / 0" (so crawlers and AI engines read "0.0 average rating" and "0 Top-30 acceptances"), and the FAQ accordion omitted 15 of 16 answers from the HTML entirely, creating a schema/content mismatch. Both were fixed and deployed during this audit. The single remaining bottleneck is external: the new pages and fixes are invisible to Google until it re-crawls — verify Google Search Console, submit the sitemap, and Request Indexing on the key URLs. Beyond that, the largest opportunities are real Privacy/Terms pages, blog author schema, a Google Business Profile, and video testimonials.', { size: 21, color: INK })),
  ], CW, { fill: LIGHTBLUE, borders: noBorders })] })],
});
const scoreRow = (dim, score, status, take, fill, i) => new TableRow({ children: [
  cell(p(A(dim, { bold: true, size: 20, color: INK })), 1500, { fill: i % 2 ? ROWALT : 'FFFFFF' }),
  cell(p(A(score, { bold: true, size: 20, color: 'FFFFFF' }), { alignment: AlignmentType.CENTER }), 1300, { fill }),
  cell(p(A(status, { size: 20, color: INK }), { alignment: AlignmentType.CENTER }), 1800, { fill: i % 2 ? ROWALT : 'FFFFFF' }),
  cell(p(A(take, { size: 20, color: INK })), 4760, { fill: i % 2 ? ROWALT : 'FFFFFF' }),
]});
const scoresTable = new Table({
  width: { size: CW, type: WidthType.DXA }, columnWidths: [1500, 1300, 1800, 4760],
  rows: [
    new TableRow({ tableHeader: true, children: ['Dimension', 'Score', 'Status', 'Key Takeaway'].map((t, i) =>
      cell(p(A(t, { bold: true, color: 'FFFFFF', size: 20 })), [1500, 1300, 1800, 4760][i], { fill: NAVY })) }),
    scoreRow('SEO', '9/10', 'Strong', 'Technically clean site-wide; only Privacy/Terms and image alts remain.', GREEN, 0),
    scoreRow('GEO', '8/10', 'Strong', '0.0-counter bug fixed; entity + llms.txt excellent; add GBP + video.', GREEN, 1),
    scoreRow('AEO', '8/10', 'Strong', 'FAQ answers now crawler-visible; 16-question FAQPage schema on two pages.', GREEN, 2),
    scoreRow('Combined', '25/30', '', '', NAVY, 3),
  ],
});

/* ------------------------ analysis sections ------------------------ */
const seoTech = findingsTable([
  ['Title tags', 'Unique and keyword-targeted on all 13 pages; e.g. "TransferringUP Reviews: BBB-Verified Client Ratings" (48 chars).', 'Good'],
  ['Meta descriptions', 'Present and rewritten on all pages; homepage leads with the 2.9→Cornell story and BBB/5.0 trust close.', 'Good'],
  ['Heading hierarchy', 'Single H1 per page; descriptive H2/H3 structure throughout (8 service H2s, question-phrased blog H2s).', 'Good'],
  ['Canonical / URLs', 'Self-referential trailing-slash canonicals; non-slash 301s to slash; sitemap locs match exactly.', 'Good'],
  ['Robots / indexability', 'index,follow on all public pages; portal/admin/submit-review correctly blocked; /get-started deliberately noindex.', 'Good'],
  ['Sitemap', '20 URLs with lastmod; referenced from robots.txt; regenerated on every build.', 'Good'],
  ['OG / Twitter cards', 'og:title, og:description, og:image, twitter:card present on every page.', 'Good'],
  ['Privacy / Terms', 'Footer displays "Privacy Policy · Terms of Service" as plain text; pages do not exist. Ad-platform compliance risk (Meta/Google) and a missing trust signal.', 'Missing'],
  ['Image alt text', 'Team/campus images generally carry alts; a full sweep was not possible for every asset — spot-check decorative images.', 'Needs Attention'],
]);
const seoContent = findingsTable([
  ['Content depth', 'Homepage ~3,400 words; reputation articles ~1,850 words each; services ~1,200. Well above thresholds.', 'Good'],
  ['Freshness', 'Blog posts dated (May–Jun 2026); sitemap lastmod current; new reputation content added Jun 2026.', 'Good'],
  ['Internal linking', 'Dense: primary nav (Reviews promoted), footer (FAQ added), in-article contextual links between legit/worth-it/reviews/results.', 'Good'],
  ['Author signals', 'Blog posts show "Ajay" + date but no byline credentials or author schema linking to the founder entity.', 'Needs Attention'],
]);
const seoSchema = findingsTable([
  ['Organization', 'Entity-merged via @id; BBB A- as award + hasCredential (recognizedBy: BBB); address; aggregateRating 5.0/9; sameAs → LinkedIn + BBB profile.', 'Good'],
  ['Review nodes', '9 reviews as standalone @graph Review nodes (itemReviewed → org); 5 carry publisher: Better Business Bureau.', 'Good'],
  ['FAQPage', '16 Q&As on /services and /faq, including reputation questions ("Is TransferringUP legit?", "$400 package").', 'Good'],
  ['Navigation / Breadcrumbs', 'SiteNavigationElement (7 items, Reviews at position 2) on every page; BreadcrumbList on inner pages.', 'Good'],
]);
const geoEeat = findingsTable([
  ['Named experts', '13 team members with roles, schools, GPAs and outcomes; founder story with verifiable specifics.', 'Good'],
  ['Contact / NAP', 'Email + phone site-wide; visible address was missing — "Concord, NC" added to footer during audit (schema already had it).', 'Fixed'],
  ['Trust signals', 'BBB A- seal + rating lockup, 5.0 verified rating badge, named-school results ledger.', 'Good'],
  ['Entity graph', 'sameAs → LinkedIn + BBB; consistent brand naming ("TransferringUP" / "Transferring Up") declared via alternateName.', 'Good'],
]);
const geoSynth = findingsTable([
  ['Factual density', 'Results ledger pairs starting GPA → named admits (e.g. "3.0 HS GPA → Cornell, Emory, BU, Michigan…"). Highly citable.', 'Good'],
  ['Stat counters', 'PRERENDERED AS ZERO: crawlers read "0.0 Lowest GPA", "0 Top-30 acceptances", "0.0 ★ average rating". Fixed: HTML now carries final values (2.8, 5.0★); animation preserved for humans.', 'Fixed'],
  ['Misinformation counter', '"$400 package" clarification stated as verifiable fact on the legit article, FAQ schema, and llms.txt.', 'Good'],
  ['llms.txt', 'Leads with BBB accreditation + independently-verified reviews; includes trust FAQ and key-page map.', 'Good'],
  ['AI crawler access', 'robots.txt explicitly allows GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot + 5 more.', 'Good'],
  ['Third-party corroboration', 'Only one external review platform (BBB). Add Google Business Profile + a second platform; add video testimonials.', 'Needs Attention'],
]);
const aeoSnippets = findingsTable([
  ['Direct answers', 'FAQ answers are 40–80 word direct responses ("Yes. TransferringUP is a Better Business Bureau Accredited Business…").', 'Good'],
  ['Question headings', 'Blog H2s use natural question phrasing ("Can you transfer with a low GPA?", "Is TransferringUP legit?").', 'Good'],
  ['List / table content', 'Results ledger and service breakdowns are list-structured and snippet-eligible.', 'Good'],
]);
const aeoFormats = findingsTable([
  ['FAQ schema ↔ content', 'CRITICAL MISMATCH FOUND: accordion rendered answers only when open — 15 of 16 answers absent from HTML while schema promised them. Fixed: all answers now always in the DOM (CSS-collapsed).', 'Fixed'],
  ['HowTo / Speakable', 'Not present. Low priority; consider HowTo on the timeline guide.', 'Needs Attention'],
  ['Voice / long-tail', 'Conversational Q&A coverage of who/what/how/cost/legitimacy queries is broad.', 'Good'],
]);

/* ------------------------ glossary ------------------------ */
const glossary = [
  ['SEO', 'Search Engine Optimization — making pages rank in traditional Google results: titles, content, links, technical health.'],
  ['GEO', 'Generative Engine Optimization — making AI engines (Google AI Overviews, ChatGPT, Perplexity) understand, trust, and cite your brand: entity data, verifiable facts, third-party corroboration, llms.txt.'],
  ['AEO', 'Answer Engine Optimization — winning featured snippets, People Also Ask, and voice answers: direct-answer paragraphs, FAQ/HowTo schema, question-phrased headings.'],
];
const glossTable = new Table({
  width: { size: CW, type: WidthType.DXA }, columnWidths: [1400, 7960],
  rows: glossary.map(([t, d], i) => new TableRow({ children: [
    cell(p(A(t, { bold: true, size: 20, color: NAVY })), 1400, { fill: i % 2 ? ROWALT : 'FFFFFF' }),
    cell(p(A(d, { size: 20, color: INK })), 7960, { fill: i % 2 ? ROWALT : 'FFFFFF' }),
  ]})),
});

/* ------------------------ document ------------------------ */
const header = new Header({ children: [new Paragraph({
  tabStops: [{ type: 'right', position: CW }],
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: NAVY, space: 4 } },
  children: [A('transferringup.com', { size: 18, color: INK }), new TextRun({ text: '\tSEO / GEO / AEO Audit Report', font: 'Arial', size: 18, color: INK })],
})]});
const footer = new Footer({ children: [new Paragraph({
  tabStops: [{ type: 'right', position: CW }],
  border: { top: { style: BorderStyle.SINGLE, size: 4, color: BORDER, space: 4 } },
  children: [A('Claude Skill and Plugin by Alex Labat', { size: 16, color: '64748B' }), new TextRun({ text: '\t', font: 'Arial' }), new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 16, color: '64748B' })],
})]});

const doc = new Document({
  sections: [
    { properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } }, children: cover },
    {
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      headers: { default: header }, footers: { default: footer },
      children: [
        h1('Executive Summary'), execBox, p(A(' ', {})), scoresTable,
        h1('Pages Audited'), pagesTable,
        new Paragraph({ children: [new PageBreak()] }),
        h1('SEO Analysis — 9/10'),
        h2('Technical On-Page'), seoTech,
        h2('Content Quality'), seoContent,
        h2('Structured Data'), seoSchema,
        new Paragraph({ children: [new PageBreak()] }),
        h1('GEO Analysis — 8/10'),
        h2('E-E-A-T Assessment'), geoEeat,
        h2('Content for AI Synthesis'), geoSynth,
        new Paragraph({ children: [new PageBreak()] }),
        h1('AEO Analysis — 8/10'),
        h2('Featured Snippet Eligibility'), aeoSnippets,
        h2('Structured Answer Formats & Voice'), aeoFormats,
        new Paragraph({ children: [new PageBreak()] }),
        h1('Priority Recommendations'), prioTable,
        h1("What's Working Well"), winsTable,
        h1('Glossary'), glossTable,
        body('Note: Core Web Vitals, real page speed, and backlink profile require external tools (Google PageSpeed Insights at pagespeed.web.dev; GSC for coverage and links) and are outside the scope of an HTML-fetch audit.', { italics: true, size: 19 }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  const out = os.homedir() + '/Downloads/seo-audit-transferringup-com-2026-07-01.docx';
  fs.writeFileSync(out, buf);
  console.log('WROTE', out, (buf.length / 1024).toFixed(0) + ' KB');
});
