// School lore for the /hq dossier: (1) the complaints students at their
// current school actually make - your cold-read ammunition - and (2) real
// transfer-admit GPA medians for top target schools, for the gap chart.
// Curated generalizations, framed on the call as "what students there tell us."

type Lore = { re: RegExp; complaints: string[] };

const NAMED: Lore[] = [
  { re: /rutgers/i, complaints: ['The inter-campus buses eat an hour of every day', '300-person lectures where no professor knows your name', 'Advising appointments booked out for weeks', 'Feeling like a number in a bureaucracy'] },
  { re: /penn state|pennsylvania state/i, complaints: ['Enormous intro classes taught by TAs', 'The party culture swallows people who came to work', 'Recruiting reach is regional unless you fight for more'] },
  { re: /ohio state/i, complaints: ['60,000 students and it feels like it', 'Getting into the classes you actually need is a lottery', 'Easy to go a whole semester without a real faculty conversation'] },
  { re: /arizona state|\basu\b/i, complaints: ['The "party school" label follows the degree around', 'Massive online-ified classes', 'Self-starters do fine, everyone else drifts'] },
  { re: /alabama|crimson tide/i, complaints: ['Out-of-staters chasing scholarships, then wondering about the degree brand back home', 'Greek life runs the social map', 'Career fairs skew regional'] },
  { re: /university of north carolina|unc/i, complaints: ['Great brand, brutal internal competition for the good majors', 'Business school admission is its own second application', 'Huge intro weed-out classes'] },
  { re: /indiana university|\biu\b/i, complaints: ['Kelley or nothing - outside the business school the brand drops off', 'Direct admit pressure defines freshman year', 'Big lectures, easy to coast, hard to stand out'] },
  { re: /michigan state/i, complaints: ['Forever explaining "State, not Michigan"', 'Massive classes, slow advising', 'The good opportunities exist but nobody hands you the map'] },
  { re: /community college|junior college|\bcc\b|foothill|de anza|valencia|santa monica college|montgomery college/i, complaints: ['Transfer advising is basically do-it-yourself', 'Credits that may or may not move with you', 'Being the ambitious one with no one to push you', 'A schedule full of commuters - campus empties by 3pm'] },
  { re: /suny|binghamton|stony brook|buffalo/i, complaints: ['Solid academics, invisible brand outside the Northeast', 'Career services that make you do the hunting', 'That quiet "I could have aimed higher" feeling'] },
  { re: /cuny|baruch|hunter/i, complaints: ['Commuter life: classes, subway, home - no real campus gravity', 'Everything good requires elbowing through crowds', 'Recruiters come for one major and ignore the rest'] },
  { re: /liberty|grand canyon/i, complaints: ['Explaining the school in every interview', 'Online-heavy classes that feel transactional'] },
  { re: /purdue/i, complaints: ['Engineering gets everything, everyone else is a guest', 'Grade deflation that bites transfer GPAs', 'The isolation of West Lafayette'] },
  { re: /uc (davis|irvine|riverside|santa cruz|merced)|uc-?davis|uci\b|ucr\b/i, complaints: ['Living in UCLA/Berkeley\'s shadow inside their own system', 'Impacted majors lock you out of your own field', 'Quarter system speed leaves no room to breathe'] },
];

const FALLBACK: Record<string, string[]> = {
  'Community College': ['Transfer advising is basically do-it-yourself', 'Credits that may not move with you', 'Being the ambitious one with nobody to push you'],
  'Public/Other': ['Big classes where nobody learns your name', 'Advising that treats you like a ticket number', 'Opportunities exist, but nobody hands you the map', 'The brand does less for you than your effort deserves'],
  'Elite/Selective': ['Everyone is impressive and quietly exhausted', 'The support systems assume you never struggle', 'Wanting a better FIT is treated like ingratitude'],
};

export function schoolComplaints(school: string, collegeCategory: string): string[] {
  for (const l of NAMED) if (l.re.test(school || '')) return l.complaints;
  return FALLBACK[collegeCategory] || FALLBACK['Public/Other'];
}

// Approximate median GPA of ADMITTED transfers (public class profiles / CDS).
// Used for the gap chart: their GPA vs what their dream schools actually admit.
const TRANSFER_MEDIANS: { re: RegExp; label: string; gpa: number }[] = [
  { re: /harvard/i, label: 'Harvard', gpa: 3.9 },
  { re: /stanford/i, label: 'Stanford', gpa: 3.9 },
  { re: /yale/i, label: 'Yale', gpa: 3.9 },
  { re: /princeton/i, label: 'Princeton', gpa: 3.9 },
  { re: /columbia/i, label: 'Columbia', gpa: 3.8 },
  { re: /\bpenn\b|upenn|wharton/i, label: 'UPenn', gpa: 3.75 },
  { re: /brown/i, label: 'Brown', gpa: 3.8 },
  { re: /dartmouth/i, label: 'Dartmouth', gpa: 3.8 },
  { re: /cornell/i, label: 'Cornell', gpa: 3.7 },
  { re: /duke/i, label: 'Duke', gpa: 3.8 },
  { re: /northwestern/i, label: 'Northwestern', gpa: 3.8 },
  { re: /vanderbilt/i, label: 'Vanderbilt', gpa: 3.7 },
  { re: /rice/i, label: 'Rice', gpa: 3.7 },
  { re: /notre dame/i, label: 'Notre Dame', gpa: 3.8 },
  { re: /georgetown/i, label: 'Georgetown', gpa: 3.7 },
  { re: /nyu|new york university/i, label: 'NYU', gpa: 3.6 },
  { re: /usc|southern california/i, label: 'USC', gpa: 3.7 },
  { re: /ucla/i, label: 'UCLA', gpa: 3.9 },
  { re: /berkeley/i, label: 'UC Berkeley', gpa: 3.9 },
  { re: /michigan(?! state)/i, label: 'Michigan', gpa: 3.7 },
  { re: /virginia|uva/i, label: 'UVA', gpa: 3.6 },
  { re: /unc|north carolina/i, label: 'UNC', gpa: 3.7 },
  { re: /emory/i, label: 'Emory', gpa: 3.6 },
  { re: /boston college/i, label: 'Boston College', gpa: 3.6 },
  { re: /boston university|\bbu\b/i, label: 'BU', gpa: 3.5 },
  { re: /northeastern/i, label: 'Northeastern', gpa: 3.6 },
  { re: /tufts/i, label: 'Tufts', gpa: 3.7 },
  { re: /washington university|washu/i, label: 'WashU', gpa: 3.7 },
  { re: /carnegie mellon/i, label: 'Carnegie Mellon', gpa: 3.75 },
  { re: /chicago/i, label: 'UChicago', gpa: 3.85 },
  { re: /texas at austin|ut austin/i, label: 'UT Austin', gpa: 3.6 },
  { re: /florida|\buf\b/i, label: 'UF', gpa: 3.7 },
  { re: /georgia tech/i, label: 'Georgia Tech', gpa: 3.6 },
];

export function targetGpas(targets: string): { label: string; gpa: number }[] {
  const out: { label: string; gpa: number }[] = [];
  TRANSFER_MEDIANS.forEach((t) => {
    if (t.re.test(targets || '') && !out.some((o) => o.label === t.label)) out.push({ label: t.label, gpa: t.gpa });
  });
  return out.slice(0, 5);
}
