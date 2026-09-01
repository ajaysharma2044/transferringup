import { Reveal, TU } from './shared';

/**
 * Brand manifesto, a bold full-bleed crimson band carrying the firm's
 * "we take the hard cases" stance (imported from the original site, with the
 * old guarantee language removed).
 */
export default function Manifesto() {
  return (
    <section
      id="standard"
      style={{
        background: `linear-gradient(150deg, ${TU.crimson} 0%, #5e0000 52%, #3a0000 100%)`,
        padding: 'clamp(96px, 14vw, 164px) clamp(24px, 6vw, 80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* faint oversized backdrop glyph for depth */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: '-6%',
          right: '2%',
          fontFamily: '"Fraunces", serif',
          fontSize: 'clamp(300px, 38vw, 560px)',
          lineHeight: 1,
          fontWeight: 700,
          color: '#FFFFFF',
          opacity: 0.04,
          pointerEvents: 'none',
        }}
      >
        ”
      </span>

      <div className="mx-auto relative" style={{ maxWidth: 1000 }}>
        <Reveal className="flex items-center justify-center" style={{ gap: 12, marginBottom: 24 }}>
          <span style={{ width: 26, height: 1, background: TU.gold }} />
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: TU.gold,
            }}
          >
            Our Standard
          </span>
          <span style={{ width: 26, height: 1, background: TU.gold }} />
        </Reveal>

        <Reveal delay={60}>
          <h2
            className="text-center"
            style={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 700,
              fontSize: 'clamp(42px, 6vw, 78px)',
              color: TU.cream,
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
            }}
          >
            We Don’t Pick the Easy Cases.
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <p
            className="text-center mx-auto"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(17px, 1.9vw, 21px)',
              lineHeight: 1.72,
              color: TU.cream,
              opacity: 0.85,
              maxWidth: 770,
              marginTop: 28,
            }}
          >
            Other firms take the strong profiles, submit clean applications, and take credit for
            outcomes that were going to happen anyway. We take the hard cases, the low GPAs, the
            bad starts, the students everyone else turned away. And we still get them into the
            schools that wrote them off.
          </p>
        </Reveal>

        <Reveal delay={180}>
          <p
            className="text-center"
            style={{
              fontFamily: '"Fraunces", serif',
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 'clamp(22px, 2.6vw, 30px)',
              color: TU.gold,
              marginTop: 34,
            }}
          >
            That’s not a business model. That’s personal.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
