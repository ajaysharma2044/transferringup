import { marked } from 'marked';

export type BlogFrontmatter = {
  title: string;
  description: string;
  date: string;
  author: string;
  image: string;
  imageCredit?: string;
  tags: string[];
  // SEO (all optional — set from the CMS "SEO & social" fields)
  metaTitle?: string;
  canonical?: string;
  ogImage?: string;
  focusKeyword?: string;
  draft?: boolean;
};

export type MdBlogPost = BlogFrontmatter & {
  slug: string;
  html: string;
  readingMinutes: number;
  toc: { id: string; text: string; level: number }[];
};

// Raw markdown loaded at build (and bundled for hydration) from /content/blog.
const RAW = import.meta.glob('/content/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function slugFromPath(path: string) {
  return path.split('/').pop()!.replace(/\.md$/, '');
}

const SCALAR_KEYS = [
  'title',
  'description',
  'date',
  'author',
  'image',
  'imageCredit',
  'metaTitle',
  'canonical',
  'ogImage',
  'focusKeyword',
];

const unquote = (v: string) => v.replace(/^["']|["']$/g, '');

/**
 * Buffer-free YAML-frontmatter parser (the raw markdown is bundled to the
 * client, so we can't use gray-matter). Handles the subset the Decap CMS
 * writes: scalars, booleans, inline lists (`[a, b]`) and block lists
 * (`tags:\n  - a\n  - b`).
 */
function parseFrontmatter(raw: string): { data: BlogFrontmatter; body: string } {
  const data: BlogFrontmatter = {
    title: '',
    description: '',
    date: '',
    author: 'Ajay',
    image: '',
    tags: [],
  };
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data, body: raw };

  const [, fm, body] = match;
  const lines = fm.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const kv = /^([A-Za-z][\w]*):\s*(.*)$/.exec(lines[i]);
    if (!kv) continue;
    const key = kv[1];
    const value = kv[2].trim();

    if (key === 'tags') {
      if (value.startsWith('[')) {
        data.tags = value
          .replace(/^\[|\]$/g, '')
          .split(',')
          .map((t) => unquote(t.trim()))
          .filter(Boolean);
      } else {
        const items: string[] = [];
        while (i + 1 < lines.length && /^\s*-\s+/.test(lines[i + 1])) {
          items.push(unquote(lines[++i].replace(/^\s*-\s+/, '').trim()));
        }
        data.tags = items.filter(Boolean);
      }
    } else if (key === 'draft') {
      data.draft = /^true$/i.test(unquote(value));
    } else if (SCALAR_KEYS.includes(key)) {
      (data as unknown as Record<string, string>)[key] = unquote(value);
    }
  }
  return { data, body };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function renderMarkdown(body: string) {
  const toc: { id: string; text: string; level: number }[] = [];
  const renderer = new marked.Renderer();
  renderer.heading = ({ tokens, depth }) => {
    const text = tokens
      .map((t) => ('text' in t ? (t as { text: string }).text : ''))
      .join('');
    const id = slugify(text);
    if (depth === 2 || depth === 3) toc.push({ id, text, level: depth });
    return `<h${depth} id="${id}">${text}</h${depth}>`;
  };
  const html = marked.parse(body, { renderer, async: false }) as string;
  return { html, toc };
}

let cache: MdBlogPost[] | null = null;

function buildAll(): MdBlogPost[] {
  if (cache) return cache;
  const posts = Object.entries(RAW).map(([path, raw]) => {
    const slug = slugFromPath(path);
    const { data, body } = parseFrontmatter(raw);
    const { html, toc } = renderMarkdown(body);
    const words = body.split(/\s+/).filter(Boolean).length;
    return {
      ...data,
      slug,
      html,
      toc,
      readingMinutes: Math.max(1, Math.round(words / 200)),
    };
  });
  // Drafts are visible while developing locally, hidden from the live build.
  const visible = import.meta.env.PROD ? posts.filter((p) => !p.draft) : posts;
  visible.sort((a, b) => (a.date < b.date ? 1 : -1));
  cache = visible;
  return visible;
}

export function getAllPosts(): MdBlogPost[] {
  return buildAll();
}

export function getAllSlugs(): string[] {
  return buildAll().map((p) => p.slug);
}

export function getPostBySlug(slug: string): MdBlogPost | undefined {
  return buildAll().find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, count = 3): MdBlogPost[] {
  const all = buildAll();
  const current = all.find((p) => p.slug === slug);
  if (!current) return all.slice(0, count);
  const scored = all
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((s) => s.post);
}
