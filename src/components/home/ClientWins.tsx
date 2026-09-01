import { Reveal, TU } from './shared';
import { Eyebrow } from '../shared/editorial';
import { RESULTS, brand, type ClientResult, type Acceptance } from '../../data/results';

const label = (s: Acceptance) => brand(s.key).full + (s.note ? ` (${s.note})` : '');

function WinCard({ win, delay }: { win: ClientResult; delay: number }) {
  const headline = label(win.schools[0]);
  const rest = win.schools.slice(1).map(label);
  return (
    <Reveal
      delay={delay}
      className="flex flex-col"
      style={{
        background: 'rgba(243,245,240,0.05)',
        border: '1px solid rgba(243,245,240,0.1)',
        borderRadius: 6,
        padding: '30px 28px',
      }}
    >
      {/* Starting point */}
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: TU.offwhite,
          opacity: 0.45,
        }}
      >
        {win.start}
        {win.note ? ` · ${win.note}` : ''}
      </div>

      {/* Headline acceptance */}
      <div
        className="flex items-baseline"
        style={{ gap: 10, marginTop: 8 }}
      >
        <span style={{ color: TU.crimson, fontSize: 22, lineHeight: 1 }}>→</span>
        <span
          style={{
            fontFamily: '"Fraunces", serif',
            fontWeight: 700,
            fontSize: 28,
            color: TU.offwhite,
            lineHeight: 1.1,
          }}
        >
          {headline}
        </span>
      </div>

      {/* The rest of the acceptances */}
      {rest.length > 0 && (
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 13.5,
            lineHeight: 1.6,
            color: TU.offwhite,
            opacity: 0.6,
            marginTop: 12,
          }}
        >
          {rest.join('  ·  ')}
        </div>
      )}

      {/* Count tag */}
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: TU.crimson,
          marginTop: 'auto',
          paddingTop: 20,
        }}
      >
        {win.schools.length} {win.schools.length === 1 ? 'Acceptance' : 'Acceptances'} · One Transfer Cycle
      </div>
    </Reveal>
  );
}

export default function ClientWins() {
  return (
    <section id="wins" style={{ background: TU.navy, padding: 'clamp(72px, 12vw, 128px) clamp(24px, 6vw, 80px)' }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <Reveal className="text-center" style={{ marginBottom: 56 }}>
          <Eyebrow index="04" label="Client Wins" dark style={{ marginBottom: 18 }} />
          <p
            style={{
              fontFamily: '"Fraunces", serif',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 22,
              color: TU.offwhite,
              opacity: 0.6,
            }}
          >
            Real students. Real outcomes.
          </p>
          <h2
            style={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 700,
              fontSize: 'clamp(44px, 5vw, 68px)',
              color: TU.offwhite,
              letterSpacing: '-0.02em',
              lineHeight: 1.0,
              marginTop: 8,
            }}
          >
            Recent Client Wins
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESULTS.map((win, i) => (
            <WinCard key={i} win={win} delay={(i % 3) * 80} />
          ))}
        </div>

        <Reveal className="text-center" style={{ marginTop: 56 }}>
          <a
            href="/results"
            className="inline-block transition-opacity duration-200"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: TU.offwhite, opacity: 0.55 }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.55')}
          >
            View all results →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
