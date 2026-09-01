// Household income + willingness-to-pay estimator. Built ENTIRELY from data we
// already hold legitimately: the IRS mean-AGI and $200k+ share for their high
// school's ZIP (see zipWealth.ts), whether it's a tuition-paying private school,
// their own stated funding answer, and the computed ability-to-pay index. No
// third-party surveillance: every number is an area-level aggregate or a fact
// they told us, framed as an estimate the closer verifies on the call.

export type IncomeRead = {
  bracket: string;        // estimated household income band
  confidence: string;     // what the estimate is based on
  occupations: string;    // what parents in this area typically do
  willingness: string;    // likely willingness/ability to pay
  anchor: string;         // concrete pricing move
};

function parseK(s: string): number {
  const m = /\$?([\d.]+)k/i.exec(s || '');
  return m ? Number(m[1]) : 0;
}

// Occupation flavor by area wealth: what the modal high-earner household in this
// kind of ZIP tends to do. A read, not a claim about their specific parents.
function occFlavor(meanK: number, share: number): string {
  if (meanK >= 400 || share >= 40) return 'Areas like this skew finance, law-firm partners, physicians, founders, and senior tech/corporate execs. Two-professional households are the norm, and a premium fee reads as a normal enrichment expense, not a stretch.';
  if (meanK >= 250 || share >= 22) return 'Typically dual-income professional households: mid-senior corporate, medicine, engineering, small-business owners. They spend on education deliberately but expect to understand the ROI.';
  if (meanK >= 150 || share >= 10) return 'Solidly upper-middle: managers, nurses, teachers-married-to-professionals, tradespeople who own their business. Real money exists but every large purchase gets discussed and justified.';
  return 'Mixed/working-to-middle area. Do not assume family funds; the student may be paying, or there is a real budget conversation at home. Lead with value and payment flexibility before a number.';
}

export function incomeEstimate(f: Record<string, string>): IncomeRead | null {
  const meanK = parseK(f.zipMeanIncome || '');
  const shareM = /(\d+(?:\.\d+)?)%/.exec(f.zipTop200kShare || '');
  const share = shareM ? Number(shareM[1]) : 0;
  const priv = f.hsType === 'Private' || f.hsCategory === 'Elite Prep' || f.hsCategory === 'Private School';
  const funding = f.fundingSource || '';
  const pay = Number(f.abilityToPay) || 0;
  if (!meanK && !share && !priv && !funding) return null;

  // Estimate a household bracket. IRS mean AGI for the ZIP is the spine; private
  // school nudges up (tuition implies capacity); the funding answer calibrates.
  let low = 90, high = 140;
  if (meanK) { low = Math.round(meanK * 0.7); high = Math.round(meanK * 1.5); }
  if (share >= 30) { low = Math.max(low, 200); high = Math.max(high, 500); }
  else if (share >= 18) { low = Math.max(low, 150); high = Math.max(high, 350); }
  if (priv) low = Math.round(low * 1.15);
  if (/couldn't fund/.test(funding)) { low = Math.round(low * 0.6); high = Math.round(high * 0.7); }
  const bracket = `~$${low}k - $${high}k household (estimate)`;

  const basis: string[] = [];
  if (meanK) basis.push(`IRS mean income $${meanK}k for their HS ZIP`);
  if (share) basis.push(`${share}% of local households earn $200k+`);
  if (priv) basis.push('tuition-paying school');
  if (funding) basis.push(`their funding answer ("${funding.slice(0, 28)}")`);
  const confidence = 'Based on ' + basis.join(', ') + '. Area aggregate, not their exact household. Verify by ear on the call.';

  // Willingness = ability (area + private) crossed with stated intent (funding).
  let willingness: string;
  if (/and they know/.test(funding) && pay >= 60) willingness = 'HIGH: capacity is there and parents already know they are shopping. The full premium scope is a normal ask. Do not discount; anchor high and hold.';
  else if (/don't know yet/.test(funding) && pay >= 55) willingness = 'HIGH capacity, GATED intent: the money exists but the parent conversation has not happened. The whole deal hinges on you helping run that conversation. Book the parent call.';
  else if (/myself/.test(funding)) willingness = 'SELF-FUNDED: capacity may exist in the household but THEY are paying, so real ceiling is lower. Consider scope tiers or payment plan; do not assume family money.';
  else if (/couldn't fund/.test(funding)) willingness = 'LOW stated capacity regardless of area. Nurture, do not hard-close. If the ZIP is wealthy, gently test whether parents are actually in the picture.';
  else willingness = pay >= 55 ? 'MODERATE-HIGH: signals point to capacity. Anchor scope to the wealth read and let them tell you the ceiling.' : 'MODERATE: read the room before naming a number; lead with value.';

  const anchor = (share >= 22 || meanK >= 250)
    ? 'Premium anchor: name the full premium scope confidently. In this income band, underselling signals low quality.'
    : (low < 100 || /couldn't fund/.test(funding))
      ? 'Value anchor: lead with base scope and ROI math up front, offer the payment split before they ask.'
      : 'Mid anchor: base scope to full premium scope, priced to what the funding answer and their reaction tell you.';

  return { bracket, confidence, occupations: occFlavor(meanK, share), willingness, anchor };
}
