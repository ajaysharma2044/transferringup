import { useEffect, useMemo, useRef, useState } from 'react';
import { TU } from './shared';
import { Eyebrow } from '../shared/editorial';
import { brand } from '../../data/results';

export type Receipt = { src: string; school: string; label: string; note: string };

// Real acceptance letters + redacted text-message reactions. Names/IDs blurred.
// Grouped by school so the same campus background never muddily blends with
// another, each school plays as one contiguous run, then a clean dissolve.
// HOMEPAGE: a curated highlight reel. The full archive (FULL_RECEIPTS) plays the
// same cinematic stage on /results, same treatment, more in-depth.
export const RECEIPTS: Receipt[] = [
  { src: '/IMG_5249.webp', school: 'cornell', label: 'Cornell University', note: 'Founder · 2.9 GPA → admitted' },
  { src: '/recent-wins/cornell-adam.jpg', school: 'cornell', label: 'Cornell University', note: 'Accepted in one year' },
  { src: '/recent-wins/columbia.jpg', school: 'columbia', label: 'Columbia University', note: 'Accepted in one year' },
  { src: '/recent-wins/northwestern-ishmeet.jpg', school: 'northwestern', label: 'Northwestern University', note: 'Accepted in one year' },
  { src: '/recent-wins/michigan-adam.jpg', school: 'michigan', label: 'University of Michigan', note: 'Accepted in one year' },
  { src: '/recent-wins/nyu-samanyu.jpg', school: 'nyu', label: 'New York University', note: 'Accepted in one year' },
  { src: '/recent-wins/uva-adam.jpg', school: 'uva', label: 'University of Virginia', note: 'Accepted in one year' },
  { src: '/recent-wins/georgetown.jpg', school: 'georgetown', label: 'Georgetown University', note: 'Accepted in one year' },
  { src: '/recent-wins/emory-adam.jpg', school: 'emory', label: 'Emory University', note: 'Accepted in one year' },
  { src: '/recent-wins/usc.jpg', school: 'usc', label: 'University of Southern California', note: 'Accepted in one year' },
];

// The full archive, every verified letter we have. Powers the in-depth /results
// version of this same cinematic section.
export const FULL_RECEIPTS: Receipt[] = [
  { src: '/IMG_5249.webp', school: 'cornell', label: 'Cornell University', note: 'Founder · 2.9 GPA → admitted' },
  { src: '/recent-wins/cornell-adam.jpg', school: 'cornell', label: 'Cornell University', note: 'Accepted in one year' },
  { src: '/recent-wins/cornell-ilr-adrian.jpg', school: 'cornell', label: 'Cornell University · ILR', note: 'Accepted in one year' },
  { src: '/recent-wins/columbia.jpg', school: 'columbia', label: 'Columbia University', note: 'Accepted in one year' },
  { src: '/IMG_5939.jpg', school: 'northwestern', label: 'Northwestern University', note: 'Verified letter' },
  { src: '/recent-wins/northwestern-ishmeet.jpg', school: 'northwestern', label: 'Northwestern University', note: 'Accepted in one year' },
  { src: '/recent-wins/michigan-adam.jpg', school: 'michigan', label: 'University of Michigan', note: 'Accepted in one year' },
  { src: '/IMG_5938.jpg', school: 'michigan', label: 'University of Michigan', note: 'Verified letter' },
  { src: '/recent-wins/nyu-samanyu.jpg', school: 'nyu', label: 'New York University', note: 'Accepted in one year' },
  { src: '/recent-wins/nyu-adrian.jpg', school: 'nyu', label: 'New York University', note: 'Accepted in one year' },
  { src: '/recent-wins/uva-adam.jpg', school: 'uva', label: 'University of Virginia', note: 'Accepted in one year' },
  { src: '/recent-wins/uva-samanyu.jpg', school: 'uva', label: 'University of Virginia', note: 'Accepted in one year' },
  { src: '/recent-wins/emory-adam.jpg', school: 'emory', label: 'Emory University', note: 'Accepted in one year' },
  { src: '/recent-wins/utaustin-samanyu.jpg', school: 'utaustin', label: 'University of Texas at Austin', note: 'Accepted in one year' },
  { src: '/recent-wins/georgetown.jpg', school: 'georgetown', label: 'Georgetown University', note: 'Accepted in one year' },
  { src: '/recent-wins/usc.jpg', school: 'usc', label: 'University of Southern California', note: 'Accepted in one year' },
];

