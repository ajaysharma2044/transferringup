import { useCallback, useEffect, useMemo, useState } from 'react';
import { computeRead, DELIVERY_RULES, type PsychRead } from '../lib/salesPsych';
import { CALL_PLANS, DOCTRINE, CHASE_RULES, PARENT_PLAYBOOK } from '../lib/psychDoctrine';
import { pickArchetype } from '../lib/archetypes';
import { marketRead, extractState } from '../lib/marketRead';
import { regionalRead } from '../lib/regionalPsych';
import { readPersonality } from '../lib/personalityRead';
import { incomeEstimate } from '../lib/incomeEstimate';
import { presentationRead } from '../lib/presentationRead';
import { referencePoints } from '../lib/referencePoints';
import { CULTURAL_DISCLAIMER, CULTURAL_READS, guessBackground } from '../lib/culturalReads';
import { CALL_BLUEPRINT, FRAMEWORKS, FRAMEWORK_BY_BUYER, TONALITY_RULES } from '../lib/callFrameworks';
import { QUESTION_BANK, OBJECTION_LIBRARY, CLOSE_LINES } from '../lib/questionBank';
import { SEQUENCES } from '../lib/followUpEngine';
import { schoolComplaints, targetGpas } from '../lib/schoolLore';
import { wikiSchool, mapEmbedUrl, type WikiCard } from '../lib/wikiIntel';
import { SCHOOL_BRAND } from '../data/results';

// TransferringUP Command Center (/hq) — the closer's cockpit.
// Instant loads (localStorage paint + 60s API cache), your real calendar,
// every person clickable into a full psychological sales read.

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL as string | undefined;
const KEY_LS = 'tu-admin-key';
const DATA_LS = 'tu-admin-cache';

type Person = {
  when: string; ts: number; name: string; email: string; phone: string;
  tier: string; pipeline: string; pay: string; wealth: string; school: string;
  hsCat: string; major: string; targets: string; funding: string;
  commitment: string; score: number; call: string; opens: string;
};
type AgendaItem = { day: string; time: string; title: string; guest: string; email: string; isCall: boolean };
type Summary = { generatedAt: string; stats: Record<string, number | null>; agenda: AgendaItem[]; people: Person[] };
type Session = { when: string; ts: number; mins: number; pages: number; trail: string; times: Record<string, number>; device: string; via: string; scroll: number };
type PersonDetail = { email: string; fields: Record<string, string>; calls: { date: string; time: string; status: string; dealValue: string; notes: string }[]; journey?: Session[]; prepDone?: boolean };

/* ------------------------------ design tokens ------------------------------ */
const T = {
  bg: '#0b1017',
  bgGrad: 'radial-gradient(1200px 500px at 70% -10%, rgba(122,0,0,.28), transparent), radial-gradient(900px 400px at 0% 0%, rgba(212,170,0,.10), transparent), #0b1017',
  card: 'rgba(255,255,255,.035)',
  cardBorder: 'rgba(255,255,255,.09)',
  text: '#eef1f6', dim: '#9aa8bc',
  gold: '#e8b923', crimson: '#c0392b', crimsonDeep: '#7A0000',
  green: '#2ecc71', red: '#e74c3c', blue: '#5B9CF5', amber: '#f5a623', purple: '#b06ad4', teal: '#2bb3a3',
};
const font = '-apple-system, "Segoe UI", Roboto, Arial, sans-serif';
const cardStyle: React.CSSProperties = {
  background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 16,
  padding: '20px 22px', marginTop: 18, backdropFilter: 'blur(6px)',
};

