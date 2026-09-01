import { useState } from 'react';
import Seo from '../components/seo/Seo';
import { Reveal, TU } from '../components/home/shared';
import { submitLead } from '../lib/leadSubmit';
import { breadcrumbSchema } from '../lib/schema';

type Data = {
  name: string;
  email: string;
  phone: string;
  position: string;
  school: string;
  transfer: string;
  links: string;
  resume: string;
  why: string;
};
const EMPTY: Data = {
  name: '', email: '', phone: '', position: '', school: '', transfer: '', links: '', resume: '', why: '',
};

const labelStyle = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: TU.navy,
  opacity: 0.6,
};
const fieldStyle: React.CSSProperties = {
  width: '100%',
  background: '#FFFFFF',
  border: `1px solid ${TU.divider}`,
  borderRadius: 4,
  padding: '12px 14px',
  fontFamily: 'Inter, sans-serif',
  fontSize: 15,
  color: TU.navy,
  marginTop: 6,
};

function Field({
  label, value, onChange, type = 'text', required,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <label className="block" style={{ marginBottom: 18 }}>
      <span style={labelStyle}>{label}{required ? ' *' : ''}</span>
      <input type={type} value={value} required={required} style={fieldStyle} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export default function CareersPage() {
  const [data, setData] = useState<Data>(EMPTY);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const set = (k: keyof Data) => (v: string) => setData((d) => ({ ...d, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    await submitLead({
      name: data.name,
      email: data.email,
      phone: data.phone,
      position: data.position,
      school: data.school,
      transferStory: data.transfer,
      links: data.links,
      resume: data.resume,
      message: data.why,
      source: 'Job Application',
    });
    setStatus('done');
  }

  return (
    <>
      <Seo
        title="Careers: Transfer Admissions Consultants | TransferringUP"
        description="Join the TransferringUP team. We hire transfer admissions consultants who made the move themselves, from low GPAs to top-25 schools. Apply to coach the next class."
        path="/careers"
        jsonLd={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Careers', path: '/careers' },
          ]),
        ]}
      />

      {/* Hero */}
      <section style={{ background: TU.navy, padding: 'clamp(96px, 12vw, 140px) clamp(24px, 6vw, 80px) clamp(48px, 8vw, 72px)' }}>
        <Reveal className="mx-auto" style={{ maxWidth: 1100 }}>
          <p style={{ fontFamily: '"Fraunces", serif', fontStyle: 'italic', fontWeight: 300, fontSize: 22, color: TU.offwhite, opacity: 0.6 }}>
            We hire people who’ve done it themselves.
          </p>
          <h1 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 'clamp(44px, 5.5vw, 72px)', color: TU.offwhite, letterSpacing: '-0.02em', lineHeight: 1.04, marginTop: 8 }}>
            Join the Team.
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 18, lineHeight: 1.65, color: TU.offwhite, opacity: 0.66, marginTop: 18, maxWidth: 620 }}>
            Our consultants transferred into Cornell, Vanderbilt, Notre Dame, and beyond, many from places people said they’d never leave. If you’ve made that climb and want to help the next student do the same, we want to meet you.
          </p>
        </Reveal>
      </section>

      {/* Application form */}
      <section style={{ background: TU.cream, padding: 'clamp(56px, 9vw, 96px) clamp(24px, 6vw, 80px)' }}>
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-[0.85fr_1fr] gap-12 lg:gap-20 items-start" style={{ maxWidth: 1140 }}>
          {/* Left, who we're looking for */}
          <Reveal>
            <h2 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 'clamp(26px, 3vw, 36px)', color: TU.navy, lineHeight: 1.1 }}>
              Who we’re looking for
            </h2>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                ['You transferred up', 'You’ve personally made the move into a top school, ideally against the odds.'],
                ['You can coach', 'You can turn what you did into a repeatable plan for someone else.'],
                ['You show up', 'Our clients get text access and weekly calls. You’re there for them.'],
              ].map(([h, b]) => (
                <div key={h} style={{ borderLeft: `2px solid ${TU.crimson}`, paddingLeft: 16 }}>
                  <div style={{ fontFamily: '"Fraunces", serif', fontWeight: 600, fontSize: 18, color: TU.navy }}>{h}</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, lineHeight: 1.55, color: TU.navy, opacity: 0.66, marginTop: 4 }}>{b}</div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Right, the form card */}
          <Reveal delay={60}>
            <div style={{ background: '#FFFFFF', border: `1px solid ${TU.divider}`, borderRadius: 16, padding: 'clamp(24px, 3vw, 38px)', boxShadow: '0 18px 50px rgba(15,28,46,0.08)' }}>
              {status === 'done' ? (
                <div style={{ fontFamily: 'Inter, sans-serif', color: TU.navy }}>
                  <h3 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 'clamp(22px, 2.4vw, 28px)' }}>
                    Application received{data.name ? `, ${data.name.split(' ')[0]}` : ''}.
                  </h3>
                  <p style={{ fontSize: 16, opacity: 0.72, marginTop: 10, lineHeight: 1.6 }}>
                    Thanks for applying. We read every application, if it’s a fit, we’ll reach out by email to set up a conversation.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <h2 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 'clamp(24px, 2.6vw, 30px)', color: TU.navy }}>Apply Now</h2>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14.5, color: TU.navy, opacity: 0.6, marginTop: 6, marginBottom: 24 }}>
                    Tell us about yourself and the transfer you made.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                    <Field label="Full Name" value={data.name} onChange={set('name')} required />
                    <Field label="Email" type="email" value={data.email} onChange={set('email')} required />
                    <Field label="Phone Number" type="tel" value={data.phone} onChange={set('phone')} />
                    <label className="block" style={{ marginBottom: 18 }}>
                      <span style={labelStyle}>Role You’re Applying For</span>
                      <select value={data.position} onChange={(e) => set('position')(e.target.value)} style={{ ...fieldStyle, appearance: 'auto' }}>
                        <option value="">Select one</option>
                        <option>Transfer Consultant</option>
                        <option>Essay Coach</option>
                        <option>Operations / Admin</option>
                        <option>Marketing</option>
                        <option>Other</option>
                      </select>
                    </label>
                  </div>

                  <Field label="Your School & Grad Year" value={data.school} onChange={set('school')} />
                  <Field label="Your Transfer (from → to)" value={data.transfer} onChange={set('transfer')} />
                  <Field label="LinkedIn / Portfolio URL" value={data.links} onChange={set('links')} />
                  <Field label="Résumé Link (Google Drive, Dropbox, etc.)" value={data.resume} onChange={set('resume')} />

                  <label className="block" style={{ marginBottom: 18 }}>
                    <span style={labelStyle}>Why do you want to work with us?</span>
                    <textarea value={data.why} onChange={(e) => set('why')(e.target.value)} rows={4} style={{ ...fieldStyle, resize: 'vertical' }} />
                  </label>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    style={{
                      background: TU.crimson, color: TU.offwhite, padding: '14px 32px', borderRadius: 3,
                      fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600, marginTop: 8,
                      opacity: status === 'sending' ? 0.6 : 1, cursor: status === 'sending' ? 'wait' : 'pointer',
                    }}
                  >
                    {status === 'sending' ? 'Sending…' : 'Submit Application'}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
