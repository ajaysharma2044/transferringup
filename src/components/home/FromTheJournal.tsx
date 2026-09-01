import { Reveal, TU } from './shared';
import { Eyebrow } from '../shared/editorial';
import { getAllPosts } from '../../lib/mdblog';

function formatDate(d: string) {
  const date = new Date(d);
  return Number.isNaN(date.getTime())
    ? d
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function FromTheJournal() {
  const posts = getAllPosts().slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section id="journal" style={{ background: TU.offwhite, padding: 'clamp(72px, 12vw, 128px) clamp(24px, 6vw, 80px)' }}>
      <div className="mx-auto" style={{ maxWidth: 1120 }}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6" style={{ marginBottom: 48 }}>
          <Reveal>
            <Eyebrow index="07" label="The Journal" align="left" style={{ marginBottom: 18 }} />
            <h2
              style={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 700,
                fontSize: 'clamp(36px, 4.5vw, 56px)',
                color: TU.navy,
                letterSpacing: '-0.02em',
                lineHeight: 1.02,
              }}
            >
              From the Transfer Journal
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <a
              href="/blog"
              className="inline-block whitespace-nowrap"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: TU.crimson }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Read the blog →
            </a>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 80}>
              <a
                href={`/blog/${post.slug}`}
                className="block h-full transition-transform duration-300 hover:-translate-y-1"
                style={{ borderTop: `2px solid ${TU.crimson}`, paddingTop: 22 }}
              >
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 11,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: TU.navy,
                    opacity: 0.4,
                  }}
                >
                  {formatDate(post.date)} · {post.readingMinutes} min read
                </div>
                <h3
                  style={{
                    fontFamily: '"EB Garamond", Georgia, serif',
                    fontWeight: 600,
                    fontSize: 25,
                    color: TU.navy,
                    lineHeight: 1.18,
                    marginTop: 12,
                  }}
                >
                  {post.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 15,
                    lineHeight: 1.55,
                    color: TU.navy,
                    opacity: 0.65,
                    marginTop: 12,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.description}
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