const BIG: Record<string, string> = {
  cornell: 'Cornell University',
  columbia: 'Columbia University',
  michigan: 'University of Michigan',
  nyu: 'New York University',
  uva: 'University of Virginia',
  emory: 'Emory University',
  northwestern: 'Northwestern University',
  utaustin: 'University of Texas at Austin',
  tufts: 'Tufts University',
  colgate: 'Colgate University',
  georgetown: 'Georgetown University',
  usc: 'University of Southern California',
};

// Each school as a cohesive two-color composition: `tint` washes the campus photo
// in the school's primary color (duotone), `name` is the accent the wordmark sits
// in, so the photo and the name share one palette and read as designed, not pasted.
const PALETTE: Record<string, { tint: string; name: string }> = {
  cornell:      { tint: '#3A0B0B', name: '#FF7A6B' }, // Carnelian
  columbia:     { tint: '#0C2742', name: '#A9D8F5' }, // Columbia blue
  michigan:     { tint: '#0E2140', name: '#FFCB05' }, // Blue + Maize
  nyu:          { tint: '#2C0A4A', name: '#C9A0FF' }, // Violet
  uva:          { tint: '#16203D', name: '#F2882B' }, // Navy + Orange
  emory:        { tint: '#0A1A3D', name: '#6E9FE0' }, // Emory blue
  northwestern: { tint: '#241046', name: '#BBA0FF' }, // Purple
  utaustin:     { tint: '#331505', name: '#FF9248' }, // Burnt orange
  tufts:        { tint: '#0E2A45', name: '#5BA8E8' }, // Tufts blue
  colgate:      { tint: '#3A0A12', name: '#E0707E' }, // Colgate maroon
  georgetown:   { tint: '#0A1A33', name: '#8FB3D9' }, // Georgetown blue/gray
  usc:          { tint: '#2E0808', name: '#FFCC00' }, // Cardinal + Gold
};

// High-quality campus photo per school, cross-fades in the background as you
// scroll. Missing files just fall back to the navy gradient (graceful).
const BG: Record<string, string> = {
  cornell: '/images/campus/cornell.webp',
  columbia: '/images/campus/columbia.webp',
  michigan: '/images/campus/michigan.webp',
  nyu: '/images/campus/nyu.webp',
  uva: '/images/campus/uva.webp',
  emory: '/images/campus/emory.webp',
  northwestern: '/images/campus/northwestern.webp',
  utaustin: '/images/campus/utaustin.webp',
  tufts: '/images/campus/tufts.webp',
  colgate: '/images/campus/colgate.webp',
  georgetown: '/images/campus/georgetown.webp',
  usc: '/images/campus/usc.webp',
};

// Derive the per-school scroll windows for a given receipt list.
function meta(receipts: Receipt[]) {
  const N = receipts.length;
  const UNIQUE = [...new Set(receipts.map((r) => r.school))];
  const SCHOOL_IDX: Record<string, number[]> = {};
  receipts.forEach((r, i) => {
    (SCHOOL_IDX[r.school] = SCHOOL_IDX[r.school] || []).push(i);
  });
  const SCHOOL_RANGE: Record<string, { a: number; b: number }> = {};
  for (const s of UNIQUE) {
    const idx = SCHOOL_IDX[s];
    SCHOOL_RANGE[s] = { a: (idx[0] + 0.5) / N, b: (idx[idx.length - 1] + 0.5) / N };
  }
  return { N, UNIQUE, SCHOOL_RANGE };
}

function MiniCaption({ r, light = false }: { r: Receipt; light?: boolean }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div className="flex items-center" style={{ gap: 7 }}>
        <span style={{ width: 7, height: 7, borderRadius: 2, background: brand(r.school).color, flexShrink: 0 }} />
        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: TU.offwhite }}>{r.label}</span>
      </div>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: TU.offwhite, opacity: light ? 0.5 : 0.4, marginTop: 3, marginLeft: 14 }}>
        {r.note}
      </div>
    </div>
  );
}

/** Wraps a screenshot in a realistic iPhone frame (graphite/purple bezel). */
function PhoneFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      style={{
        padding: '2.6%',
        borderRadius: 'clamp(30px, 11%, 46px)',
        background: 'linear-gradient(152deg, #6a5d72 0%, #36303d 34%, #1c1920 100%)',
        boxShadow:
          '0 38px 80px rgba(0,0,0,0.6), 0 6px 16px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.14)',
      }}
    >
      <div style={{ borderRadius: 'clamp(22px, 8.5%, 36px)', overflow: 'hidden', background: '#000', boxShadow: 'inset 0 0 0 2px #0a0a0a' }}>
        <img src={src} alt={alt} loading="lazy" decoding="async" style={{ display: 'block', width: '100%' }} />
      </div>
    </div>
  );
}

