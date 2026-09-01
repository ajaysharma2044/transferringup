import { useEffect, useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { Reveal, TU } from './shared';
import { Eyebrow } from '../shared/editorial';
import { REVIEWS } from '../shared/ReviewCards';
import BBBReviews from './BBBReviews';
import SectionSeam from './SectionSeam';

const GREEN = '#1E875A';

// Schools we have campus art for → display name, image, color wash + accent.
const SCHOOLS: Record<string, { name: string; img: string; tint: string; accent: string }> = {
  uva: { name: 'University of Virginia', img: '/images/campus/uva.webp', tint: '#16203D', accent: '#F2882B' },
  usc: { name: 'USC', img: '/images/campus/usc.webp', tint: '#2E0808', accent: '#FFC72C' },
  nyu: { name: 'New York University', img: '/images/campus/nyu.webp', tint: '#240A40', accent: '#C9A0FF' },
  michigan: { name: 'University of Michigan', img: '/images/campus/michigan.webp', tint: '#0E2140', accent: '#FFCB05' },
  utaustin: { name: 'UT Austin', img: '/images/campus/utaustin.webp', tint: '#331505', accent: '#FF9248' },
  cornell: { name: 'Cornell University', img: '/images/campus/cornell.webp', tint: '#3A0B0B', accent: '#FF7A6B' },
  emory: { name: 'Emory University', img: '/images/campus/emory.webp', tint: '#0A1A3D', accent: '#6E9FE0' },
};
// accepted-list display string → school key (only ones with campus art cycle)
const KEY: Record<string, string> = {
  UVA: 'uva', USC: 'usc', NYU: 'nyu', Michigan: 'michigan', 'UT Austin': 'utaustin', Cornell: 'cornell', Emory: 'emory',
};
const CUTOUT: Record<string, string> = {
  Samanyu: '/reviews/samanyu-cutout.webp',
  Adam: '/reviews/adam-cutout.webp',
  Brody: '/reviews/brody-cutout.webp',
  Yash: '/reviews/yash-cutout.webp',
};
const strip = (s: string) => s.replace(/\s*\(.*\)/, '').trim();

type RevCard = { name: string; schoolFrom: string; schoolTo: string; schoolsAccepted: string[]; rating: number; text: string };


function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex" style={{ gap: 4 }} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={16} strokeWidth={0} style={{ color: GREEN }} fill={n <= rating ? GREEN : 'rgba(255,255,255,0.25)'} />
      ))}
    </div>
  );
}

