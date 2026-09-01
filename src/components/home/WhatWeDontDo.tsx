import { X } from 'lucide-react';
import { Reveal, TU } from './shared';
import { Eyebrow } from '../shared/editorial';

const DONTS = [
  {
    title: 'We don’t write your essays.',
    body: 'Admissions officers can smell ghostwriting, and so can we, and it stays your application.',
  },
  {
    title: 'We don’t “have contacts” inside admissions offices.',
    body: 'Anyone who claims that is selling you something.',
  },
  {
    title: 'We don’t guarantee admission.',
    body: 'No honest person can, it’s against professional ethics.',
  },
  {
    title: 'We take zero money from any school.',
    body: 'We only work for you.',
  },
];

/** §B8, voluntary two-sided disclosure: the anti-scam honesty panel. */
export default function WhatWeDontDo() {
  return (
    <section style={{ background: TU.cream, padding: 'clamp(72px, 11vw, 120px) clamp(24px, 6vw, 80px)' }}>
      <div className="mx-auto" style={{ maxWidth: 1000 }}>
        <Reveal
          style={{
            background: TU.navy,
            borderRadius: 16,
            padding: 'clamp(36px, 5vw, 56px)',
            boxShadow: '0 30px 70px rgba(15,28,46,0.18)',
          }}
        >
          <Eyebrow index="07" label="On Purpose" dark align="left" />
          <h2
            style={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 700,
              fontSize: 'clamp(32px, 4vw, 48px)',
              color: TU.offwhite,
              lineHeight: 1.06,
              letterSpacing: '-0.02em',
              marginTop: 18,
            }}
          >
            What We Don’t Do.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 1, marginTop: 32, background: 'rgba(243,245,240,0.1)', borderRadius: 10, overflow: 'hidden' }}>
            {DONTS.map((d) => (
              <div key={d.title} style={{ background: TU.navy, padding: '26px 24px' }}>
                <div className="flex items-start" style={{ gap: 12 }}>
                  <span
                    className="flex items-center justify-center shrink-0"
                    style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(122,0,0,0.25)', border: `1px solid ${TU.crimson}`, marginTop: 2 }}
                  >
                    <X size={15} style={{ color: '#E0758A' }} strokeWidth={2.5} />
                  </span>
                  <div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 16.5, color: TU.offwhite, lineHeight: 1.3 }}>
                      {d.title}
                    </div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14.5, lineHeight: 1.6, color: TU.offwhite, opacity: 0.6, marginTop: 6 }}>
                      {d.body}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p
            style={{
              fontFamily: '"Fraunces", serif',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(18px, 2vw, 23px)',
              lineHeight: 1.5,
              color: TU.cream,
              marginTop: 32,
            }}
          >
            What we <span style={{ fontStyle: 'normal', fontWeight: 700, color: TU.gold }}>do</span> is make your
            application the strongest <em>true</em> version of itself, on the right timeline, aimed at the right targets.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
