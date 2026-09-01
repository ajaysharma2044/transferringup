// Lead pipeline — sends a contact-form submission to every connected system:
//   1. Google Apps Script  → logs to the Google Sheet + emails the team (primary)
//   2. HubSpot Forms API    → creates/updates the contact in HubSpot CRM
//   3. Meta Pixel + GA4      → fires a "Lead" / "generate_lead" conversion event
//
// Every lead is silently enriched (IP + geo, UTM attribution, device — see
// leadMeta.ts) before it reaches the Sheet.
//
// All IDs come from VITE_ env vars (public by design). Configure them in Netlify.
import { collectLeadMeta } from './leadMeta';
import { collectSignals } from './leadSignals';
import { computeSchoolIntel, classifyMajor } from './schoolIntel';
import { lookupZipWealth, lookupHsInfo } from './zipWealth';
import { setKnownIdentity, getVisitorId } from './visitTracker';
import { setPixelIdentity } from './pixelIdentity';
import { adTrackLead, buildCrmPayload } from './adTracking';
import { attributionFields } from './attribution';

export type Lead = {
  name?: string;
  email?: string;
  phone?: string;
  currentSchool?: string;
  highSchoolGPA?: string;
  collegeGPA?: string;
  targetSchools?: string;
  testScore?: string;
  financialAid?: string;
  challenge?: string;
  message?: string;
  source?: string;
  [key: string]: string | undefined;
};

// Calendly booking page — one source of truth. Calendly is connected to the
// Google Calendar, so the Apps Script booking sync/reminders keep working as
// long as the Calendly event name contains "call".
export const BOOKING_URL = 'https://calendly.com/ajay-transferringup/30min';

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL as string | undefined;
const HUBSPOT_PORTAL = import.meta.env.VITE_HUBSPOT_PORTAL_ID as string | undefined;
const HUBSPOT_FORM = import.meta.env.VITE_HUBSPOT_FORM_GUID as string | undefined;
// GoHighLevel inbound-webhook URL (Automation -> Workflow -> Inbound Webhook).
// Set in Netlify env; until then the GHL send is a silent no-op.
const GHL_WEBHOOK = import.meta.env.VITE_GHL_WEBHOOK_URL as string | undefined;

// Forward the enriched lead to GoHighLevel. The workflow on their side maps
// fields to the contact + custom fields and can tag/pipeline it from `type`.
async function toGoHighLevel(payload: Record<string, unknown>) {
  if (!GHL_WEBHOOK) return;
  await fetch(GHL_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

async function toGoogleSheet(lead: Lead) {
  if (!GOOGLE_SCRIPT_URL) return;
  // text/plain avoids a CORS preflight Apps Script can't answer; no-cors so the
  // opaque response doesn't throw. The row still lands in the sheet.
  // keepalive: the submit is no longer awaited before the calendar shows, so
  // this must survive the user booking fast and being redirected to /prep.
  await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    keepalive: true,
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ ...lead, source: lead.source || 'Website Contact Form' }),
  });
}

async function toHubSpot(lead: Lead) {
  if (!HUBSPOT_PORTAL || !HUBSPOT_FORM) return;
  const parts = (lead.name || '').trim().split(/\s+/);
  const firstname = parts.shift() || '';
  const lastname = parts.join(' ');
  const fields = [
    { name: 'email', value: lead.email || '' },
    { name: 'firstname', value: firstname },
    { name: 'lastname', value: lastname },
    { name: 'phone', value: lead.phone || '' },
  ].filter((f) => f.value);

  await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL}/${HUBSPOT_FORM}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields,
      context: {
        pageUri: typeof location !== 'undefined' ? location.href : '',
        pageName: typeof document !== 'undefined' ? document.title : 'Contact',
      },
    }),
  });
}