export function ImmersiveCard({ review, delay = 0, full = false }: { review: RevCard; delay?: number; full?: boolean }) {
  // schools this person was admitted to that we have campus art for → cycle them
  const cycle = useMemo(() => {
    const ks = review.schoolsAccepted.map((s) => KEY[strip(s)]).filter((k): k is string => !!k && !!SCHOOLS[k]);
    return Array.from(new Set(ks));
  }, [review]);

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (cycle.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % cycle.length), 3800);
    return () => clearInterval(t);
  }, [cycle.length]);

  const activeKey = cycle[Math.min(idx, cycle.length - 1)] || cycle[0];
  const active = activeKey ? SCHOOLS[activeKey] : { name: review.schoolTo, tint: '#0A1018', accent: TU.gold, img: '' };
  const also = review.schoolsAccepted.map(strip);

  return (
    <Reveal delay={delay} className="relative w-full overflow-hidden" style={{ borderRadius: 18, background: '#0A1018', ...(full ? { minHeight: 'clamp(380px, 40vw, 470px)' } : { aspectRatio: '1 / 1' }) }}>
      {/* cycling campus backdrops */}
      {cycle.map((k, i) => (
        <div key={k} aria-hidden className="absolute inset-0" style={{ opacity: i === idx ? 1 : 0, transition: 'opacity 1.3s ease' }}>
          <img
            src={SCHOOLS[k].img}
            srcSet={`${SCHOOLS[k].img.replace('.webp', '-sm.webp')} 820w, ${SCHOOLS[k].img} 1500w`}
            sizes="(min-width: 1024px) 560px, 100vw"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0" style={{ background: SCHOOLS[k].tint, mixBlendMode: 'multiply', opacity: 0.4 }} />
        </div>
      ))}

      {/* legibility washes (left for text, bottom-left for the footer) */}
      <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(6,10,16,0.92) 0%, rgba(6,10,16,0.42) 50%, rgba(6,10,16,0) 80%)' }} />
      <div aria-hidden className="absolute bottom-0 left-0" style={{ width: '64%', height: '42%', background: 'linear-gradient(to top, rgba(6,10,16,0.55), transparent)' }} />
      {/* soft warm spotlight behind the student so a dark-clothed cutout reads off the campus */}
      <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 46% 66% at 78% 84%, rgba(255,244,228,0.24), transparent 62%)' }} />

      {/* student cutout, bottom-right, with a faint rim so it separates from the backdrop */}
      <img
        src={CUTOUT[review.name]}
        alt={review.name}
        loading="lazy"
        className="absolute bottom-0 right-0 pointer-events-none select-none"
        style={{ height: '92%', maxHeight: full ? 440 : undefined, maxWidth: full ? '44%' : '52%', objectFit: 'contain', objectPosition: 'bottom right', filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.32)) drop-shadow(0 10px 22px rgba(0,0,0,0.5))' }}
      />

      {/* content */}
      <div className="relative flex flex-col h-full" style={{ padding: 'clamp(20px, 2.4vw, 28px)', maxWidth: full ? '58%' : '64%' }}>
        <Stars rating={review.rating} />
        <div style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 'clamp(23px, 2.7vw, 33px)', color: '#fff', lineHeight: 1.02, marginTop: 12, letterSpacing: '-0.02em' }}>
          {review.name}
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12.5, color: 'rgba(255,255,255,0.82)', marginTop: 6 }}>
          Admitted to <span style={{ color: active.accent, fontWeight: 700, transition: 'color 0.6s ease' }}>{active.name}</span>
        </div>

        {/* quote bubble */}
        <div style={{ position: 'relative', marginTop: 15, background: 'rgba(255,255,255,0.97)', borderRadius: 13, padding: '11px 13px', boxShadow: '0 12px 26px rgba(0,0,0,0.3)' }}>
          <p
            style={{
              fontFamily: 'Inter, sans-serif', fontSize: full ? 13 : 11.5, lineHeight: full ? 1.6 : 1.5, color: TU.navy, margin: 0,
              ...(full ? {} : { display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }),
            }}
          >
            {review.text}
          </p>
          <div aria-hidden style={{ position: 'absolute', left: 20, bottom: -7, width: 14, height: 14, background: 'rgba(255,255,255,0.97)', transform: 'rotate(45deg)' }} />
        </div>

        {/* footer: accepted list (or transfer line for single-school) */}
        <div style={{ marginTop: 'auto', paddingTop: 14 }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: active.accent, marginBottom: 5, transition: 'color 0.6s ease' }}>
            {also.length > 1 ? 'Also accepted to' : 'Transferred from'}
          </div>
          <div style={{ fontFamily: '"Fraunces", serif', fontSize: 12.5, color: '#fff', lineHeight: 1.4, opacity: 0.95 }}>
            {also.length > 1 ? also.join('  ·  ') : review.schoolFrom}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function ReviewsProof() {
  return (
    <>
      {/* Headline over the Cornell Law Library (Gould Reading Room) backdrop, under
          a navy wash for legibility. Falls back to tu-band-deep if image missing. */}
      <section
        id="words"
        className="tu-band-deep relative"
        style={{ padding: 'clamp(72px, 12vw, 104px) clamp(24px, 6vw, 80px) clamp(44px, 6vw, 64px)' }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(9,15,24,0.92) 0%, rgba(9,15,24,0.74) 42%, rgba(9,15,24,0.9) 100%), url('/images/campus/cornell-law-library.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="mx-auto relative text-center" style={{ maxWidth: 920 }}>
          <Reveal>
            <Eyebrow index="01" label="In Their Words" dark />
          </Reveal>
          <Reveal delay={60}>
            <h2
              style={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 700,
                fontSize: 'clamp(44px, 5vw, 68px)',
                color: TU.offwhite,
                letterSpacing: '-0.02em',
                lineHeight: 1.0,
                marginTop: 18,
              }}
            >
              Don’t Take Our Word For It
            </h2>
          </Reveal>
          <Reveal delay={100} style={{ marginTop: 24 }}>
            <div className="tu-rating-badge">
              <span className="tu-rating-badge__stars">★★★★★</span>
              <span className="tu-rating-badge__text">5.0 / 5.0 · Verified Reviews</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Independently-verified BBB block (white), then the student stories. */}
      <SectionSeam from="#0B1422" to="#FFFFFF" />
      <BBBReviews />
      <SectionSeam from="#FFFFFF" to="#0E1A2B" />

      <section className="tu-band-deep relative" style={{ padding: 'clamp(48px, 7vw, 72px) clamp(24px, 6vw, 80px) clamp(72px, 12vw, 120px)' }}>
        {/* Same Cornell Law Library backdrop as the headline, so the whole
            reviews section reads as one space. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(9,15,24,0.9) 0%, rgba(9,15,24,0.78) 50%, rgba(9,15,24,0.92) 100%), url('/images/campus/cornell-law-library.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="mx-auto relative" style={{ maxWidth: 920 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 'clamp(16px, 2.2vw, 26px)' }}>
            {REVIEWS.map((r, i) => (
              <ImmersiveCard key={r.name + i} review={r} delay={(i % 2) * 90} />
            ))}
          </div>

          <Reveal className="text-center" style={{ marginTop: 48 }}>
            <a
              href="/reviews"
              className="inline-block"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: TU.offwhite, opacity: 0.85 }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Read all reviews →
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
