// State market read: price culture + transfer culture by home state. The same
// premium anchor lands completely differently in Short Hills NJ vs Raleigh NC,
// because in-state flagship price and prestige gravity differ by state.
// Feeds the dossier's "Market read" card: how to anchor, what the local
// transfer culture is, and what the family is comparing you against.

export type MarketRead = {
  tier: 'Premium' | 'Mixed' | 'Value';
  anchor: string;
  culture: string;
};

const PREMIUM: MarketRead = {
  tier: 'Premium',
  anchor: 'Anchor the full premium scope with confidence. In this market, families benchmark against $200/hr counselors and $30k+ freshman-cycle packages, so underselling reads as low quality.',
  culture: 'Prestige-export culture: leaving the state school for a name brand is the expected story, and paying for help is normalized.',
};
const MIXED: MarketRead = {
  tier: 'Mixed',
  anchor: 'Read the wealth signals before anchoring: metro-wealth families here buy premium, but the state flagship is respectable, so lead with the outcome gap, then price to the signals (base scope for most, full premium scope on an Ultra-wealthy ZIP or private school).',
  culture: 'Split culture: strong affordable flagships coexist with ambitious metro families who play the national game.',
};
const VALUE: MarketRead = {
  tier: 'Value',
  anchor: 'Value-sensitive market: in-state tuition is cheap and flagship pride is real. Anchor the base scope, justify with hard ROI math (earnings delta, recruiting access), and expect the "why not just stay?" question from parents.',
  culture: 'Flagship-pride culture: staying in-state is celebrated, so the transfer motive is usually career math or escape, not status shame. Sell trajectory, not embarrassment.',
};

const T: Record<string, MarketRead['tier']> = {
  NJ: 'Premium', NY: 'Premium', CT: 'Premium', MA: 'Premium', CA: 'Premium',
  MD: 'Premium', DC: 'Premium', WA: 'Premium', VA: 'Mixed', IL: 'Mixed',
  TX: 'Mixed', GA: 'Mixed', FL: 'Mixed', PA: 'Mixed', NC: 'Mixed', CO: 'Mixed',
  MN: 'Mixed', AZ: 'Mixed', MI: 'Mixed', OH: 'Mixed', OR: 'Mixed', NH: 'Mixed',
  RI: 'Mixed', DE: 'Mixed',
};

const STATE_NOTES: Record<string, string> = {
  NJ: 'No beloved in-state brand to compete with: Rutgers is the thing they are leaving. Highest-intent transfer market in the country.',
  NY: 'Long Island/Westchester: SUNY is the fallback, privates are the norm, families already spent on tutors. NYC metro pays for names.',
  CT: 'Prep-school country: UConn is fine but the reference points are BC, BU, and the Ivies. Families budget for education help by default.',
  MA: 'Densest private-college market in America. State school in prep-town culture carries a quiet sting; families pay to fix it.',
  CA: 'UC hierarchy is a public, ranked wound (UCLA/Cal vs the rest). CC-to-UC via TAG is NORMAL here, so CC stigma is low but UC-ladder anxiety is high. Premium metros pay premium.',
  NC: 'UNC/NCSU gravity with ~$9k in-state tuition: the bar you compete with is cheap and respected. RTP transplant families (tech/pharma) are the premium segment; native families need the ROI case.',
  GA: 'HOPE/Zell keeps top kids in-state for free: UGA/Tech are wins here. Transfer buyers are usually chasing OOS prestige against a free alternative, so the family debate is real. Atlanta metro wealth pays.',
  FL: 'Bright Futures makes UF nearly free for top students: UF is the trophy. Missing it stings; leaving Florida costs real money, so the ROI conversation arrives early.',
  TX: 'Top-6% rule creates a class of UT-rejected high achievers with genuine grievance: strong redemption energy. A&M/UT pride is real; OOS moves need a career story. Dallas/Houston/Austin wealth pays premium.',
  VA: 'UVA/W&M are elite in-state at in-state prices: the NoVa status race is national though, and DMV families pay like the Northeast.',
  PA: 'Penn State main-campus cult plus branch-campus stigma (a branch kid transferring to main is its own archetype). Philly Main Line money plays the national game.',
  IL: 'Chicagoland money exports to Michigan/Madison/IU; UIUC is respected for engineering. North Shore families are premium buyers.',
};

/** Extract the 2-letter state from a school string like "X High School (City, NJ)". */
export function extractState(school: string): string {
  const m = /\(([^)]*),\s*([A-Z]{2})\)\s*$/.exec(school || '');
  return m ? m[2] : '';
}

export function marketRead(homeState: string): (MarketRead & { note: string }) | null {
  const st = (homeState || '').toUpperCase();
  if (!st) return null;
  const tier = T[st] || 'Value';
  const base = tier === 'Premium' ? PREMIUM : tier === 'Mixed' ? MIXED : VALUE;
  return { ...base, note: STATE_NOTES[st] || '' };
}
