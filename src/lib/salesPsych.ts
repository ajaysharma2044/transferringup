// Sales-psychology engine for the /hq command center.
//
// Reads everything a lead told us (and how they behaved) and produces "the
// read": what actually drives them, where the insecurity lives, which
// objections are coming, and the exact plays to close - each tied to a named
// persuasion principle (loss aversion, social proof, consistency, authority,
// urgency, mirroring). Deterministic rules, so it never hallucinates: every
// claim traces to a field they filled in.
import { RESULTS, SCHOOL_BRAND } from '../data/results';

// How to DELIVER everything below. The dossier makes you omniscient; the call
// must never sound like it. Knowledge gets leaked as pattern recognition, not
// recited as research. These rules render at the top of every profile.
export const DELIVERY_RULES: string[] = [
  "Attribute everything to experience, never to research. \"We work with a lot of students from your area\" - never \"I saw that...\" or \"I looked into your school.\"",
  "Play half-dumb. Ask questions you already know the answer to, let THEM tell you, then confirm with one insider detail. They conclude you are the expert; you never claimed it.",
  "Every knowing line is a casual HYPOTHESIS, not a fact: \"let me guess...\", \"if I had to bet...\", \"students in your exact spot usually tell me...\". Guesses that land feel like expertise. Facts that land feel like surveillance.",
  "One insider detail per topic, maximum. The first detail is impressive; the second is creepy. Spend the rest of your knowledge steering questions instead.",
  "Be 90% right and correctable. Let them fix a small detail (\"well actually it's more the...\") - correcting you makes them invest in teaching you, and invested prospects close.",
  "Never name specific outcomes about THEIR school unprompted (\"kids from your HS end up at Michigan\"). Instead: \"schools like yours usually send their top kids the same three places - am I close?\" and let them say the names.",
  "The goal of every leak: they think \"this person just KNOWS this world.\" Domain authority, invisible homework.",
];

export type Play = { principle: string; play: string };
export type Objection = { objection: string; counter: string };
export type ProofCase = { start: string; schools: string[] };
export type PsychRead = {
  driver: string;
  driverWhy: string;
  temperature: 'READY TO CLOSE' | 'NEEDS PROOF' | 'NEEDS TRUST' | 'LONG NURTURE';
  showRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  showRiskWhy: string;
  insecurities: string[];
  objections: Objection[];
  plays: Play[];
  mirror: string[];
  proof: ProofCase[];
  urgency: string;
};

const norm = (s?: string) => (s || '').toLowerCase();

function gpaNum(s?: string): number | null {
  const m = /([0-4](?:\.\d{1,2})?)/.exec(s || '');
  if (!m) return null;
  const n = Number(m[1]);
  return n >= 0 && n <= 4.34 ? n : null;
}

// Weeks until the application crunch for their stated cycle. Spring cycles
// close around Oct 15; fall transfer apps around Mar 1.
function cycleUrgency(cycle?: string): string {
  const m = /\b(Spring|Fall)\s*(\d{4})/i.exec(cycle || '');
  if (!m) return '';
  const year = Number(m[2]);
  const isSpring = /spring/i.test(m[1]);
  const deadline = isSpring ? new Date(year - 1, 9, 15) : new Date(year, 2, 1);
  const weeks = Math.round((deadline.getTime() - Date.now()) / (7 * 86400000));
  if (weeks < 0) return '';
  if (weeks <= 26) return `~${weeks} weeks until ${m[1]} ${year} deadlines. Every week of delay is a week of essays and positioning lost - say this number on the call.`;
  return `${m[1]} ${year} target: deadlines in ~${weeks} weeks. Frame starting now as the "easy mode" window.`;
}

