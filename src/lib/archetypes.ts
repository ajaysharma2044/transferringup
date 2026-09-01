// Client archetypes for the /hq dossier. One archetype per lead, picked by
// deterministic rules over their form answers. Each carries: who they are,
// how that identity CONFLICTS with where they currently are, the core
// insecurity underneath, and what closes / loses them. This is the cold-read
// layer: say it on the call and watch them say "yes, exactly."

export type Archetype = {
  name: string;
  emoji: string;
  essence: string;
  conflict: (school: string) => string;
  insecurity: string;
  closeWith: string;
  loseIf: string;
};

const A: Record<string, Archetype> = {
  redemption: {
    name: 'The Redemption Seeker',
    emoji: '🔥',
    essence: 'Applied before, got told no, and never accepted the verdict. Every day at their current school is a reminder of the decision they are trying to overturn.',
    conflict: (s) => `${s || 'Their current school'} is not a home to them - it is the consolation prize. They walk past people who are happy there and quietly think "this was never the plan."`,
    insecurity: 'That the first rejection was RIGHT. That they are not actually top-school material and trying again just proves it publicly a second time.',
    closeWith: 'Evidence the retry is a different game: what changed (positioning, essays, narrative), plus a same-GPA-or-worse admit story. Redemption buyers close on proof, not encouragement.',
    loseIf: 'You sound like their guidance counselor: "just apply broadly and see." They have heard hedging before. Certainty + a plan wins.',
  },
  escape: {
    name: 'The Escape Artist',
    emoji: '🚪',
    essence: 'Their words say it plainly: they want OUT. The pain of staying is doing your marketing for you - the destination is almost secondary.',
    conflict: (s) => `Every week at ${s || 'their school'} compounds the feeling of being in the wrong story. Sunday nights are the worst. They are not shopping for a service; they are shopping for an exit date.`,
    insecurity: 'That they are the problem, not the school - "what if I transfer and I am still miserable?" Address it head-on: fit is real, and the data (their own answers) says the mismatch is structural.',
    closeWith: 'A timeline. Paint the specific week they submit, the week decisions land, and the first week on the new campus. Escape buyers buy the calendar.',
    loseIf: 'You spend the call selling prestige. They are buying relief. Sell the exit first, the brand second.',
  },
  ccClimber: {
    name: 'The CC Climber',
    emoji: '🧗',
    essence: 'Community college by circumstance, not ceiling. Usually the most underestimated person in their family or friend group - and running on something to prove.',
    conflict: (s) => `At ${s || 'their CC'}, nobody around them is aiming where they are aiming. Their ambition has no mirror: advisors are overloaded, peers are on a different path, and the transfer machinery is DIY.`,
    insecurity: 'The stigma. They brace for judgment about "community college" in every conversation - including this call. Disarm it in the first five minutes: CC-to-elite is a proven, even advantaged path (admissions loves the narrative).',
    closeWith: 'Respect + a map. Treat them as the ambitious operator they are, then show the exact articulation/credit path. They have never had a competent guide - being one IS the close.',
    loseIf: 'Any whiff of condescension. One patronizing sentence and they are gone.',
  },
  bigFish: {
    name: 'The Big Fish',
    emoji: '🐋',
    essence: 'Top stats at a school beneath their ceiling. They have already won the game in front of them and are bored by it - hungry for a pond that pushes back.',
    conflict: (s) => `${s || 'Their school'} rewards them constantly and challenges them never. The 4.0 that impresses classmates feels like proof they are in the wrong room. Ambitious people rot without resistance.`,
    insecurity: 'That the big pond will expose them - "what if I am only impressive HERE?" Reframe: their numbers already clear the bar; the only gap is positioning, which is exactly what you do.',
    closeWith: 'The peer group. Sell who they will sit next to: the network, the recruiting funnel, the ambient ambition. Big fish buy the room, not the campus.',
    loseIf: 'You over-sell difficulty. They do not want to hear it is hard; they want to hear it is theirs to take with the right moves.',
  },
  legacyPressure: {
    name: 'The Family Standard-Bearer',
    emoji: '🏛️',
    essence: 'A parent is in the process (they filled the form or they are funding with full awareness). The transfer is a family project with family stakes - and the student carries the weight of a standard.',
    conflict: (s) => `${s || 'The current school'} is a status wound for the household, spoken or not. Dinner-table questions about school have gotten shorter. The student feels the gap between where they are and where the family story says they should be.`,
    insecurity: 'Disappointing the people paying. The student fears being the reason it did not work; the parent fears having not done enough. Your process is the relief valve for BOTH.',
    closeWith: 'Run the call to the parent as the buyer (outcomes, process, accountability) and the student as the hero (belonging, ownership). Book the family follow-up before hanging up.',
    loseIf: 'You let the student carry the pitch home alone. They will under-sell it in one sentence and the deal dies at dinner.',
  },
  mercenary: {
    name: 'The Career Mercenary',
    emoji: '📈',
    essence: 'IB/consulting/law-track. They have already decoded the game: target schools are recruiting pipelines, and their current school is not on the list. This is a transaction, and they respect operators.',
    conflict: (s) => `${s || 'Their school'} is simply not where the firms recruit. They know about OCR, target vs non-target, GPA screens - probably from Reddit and WSO at 2am. The school is fine; the pipeline is the problem.`,
    insecurity: 'The clock. Recruiting timelines are brutal (sophomore year internships feed junior offers) - they fear being one cycle too late no matter what they do. Urgency is not a tactic here; it is the truth.',
    closeWith: 'Speak their language: target-school placement, alumni density at the banks/firms, the semester-by-semester recruiting math. Zero fluff. Mercenaries close with operators who know the numbers.',
    loseIf: 'You sell "college experience." They will mentally downgrade you to guidance counselor and ghost.',
  },
  prestigeChaser: {
    name: 'The Prestige Chaser',
    emoji: '👑',
    essence: 'Multiple elite names on the dream list. The brand IS the goal - identity, family bragging rights, the sweatshirt. Nothing wrong with that: status is the oldest buying motive there is.',
    conflict: (s) => `The gap between "${s || 'their school'}" and the names on their list is the gap in how they want to be seen. Every "where do you go?" conversation stings a little.`,
    insecurity: 'That wanting prestige is shallow - so they dress it up as "better academics." Let them keep the cover story; sell to the real motive underneath without ever naming it.',
    closeWith: 'Specificity about the brands they named. Talk about those campuses, those admit profiles, those numbers. Generic "top school" talk breaks the spell; named detail deepens it.',
    loseIf: 'You question the list ("have you considered safety schools?") before building trust. Protect the dream first, calibrate later.',
  },
  quietBuilder: {
    name: 'The Quiet Builder',
    emoji: '🧱',
    essence: 'No loud wound in the data - a composed, deliberate upgrader doing research before acting. Often the highest-quality client: they execute what you assign.',
    conflict: (s) => `${s || 'Their school'} is fine, and "fine" is the problem. They have quietly concluded they can do better and are now auditing who can help - including auditing you, on this call.`,
    insecurity: 'Making a bad investment. They fear buying wrong more than aiming high. Process transparency (what happens week by week) is what safety looks like to them.',
    closeWith: 'Competence signals: structured call, specific plan, clean numbers. They are grading the operation - let them see the machine.',
    loseIf: 'High-pressure tactics. Builders walk from pushiness on principle.',
  },
};

