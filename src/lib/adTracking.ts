// Google Ads tracking: click-ID capture, enhanced conversions, Ads conversion
// events. Mirrors what pixelIdentity.ts does for Meta, on the Google side.
//
// Division of labor (so nothing double-fires):
//   - GA4 funnel events (generate_lead, booking_confirmed) already fire from
//     leadSubmit.ts / ApplicationForm.tsx. This module does NOT re-send them.
//   - This module owns: gclid/wbraid/gbraid capture on landing, the persistent
//     lead ID, enhanced-conversion user_data (gtag hashes it in the browser),
//     and the two Google ADS conversions (lead + booking).
//   - buildCrmPayload() rides on the lead POST so the sheet stores the gclid;
//     that unlocks offline conversion imports later (close a client, upload
//     the gclid, Google learns who buyers are - the Google twin of CAPI).
//
// Inert until configured: fill in AW_ID and LABELS (Google Ads -> Goals ->
// Conversions -> action -> Tag setup -> "Use Google tag"), redeploy. Until
// then every fire is a silent no-op.

import { captureAttribution } from './attribution';

const AW_ID = 'AW-18370032540';
const LABELS: Record<string, string> = {
  lead: 'XXXXXXXXXXXXXXXXXX', // "Submit lead form" label - pending creation in Google Ads
  booking: 'D2P7CMXN19scEJznwbdE', // "Book appointment" conversion
};
const BOOKING_VALUE = 100; // proxy value for a booked call
const CLICK_TTL_MS = 90 * 24 * 60 * 60 * 1000; // Google's 90-day GCLID window
const CLICK_KEY = 'tu-click';
const LEAD_KEY = 'tu-lead-id';
const IDENTITY_KEY = 'tu-identity';

type ClickData = {
  value: string | null; type: string | null; ts: number;
  landingPage: string;
};
type Identity = { email?: string; phone?: string; firstName?: string; lastName?: string };

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch { return null; }
}
function write(key: string, value: unknown): void {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode */ }
}
function uuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// Click-ID capture: gclid (search), wbraid/gbraid (iOS app campaigns). A bare
// UTM visit never overwrites a stored real click ID.
export function captureClickIds(): void {
  try {
    const p = new URLSearchParams(window.location.search);
    const gclid = p.get('gclid');
    const id = gclid || p.get('wbraid') || p.get('gbraid');
    if (!id) return;
    write(CLICK_KEY, {
      value: id,
      type: gclid ? 'gclid' : p.get('wbraid') ? 'wbraid' : 'gbraid',
      ts: Date.now(),
      landingPage: window.location.pathname,
    } satisfies ClickData);
  } catch { /* ignore */ }
}
export function getClickIds(): ClickData | null {
  const d = read<ClickData>(CLICK_KEY);
  if (!d) return null;
  if (Date.now() - d.ts > CLICK_TTL_MS) {
    try { localStorage.removeItem(CLICK_KEY); } catch { /* ignore */ }
    return null;
  }
  return d;
}

// One persistent lead ID reused as transaction_id on both conversions, so
// Google dedupes if either ever re-fires.
export function getLeadId(): string {
  let id = read<string>(LEAD_KEY);
  if (!id) { id = uuid(); write(LEAD_KEY, id); }
  return id;
}

export function setIdentity(next: Identity): Identity {
  const prev = read<Identity>(IDENTITY_KEY) || {};
  const merged = { ...prev, ...Object.fromEntries(Object.entries(next).filter(([, v]) => v)) };
  write(IDENTITY_KEY, merged);
  return merged;
}
export function getIdentity(): Identity { return read<Identity>(IDENTITY_KEY) || {}; }

// Google requires E.164 phones and lowercased email. gtag SHA-256 hashes
// user_data in the browser; plain values never leave the page.
function toE164(phone?: string): string | undefined {
  if (!phone) return undefined;
  const d = String(phone).replace(/\D/g, '');
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d[0] === '1') return `+${d}`;
  return d.length > 6 ? `+${d}` : undefined;
}
function buildUserData(user: Identity): Record<string, unknown> | null {
  const ud: Record<string, unknown> = {};
  if (user.email) ud.email = String(user.email).trim().toLowerCase();
  const ph = toE164(user.phone);
  if (ph) ud.phone_number = ph;
  const addr: Record<string, string> = {};
  if (user.firstName) addr.first_name = String(user.firstName).trim().toLowerCase();
  if (user.lastName) addr.last_name = String(user.lastName).trim().toLowerCase();
  if (Object.keys(addr).length) { addr.country = 'US'; ud.address = addr; }
  return Object.keys(ud).length ? ud : null;
}

function isConfigured(label?: string): boolean {
  return typeof window !== 'undefined'
    && typeof window.gtag === 'function'
    && !AW_ID.includes('XXXX')
    && !!label && !/^[XY]+$/.test(label);
}

export function fireAdsConversion(kind: 'lead' | 'booking', opts: { value?: number; user?: Identity } = {}): void {
  const label = LABELS[kind];
  if (!isConfigured(label)) return; // silent no-op until AW_ID + labels are set
  try {
    const ud = buildUserData(opts.user || getIdentity());
    if (ud) window.gtag?.('set', 'user_data', ud);
    window.gtag?.('event', 'conversion', {
      send_to: `${AW_ID}/${label}`,
      value: typeof opts.value === 'number' ? opts.value : undefined,
      currency: 'USD',
      transaction_id: getLeadId(),
    });
  } catch { /* gtag not loaded */ }
}

/** Call on lead form submit. Saves identity + fires the Ads lead conversion.
 * (GA4 generate_lead already fires from leadSubmit.ts - not duplicated here.) */
export function adTrackLead(data: { email?: string; phone?: string; name?: string; value?: number }): void {
  const parts = (data.name || '').trim().split(/\s+/);
  const user = setIdentity({
    email: data.email, phone: data.phone,
    firstName: parts[0] || undefined,
    lastName: parts.length > 1 ? parts[parts.length - 1] : undefined,
  });
  fireAdsConversion('lead', { value: data.value, user });
}

/** Call when a Calendly booking completes. (GA4 booking_confirmed already
 * fires from ApplicationForm.tsx - not duplicated here.) */
export function adTrackBooking(): void {
  fireAdsConversion('booking', { value: BOOKING_VALUE });
}

/** Merge into the lead POST body so the sheet stores the click ID. Offline
 * conversion imports need exactly this gclid when a client later signs. */
export function buildCrmPayload(): Record<string, string> {
  const c = getClickIds();
  const out: Record<string, string> = { googleLeadId: getLeadId() };
  if (c?.value) {
    out.gclid = c.value;
    out.clickIdType = c.type || '';
    out.clickTimestamp = new Date(c.ts).toISOString();
  }
  return out;
}

/** Call once on app mount (SiteLayout). Captures click IDs + traffic
 * attribution. The Ads tag itself is configured in index.html (same gtag.js
 * loader as GA4), so this never double-configs it. */
export function initAdTracking(): void {
  if (typeof window === 'undefined') return;
  captureClickIds();
  captureAttribution();
}
