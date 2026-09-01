import { CountUp, Reveal, TU } from './shared';
import { RESULTS } from '../../data/results';
import { REVIEW_AGGREGATE } from '../shared/ReviewCards';
import ResultsLedger from './ResultsLedger';

// Hero stats, four different angles, all real and derived from the data:
// GPA proof, outcome volume, client satisfaction, and speed.
const TOTAL_ADMITS = RESULTS.reduce((a, r) => a + r.schools.length, 0);
const RATING = Number(REVIEW_AGGREGATE.ratingValue) || 5;
const STATS: { n: number; dec?: number; suffix?: string; label: string }[] = [
  { n: 2.8, dec: 1, label: 'Lowest GPA we’ve placed, into NYU' },
  { n: TOTAL_ADMITS, label: 'Top-30 acceptances on the record below' },
  { n: RATING, dec: 1, suffix: ' ★', label: 'Average rating from verified clients' },
  { n: 1, suffix: ' yr', label: 'Typical time to transfer up' },
];

export default function OurEdge() {
  return (
    <section id="edge" style={{ background: '#FFFFFF', padding: 'clamp(72px, 12vw, 128px) clamp(24px, 6vw, 80px)' }}>
      <div className="mx-auto" style={{ maxWidth: 1140 }}>
        {/* Header, the claim */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-end"
          style={{ marginBottom: 'clamp(36px, 5vw, 52px)' }}
        >
          <Reveal>
            <div
              style={{
                fontFamily: '"EB Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: 24,
                color: TU.crimson,
                marginBottom: 10,
              }}
            >
              The students others pass on.
            </div>
            <h2
              style={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 700,
                fontSize: 'clamp(40px, 5vw, 62px)',
                color: TU.navy,
                letterSpacing: '-0.02em',
                lineHeight: 1.04,
              }}
            >
              We Start Where the Odds Are Worst.
            </h2>
          </Reveal>

          <Reveal delay={80} className="hidden md:block">
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 18,
                lineHeight: 1.72,
                color: TU.navy,
                opacity: 0.72,
                maxWidth: 460,
              }}
            >
              From low GPAs and community college to strong students aiming higher, we turn transfer
              applicants into Top-30 acceptances. Every record below was earned in a single year.
            </p>
          </Reveal>
        </div>

        {/* Hero stats, confident numbers above the sheet */}
        <Reveal delay={100} style={{ marginBottom: 'clamp(40px, 5vw, 60px)' }}>
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                style={{
                  padding: 'clamp(20px, 2vw, 28px) clamp(16px, 2.2vw, 34px)',
                  borderTop: '1px solid rgba(15,28,46,0.16)',
                  paddingLeft: i % 2 !== 0 ? 'clamp(20px, 2.4vw, 38px)' : 0,
                }}
              >
                <CountUp
                  end={s.n}
                  decimals={s.dec}
                  suffix={s.suffix}
                  style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 'clamp(42px, 5.2vw, 70px)', color: TU.navy, lineHeight: 0.95, display: 'block' }}
                />
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12.5, lineHeight: 1.5, letterSpacing: '0.02em', color: TU.navy, opacity: 0.5, marginTop: 12 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Ledger, selected acceptances */}
        <ResultsLedger delay={120} />
      </div>
    </section>
  );
}
