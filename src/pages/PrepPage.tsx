import { useEffect, useMemo, useRef, useState } from 'react';
import { submitEnrichment, type EnrichmentFile } from '../lib/leadSubmit';
import { setPixelIdentity } from '../lib/pixelIdentity';
import { trackEvent } from '../lib/analytics';
import { TU } from '../components/home/shared';

// Call-prep / confirmation page (client-only, linked after booking + from the
// reminder texts). Three jobs:
//   1. Set expectations + handle objections before the call (videos below).
//   2. Collect goal / history / ECs / transcripts -> Apps Script -> Drive +
//      the student's row on the Leads sheet + email to both sides.
//   3. Fire high-intent pixel signals (Schedule on view, CallPrepSubmitted on
//      send) so Meta optimizes toward people who engage like real buyers.

// Call FAQ: answers the objections that kill show-rate, in writing, before the
// call. Price is anchored on purpose, nobody should be shocked on the call.
const FAQ: { q: string; a: string }[] = [
  {
    q: 'What actually happens on this call?',
    a: "It's a 30-45 minute working session with a senior advisor, not a sales pitch. We audit where you are (grades, school, activities), pressure-test your target list, and map what your transfer plan would look like. You leave with clear next steps whether or not we end up working together.",
  },
  {
    q: 'How much does the program cost?',
    a: "It's a premium, full-cycle program with a senior advisor running your entire transfer, so it is a serious investment, the kind families make when the outcome genuinely matters to them. We only talk specific numbers on the call, and only once we both agree we can actually change your result. Everyone's scope is different, so there is no one price to quote. The call itself is completely free.",
  },
  {
    q: 'Should my parents be on the call?',
    a: "If they'd be part of the decision, yes, bring them. Calls with parents in the room move faster and get better outcomes, because everyone hears the same plan at the same time.",
  },
  {
    q: 'My GPA is low. Is this even worth it?',
    a: "Transfers are a re-evaluation, not a re-run. Our results page includes students who went from a 2.8-2.9 GPA to NYU-tier admits. On the call we'll tell you honestly what's realistic from where you stand.",
  },
  {
    q: 'Do I need anything ready for the call?',
    a: 'No, but the more you share below (transcripts, activities, your goal), the more specific we can get. Ten minutes of prep here usually doubles what you get out of the session.',
  },
  {
    q: 'What if I need to reschedule?',
    a: "Life happens. Use the reschedule link in your confirmation email, or just reply to it. Please give us notice so the slot can go to another student.",
  },
];

// Drop YouTube video IDs here as you record them, entries without an id are
// hidden, and the whole section disappears if none are set.
const PREP_VIDEOS: { title: string; desc: string; youtubeId: string }[] = [
  {
    title: 'What actually happens on the call',
    desc: 'How we run your strategy session, and what you walk away with.',
    youtubeId: '',
  },
  {
    title: '"Is this worth it with my GPA?"',
    desc: 'Why GPA is only one lever, and what admissions actually weighs.',
    youtubeId: '',
  },
];

const labelStyle: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: TU.navy,
  opacity: 0.6,
  display: 'block',
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

const MAX_TOTAL_BYTES = 10 * 1024 * 1024; // Apps Script POST limit safety cap

function readAsB64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1] || '');
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function UploadSlot({ label, hint, file, onFile }: {
  label: string; hint: string; file: File | null; onFile: (f: File | null) => void;
}) {
  return (
    <label className="block" style={{ marginBottom: 16, cursor: 'pointer' }}>
      <span style={labelStyle}>{label}</span>
      <span style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: 13, color: TU.navy, opacity: 0.55, marginTop: 3 }}>{hint}</span>
      <div style={{ ...fieldStyle, display: 'flex', alignItems: 'center', gap: 10, borderStyle: 'dashed' }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: file ? TU.crimson : TU.navy, opacity: file ? 1 : 0.5 }}>
          {file ? `Attached: ${file.name}` : 'Click to attach (PDF, image, or doc)'}
        </span>
      </div>
      <input
        type="file"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.heic,.webp"
        style={{ display: 'none' }}
        onChange={(e) => onFile(e.target.files?.[0] || null)}
      />
    </label>
  );
}

