import { Reveal, TU } from './shared';

export default function TwoPath() {
  return (
    <section id="paths">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT, low GPA (cream) */}
        <Reveal
          className="flex flex-col justify-center"
          style={{ background: TU.cream, padding: '112px clamp(24px, 8vw, 72px)' }}
        >
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: TU.crimson,
            }}
          >
            Low High School GPA
          </div>
          <h3
            style={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 700,
              fontSize: 'clamp(32px, 3.5vw, 44px)',
              color: TU.navy,
              lineHeight: 1.12,
              marginTop: 16,
            }}
          >
            The Odds Were
            <br />
            Stacked Against You.
          </h3>
          <div style={{ width: 40, height: 2, background: TU.crimson, margin: '24px 0' }} />
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 18,
              lineHeight: 1.7,
              color: TU.navy,
              opacity: 0.7,
              maxWidth: 460,
            }}
          >
            Your GPA is the hand you were dealt. We play it better than anyone. The same system
            that got our founder into Cornell with a 2.9 is the one we run for every client we
            take on.
          </p>
          <a
            href="#apply"
            className="inline-block"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 15,
              color: TU.crimson,
              marginTop: 28,
              width: 'fit-content',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            Start With a Low GPA →
          </a>
        </Reveal>

        {/* RIGHT, strong GPA (navy) */}
        <Reveal
          delay={80}
          className="flex flex-col justify-center"
          style={{ background: TU.navy, padding: '112px clamp(24px, 8vw, 72px)' }}
        >
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: TU.offwhite,
              opacity: 0.45,
            }}
          >
            Strong High School GPA
          </div>
          <h3
            style={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 700,
              fontSize: 'clamp(32px, 3.5vw, 44px)',
              color: TU.offwhite,
              lineHeight: 1.12,
              marginTop: 16,
            }}
          >
            The System Failed You.
            <br />
            We Fix That.
          </h3>
          <div
            style={{
              width: 40,
              height: 2,
              background: 'rgba(243,245,240,0.25)',
              margin: '24px 0',
            }}
          />
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 18,
              lineHeight: 1.7,
              color: TU.offwhite,
              opacity: 0.65,
              maxWidth: 460,
            }}
          >
            Strong GPA. Did everything right. Still got the thin envelope. Freshman admissions is
            a lottery. The transfer process is a different game, one with rules we’ve mastered.
          </p>
          <a
            href="#apply"
            className="inline-block"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 15,
              color: TU.offwhite,
              marginTop: 28,
              width: 'fit-content',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            Start With a Strong Profile →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