function tierColor(t: string) {
  return t === 'Hot' ? T.green : t === 'Warm' ? T.amber : t === 'Likely spam' ? T.red : T.blue;
}
function callColor(st: string) {
  return st === 'Showed' ? T.green : st === 'Closed - Won' ? T.gold : st === 'No-show' ? T.red : st === 'Canceled' ? '#5f6b7a' : T.blue;
}
function tempColor(t: string) {
  return t === 'READY TO CLOSE' ? T.green : t === 'NEEDS PROOF' ? T.amber : t === 'NEEDS TRUST' ? T.blue : '#8a93a5';
}
function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((w) => w[0] || '').join('').toUpperCase() || '?';
}
function Avatar({ name, tier, size = 40 }: { name: string; tier: string; size?: number }) {
  const c = tierColor(tier);
  return (
    <span style={{
      width: size, height: size, minWidth: size, borderRadius: '50%', display: 'inline-flex',
      alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: size * 0.38,
      background: `linear-gradient(135deg, ${c}33, ${c}0f)`, border: `2px solid ${c}`, color: T.text,
    }}>
      {initials(name)}
    </span>
  );
}
function Chip({ text, bg, fg, big }: { text: string; bg: string; fg?: string; big?: boolean }) {
  if (!text) return null;
  return (
    <span style={{
      display: 'inline-block', padding: big ? '4px 13px' : '3px 11px', borderRadius: 999,
      fontSize: big ? 13 : 12, fontWeight: 800, background: bg, color: fg || '#fff', marginRight: 7, marginBottom: 5,
    }}>
      {text}
    </span>
  );
}
function Tile({ n, label, color }: { n: string | number; label: string; color?: string }) {
  return (
    <div style={{ flex: '1 1 118px', minWidth: 118, ...cardStyle, marginTop: 0, padding: '16px 18px' }}>
      <b style={{ display: 'block', fontSize: 30, letterSpacing: '-.02em', color: color || T.text }}>{n}</b>
      <span style={{ display: 'block', fontSize: 11, letterSpacing: '.1em', color: T.dim, marginTop: 5, textTransform: 'uppercase', fontWeight: 600 }}>{label}</span>
    </div>
  );
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 13, letterSpacing: '.14em', color: T.gold, margin: '0 0 14px', textTransform: 'uppercase', fontWeight: 800 }}>{children}</h2>;
}
function Row({ label, value, strong }: { label: string; value?: string; strong?: boolean }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: 14, padding: '9px 0', borderBottom: `1px solid ${T.cardBorder}`, fontSize: 15 }}>
      <div style={{ width: '36%', minWidth: 130, color: T.dim, fontSize: 13, paddingTop: 1 }}>{label}</div>
      <div style={{ flex: 1, fontWeight: strong ? 700 : 400, overflowWrap: 'anywhere', lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

const GROUPS: { title: string; icon: string; keys: [string, string][] }[] = [
  {
    title: 'Background', icon: '🎓',
    keys: [['studentType', 'Student type'], ['highSchool', 'High school'], ['hsType', 'HS type'], ['hsCategory', 'HS category'],
      ['zipTop200kShare', 'HS neighborhood'], ['zipMeanIncome', 'Area income'], ['gradeLevel', 'Grade'], ['gradYear', 'Grad year'],
      ['currentSchool', 'College'], ['collegeYear', 'Year'], ['collegeCategory', 'College tier'],
      ['highSchoolGPA', 'HS GPA'], ['collegeGPA', 'College GPA'], ['gpaTrajectory', 'GPA trend'], ['testScore', 'Test score']],
  },
  {
    title: 'Goals + motivation', icon: '🎯',
    keys: [['targetSchools', 'Dream schools'], ['intendedMajor', 'Major'], ['careerGoals', 'Career goal'], ['cycle', 'Cycle'],
      ['challenge', 'Why transfer, why now'], ['callGoal', 'Wants from the call'], ['lastCycleResults', 'Last cycle']],
  },
  {
    title: 'Money signals', icon: '💰',
    keys: [['abilityToPay', 'Ability to pay (0-100)'], ['fundingSource', 'Who funds it'], ['commitmentLevel', 'Commitment'],
      ['investmentReadiness', 'Readiness band'], ['usedAdvisorBefore', 'Paid counselor before'], ['previousAdvisorFirm', 'Which firm'],
      ['testPrepUsed', 'Paid test prep'], ['filledBy', 'Filled by'], ['leadScore', 'Lead score']],
  },
  {
    title: 'Prep + engagement', icon: '📡',
    keys: [['trafficSource', 'How they found us'], ['searchKeyword', 'Search keyword they clicked'],
      ['keywordMatchtype', 'Keyword match type'], ['adCreativeId', 'Ad creative ID'], ['adCampaign', 'Ad campaign'], ['adGroupId', 'Ad group'],
      ['firstTouchSource', 'First ever visit via'], ['firstTouchLanding', 'First page they landed on'], ['firstTouchWhen', 'First seen'],
      ['uploads', 'Uploads'], ['showUpAgreement', 'Show-up agreement'], ['emailOpens', 'Email opens'],
      ['visitCount', 'Visits before applying'], ['minutesOnSite', 'Minutes on site'], ['utmSource', 'Ad source (legacy)'], ['utmCampaign', 'Campaign'],
      ['ipCity', 'City'], ['ipRegion', 'Region'], ['device', 'Device']],
  },
];

export default function AdminPage() {
  const [key, setKey] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [sel, setSel] = useState<Person | null>(null);
  const [detail, setDetail] = useState<PersonDetail | null>(null);
  const [trainMsg, setTrainMsg] = useState('');
  const [bulkEmails, setBulkEmails] = useState('');
  const [bulkValue, setBulkValue] = useState('');
  const [bulkMsg, setBulkMsg] = useState('');
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkEvent, setBulkEvent] = useState<'Purchase' | 'NoShow'>('Purchase');

  // Fire CAPI conversions for a list of emails so Meta learns who your real
  // buyers (Purchase) or ghosts (NoShow) are. Idempotent server-side.
  const trainPixel = useCallback(async (emails: string, value: string, event = 'Purchase'): Promise<{ sent: number; error?: string; message?: string } | null> => {
    if (!SCRIPT_URL || !key) return null;
    const val = value || (event === 'NoShow' ? '1' : '');
    const q = `${SCRIPT_URL}?key=${encodeURIComponent(key)}&api=trainpixel&event=${encodeURIComponent(event)}&emails=${encodeURIComponent(emails)}${val ? `&value=${encodeURIComponent(val)}` : ''}`;
    const r = await fetch(q);
    return JSON.parse(await r.text());
  }, [key]);

  // One-click call outcomes. Sets the person's latest Bookings row server-side
  // and runs the status engine right away (No-show -> rebook email + NoShow
  // pixel event, Showed -> CallShowed, Closed - Won -> Purchase). Falls back
  // to a plain pixel event if the deployed script predates the endpoint.
  const markOutcome = useCallback(async (email: string, status: string): Promise<string> => {
    if (!SCRIPT_URL || !key) return 'Not connected.';
    try {
      const r = await fetch(`${SCRIPT_URL}?key=${encodeURIComponent(key)}&api=outcome&email=${encodeURIComponent(email)}&status=${encodeURIComponent(status)}`);
      const j = JSON.parse(await r.text());
      if (j?.ok) {
        if (status === 'No-show') return j.booking ? '✓ No-show logged. NoShow sent to Meta + rebook email sent.' : '✓ NoShow sent to Meta (no booking row found for them).';
        if (status === 'Showed') return '✓ Showed logged. CallShowed sent to Meta.';
        return '✓ Closed - Won logged. Purchase sent to Meta.';
      }
      if (j && j.ok === false) return 'Server rejected it: ' + (j.error || 'unknown error');
    } catch { /* old script deployed: fall through to the plain pixel event */ }
    const ev = status === 'No-show' ? 'NoShow' : status === 'Showed' ? 'CallShowed' : 'Purchase';
    const res = await trainPixel(email, '', ev);
    return res?.sent ? `✓ ${ev} sent to Meta. (Paste the latest Apps Script to also log it on the Bookings tab.)` : (res?.message || 'Could not send.');
  }, [key, trainPixel]);
  const [wikiHs, setWikiHs] = useState<WikiCard>(null);
  const [wikiCollege, setWikiCollege] = useState<WikiCard>(null);
  const [news, setNews] = useState<{ title: string; when: string; source: string; kind: string }[] | null>(null);

  // Live intel: Wikipedia photo + blurb for their high school and university.
  useEffect(() => {
    setWikiHs(null);
    setWikiCollege(null);
    setNews(null);
    if (!detail) return;
    let live = true;
    if (detail.fields.highSchool) wikiSchool(detail.fields.highSchool).then((w) => { if (live) setWikiHs(w); });
    if (detail.fields.currentSchool) wikiSchool(detail.fields.currentSchool).then((w) => { if (live) setWikiCollege(w); });
    // Live news + sports headlines for their current school (server-side RSS).
    const newsSchool = detail.fields.currentSchool || detail.fields.highSchool;
    if (newsSchool && SCRIPT_URL && key) {
      fetch(`${SCRIPT_URL}?key=${encodeURIComponent(key)}&api=news&school=${encodeURIComponent(newsSchool)}`)
        .then((r) => r.json())
        .then((j) => { if (live) setNews(j.items || []); })
        .catch(() => { if (live) setNews([]); });
    }
    return () => { live = false; };
  }, [detail, key]);

  useEffect(() => {
    document.title = 'Command Center | TransferringUP';
    try { localStorage.setItem('tu-notrack', '1'); } catch { /* private mode */ }
    const fromUrl = new URLSearchParams(location.search).get('key');
    const stored = (() => { try { return localStorage.getItem(KEY_LS); } catch { return null; } })();
    const k = fromUrl || stored || '';
    if (k) {
      setKey(k);
      try { localStorage.setItem(KEY_LS, k); } catch { /* ok */ }
    }
    try {
      const cached = localStorage.getItem(DATA_LS);
      if (cached) setData(JSON.parse(cached));
    } catch { /* ok */ }
  }, []);

  const refresh = useCallback(async (k: string, fresh?: boolean) => {
    if (!SCRIPT_URL || !k) return;
    setLoading(true);
    setErr('');
    try {
      const r = await fetch(`${SCRIPT_URL}?key=${encodeURIComponent(k)}&api=summary${fresh ? '&fresh=1' : ''}`);
      const txt = await r.text();
      if (txt.startsWith('Not found')) { setErr('Wrong key.'); setLoading(false); return; }
      const j = JSON.parse(txt) as Summary;
      setData(j);
      try { localStorage.setItem(DATA_LS, JSON.stringify(j)); } catch { /* ok */ }
    } catch {
      setErr('Could not reach the data source (did the new script version get deployed?). Retrying in 60s.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!key) return;
    refresh(key);
    const iv = setInterval(() => refresh(key), 60000);
    return () => clearInterval(iv);
  }, [key, refresh]);

  const openPerson = useCallback(async (p: Person) => {
    setSel(p);
    setDetail(null);
    setTrainMsg('');
    if (!SCRIPT_URL || !key) return;
    try {
      const r = await fetch(`${SCRIPT_URL}?key=${encodeURIComponent(key)}&api=person&email=${encodeURIComponent(p.email)}`);
      setDetail(JSON.parse(await r.text()) as PersonDetail);
    } catch { /* summary-only panel */ }
  }, [key]);

  const read: PsychRead | null = useMemo(() => (detail ? computeRead(detail.fields) : null), [detail]);

  const people = useMemo(() => {
    if (!data) return [];
    const needle = q.trim().toLowerCase();
    return data.people.filter((p) => {
      if (tierFilter === 'T1' && !/Tier 1/.test(p.pipeline)) return false;
      if (tierFilter === 'Hot' && p.tier !== 'Hot') return false;
      if (tierFilter === 'Rich' && !/^(Ultra|Wealthy)/.test(p.wealth)) return false;
      if (tierFilter === 'Booked' && !p.call) return false;
      if (!needle) return true;
      return (p.name + ' ' + p.email + ' ' + p.school + ' ' + p.targets + ' ' + p.major).toLowerCase().includes(needle);
    });
  }, [data, q, tierFilter]);

  const agendaByDay = useMemo(() => {
    const m = new Map<string, AgendaItem[]>();
    (data?.agenda || []).forEach((a) => {
      if (!m.has(a.day)) m.set(a.day, []);
      m.get(a.day)!.push(a);
    });
    return [...m.entries()];
  }, [data]);

  /* ------------------------------- key gate ------------------------------- */
  if (!key) {
    return (
      <main style={{ background: T.bgGrad, minHeight: '100vh', color: T.text, fontFamily: font, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ ...cardStyle, width: 340, padding: 32 }}>
          <div style={{ fontSize: 30 }}>🎯</div>
          <h1 style={{ fontSize: 19, letterSpacing: '.08em', margin: '10px 0 0' }}>COMMAND CENTER</h1>
          <p style={{ color: T.dim, fontSize: 14, marginTop: 8 }}>Enter your dashboard key.</p>
          <input value={keyInput} onChange={(e) => setKeyInput(e.target.value)} placeholder="TU-..."
            style={{ width: '100%', background: 'rgba(0,0,0,.35)', border: `1px solid ${T.cardBorder}`, borderRadius: 8, padding: '12px 14px', color: T.text, fontSize: 15, marginTop: 12 }} />
          <button
            onClick={() => { if (keyInput.trim()) { setKey(keyInput.trim()); try { localStorage.setItem(KEY_LS, keyInput.trim()); } catch { /* ok */ } } }}
            style={{ width: '100%', marginTop: 14, background: T.gold, color: '#000', fontWeight: 800, borderRadius: 8, padding: '12px 0', fontSize: 15, cursor: 'pointer', border: 0 }}>
            Open
          </button>
        </div>
      </main>
    );
  }

  const st = data?.stats || {};
  return (
    <main style={{ background: T.bgGrad, minHeight: '100vh', color: T.text, fontFamily: font }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '26px 18px 90px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
          <h1 style={{ fontSize: 21, letterSpacing: '.06em', margin: 0, fontWeight: 800 }}>
            TRANSFERRING<span style={{ color: T.gold }}>UP</span> <span style={{ color: T.dim, fontWeight: 400 }}>· Command Center</span>
          </h1>
          <div style={{ fontSize: 13, color: T.dim }}>
            {loading ? 'refreshing…' : data ? `updated ${data.generatedAt}` : 'loading…'}
            {' · '}
            <a onClick={() => refresh(key, true)} style={{ color: T.gold, cursor: 'pointer', fontWeight: 700 }}>refresh</a>
            {' · '}
            <a href="https://docs.google.com/spreadsheets/d/1zUcsZ0IlPXjr0zvReIBFq4fMU3nV0zJ4yxEJSmK5io8/edit" target="_blank" rel="noreferrer" style={{ color: T.gold, fontWeight: 700 }}>sheet</a>
          </div>
        </div>
        {err && <div style={{ background: 'rgba(231,76,60,.12)', border: `1px solid ${T.red}`, borderRadius: 10, padding: '10px 14px', fontSize: 14, marginTop: 12 }}>{err}</div>}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>
          <Tile n={st.leads ?? '–'} label="Leads" />
          <Tile n={st.hot ?? '–'} label="Hot" color={T.green} />
          <Tile n={st.ready ?? '–'} label="Ready to invest" color={T.crimson} />
          <Tile n={st.booked ?? '–'} label="Calls booked" color={T.blue} />
          <Tile n={st.showRate != null ? `${st.showRate}%` : '–'} label="Show rate" color={T.amber} />
          <Tile n={st.closed ?? '–'} label="Closed" color={T.gold} />
          <Tile n={st.revenue ? `$${Number(st.revenue).toLocaleString()}` : '$0'} label="Revenue" color={T.gold} />
          <Tile n={st.visits7 ?? '–'} label="Visits (7d)" color={T.purple} />
        </div>

        <div style={cardStyle}>
          <SectionTitle>📅 Calendar · next 7 days</SectionTitle>
          {!agendaByDay.length && <div style={{ color: T.dim, fontSize: 15 }}>Nothing on the calendar.</div>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {agendaByDay.map(([day, items]) => (
              <div key={day}>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: T.text, letterSpacing: '.04em', paddingBottom: 8, borderBottom: `2px solid ${T.cardBorder}` }}>{day}</div>
                {items.map((a, i) => {
                  const person = a.email ? data?.people.find((p) => p.email === a.email) : undefined;
                  return (
                    <div key={i} style={{ padding: '10px 0', borderBottom: `1px solid ${T.cardBorder}`, fontSize: 15, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: a.isCall ? T.gold : T.dim, fontWeight: 800, minWidth: 74 }}>{a.time}</span>
                      {a.isCall && person ? (
                        <a onClick={() => openPerson(person)} style={{ color: T.gold, fontWeight: 800, cursor: 'pointer', fontSize: 15.5 }}>
                          📞 {a.guest || a.title}
                        </a>
                      ) : (
                        <span style={{ color: a.isCall ? T.text : T.dim }}>{a.isCall ? '📞 ' : ''}{a.isCall && a.guest ? a.guest : a.title}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 6 }}>
            <SectionTitle>👥 People · {people.length}</SectionTitle>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {[['', 'All'], ['Hot', 'Hot'], ['T1', 'Tier 1'], ['Rich', 'Wealthy'], ['Booked', 'Booked']].map(([val, label]) => (
                <a key={label} onClick={() => setTierFilter(val)}
                  style={{
                    fontSize: 13, padding: '5px 14px', borderRadius: 999, cursor: 'pointer', fontWeight: 800,
                    background: tierFilter === val ? T.gold : 'rgba(255,255,255,.06)', color: tierFilter === val ? '#000' : T.dim,
                  }}>
                  {label}
                </a>
              ))}
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, school, target…"
                style={{ background: 'rgba(0,0,0,.35)', border: `1px solid ${T.cardBorder}`, borderRadius: 8, padding: '8px 12px', color: T.text, fontSize: 14, width: 210 }} />
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, whiteSpace: 'nowrap' }}>
              <thead>
                <tr>
                  {['Person', 'Tier', 'Pipeline', 'School', 'Wealth', 'Funding', 'Call', 'Score'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', fontSize: 11, letterSpacing: '.1em', color: T.dim, textTransform: 'uppercase', padding: '8px 10px', borderBottom: `2px solid ${T.cardBorder}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {people.map((p) => (
                  <tr key={p.email + p.ts} onClick={() => openPerson(p)} style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.05)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}>
                    <td style={{ padding: '11px 10px', borderBottom: `1px solid ${T.cardBorder}` }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        <Avatar name={p.name} tier={p.tier} />
                        <span>
                          <b style={{ fontSize: 15.5 }}>{p.name}</b>
                          <span style={{ display: 'block', color: T.dim, fontSize: 12.5 }}>{p.when.replace(/, .*$/, '')} · {p.major || p.email}</span>
                        </span>
                      </span>
                    </td>
                    <td style={{ padding: '11px 10px', borderBottom: `1px solid ${T.cardBorder}` }}><Chip text={p.tier || '–'} bg={tierColor(p.tier)} /></td>
                    <td style={{ padding: '11px 10px', borderBottom: `1px solid ${T.cardBorder}`, fontSize: 13.5 }}>{p.pipeline.replace(/Tier (\d) - /, 'T$1 ')}</td>
                    <td style={{ padding: '11px 10px', borderBottom: `1px solid ${T.cardBorder}`, fontSize: 14, maxWidth: 190, overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.school}</td>
                    <td style={{ padding: '11px 10px', borderBottom: `1px solid ${T.cardBorder}` }}>{/^(Ultra|Wealthy)/.test(p.wealth) ? <Chip text={p.wealth.replace(' area', '')} bg={T.gold} fg="#000" /> : <span style={{ color: T.dim, fontSize: 13 }}>{p.wealth.replace(' area', '') || '–'}</span>}</td>
                    <td style={{ padding: '11px 10px', borderBottom: `1px solid ${T.cardBorder}`, fontSize: 13.5, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.funding}</td>
                    <td style={{ padding: '11px 10px', borderBottom: `1px solid ${T.cardBorder}` }}>{p.call ? <Chip text={p.call} bg={callColor(p.call)} fg={p.call === 'Closed - Won' ? '#000' : '#fff'} /> : <span style={{ color: T.dim }}>–</span>}</td>
                    <td style={{ padding: '11px 10px', borderBottom: `1px solid ${T.cardBorder}` }}><b style={{ fontSize: 16 }}>{p.score || ''}</b></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ ...cardStyle, border: `1px solid ${T.gold}44` }}>
          <SectionTitle>🎯 Train the pixel from your history</SectionTitle>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button
              onClick={() => setBulkEvent('Purchase')}
              style={{ background: bulkEvent === 'Purchase' ? T.gold : 'rgba(255,255,255,.08)', color: bulkEvent === 'Purchase' ? '#000' : T.dim, fontWeight: 800, fontSize: 13.5, border: 0, borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}
            >
              💰 Signed clients
            </button>
            <button
              onClick={() => setBulkEvent('NoShow')}
              style={{ background: bulkEvent === 'NoShow' ? T.red : 'rgba(255,255,255,.08)', color: bulkEvent === 'NoShow' ? '#fff' : T.dim, fontWeight: 800, fontSize: 13.5, border: 0, borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}
            >
              👻 No-shows
            </button>
          </div>
          <div style={{ fontSize: 13.5, color: T.dim, lineHeight: 1.55, marginBottom: 12 }}>
            {bulkEvent === 'Purchase' ? (
              <>Paste the emails of everyone you have ever signed (one per line, or comma-separated). This fires a
              Purchase + QualifiedLead conversion to Meta for each, so the pixel learns exactly who your real buyers
              are and builds lookalikes from them. Safe to re-run: Meta dedupes, so nobody gets counted twice.
              {' '}Optionally set the average deal value so Meta optimizes on real dollars.</>
            ) : (
              <>Paste the emails of everyone who booked and ghosted. This fires a NoShow event for each. In Ads
              Manager, build a custom audience on the NoShow event and EXCLUDE it (and its lookalike) from your
              campaigns, so Meta stops spending money finding people who book and vanish. Safe to re-run.</>
            )}
          </div>
          <textarea
            value={bulkEmails}
            onChange={(e) => setBulkEmails(e.target.value)}
            rows={5}
            placeholder={"jane@email.com\njohn@email.com, sara@email.com\n..."}
            style={{ width: '100%', background: 'rgba(0,0,0,.35)', border: `1px solid ${T.cardBorder}`, borderRadius: 8, padding: '10px 12px', color: T.text, fontSize: 14, fontFamily: font }}
          />
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10, flexWrap: 'wrap' }}>
            {bulkEvent === 'Purchase' && (
              <input
                value={bulkValue}
                onChange={(e) => setBulkValue(e.target.value.replace(/[^\d]/g, ''))}
                placeholder="Avg deal value $ (optional)"
                style={{ background: 'rgba(0,0,0,.35)', border: `1px solid ${T.cardBorder}`, borderRadius: 8, padding: '9px 12px', color: T.text, fontSize: 14, width: 200 }}
              />
            )}
            <button
              disabled={bulkBusy || !bulkEmails.trim()}
              onClick={async () => {
                setBulkBusy(true);
                setBulkMsg('Firing conversions...');
                const res = await trainPixel(bulkEmails, bulkEvent === 'Purchase' ? bulkValue : '', bulkEvent);
                setBulkBusy(false);
                if (!res) setBulkMsg('Could not reach the server.');
                else if (res.error) setBulkMsg(res.message || 'Set your Meta CAPI token in Script Properties first.');
                else if (bulkEvent === 'NoShow') setBulkMsg(`✓ Fired NoShow for ${res.sent} ${res.sent === 1 ? 'person' : 'people'}. Now exclude that audience in Ads Manager.`);
                else setBulkMsg(`✓ Fired Purchase + QualifiedLead for ${res.sent} client${res.sent === 1 ? '' : 's'}. Check Events Manager in a few minutes.`);
              }}
              style={{ background: T.gold, color: '#000', fontWeight: 800, fontSize: 14, border: 0, borderRadius: 8, padding: '10px 20px', cursor: bulkBusy ? 'wait' : 'pointer', opacity: bulkBusy || !bulkEmails.trim() ? 0.6 : 1 }}
            >
              {bulkBusy ? 'Sending...' : 'Fire conversions to Meta'}
            </button>
            {bulkMsg && <span style={{ fontSize: 13.5, color: T.text }}>{bulkMsg}</span>}
          </div>
        </div>

        <div style={cardStyle}>
          <SectionTitle>🧠 The playbook (study between calls)</SectionTitle>
          <details>
            <summary style={{ cursor: 'pointer', color: T.gold, fontSize: 14.5, fontWeight: 800, padding: '4px 0' }}>
              The 11 laws of the transfer buyer
            </summary>
            {DOCTRINE.map((d, i) => (
              <div key={i} style={{ padding: '11px 0', borderBottom: `1px solid ${T.cardBorder}` }}>
                <div style={{ fontSize: 15.5, fontWeight: 800, color: T.gold }}>{i + 1}. {d.title}</div>
                <div style={{ fontSize: 14.5, lineHeight: 1.6, color: '#c9d4e3', marginTop: 5 }}>{d.insight}</div>
              </div>
            ))}
          </details>
          <details style={{ marginTop: 10 }}>
            <summary style={{ cursor: 'pointer', color: T.crimson, fontSize: 14.5, fontWeight: 800, padding: '4px 0' }}>
              The chase rules (they pursue you, never the reverse)
            </summary>
            {CHASE_RULES.map((r, i) => (
              <div key={i} style={{ fontSize: 14.5, lineHeight: 1.6, padding: '9px 0', borderBottom: `1px solid ${T.cardBorder}` }}>{r}</div>
            ))}
          </details>
          <details style={{ marginTop: 10 }}>
            <summary style={{ cursor: 'pointer', color: T.green, fontSize: 14.5, fontWeight: 800, padding: '4px 0' }}>
              The call blueprint (30-45 min, phase by phase)
            </summary>
            {CALL_BLUEPRINT.map((p, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: `1px solid ${T.cardBorder}` }}>
                <div style={{ fontSize: 15, fontWeight: 800 }}><span style={{ color: T.green }}>{p.minutes} min</span> · {p.phase}</div>
                <div style={{ fontSize: 14, color: '#c9d4e3', marginTop: 4, lineHeight: 1.55 }}><b>Goal:</b> {p.goal}</div>
                <div style={{ fontSize: 14, color: '#c9d4e3', marginTop: 3, lineHeight: 1.55 }}><b>How:</b> {p.how}</div>
                <div style={{ fontSize: 13.5, color: T.gold, marginTop: 4, fontStyle: 'italic' }}>→ "{p.transitionOut}"</div>
              </div>
            ))}
          </details>
          <details style={{ marginTop: 10 }}>
            <summary style={{ cursor: 'pointer', color: T.blue, fontSize: 14.5, fontWeight: 800, padding: '4px 0' }}>
              The frameworks + when to use each
            </summary>
            {FRAMEWORKS.map((fw, i) => (
              <div key={i} style={{ padding: '9px 0', borderBottom: `1px solid ${T.cardBorder}` }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: T.blue }}>{fw.name}</div>
                <div style={{ fontSize: 13.5, color: '#c9d4e3', marginTop: 3, lineHeight: 1.5 }}><b>Use when:</b> {fw.useWhen}</div>
                <div style={{ fontSize: 13.5, color: '#c9d4e3', marginTop: 2, lineHeight: 1.5 }}><b>Core move:</b> {fw.coreMove}</div>
                <div style={{ fontSize: 13, color: T.amber, marginTop: 2 }}><b>Watch out:</b> {fw.watchOut}</div>
              </div>
            ))}
            <div style={{ marginTop: 10, fontSize: 12, letterSpacing: '.1em', color: T.gold, fontWeight: 800, textTransform: 'uppercase' }}>Tonality rules</div>
            {TONALITY_RULES.map((r, i) => (
              <div key={i} style={{ fontSize: 14, lineHeight: 1.55, padding: '6px 0', borderBottom: `1px solid ${T.cardBorder}` }}>{r}</div>
            ))}
          </details>
          <details style={{ marginTop: 10 }}>
            <summary style={{ cursor: 'pointer', color: T.purple, fontSize: 14.5, fontWeight: 800, padding: '4px 0' }}>
              The question bank ({Object.values(QUESTION_BANK).reduce((n, a) => n + a.length, 0)} questions by purpose)
            </summary>
            {Object.entries(QUESTION_BANK).map(([cat, qs]) => (
              <div key={cat} style={{ marginTop: 10 }}>
                <div style={{ fontSize: 12, letterSpacing: '.1em', color: T.purple, fontWeight: 800, textTransform: 'uppercase' }}>{cat}</div>
                {qs.map((q, i) => (
                  <div key={i} style={{ fontSize: 14.5, lineHeight: 1.55, padding: '6px 0', borderBottom: `1px solid ${T.cardBorder}` }}>
                    "{q.q}" <span style={{ color: T.dim, fontSize: 12.5 }}>— {q.purpose}</span>
                  </div>
                ))}
              </div>
            ))}
          </details>
          <details style={{ marginTop: 10 }}>
            <summary style={{ cursor: 'pointer', color: T.amber, fontSize: 14.5, fontWeight: 800, padding: '4px 0' }}>
              The objection library ({OBJECTION_LIBRARY.length} objections + counters)
            </summary>
            {OBJECTION_LIBRARY.map((o, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: `1px solid ${T.cardBorder}` }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: T.amber }}>"{o.trigger}"</div>
                <div style={{ fontSize: 13, color: T.dim, marginTop: 3, fontStyle: 'italic' }}>Really means: {o.whatItReallyMeans}</div>
                {o.responses.map((r, j) => (
                  <div key={j} style={{ fontSize: 14, color: '#c9d4e3', marginTop: 5, lineHeight: 1.55, paddingLeft: 10, borderLeft: `2px solid ${T.green}` }}>{r}</div>
                ))}
                <div style={{ fontSize: 13.5, color: T.blue, marginTop: 5 }}><b>Then ask:</b> "{o.thenAsk}"</div>
              </div>
            ))}
          </details>
          <details style={{ marginTop: 10 }}>
            <summary style={{ cursor: 'pointer', color: T.gold, fontSize: 14.5, fontWeight: 800, padding: '4px 0' }}>
              The closes ({CLOSE_LINES.length} named)
            </summary>
            {CLOSE_LINES.map((c, i) => (
              <div key={i} style={{ padding: '9px 0', borderBottom: `1px solid ${T.cardBorder}` }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: T.gold }}>{c.name}</div>
                <div style={{ fontSize: 14.5, color: '#c9d4e3', marginTop: 4, lineHeight: 1.55, fontStyle: 'italic' }}>"{c.line}"</div>
                <div style={{ fontSize: 13, color: T.dim, marginTop: 3 }}>Use when: {c.useWhen}</div>
              </div>
            ))}
          </details>
          <details style={{ marginTop: 10 }}>
            <summary style={{ cursor: 'pointer', color: T.teal, fontSize: 14.5, fontWeight: 800, padding: '4px 0' }}>
              Follow-up sequences by what happened on the call
            </summary>
            {Object.values(SEQUENCES).map((seq, i) => (
              <details key={i} style={{ padding: '8px 0', borderBottom: `1px solid ${T.cardBorder}` }}>
                <summary style={{ cursor: 'pointer', fontSize: 15, fontWeight: 700, color: T.teal }}>{seq.label}</summary>
                <div style={{ fontSize: 13, color: T.dim, fontStyle: 'italic', margin: '6px 0', lineHeight: 1.5 }}>{seq.psychology}</div>
                {seq.touches.map((t, j) => (
                  <div key={j} style={{ padding: '7px 0', borderTop: `1px solid ${T.cardBorder}` }}>
                    <Chip text={`Day ${t.day} · ${t.channel}`} bg={t.channel === 'text' ? T.teal : T.purple} />
                    {t.subject && <span style={{ fontSize: 12.5, color: T.dim }}> subj: {t.subject}</span>}
                    <div style={{ fontSize: 14, color: '#c9d4e3', marginTop: 4, lineHeight: 1.55 }}>{t.message}</div>
                  </div>
                ))}
              </details>
            ))}
          </details>
        </div>
      </div>

      {/* ------------------------------ person drawer ------------------------------ */}
      {sel && (
        <div onClick={() => setSel(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 'min(680px, 100%)', background: T.bg, borderLeft: `1px solid ${T.cardBorder}`, overflowY: 'auto' }}>

            <div style={{ background: `linear-gradient(135deg, ${T.crimsonDeep}, #1a0505 65%)`, padding: '24px 24px 20px' }}>
              <a onClick={() => setSel(null)} style={{ color: 'rgba(255,255,255,.75)', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>✕ close</a>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
                <Avatar name={sel.name} tier={sel.tier} size={64} />
                <div>
                  <h2 style={{ fontSize: 27, margin: 0, fontWeight: 800 }}>{sel.name}</h2>
                  <div style={{ color: 'rgba(255,255,255,.8)', fontSize: 14, marginTop: 4 }}>
                    {sel.email}{sel.phone ? ` · ${sel.phone}` : ''}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <Chip big text={sel.tier} bg={tierColor(sel.tier)} />
                <Chip big text={sel.pipeline} bg="rgba(255,255,255,.18)" />
                <Chip big text={sel.wealth} bg={T.gold} fg="#000" />
                <Chip big text={sel.hsCat} bg={T.teal} />
              </div>
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <button
                  onClick={async () => {
                    if (!window.confirm(`Mark ${sel.name} as SIGNED? Fires a Purchase conversion so Meta finds more people like them.`)) return;
                    setTrainMsg('sending...');
                    setTrainMsg(await markOutcome(sel.email, 'Closed - Won'));
                  }}
                  style={{ background: T.gold, color: '#000', fontWeight: 800, fontSize: 13.5, border: 0, borderRadius: 8, padding: '9px 16px', cursor: 'pointer' }}
                >
                  🎯 Signed · train pixel
                </button>
                <button
                  onClick={async () => {
                    setTrainMsg('sending...');
                    setTrainMsg(await markOutcome(sel.email, 'Showed'));
                  }}
                  style={{ background: T.green, color: '#000', fontWeight: 800, fontSize: 13.5, border: 0, borderRadius: 8, padding: '9px 16px', cursor: 'pointer' }}
                >
                  ✅ Showed
                </button>
                <button
                  onClick={async () => {
                    if (!window.confirm(`Mark ${sel.name} as a NO-SHOW? Tells Meta to stop finding people like this, and emails them a rebook link.`)) return;
                    setTrainMsg('sending...');
                    setTrainMsg(await markOutcome(sel.email, 'No-show'));
                  }}
                  style={{ background: T.red, color: '#fff', fontWeight: 800, fontSize: 13.5, border: 0, borderRadius: 8, padding: '9px 16px', cursor: 'pointer' }}
                >
                  👻 No-show · train pixel
                </button>
                {trainMsg && <span style={{ fontSize: 13, color: 'rgba(255,255,255,.9)', width: '100%' }}>{trainMsg}</span>}
              </div>
            </div>

            <div style={{ padding: '4px 22px 70px' }}>
              {/* The entire sales-psychology stack lives behind ONE toggle so
                  the drawer defaults to the person's actual data (journey,
                  calls, uploads, fields). Open this before a call, not while
                  scrolling for their phone number. */}
              <details style={{ margin: '14px 0' }}>
                <summary style={{ cursor: 'pointer', listStyle: 'none', background: 'rgba(232,185,35,.07)', border: `1px solid ${T.gold}55`, borderRadius: 12, padding: '13px 16px', color: T.gold, fontWeight: 800, fontSize: 14.5 }}>
                  🧠 Sales read{read ? ` · ${read.temperature} · show risk ${read.showRisk}` : ''} · psychology, culture + call plan · tap to open
                </summary>
              {read && (
                <div style={{ ...cardStyle, background: 'rgba(232,185,35,.05)', border: `1px solid ${T.gold}44`, padding: '14px 18px' }}>
                  <details>
                    <summary style={{ cursor: 'pointer', color: T.gold, fontSize: 13, fontWeight: 800, letterSpacing: '.08em' }}>
                      🤫 DELIVERY RULES: leak it, never recite it (read before every call)
                    </summary>
                    {DELIVERY_RULES.map((r, i) => (
                      <div key={i} style={{ fontSize: 14, lineHeight: 1.55, padding: '7px 0', borderBottom: `1px solid ${T.cardBorder}` }}>{r}</div>
                    ))}
                  </details>
                </div>
              )}
              {read && (
                <div style={{ ...cardStyle, border: `1px solid ${tempColor(read.temperature)}55` }}>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Chip big text={read.temperature} bg={tempColor(read.temperature)} fg="#000" />
                    <Chip big text={`SHOW RISK: ${read.showRisk}`} bg={read.showRisk === 'HIGH' ? T.red : read.showRisk === 'LOW' ? T.green : T.amber} fg={read.showRisk === 'MEDIUM' ? '#000' : '#fff'} />
                  </div>
                  <div style={{ fontSize: 16.5, marginTop: 14, lineHeight: 1.55 }}>
                    <b style={{ color: T.gold }}>Driver: {read.driver}.</b> {read.driverWhy}
                  </div>
                  <div style={{ fontSize: 14, color: T.dim, marginTop: 10, lineHeight: 1.5 }}>{read.showRiskWhy}</div>

                  {read.proof.length > 0 && (
                    <div style={{ marginTop: 16, padding: '14px 16px', background: 'rgba(212,170,0,.08)', border: `1px solid ${T.gold}44`, borderRadius: 12 }}>
                      <div style={{ fontSize: 12, letterSpacing: '.1em', color: T.gold, fontWeight: 800, textTransform: 'uppercase' }}>Your proof point for this call</div>
                      {read.proof.map((pr, i) => (
                        <div key={i} style={{ fontSize: 17, fontWeight: 800, marginTop: 8 }}>
                          {pr.start} <span style={{ color: T.dim, fontWeight: 400 }}>→</span>{' '}
                          {pr.schools.map((s) => {
                            const brand = Object.values(SCHOOL_BRAND).find((b) => b.full === s);
                            return <span key={s} style={{ color: brand?.color || T.text, marginRight: 10 }}>{s}</span>;
                          })}
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: 18 }}>
                    <div style={{ fontSize: 12, letterSpacing: '.1em', color: T.red, fontWeight: 800, textTransform: 'uppercase' }}>🧠 Where it hurts</div>
                    {read.insecurities.map((x, i) => (
                      <div key={i} style={{ fontSize: 15, lineHeight: 1.55, padding: '9px 0', borderBottom: `1px solid ${T.cardBorder}` }}>{x}</div>
                    ))}
                  </div>

                  <div style={{ marginTop: 18 }}>
                    <div style={{ fontSize: 12, letterSpacing: '.1em', color: T.amber, fontWeight: 800, textTransform: 'uppercase' }}>🛡️ Objections coming (and the counters)</div>
                    {read.objections.map((o, i) => (
                      <div key={i} style={{ padding: '10px 0', borderBottom: `1px solid ${T.cardBorder}` }}>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{o.objection}</div>
                        <div style={{ fontSize: 14.5, color: T.dim, marginTop: 5, lineHeight: 1.55 }}>{o.counter}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 18 }}>
                    <div style={{ fontSize: 12, letterSpacing: '.1em', color: T.green, fontWeight: 800, textTransform: 'uppercase' }}>🎯 Closing plays</div>
                    {read.plays.map((p, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: `1px solid ${T.cardBorder}`, alignItems: 'flex-start' }}>
                        <Chip text={p.principle} bg="rgba(46,204,113,.16)" fg={T.green} />
                        <div style={{ fontSize: 15, lineHeight: 1.55, flex: 1 }}>{p.play}</div>
                      </div>
                    ))}
                  </div>

                  {read.mirror.length > 0 && (
                    <div style={{ marginTop: 18 }}>
                      <div style={{ fontSize: 12, letterSpacing: '.1em', color: T.blue, fontWeight: 800, textTransform: 'uppercase' }}>💬 Their words — quote these back</div>
                      {read.mirror.map((m, i) => (
                        <div key={i} style={{ fontSize: 15, fontStyle: 'italic', color: '#c9d4e3', padding: '10px 14px', borderLeft: `3px solid ${T.blue}`, margin: '10px 0', background: 'rgba(91,156,245,.06)', borderRadius: '0 8px 8px 0', lineHeight: 1.55 }}>
                          “{m}”
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {detail && (() => {
                const arch = pickArchetype(detail.fields);
                const plan = CALL_PLANS[arch.key];
                // Fill the doctrine's template tokens from their actual data.
                const sub = (s: string) => s
                  .replace(/\{firstName\}/g, (detail.fields.name || sel.name).split(' ')[0])
                  .replace(/\{currentSchool\}/g, (detail.fields.currentSchool || 'their school').split('(')[0].trim())
                  .replace(/\{dreamSchool\}/g, (detail.fields.targetSchools || 'the dream school').split(/[,\n]/)[0].trim())
                  .replace(/\{theirWords\}/g, `"${String(detail.fields.challenge || detail.fields.currentSchoolStory || '...').slice(0, 80)}"`)
                  .replace(/\{deadline\}/g, '[your deadline]');
                const parentMode = /parent/i.test(detail.fields.filledBy || '') || /My parents/.test(detail.fields.fundingSource || '');
                const school = detail.fields.currentSchool || detail.fields.highSchool || '';
                const complaints = school ? schoolComplaints(school, detail.fields.collegeCategory || '') : [];
                const gpaM = /([0-4](?:\.\d{1,2})?)/.exec(detail.fields.collegeGPA || detail.fields.highSchoolGPA || '');
                const gpa = gpaM ? Number(gpaM[1]) : null;
                const gaps = targetGpas(detail.fields.targetSchools || '');
                const pct = (g: number) => `${Math.max(4, Math.min(100, ((g - 2.0) / 2.0) * 100))}%`;
                return (
                  <>
                    <div style={{ ...cardStyle, border: `1px solid ${T.purple}55` }}>
                      <SectionTitle>🎭 Archetype</SectionTitle>
                      <div style={{ fontSize: 24, fontWeight: 800 }}>{arch.emoji} {arch.name}</div>
                      <div style={{ fontSize: 15.5, lineHeight: 1.6, marginTop: 10 }}>{arch.essence}</div>
                      <div style={{ marginTop: 14, padding: '12px 15px', background: 'rgba(176,106,212,.08)', borderLeft: `3px solid ${T.purple}`, borderRadius: '0 10px 10px 0', fontSize: 15, lineHeight: 1.6 }}>
                        <b style={{ color: T.purple }}>The conflict:</b> {arch.conflict(school)}
                      </div>
                      <Row label="Core insecurity" value={arch.insecurity} />
                      <Row label="Close with" value={arch.closeWith} strong />
                      <Row label="You lose them if" value={arch.loseIf} />
                      {complaints.length > 0 && (
                        <div style={{ marginTop: 16 }}>
                          <div style={{ fontSize: 12, letterSpacing: '.1em', color: T.teal, fontWeight: 800, textTransform: 'uppercase' }}>
                            🔮 Cold read: what students at {school.split('(')[0].trim() || 'their school'} say
                          </div>
                          <div style={{ fontSize: 13.5, color: T.dim, marginTop: 6 }}>
                            Open with: "Let me guess what it's like there..." then land two of these and watch them open up:
                          </div>
                          {complaints.map((c, i) => (
                            <div key={i} style={{ fontSize: 15, lineHeight: 1.55, padding: '8px 0', borderBottom: `1px solid ${T.cardBorder}` }}>• {c}</div>
                          ))}
                        </div>
                      )}
                    </div>

                    {(() => {
                      const cands = guessBackground(detail.fields.name || sel.name);
                      return (
                        <div style={{ ...cardStyle, border: `1px solid ${T.teal}33` }}>
                          <details>
                            <summary style={{ cursor: 'pointer', color: T.teal, fontSize: 13, fontWeight: 800, letterSpacing: '.06em' }}>
                              🌐 CULTURAL COMMUNICATION REFERENCE {cands.length ? `(possible context, verify)` : '(browse)'}
                            </summary>
                            <div style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.55, margin: '10px 0', fontStyle: 'italic', padding: '10px 12px', background: 'rgba(255,255,255,.03)', borderRadius: 8 }}>
                              {CULTURAL_DISCLAIMER}
                            </div>
                            {(cands.length ? cands.map((c) => c.key) : []).map((k) => {
                              const cr = CULTURAL_READS[k];
                              if (!cr) return null;
                              return (
                                <div key={k} style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${T.cardBorder}` }}>
                                  <div style={{ fontSize: 15.5, fontWeight: 800 }}>{cr.emoji} {cr.community} <span style={{ color: T.amber, fontSize: 12, fontWeight: 700 }}>· LOW confidence, verify</span></div>
                                  <Row label="How they may see the situation" value={cr.viewOfSituation} />
                                  <Row label="Likely decision-maker" value={cr.decisionMaker} strong />
                                  <Row label="Sell to" value={cr.sellTo} />
                                  <Row label="Soothe" value={cr.soothe} />
                                  <Row label="Communication style" value={cr.commStyle} />
                                  <Row label="Resonance move (leak, don't recite)" value={cr.resonanceMove} strong />
                                  <Row label="The trap" value={cr.trap} />
                                  <Row label="Generation shift" value={cr.generationShift} />
                                </div>
                              );
                            })}
                            {!cands.length && (
                              <div style={{ fontSize: 13.5, color: T.dim, marginTop: 8 }}>No surname signal. On the call, listen for family dynamics and pull the matching read from the full library in the study section below.</div>
                            )}
                          </details>
                        </div>
                      );
                    })()}

                    {(() => {
                      const pr = readPersonality(detail.fields);
                      return (
                        <div style={{ ...cardStyle, border: `1px solid ${T.blue}44` }}>
                          <SectionTitle>{pr.emoji} Personality read · how to talk to them</SectionTitle>
                          <div style={{ fontSize: 18, fontWeight: 800 }}>{pr.type}</div>
                          <div style={{ fontSize: 13, color: T.dim, fontStyle: 'italic', marginTop: 4 }}>Evidence: {pr.evidence}</div>
                          <Row label="Talk to them like this" value={pr.talkTo} strong />
                          <Row label="Avoid" value={pr.avoid} />
                          <Row label="Pace" value={pr.pace} />
                          <Row label="How they'll decide" value={pr.decisionStyle} />
                        </div>
                      );
                    })()}

                    {(() => {
                      const mt = marketRead(extractState(detail.fields.highSchool || ''));
                      const pres = presentationRead(arch.key, mt ? mt.tier : null, detail.fields.zipWealthTier || '');
                      return (
                        <div style={{ ...cardStyle, border: `1px solid ${T.purple}44` }}>
                          <SectionTitle>🎥 Show up right (wardrobe + frame for this call)</SectionTitle>
                          <Row label="Wear" value={pres.wardrobe} strong />
                          <Row label="Background" value={pres.background} />
                          <Row label="Energy" value={pres.energy} strong />
                          <Row label="Have ready" value={pres.props} />
                        </div>
                      );
                    })()}

                    {plan && (
                      <div style={{ ...cardStyle, border: `1px solid ${T.green}44` }}>
                        <SectionTitle>📞 The call plan (built for this archetype)</SectionTitle>
                        {FRAMEWORK_BY_BUYER[arch.key] && (
                          <div style={{ fontSize: 14, lineHeight: 1.55, padding: '10px 14px', background: 'rgba(232,185,35,.07)', borderRadius: 10, marginBottom: 14 }}>
                            <b style={{ color: T.gold }}>Lead framework: </b>{FRAMEWORK_BY_BUYER[arch.key]}
                          </div>
                        )}
                        <div style={{ fontSize: 12, letterSpacing: '.1em', color: T.green, fontWeight: 800, textTransform: 'uppercase' }}>Opening (first 90 seconds)</div>
                        <div style={{ fontSize: 15, lineHeight: 1.6, fontStyle: 'italic', padding: '10px 14px', borderLeft: `3px solid ${T.green}`, background: 'rgba(46,204,113,.05)', borderRadius: '0 8px 8px 0', margin: '8px 0 16px' }}>
                          "{sub(plan.opening)}"
                        </div>
                        <div style={{ fontSize: 12, letterSpacing: '.1em', color: T.blue, fontWeight: 800, textTransform: 'uppercase' }}>Discovery questions (in order)</div>
                        {plan.discovery.map((q, i) => (
                          <div key={i} style={{ fontSize: 15, lineHeight: 1.55, padding: '8px 0', borderBottom: `1px solid ${T.cardBorder}`, display: 'flex', gap: 10 }}>
                            <b style={{ color: T.blue, minWidth: 20 }}>{i + 1}.</b> <span>{sub(q)}</span>
                          </div>
                        ))}
                        <div style={{ fontSize: 12, letterSpacing: '.1em', color: T.amber, fontWeight: 800, textTransform: 'uppercase', marginTop: 16 }}>The reframe (your authority moment)</div>
                        <div style={{ fontSize: 15, lineHeight: 1.6, marginTop: 8 }}>{sub(plan.reframe)}</div>
                        <div style={{ fontSize: 12, letterSpacing: '.1em', color: T.gold, fontWeight: 800, textTransform: 'uppercase', marginTop: 16 }}>The close</div>
                        <div style={{ fontSize: 15, lineHeight: 1.6, marginTop: 8 }}>{sub(plan.close)}</div>
                        <div style={{ fontSize: 12, letterSpacing: '.1em', color: T.purple, fontWeight: 800, textTransform: 'uppercase', marginTop: 16 }}>If they don't close: the follow-up sequence</div>
                        {plan.followUp.map((fu, i) => (
                          <div key={i} style={{ padding: '10px 0', borderBottom: `1px solid ${T.cardBorder}` }}>
                            <Chip text={`Day ${fu.day} · ${fu.channel}`} bg={fu.channel === 'text' ? T.teal : T.purple} />
                            <div style={{ fontSize: 14.5, lineHeight: 1.55, marginTop: 6, color: '#c9d4e3' }}>{sub(fu.message)}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {(() => {
                      const st = extractState(detail.fields.highSchool || '');
                      const mr = marketRead(st);
                      const highAch = gpa !== null && gpa >= 3.5;
                      const rr = regionalRead(st, detail.fields.currentSchool || '', highAch);
                      if (!mr && !rr.culture) return null;
                      return (
                        <div style={{ ...cardStyle, border: `1px solid ${T.teal}44` }}>
                          <SectionTitle>🗺️ Regional read · {st}{mr ? ` (${mr.tier} market)` : ''}</SectionTitle>
                          {rr.culture && (
                            <>
                              <div style={{ fontSize: 15, lineHeight: 1.6, fontWeight: 600 }}>{rr.culture.culture}</div>
                              <Row label="The dynamic" value={rr.culture.dynamic} />
                              <Row label="Achiever twist" value={rr.culture.achieverTwist} />
                              <Row label="Transfer flavor" value={rr.culture.transferFlavor} />
                              {rr.culture.knowingLine && (
                                <div style={{ marginTop: 12, padding: '12px 15px', background: 'rgba(43,179,163,.08)', borderLeft: `3px solid ${T.teal}`, borderRadius: '0 10px 10px 0' }}>
                                  <div style={{ fontSize: 11.5, letterSpacing: '.1em', color: T.teal, fontWeight: 800, textTransform: 'uppercase' }}>The knowing line (leak it as a guess)</div>
                                  <div style={{ fontSize: 15.5, fontStyle: 'italic', marginTop: 6, lineHeight: 1.55 }}>"{rr.culture.knowingLine}"</div>
                                </div>
                              )}
                            </>
                          )}
                          {rr.stigma.map((s, i) => (
                            <div key={i} style={{ fontSize: 14.5, lineHeight: 1.6, padding: '9px 0', borderTop: `1px solid ${T.cardBorder}`, marginTop: 8 }}>
                              <span style={{ color: T.crimson, fontWeight: 700 }}>School × home-state wound: </span>{s}
                            </div>
                          ))}
                          {mr && <Row label="How to anchor price" value={mr.anchor} strong />}
                        </div>
                      );
                    })()}

                    {(() => {
                      const ie = incomeEstimate(detail.fields);
                      if (!ie) return null;
                      return (
                        <div style={{ ...cardStyle, border: `1px solid ${T.gold}44` }}>
                          <SectionTitle>💰 Money read · household + willingness to pay</SectionTitle>
                          <div style={{ fontSize: 20, fontWeight: 800, color: T.gold }}>{ie.bracket}</div>
                          <div style={{ fontSize: 12.5, color: T.dim, fontStyle: 'italic', marginTop: 4 }}>{ie.confidence}</div>
                          <Row label="What parents here typically do" value={ie.occupations} />
                          <Row label="Willingness to pay" value={ie.willingness} strong />
                          <Row label="How to anchor" value={ie.anchor} />
                        </div>
                      );
                    })()}

                    {parentMode && (
                      <div style={{ ...cardStyle, border: `1px solid ${T.amber}44` }}>
                        <SectionTitle>👨‍👩‍👧 Parent playbook (payer signals detected)</SectionTitle>
                        {PARENT_PLAYBOOK.map((p, i) => (
                          <div key={i} style={{ padding: '9px 0', borderBottom: `1px solid ${T.cardBorder}` }}>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>{p.situation}</div>
                            <div style={{ fontSize: 14.5, color: T.dim, marginTop: 4, lineHeight: 1.55 }}>{p.move}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {(() => {
                      const rp = referencePoints(detail.fields);
                      if (!rp.anchors.length) return null;
                      return (
                        <div style={{ ...cardStyle, border: `1px solid ${T.gold}44` }}>
                          <SectionTitle>🎯 Reference schools to name-drop</SectionTitle>
                          <div style={{ fontSize: 13.5, color: T.dim, marginBottom: 10, lineHeight: 1.5 }}>{rp.guidance}</div>
                          {rp.anchors.map((a, i) => (
                            <div key={i} style={{ padding: '9px 0', borderBottom: `1px solid ${T.cardBorder}` }}>
                              <div style={{ fontSize: 15.5, fontWeight: 800, color: T.gold }}>{a.school}</div>
                              <div style={{ fontSize: 14, color: '#c9d4e3', marginTop: 3, lineHeight: 1.5 }}>{a.why}</div>
                              {a.proof && <div style={{ fontSize: 13, color: T.green, marginTop: 4 }}>✓ Your proof: {a.proof}</div>}
                            </div>
                          ))}
                        </div>
                      );
                    })()}

                    {gpa !== null && gaps.length > 0 && (
                      <div style={cardStyle}>
                        <SectionTitle>📊 The gap (their GPA vs admitted transfers)</SectionTitle>
                        <div style={{ fontSize: 13.5, color: T.dim, marginBottom: 14 }}>
                          This chart IS the pitch: the gap between the red bar and the gold bars is exactly what positioning, narrative, and strategy close.
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                          <div style={{ width: 110, fontSize: 14, fontWeight: 800, color: T.crimson }}>Them: {gpa.toFixed(2)}</div>
                          <div style={{ flex: 1, background: 'rgba(255,255,255,.06)', borderRadius: 6, height: 22 }}>
                            <div style={{ width: pct(gpa), height: 22, borderRadius: 6, background: `linear-gradient(90deg, ${T.crimsonDeep}, ${T.crimson})` }} />
                          </div>
                        </div>
                        {gaps.map((g) => (
                          <div key={g.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 9 }}>
                            <div style={{ width: 110, fontSize: 13.5, fontWeight: 700, color: T.dim }}>{g.label}: {g.gpa.toFixed(1)}</div>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,.06)', borderRadius: 6, height: 14 }}>
                              <div style={{ width: pct(g.gpa), height: 14, borderRadius: 6, background: `linear-gradient(90deg, #8a6d00, ${T.gold})` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {(wikiHs || wikiCollege || detail.fields.highSchool) && (
                      <div style={cardStyle}>
                        <SectionTitle>📍 Their world</SectionTitle>
                        {[{ w: wikiCollege, label: 'University', name: detail.fields.currentSchool },
                          { w: wikiHs, label: 'High school', name: detail.fields.highSchool }].map(({ w, label, name }) => (
                          w ? (
                            <div key={label} style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                              {w.thumb && <img src={w.thumb} alt={w.title} style={{ width: 150, borderRadius: 10, border: `1px solid ${T.cardBorder}` }} />}
                              <div style={{ flex: 1, minWidth: 220 }}>
                                <div style={{ fontSize: 12, letterSpacing: '.09em', color: T.dim, textTransform: 'uppercase', fontWeight: 700 }}>{label}</div>
                                <div style={{ fontSize: 16.5, fontWeight: 800, marginTop: 3 }}>{w.title}</div>
                                <div style={{ fontSize: 14, lineHeight: 1.6, color: '#c4cede', marginTop: 6 }}>{w.extract}</div>
                                {w.url && <a href={w.url} target="_blank" rel="noreferrer" style={{ color: T.gold, fontSize: 13, fontWeight: 700 }}>full article →</a>}
                              </div>
                            </div>
                          ) : null
                        ))}
                        {detail.fields.highSchool && (
                          <div style={{ marginTop: 6 }}>
                            <div style={{ fontSize: 12, letterSpacing: '.09em', color: T.dim, textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>
                              Satellite · {detail.fields.highSchool.split('(')[0].trim()}
                            </div>
                            <iframe
                              title="school map"
                              src={mapEmbedUrl(detail.fields.highSchool.replace(/[()]/g, ' '))}
                              style={{ width: '100%', height: 240, border: 0, borderRadius: 12, filter: 'saturate(.9)' }}
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {news && news.length > 0 && (
                      <div style={cardStyle}>
                        <SectionTitle>📰 What's happening there right now</SectionTitle>
                        <div style={{ fontSize: 13, color: T.dim, marginBottom: 10 }}>
                          Recent news + sports at {(detail.fields.currentSchool || detail.fields.highSchool || '').split('(')[0].trim()}. Drop one casually ("saw you guys made the tournament") to sound like a local.
                        </div>
                        {news.map((n, i) => (
                          <div key={i} style={{ padding: '8px 0', borderBottom: `1px solid ${T.cardBorder}`, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <span style={{ fontSize: 15 }}>{n.kind === 'sports' ? '🏈' : '📰'}</span>
                            <div>
                              <div style={{ fontSize: 14.5, lineHeight: 1.5 }}>{n.title}</div>
                              <div style={{ fontSize: 12, color: T.dim, marginTop: 2 }}>{[n.source, n.when].filter(Boolean).join(' · ')}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
              </details>

              {detail && (() => {
                // Everything they've seen: prep status + full site journey.
                const f = detail.fields;
                const prepDone = detail.prepDone ?? !!(f.callGoal || f.uploads || f.lastCycleResults || f.currentSchoolStory || f.biggestWorry || f.familyBenchmark);
                const journey = detail.journey || [];
                const hotPage = (p: string) => /get-started|prep|review|pricing|results|services|apply/.test(p);
                const pageName = (p: string) => (p === '/' ? 'Home' : p.replace(/^\/+|\/+$/g, '').replace(/-/g, ' '));
                const agg: Record<string, number> = {};
                journey.forEach((s) => Object.entries(s.times || {}).forEach(([p, sec]) => { agg[p] = (agg[p] || 0) + Number(sec || 0); }));
                const top = Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 6);
                const maxSec = top.length ? top[0][1] : 1;
                const totalMins = Math.round(journey.reduce((n, s) => n + (s.mins || 0), 0) * 10) / 10;
                return (
                  <div style={cardStyle}>
                    <SectionTitle>👁 Everything they&apos;ve seen</SectionTitle>
                    <div style={{ padding: '11px 14px', borderRadius: 8, fontWeight: 800, fontSize: 14.5, background: prepDone ? 'rgba(52,168,83,.10)' : 'rgba(234,67,53,.10)', border: `1px solid ${prepDone ? T.green : T.red}55`, color: prepDone ? T.green : T.red }}>
                      {prepDone ? '✅ Did the call prep. Their answers and files are on this profile.' : '⚠️ Skipped the prep page. The booking nudge + 24h reminder chase it automatically.'}
                    </div>
                    {journey.length === 0 ? (
                      <div style={{ fontSize: 13.5, color: T.dim, marginTop: 12, lineHeight: 1.5 }}>
                        {f.visitCount ? `${f.visitCount} visit${f.visitCount === '1' ? '' : 's'} before applying${f.minutesOnSite ? `, ${f.minutesOnSite} minutes on site` : ''}. ` : ''}
                        Paste the latest Apps Script to see the session-by-session page trail here.
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: 13.5, color: T.dim, marginTop: 12 }}>
                          {journey.length} session{journey.length === 1 ? '' : 's'} tracked · {totalMins} min total on the site
                        </div>
                        {top.length > 0 && (
                          <div style={{ marginTop: 12 }}>
                            {top.map(([p, sec]) => (
                              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
                                <span style={{ width: 130, fontSize: 13, color: hotPage(p) ? T.gold : T.dim, fontWeight: hotPage(p) ? 800 : 500, textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pageName(p)}</span>
                                <div style={{ flex: 1, background: 'rgba(255,255,255,.06)', borderRadius: 5, height: 12 }}>
                                  <div style={{ width: `${Math.max(4, Math.round((sec / maxSec) * 100))}%`, height: 12, borderRadius: 5, background: hotPage(p) ? T.gold : T.blue }} />
                                </div>
                                <span style={{ fontSize: 12.5, color: T.dim, width: 46, textAlign: 'right' }}>{sec >= 60 ? `${Math.round(sec / 60)}m` : `${Math.round(sec)}s`}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div style={{ marginTop: 14 }}>
                          {journey.map((s, i) => (
                            <div key={i} style={{ padding: '10px 0', borderTop: `1px solid ${T.cardBorder}` }}>
                              <div style={{ fontSize: 12.5, color: T.dim }}>
                                {s.when} · {s.mins}m · {s.pages} page{s.pages === 1 ? '' : 's'}{s.device ? ` · ${s.device}` : ''}{s.via ? ` · via ${s.via}` : ''}{s.scroll ? ` · scrolled ${s.scroll}%` : ''}
                              </div>
                              {s.trail && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6, alignItems: 'center' }}>
                                  {s.trail.split(/\s*→\s*/).filter(Boolean).map((p, j, arr) => (
                                    <span key={j} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                      <span style={{ background: hotPage(p) ? 'rgba(232,185,35,.14)' : 'rgba(255,255,255,.06)', color: hotPage(p) ? T.gold : '#c9d4e3', borderRadius: 6, padding: '3px 9px', fontSize: 12.5, fontWeight: hotPage(p) ? 800 : 500, textTransform: 'capitalize' }}>{pageName(p)}</span>
                                      {j < arr.length - 1 && <span style={{ color: T.dim, fontSize: 12 }}>›</span>}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}

              {(detail?.calls?.length ?? 0) > 0 && (
                <div style={cardStyle}>
                  <SectionTitle>📞 Call history</SectionTitle>
                  {detail!.calls.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '9px 0', borderBottom: `1px solid ${T.cardBorder}`, fontSize: 15, flexWrap: 'wrap' }}>
                      <span style={{ color: T.dim, minWidth: 150 }}>{c.date} {c.time}</span>
                      <Chip text={c.status} bg={callColor(c.status)} fg={c.status === 'Closed - Won' ? '#000' : '#fff'} />
                      {c.dealValue && <b style={{ color: T.gold, fontSize: 16 }}>${c.dealValue}</b>}
                      {c.notes && <span style={{ color: T.dim, fontSize: 13.5 }}>{c.notes}</span>}
                    </div>
                  ))}
                </div>
              )}

              {detail ? (
                <>
                  {GROUPS.map((g) => {
                    const rows = g.keys.filter(([k]) => detail.fields[k]);
                    if (!rows.length) return null;
                    return (
                      <div key={g.title} style={cardStyle}>
                        <SectionTitle>{g.icon} {g.title}</SectionTitle>
                        {rows.map(([k, label]) => {
                          if (k === 'uploads') {
                            return detail.fields[k].split('\n').map((line, i) => {
                              const m = /(.*?):\s*(https?:\S+)/.exec(line);
                              return m ? (
                                <div key={i} style={{ display: 'flex', gap: 14, padding: '9px 0', borderBottom: `1px solid ${T.cardBorder}`, fontSize: 15 }}>
                                  <div style={{ width: '36%', minWidth: 130, color: T.dim, fontSize: 13 }}>{m[1]}</div>
                                  <a href={m[2]} target="_blank" rel="noreferrer" style={{ color: T.gold, fontWeight: 800 }}>open →</a>
                                </div>
                              ) : null;
                            });
                          }
                          return <Row key={k} label={label} value={detail.fields[k]} strong={['highSchool', 'currentSchool', 'targetSchools', 'fundingSource', 'callGoal'].includes(k)} />;
                        })}
                      </div>
                    );
                  })}
                  <div style={cardStyle}>
                    <details>
                      <summary style={{ cursor: 'pointer', color: T.gold, fontSize: 14, fontWeight: 800 }}>Every field on record ({Object.keys(detail.fields).length})</summary>
                      <div style={{ marginTop: 10 }}>
                        {Object.entries(detail.fields).map(([k, val]) => <Row key={k} label={k} value={String(val).slice(0, 300)} />)}
                      </div>
                    </details>
                  </div>
                </>
              ) : (
                <div style={{ color: T.dim, fontSize: 15, marginTop: 24 }}>Reading their full profile…</div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