export default function PrepPage() {
  const params = useMemo(
    () => new URLSearchParams(typeof location !== 'undefined' ? location.search : ''),
    [],
  );
  // Prefill the booked email from the on-site flow (?email=) OR from a Calendly
  // confirmation-page redirect (?invitee_email= / ?invitee_full_name= tokens).
  const [email, setEmail] = useState(
    params.get('email') || params.get('invitee_email') || params.get('email_address') || '',
  );
  const [goal, setGoal] = useState('');
  const [lastCycle, setLastCycle] = useState('');
  const [ecs, setEcs] = useState('');
  const [story, setStory] = useState('');
  const [worry, setWorry] = useState('');
  const [familyBenchmark, setFamilyBenchmark] = useState('');
  const [hsT, setHsT] = useState<File | null>(null);
  const [collegeT, setCollegeT] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'toobig'>('idle');
  const viewed = useRef(false);

  useEffect(() => {
    document.title = 'Prep for your call | TransferringUP';
    if (!viewed.current) {
      viewed.current = true;
      // Calendly hands us their email in the URL: attach it to the browser
      // pixel FIRST so the Schedule event below matches to a real person.
      if (email) setPixelIdentity(email, '', params.get('invitee_full_name') || '');
      // Standard Meta "Schedule" event: they reached the booked-call page.
      trackEvent('call_prep_view', { value: 60, currency: 'USD' }, 'Schedule');
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const picked = [
      { f: hsT, label: 'High school transcript' },
      { f: collegeT, label: 'College transcript' },
      { f: resume, label: 'Resume / Common App' },
    ].filter((x) => x.f) as { f: File; label: string }[];
    if (picked.reduce((n, x) => n + x.f.size, 0) > MAX_TOTAL_BYTES) {
      setStatus('toobig');
      return;
    }
    setStatus('sending');
    const files: EnrichmentFile[] = [];
    for (const { f, label } of picked) {
      files.push({ name: f.name, mime: f.type || 'application/octet-stream', b64: await readAsB64(f), label });
    }
    if (ecs.trim()) {
      files.push({
        name: 'extracurriculars.txt',
        mime: 'text/plain',
        b64: btoa(unescape(encodeURIComponent(ecs.trim()))),
        label: 'Extracurriculars',
      });
    }
    await submitEnrichment({
      email: email.trim(), goal: goal.trim(), lastCycle: lastCycle.trim(), files,
      story: story.trim(), worry, familyBenchmark: familyBenchmark.trim(),
    });
    // High-intent conversion: people who do homework before a call show up and close.
    trackEvent('CallPrepSubmitted', { value: 150, currency: 'USD', uploads: files.length });
    setStatus('done');
  }

  const videos = PREP_VIDEOS.filter((v) => v.youtubeId);

  return (
    <main style={{ background: TU.offwhite, minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: TU.navy }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 22px 80px' }}>
        <a href="/" style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 18, color: TU.crimson }}>
          TransferringUP
        </a>

        <h1 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 40px)', marginTop: 26, lineHeight: 1.15 }}>
          You're booked. Let's make the call count.
        </h1>
        <p style={{ fontSize: 16.5, lineHeight: 1.6, opacity: 0.75, marginTop: 12, maxWidth: 560 }}>
          Block 30-45 quiet minutes. Share what you can below and we walk in already knowing your numbers,
          so the whole call goes to strategy.
        </p>

        {videos.length > 0 && (
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 22 }}>Watch before your call</h2>
            <div style={{ display: 'grid', gap: 18, marginTop: 16 }}>
              {videos.map((v) => (
                <div key={v.title} style={{ background: '#fff', border: `1px solid ${TU.divider}`, borderRadius: 6, padding: 16 }}>
                  <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: 4, overflow: 'hidden' }}>
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                      title={v.title}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                      allowFullScreen
                    />
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 15.5, marginTop: 12 }}>{v.title}</div>
                  <div style={{ fontSize: 14, opacity: 0.65, marginTop: 4 }}>{v.desc}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section style={{ marginTop: 44, background: '#fff', border: `1px solid ${TU.divider}`, borderRadius: 8, padding: 'clamp(20px, 4vw, 34px)' }}>
          {status === 'done' ? (
            <div>
              <h2 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 24 }}>Got it. Your advisor has everything.</h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.6, opacity: 0.72, marginTop: 10 }}>
                We'll review it all before your session and come with specific angles for
                your applications. Check your email for a confirmation. See you on the call.
              </p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h2 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 23 }}>
                2-minute prep
              </h2>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, opacity: 0.68, marginTop: 6, marginBottom: 20 }}>
                All optional. Every stat you give now is one we don't spend your call collecting. Students who fill this out get roughly twice the call.
              </p>

              <label className="block" style={{ marginBottom: 16 }}>
                <span style={labelStyle}>Your Email (the one you booked with) *</span>
                <input type="email" required value={email} style={fieldStyle} onChange={(e) => setEmail(e.target.value)} />
              </label>

              <label className="block" style={{ marginBottom: 16 }}>
                <span style={labelStyle}>What's the main thing you want to walk away with from the call?</span>
                <textarea rows={3} value={goal} style={{ ...fieldStyle, resize: 'vertical' }} onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. a real plan for getting into Cornell as a sophomore transfer" />
              </label>

              <label className="block" style={{ marginBottom: 16 }}>
                <span style={labelStyle}>Applied anywhere before? How did it go?</span>
                <textarea rows={3} value={lastCycle} style={{ ...fieldStyle, resize: 'vertical' }} onChange={(e) => setLastCycle(e.target.value)}
                  placeholder="Schools you applied to last cycle, results, and what you think went wrong" />
              </label>

              <label className="block" style={{ marginBottom: 16 }}>
                <span style={labelStyle}>How did you end up at your current school?</span>
                <textarea rows={3} value={story} style={{ ...fieldStyle, resize: 'vertical' }} onChange={(e) => setStory(e.target.value)}
                  placeholder="What was the thought process at the time? Plan A, a safety that became real, money, family, timing." />
              </label>

              <label className="block" style={{ marginBottom: 16 }}>
                <span style={labelStyle}>When you picture actually doing this, what worries you most?</span>
                <select value={worry} style={{ ...fieldStyle, appearance: 'auto' }} onChange={(e) => setWorry(e.target.value)}>
                  <option value="">Select one (optional)</option>
                  {['My GPA or grades so far', 'Telling my story well in the essays', 'Not knowing what transfer committees actually want', 'Deadlines and timing', 'The cost', 'Doing this alone without a real plan', 'Honestly, all of it'].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </label>

              <label className="block" style={{ marginBottom: 16 }}>
                <span style={labelStyle}>Any school your family or close circle really looks up to?</span>
                <input value={familyBenchmark} style={fieldStyle} onChange={(e) => setFamilyBenchmark(e.target.value)}
                  placeholder="An older sibling or cousin's school, or one your family talks about." />
              </label>

              <label className="block" style={{ marginBottom: 20 }}>
                <span style={labelStyle}>Your main extracurriculars + leadership</span>
                <textarea rows={4} value={ecs} style={{ ...fieldStyle, resize: 'vertical' }} onChange={(e) => setEcs(e.target.value)}
                  placeholder="List them plainly. On the call we'll show you how to reframe them so they hit harder." />
              </label>

              <UploadSlot label="High School Transcript" hint="Even a screenshot works. A doc with your grades and classes is fine too." file={hsT} onFile={setHsT} />
              <UploadSlot label="College Transcript" hint="Unofficial is fine. A doc with your grades and classes works too." file={collegeT} onFile={setCollegeT} />
              <UploadSlot label="Resume / Common App" hint="Last year's Common App PDF is gold if you have it." file={resume} onFile={setResume} />

              {status === 'toobig' && (
                <p style={{ color: TU.crimson, fontSize: 14, marginBottom: 12 }}>
                  Files are over 10MB total. Drop the largest one, or email it to us instead.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  background: TU.crimson, color: TU.offwhite, padding: '14px 32px', borderRadius: 3,
                  fontSize: 15, fontWeight: 600, marginTop: 6,
                  opacity: status === 'sending' ? 0.6 : 1, cursor: status === 'sending' ? 'wait' : 'pointer',
                }}
              >
                {status === 'sending' ? 'Sending...' : 'Send to my advisor'}
              </button>
            </form>
          )}
        </section>

        <section style={{ marginTop: 44 }}>
          <h2 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 24 }}>
            Before your call: quick answers
          </h2>
          <div style={{ marginTop: 14 }}>
            {FAQ.map((f) => (
              <details
                key={f.q}
                style={{ background: '#fff', border: `1px solid ${TU.divider}`, borderRadius: 6, padding: '14px 18px', marginBottom: 10 }}
              >
                <summary style={{ fontWeight: 600, fontSize: 15.5, cursor: 'pointer', color: TU.navy }}>{f.q}</summary>
                <p style={{ fontSize: 14.5, lineHeight: 1.65, opacity: 0.75, marginTop: 10 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
