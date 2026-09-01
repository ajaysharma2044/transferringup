import { Reveal, TU } from './shared';
import { Eyebrow, PortraitPlaceholder } from '../shared/editorial';
import { REVIEWS } from '../shared/ReviewCards';

const SAMANYU = REVIEWS.find((r) => r.name === 'Samanyu');

/** §B6, recovery band: a stat about the visitor's exact painful situation + a named face. */
export default function RecoveryBand() {
  return (
    <section className="tu-band-deep" style={{ padding: 'clamp(80px, 12vw, 132px) clamp(24px, 6vw, 80px)' }}>
      <div
        className="mx-auto grid grid-cols-1 lg:grid-cols-[1.35fr_0.85fr] gap-12 lg:gap-16 items-center"
        style={{ maxWidth: 1100 }}
      >
        {/* Stat / copy */}
        <Reveal>
          <Eyebrow index="03" label="The Re-Route" dark align="left" />
          <h2
            style={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 700,
              fontSize: 'clamp(32px, 4vw, 52px)',
              color: TU.offwhite,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginTop: 20,
            }}
          >
            Most of our students came to us <span style={{ color: TU.gold }}>after a rejection</span>, and
            transferred up.
          </h2>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(17px, 1.8vw, 20px)',
              lineHeight: 1.7,
              color: TU.offwhite,
              opacity: 0.72,
              marginTop: 22,
              maxWidth: 540,
            }}
          >
            A 3.47 at Riverside that first semester. A 3.5 with a C in Calc 1. Starting behind is the normal starting point here.
            Rejected isn’t the end of the story, it’s the re-route.
          </p>
        </Reveal>

        {/* Named face */}
        <Reveal delay={80}>
          <div style={{ maxWidth: 320, marginLeft: 'auto' }}>
            {SAMANYU?.headshot ? (
              <div className="tu-immersive" style={{ aspectRatio: '4 / 5' }}>
                <img src={SAMANYU.headshot} alt="Samanyu, UC Riverside to UVA" loading="lazy" />
              </div>
            ) : (
              <PortraitPlaceholder name="Samanyu" ratio="4 / 5" rounded={10} />
            )}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 20, color: TU.offwhite }}>
                Samanyu
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: TU.offwhite, opacity: 0.6, marginTop: 3 }}>
                UC Riverside <span style={{ color: TU.gold }}>→</span> UVA
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