// Fire the ad-platform conversion events, weighted by lead quality so Meta can
// VALUE-optimize (find people like your best leads, not just any form-fill).
//   - Lead        : every submit, carrying value = lead score + geo/school data
//   - QualifiedLead: only Hot/Warm or "ready to invest" leads → optimize for THIS
// The event `value` is the 0-100 lead score as a relative worth proxy; rescale it
// to real dollars once we lock a deal value. IP + user-agent are attached by the
// pixel automatically; email/phone matching comes from Automatic Advanced Matching
// (a toggle in Events Manager). School/city/tier ride as custom data below.
function fireConversionEvents(lead: Lead) {
  const score = Number(lead.leadScore) || 0;
  // Major multiplier: target majors (finance/consulting/pre-law/pre-med) boost
  // the event value; engineering/CS are down-weighted AND excluded from
  // QualifiedLead so Meta stops finding them.
  const major = classifyMajor(lead.intendedMajor || '');
  // Wealth multiplier: leads from ultra-wealthy ZIPs are worth more to chase.
  const wealthMult = /^Ultra/.test(lead.zipWealthTier || '') ? 1.5
    : /^Wealthy/.test(lead.zipWealthTier || '') ? 1.25 : 1;
  // Proven-payer multipliers: private-school tuition and prior paid counseling
  // are receipts, not claims.
  const privateMult = lead.hsType === 'Private' ? 1.3 : 1;
  const payerMult = /^Yes, a private/.test(lead.usedAdvisorBefore || '') ? 1.3 : 1;
  const value = Math.round(score * major.mult * wealthMult * privateMult * payerMult);
  const custom = {
    wealth_tier: lead.zipWealthTier || '',
    zip_income: lead.zipMeanIncome || '',
    hs_type: lead.hsType || '',
    used_advisor: lead.usedAdvisorBefore || '',
    value,
    currency: 'USD',
    lead_score: score,
    lead_tier: lead.leadTier || '',
    investment: lead.investmentReadiness || '',
    city: lead.ipCity || '',
    region: lead.ipRegion || '',
    school: lead.currentSchool || lead.highSchool || '',
    student_type: lead.studentType || '',
    ability_to_pay: lead.abilityToPay || '',
    pay_tier: lead.payTier || '',
    pipeline_tier: lead.pipelineTier || '',
    hs_category: lead.hsCategory || '',
    college_category: lead.collegeCategory || '',
    major_category: major.cat,
    major_fit: major.fit,
    intended_major: lead.intendedMajor || '',
  };
  const qualified =
    major.fit !== 'Excluded' &&
    (/^(Hot|Warm)/.test(lead.leadTier || '') || /^Ready/.test(lead.investmentReadiness || ''));
  // Explicit NEGATIVE signal: leads we do not want more of. Build a Meta custom
  // audience on this event and EXCLUDE it (and its lookalike) from campaigns.
  const disqualified =
    major.fit === 'Excluded' ||
    /couldn't fund/i.test(lead.fundingSource || '') ||
    /spam/i.test(lead.leadTier || '');
  const wealthy = /^(Ultra|Wealthy)/.test(lead.zipWealthTier || '');
  // Google side: enhanced-conversion identity + the Ads lead conversion
  // (inert until AW_ID/labels are configured in adTracking.ts).
  adTrackLead({ email: lead.email, phone: lead.phone, name: lead.name, value });
  try {
    // Attach their identity to the browser pixel BEFORE the funnel events fire,
    // so Lead/QualifiedLead (and every later visit) match to a real person.
    setPixelIdentity(lead.email, lead.phone, lead.name);
    const w = window as unknown as { fbq?: (...a: unknown[]) => void };
    w.fbq?.('track', 'Lead', custom);
    if (qualified) w.fbq?.('trackCustom', 'QualifiedLead', custom);
    if (disqualified) w.fbq?.('trackCustom', 'DisqualifiedLead', custom);
    // Lookalike seed: leads from rich ZIPs (regardless of their answers).
    if (wealthy && !disqualified) w.fbq?.('trackCustom', 'WealthyLead', custom);
    // Proven-payer seeds: tuition families + families who paid a counselor before.
    if (lead.hsType === 'Private' && !disqualified) w.fbq?.('trackCustom', 'PrivateSchoolLead', custom);
    if (/^Yes, a private/.test(lead.usedAdvisorBefore || '') && !disqualified) {
      w.fbq?.('trackCustom', 'PreviousPayer', custom);
    }
  } catch {
    /* pixel not loaded */
  }
  try {
    const w = window as unknown as { gtag?: (...a: unknown[]) => void };
    w.gtag?.('event', 'generate_lead', { event_category: 'contact', value });
    if (qualified) w.gtag?.('event', 'qualified_lead', { event_category: 'contact', value });
  } catch {
    /* gtag not loaded */
  }
}

