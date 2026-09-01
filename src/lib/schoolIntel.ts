// School + wealth categorization. Runs at submit time and tags every lead with
// a high-school tier, college tier, dream-ambition count, and an ability-to-pay
// index (0-100) + Pay Tier. These are sent as ordinary lead fields, so they land
// as their own columns in the Leads tab automatically (no Apps Script change).
//
// Everything here is a PROXY, not a person's actual finances. It's built to rank
// leads by likelihood-and-ability to pay for a premium service, and it should be
// corrected over time by the real close data (the CAPI show/close loop).

// Curated elite / high-tuition prep schools (lowercased, matched as substrings).
const ELITE_PREP = [
  'phillips exeter', 'phillips academy', 'andover', 'harvard-westlake', 'harvard westlake',
  'choate', 'deerfield academy', 'lawrenceville', 'hotchkiss', 'groton school',
  "st. paul's school", "saint paul's school", 'milton academy', 'horace mann', 'dalton school',
  'trinity school', 'collegiate school', 'brearley', 'spence school', 'sidwell friends',
  'cranbrook', 'thacher', 'cate school', 'menlo school', 'nightingale-bamford', 'riverdale country',
  'ethical culture fieldston', 'the fieldston', 'winsor school', 'roxbury latin', 'noble and greenough',
  'georgetown prep', 'the hill school', 'mercersburg', 'peddie school', 'blair academy',
  'loomis chaffee', 'taft school', 'kent school', 'westminster school', 'st. albans',
  'national cathedral', 'polytechnic school', 'marlborough school', 'chapin school',
  'the college preparatory school', 'crystal springs uplands', 'castilleja', 'greenhill school',
  'st. marks school of texas', 'hockaday', 'lakeside school', 'university school', 'pace academy',
  'westminster schools', 'the westminster schools', 'punahou', 'iolani',
];

// Prestige / high-cost colleges (Ivies, top privates, elite publics). Used for
// college tier + scoring how ambitious/expensive their dream list is.
const PRESTIGE_COLLEGES = [
  'harvard', 'yale', 'princeton', 'stanford', 'massachusetts institute of technology', 'mit',
  'columbia', 'university of pennsylvania', 'upenn', 'penn', 'brown', 'dartmouth', 'cornell',
  'duke', 'northwestern', 'university of chicago', 'uchicago', 'johns hopkins', 'vanderbilt',
  'rice', 'notre dame', 'georgetown', 'new york university', 'nyu', 'university of southern california',
  'usc', 'emory', 'washington university', 'wash u', 'tufts', 'boston college', 'carnegie mellon',
  'california institute of technology', 'caltech', 'amherst', 'williams', 'swarthmore', 'pomona',
  'bowdoin', 'middlebury', 'wellesley', 'claremont mckenna', 'wesleyan', 'colgate', 'hamilton',
  'university of michigan', 'michigan', 'university of virginia', 'uva', 'university of california',
  'ucla', 'berkeley', 'university of north carolina', 'unc', 'georgia tech', 'university of texas at austin',
  'ut austin', 'university of florida', 'boston university', 'northeastern', 'university of notre dame',
];

// Major categorization → pixel training. Target majors (finance, consulting,
// pre-law, pre-med, business) are your buyers; engineering/CS historically are
// not, so they're EXCLUDED from QualifiedLead and heavily down-weighted in the
// event value. Works on both the new dropdown values and old free-text majors.
const MAJOR_RULES: Array<{ cat: string; fit: 'Target' | 'Neutral' | 'Excluded'; mult: number; re: RegExp }> = [
  { cat: 'Business/Finance', fit: 'Target', mult: 1.5, re: /\b(business|finance|financ|accounting|invest|banking|wharton|stern)\b/i },
  { cat: 'Consulting', fit: 'Target', mult: 1.5, re: /consult/i },
  { cat: 'Economics', fit: 'Target', mult: 1.4, re: /econ/i },
  { cat: 'Pre-Law', fit: 'Target', mult: 1.4, re: /\b(pre.?law|law|political science|polisci|govern)/i },
  { cat: 'Pre-Med', fit: 'Target', mult: 1.3, re: /\b(pre.?med|medicine|medical|health|nursing|dent|pharm)/i },
  { cat: 'Computer Science', fit: 'Excluded', mult: 0.3, re: /\b(computer science|comp sci|\bcs\b|software|swe)\b/i },
  { cat: 'Engineering', fit: 'Excluded', mult: 0.3, re: /engineer/i },
  { cat: 'Data/Math', fit: 'Neutral', mult: 0.6, re: /\b(data science|math|statistics|stats)\b/i },
  { cat: 'Marketing/Comms', fit: 'Neutral', mult: 1.0, re: /\b(marketing|communication|media|journalism)\b/i },
  { cat: 'Sciences', fit: 'Neutral', mult: 1.0, re: /\b(biology|bio|chem|physics|neuro)\b/i },
  { cat: 'Humanities', fit: 'Neutral', mult: 1.0, re: /\b(english|history|philosophy|psych|sociology|liberal arts)\b/i },
];

