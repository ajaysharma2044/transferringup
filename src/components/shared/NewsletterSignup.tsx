import { useState } from 'react';
import { submitNewsletter } from '../../lib/leadSubmit';
import { TU } from '../home/shared';

// "The Transfer Letter", email capture section. Subscribers land in the
// Newsletter tab of the lead sheet (with IP/geo enrichment) and their browser
// is identity-linked, so their future site visits report under their email.
export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status !== 'idle') return;
    setStatus('sending');
    await submitNewsletter(email.trim());
    setStatus('done');
  }

  return (
    <section
      id="newsletter"
      style={{ background: TU.navy, padding: 'clamp(64px, 9vw, 110px) clamp(24px, 6vw, 80px)' }}
    >
      <div className="mx-auto text-center" style={{ maxWidth: 640 }}>
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: TU.gold,
          }}
        >
          The Transfer Letter
        </div>
        <h2
          style={{
            fontFamily: '"Fraunces", serif',
            fontWeight: 700,
            fontSize: 'clamp(26px, 3.4vw, 38px)',
            color: TU.offwhite,
            marginTop: 14,
            lineHeight: 1.15,
          }}
        >
          Transfer strategy, straight to your inbox.
        </h2>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 15.5,
            lineHeight: 1.65,
            color: TU.offwhite,
            opacity: 0.65,
            marginTop: 14,
          }}
        >
          One short email a week: what is working in transfer admissions right now, real
          acceptance breakdowns from our students, and the deadlines you cannot miss.
          Free, no spam, unsubscribe anytime.
        </p>

        {status === 'done' ? (
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 16,
              fontWeight: 600,
              color: TU.gold,
              marginTop: 28,
            }}
          >
            You&apos;re in. Watch your inbox for the next issue.
          </p>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row justify-center" style={{ gap: 10, marginTop: 28 }}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu"
              aria-label="Email address"
              style={{
                flex: '1 1 auto',
                maxWidth: 380,
                margin: '0 auto',
                width: '100%',
                background: 'rgba(243,245,240,0.06)',
                border: '1px solid rgba(243,245,240,0.18)',
                borderRadius: 4,
                padding: '14px 16px',
                fontFamily: 'Inter, sans-serif',
                fontSize: 15,
                color: TU.offwhite,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              style={{
                background: TU.crimson,
                color: TU.offwhite,
                padding: '14px 28px',
                borderRadius: 4,
                fontFamily: 'Inter, sans-serif',
                fontSize: 15,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                opacity: status === 'sending' ? 0.6 : 1,
                cursor: status === 'sending' ? 'wait' : 'pointer',
              }}
            >
              {status === 'sending' ? 'One sec…' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
