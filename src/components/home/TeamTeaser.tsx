import { Reveal, TU } from './shared';
import { Eyebrow } from '../shared/editorial';
import { TEAM, CONSULTANTS, LOGO, SCHOOL_SHORT } from './Team';
import { brand } from '../../data/results';

// Homepage glimpse of the team. Featured row: Ajay & Caleb, plus Sahaj (first-year
// advising) next to Caleb. The rest of the roster sits below. Full bios live on /about.
const FEATURED_NAMES = ['Ajay Sharma', 'Ryan Oh', 'Caleb Hong', 'Sahaj Satani'];
const FEATURED = FEATURED_NAMES
  .map((n) => TEAM.find((m) => m.name === n))
  .filter((m): m is (typeof TEAM)[number] => Boolean(m));
const REST = CONSULTANTS.filter((m) => m.photo && !FEATURED_NAMES.includes(m.name)).slice(0, 8);

/** A single school crest: logo (or a wordmark fallback) with the short name beneath. */
function Crest({ schoolKey }: { schoolKey: string }) {
  return (
    <div className="flex flex-col items-center shrink-0" style={{ gap: 5, width: 41 }}>
      <span
        title={brand(schoolKey).full}
        className="flex items-center justify-center"
        style={{ width: 35, height: 35, borderRadius: '50%', background: '#fff', border: `1px solid ${TU.divider}`, boxShadow: '0 4px 12px rgba(15,28,46,0.10)' }}
      >
        {LOGO[schoolKey] ? (
          <img src={LOGO[schoolKey]} alt={brand(schoolKey).full} loading="lazy" style={{ height: 20, width: 20, objectFit: 'contain' }} />
        ) : (
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 8, fontWeight: 800, letterSpacing: '0.01em', color: brand(schoolKey).color }}>
            {schoolKey.toUpperCase()}
          </span>
        )}
      </span>
      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 600, color: TU.navy, opacity: 0.58, textAlign: 'center', lineHeight: 1.1 }}>
        {SCHOOL_SHORT[schoolKey] ?? brand(schoolKey).full}
      </span>
    </div>
  );
}

function FeaturedCard({ m }: { m: (typeof TEAM)[number] }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        style={{
          width: 'clamp(132px, 16vw, 168px)',
          aspectRatio: '1 / 1',
          borderRadius: '50%',
          overflow: 'hidden',
          border: `1px solid ${TU.divider}`,
          background: TU.cream,
          boxShadow: '0 18px 44px rgba(15,28,46,0.14)',
        }}
      >
        <img
          src={m.photo as string}
          alt={`${m.name}, ${m.role} at TransferringUP`}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: m.objectPosition ?? 'center top' }}
        />
      </div>

      <div style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 'clamp(22px, 2.4vw, 26px)', color: TU.navy, marginTop: 18 }}>
        {m.name}
      </div>
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: TU.crimson,
          marginTop: 6,
        }}
      >
        {m.role}
      </div>

      {/* Admitted schools */}
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 12,
          fontWeight: 500,
          color: TU.navy,
          opacity: 0.55,
          marginTop: 18,
        }}
      >
        {m.fromGpa ? (
          <>From a <span style={{ fontWeight: 700, opacity: 1 }}>{m.fromGpa} GPA</span>, accepted in one year to</>
        ) : (
          'Accepted to'
        )}
      </div>
      <div className="flex flex-wrap items-start justify-center" style={{ gap: 9, marginTop: 13 }}>
        {(m.cardSchools ?? []).map((key) => (
          <Crest key={key} schoolKey={key} />
        ))}
      </div>
      {m.helpedInto && m.helpedInto.length > 0 && (
        <>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500, color: TU.navy, opacity: 0.55, marginTop: 22 }}>
            Helped students into
          </div>
          <div className="flex flex-wrap items-start justify-center" style={{ gap: 9, marginTop: 13 }}>
            {m.helpedInto.map((key) => (
              <Crest key={key} schoolKey={key} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function TeamTeaser() {
  return (
    <section id="team" style={{ background: '#FFFFFF', padding: 'clamp(72px, 12vw, 120px) clamp(24px, 6vw, 80px)' }}>
      <div className="mx-auto" style={{ maxWidth: 1080 }}>
        <Reveal className="text-center" style={{ marginBottom: 'clamp(44px, 6vw, 64px)' }}>
          <Eyebrow index="05" label="The Team" />
          <h2
            style={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 700,
              fontSize: 'clamp(34px, 4.6vw, 56px)',
              color: TU.navy,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              marginTop: 16,
            }}
          >
            Coached by people who made the move.
          </h2>
        </Reveal>

        {/* Featured, Ajay, Ryan, Caleb & Sahaj with their admitted schools */}
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start" style={{ gap: 'clamp(16px, 2vw, 28px)', maxWidth: 1120, margin: '0 auto' }}>
            {FEATURED.map((m) => (
              <FeaturedCard key={m.name} m={m} />
            ))}
          </div>
        </Reveal>

        {/* Divider */}
        <Reveal className="flex items-center" style={{ gap: 16, margin: 'clamp(48px, 7vw, 76px) auto clamp(32px, 5vw, 48px)', maxWidth: 960 }}>
          <span style={{ flex: 1, height: 1, background: TU.divider }} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: TU.navy, opacity: 0.5 }}>
            Consultants &amp; Specialists
          </span>
          <span style={{ flex: 1, height: 1, background: TU.divider }} />
        </Reveal>

        {/* The rest of the team */}
        <Reveal delay={60}>
          <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: 'clamp(20px, 3vw, 36px)', maxWidth: 960, margin: '0 auto' }}>
            {REST.map((m) => {
              const b = brand(m.schoolKey);
              return (
                <div key={m.name} className="text-center">
                  <div
                    style={{
                      width: 'clamp(92px, 12vw, 124px)',
                      aspectRatio: '1 / 1',
                      margin: '0 auto',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: `1px solid ${TU.divider}`,
                      background: TU.cream,
                    }}
                  >
                    <img
                      src={m.photo as string}
                      alt={`${m.name}, TransferringUP consultant (${m.schoolLabel ?? b.full})`}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: m.objectPosition ?? 'center top' }}
                    />
                  </div>
                  <div style={{ fontFamily: '"Fraunces", serif', fontWeight: 600, fontSize: 16, color: TU.navy, marginTop: 14 }}>
                    {m.name}
                  </div>
                  <div style={{ fontFamily: '"Fraunces", serif', fontWeight: 600, fontSize: 13, color: b.color, marginTop: 3, lineHeight: 1.25 }}>
                    {m.schoolLabel ?? b.full}
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={120} className="text-center" style={{ marginTop: 'clamp(40px, 5vw, 56px)' }}>
          <a
            href="/about"
            style={{
              display: 'inline-block',
              fontFamily: 'Inter, sans-serif',
              fontSize: 15,
              fontWeight: 600,
              color: TU.crimson,
            }}
          >
            Meet the full team →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
