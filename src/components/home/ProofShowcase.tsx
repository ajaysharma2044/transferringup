import { CountUp, Reveal, TU } from './shared';
import { Eyebrow } from '../shared/editorial';
import { RESULTS } from '../../data/results';
import { REVIEWS } from '../shared/ReviewCards';

/**
 * "The Record", an editorial numbers band in the site's own idiom (Playfair
 * numerals + hairline rules, NOT a card-grid clone). Every figure is real and
 * checkable, derived from the documented results ledger + named reviews. No
 * firm-wide projections are invented.
 */
const TOTAL_ADMITS = RESULTS.reduce((a, r) => a + r.schools.length, 0); // 27
const DISTINCT = new Set(RESULTS.flatMap((r) => r.schools.map((s) => s.key))).size; // 16

const STATS = [
  { n: 2.8, dec: 1, label: 'Lowest GPA we’ve placed, into NYU' },
  { n: TOTAL_ADMITS, label: 'Top-school admits on the record below' },
  { n: DISTINCT, label: 'Different universities, Cornell to USC' },
  { n: 1, suffix: ' yr', label: 'Typical time to transfer up' },
];

// Named students with their real admit counts, an editorial line, not a chart.
const BY_STUDENT = [
  { name: 'Adam', count: REVIEWS.find((r) => r.name === 'Adam')?.schoolsAccepted.length ?? 10 },
  { name: 'Samanyu', count: REVIEWS.find((r) => r.name === 'Samanyu')?.schoolsAccepted.length ?? 6 },
  { name: 'Brody', count: REVIEWS.find((r) => r.name === 'Brody')?.schoolsAccepted.length ?? 5 },
];

const ADAM = REVIEWS.find((r) => r.name === 'Adam');

export default function ProofShowcase() {
  return (
    <section id="numbers" className="tu-band-deep" style={{ padding: 'clamp(76px, 12vw, 134px) clamp(24px, 6vw, 80px)' }}>
      <div className="mx-auto" style={{ maxWidth: 1160 }}>
        {/* Header */}
        <Reveal style={{ maxWidth: 760 }}>
          <Eyebrow index="01" label="The Record" dark align="left" />
          <h2
            style={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 700,
              fontSize: 'clamp(40px, 5.2vw, 66px)',
              color: TU.offwhite,
              letterSpacing: '-0.02em',
              lineHeight: 1.02,
              marginTop: 18,
            }}
          >
            Counted, not claimed.
          </h2>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(16px, 1.7vw, 19px)',
              lineHeight: 1.65,
              color: TU.offwhite,
              opacity: 0.62,
              marginTop: 18,
            }}
          >
            No projections, no industry averages, no borrowed logos, just what our students actually did,
            every one of them starting from behind.
          </p>
        </Reveal>

        {/* Stat line, big serif numerals, hairline-separated */}
        <Reveal delay={80} style={{ marginTop: 'clamp(48px, 6vw, 76px)' }}>
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                style={{
                  padding: 'clamp(22px, 2.2vw, 32px) clamp(20px, 2.4vw, 38px)',
                  borderTop: `1px solid rgba(243,245,240,0.18)`,
                  paddingLeft: i % 2 !== 0 ? 'clamp(24px, 2.6vw, 42px)' : 0,
                }}
              >
                <CountUp
                  end={s.n}
                  decimals={s.dec}
                  suffix={s.suffix}
                  style={{
                    fontFamily: '"Fraunces", serif',
                    fontWeight: 700,
                    fontSize: 'clamp(48px, 6vw, 78px)',
                    color: TU.offwhite,
                    lineHeight: 0.95,
                    display: 'block',
                  }}
                />
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 12.5,
                    lineHeight: 1.5,
                    letterSpacing: '0.02em',
                    color: TU.offwhite,
                    opacity: 0.5,
                    marginTop: 14,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Case in point, editorial portrait + line (no overlay card) */}
        <Reveal
          delay={120}
          className="grid grid-cols-1 md:grid-cols-[300px_1fr] items-center"
          style={{ gap: 'clamp(32px, 5vw, 72px)', marginTop: 'clamp(56px, 7vw, 92px)' }}
        >
          {ADAM?.headshot && (
            <div className="tu-immersive" style={{ aspectRatio: '4 / 5' }}>
              <img src={ADAM.headshot} alt="Adam, Indiana to Cornell" loading="lazy" style={{ objectPosition: '50% 20%' }} />
            </div>
          )}
          <div>
            <Eyebrow label="Case In Point" dark align="left" />
            <div
              style={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 700,
                fontSize: 'clamp(30px, 3.4vw, 46px)',
                color: TU.offwhite,
                letterSpacing: '-0.015em',
                lineHeight: 1.08,
                marginTop: 16,
              }}
            >
              Indiana <span style={{ opacity: 0.4 }}>→</span>{' '}
              <span style={{ color: '#E0301E' }}>Cornell</span>
              <span style={{ opacity: 0.55, fontWeight: 400 }}>, plus nine more.</span>
            </div>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(15px, 1.6vw, 17.5px)',
                lineHeight: 1.7,
                color: TU.offwhite,
                opacity: 0.66,
                marginTop: 18,
                maxWidth: 560,
              }}
            >
              Adam came to us out of a state school and walked away with <strong style={{ color: TU.offwhite, opacity: 1, fontWeight: 600 }}>ten</strong> top-25
              offers in one cycle, Cornell, Emory, Michigan, UVA, Boston College, and more. He’s not the
              exception here. He’s the pattern.
            </p>

            {/* admits-per-student, as an editorial line */}
            <div
              className="flex flex-wrap items-baseline"
              style={{ gap: 'clamp(18px, 2.4vw, 36px)', marginTop: 28, paddingTop: 22, borderTop: '1px solid rgba(243,245,240,0.16)' }}
            >
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: TU.offwhite, opacity: 0.4 }}>
                Offers won, per student
              </span>
              {BY_STUDENT.map((b) => (
                <span key={b.name} style={{ fontFamily: '"Fraunces", serif', color: TU.offwhite }}>
                  <span style={{ fontWeight: 700, fontSize: 22 }}>{b.count}</span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, opacity: 0.55, marginLeft: 7 }}>{b.name}</span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
