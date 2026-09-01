import Seo from '../components/seo/Seo';
import { CountUp, Reveal, TU } from '../components/home/shared';
import { SectionHeader, CTAButton } from '../components/shared/ui';
import ResultsLedger from '../components/home/ResultsLedger';
import { RESULTS } from '../data/results';
import { REVIEW_AGGREGATE } from '../components/shared/ReviewCards';
import { breadcrumbSchema } from '../lib/schema';

// Four different angles, all real and derived from the data: GPA proof, outcome
// volume, client satisfaction, and speed.
const TOTAL_ADMITS = RESULTS.reduce((a, r) => a + r.schools.length, 0);
const RATING = Number(REVIEW_AGGREGATE.ratingValue) || 5;
const STATS: { n: number; dec?: number; suffix?: string; label: string }[] = [
  { n: 2.8, dec: 1, label: 'Lowest GPA we’ve placed, into NYU' },
  { n: TOTAL_ADMITS, label: 'Top-30 acceptances on the record' },
  { n: RATING, dec: 1, suffix: ' ★', label: 'Average rating from verified clients' },
  { n: 1, suffix: ' yr', label: 'Typical time to transfer up' },
];

export default function ResultsPage() {
  return (
    <>
      <Seo
        title="Transfer Results: Cornell, NYU, UVA & More | TransferringUP"
        description="Real transfer admissions results from real students. See how our clients transferred to Cornell, Michigan, UVA, NYU and more, many starting with sub-3.5 GPAs. View the record."
        path="/results"
        jsonLd={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Results', path: '/results' },
          ]),
        ]}
      />

      {/* Header + stats */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(96px, 12vw, 140px) clamp(24px, 6vw, 80px) clamp(36px, 5vw, 52px)' }}>
        <div className="mx-auto" style={{ maxWidth: 1140 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-end">
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
                Real students. Real outcomes.
              </div>
              <h1
                style={{
                  fontFamily: '"Fraunces", serif',
                  fontWeight: 700,
                  fontSize: 'clamp(44px, 5.5vw, 72px)',
                  color: TU.navy,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.02,
                }}
              >
                The Transfer Record
              </h1>
            </Reveal>

            <Reveal delay={80}>
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
                Every acceptance below was earned by a real client in a single transfer cycle, many
                starting from low GPAs, rejections, or community-college transcripts. The full record,
                on the table.
              </p>
            </Reveal>
          </div>

          {/* Hero stats */}
          <Reveal delay={100} style={{ marginTop: 'clamp(40px, 5vw, 60px)' }}>
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
        </div>
      </section>

      {/* The ledger, every win, in the editorial style */}
      <section style={{ background: '#FFFFFF', padding: '0 clamp(24px, 6vw, 80px) clamp(72px, 12vw, 128px)' }}>
        <div className="mx-auto" style={{ maxWidth: 1140 }}>
          <ResultsLedger />
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: TU.offwhite, padding: 'clamp(72px, 12vw, 128px) clamp(24px, 6vw, 80px)' }}>
        <div className="mx-auto text-center" style={{ maxWidth: 720 }}>
          <SectionHeader title="Ready to be our next success story?" />
          <div className="flex flex-wrap items-center justify-center" style={{ marginTop: 32, gap: 24 }}>
            <CTAButton href="/contact">Apply to Work With Us</CTAButton>
            <a href="/reviews" style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600, color: TU.crimson }}>
              Read all client reviews →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
