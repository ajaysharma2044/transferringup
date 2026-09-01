import Seo from '../components/seo/Seo';
import { Reveal, TU } from '../components/home/shared';
import { SectionHeader } from '../components/shared/ui';
import { getAllPosts } from '../lib/mdblog';
import { breadcrumbSchema } from '../lib/schema';
import NewsletterSignup from '../components/shared/NewsletterSignup';

function formatDate(d: string) {
  const date = new Date(d);
  return Number.isNaN(date.getTime())
    ? d
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <Seo
        title="Transfer Admissions Blog & Guides | TransferringUP"
        description="Expert guides on college transfer admissions: how to transfer to Ivy League schools, transfer with a low GPA, and master the transfer essay. Read the latest guides."
        path="/blog"
        jsonLd={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
          ]),
        ]}
      />

      <section style={{ background: TU.offwhite, padding: 'clamp(96px, 12vw, 140px) clamp(24px, 6vw, 80px) clamp(56px, 8vw, 80px)' }}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <SectionHeader
            as="h1"
            title="Transfer Admissions Blog"
            body="Expert guides and strategies for transferring to a top university."
          />
        </div>
      </section>

      <section style={{ background: TU.offwhite, padding: '0 clamp(24px, 6vw, 80px) clamp(72px, 12vw, 128px)' }}>
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ maxWidth: 1100 }}>
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 80}>
              <a
                href={`/blog/${post.slug}`}
                className="block h-full transition-transform duration-300 hover:-translate-y-1"
                style={{ background: '#FFFFFF', borderRadius: 8, border: `1px solid ${TU.divider}`, overflow: 'hidden' }}
              >
                {post.image ? (
                  <div style={{ aspectRatio: '16 / 9', background: TU.navy, overflow: 'hidden' }}>
                    <img
                      src={post.image}
                      alt={post.title}
                      loading={i > 2 ? 'lazy' : undefined}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center text-center"
                    style={{ aspectRatio: '16 / 9', background: TU.navy, padding: 24 }}
                  >
                    <span style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 20, color: TU.cream, opacity: 0.9 }}>
                      {post.tags[0] ? post.tags[0].replace(/\b\w/g, (c) => c.toUpperCase()) : 'Transfer Guide'}
                    </span>
                  </div>
                )}
                <div style={{ padding: '24px 22px' }}>
                  <h2 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 22, color: TU.navy, lineHeight: 1.2 }}>
                    {post.title}
                  </h2>
                  <p
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, lineHeight: 1.55, color: TU.navy, opacity: 0.65, marginTop: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  >
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between" style={{ marginTop: 18 }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: TU.navy, opacity: 0.4 }}>
                      {formatDate(post.date)}
                    </span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: TU.crimson }}>Read More →</span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
      <NewsletterSignup />
    </>
  );
}
