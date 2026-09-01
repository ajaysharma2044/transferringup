// Persistent traffic attribution: WHO sent this visitor, and if it was an ad,
// WHICH ad. Captured the moment they land, kept in localStorage, and stamped
// onto their lead row at submit, so /hq can answer "how did this person find
// us" even if they landed on a blog post Tuesday and applied Friday.
//
// Two records are kept:
//   first touch: how this browser EVER first found the site (set once)
//   last touch:  the most recent arrival that carried a signal (updated)
//
// Paid Google clicks carry gclid automatically. The keyword and creative only
// arrive if the Google Ads account sets this Final URL suffix (Account
// settings -> Tracking):
//   utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_adgroup={adgroupid}&utm_term={keyword}&utm_content={creative}&matchtype={matchtype}&device={device}

const FIRST_KEY = 'tu-touch-first';
const LAST_KEY = 'tu-touch-last';

type Touch = {
  source: string; medium: string; campaign: string; adgroup: string;
  term: string; content: string; matchtype: string; adDevice: string;
  clickType: string; refHost: string; landing: string; ts: number;
};

function read(key: string): Touch | null {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
}
function write(key: string, t: Touch): void {
  try { localStorage.setItem(key, JSON.stringify(t)); } catch { /* private mode */ }
}

function hostOf(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

/** Human-readable answer to "where did they come from". */
export function classifyTouch(t: Touch | null): string {
  if (!t) return '';
  const src = t.source.toLowerCase();
  const med = t.medium.toLowerCase();
  const ref = t.refHost;
  if (t.clickType === 'gclid' || t.clickType === 'wbraid' || t.clickType === 'gbraid' || (src === 'google' && /cpc|paid|ppc/.test(med))) {
    return 'Google Ads (paid search)';
  }
  if (t.clickType === 'fbclid' || ((src === 'facebook' || src === 'fb' || src === 'ig' || src === 'instagram') && /cpc|paid|ad/.test(med))) {
    return 'Meta ad (FB/IG paid)';
  }
  if (src) return `${t.source}${t.medium ? ` / ${t.medium}` : ''}`;
  if (/google\./.test(ref) || ref === 'google.com') return 'Google search (organic)';
  if (/bing\./.test(ref)) return 'Bing (organic)';
  if (/duckduckgo/.test(ref)) return 'DuckDuckGo (organic)';
  if (/instagram\./.test(ref)) return 'Instagram (organic)';
  if (/facebook\.|fb\.com/.test(ref)) return 'Facebook (organic)';
  if (/tiktok\./.test(ref)) return 'TikTok';
  if (/reddit\./.test(ref)) return 'Reddit';
  if (/t\.co|twitter\.|x\.com/.test(ref)) return 'X / Twitter';
  if (/linkedin\./.test(ref)) return 'LinkedIn';
  if (ref) return ref;
  return 'Direct (typed, bookmark, or app)';
}

/** Call once on app mount, before anything navigates. */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return;
  try {
    const q = new URLSearchParams(window.location.search);
    const clickType = q.get('gclid') ? 'gclid' : q.get('wbraid') ? 'wbraid' : q.get('gbraid') ? 'gbraid' : q.get('fbclid') ? 'fbclid' : '';
    const refHost = hostOf(document.referrer);
    const external = refHost && refHost !== window.location.hostname.replace(/^www\./, '');
    const touch: Touch = {
      source: q.get('utm_source') || '',
      medium: q.get('utm_medium') || '',
      campaign: q.get('utm_campaign') || '',
      adgroup: q.get('utm_adgroup') || '',
      term: q.get('utm_term') || '',
      content: q.get('utm_content') || '',
      matchtype: q.get('matchtype') || '',
      adDevice: q.get('device') || '',
      clickType,
      refHost: external ? refHost : '',
      landing: window.location.pathname,
      ts: Date.now(),
    };
    const hasSignal = !!(touch.source || touch.clickType || touch.refHost);
    if (!hasSignal) {
      // Still record a first touch for direct visits, so "first seen" exists.
      if (!read(FIRST_KEY)) write(FIRST_KEY, touch);
      return;
    }
    if (!read(FIRST_KEY)) write(FIRST_KEY, touch);
    write(LAST_KEY, touch);
  } catch { /* ignore */ }
}

/** Flat fields for the lead row (the sheet auto-creates these columns). */
export function attributionFields(): Record<string, string> {
  const last = read(LAST_KEY);
  const first = read(FIRST_KEY);
  const out: Record<string, string> = {};
  const src = classifyTouch(last || first);
  if (src) out.trafficSource = src;
  if (last?.term) out.searchKeyword = last.term;
  if (last?.matchtype) out.keywordMatchtype = last.matchtype;
  if (last?.content) out.adCreativeId = last.content;
  if (last?.adgroup) out.adGroupId = last.adgroup;
  if (last?.campaign && !out.adGroupId) out.adCampaign = last.campaign;
  else if (last?.campaign) out.adCampaign = last.campaign;
  if (first) {
    const firstSrc = classifyTouch(first);
    if (firstSrc && firstSrc !== src) out.firstTouchSource = firstSrc;
    if (first.landing) out.firstTouchLanding = first.landing;
    out.firstTouchWhen = new Date(first.ts).toISOString().slice(0, 10);
  }
  return out;
}
