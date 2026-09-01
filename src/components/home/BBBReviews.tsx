import { Reveal, TU } from './shared';
import { BBB_REVIEWS } from '../../data/bbbReviews';
import { BBB_PROFILE_URL, BBB_RATING } from '../../lib/schema';

/**
 * "Verified on the BBB" band, the official BBB seal, our rating, and an
 * auto-scrolling marquee of the Better Business Bureau reviews. Compact and
 * minimal so it sits neatly below the main testimonials on the homepage and on
 * the Reviews page. Seal image lives at public/bbb-seal.png.
 */
export default function BBBReviews({ id }: { id?: string }) {
  // Two copies so the -50% marquee loops seamlessly.
  const loop = [...BBB_REVIEWS, ...BBB_REVIEWS];

  return (
    <section id={id} style={{ background: '#FFFFFF', padding: 'clamp(48px, 7vw, 80px) 0' }}>
      <Reveal className="flex justify-center" style={{ marginBottom: 'clamp(30px, 4vw, 46px)', padding: '0 clamp(24px, 6vw, 80px)' }}>
        {/* Seal + credential lockup, vertically aligned, on-brand type */}
        <div
          className="flex flex-col sm:flex-row items-center text-center sm:text-left"
          style={{ gap: 'clamp(20px, 3vw, 34px)', maxWidth: 680 }}
        >
          <a
            href={BBB_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Better Business Bureau Accredited Business, ${BBB_RATING} rating, view our BBB profile`}
            className="shrink-0 transition-opacity duration-200"
            style={{ background: '#fff', borderRadius: 14, padding: '8px 10px', border: '1px solid rgba(15,28,46,0.08)', boxShadow: '0 8px 24px rgba(15,28,46,0.10)' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <img
              src="/bbb-seal.png"
              alt={`BBB Accredited Business, ${BBB_RATING} Rating`}
              width={62}
              height={96}
              style={{ height: 96, width: 'auto', display: 'block' }}
            />
          </a>

          {/* hairline divider, editorial lockup detail (desktop only) */}
          <span aria-hidden className="hidden sm:block self-stretch" style={{ width: 1, background: 'rgba(15,28,46,0.13)' }} />

          <div>
            <h2 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 'clamp(27px, 3.4vw, 38px)', color: TU.navy, letterSpacing: '-0.018em', lineHeight: 1.08 }}>
              Rated {BBB_RATING} by the Better Business Bureau.
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, lineHeight: 1.62, color: TU.navy, opacity: 0.6, marginTop: 12, maxWidth: 430 }}>
              Every review below is independently verified by an impartial third party, never collected by us.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Auto-scrolling marquee */}
      <div className="bbb-marquee" aria-label="Better Business Bureau reviews">
        <div className="bbb-marquee__track">
          {loop.map((r, i) => (
            <div className="bbb-card" key={i} aria-hidden={i >= BBB_REVIEWS.length}>
              <div className="bbb-card__head">
                <span className="bbb-card__stars">★★★★★</span>
                <span className="bbb-card__tag">BBB&nbsp;VERIFIED</span>
              </div>
              <p className="bbb-card__quote">&ldquo;{r.text}&rdquo;</p>
              <div className="bbb-card__name">{r.name}</div>
            </div>
          ))}
        </div>
      </div>

      <Reveal className="text-center" style={{ marginTop: 'clamp(28px, 4vw, 40px)', padding: '0 clamp(24px, 6vw, 80px)' }}>
        <a
          href={BBB_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block transition-opacity duration-200"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 14.5, fontWeight: 500, color: TU.crimson }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
        >
          See all reviews on our BBB profile →
        </a>
      </Reveal>
    </section>
  );
}
