// Manual Advanced Matching for the Meta browser pixel.
//
// Out of the box, fbq('init') is identity-blind: events match to people only
// via the _fbp cookie and IP, which Meta itself scores as low-quality. Passing
// normalized email/phone/name into init attaches identity to EVERY browser
// event that follows (PageView, Lead, HighIntentVisit, Schedule, ...) — fbq
// SHA-256-hashes the values client-side before anything leaves the page.
//
// The identity is persisted in localStorage, and index.html reads it before
// the very first init, so once someone has ever submitted a form here, every
// later visit from that browser sends fully-identified events. That is what
// makes the browser pixel trainable: Meta can tie the whole click-trail to a
// real person and learn what its best prospects look like BEFORE they convert.

const PIXEL_ID = '833203769034453';
const LS_KEY = 'tu-pixel-am';

type Identity = { em?: string; ph?: string; fn?: string; ln?: string };

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// Meta's required formats: email lowercase/trimmed; phone digits-only with
// country code (US 10-digit numbers get a leading 1); names lowercase.
function normalize(email?: string, phone?: string, name?: string): Identity {
  const id: Identity = {};
  const em = (email || '').trim().toLowerCase();
  if (em.includes('@')) id.em = em;
  let ph = (phone || '').replace(/\D/g, '');
  if (ph.length === 10) ph = '1' + ph;
  if (ph.length >= 11) id.ph = ph;
  const parts = (name || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (parts.length) {
    id.fn = parts[0];
    if (parts.length > 1) id.ln = parts[parts.length - 1];
  }
  return id;
}

/** Attach identity to the pixel and remember it for future visits. Merges with
 * anything already stored, so learning a phone later never drops the email. */
export function setPixelIdentity(email?: string, phone?: string, name?: string): void {
  if (typeof window === 'undefined') return;
  const fresh = normalize(email, phone, name);
  if (!fresh.em && !fresh.ph) return;
  let merged: Identity = fresh;
  try {
    const stored = JSON.parse(localStorage.getItem(LS_KEY) || 'null') as Identity | null;
    if (stored) merged = { ...stored, ...fresh };
    localStorage.setItem(LS_KEY, JSON.stringify(merged));
  } catch { /* private mode */ }
  try {
    window.fbq?.('init', PIXEL_ID, merged);
  } catch { /* pixel not loaded */ }
}