// Best matching outcome from the results page: same-or-lower GPA that landed a
// school in (or near) their dream list = the single most persuasive artifact.
function matchProof(gpa: number | null, targets: string): ProofCase[] {
  const t = norm(targets);
  const scored = RESULTS.map((r) => {
    const m = /([0-4](?:\.\d{1,2})?)\s*(HS|College)?/i.exec(r.start);
    const rg = m ? Number(m[1]) : null;
    const schools = r.schools.map((s) => SCHOOL_BRAND[s.key]?.full || s.key);
    let score = 0;
    if (gpa !== null && rg !== null && rg <= gpa + 0.05) score += 2; // "worse than you, still made it"
    if (schools.some((s) => t.includes(norm(s).split(' ')[0]) || t.includes(norm(s)))) score += 3;
    if (gpa !== null && rg !== null && Math.abs(rg - gpa) <= 0.2) score += 1;
    return { r, schools, score };
  }).filter((x) => x.score > 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 2).map((x) => ({ start: x.r.start, schools: x.schools }));
}

export function computeRead(f: Record<string, string>): PsychRead {
  const gpa = gpaNum(f.collegeGPA) ?? gpaNum(f.highSchoolGPA);
  const story = norm(f.currentSchoolStory);
  const challenge = norm(f.challenge) + ' ' + story;
  const lastCycle = norm(f.lastCycleResults);
  const funding = f.fundingSource || '';
  const commitment = f.commitment || f.commitmentLevel || '';
  const targets = f.targetSchools || '';
  const insecurities: string[] = [];
  const objections: Objection[] = [];
  const plays: Play[] = [];
  const mirror: string[] = [];

  /* ---------- driver: what is actually pushing them ---------- */
  let driver = 'Trajectory upgrade';
  let driverWhy = 'Default read: wants a better school than the one they have.';
  if (/reject|denied|didn.?t get|waitlist/.test(challenge + ' ' + lastCycle)) {
    driver = 'Redemption';
    driverWhy = 'They were rejected before. This is about proving the first decision wrong. Redemption buyers close hard once they believe the outcome is different this time - proof beats promises.';
  } else if (/hate|miserable|stuck|wrong school|unhappy|depress|toxic|lonely/.test(challenge)) {
    driver = 'Escape';
    driverWhy = 'Their words say they want OUT of where they are, not just "up." Pain-driven buyers move fastest. Sell the exit date, not the destination brochure.';
  } else if (/parent/i.test(f.filledBy || '')) {
    driver = 'Family expectations';
    driverWhy = 'A parent filled this out. The student is the passenger; the parent is the buyer. Sell outcomes + safety of process to the parent, belonging to the student.';
  } else if (/(investment banking|finance|consulting|law)/i.test((f.careerGoals || '') + ' ' + (f.intendedMajor || ''))) {
    driver = 'Career leverage';
    driverWhy = 'Finance/consulting/law ambitions: they already know target-school pedigree is the entry ticket. Talk recruiting pipelines, target-school OCR, alumni networks - not campus life.';
  }

  /* ---------- insecurities: where it hurts ---------- */
  if (gpa !== null && gpa < 3.0) {
    insecurities.push(`GPA shame (${gpa.toFixed(1)}). They secretly believe the number disqualifies them. NEVER flinch at it - normalize it in the first 5 minutes ("we've moved students below this into top-25s") or they stay guarded all call.`);
  } else if (gpa !== null && gpa < 3.5) {
    insecurities.push(`Mid-GPA anxiety (${gpa.toFixed(1)}): strong enough to hope, weak enough to doubt. They fear being "almost good enough." Sell positioning as the difference-maker.`);
  }
  if (/community college/i.test((f.studentType || '') + ' ' + (f.currentSchool || ''))) {
    insecurities.push('CC stigma: braced for judgment about community college. Flip it early - CC-to-elite is a proven, even ADVANTAGED transfer path (schools love the narrative). Watch them relax when you say it.');
  }
  if (/reject|denied|waitlist/.test(lastCycle)) {
    insecurities.push('Rejection wound: they have already failed at this once, alone. The fear is not the price - it is failing AGAIN after paying. Sell the process as the variable that changed.');
  }
  if (/scared|afraid|worried|anxious|nervous|stress/.test(challenge)) {
    insecurities.push('They literally wrote fear-words in the form. Name the fear gently on the call before pitching anything - people cannot hear offers through anxiety.');
  }
  if (/don't know yet/.test(funding)) {
    insecurities.push('Hiding this from their parents (funding answer). There is a family conversation they are dreading. Offer to BE that conversation: "bring them to a 10-minute follow-up, I will walk them through it."');
  }
  if (/^Still deciding/.test(commitment)) {
    insecurities.push('Not yet sold on transferring at all. Do not sell the program - sell the decision clarity the call itself gives. Program comes after.');
  }
  if (!insecurities.length) insecurities.push('No obvious wound in the data. High-composure lead: sell ambition and mechanics, skip the therapy.');

  /* ---------- their self-declared worry: the objection they handed us ---------- */
  const worry = f.biggestWorry || '';
  const WORRY_COUNTERS: Record<string, Objection> = {
    'My GPA': { objection: 'Self-declared: worried their GPA disqualifies them.', counter: 'They told the FORM their deepest fear. Open the matched proof case before they raise it, and never let the GPA hang unanswered for more than a beat.' },
    'Telling my story': { objection: 'Self-declared: worried they cannot tell their story in essays.', counter: 'Perfect setup: storytelling is literally the service. Show one before/after essay transformation and this objection becomes the reason they buy.' },
    'Not knowing what': { objection: 'Self-declared: information-asymmetry anxiety (what do committees want?).', counter: 'Teach ONE insider mechanic on the call (mid-term report, why-transfer framing). Giving away one secret proves there is a vault.' },
    'Deadlines': { objection: 'Self-declared: timeline anxiety.', counter: 'Walk the exact calendar backward from their cycle deadline. Timeline anxiety converts on structure, not reassurance.' },
    'The cost': { objection: 'Self-declared: PRICE. They flagged cost before you said a number.', counter: 'Do value math before price appears: cost of a wasted year vs the program. If funding answer is also weak, plan the parent conversation, not a discount.' },
    'Doing this alone': { objection: 'Self-declared: fear of doing it alone (they basically pre-bought).', counter: 'This is a buying signal dressed as a worry. Describe exactly what "not alone" looks like week by week, then close directly.' },
    'Honestly, all': { objection: 'Self-declared: overwhelmed by all of it.', counter: 'Do NOT address everything. Pick their biggest fire, solve it live on the call, and let that one proof stand for the whole system.' },
  };
  for (const k in WORRY_COUNTERS) {
    if (worry.indexOf(k) === 0) { objections.push(WORRY_COUNTERS[k]); break; }
  }

  /* ---------- objections they will raise, with counters ---------- */
  if (/don't know yet/.test(funding)) {
    objections.push({
      objection: '"I need to talk to my parents." (Guaranteed - parents do not know they are shopping.)',
      counter: 'Pre-empt it mid-call, do not wait for the end: "Most students bring a parent to a quick follow-up - when could the three of us do 15 minutes?" Book it before hanging up. Never let them carry the pitch home alone; they will under-sell it.',
    });
  }
  if (/myself/.test(funding)) {
    objections.push({
      objection: 'Sticker shock (self-funded).',
      counter: 'Anchor against the cost of the alternative: one more year at the wrong school is $30k+ tuition and a weaker degree. The program is a fraction of that to redirect it, the cheapest lever in education. Offer the payment split before they ask.',
    });
  }
  if (/and they know/.test(funding)) {
    objections.push({
      objection: 'Few - parents are aware and supportive. Objection risk is LOW; speed is the risk.',
      counter: 'This is a close-on-the-call profile. Slow down enough to be credible, then ask for the decision directly. Do not "send info to review" - that is where warm deals die.',
    });
  }
  if (/^Serious/.test(f.investmentReadiness || '') || /understand the value/.test(f.investmentReadiness || '')) {
    objections.push({
      objection: '"How do I know this actually works?"',
      counter: 'They pre-announced this objection in the form. Have the matched case (below) open before the call. Walk one story slowly instead of listing ten stats.',
    });
  }
  if (/^Yes, a private/.test(f.usedAdvisorBefore || '')) {
    objections.push({
      objection: `"I already paid ${f.previousAdvisorFirm || 'a counselor'} and it didn't work."`,
      counter: 'GOLD, not a problem: they are a proven payer with a proven need. Ask what the last firm actually did, agree with their criticism, then differentiate on the exact gap they name. Never defend the industry.',
    });
  }
  if (!objections.length) {
    objections.push({ objection: 'Price/timing hesitation (default).', counter: 'Isolate it: "If the investment felt easy, is there any other reason you would not start?" Handle what remains, then close.' });
  }

  /* ---------- closing plays, principle-tagged ---------- */
  const proof = matchProof(gpa, targets);
  if (proof.length) {
    plays.push({
      principle: 'Social proof',
      play: `Open your matched case: "${proof[0].start} → ${proof[0].schools.join(', ')}." Same starting point as them or worse. Let THEM say "that's basically me."`,
    });
  }
  plays.push({
    principle: 'Loss aversion',
    play: 'People fight 2x harder to avoid loss than to gain. Quantify staying put: "What does one more year at ' + (f.currentSchool || 'your current school') + ' cost you - tuition, network, the recruiting doors that close?" Make the status quo the risky option.',
  });
  if (/^Applying/.test(commitment)) {
    plays.push({
      principle: 'Consistency',
      play: `They told the form "${commitment}." Quote it back verbatim, then: "So the question isn't IF - it's whether you do it alone or with people who've done it ${RESULTS.length}+ times." People honor their own written words.`,
    });
  }
  if (f.callGoal) {
    plays.push({
      principle: 'Mirroring',
      play: `They want: "${String(f.callGoal).slice(0, 90)}". Deliver exactly that in the first 15 minutes, visibly, then the close is just "want us to run this with you?"`,
    });
  }
  plays.push({
    principle: 'Authority',
    play: 'Establish the operator credential in the first 2 minutes (Cornell, cycles run, admits produced) - then never mention it again. Authority stated once is confidence; twice is insecurity.',
  });
  const urgency = cycleUrgency(f.cycle);
  if (urgency) plays.push({ principle: 'Urgency (real)', play: urgency });

  /* ---------- mirror: their own words to use on the call ---------- */
  [f.currentSchoolStory, f.challenge, f.callGoal, f.lastCycleResults].forEach((t) => {
    if (t && String(t).trim().length > 12) mirror.push(String(t).trim().slice(0, 140));
  });

  /* ---------- temperature + show risk ---------- */
  const ready = /^Ready/.test(f.investmentReadiness || '');
  const wealthy = /^(Ultra|Wealthy)/.test(f.zipWealthTier || '');
  const temperature = ready && (wealthy || /and they know/.test(funding)) ? 'READY TO CLOSE'
    : ready || /^Serious/.test(f.investmentReadiness || '') ? 'NEEDS PROOF'
    : /^Still deciding/.test(commitment) ? 'LONG NURTURE' : 'NEEDS TRUST';

  const opens = f.emailOpens || '';
  const visits = Number(f.visitCount) || 0;
  let showRisk: PsychRead['showRisk'] = 'MEDIUM';
  let showRiskWhy = 'Average signals. Send the personal text anyway.';
  if (opens || visits >= 3 || /^Applying/.test(commitment)) {
    showRisk = 'LOW';
    showRiskWhy = [opens ? 'opens the emails' : '', visits >= 3 ? `${visits} site visits` : '', /^Applying/.test(commitment) ? 'committed answer' : ''].filter(Boolean).join(' + ') + ' - they are leaning in.';
  }
  if (!opens && /^(Exploring|Still)/.test((f.investmentReadiness || '') + commitment)) {
    showRisk = 'HIGH';
    showRiskWhy = "No email opens + exploratory answers. Ghost-risk: send the personal 'this is Ajay, I will be on the call' text NOW and ask a question that requires a reply.";
  }

  return { driver, driverWhy, temperature, showRisk, showRiskWhy, insecurities, objections, plays, mirror, proof, urgency };
}
