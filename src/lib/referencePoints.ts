// Reference-point engine: which schools to NAME-DROP on the call so the pitch
// anchors to schools this specific family already respects. People calibrate
// ambition and trust through schools they know: the cousin who went to
// Northwestern, the dream school they typed, the local school everyone reveres.
// Naming those exact schools ("you could be in the Northwestern conversation")
// converts far better than generic "a top school." Matched against real results.
import { RESULTS, SCHOOL_BRAND } from '../data/results';

export type RefPoint = { school: string; why: string; proof?: string };

// Prestige schools worth recognizing as family-benchmark anchors.
const KNOWN = Object.keys(SCHOOL_BRAND).map((k) => ({ key: k, full: SCHOOL_BRAND[k].full }));

// Find a results-page case that landed a school matching this reference, to pair
// the name-drop with proof ("we have literally sent students to Northwestern").
function proofFor(schoolName: string): string {
  const s = schoolName.toLowerCase();
  for (const r of RESULTS) {
    const hit = r.schools.some((sc) => {
      const full = (SCHOOL_BRAND[sc.key]?.full || sc.key).toLowerCase();
      return full.includes(s.split(' ')[0]) || s.includes(full.split(' ')[0]);
    });
    if (hit) return `${r.start} -> ${r.schools.map((sc) => SCHOOL_BRAND[sc.key]?.full || sc.key).join(', ')}`;
  }
  return '';
}

export function referencePoints(f: Record<string, string>): { anchors: RefPoint[]; guidance: string } {
  const anchors: RefPoint[] = [];
  const seen = new Set<string>();
  const push = (school: string, why: string) => {
    const key = school.toLowerCase().trim();
    if (!key || seen.has(key)) return;
    seen.add(key);
    anchors.push({ school, why, proof: proofFor(school) });
  };

  // 1. The family benchmark: the single strongest anchor. This is the school the
  // family measures success against, so it becomes the aspirational ceiling.
  const fam = (f.familyBenchmark || '').trim();
  if (fam) {
    push(fam, "Their FAMILY'S gold standard. Use it as the ceiling: \"the kind of outcome your family already respects.\" If you can credibly put them in that conversation, the parent buys.");
  }

  // 2. Their own dream schools: self-declared anchors, already emotionally loaded.
  const targets = (f.targetSchools || '').split(/[,\n;]+/).map((t) => t.trim()).filter(Boolean);
  targets.slice(0, 3).forEach((t) => push(t, 'They named this themselves. Talk about it specifically (its transfer profile, what it rewards) to show you know it from the inside.'));

  // 3. A regionally-resonant elite the family likely reveres even if unlisted.
  // (Light touch: only add a well-known name their targets imply they would know.)
  const allText = (f.targetSchools + ' ' + f.familyBenchmark + ' ' + f.careerGoals).toLowerCase();
  if (/finance|consult|business|banking/.test(allText)) {
    ['Wharton', 'Northwestern', 'NYU Stern'].forEach((s) => {
      if (!seen.has(s.toLowerCase())) push(s, 'Career-track families revere this as a finance/business pinnacle. A light reference signals you operate in that world.');
    });
  }

  const guidance = fam
    ? `Lead with "${fam}" as the reference ceiling, then step down to their own targets. Never say "kids from your family" or reveal you are working off a form answer. Instead: "families who care about outcomes like [benchmark] usually..." Leak it, do not recite it.`
    : 'No family benchmark given. Anchor to their own dream schools and career-tier pinnacles. Ask on the call: "Is there a school someone in your family went to that set the bar?" and use whatever they name.';

  return { anchors: anchors.slice(0, 6), guidance };
}
