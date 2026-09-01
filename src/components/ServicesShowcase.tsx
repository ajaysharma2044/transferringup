import { TU } from './home/shared';

const SERVICES: { name: string; tagline: string }[] = [
  { name: 'Transfer Strategy', tagline: 'School selection, credit mapping & a single-cycle plan' },
  { name: 'Narrative & Essays', tagline: 'Your story and every essay, built and refined' },
  { name: 'Recommendation Letters', tagline: 'The right recommenders, positioned to land' },
  { name: 'Extracurriculars & Leadership', tagline: 'A profile that stands out beyond the numbers' },
  { name: 'Research & Internships', tagline: 'Real experience that backs your major' },
  { name: 'Awards & Honors', tagline: 'Competitions, scholarships & recognition that set you apart' },
  { name: '24/7 Support', tagline: 'Text access and weekly calls, start to finish' },
];

export default function ServicesShowcase() {
  return (
    <div>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: TU.crimson }}>
        What We Help With
      </div>
      <h2 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 'clamp(28px, 3.4vw, 42px)', color: TU.navy, letterSpacing: '-0.015em', lineHeight: 1.06, marginTop: 14 }}>
        Everything your transfer needs.
      </h2>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, lineHeight: 1.6, color: TU.navy, opacity: 0.7, marginTop: 14, maxWidth: 440 }}>
        One package, the entire move, and on your call, we map exactly which of these you need.
      </p>

      <div style={{ marginTop: 'clamp(26px, 3.4vw, 36px)', borderTop: `1px solid ${TU.divider}` }}>
        {SERVICES.map(({ name, tagline }, i) => (
          <div
            key={name}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 20,
              padding: 'clamp(15px, 1.9vw, 20px) 0',
              borderBottom: `1px solid ${TU.divider}`,
            }}
          >
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: TU.crimson,
                flexShrink: 0,
                width: 26,
                paddingTop: 2,
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 style={{ fontFamily: '"Fraunces", serif', fontWeight: 600, fontSize: 'clamp(18px, 1.9vw, 21px)', color: TU.navy, lineHeight: 1.2 }}>
                {name}
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, lineHeight: 1.5, color: TU.navy, opacity: 0.6, marginTop: 4 }}>
                {tagline}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 13,
          fontStyle: 'italic',
          lineHeight: 1.55,
          color: TU.navy,
          opacity: 0.5,
          marginTop: 18,
          maxWidth: 460,
        }}
      >
        Your strategy call is a walkthrough of how our program handles each of these for your
        specific transfer, so you see exactly what working with us looks like.
      </p>
    </div>
  );
}
