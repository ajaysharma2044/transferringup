// Real client results. Single source of truth for the Client Wins grid,
// the Our Edge ledger, and the Results page.

// School registry: full official name + a brand color that stays legible on
// a white background.
export const SCHOOL_BRAND: Record<string, { full: string; color: string }> = {
  cornell: { full: 'Cornell University', color: '#B31B1B' },
  columbia: { full: 'Columbia University', color: '#1C6BB0' },
  jhu: { full: 'Johns Hopkins University', color: '#002D72' },
  rice: { full: 'Rice University', color: '#00205B' },
  stanford: { full: 'Stanford University', color: '#8C1515' },
  upenn: { full: 'University of Pennsylvania (M&T)', color: '#011F5B' },
  michigan: { full: 'University of Michigan', color: '#C8930A' },
  nyu: { full: 'New York University', color: '#57068C' },
  uva: { full: 'University of Virginia', color: '#E57200' },
  usc: { full: 'University of Southern California', color: '#990000' },
  northwestern: { full: 'Northwestern University', color: '#4E2A84' },
  georgetown: { full: 'Georgetown University', color: '#1C5BA0' },
  emory: { full: 'Emory University', color: '#012169' },
  bc: { full: 'Boston College', color: '#8C2232' },
  bu: { full: 'Boston University', color: '#CC0000' },
  uga: { full: 'University of Georgia', color: '#BA0C2F' },
  umiami: { full: 'University of Miami', color: '#005030' },
  utaustin: { full: 'University of Texas at Austin', color: '#BF5700' },
  tamu: { full: 'Texas A&M University', color: '#500000' },
  tufts: { full: 'Tufts University', color: '#3E8EDE' },
  colgate: { full: 'Colgate University', color: '#821019' },
  rutgers: { full: 'Rutgers University', color: '#CC0033' },
  uiuc: { full: 'University of Illinois Urbana-Champaign', color: '#E84A27' },
  vanderbilt: { full: 'Vanderbilt University', color: '#8E6F2E' },
  uchicago: { full: 'University of Chicago', color: '#800000' },
  washu: { full: 'Washington University in St. Louis', color: '#A51417' },
  notredame: { full: 'University of Notre Dame', color: '#9C7A1E' },
  unc: { full: 'UNC Chapel Hill', color: '#4B9CD3' },
  gatech: { full: 'Georgia Tech', color: '#0C5288' },
  brown: { full: 'Brown University', color: '#4E3629' },
};

export function brand(key: string) {
  return SCHOOL_BRAND[key] || { full: key, color: '#0F1C2E' };
}

// Public/state universities — an out-of-state admit to these is a flex (limited
// non-resident seats, higher bar), so we mark it in the ledger.
const PUBLIC = new Set(['michigan', 'uva', 'utaustin', 'rutgers', 'uiuc', 'unc', 'gatech']);
export function isPublic(key: string) {
  return PUBLIC.has(key);
}

export type Acceptance = { key: string; note?: string; inState?: boolean };
export type ClientResult = {
  /** Where they started — HS GPA or current school. */
  start: string;
  /** Qualifier shown with the start (e.g. "C in Calc", "Transfer"). */
  note?: string;
  /** Acceptances, headline first. */
  schools: Acceptance[];
};

export const RESULTS: ClientResult[] = [
  { start: '2.8 HS GPA', schools: [{ key: 'nyu' }] },
  { start: '2.9 HS GPA', schools: [{ key: 'nyu' }] },
  {
    start: '3.0 HS GPA',
    note: 'Test Optional',
    schools: [{ key: 'cornell' }, { key: 'emory' }, { key: 'vanderbilt' }, { key: 'bu' }, { key: 'michigan' }, { key: 'uga', note: 'Full Merit Scholarship' }, { key: 'uva' }, { key: 'bc' }],
  },
  { start: '3.2 HS GPA', schools: [{ key: 'michigan' }, { key: 'nyu' }, { key: 'uva' }] },
  {
    start: '3.2 HS GPA',
    note: 'Test Optional',
    schools: [{ key: 'uva' }, { key: 'nyu' }, { key: 'usc' }, { key: 'michigan' }, { key: 'utaustin' }],
  },
  {
    start: '3.3 HS GPA',
    note: 'C in Calc',
    schools: [{ key: 'uva', note: 'Merit Scholarship' }, { key: 'nyu' }, { key: 'umiami', note: 'Presidential Scholarship' }],
  },
  { start: '3.5 HS GPA', schools: [{ key: 'columbia' }, { key: 'cornell' }, { key: 'nyu' }] },
  { start: 'Rutgers', note: 'Transfer', schools: [{ key: 'northwestern' }, { key: 'georgetown' }] },
  { start: 'UIUC', note: 'Transfer', schools: [{ key: 'usc' }, { key: 'tufts' }, { key: 'colgate' }] },
  // Additional transfer records (presented the same nameless way as the rest).
  { start: '3.3 HS GPA', schools: [{ key: 'usc' }] },
  { start: 'Boston University', note: 'Transfer', schools: [{ key: 'notredame' }, { key: 'georgetown' }, { key: 'nyu', note: 'Stern' }, { key: 'bc' }] },
  { start: 'U of Toronto', note: 'Transfer', schools: [{ key: 'brown' }, { key: 'vanderbilt' }, { key: 'gatech' }] },
  { start: '3.4 HS GPA', schools: [{ key: 'uchicago' }, { key: 'emory' }, { key: 'washu' }, { key: 'nyu' }] },
  { start: 'Bentley', note: 'Transfer', schools: [{ key: 'cornell' }, { key: 'emory' }, { key: 'northwestern' }, { key: 'unc' }] },
  { start: 'Top-300 School', note: 'Transfer', schools: [{ key: 'utaustin', inState: true }, { key: 'tamu' }] },
];
