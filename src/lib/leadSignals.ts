// Willingness-to-pay signal engine.
// Three layers, all merged into every lead submission:
//   1. ENGAGEMENT  — site-wide behavior across visits (visit count, pages seen,
//                    pricing/reviews views, time on site), tracked in
//                    local/sessionStorage under a first-party visitor id.
//   2. DERIVED     — qualification fields computed from what they typed
//                    (GPA trajectory, ambition profile, email quality, effort).
//   3. LEAD SCORE  — a transparent 0–100 composite + Hot/Warm/Cool tier so the
//                    Sheet can be sorted by likelihood to buy.
// Everything is SSR-guarded and fails to empty values, never a broken submit.

const VISITOR_KEY = 'tu-visitor';
const SESSION_KEY = 'tu-session';
const FORM_START_KEY = 'tu-form-started';

type Visitor = { id: string; firstSeen: string; visits: number };
type Session = { start: number; pages: string[] };

function readJSON<T>(store: Storage, key: string): T | null {
  try {
    return JSON.parse(store.getItem(key) || 'null') as T | null;
  } catch {
    return null;
  }
}
function writeJSON(store: Storage, key: string, v: unknown) {
  try {
    store.setItem(key, JSON.stringify(v));
  } catch {
    /* storage full/blocked */
  }
}

/* ------------------------- 1. Engagement tracking ------------------------- */

function ensureVisitor(): Visitor | null {
  if (typeof window === 'undefined') return null;
  let v = readJSON<Visitor>(localStorage, VISITOR_KEY);
  if (!v) {
    v = {
      id: 'v-' + Math.random().toString(36).slice(2) + Date.now().toString(36),
      firstSeen: new Date().toISOString(),
      visits: 0,
    };
  }
  // New browser session → new visit.
  if (!readJSON<Session>(sessionStorage, SESSION_KEY)) {
    v.visits += 1;
    writeJSON(sessionStorage, SESSION_KEY, { start: Date.now(), pages: [] });
  }
  writeJSON(localStorage, VISITOR_KEY, v);
  return v;
}

/** Record a page view (called on every client-side route change + initial load). */
export function recordPageView(path: string): void {
  if (typeof window === 'undefined') return;
  ensureVisitor();
  const s = readJSON<Session>(sessionStorage, SESSION_KEY);
  if (!s) return;
  if (s.pages[s.pages.length - 1] !== path) s.pages.push(path);
  writeJSON(sessionStorage, SESSION_KEY, s);
}

function engagementSignals(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const v = ensureVisitor();
  const s = readJSON<Session>(sessionStorage, SESSION_KEY);
  const pages = s?.pages || [];
  const days = v ? Math.max(0, Math.round((Date.now() - new Date(v.firstSeen).getTime()) / 86400000)) : 0;
  return {
    visitorId: v?.id || '',
    visitCount: String(v?.visits || 1),
    firstVisit: v ? v.firstSeen.slice(0, 10) : '',
    daysSinceFirstVisit: String(days),
    pagesThisSession: pages.join(' → '),
    pagesViewedCount: String(pages.length),
    viewedReviews: pages.some((p) => p.startsWith('/reviews')) ? 'Yes' : 'No',
    viewedResults: pages.some((p) => p.startsWith('/results')) ? 'Yes' : 'No',
    viewedServices: pages.some((p) => p.startsWith('/services')) ? 'Yes' : 'No',
    minutesOnSite: s ? String(Math.round((Date.now() - s.start) / 6000) / 10) : '',
  };
}

/* --------------------- Ad identifiers (cookies + URL) --------------------- */

function cookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : '';
}

function adIdentifiers(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const q = new URLSearchParams(window.location.search);
  // GA client id lives in _ga as GA1.1.<clientId.part1>.<part2>
  const ga = cookie('_ga').split('.').slice(-2).join('.');
  return {
    gclid: q.get('gclid') || sessionStorage.getItem('tu-gclid') || '',
    fbclid: q.get('fbclid') || sessionStorage.getItem('tu-fbclid') || '',
    metaFbp: cookie('_fbp'),
    metaFbc: cookie('_fbc'),
    gaClientId: ga,
    adBlockerLikely: typeof (window as { fbq?: unknown }).fbq === 'undefined' ? 'Yes' : 'No',
  };
}

// Persist click ids at first touch (they vanish from the URL on SPA navigation).
if (typeof window !== 'undefined') {
  try {
    const q = new URLSearchParams(window.location.search);
    if (q.get('gclid')) sessionStorage.setItem('tu-gclid', q.get('gclid')!);
    if (q.get('fbclid')) sessionStorage.setItem('tu-fbclid', q.get('fbclid')!);
  } catch {
    /* ignore */
  }
  // The initial page load isn't covered by usePageTracking (it skips first render).
  recordPageView(window.location.pathname);
}

/* --------------------------- 2. Derived signals --------------------------- */

const DISPOSABLE = /@(mailinator|guerrillamail|10minutemail|tempmail|yopmail|sharklasers|trashmail|getnada|dispostable)\./i;
const ULTRA = /\b(harvard|yale|princeton|stanford|mit|columbia|upenn|penn\b|wharton|brown|dartmouth|duke|uchicago|caltech|johns hopkins|jhu|northwestern|cornell)\b/gi;

