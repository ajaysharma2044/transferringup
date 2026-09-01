import { useEffect, useRef, useState } from 'react';
import { submitLead, BOOKING_URL } from '../lib/leadSubmit';
import { markFormStarted, formBehaviorSignals } from '../lib/leadSignals';
import { track, trackEvent } from '../lib/analytics';
import { adTrackBooking } from '../lib/adTracking';
import { TU } from './home/shared';
import Autocomplete from './shared/Autocomplete';

const COLLEGES_URL = '/data/colleges.json';
const HS_SHARD_BASE = '/data/hs/';

// Adaptive application form. The path branches on where the student is now
// (high school vs. college vs. community college), and every submission is
// silently enriched with IP/geo/UTM/device data in the lead pipeline.
type Data = {
  name: string; email: string; phone: string;
  filledBy: string;
  studentType: string;
  highSchool: string; gradYear: string; gradeLevel: string;
  currentSchool: string; collegeYear: string;
  collegeGPA: string; highSchoolGPA: string; testScore: string;
  targetSchools: string; cycle: string;
  major: string; careerGoals: string;
  usedAdvisor: string; advisorFirm: string; testPrep: string;
  funding: string; commitment: string; challenge: string;
  showUp: string;
};
const EMPTY: Data = {
  name: '', email: '', phone: '',
  filledBy: '',
  studentType: '',
  highSchool: '', gradYear: '', gradeLevel: '',
  currentSchool: '', collegeYear: '',
  collegeGPA: '', highSchoolGPA: '', testScore: '',
  targetSchools: '', cycle: '',
  major: '', careerGoals: '',
  usedAdvisor: '', advisorFirm: '', testPrep: '',
  funding: '', commitment: '', challenge: '',
  showUp: '',
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
  label, value, onChange, placeholder, type = 'text', required,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <label className="block" style={{ marginBottom: 18 }}>
      <span style={labelStyle}>{label}{required ? ' *' : ''}</span>
      <input type={type} value={value} placeholder={placeholder} required={required} style={fieldStyle} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Select({
  label, value, onChange, options, required, hint,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean; hint?: string;
}) {
  return (
    <label className="block" style={{ marginBottom: 18 }}>
      <span style={labelStyle}>{label}{required ? ' *' : ''}</span>
      {hint && (
        <span style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: 13.5, lineHeight: 1.5, color: TU.navy, opacity: 0.62, marginTop: 5 }}>
          {hint}
        </span>
      )}
      <select value={value} required={required} onChange={(e) => onChange(e.target.value)} style={{ ...fieldStyle, appearance: 'auto' }}>
        <option value="">Select one</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

const GRAD_YEARS = ['2026', '2027', '2028', '2029'];
const GRADES = ['9th grade', '10th grade', '11th grade', '12th grade'];
// Dropdown (not free text) so the pixel gets a clean, scoreable major signal.
const MAJORS = [
  'Business / Finance',
  'Economics',
  'Consulting / Management',
  'Pre-Law / Political Science',
  'Pre-Med / Health',
  'Marketing / Communications',
  'Sciences (Bio, Chem, Physics)',
  'Liberal Arts / Humanities',
  'Data Science / Math',
  'Computer Science',
  'Engineering',
  'Undecided / Other',
];
const CYCLES = ['Spring 2027', 'Fall 2027', 'Spring 2028', 'Fall 2028', 'Not sure yet'];

// Qualification: who writes the check, and how locked-in they are. These two
// answers drive the lead score, pipeline tier, and the pixel's value signal.
const FUNDING = [
  "My parents, and they know I'm exploring this",
  "My parents, but they don't know yet",
  "I'd be paying for it myself",
  "We couldn't fund this right now",
];
const COMMITMENT = [
  'Applying this cycle no matter what',
  'Very likely, if I find the right guidance',
  'Still deciding if transferring is right for me',
];
// Dropdown (not free text) so the pixel gets a clean, scoreable career signal.
const CAREERS = [
  'Investment banking / Finance',
  'Consulting',
  'Law',
  'Medicine / Health',
  'Graduate school',
  'Tech / Engineering',
  'Not sure yet',
];

export default function ApplicationForm() {
  const [data, setData] = useState<Data>(EMPTY);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const set = (k: keyof Data) => (v: string) => {
    markFormStarted(); // first interaction starts the fill-time clock
    setData((d) => ({ ...d, [k]: v }));
  };
  const bookRef = useRef<HTMLDivElement>(null);
  // Behavior signals: paste into the essay box + hesitation on the investment question.
  const pasteRef = useRef(false);
  const investmentShownAt = useRef<number | null>(null);
  const investmentDwell = useRef<number | null>(null);

  const isHS = data.studentType === 'High school student';
  const isCollege = data.studentType === '4-year college student' || data.studentType === 'Community college student';

  // The investment question renders once a path is chosen, start its dwell timer.
  useEffect(() => {
    if (data.studentType && investmentShownAt.current === null) {
      investmentShownAt.current = Date.now();
    }
  }, [data.studentType]);

  // Preload Calendly's widget while they are still filling the form, so the
  // calendar boots instantly on submit instead of downloading from scratch.
  useEffect(() => {
    const w = window as unknown as { Calendly?: object };
    if (w.Calendly || document.querySelector('script[src*="calendly.com/assets/external/widget.js"]')) return;
    const s = document.createElement('script');
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.async = true;
    document.head.appendChild(s);
  }, []);

  // The calendar is earned, not given: students who told us they cannot fund
  // the program do not get call slots. They stay leads (scored, pixeled as
  // DisqualifiedLead) but the calendar never renders, so every held time goes
  // to someone who can actually move. This is the #1 show-rate lever.
  const gated = /couldn't fund/i.test(data.funding);

  // After the form is submitted, embed Calendly inline (prefilled) so they book
  // right here. On a completed booking: fire the pixel + move them to /prep.
  useEffect(() => {
    if (status !== 'done' || gated) return;
    track.booking('inline_form'); // reached the scheduling step
    const url = `${BOOKING_URL}?hide_gdpr_banner=1`;
    // Normalize a US phone to E.164 so Calendly accepts it as the SMS-reminder
    // number (prefilled -> they get the text reminders automatically).
    const digits = (data.phone || '').replace(/\D/g, '');
    const smsNumber = digits.length === 10 ? `+1${digits}`
      : digits.length === 11 && digits.startsWith('1') ? `+${digits}`
      : data.phone ? (data.phone.trim().startsWith('+') ? data.phone.trim() : '') : '';
    const prefill: Record<string, unknown> = { name: data.name, email: data.email };
    if (smsNumber) prefill.smsReminderNumber = smsNumber;
    if (bookRef.current) {
      bookRef.current.innerHTML = '';
      const div = document.createElement('div');
      div.style.minWidth = '300px';
      div.style.height = '680px';
      bookRef.current.appendChild(div);
      const initWidget = () => {
        const w = window as unknown as { Calendly?: { initInlineWidget: (o: object) => void } };
        if (w.Calendly) w.Calendly.initInlineWidget({ url, parentElement: div, prefill });
      };
      const w = window as unknown as { Calendly?: object };
      const existing = document.querySelector<HTMLScriptElement>('script[src*="calendly.com/assets/external/widget.js"]');
      if (w.Calendly) {
        initWidget();
      } else if (existing) {
        // The mount-time preload is still in flight: piggyback on it.
        existing.addEventListener('load', initWidget);
      } else {
        const s = document.createElement('script');
        s.src = 'https://assets.calendly.com/assets/external/widget.js';
        s.async = true;
        s.onload = initWidget;
        document.head.appendChild(s);
      }
    }
    const onMsg = (e: MessageEvent) => {
      const evt = (e.data as { event?: string } | null)?.event;
      if (/calendly\.com$/.test(new URL(e.origin).hostname) && evt === 'calendly.event_scheduled') {
        trackEvent('booking_confirmed', { value: 100, currency: 'USD' }, 'Schedule');
        adTrackBooking(); // Google Ads booking conversion (no-op until configured)
        setTimeout(() => {
          window.location.href = `/prep?email=${encodeURIComponent(data.email)}`;
        }, 1200);
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    // Legacy investment-readiness bands, derived from funding + commitment so
    // the whole scoring/tier/pixel stack (which keys on Ready/Serious/Exploring
    // prefixes) keeps working unchanged.
    const committed = data.commitment.startsWith('Applying');
    const investmentReadiness = /and they know/.test(data.funding)
      ? 'Ready to invest (parents aware)'
      : /myself/.test(data.funding) && committed
        ? 'Ready to invest (self-funded)'
        : /don't know yet/.test(data.funding)
          ? 'Serious, parents not looped in yet'
          : /myself/.test(data.funding)
            ? 'Serious, self-funded'
            : 'Exploring, cannot fund right now';
    // Fire-and-forget: the lead pipeline (geo lookup, wealth data, Apps
    // Script + HubSpot POSTs) takes seconds and the calendar does not need
    // any of it. submitLead never throws, and the sheet POST uses keepalive
    // so even an instant booking + redirect cannot cut it off.
    void submitLead({
      name: data.name,
      email: data.email,
      phone: data.phone,
      filledBy: data.filledBy,
      studentType: data.studentType,
      highSchool: data.highSchool,
      gradYear: data.gradYear,
      gradeLevel: data.gradeLevel,
      currentSchool: data.currentSchool,
      collegeYear: data.collegeYear,
      collegeGPA: data.collegeGPA,
      highSchoolGPA: data.highSchoolGPA,
      testScore: data.testScore,
      targetSchools: data.targetSchools,
      cycle: data.cycle,
      intendedMajor: data.major,
      careerGoals: data.careerGoals,
      usedAdvisorBefore: data.usedAdvisor,
      previousAdvisorFirm: data.advisorFirm,
      testPrepUsed: data.testPrep,
      investmentReadiness,
      fundingSource: data.funding,
      commitmentLevel: data.commitment,
      challenge: data.challenge,
      message: data.challenge,
      showUpAgreement: data.showUp,
      pasteDetected: pasteRef.current ? 'Yes' : 'No',
      investmentDwellSeconds:
        investmentDwell.current !== null ? String(investmentDwell.current) : '',
      ...formBehaviorSignals(),
      source: 'Website Application',
    });
    setStatus('done');
  }

  if (status === 'done' && gated) {
    return (
      <div style={{ fontFamily: 'Inter, sans-serif', color: TU.navy }}>
        <h3 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 'clamp(22px, 2.4vw, 28px)', color: TU.navy }}>
          Application received{data.name ? `, ${data.name.split(' ')[0]}` : ''}.
        </h3>
        <p style={{ fontSize: 16, opacity: 0.72, marginTop: 10, lineHeight: 1.6 }}>
          Straight up: the full program is a serious investment, and live call times are held for
          students who are in a position to move on it. Based on your answers, we are not booking
          a call yet.
        </p>
        <p style={{ fontSize: 16, opacity: 0.72, marginTop: 10, lineHeight: 1.6 }}>
          Your application stays on file. If your funding picture changes this cycle, come back
          and book then. It takes 30 seconds.
        </p>
      </div>
    );
  }

  if (status === 'done') {
    return (
      <div style={{ fontFamily: 'Inter, sans-serif', color: TU.navy }}>
        <h3 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 'clamp(22px, 2.4vw, 28px)', color: TU.navy }}>
          One last step{data.name ? `, ${data.name.split(' ')[0]}` : ''}.
        </h3>
        <p style={{ fontSize: 16, opacity: 0.72, marginTop: 10, lineHeight: 1.6 }}>
          Got it. Now pick a time below and your strategy call is locked in.
        </p>
        <div ref={bookRef} style={{ marginTop: 18 }} />
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track.booking('inline_form_link')}
          style={{ display: 'inline-block', marginTop: 14, background: TU.crimson, color: TU.offwhite, padding: '13px 28px', borderRadius: 3, fontSize: 15, fontWeight: 600 }}
        >
          Book your consultation now →
        </a>
        <p style={{ fontSize: 14.5, marginTop: 18, opacity: 0.8 }}>
          Booked?{' '}
          <a href={`/prep?email=${encodeURIComponent(data.email)}`} style={{ color: TU.crimson, fontWeight: 600, textDecoration: 'underline' }}>
            Do the 2-minute call prep
          </a>{' '}
         , share your transcript and activities so we come with a plan built for you.
        </p>
      </div>
    );
  }

  // Progress-bar illusion: fills as they complete the fields that matter. Starts
  // at a friendly baseline and eases toward 100 so it always feels like momentum.
  const progressFields = [
    data.name, data.email, data.phone, data.studentType, data.filledBy,
    data.currentSchool || data.highSchool, data.collegeGPA || data.highSchoolGPA,
    data.targetSchools, data.major, data.careerGoals, data.cycle,
    data.usedAdvisor, data.testPrep, data.funding, data.commitment,
  ];
  const filledCount = progressFields.filter(Boolean).length;
  const progress = Math.min(100, Math.round(12 + (filledCount / progressFields.length) * 88));

  return (
    <form onSubmit={submit}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', color: TU.navy, opacity: 0.7, textTransform: 'uppercase' }}>
            {progress >= 100 ? 'Ready to submit' : progress >= 60 ? "Almost there" : 'Your profile'}
          </span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, color: TU.crimson }}>{progress}%</span>
        </div>
        <div style={{ height: 6, background: TU.divider, borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: TU.crimson, borderRadius: 999, transition: 'width 0.4s ease' }} />
        </div>
      </div>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14.5, lineHeight: 1.6, color: TU.navy, opacity: 0.72, marginBottom: 20 }}>
        Takes about 2 minutes. Not an application, no wrong answers. The more real you are, the sharper your call.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
        <Field label="Full Name" value={data.name} onChange={set('name')} required />
        <Field label="Email" type="email" value={data.email} onChange={set('email')} required />
        <Field label="Phone Number" type="tel" value={data.phone} onChange={set('phone')} required />
        <Select
          label="Where are you in school right now?"
          value={data.studentType}
          onChange={set('studentType')}
          options={['High school student', '4-year college student', 'Community college student', 'Gap year / other']}
          required
        />
        <Select
          label="Who's filling this out?"
          value={data.filledBy}
          onChange={set('filledBy')}
          options={['Student (filling this out myself)', 'Parent or guardian']}
          required
        />
      </div>

      {/* Adaptive: high-school path */}
      {isHS && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
          <Autocomplete label="Your High School" value={data.highSchool} onChange={set('highSchool')} shardBase={HS_SHARD_BASE} placeholder="Start typing your high school" required />
          <Select label="Current Grade" value={data.gradeLevel} onChange={set('gradeLevel')} options={GRADES} required />
          <Select label="Graduation Year" value={data.gradYear} onChange={set('gradYear')} options={GRAD_YEARS} required />
          <Field label="High School GPA" value={data.highSchoolGPA} onChange={set('highSchoolGPA')} required />
          <Field label="Test Score (SAT/ACT)" value={data.testScore} onChange={set('testScore')} placeholder="Optional, or 'test optional'" />
        </div>
      )}

      {/* Adaptive: college / community-college path */}
      {isCollege && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
          <Autocomplete label="Current College / University" value={data.currentSchool} onChange={set('currentSchool')} datasetUrl={COLLEGES_URL} placeholder="Start typing your college" required />
          <Select label="Year in College" value={data.collegeYear} onChange={set('collegeYear')} options={['Freshman', 'Sophomore', 'Junior', 'Other']} required />
          <Autocomplete label="High School You Attended" value={data.highSchool} onChange={set('highSchool')} shardBase={HS_SHARD_BASE} placeholder="Start typing your high school" required />
          <Field label="College GPA" value={data.collegeGPA} onChange={set('collegeGPA')} required />
          <Field label="High School GPA" value={data.highSchoolGPA} onChange={set('highSchoolGPA')} required />
          <Field label="Test Score (SAT/ACT)" value={data.testScore} onChange={set('testScore')} placeholder="Optional, or 'test optional'" />
        </div>
      )}

      {/* Adaptive: gap year / other */}
      {data.studentType === 'Gap year / other' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
          <Autocomplete label="Most Recent School" value={data.currentSchool} onChange={set('currentSchool')} datasetUrl={COLLEGES_URL} placeholder="Start typing your school" required />
          <Autocomplete label="High School You Attended" value={data.highSchool} onChange={set('highSchool')} shardBase={HS_SHARD_BASE} placeholder="Start typing your high school" required />
          <Field label="High School GPA" value={data.highSchoolGPA} onChange={set('highSchoolGPA')} required />
        </div>
      )}

      {data.studentType && (
        <>
          <Field
            label="Which schools do you want to transfer into?"
            value={data.targetSchools}
            onChange={set('targetSchools')}
            placeholder="List 2 to 5. If one matters most, say why."
            required
          />

          <label className="block" style={{ marginBottom: 18 }}>
            <span style={labelStyle}>What's the biggest thing standing between you and those schools? *</span>
            <span style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: 13.5, lineHeight: 1.5, color: TU.navy, opacity: 0.62, marginTop: 5 }}>
              Be specific. A real example beats a vague answer, and it's what makes your call actually useful.
            </span>
            <textarea
              value={data.challenge}
              onChange={(e) => set('challenge')(e.target.value)}
              onPaste={() => { pasteRef.current = true; }}
              rows={3}
              required
              placeholder="e.g. My GPA dipped sophomore year and I don't know how to explain it. Or: I have no idea what these schools actually want from a transfer."
              style={{ ...fieldStyle, resize: 'vertical' }}
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
            <Select
              label="Intended Major"
              value={data.major}
              onChange={(v) => {
                set('major')(v);
                // Instant pixel signal on the major pick (audience building +
                // value optimization toward target fields).
                trackEvent('MajorIntent', { major: v });
              }}
              options={MAJORS}
              required
            />
            <Select
              label="Career Goal"
              value={data.careerGoals}
              onChange={(v) => {
                set('careerGoals')(v);
                trackEvent('CareerIntent', { career: v });
              }}
              options={CAREERS}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
            <Select label="Which term are you aiming for?" value={data.cycle} onChange={set('cycle')} options={CYCLES} required />
            <Select
              label="Worked with a counselor or consultant before?"
              value={data.usedAdvisor}
              onChange={(v) => {
                set('usedAdvisor')(v);
                // Families who already paid for admissions help are proven
                // payers, flag them for Meta the instant they answer.
                if (v.startsWith('Yes, a private')) {
                  trackEvent('PreviousPayer', { value: 250, currency: 'USD' });
                }
              }}
              options={['No, this would be my first', 'Yes, a private counselor or firm', 'Only my school counselor']}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
            <Select
              label="Ever paid for test prep or tutoring?"
              value={data.testPrep}
              onChange={(v) => {
                set('testPrep')(v);
                if (v.startsWith('Yes')) trackEvent('TestPrepPayer', { value: 120, currency: 'USD' });
              }}
              options={['Yes, paid tutoring or test prep', 'Self-study only', 'Not yet']}
              required
            />
          </div>

          {data.usedAdvisor === 'Yes, a private counselor or firm' && (
            <Field
              label="Who did you work with, and what was missing?"
              value={data.advisorFirm}
              onChange={set('advisorFirm')}
              placeholder="No need to be diplomatic. What did you hope they'd do that they didn't?"
            />
          )}

          <Select
            label="If we're a fit, who would make this investment?"
            hint="A premium 1-on-1 program with a senior advisor running your entire transfer. A real investment, not a course or a template. Nothing's decided here, this just shapes the conversation."
            value={data.funding}
            onChange={(v) => {
              if (investmentDwell.current === null && investmentShownAt.current !== null) {
                investmentDwell.current = Math.round((Date.now() - investmentShownAt.current) / 1000);
              }
              set('funding')(v);
              // Fire a Meta/GA signal the instant they declare intent, weighted by answer.
              const val = /and they know/.test(v) ? 300 : /don't know yet/.test(v) ? 120 : /myself/.test(v) ? 60 : 10;
              trackEvent('InvestmentIntent', { level: v, value: val, currency: 'USD' });
            }}
            options={FUNDING}
            required
          />

          <Select
            label="How set are you on transferring?"
            hint="No wrong answer."
            value={data.commitment}
            onChange={(v) => {
              set('commitment')(v);
              const val = /^Applying/.test(v) ? 200 : /^Very likely/.test(v) ? 80 : 15;
              trackEvent('CommitmentIntent', { level: v, value: val, currency: 'USD' });
            }}
            options={COMMITMENT}
            required
          />

          <label className="flex items-start gap-3" style={{ marginBottom: 18, cursor: 'pointer' }}>
            <input
              type="checkbox"
              required
              checked={data.showUp === 'Agreed'}
              onChange={(e) => set('showUp')(e.target.checked ? 'Agreed' : '')}
              style={{ marginTop: 4, width: 16, height: 16, accentColor: TU.crimson }}
            />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13.5, lineHeight: 1.5, color: TU.navy, opacity: 0.75 }}>
              We hold call times personally for each student. If I book one, I'll show up, or
              I'll reschedule ahead of time so someone else can have the slot. *
            </span>
          </label>
        </>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        style={{
          background: TU.crimson, color: TU.offwhite, padding: '14px 32px', borderRadius: 3,
          fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600, marginTop: 8,
          opacity: status === 'sending' ? 0.6 : 1, cursor: status === 'sending' ? 'wait' : 'pointer',
        }}
      >
        {status === 'sending' ? 'One sec…' : 'Book a Call'}
      </button>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: TU.navy, opacity: 0.6, marginTop: 20 }}>
        Prefer to talk? Call or text{' '}
        <a href="tel:+16462462458" style={{ color: TU.crimson, textDecoration: 'underline' }}>
          (646) 246-2458
        </a>
      </p>
    </form>
  );
}