/** Submit a lead to all systems. Never throws — each channel fails independently. */
export async function submitLead(lead: Lead): Promise<void> {
  // Enrich first (IP/geo/UTM/device); a failed lookup just yields empty fields.
  // Then layer on behavior/derived signals + the computed lead score.
  const meta = await collectLeadMeta();
  const signals = collectSignals(lead as Record<string, string | undefined>);
  // Wealth lookup: the high school they picked places the family (no ZIP
  // question needed); IP-derived postal is the fallback. Private school =
  // tuition-paying family, tagged as its own field.
  const hs = await lookupHsInfo(lead.highSchool);
  const wealth = await lookupZipWealth(hs.zip || meta.ipPostal);
  // Google click IDs (gclid) + persistent lead id ride on the row so a
  // closed deal can later be imported back into Google Ads as an offline
  // conversion - the Google-side twin of training the Meta pixel.
  // attributionFields answers "how did they find us": paid Google vs organic
  // Google vs Meta vs direct, plus the exact keyword/creative when the ad URL
  // carries ValueTrack params. Persisted from their FIRST landing, so it
  // survives the browse-around before they apply.
  const base: Lead = { ...meta, ...signals, ...wealth, ...buildCrmPayload(), ...attributionFields(), hsType: hs.isPrivate ? 'Private' : '', ...lead };
  // Tag school tiers + ability-to-pay from what they picked (lands as sheet columns).
  const intel = computeSchoolIntel(base as Record<string, string | undefined>);
  const enriched: Lead = { ...base, ...intel };
  await Promise.allSettled([
    toGoogleSheet(enriched),
    toHubSpot(enriched),
    toGoHighLevel({ type: 'lead', ...enriched }),
  ]);
  // From here on, this browser's visits report as this person (Visits tab).
  setKnownIdentity(lead.name || '', lead.email || '');
  fireConversionEvents(enriched);
}

/** Call-prep enrichment (the /prep page): uploads + goal + last-cycle answers.
 * The Apps Script saves files to a per-student Drive folder, writes everything
 * onto their Leads row (matched by email), and emails both sides. Never throws. */
export type EnrichmentFile = { name: string; mime: string; b64: string; label: string };
export async function submitEnrichment(data: {
  email: string;
  goal?: string;
  lastCycle?: string;
  files?: EnrichmentFile[];
  story?: string;
  whyNow?: string;
  worry?: string;
  familyBenchmark?: string;
  parentName?: string;
  parentContact?: string;
}): Promise<void> {
  if (!GOOGLE_SCRIPT_URL || !data.email) return;
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ type: 'enrichment', ...data }),
    });
  } catch {
    /* best-effort */
  }
  // Mirror the prep answers (not the file bytes) into GoHighLevel.
  try {
    await toGoHighLevel({
      type: 'call-prep',
      email: data.email,
      goal: data.goal || '',
      lastCycle: data.lastCycle || '',
      uploadCount: (data.files || []).length,
    });
  } catch {
    /* best-effort */
  }
  setKnownIdentity('', data.email);
  setPixelIdentity(data.email);
}

/** Newsletter signup — lands in the "Newsletter" tab and links this browser's
 * visit history to the subscriber's email. Never throws. */
export async function submitNewsletter(email: string, sourcePage?: string): Promise<void> {
  if (!GOOGLE_SCRIPT_URL || !email) return;
  const meta = await collectLeadMeta();
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        type: 'newsletter',
        email,
        sourcePage: sourcePage || (typeof location !== 'undefined' ? location.pathname : ''),
        visitorId: getVisitorId(),
        ipAddress: meta.ipAddress || '',
        ipCity: meta.ipCity || '',
        ipRegion: meta.ipRegion || '',
        ipISP: meta.ipISP || '',
        utmSource: meta.utmSource || '',
        referrer: meta.referrer || '',
        device: meta.device || '',
      }),
    });
  } catch {
    /* best-effort */
  }
  setKnownIdentity('', email);
  setPixelIdentity(email);
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.('event', 'newsletter_signup', { event_category: 'newsletter' });
    (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq?.('track', 'Subscribe');
  } catch {
    /* pixels not loaded */
  }
}
