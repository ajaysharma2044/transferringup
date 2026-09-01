import { Reveal, TU, useInView } from './shared';
import { Eyebrow } from '../shared/editorial';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type Feature = {
  tag: string;
  title: string;
  body: string;
};

const FEATURES: Feature[] = [
  {
    tag: 'Transfer Strategy',
    title: 'A plan built around your starting point.',
    body:
      'School selection, credit mapping, GPA trajectory, and a single-cycle application timeline, engineered around exactly where you stand today, not a generic template.',
  },
  {
    tag: 'Narrative & Essays',
    title: 'A story only you can tell.',
    body:
      "We build your personal narrative from the ground up and craft every essay in your application, personal statement to the last supplement, through unlimited rounds until it's undeniable.",
  },
  {
    tag: 'Recommendation Letters',
    title: 'Letters that actually move the needle.',
    body:
      'We help you choose the right recommenders, approach them the right way, and give them what they need to write a letter that backs your story, instead of restating your résumé.',
  },
  {
    tag: 'Extracurriculars & Leadership',
    title: 'A profile that stands out beyond the numbers.',
    body:
      'We build your activity profile from scratch inside the transfer timeline, leadership roles and initiatives that show an admissions officer who you are, not just what you’ve taken.',
  },
  {
    tag: 'Research & Internships',
    title: 'Real experience that backs your major.',
    body:
      "We help you land the research positions and internships that prove your direction, the kind of substance that turns a 'maybe' into a 'yes' for competitive programs.",
  },
  {
    tag: 'Awards & Honors',
    title: 'Recognition that sets you apart.',
    body:
      'From competitions to scholarships and honors, we guide you toward the awards worth pursuing, and how to actually win them, so your application carries proof, not just promise.',
  },
  {
    tag: '24/7 Support',
    title: "Support that doesn't disappear after you sign.",
    body:
      "Text anytime. Weekly calls. Direct access to a team who's made this exact transfer themselves, with you at every step of the cycle, not just the deadline.",
  },
];

function ServiceRow({ f, index, last }: { f: Feature; index: number; last: boolean }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const shown = inView || prefersReduced();
  const num = String(index + 1).padStart(2, '0');

  const item = (i: number): React.CSSProperties => ({
    opacity: shown ? 1 : 0,
    transform: shown ? 'none' : 'translateY(20px)',
    transition: `opacity 0.7s ${EASE} ${i * 90}ms, transform 0.7s ${EASE} ${i * 90}ms`,
    willChange: 'opacity, transform',
  });

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 lg:grid-cols-12 items-start"
      style={{
        gap: 'clamp(16px, 4vw, 56px)',
        padding: 'clamp(34px, 5vw, 56px) 0',
        borderTop: '1px solid rgba(243,245,240,0.13)',
        ...(last ? { borderBottom: '1px solid rgba(243,245,240,0.13)' } : {}),
      }}
    >
      {/* left rail: index + tag */}
      <div className="lg:col-span-4 flex items-baseline" style={{ gap: 'clamp(14px, 1.6vw, 22px)' }}>
        <span
          style={{
            fontFamily: '"Fraunces", serif',
            fontWeight: 600,
            fontSize: 'clamp(26px, 2.4vw, 34px)',
            lineHeight: 1,
            color: TU.crimson,
            ...item(0),
          }}
        >
          {num}
        </span>
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: TU.offwhite,
            opacity: 0.7,
            ...item(0),
          }}
        >
          {f.tag}
        </span>
      </div>

      {/* right: title + body */}
      <div className="lg:col-span-8">
        <h3
          style={{
            fontFamily: '"Fraunces", serif',
            fontWeight: 700,
            fontSize: 'clamp(25px, 2.9vw, 34px)',
            color: TU.offwhite,
            letterSpacing: '-0.015em',
            lineHeight: 1.12,
            ...item(1),
          }}
        >
          {f.title}
        </h3>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(15px, 1.15vw, 17px)',
            lineHeight: 1.7,
            color: TU.offwhite,
            opacity: 0.6,
            marginTop: 16,
            maxWidth: 620,
            ...item(2),
          }}
        >
          {f.body}
        </p>
      </div>
    </div>
  );
}

export default function TransferSystem() {
  return (
    <section id="system" style={{ background: TU.navy, padding: 'clamp(72px, 12vw, 128px) clamp(24px, 6vw, 80px)' }}>
      <div className="mx-auto" style={{ maxWidth: 1080 }}>
        <Reveal className="text-center" style={{ marginBottom: 'clamp(48px, 7vw, 80px)' }}>
          <Eyebrow index="06" label="The System" dark style={{ marginBottom: 18 }} />
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
            One year. One package. Everything.
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
            The Complete Transfer System
          </h2>
        </Reveal>

        <div>
          {FEATURES.map((f, i) => (
            <ServiceRow key={f.tag} f={f} index={i} last={i === FEATURES.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