function pickKey(f: Record<string, string>): string {
  const text = ((f.challenge || '') + ' ' + (f.lastCycleResults || '') + ' ' + (f.currentSchoolStory || '')).toLowerCase();
  const career = ((f.careerGoals || '') + ' ' + (f.intendedMajor || '')).toLowerCase();
  const gpaM = /([0-4](?:\.\d{1,2})?)/.exec(f.collegeGPA || f.highSchoolGPA || '');
  const gpa = gpaM ? Number(gpaM[1]) : null;
  const prestigeCount = Number(f.dreamPrestigeCount) || 0;

  if (/reject|denied|didn.?t get|waitlist/.test(text)) return 'redemption';
  if (/hate|miserable|stuck|wrong school|unhappy|depress|toxic|lonely/.test(text)) return 'escape';
  if (/community college/i.test((f.studentType || '') + ' ' + (f.currentSchool || ''))) return 'ccClimber';
  if (/parent/i.test(f.filledBy || '') || /and they know/.test(f.fundingSource || '')) return 'legacyPressure';
  if (/(investment banking|finance|consult|law|ib\b)/.test(career)) return 'mercenary';
  if (gpa !== null && gpa >= 3.7) return 'bigFish';
  if (prestigeCount >= 2) return 'prestigeChaser';
  return 'quietBuilder';
}

/** The archetype plus its key (the key indexes CALL_PLANS in psychDoctrine). */
export function pickArchetype(f: Record<string, string>): Archetype & { key: string } {
  const key = pickKey(f);
  return { ...A[key], key };
}
