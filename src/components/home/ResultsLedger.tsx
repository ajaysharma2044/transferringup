import { Reveal, TU } from './shared';
import { RESULTS, brand, isPublic } from '../../data/results';

// The most selective admits carry a quiet gold dagger so the eye lands on the wins.
const TROPHY = new Set(['cornell', 'northwestern', 'georgetown', 'notredame', 'columbia', 'emory', 'uchicago', 'brown']);
const isTrophy = (key: string, note?: string) => TROPHY.has(key) || (key === 'nyu' && note === 'Stern');

// The light, editorial "started with → accepted to" ledger. Shared by the
// homepage edge section and the full /results page so the style stays identical.
export default function ResultsLedger({ delay = 0 }: { delay?: number }) {
  return (
    <Reveal delay={delay}>
      {/* couture rule: a short gold accent above a hairline */}
      <div aria-hidden style={{ width: 54, height: 2, background: TU.gold, borderRadius: 1, marginBottom: 16 }} />
      <div
        className="columns-1 lg:columns-2"
        style={{ columnGap: 'clamp(36px, 5vw, 80px)', borderTop: '1px solid rgba(15,28,46,0.14)', borderBottom: '1px solid rgba(15,28,46,0.14)' }}
      >
        {RESULTS.map((r, i) => {
          const isGpa = /HS GPA/.test(r.start);
          const value = isGpa ? r.start.replace(/\s*HS GPA.*/, '') : r.start;
          const label = isGpa ? `HS GPA${r.note ? ` · ${r.note}` : ''}` : r.note || 'Transfer';
          return (
            <div
              key={i}
              className="grid"
              style={{
                breakInside: 'avoid',
                alignItems: 'baseline',
                gridTemplateColumns: 'minmax(78px, 116px) 1fr',
                gap: 'clamp(16px, 2vw, 34px)',
                padding: 'clamp(22px, 2.6vw, 30px) 0',
                borderBottom: '1px solid rgba(15,28,46,0.1)',
              }}
            >
              {/* Started with, baseline aligns to the first school name */}
              <div>
                <span
                  style={{
                    fontFamily: '"Fraunces", serif',
                    fontWeight: 700,
                    fontSize: isGpa ? 'clamp(28px, 3vw, 38px)' : 'clamp(18px, 1.9vw, 23px)',
                    color: TU.navy,
                    lineHeight: 1,
                    display: 'block',
                  }}
                >
                  {value}
                </span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: TU.navy, opacity: 0.4, marginTop: 7, display: 'block' }}>
                  {label}
                </span>
              </div>

              {/* Accepted to, stacks name-over-tags on phones, name | right-aligned
                  tags on tablet+. Prevents the tag column from colliding with long
                  school names on narrow screens. */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.4vw, 13px)', minWidth: 0 }}>
                {r.schools.map((s, j) => {
                  const b = brand(s.key);
                  const isSchol = !!s.note && /scholarship/i.test(s.note);
                  const trophy = isTrophy(s.key, s.note);
                  const annos: { id: string; label: string; color: string }[] = [];
                  if (isPublic(s.key) && !s.inState) annos.push({ id: 'oos', label: 'Out of State', color: '#3D4D66' });
                  if (s.note) annos.push({ id: 'note', label: s.note, color: isSchol ? '#9A7B1F' : b.color });
                  return (
                    <div key={j} className="flex flex-col md:flex-row md:items-baseline" style={{ rowGap: 4, columnGap: 14, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: '"Fraunces", serif',
                          fontWeight: trophy ? 700 : 600,
                          fontSize: 'clamp(15px, 1.45vw, 19px)',
                          lineHeight: 1.2,
                          color: b.color,
                          minWidth: 0,
                        }}
                      >
                        {b.full}
                      </div>
                      {annos.length > 0 && (
                        <div className="flex flex-col items-start md:items-end md:ml-auto" style={{ gap: 4, flexShrink: 0 }}>
                          {annos.map((a) => (
                            <span key={a.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
                              <span aria-hidden style={{ width: 1, height: '0.95em', background: a.color, opacity: 0.4 }} />
                              <span
                                style={{
                                  fontFamily: 'Inter, sans-serif',
                                  fontWeight: 700,
                                  fontSize: 10,
                                  letterSpacing: '0.14em',
                                  textTransform: 'uppercase',
                                  color: a.color,
                                }}
                              >
                                {a.label}
                              </span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}