function parseGpa(s: string | undefined): number | null {
  const n = parseFloat((s || '').replace(/[^\d.]/g, ''));
  return Number.isFinite(n) && n > 0 && n <= 5 ? n : null;
}

export function derivedSignals(lead: Record<string, string | undefined>): Record<string, string> {
  const hs = parseGpa(lead.highSchoolGPA);
  const col = parseGpa(lead.collegeGPA);
  let trajectory = '';
  if (hs !== null && col !== null) {
    trajectory = col - hs >= 0.25 ? 'Rising' : hs - col >= 0.25 ? 'Falling' : 'Flat';
  }

  const email = lead.email || '';
  const eduDomain = /@([\w.-]+\.edu)$/i.exec(email)?.[1] || '';
  const emailFlags: string[] = [];
  if (DISPOSABLE.test(email)) emailFlags.push('disposable');
  if (/\+/.test(email.split('@')[0] || '')) emailFlags.push('plus-alias');
  if (eduDomain) emailFlags.push('edu');

  const targets = lead.targetSchools || '';
  const ultraCount = (targets.match(ULTRA) || []).length;
  const gpa = col ?? hs;
  let ambition = '';
  if (targets) {
    if (ultraCount === 0) ambition = 'Grounded';
    else if (gpa !== null && gpa < 3.3 && ultraCount >= 2) ambition = 'High-reach heavy';
    else if (gpa !== null && gpa >= 3.5) ambition = 'Ambitious, plausible';
    else ambition = 'Mixed';
  }

  const words = (lead.challenge || '').trim().split(/\s+/).filter(Boolean).length;
  const areaCode = /1?\s*\(?(\d{3})/.exec((lead.phone || '').replace(/[^\d]/g, ''))?.[1] || '';

  return {
    gpaTrajectory: trajectory,
    ambitionProfile: ambition,
    ultraSelectiveCount: targets ? String(ultraCount) : '',
    challengeWordCount: String(words),
    emailQuality: emailFlags.join(', ') || 'standard',
    eduEmailDomain: eduDomain,
    phoneAreaCode: areaCode,
  };
}

/* ------------------------- Form behavior (helpers) ------------------------ */

/** Call on the first field interaction; detects abandon-and-return at submit. */
export function markFormStarted(): void {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(FORM_START_KEY)) {
    localStorage.setItem(FORM_START_KEY, String(Date.now()));
  }
}

export function formBehaviorSignals(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const started = Number(localStorage.getItem(FORM_START_KEY) || 0);
  const secs = started ? Math.round((Date.now() - started) / 1000) : 0;
  const out = {
    formFillSeconds: started ? String(secs) : '',
    // Started in an earlier sitting (>30 min ago) and finished now.
    returnedToFinish: started && secs > 1800 ? 'Yes' : 'No',
  };
  try {
    localStorage.removeItem(FORM_START_KEY);
  } catch {
    /* ignore */
  }
  return out;
}

/* ----------------------------- 3. Lead score ------------------------------ */

function scoreLead(all: Record<string, string | undefined>): Record<string, string> {
  let score = 0;
  const inv = all.investmentReadiness || '';
  if (/^Ready/.test(inv)) score += 30;
  else if (/^Serious/.test(inv)) score += 18;
  else if (inv) score += 5;

  if (/Parent/i.test(all.filledBy || '')) score += 15;
  const visits = Number(all.visitCount || 1);
  if (visits >= 3) score += 12;
  else if (visits === 2) score += 8;
  if (all.viewedReviews === 'Yes') score += 6;
  if (all.viewedServices === 'Yes') score += 8;
  if (all.viewedResults === 'Yes') score += 4;

  const words = Number(all.challengeWordCount || 0);
  if (words >= 40) score += 8;
  else if (words >= 15) score += 4;

  const fill = Number(all.formFillSeconds || 0);
  if (fill >= 180) score += 6;
  else if (fill > 0 && fill < 25) score -= 10;

  if (all.eduEmailDomain) score += 6;
  if (/disposable/.test(all.emailQuality || '')) score -= 40;
  if (all.pasteDetected === 'Yes') score -= 4;
  if (all.gpaTrajectory === 'Rising') score += 6;
  if (all.returnedToFinish === 'Yes') score += 6;
  if (all.usedAdvisorBefore?.startsWith('Yes, a private')) score += 14; // proven payer
  else if (all.usedAdvisorBefore?.startsWith('Yes')) score += 6;
  if (all.testPrepUsed?.startsWith('Yes')) score += 6; // paid for test prep before

  score = Math.max(0, Math.min(100, score));
  const tier = /disposable/.test(all.emailQuality || '')
    ? 'Likely spam'
    : score >= 70 ? 'Hot' : score >= 45 ? 'Warm' : 'Cool';
  return { leadScore: String(score), leadTier: tier };
}

/** Everything: engagement + ad ids + derived + score. Called at submit time. */
export function collectSignals(lead: Record<string, string | undefined>): Record<string, string> {
  const engagement = engagementSignals();
  const ads = adIdentifiers();
  const derived = derivedSignals(lead);
  const merged = { ...lead, ...engagement, ...derived } as Record<string, string | undefined>;
  const score = scoreLead(merged);
  return { ...engagement, ...ads, ...derived, ...score };
}
