// Silent lead enrichment — data captured automatically at submit time so every
// lead row carries qualification context beyond what the visitor typed:
//   - IP address + rough geolocation (city/region/country, ISP) via ipapi.co
//   - First-touch marketing attribution (UTM params, referrer, landing page)
//   - Device/viewport info and the page the form was submitted from
// All of it is best-effort: any failure yields empty strings, never a blocked
// submit. Everything is SSR-guarded (this module is imported by prerendered pages).

const ATTR_KEY = 'tu-attribution';

type Attribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  landingPage?: string;
  firstSeen?: string;
};

/** Store first-touch attribution once per session (runs at module import on the
 * page that hosts the form; UTMs are still in the URL on ad landings). */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return;
  try {
    if (sessionStorage.getItem(ATTR_KEY)) return;
    const q = new URLSearchParams(window.location.search);
    const attr: Attribution = {
      utmSource: q.get('utm_source') || '',
      utmMedium: q.get('utm_medium') || '',
      utmCampaign: q.get('utm_campaign') || '',
      utmTerm: q.get('utm_term') || '',
      utmContent: q.get('utm_content') || '',
      referrer: document.referrer || '',
      landingPage: window.location.pathname + window.location.search,
      firstSeen: new Date().toISOString(),
    };
    // Only persist if there's actually a signal (UTMs or an external referrer).
    const hasSignal =
      attr.utmSource || attr.utmMedium || attr.utmCampaign ||
      (attr.referrer && !attr.referrer.includes(window.location.hostname));
    sessionStorage.setItem(ATTR_KEY, JSON.stringify(hasSignal ? attr : { landingPage: attr.landingPage, firstSeen: attr.firstSeen }));
  } catch {
    /* storage unavailable — skip */
  }
}

export function readAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(sessionStorage.getItem(ATTR_KEY) || '{}') as Attribution;
  } catch {
    return {};
  }
}

/** IP + rough geo via ipapi.co (CORS-enabled, keyless). 2.5s cap so a slow or
 * blocked lookup never delays the submit. Cached per browser session so leads,
 * newsletter signups, and visit beacons share one lookup. */
const IP_CACHE_KEY = 'tu-ipmeta';

export async function cachedIpGeo(): Promise<Record<string, string>> {
  if (typeof window === 'undefined') return {};
  try {
    const cached = sessionStorage.getItem(IP_CACHE_KEY);
    if (cached) return JSON.parse(cached) as Record<string, string>;
  } catch {
    /* fall through to a fresh fetch */
  }
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch('https://ipapi.co/json/', { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) return {};
    const j = (await res.json()) as Record<string, string | number>;
    const geo = {
      ipAddress: String(j.ip || ''),
      ipCity: String(j.city || ''),
      ipRegion: String(j.region || ''),
      ipCountry: String(j.country_name || ''),
      ipPostal: String(j.postal || ''),
      ipISP: String(j.org || ''),
    };
    if (geo.ipAddress) {
      try { sessionStorage.setItem(IP_CACHE_KEY, JSON.stringify(geo)); } catch { /* ignore */ }
    }
    return geo;
  } catch {
    return {};
  }
}

/** Everything we can capture without asking. Merged into the lead payload. */
export async function collectLeadMeta(): Promise<Record<string, string>> {
  if (typeof window === 'undefined') return {};
  const attr = readAttribution();
  const geo = await cachedIpGeo();
  return {
    ...geo,
    utmSource: attr.utmSource || '',
    utmMedium: attr.utmMedium || '',
    utmCampaign: attr.utmCampaign || '',
    utmTerm: attr.utmTerm || '',
    utmContent: attr.utmContent || '',
    referrer: attr.referrer || '',
    landingPage: attr.landingPage || '',
    submittedFrom: window.location.pathname,
    device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
    userAgent: navigator.userAgent,
    screenSize: `${window.screen.width}x${window.screen.height}`,
    timezone: (() => {
      try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return ''; }
    })(),
    submittedAtLocal: new Date().toLocaleString('en-US'),
  };
}

// Capture first-touch attribution as soon as any page importing the lead
// pipeline loads (contact + landing pages).
captureAttribution();
