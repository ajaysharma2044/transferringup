// Visitor intelligence — every browsing session is beaconed to the same Apps
// Script endpoint that handles leads (payload type: 'visit') and upserted into
// a "Visits" tab keyed by session id. The server then rolls all of a visitor's
// sessions into a per-person "Profiles" tab, and a daily digest email reports
// who came, when, for how long, from what IP/school, and what they read.
//
// What each beacon now carries, per browsing session:
//   - identity (name/email) once that browser has ever submitted the form or
//     joined the newsletter — the profile key is a stable first-party visitor
//     id (localStorage), NOT the IP (shared/rotating IPs merge or split people)
//   - IP + city/region + network (often the visitor's school/company)
//   - per-page dwell time (how long on each specific page, visible-time only)
//   - per-page scroll depth (how far down they read)
//   - a timestamped page timeline (when they hit each page)
//   - how they arrived (referrer / UTM), device, timezone
//
// Beacon budget (Apps Script has daily runtime quotas):
//   - first beacon 10s in (so bounces still get recorded)
//   - re-beacon when the tab is hidden/closed (final, accurate durations)
//   - heartbeat at most every 2 min while active, hard cap 20 beacons/session
//
// Owner opt-out: visiting any page with ?notrack=1 permanently untracks that
// browser (localStorage 'tu-notrack') — use it on your own devices.

import { cachedIpGeo, readAttribution } from './leadMeta';

const KNOWN_KEY = 'tu-known';
const NOTRACK_KEY = 'tu-notrack';
const SESSION_KEY = 'tu-session'; // shared with leadSignals.ts
const VISITOR_KEY = 'tu-visitor'; // shared with leadSignals.ts
const PAGETIMES_KEY = 'tu-pagetimes'; // { path: accumulated ms }
const PAGESCROLL_KEY = 'tu-pagescroll'; // { path: max scroll % }
const PAGELOG_KEY = 'tu-pagelog'; // [ [path, enterEpochMs], ... ]

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL as string | undefined;

type Known = { name?: string; email?: string };

export function getKnownIdentity(): Known {
  if (typeof window === 'undefined') return {};
  try {
    return (JSON.parse(localStorage.getItem(KNOWN_KEY) || 'null') as Known) || {};
  } catch {
    return {};
  }
}

/** Remember who this browser belongs to (called on form submit / newsletter
 * join). Merges: a later email-only signup never erases a known name. */
export function setKnownIdentity(name: string, email: string): void {
  if (typeof window === 'undefined' || !email) return;
  try {
    const prev = getKnownIdentity();
    localStorage.setItem(KNOWN_KEY, JSON.stringify({ name: name || prev.name || '', email }));
  } catch {
    /* storage blocked */
  }
}

export function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  try {
    return (JSON.parse(localStorage.getItem(VISITOR_KEY) || 'null') as { id?: string })?.id || '';
  } catch {
    return '';
  }
}

function untracked(): boolean {
  try {
    if (new URLSearchParams(window.location.search).get('notrack')) {
      localStorage.setItem(NOTRACK_KEY, '1');
    }
    return localStorage.getItem(NOTRACK_KEY) === '1';
  } catch {
    return false;
  }
}

/* ------------------ per-page dwell + scroll + timeline -------------------- */

function readMap(key: string): Record<string, number> {
  try { return (JSON.parse(sessionStorage.getItem(key) || '{}') as Record<string, number>) || {}; }
  catch { return {}; }
}
function writeMap(key: string, v: Record<string, number>): void {
  try { sessionStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ }
}
function readLog(): Array<[string, number]> {
  try { return (JSON.parse(sessionStorage.getItem(PAGELOG_KEY) || '[]') as Array<[string, number]>) || []; }
  catch { return []; }
}

let curPath = '';
let pageSince: number | null = null; // when the current page became visible

