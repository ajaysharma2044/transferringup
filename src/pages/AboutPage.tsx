import Seo from '../components/seo/Seo';
import { Reveal, TU } from '../components/home/shared';
import { CTAButton } from '../components/shared/ui';
import Team from '../components/home/Team';
import { personSchema, breadcrumbSchema } from '../lib/schema';

const TIMELINE = [
  { k: 'Founded TransferringUP', v: 'Turned a hard-won personal system into a service for students who were told no.' },
  { k: '50+ acceptances', v: 'Clients accepted to T30 schools nationwide, many with sub-3.5 GPAs.' },
  { k: 'And counting', v: 'Every cycle, more students re-route to schools they were told were out of reach.' },
];

const VALUES = [
  'We don’t do generic advice.',
  'We don’t disappear after onboarding.',
  'We measure success only by where you end up.',
];

export default function AboutPage() {
  return (
    <>
      <Seo
        title="Founder Story: 2.9 GPA to Cornell | TransferringUP"
        description="From a 2.9 GPA to Cornell in one year. Meet the founder who turned transferring with a low GPA into a proven transfer admissions consulting system. Read the story."
        path="/about"
        jsonLd={[
          personSchema(),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
      />

      {/* Hero */}
      <section style={{ background: TU.cream, padding: 'clamp(96px, 12vw, 140px) clamp(24px, 6vw, 80px) clamp(48px, 8vw, 72px)' }}>
        <Reveal className="mx-auto" style={{ maxWidth: 1100 }}>
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
            The story behind the system.
          </p>
          <h1
            style={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 700,
              fontSize: 'clamp(48px, 5.5vw, 72px)',
              color: TU.navy,
              letterSpacing: '-0.02em',
              lineHeight: 1.04,
              marginTop: 8,
            }}
          >
            Transfer Admissions, Built From Experience.
          </h1>
        </Reveal>
      </section>

      {/* Founder story split */}
      <section style={{ background: TU.cream }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch" style={{ minHeight: 620 }}>
          <Reveal className="flex flex-col justify-center" style={{ padding: '40px clamp(24px, 6vw, 80px) 80px' }}>
            <div style={{ maxWidth: 480 }}>
              {[
                'Since I was 8, I dreamed of going to an Ivy. Then COVID hit, and everything collapsed. Freshman year, I had a 1.25 GPA, ranked 399 of 411, failed most classes, and stopped caring.',
                'Sophomore year, I went to India and saw my mom’s family surviving on less than a dollar a day. That snapped me out of it. I came back and started grinding. By senior year my GPA was still a 2.7, and I got rejected from schools with 87% acceptance rates.',
                'From April to August, I obsessed over the transfer process. I studied old applications, forums, and built a blueprint. I took summer classes at community college and pulled a 4.0. At UNCG, I built high-impact extracurriculars. By the end of freshman year, I had multiple top-school acceptances, and finally got into Cornell.',
                'Now I help other underdogs do what I did. I specialize in turning low GPAs into strong narratives, building extracurriculars fast, and making schools take a second look.',
              ].map((p, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 18,
                    lineHeight: 1.72,
                    color: TU.navy,
                    opacity: 0.78,
                    marginTop: i === 0 ? 0 : 20,
                  }}
                >
                  {p}
                </p>
              ))}
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: TU.navy,
                  opacity: 0.4,
                  marginTop: 28,
                }}
              >
                Ajay, Founder · Cornell University
              </div>
            </div>
          </Reveal>
          <div className="relative min-h-[420px] lg:min-h-full">
            <img
              src="/ajay-linkedin.jpg"
              alt="Ajay Sharma, founder of TransferringUP and Cornell transfer admissions consultant"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ background: TU.navy, padding: 'clamp(72px, 12vw, 128px) clamp(24px, 6vw, 80px)' }}>
        <div className="mx-auto" style={{ maxWidth: 820 }}>
          <h2
            style={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 700,
              fontSize: 'clamp(32px, 4vw, 48px)',
              color: TU.offwhite,
              marginBottom: 48,
            }}
          >
            What It Became
          </h2>
          <div>
            {TIMELINE.map((t, i) => (
              <Reveal
                key={t.k}
                delay={(i % 4) * 60}
                className="flex gap-6"
                style={{
                  paddingBottom: 28,
                  marginBottom: 28,
                  borderLeft: `2px solid ${TU.crimson}`,
                  paddingLeft: 28,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: '"Fraunces", serif',
                      fontWeight: 700,
                      fontSize: 24,
                      color: TU.offwhite,
                    }}
                  >
                    {t.k}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 16,
                      color: TU.offwhite,
                      opacity: 0.6,
                      marginTop: 6,
                    }}
                  >
                    {t.v}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The team */}
      <Team />

      {/* Values */}
      <section style={{ background: TU.cream, padding: 'clamp(72px, 12vw, 128px) clamp(24px, 6vw, 80px)' }}>
        <div className="mx-auto" style={{ maxWidth: 900 }}>
          {VALUES.map((v, i) => (
            <Reveal
              key={v}
              delay={i * 80}
              style={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 700,
                fontSize: 'clamp(28px, 4vw, 48px)',
                color: TU.navy,
                lineHeight: 1.15,
                padding: '28px 0',
                borderBottom: i < VALUES.length - 1 ? `1px solid ${TU.divider}` : 'none',
              }}
            >
              {v}
            </Reveal>
          ))}
        </div>
      </section>

      {/* Credentials */}
      <section style={{ background: TU.offwhite, padding: 'clamp(64px, 9vw, 104px) clamp(24px, 6vw, 80px)' }}>
        <Reveal className="mx-auto text-center" style={{ maxWidth: 720 }}>
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: TU.crimson,
            }}
          >
            Cornell · Notre Dame · USC
          </div>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 18,
              lineHeight: 1.7,
              color: TU.navy,
              opacity: 0.72,
              marginTop: 16,
            }}
          >
            Our founder’s path runs through Cornell, Notre Dame, and USC, and that firsthand
            experience across multiple top institutions shapes how we read admissions, position
            applicants, and build a strategy for every client.
          </p>
          <div style={{ marginTop: 32 }}>
            <CTAButton href="/contact">Start My Transfer →</CTAButton>
          </div>
        </Reveal>
      </section>
    </>
  );
}