type Props = {
  /** Receipt list to play. Defaults to the curated homepage reel. */
  receipts?: Receipt[];
  /** Headline above the stage. */
  heading?: string;
  /** Bottom CTA. Pass null to hide (e.g. on /results, where we ARE the archive). */
  cta?: { href: string; label: string } | null;
  /** Eyebrow index ("02" on the homepage). */
  index?: string;
};

export default function ReceiptsScroll({
  receipts = RECEIPTS,
  heading = 'The texts they sent the second they found out.',
  cta = { href: '/results', label: 'See every acceptance →' },
  index = '02',
}: Props = {}) {
  const wrapRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nameRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const bgRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [staticMode, setStaticMode] = useState(false);
  const [mobile, setMobile] = useState(false);

  const { N, UNIQUE, SCHOOL_RANGE } = useMemo(() => meta(receipts), [receipts]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Only reduced-motion gets the static grid. Mobile keeps the cinematic
    // scroll, just with a single centred card column instead of the two edges.
    if (reduced) {
      setStaticMode(true);
      return;
    }
    const small = window.matchMedia('(max-width: 760px)').matches;
    setMobile(small);
    const wrap = wrapRef.current;
    if (!wrap) return;

    const { N, UNIQUE, SCHOOL_RANGE } = meta(receipts);
    let raf = 0;
    const span = 1.3 / N;
    const fade = 0.7 / N;       // campus photo: smooth dissolve
    const fadeName = 0.28 / N;  // school name: sharp swap, stays readable

    // Always-on rAF; the DOM work is gated by viewport proximity so it's cheap
    // when the section is off-screen, but it can never get "stuck" the way an
    // IntersectionObserver-started loop can after a programmatic jump.
    //
    // Forced-reflow guard: reading getBoundingClientRect() every frame flushes
    // layout (PageSpeed flags this as "forced reflow / layout thrashing"). The
    // animation only needs to recompute when the page has actually scrolled, so
    // we read the cheap scroll offset first and bail before touching layout when
    // the position hasn't changed (i.e. while idle / settled).
    let lastY = -1;
    const render = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      if (y === lastY) {
        raf = requestAnimationFrame(render);
        return;
      }
      lastY = y;
      const vh = window.innerHeight;
      const rect = wrap.getBoundingClientRect();

      if (rect.bottom > -100 && rect.top < vh + 100) {
        const total = rect.height - vh;
        const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
        const travel = vh * 1.5;
        const vises = new Array(N);

        for (let i = 0; i < N; i++) {
          const t = (i + 0.5) / N;
          const u = (progress - t) / span;
          const vis = Math.min(1, Math.max(0, 1 - Math.abs(u) * 1.6));
          vises[i] = vis;
          const el = cardRefs.current[i];
          if (!el) continue;
          el.style.opacity = String(vis);
          el.style.visibility = vis <= 0.01 ? 'hidden' : 'visible';
          el.style.transform = `translate3d(${small ? '-50%' : '0'}, calc(-50% + ${(-u * travel).toFixed(1)}px), 0) scale(${(0.9 + 0.1 * vis).toFixed(3)})`;
        }

        // Each school's name + campus stays fully on across its whole run, then
        // does ONE quick clean dissolve to the next, no muddy multi-campus blend,
        // no CSS transition to get stuck. Driven continuously per frame.
        for (const s of UNIQUE) {
          const { a, b } = SCHOOL_RANGE[s];
          const dist = progress < a ? a - progress : progress > b ? progress - b : 0;
          const be = bgRefs.current[s];
          if (be) be.style.opacity = Math.min(1, Math.max(0, 1 - dist / fade)).toFixed(3);
          const ne = nameRefs.current[s];
          if (ne) ne.style.opacity = Math.min(1, Math.max(0, 1 - dist / fadeName)).toFixed(3);
        }
      }

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [receipts]);

  /* ---- Static fallback (reduced-motion / mobile): a clean receipts grid ---- */
  if (staticMode) {
    return (
      <section id="letters" className="tu-band-deep" style={{ padding: 'clamp(72px, 12vw, 120px) clamp(24px, 6vw, 80px)' }}>
        <div className="mx-auto" style={{ maxWidth: 1180 }}>
          <div className="text-center" style={{ marginBottom: 44 }}>
            <Eyebrow index={index} label="The Receipts" dark />
            <h2 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 'clamp(34px, 7vw, 52px)', color: TU.offwhite, letterSpacing: '-0.02em', lineHeight: 1.04, marginTop: 16 }}>
              {heading}
            </h2>
            <p className="mx-auto" style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, lineHeight: 1.6, color: TU.offwhite, opacity: 0.6, maxWidth: 560, marginTop: 16 }}>
              Real acceptance letters and the reactions that followed.
            </p>
          </div>
          <div className="columns-2 lg:columns-3" style={{ columnGap: 18 }}>
            {receipts.map((r) => (
              <div key={r.src} style={{ breakInside: 'avoid', marginBottom: 18 }}>
                <PhoneFrame src={r.src} alt={`${r.label} acceptance`} />
                <MiniCaption r={r} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ---- Scroll-pinned cinematic stage ---- */
  return (
    <section id="letters" ref={wrapRef} className="tu-band-deep" style={{ position: 'relative', height: `${Math.max(220, N * 18)}vh` }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {/* campus backgrounds, each washed in its school's color (duotone) so the
            photo and the wordmark belong to one palette. Cross-fades per school. */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {UNIQUE.map((s) => {
            const tint = PALETTE[s]?.tint || '#0a1422';
            return (
              <div key={s} ref={(el) => { bgRefs.current[s] = el; }} style={{ position: 'absolute', inset: 0, opacity: 0 }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${mobile ? BG[s].replace('.webp', '-sm.webp') : BG[s]})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: 'scale(1.04)' }} />
                {/* school-color wash: darker at top/bottom for heading + CTA, lets campus texture read through the middle */}
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${tint}EC 0%, ${tint}A6 32%, ${tint}A6 64%, ${tint}F2 100%)` }} />
                <div style={{ position: 'absolute', inset: 0, background: tint, mixBlendMode: 'color', opacity: 0.55 }} />
              </div>
            );
          })}
        </div>

        {/* ghosted school name, center, cross-fading */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
          {UNIQUE.map((s) => {
            const label = BIG[s] || s;
            // Full names wrap to (at most) two centered lines so they stay large
            // and never bleed past the edges.
            return (
              <div
                key={s}
                ref={(el) => { nameRefs.current[s] = el; }}
                style={{
                  position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
                  opacity: 0, maxWidth: '90vw', textAlign: 'center', lineHeight: 0.9,
                  fontFamily: '"Fraunces", serif', fontWeight: 700,
                  fontSize: 'clamp(30px, 8vw, 124px)', letterSpacing: '-0.02em',
                  color: PALETTE[s]?.name || '#F3F5F0',
                  textShadow: '0 4px 30px rgba(0,0,0,0.4)',
                }}
              >
                {label}
              </div>
            );
          })}
        </div>

        {/* pinned heading */}
        <div style={{ position: 'absolute', top: 'clamp(28px, 7vh, 84px)', left: 0, right: 0, textAlign: 'center', padding: '0 24px', zIndex: 3 }}>
          <Eyebrow index={index} label="The Receipts" dark />
          <h2 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 'clamp(28px, 3.6vw, 50px)', color: TU.offwhite, letterSpacing: '-0.02em', lineHeight: 1.06, marginTop: 14, maxWidth: 760, marginInline: 'auto' }}>
            {heading}
          </h2>
        </div>

        {/* receipt cards riding up the edges */}
        {receipts.map((r, i) => {
          const side = i % 2 === 0 ? 'left' : 'right';
          return (
            <div
              key={r.src}
              ref={(el) => { cardRefs.current[i] = el; }}
              style={{
                position: 'absolute', top: '50%',
                ...(mobile
                  ? { left: '50%', width: 'min(62vw, 270px)' }
                  : { [side]: 'clamp(16px, 6vw, 132px)', width: 'clamp(208px, 23vw, 308px)' }),
                opacity: 0, visibility: 'hidden',
                willChange: 'transform, opacity', zIndex: 2,
              }}
            >
              <PhoneFrame src={r.src} alt={`${r.label} acceptance`} />
              <MiniCaption r={r} light />
            </div>
          );
        })}

        {/* pinned CTA */}
        {cta && (
          <div style={{ position: 'absolute', bottom: 'clamp(28px, 7vh, 64px)', left: 0, right: 0, textAlign: 'center', zIndex: 3 }}>
            <a
              href={cta.href}
              className="inline-block"
              style={{
                fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600, letterSpacing: '0.02em',
                color: TU.offwhite, border: '1px solid rgba(243,245,240,0.4)', borderRadius: 4,
                padding: '13px 28px', textDecoration: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(243,245,240,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              {cta.label}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
