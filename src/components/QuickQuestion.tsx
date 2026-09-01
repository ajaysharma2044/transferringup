import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { submitLead } from '../lib/leadSubmit';
import { TU } from './home/shared';

const inp: React.CSSProperties = {
  width: '100%',
  background: '#fff',
  border: `1px solid ${TU.divider}`,
  borderRadius: 8,
  padding: '10px 12px',
  fontFamily: 'Inter, sans-serif',
  fontSize: 14,
  color: TU.navy,
};

export default function QuickQuestion() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [d, setD] = useState({ name: '', email: '', question: '' });
  const valid = !!(d.name.trim() && d.email.trim() && d.question.trim());

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await submitLead({ name: d.name, email: d.email, message: d.question, challenge: d.question, source: 'Quick Question' });
    setSending(false);
    setSent(true);
  }

  return (
    <div style={{ position: 'fixed', right: 'clamp(14px, 3vw, 26px)', bottom: 'clamp(84px, 11vw, 96px)', zIndex: 60 }}>
      {open && (
        <div
          style={{
            width: 340,
            maxWidth: 'calc(100vw - 28px)',
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 24px 60px rgba(15,28,46,0.28)',
            border: `1px solid ${TU.divider}`,
            overflow: 'hidden',
            marginBottom: 14,
          }}
        >
          <div style={{ background: TU.navy, padding: '15px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <MessageCircle size={18} style={{ color: TU.offwhite }} />
              <span style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 17, color: TU.offwhite }}>Quick Question?</span>
            </span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" style={{ color: TU.offwhite, opacity: 0.7, lineHeight: 0 }}>
              <X size={18} />
            </button>
          </div>
          <div style={{ padding: 18 }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 19, color: TU.navy }}>Got it{d.name ? `, ${d.name.split(' ')[0]}` : ''}.</div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: TU.navy, opacity: 0.65, marginTop: 8, lineHeight: 1.5 }}>
                  We’ll reply to your email, usually within a few hours.
                </p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: TU.navy, opacity: 0.7, marginBottom: 14, lineHeight: 1.55 }}>
                  Not ready to book a call? Drop your question here, Ajay and the team read every one and reply by email, usually the same day.
                </p>
                <input value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} placeholder="First name" required style={inp} />
                <input type="email" value={d.email} onChange={(e) => setD({ ...d, email: e.target.value })} placeholder="Email" required style={{ ...inp, marginTop: 10 }} />
                <textarea
                  value={d.question}
                  onChange={(e) => setD({ ...d, question: e.target.value })}
                  placeholder="e.g. Can I still transfer to Cornell with a 3.2 and a C in Calc?"
                  rows={3}
                  required
                  style={{ ...inp, marginTop: 10, resize: 'vertical' }}
                />
                <button
                  type="submit"
                  disabled={!valid || sending}
                  style={{
                    width: '100%', marginTop: 12, color: TU.offwhite, padding: '12px',
                    borderRadius: 8, fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: valid && !sending ? TU.crimson : '#CFC9BF',
                    cursor: valid && !sending ? 'pointer' : 'not-allowed',
                    transition: 'background 0.2s ease',
                  }}
                >
                  <Send size={15} /> {sending ? 'Sending…' : 'Send it over'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* floating button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Quick question"
        className="ml-auto flex items-center justify-center"
        style={{
          marginLeft: 'auto',
          width: 56, height: 56, borderRadius: 999, background: TU.crimson, color: TU.offwhite,
          boxShadow: '0 14px 32px rgba(122,0,0,0.42)',
          float: 'right',
        }}
      >
        {open ? <X size={22} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
