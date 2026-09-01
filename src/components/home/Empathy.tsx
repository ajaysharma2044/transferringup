import { Reveal, TU } from './shared';

/** §B7, empathy: affirm → name the wound → hand the path, never pain without the fix. */
export default function Empathy() {
  return (
    <section style={{ background: TU.cream, padding: 'clamp(80px, 12vw, 132px) clamp(24px, 6vw, 80px)' }}>
      <div className="mx-auto text-center" style={{ maxWidth: 820 }}>
        <Reveal>
          <h2
            style={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 700,
              fontSize: 'clamp(34px, 4.4vw, 56px)',
              color: TU.navy,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
            }}
          >
            You were the student who was supposed to get in.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <div style={{ width: 48, height: 2, background: TU.crimson, margin: '28px auto' }} />
        </Reveal>
        <Reveal delay={120}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(17px, 1.8vw, 19px)', lineHeight: 1.78, color: TU.navy, opacity: 0.78 }}>
            A rejection is a decision about one application, in one cycle. It is not a measurement of you. Let’s be
            real about what it actually is: you walked into a game nobody explained the rules of.
          </p>
        </Reveal>
        <Reveal delay={160}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(17px, 1.8vw, 19px)', lineHeight: 1.78, color: TU.navy, opacity: 0.78, marginTop: 22 }}>
            Transfer admissions runs on its own logic. Different deadlines than freshman apply. Essays that demand
            you explain why <em>this specific program</em>, not why college. Credits that may or may not carry. A
            GPA window open right now that narrows with every term you finish. Most families lose a full cycle just
            learning the board. <strong style={{ color: TU.navy, opacity: 1, fontWeight: 600 }}>That’s the part we do</strong>, we
            diagnose exactly why the top-25s said no, then build the application that changes the answer.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <p style={{ fontFamily: '"Fraunces", serif', fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(19px, 2.1vw, 24px)', color: TU.navy, marginTop: 30 }}>
            If you’re reading this a few weeks after a decision came back, you’re not behind yet. But the clock is real.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
