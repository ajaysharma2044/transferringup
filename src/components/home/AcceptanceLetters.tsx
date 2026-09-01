import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Reveal, TU } from './shared';
import { Eyebrow } from '../shared/editorial';
import { brand } from '../../data/results';

type Receipt = { src: string; school: string; label: string; note: string };

// Real acceptance letters (full-page scans) + redacted text-message reactions.
// Names, addresses and student IDs are blurred; the wins are real.
const RECEIPTS: Receipt[] = [
  { src: '/IMG_5249.webp', school: 'cornell', label: 'Cornell University', note: 'Founder · 2.9 GPA → admitted' },
  { src: '/recent-wins/cornell-adam.jpg', school: 'cornell', label: 'Cornell University', note: 'Accepted in one year' },
  { src: '/recent-wins/columbia.jpg', school: 'columbia', label: 'Columbia University', note: 'Accepted in one year' },
  { src: '/IMG_5939.jpg', school: 'northwestern', label: 'Northwestern University', note: 'Verified letter' },
  { src: '/recent-wins/michigan-adam.jpg', school: 'michigan', label: 'University of Michigan', note: 'Accepted in one year' },
  { src: '/recent-wins/nyu-samanyu.jpg', school: 'nyu', label: 'New York University', note: 'Accepted in one year' },
  { src: '/IMG_5938.jpg', school: 'michigan', label: 'University of Michigan', note: 'Verified letter' },
  { src: '/recent-wins/uva-adam.jpg', school: 'uva', label: 'University of Virginia', note: 'Accepted in one year' },
  { src: '/recent-wins/emory-adam.jpg', school: 'emory', label: 'Emory University', note: 'Accepted in one year' },
  { src: '/recent-wins/northwestern-ishmeet.jpg', school: 'northwestern', label: 'Northwestern University', note: 'Accepted in one year' },
  { src: '/recent-wins/utaustin-samanyu.jpg', school: 'utaustin', label: 'University of Texas at Austin', note: 'Accepted in one year' },
  { src: '/recent-wins/cornell-ilr-adrian.jpg', school: 'cornell', label: 'Cornell University · ILR', note: 'Accepted in one year' },
  { src: '/recent-wins/nyu-adrian.jpg', school: 'nyu', label: 'New York University', note: 'Accepted in one year' },
  { src: '/recent-wins/uva-samanyu.jpg', school: 'uva', label: 'University of Virginia', note: 'Accepted in one year' },
];

function Caption({ r }: { r: Receipt }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div className="flex items-center" style={{ gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: 2, background: brand(r.school).color, flexShrink: 0 }} />
        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, color: TU.offwhite }}>{r.label}</span>
      </div>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: TU.offwhite, opacity: 0.42, marginTop: 4, marginLeft: 16 }}>
        {r.note}
      </div>
    </div>
  );
}

function Lightbox({ r, onClose }: { r: Receipt; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onEsc);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center" style={{ background: 'rgba(6,12,20,0.9)', padding: '5vh 16px', overflowY: 'auto' }} onClick={onClose}>
      <button
        aria-label="Close"
        onClick={onClose}
        className="fixed flex items-center justify-center"
        style={{ top: 18, right: 18, width: 40, height: 40, borderRadius: 999, background: 'rgba(243,245,240,0.12)', color: TU.offwhite, zIndex: 2 }}
      >
        <X size={20} />
      </button>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460, width: '100%' }}>
        <img src={r.src} alt={`${r.label} acceptance`} style={{ width: '100%', borderRadius: 12, boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }} />
        <div className="text-center" style={{ marginTop: 16, marginBottom: 24 }}>
          <span style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 18, color: TU.offwhite }}>{r.label}</span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: TU.gold, marginLeft: 12 }}>{r.note}</span>
        </div>
      </div>
    </div>
  );
}

export default function AcceptanceLetters() {
  const [lightbox, setLightbox] = useState<Receipt | null>(null);

  return (
    <section id="letters" style={{ background: TU.navy, padding: 'clamp(72px, 12vw, 128px) clamp(24px, 6vw, 80px)' }}>
      <div className="mx-auto" style={{ maxWidth: 1180 }}>
        <div className="text-center" style={{ marginBottom: 56 }}>
          <Reveal>
            <Eyebrow index="02" label="The Receipts" dark />
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
              The Receipts
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p
              className="mx-auto"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 18, lineHeight: 1.6, color: TU.offwhite, opacity: 0.6, maxWidth: 600, marginTop: 18 }}
            >
              The actual acceptance letters, and the texts our students sent the second they
              found out.
            </p>
          </Reveal>
        </div>

        {/* Masonry wall of receipts, each tile rises on scroll (compositor-driven) */}
        <div className="columns-2 lg:columns-3" style={{ columnGap: 22 }}>
          {RECEIPTS.map((r, i) => (
            <div
              key={r.src}
              className={`tu-parallax ${i % 2 ? 'tu-parallax--fast' : 'tu-parallax--slow'}`}
              style={{ breakInside: 'avoid', marginBottom: 22 }}
            >
              <button onClick={() => setLightbox(r)} className="group block w-full text-left" style={{ cursor: 'zoom-in' }}>
                <div
                  className="relative w-full overflow-hidden transition-transform duration-300 group-hover:-translate-y-1"
                  style={{ borderRadius: 12, border: '1px solid rgba(243,245,240,0.1)', boxShadow: '0 22px 55px rgba(0,0,0,0.45)' }}
                >
                  <img src={r.src} alt={`${r.label} acceptance`} loading="lazy" decoding="async" className="block w-full" />
                </div>
                <Caption r={r} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {lightbox && <Lightbox r={lightbox} onClose={() => setLightbox(null)} />}
    </section>
  );
}
