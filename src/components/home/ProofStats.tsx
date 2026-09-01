import { CountUp, Reveal, TU } from './shared';
import { Eyebrow } from '../shared/editorial';

type Stat = {
  end: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

const STATS: Stat[] = [
  { end: 2.9, decimals: 1, label: "Founder's Incoming GPA" },
  { end: 5, label: 'T30 Acceptances In Year One' },
  { end: 1, suffix: ' YR', label: 'Average Time To Placement' },
  { end: 50, suffix: '+', label: 'Students Placed At T30 Schools' },
];

export default function ProofStats() {
  return (
    <section
      id="track-record"
      style={{ background: TU.offwhite, padding: 'clamp(72px, 12vw, 128px) clamp(24px, 6vw, 80px)' }}
    >
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        {/* Header */}
        <Reveal className="text-center">
          <Eyebrow index="01" label="The Record" style={{ marginBottom: 18 }} />
          <p
            style={{
              fontFamily: '"Fraunces", serif',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 22,
              color: TU.navy,
              opacity: 0.6,
            }}
          >
            The numbers don’t lie.
          </p>
          <h2
            style={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 700,
              fontSize: 'clamp(44px, 5vw, 64px)',
              color: TU.navy,
              letterSpacing: '-0.02em',
              lineHeight: 1.0,
              marginTop: 8,
            }}
          >
            Transferring Up’s Track Record
          </h2>
          <p
            className="mx-auto"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 18,
              lineHeight: 1.65,
              color: TU.navy,
              opacity: 0.65,
              maxWidth: 540,
              marginTop: 20,
            }}
          >
            Results from our clients, from 2.9 GPAs to strong profiles the system failed the
            first time around.
          </p>
        </Reveal>

        {/* Divider */}
        <div
          style={{
            height: 1,
            width: '70%',
            background: 'rgba(15,28,46,0.12)',
            margin: '56px auto',
          }}
        />

        {/* 2x2 stat grid */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              delay={(i % 2) * 80}
              style={{
                borderRight: '1px solid rgba(15,28,46,0.1)',
                borderBottom: '1px solid rgba(15,28,46,0.1)',
                padding: '56px 48px',
              }}
            >
              <CountUp
                end={s.end}
                decimals={s.decimals}
                prefix={s.prefix}
                suffix={s.suffix}
                style={{
                  fontFamily: '"Fraunces", serif',
                  fontWeight: 700,
                  fontSize: 'clamp(72px, 9vw, 96px)',
                  color: TU.navy,
                  lineHeight: 1,
                  display: 'block',
                }}
              />
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: TU.navy,
                  opacity: 0.45,
                  marginTop: 14,
                }}
              >
                {s.label}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
