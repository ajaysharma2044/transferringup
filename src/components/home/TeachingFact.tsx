import { Reveal, TU } from './shared';
import { Eyebrow } from '../shared/editorial';

/** §B5, the teaching fact: demonstrate expertise with a checkable, counterintuitive stat. */
export default function TeachingFact() {
  return (
    <section className="tu-band-deep" style={{ padding: 'clamp(80px, 12vw, 132px) clamp(24px, 6vw, 80px)' }}>
      <div className="mx-auto" style={{ maxWidth: 940 }}>
        <Reveal>
          <Eyebrow index="02" label="The Part Nobody Explains" dark align="left" />
        </Reveal>
        <Reveal delay={60}>
          <h2
            style={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 700,
              fontSize: 'clamp(34px, 4.4vw, 56px)',
              color: TU.offwhite,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              marginTop: 22,
            }}
          >
            Transfer admissions is a different game.
            <br />
            Most families never learn the rules.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(17px, 1.8vw, 20px)',
              lineHeight: 1.72,
              color: TU.offwhite,
              opacity: 0.72,
              marginTop: 26,
              maxWidth: 840,
            }}
          >
            At the most selective schools, transfer acceptance rates fall{' '}
            <strong style={{ color: TU.gold, opacity: 1, fontWeight: 700 }}>below 2%</strong>, often lower than
            freshman admission. But it isn’t uniform: some strong schools admit a higher share of transfers than
            freshmen. Which means the entire strategy, which schools, which essays, which timeline, is different
            from the one you were told about in high school. Knowing that map is the difference between a wasted
            cycle and an acceptance.
          </p>
        </Reveal>
        <Reveal delay={160}>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              letterSpacing: '0.04em',
              color: TU.offwhite,
              opacity: 0.38,
              marginTop: 20,
            }}
          >
            Source: NACAC, State of College Admission.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