export function classifyMajor(major: string): { cat: string; fit: string; mult: number } {
  const m = (major || '').trim();
  if (!m) return { cat: '', fit: '', mult: 1 };
  for (const r of MAJOR_RULES) if (r.re.test(m)) return { cat: r.cat, fit: r.fit, mult: r.mult };
  if (/undecided|not sure|other/i.test(m)) return { cat: 'Undecided', fit: 'Neutral', mult: 0.8 };
  return { cat: 'Other', fit: 'Neutral', mult: 1 };
}

function includesAny(hay: string, needles: string[]): boolean {
  const h = (hay || '').toLowerCase();
  return needles.some((n) => h.includes(n));
}
function countMatches(hay: string, needles: string[]): number {
  const h = (hay || '').toLowerCase();
  const hit = new Set<string>();
  needles.forEach((n) => { if (h.includes(n)) hit.add(n); });
  return hit.size;
}

export function computeSchoolIntel(lead: Record<string, string | undefined>): Record<string, string> {
  const hs = lead.highSchool || '';
  const college = lead.currentSchool || '';
  const targets = lead.targetSchools || '';

  const hsCategory = includesAny(hs, ELITE_PREP) ? 'Elite Prep'
    : lead.hsType === 'Private' ? 'Private School'
    : hs ? 'Standard' : '';

  let collegeCategory = '';
  if (/community college|junior college|\bcc\b/i.test(college)) collegeCategory = 'Community College';
  else if (includesAny(college, PRESTIGE_COLLEGES)) collegeCategory = 'Elite/Selective';
  else if (college) collegeCategory = 'Public/Other';

  const dreamPrestige = countMatches(targets, PRESTIGE_COLLEGES);

  // Ability-to-pay index (0-100) from the strongest signals we already collect.
  let pay = 30;
  const aid = (lead.financialAid || '').toLowerCase();
  if (aid === 'no') pay += 25;             // no aid needed = can write the check
  else if (aid === 'yes') pay -= 10;
  if (/parent/i.test(lead.filledBy || '')) pay += 12;
  if (hsCategory === 'Elite Prep') pay += 18;
  else if (hsCategory === 'Private School') pay += 12; // tuition-paying family
  // Receipts beat claims: they've paid for admissions help / test prep before.
  if (/^Yes, a private/.test(lead.usedAdvisorBefore || '')) pay += 12;
  if (/^Yes/.test(lead.testPrepUsed || '')) pay += 8;
  if (collegeCategory === 'Elite/Selective') pay += 10;
  else if (collegeCategory === 'Community College') pay -= 8;
  if (dreamPrestige >= 2) pay += 12; else if (dreamPrestige >= 1) pay += 6;
  if (/^Ready/.test(lead.investmentReadiness || '')) pay += 15;
  else if (/^Serious/.test(lead.investmentReadiness || '')) pay += 6;
  // ZIP wealth (IRS data): the neighborhood they live in is the hardest-to-fake
  // wealth signal we have. See zipWealth.ts.
  const zw = lead.zipWealthTier || '';
  if (/^Ultra/.test(zw)) pay += 28;
  else if (/^Wealthy/.test(zw)) pay += 18;
  else if (/^Affluent/.test(zw)) pay += 8;
  // Direct funding answer (new form): who writes the check beats every proxy.
  const funding = lead.fundingSource || '';
  if (/and they know/.test(funding)) pay += 22;
  else if (/don't know yet/.test(funding)) pay += 10;
  else if (/myself/.test(funding)) pay += 2;
  else if (/couldn't fund/.test(funding)) pay -= 20;
  if (/^Applying/.test(lead.commitmentLevel || '')) pay += 6;
  if (lead.eduEmailDomain) pay += 4;
  if ((lead.device || '') === 'Desktop') pay += 3; // weak income skew
  pay = Math.max(0, Math.min(100, pay));

  const payTier = pay >= 65 ? 'High' : pay >= 40 ? 'Medium' : 'Low';

  // Pipeline tier = how you should route/prioritize them, from ability-to-pay +
  // school ambition + stated intent. Drives the funnel on the sheet.
  const inv = lead.investmentReadiness || '';
  let pipelineTier;
  if (pay >= 65 && (/^Ready/.test(inv) || dreamPrestige >= 2 || collegeCategory === 'Elite/Selective')) {
    pipelineTier = 'Tier 1 - Premium';
  } else if (pay >= 45 || /^(Ready|Serious)/.test(inv)) {
    pipelineTier = 'Tier 2 - Strong';
  } else {
    pipelineTier = 'Tier 3 - Nurture';
  }
  // Ultra-wealthy ZIP + parents aware they're shopping = always the top tier.
  if (/^Ultra/.test(lead.zipWealthTier || '') && /and they know/.test(lead.fundingSource || '')) {
    pipelineTier = 'Tier 1 - Premium';
  }
  // A stated "couldn't fund this right now" overrides everything: nurture only.
  if (/couldn't fund/.test(lead.fundingSource || '')) pipelineTier = 'Tier 3 - Nurture';

  const major = classifyMajor(lead.intendedMajor || '');

  return {
    hsCategory,
    collegeCategory,
    dreamPrestigeCount: targets ? String(dreamPrestige) : '',
    abilityToPay: String(pay),
    payTier,
    pipelineTier,
    majorCategory: major.cat,
    majorFit: major.fit,
  };
}
