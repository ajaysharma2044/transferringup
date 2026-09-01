import { Reveal, TU } from './shared';
import { Eyebrow } from '../shared/editorial';

const CAMPUSES = [
  { name: 'Cornell University', src: '/images/campus-cornell.jpg' },
  { name: 'University of Michigan', src: '/images/campus-michigan.jpg' },
  { name: 'University of Virginia', src: '/images/campus-uva.jpg' },
];

function CampusCard({ name, src, delay }: { name: string; src: string; delay: number }) {
  return (
    <Reveal delay={delay}>
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 3', borderRadius: 6 }}>
        <img
          src={src}
          alt={`${name} campus`}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div className="absolute inset-x-0 bottom-0" style={{ background: 'linear-gradient(to top, rgba(15,28,46,0.85), transparent)', padding: '40px 18px 16px' }}>
          <div className="flex items-center" style={{ gap: 9 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: TU.crimson }} />
            <span style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 18, color: TU.offwhite }}>
              {name}
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function CampusBand() {
  return (
    <section id="destination" style={{ background: TU.cream, padding: 'clamp(72px, 12vw, 128px) clamp(24px, 6vw, 80px)' }}>
      <div className="mx-auto" style={{ maxWidth: 1180 }}>
        <div className="text-center" style={{ marginBottom: 48 }}>
          <Reveal>
            <Eyebrow index="06" label="The Destination" />
          </Reveal>
          <Reveal delay={60}>
            <h2
              style={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 700,
                fontSize: 'clamp(44px, 5vw, 68px)',
                color: TU.navy,
                letterSpacing: '-0.02em',
                lineHeight: 1.0,
                marginTop: 18,
              }}
            >
              This Time Next Year
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p
              className="mx-auto"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 18, lineHeight: 1.6, color: TU.navy, opacity: 0.65, maxWidth: 560, marginTop: 18 }}
            >
              The campus you were told was out of reach. One focused year is the difference
              between wondering and walking through the gates.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {CAMPUSES.map((c, i) => (
            <CampusCard key={c.name} name={c.name} src={c.src} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
