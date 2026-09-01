import { CountUp, Reveal, TU } from './shared';
import { Eyebrow } from '../shared/editorial';
import { SCHOOLS } from '../../data/schools';

const STATS = [
  { end: 50, suffix: '+', label: 'Students Placed' },
  { end: 15, suffix: '+', label: 'T30 Schools' },
  { end: 1, suffix: ' Yr', label: 'Average Timeline' },
];

export default function AcceptanceWall() {
  return (
    <section id="outcomes" style={{ background: TU.navy, padding: 'clamp(72px, 12vw, 128px) clamp(24px, 6vw, 80px)' }}>
      <div className="mx-auto" style={{ maxWidth: 1120 }}>
        {/* Header */}
        <div className="text-center">
          <Reveal>
            <Eyebrow index="02" label="The Outcomes" dark />
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
              Where Our Students End Up
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p
              className="mx-auto"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 16,
                lineHeight: 1.6,
                color: TU.offwhite,
                opacity: 0.55,
                maxWidth: 560,
                marginTop: 20,
              }}
            >
              The honest part: most of our clients started with sub-3.5 GPAs. Your number is a
              starting point, not a verdict.
            </p>
          </Reveal>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-3 gap-4" style={{ maxWidth: 760, margin: '48px auto 0' }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="text-center">
              <CountUp
                end={s.end}
                suffix={s.suffix}
                style={{
                  fontFamily: '"Fraunces", serif',
                  fontWeight: 700,
                  fontSize: 'clamp(40px, 6vw, 64px)',
                  color: TU.offwhite,
                  lineHeight: 1,
                  display: 'block',
                }}
              />
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: TU.offwhite,
                  opacity: 0.5,
                  marginTop: 10,
                }}
              >
                {s.label}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Acceptance wall, dense crest grid */}
        <Reveal
          delay={120}
          className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 mt-16"
          style={{ borderTop: '1px solid rgba(243,245,240,0.1)', borderLeft: '1px solid rgba(243,245,240,0.1)', marginTop: 72 }}
        >
          {SCHOOLS.map((s) => (
            <div
              key={s.name}
              className="group flex flex-col items-center justify-center text-center transition-colors duration-300"
              style={{
                borderRight: '1px solid rgba(243,245,240,0.1)',
                borderBottom: '1px solid rgba(243,245,240,0.1)',
                padding: '28px 14px',
                gap: 12,
                minHeight: 132,
              }}
            >
              <img
                src={s.logo}
                alt={s.name}
                loading="lazy"
                className="transition-all duration-300"
                style={{ height: 40, width: 'auto', objectFit: 'contain', filter: 'grayscale(100%)', opacity: 0.55 }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'grayscale(0%)';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'grayscale(100%)';
                  e.currentTarget.style.opacity = '0.55';
                }}
              />
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 11,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: TU.offwhite,
                  opacity: 0.45,
                }}
              >
                {s.short}
              </span>
            </div>
          ))}
          {/* "+ more" cell */}
          <div
            className="flex items-center justify-center text-center"
            style={{
              borderRight: '1px solid rgba(243,245,240,0.1)',
              borderBottom: '1px solid rgba(243,245,240,0.1)',
              padding: '28px 14px',
              minHeight: 132,
            }}
          >
            <span
              style={{
                fontFamily: '"Fraunces", serif',
                fontStyle: 'italic',
                fontSize: 20,
                color: TU.offwhite,
                opacity: 0.5,
              }}
            >
              & more
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
