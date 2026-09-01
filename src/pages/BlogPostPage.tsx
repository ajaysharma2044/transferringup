import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Seo from '../components/seo/Seo';
import { Reveal, TU } from '../components/home/shared';
import { CTAButton } from '../components/shared/ui';
import { blogPostingSchema, breadcrumbSchema } from '../lib/schema';
import { getPostBySlug, getRelatedPosts, type MdBlogPost } from '../lib/mdblog';
import NotFoundPage from './NotFoundPage';

function formatDate(d: string) {
  const date = new Date(d);
  return Number.isNaN(date.getTime())
    ? d
    : date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function TableOfContents({ toc }: { toc: MdBlogPost['toc'] }) {
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    if (toc.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-100px 0px -70% 0px' }
    );
    toc.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav className="hidden xl:block" style={{ position: 'sticky', top: 100, alignSelf: 'start' }}>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: TU.navy, opacity: 0.4, marginBottom: 14 }}>
        On this page
      </div>
      {toc.map((t) => (
        <a
          key={t.id}
          href={`#${t.id}`}
          style={{
            display: 'block',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            color: TU.navy,
            opacity: active === t.id ? 1 : 0.5,
            paddingLeft: t.level === 3 ? 14 : 0,
            borderLeft: active === t.id ? `2px solid ${TU.crimson}` : '2px solid transparent',
            marginLeft: -2,
            paddingTop: 6,
            paddingBottom: 6,
            paddingRight: 8,
          }}
        >
          {t.text}
        </a>
      ))}
    </nav>
  );
}

export default function BlogPostPage() {
  const { slug = '' } = useParams();
  const post = getPostBySlug(slug);
  if (!post) return <NotFoundPage />;

  const related = getRelatedPosts(slug, 3);

  return (
    <>
      <Seo
        title={post.metaTitle || `${post.title} | TransferringUP Blog`}
        description={post.description}
        path={`/blog/${post.slug}`}
        ogType="article"
        ogImage={post.ogImage || post.image || undefined}
        canonical={post.canonical || undefined}
        jsonLd={[
          blogPostingSchema(post),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      {/* Featured banner: campus photo when the post has one, navy fallback */}
      {post.image ? (
        <div className="w-full" style={{ position: 'relative', height: 'min(420px, 44vw)', background: TU.navy, overflow: 'hidden' }}>
          <img
            src={post.image}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {post.imageCredit && (
            <span style={{ position: 'absolute', right: 10, bottom: 8, fontFamily: 'Inter, sans-serif', fontSize: 10.5, color: '#fff', opacity: 0.75, background: 'rgba(15,28,46,.55)', padding: '3px 8px', borderRadius: 4 }}>
              {post.imageCredit}
            </span>
          )}
        </div>
      ) : (
        <div
          className="w-full flex items-center justify-center text-center"
          style={{ background: TU.navy, height: 'min(400px, 42vw)', padding: '88px 24px 0' }}
        >
          <span style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 'clamp(20px,3vw,30px)', color: TU.cream, opacity: 0.9 }}>
            {post.tags[0] ? post.tags[0].replace(/\b\w/g, (c) => c.toUpperCase()) : 'Transfer Guide'}
          </span>
        </div>
      )}

      <article style={{ background: TU.offwhite, padding: 'clamp(48px, 7vw, 80px) clamp(24px, 5vw, 40px) clamp(72px, 12vw, 128px)' }}>
        <div className="mx-auto grid grid-cols-1 xl:grid-cols-[1fr_220px] gap-12" style={{ maxWidth: 1040 }}>
          <div style={{ maxWidth: 720, width: '100%', margin: '0 auto' }}>
            <h1 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 'clamp(36px,4vw,52px)', color: TU.navy, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              {post.title}
            </h1>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: TU.navy, opacity: 0.5, marginTop: 16 }}>
              {post.author} · {formatDate(post.date)} · {post.readingMinutes} min read
            </div>
            <div className="tu-prose" style={{ marginTop: 40 }} dangerouslySetInnerHTML={{ __html: post.html }} />

            {/* Author bio */}
            <div style={{ borderTop: `1px solid ${TU.divider}`, marginTop: 56, paddingTop: 28, display: 'flex', gap: 16, alignItems: 'center' }}>
              <img src="/ajay-linkedin.jpg" alt="Ajay Sharma, founder of TransferringUP and Cornell transfer admissions consultant" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} loading="lazy" />
              <div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 15, color: TU.navy }}>Ajay</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: TU.navy, opacity: 0.6 }}>
                  Founder of TransferringUP · transferred to Cornell with a 2.9 GPA.{' '}
                  <a href="/about" style={{ color: TU.crimson }}>About →</a>
                </div>
              </div>
            </div>
          </div>

          <TableOfContents toc={post.toc} />
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mx-auto" style={{ maxWidth: 1040, marginTop: 72 }}>
            <h2 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 28, color: TU.navy, marginBottom: 24 }}>
              Related Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <a key={r.slug} href={`/blog/${r.slug}`} style={{ background: '#FFFFFF', border: `1px solid ${TU.divider}`, borderRadius: 8, padding: 22 }} className="block transition-transform duration-300 hover:-translate-y-1">
                  <h3 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 18, color: TU.navy, lineHeight: 1.25 }}>{r.title}</h3>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: TU.crimson, display: 'inline-block', marginTop: 12 }}>Read More →</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* CTA band */}
      <section style={{ background: TU.navy, padding: 'clamp(56px, 8vw, 88px) clamp(24px, 6vw, 80px)' }}>
        <Reveal className="mx-auto text-center" style={{ maxWidth: 720 }}>
          <h2 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 'clamp(28px,3.5vw,40px)', color: TU.offwhite, lineHeight: 1.1 }}>
            Need help with your transfer?
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 18, color: TU.offwhite, opacity: 0.65, marginTop: 12 }}>
            Book a free consultation.
          </p>
          <div style={{ marginTop: 28 }}>
            <CTAButton href="/contact">Start My Transfer →</CTAButton>
          </div>
        </Reveal>
      </section>
    </>
  );
}
