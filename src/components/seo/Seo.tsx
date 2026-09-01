import { Head } from 'vite-react-ssg';
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  organizationSchema,
  siteNavigationSchema,
} from '../../lib/schema';

type SeoProps = {
  title: string;
  description: string;
  /** Path beginning with "/", combined with SITE_URL for canonical + og:url. */
  path: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  /** Absolute URL override for <link rel="canonical">. */
  canonical?: string;
  /** Extra JSON-LD blocks (Organization is always included). */
  jsonLd?: object[];
  /** Keep this page out of search results (utility pages like 404). */
  noindex?: boolean;
};

export default function Seo({
  title,
  description,
  path,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  canonical,
  jsonLd = [],
  noindex = false,
}: SeoProps) {
  // Pages are served at a trailing-slash path (e.g. /results/), so the canonical
  // and og:url use the same trailing-slash form, self-referential, no redirect.
  const url = `${SITE_URL}${path === '/' ? '' : path.endsWith('/') ? path : path + '/'}`;
  const canonicalUrl = canonical || url;
  // og:image must be absolute, prefix the site URL for root-relative paths.
  const ogImageUrl = ogImage?.startsWith('/') ? `${SITE_URL}${ogImage}` : ogImage || DEFAULT_OG_IMAGE;
  const blocks = [organizationSchema(), siteNavigationSchema(), ...jsonLd];

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Head>
  );
}