/** Fold the time spent on the current page into the stored per-page totals. */
function bankCurrentPage(): void {
  if (!curPath || pageSince === null) return;
  const times = readMap(PAGETIMES_KEY);
  times[curPath] = (times[curPath] || 0) + (Date.now() - pageSince);
  writeMap(PAGETIMES_KEY, times);
  pageSince = document.visibilityState === 'visible' ? Date.now() : null;
}

/** Call on every route change (SPA) and on the first page. Closes out the
 * previous page's timer and opens the new one, appending to the timeline. */
export function trackPageChange(path: string): void {
  if (typeof window === 'undefined') return;
  if (path === curPath) return;
  bankCurrentPage();
  curPath = path;
  pageSince = document.visibilityState === 'visible' ? Date.now() : null;
  const log = readLog();
  log.push([path, Date.now()]);
  if (log.length > 60) log.shift();
  try { sessionStorage.setItem(PAGELOG_KEY, JSON.stringify(log)); } catch { /* ignore */ }
  recordScroll(); // capture entry scroll position for the new page
  maybeFireEngagementPixel(log); // signal Meta about engaged browsers, not just form-fillers
}

// Fire ONE Meta/GA "HighIntentVisit" event per session once a visitor shows real
// interest: viewed a high-intent page (services/results/pricing/reviews) or
// browsed several pages. Lets you retarget + optimize toward people who actually
// explore the site, weighted by which intent page they hit.
const HIP_KEY = 'tu-hipixel';
function maybeFireEngagementPixel(log: Array<[string, number]>): void {
  if (typeof window === 'undefined') return;
  try { if (sessionStorage.getItem(HIP_KEY)) return; } catch { return; }
  const paths = log.map((e) => e[0]);
  const highIntent = paths.some((p) => /^\/(services|results|reviews|contact|get-started)/.test(p));
  const uniquePages = new Set(paths).size;
  if (!highIntent && uniquePages < 3) return;
  // Weight the value by the strongest intent page they reached.
  const value = paths.some((p) => p.startsWith('/contact') || p.startsWith('/get-started')) ? 40
    : paths.some((p) => p.startsWith('/services') || p.startsWith('/results')) ? 25
    : 10;
  const data = { value, currency: 'USD', pages_viewed: uniquePages, deepest_page: paths[paths.length - 1] };
  try { (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq?.('trackCustom', 'HighIntentVisit', data); } catch { /* ignore */ }
  try { (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.('event', 'high_intent_visit', data); } catch { /* ignore */ }
  try { sessionStorage.setItem(HIP_KEY, '1'); } catch { /* ignore */ }
}

/** Max scroll depth reached on the current page (percent of document height). */
function recordScroll(): void {
  if (!curPath) return;
  const doc = document.documentElement;
  const scrolled = window.scrollY + window.innerHeight;
  const total = Math.max(doc.scrollHeight, window.innerHeight);
  const pct = Math.min(100, Math.round((scrolled / total) * 100));
  const scroll = readMap(PAGESCROLL_KEY);
  if (pct > (scroll[curPath] || 0)) {
    scroll[curPath] = pct;
    writeMap(PAGESCROLL_KEY, scroll);
  }
}

/** Live snapshot of per-page seconds, including time on the current page. */
function pageSecondsSnapshot(): Record<string, number> {
  const ms: Record<string, number> = { ...readMap(PAGETIMES_KEY) };
  if (curPath && pageSince !== null) ms[curPath] = (ms[curPath] || 0) + (Date.now() - pageSince);
  const secs: Record<string, number> = {};
  Object.keys(ms).forEach((p) => { secs[p] = Math.round(ms[p] / 1000); });
  return secs;
}

function fmtSecs(s: number): string {
  if (s < 60) return s + 's';
  const m = Math.floor(s / 60), r = s % 60;
  return r ? m + 'm' + r + 's' : m + 'm';
}

/* ------------------------------- the beacon ------------------------------- */

let geoSnapshot: Record<string, string> = {};
let lastBeaconAt = 0;
let beaconCount = 0;

function sendVisitBeacon(final: boolean): void {
  if (!SCRIPT_URL) return;
  const now = Date.now();
  if (!final && now - lastBeaconAt < 120000) return; // heartbeat throttle
  if (beaconCount >= 20) return;

  let session: { id?: string; start: number; pages: string[] } | null = null;
  try {
    session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
  } catch { /* ignore */ }
  if (!session) return;
  if (!session.id) {
    session.id = 's-' + Math.random().toString(36).slice(2) + now.toString(36);
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch { /* ignore */ }
  }

  let visits = 1;
  try {
    visits = (JSON.parse(localStorage.getItem(VISITOR_KEY) || 'null') as { visits?: number })?.visits || 1;
  } catch { /* ignore */ }

  const known = getKnownIdentity();
  const attr = readAttribution();
  const pages = session.pages || [];

  const secs = pageSecondsSnapshot();
  const scroll = readMap(PAGESCROLL_KEY);
  const log = readLog();
  const totalSecs = Object.keys(secs).reduce((a, p) => a + secs[p], 0);
  // Human-readable per-page dwell, longest first: "/services 2m10s · / 45s"
  const pageDwell = Object.keys(secs)
    .sort((a, b) => secs[b] - secs[a])
    .map((p) => p + ' ' + fmtSecs(secs[p]) + (scroll[p] ? ' (' + scroll[p] + '%)' : ''))
    .join(' · ');

  const payload = {
    type: 'visit',
    sessionId: session.id,
    visitorId: getVisitorId(),
    visitCount: String(visits),
    knownName: known.name || '',
    knownEmail: known.email || '',
    startedAtLocal: new Date(session.start).toLocaleString('en-US'),
    durationSeconds: String(totalSecs),
    pageTrail: pages.join(' → '),
    pageCount: String(pages.length),
    pageDwell,
    pageTimesJson: JSON.stringify(secs),
    pageScrollJson: JSON.stringify(scroll),
    pageLogJson: JSON.stringify(log),
    maxScroll: String(Object.keys(scroll).reduce((m, p) => Math.max(m, scroll[p]), 0)),
    ...geoSnapshot,
    device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
    referrer: attr.referrer || '',
    landingPage: attr.landingPage || '',
    utmSource: attr.utmSource || '',
    utmCampaign: attr.utmCampaign || '',
    timezone: (() => {
      try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return ''; }
    })(),
  };

  lastBeaconAt = now;
  beaconCount += 1;
  const body = JSON.stringify(payload);
  let sent = false;
  try {
    // sendBeacon survives page unload; text/plain avoids a CORS preflight.
    sent = navigator.sendBeacon?.(SCRIPT_URL, new Blob([body], { type: 'text/plain;charset=utf-8' })) || false;
  } catch { /* fall through */ }
  if (!sent) {
    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: true,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body,
    }).catch(() => { /* best-effort */ });
  }
}

/* --------------------------------- init ---------------------------------- */

let initialized = false;
let scrollScheduled = false;

export function initVisitTracking(): void {
  if (typeof window === 'undefined' || initialized) return;
  initialized = true;
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || untracked()) return;

  trackPageChange(window.location.pathname); // open the timer on the landing page
  cachedIpGeo().then((g) => { geoSnapshot = g; });

  setTimeout(() => sendVisitBeacon(false), 10000);
  window.setInterval(() => {
    if (document.visibilityState === 'visible') sendVisitBeacon(false);
  }, 120000);

  // Throttled scroll-depth sampling (one rAF per burst).
  window.addEventListener('scroll', () => {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(() => { scrollScheduled = false; recordScroll(); });
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      bankCurrentPage();
      sendVisitBeacon(true);
    } else if (curPath) {
      pageSince = Date.now();
    }
  });
  window.addEventListener('pagehide', () => {
    bankCurrentPage();
    sendVisitBeacon(true);
  });
}
