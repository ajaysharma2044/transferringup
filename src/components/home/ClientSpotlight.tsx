import { Check } from 'lucide-react';
import { Reveal, TU } from './shared';
import { Eyebrow } from '../shared/editorial';

const MILESTONES = [
  'Built a standout transfer profile',
  'Found the right opportunities',
  'Essays that told his story',
  'Admitted in one transfer cycle',
];

export default function ClientSpotlight() {
  return (
    <section id="spotlight" style={{ background: TU.offwhite, padding: 'clamp(72px, 12vw, 128px) clamp(24px, 6vw, 80px)' }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <Reveal style={{ marginBottom: 40 }}>
          <Eyebrow index="09" label="Client Spotlight" align="left" />
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">
          {/* LEFT, story */}
          <Reveal>
            <h2
              style={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 700,
                fontSize: 'clamp(34px, 4vw, 52px)',
                color: TU.navy,
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
              }}
            >
              He Was Told 3.2 Was Too Low for Michigan.
            </h2>
            <div style={{ width: 48, height: 2, background: TU.crimson, margin: '24px 0' }} />
            <blockquote
              style={{
                fontFamily: '"Fraunces", serif',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 'clamp(19px, 2.1vw, 24px)',
                lineHeight: 1.5,
                color: TU.navy,
                opacity: 0.9,
              }}
            >
              “Everyone told me Michigan was impossible with a 3.2 HS GPA. They walked me through
              building my profile and writing essays that told my story. Without their help, I’d
              still be wondering ‘what if.’”
            </blockquote>
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: TU.navy,
                opacity: 0.4,
                marginTop: 28,
              }}
            >
              Yash S., Drexel University → University of Michigan
            </div>
            <a
              href="/results"
              className="inline-block"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: TU.crimson, marginTop: 24 }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              See more turnarounds →
            </a>
          </Reveal>

          {/* RIGHT, photo + floating milestones card */}
          <Reveal delay={80}>
            <div className="relative" style={{ maxWidth: 460, marginLeft: 'auto' }}>
              <img
                src="/yash.jpg"
                alt="Yash S., admitted to the University of Michigan"
                className="w-full object-cover"
                style={{ aspectRatio: '4 / 5', borderRadius: 8, display: 'block' }}
              />
              {/* transformation tag, top-left of photo */}
              <div
                className="absolute"
                style={{ top: 16, left: 16, background: TU.navy, color: TU.offwhite, fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', padding: '8px 14px', borderRadius: 3 }}
              >
                3.2 HS GPA → Michigan
              </div>

              {/* floating milestones card, overlapping bottom-left */}
              <div
                className="absolute"
                style={{
                  left: 'clamp(-24px, -6%, -8px)',
                  bottom: 28,
                  width: 'min(74%, 300px)',
                  background: '#FFFFFF',
                  borderRadius: 8,
                  boxShadow: '0 24px 60px rgba(15,28,46,0.22)',
                  border: '1px solid rgba(15,28,46,0.06)',
                  padding: '18px 20px',
                }}
              >
                <div style={{ fontFamily: '"EB Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 600, fontSize: 17, color: TU.crimson, marginBottom: 12 }}>
                  Milestones
                </div>
                {MILESTONES.map((m) => (
                  <div key={m} className="flex items-center" style={{ gap: 9, padding: '7px 0', borderTop: m === MILESTONES[0] ? 'none' : `1px solid ${TU.divider}` }}>
                    <span className="flex items-center justify-center shrink-0" style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${TU.crimson}` }}>
                      <Check size={12} style={{ color: TU.crimson }} strokeWidth={3} />
                    </span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: TU.navy, opacity: 0.85 }}>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
