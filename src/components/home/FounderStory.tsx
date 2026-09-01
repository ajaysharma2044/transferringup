import { Reveal, TU } from './shared';
import { Eyebrow } from '../shared/editorial';

export default function FounderStory() {
  return (
    <section id="founder" style={{ background: TU.cream }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
        {/* LEFT, text */}
        <Reveal className="flex flex-col justify-center" style={{ padding: 'clamp(56px, 7vw, 88px) clamp(24px, 7vw, 56px)' }}>
          <Eyebrow index="04" label="The Founder" align="left" style={{ marginBottom: 24 }} />

          <h2
            style={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 700,
              fontSize: 'clamp(40px, 4.5vw, 60px)',
              color: TU.navy,
              lineHeight: 1.06,
              letterSpacing: '-0.02em',
            }}
          >
            He Did It First.
            <br />
            Then He Built
            <br />
            The System.
          </h2>

          <div style={{ width: 48, height: 2, background: TU.crimson, margin: '28px 0' }} />

          <div style={{ maxWidth: 460 }}>
            <p
              className="tu-dropcap"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 18, lineHeight: 1.72, color: TU.navy, opacity: 0.78 }}
            >
              Freshman year of high school, I had a 1.25 GPA, ranked 399 of 411. A wake-up call in
              India flipped the switch, and from April to August I obsessed over the transfer
              process and built a blueprint. One year later, I was at Cornell.
            </p>

            {/* Pull quote */}
            <blockquote
              style={{
                borderLeft: `3px solid ${TU.crimson}`,
                paddingLeft: 22,
                margin: '26px 0',
                fontFamily: '"Fraunces", serif',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 'clamp(22px, 2.4vw, 28px)',
                lineHeight: 1.4,
                color: TU.navy,
              }}
            >
              “Now I help other underdogs do what I did.”
            </blockquote>
          </div>

          {/* Signature */}
          <div style={{ marginTop: 30 }}>
            <div
              style={{
                fontFamily: '"Fraunces", serif',
                fontStyle: 'italic',
                fontSize: 26,
                color: TU.navy,
                opacity: 0.85,
              }}
            >
              Ajay Sharma
            </div>
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: TU.navy,
                opacity: 0.4,
                marginTop: 4,
              }}
            >
              Founder · Cornell University
            </div>
          </div>

          <a
            href="/about"
            className="group inline-flex items-center"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: TU.crimson, marginTop: 26, width: 'fit-content' }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            Read my full story
            <span className="transition-transform duration-200 group-hover:translate-x-1" style={{ marginLeft: 6 }}>
              →
            </span>
          </a>
        </Reveal>

        {/* RIGHT, circular portrait pinned to the top-right */}
        <div className="relative flex items-start justify-center" style={{ background: TU.cream, padding: 'clamp(48px, 6vw, 88px) clamp(36px, 6vw, 80px)' }}>
          <div className="flex flex-col items-center" style={{ position: 'relative', width: '100%', maxWidth: 300 }}>
            {/* warm halo so the portrait sits on something, not floating on flat cream */}
            <div
              aria-hidden
              style={{ position: 'absolute', top: '-12%', left: '50%', transform: 'translateX(-50%)', width: '130%', aspectRatio: '1', borderRadius: '50%', background: 'radial-gradient(circle, rgba(122,0,0,0.06) 0%, rgba(248,244,238,0) 70%)', pointerEvents: 'none' }}
            />
            <img
              src="/ajay-linkedin.jpg"
              alt="Ajay Sharma, Founder of TransferringUP, Cornell University"
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
                objectFit: 'cover',
                objectPosition: 'center 12%',
                borderRadius: '50%',
                border: '5px solid #FFFFFF',
                boxShadow: '0 28px 60px rgba(15,28,46,0.24)',
                display: 'block',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 22 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: TU.crimson }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, letterSpacing: '0.04em', fontWeight: 600, color: TU.navy }}>
                Ajay Sharma · Cornell University
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
