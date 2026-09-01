import { useState, useEffect } from 'react';
import { Linkedin, Mail, X, Award, TrendingUp, Target, ChevronRight } from 'lucide-react';
import { Reveal, TU } from './shared';
import { Eyebrow, PortraitPlaceholder } from '../shared/editorial';
import { brand } from '../../data/results';

// School logos for the featured "accepted to" row (keyed by brand key).
export const LOGO: Record<string, string> = {
  cornell: 'https://a.espncdn.com/i/teamlogos/ncaa/500/172.png',
  columbia: 'https://a.espncdn.com/i/teamlogos/ncaa/500/171.png',
  vanderbilt: 'https://a.espncdn.com/i/teamlogos/ncaa/500/238.png',
  brown: 'https://a.espncdn.com/i/teamlogos/ncaa/500/225.png',
  gatech: 'https://a.espncdn.com/i/teamlogos/ncaa/500/59.png',
  michigan: 'https://a.espncdn.com/i/teamlogos/ncaa/500/130.png',
  nyu: '/NYU-Symbol.png',
  usc: 'https://a.espncdn.com/i/teamlogos/ncaa/500/30.png',
  emory: 'https://brand.emory.edu/_includes/images/site-wide/graphic-stylized-logo.png',
  uchicago: '/uchicago-logo.png',
  washu: '/washu-logo.png',
  rice: 'https://a.espncdn.com/i/teamlogos/ncaa/500/242.png',
  utaustin: 'https://a.espncdn.com/i/teamlogos/ncaa/500/251.png',
  stanford: 'https://a.espncdn.com/i/teamlogos/ncaa/500/24.png',
  upenn: 'https://a.espncdn.com/i/teamlogos/ncaa/500/219.png',
  // jhu has no standard sports crest, FeaturedCard renders a "JHU" wordmark fallback.
};

// Short display name shown under each crest logo.
export const SCHOOL_SHORT: Record<string, string> = {
  cornell: 'Cornell', columbia: 'Columbia', jhu: 'Hopkins', vanderbilt: 'Vanderbilt',
  rice: 'Rice', utaustin: 'UT Austin', michigan: 'Michigan', nyu: 'NYU', usc: 'USC',
  uchicago: 'UChicago', emory: 'Emory', washu: 'WashU', stanford: 'Stanford', upenn: 'Penn M&T',
  brown: 'Brown', gatech: 'Georgia Tech',
};

type Member = {
  name: string;
  role: string;
  tier: 'founder' | 'consultant';
  photo: string | null;
  objectPosition?: string;
  /** brand key for the school they attend now */
  schoolKey: string;
  /** override the displayed school name (e.g. add "· ILR") */
  schoolLabel?: string;
  classYear?: string;
  pronoun: 'His' | 'Her';
  email?: string;
  linkedin?: string;
  /** HS GPA they started with, shown on founder cards */
  fromGpa?: string;
  /** brand keys shown as the credential line on the card */
  cardSchools?: string[];
  /** brand keys for schools this person helped students get into (first-year advisors) */
  helpedInto?: string[];
  story: string;
  transferDetails: string;
  /** full acceptance list (display strings) shown in the modal */
  transferAcceptances?: string[];
  stats?: { highSchoolGPA: string; collegeGPA?: string; from: string };
  specialties: string[];
  achievements: string[];
};

export const TEAM: Member[] = [
  {
    name: 'Ajay Sharma',
    role: 'CEO & Lead Consultant',
    tier: 'founder',
    photo: '/ajay-linkedin.jpg',
    linkedin: 'https://www.linkedin.com/in/ajay-sharma-ab8869183/',
    schoolKey: 'cornell',
    classYear: 'Class of 2028',
    pronoun: 'His',
    email: 'ajay@transferringup.com',
    fromGpa: '2.9',
    cardSchools: ['cornell', 'vanderbilt', 'michigan', 'nyu', 'usc'],
    story:
      'Since I was 8, I dreamed of going to an Ivy. Then COVID hit, and everything collapsed. Freshman year, I had a 1.25 GPA, ranked 399 of 411, failed most classes, and stopped caring.',
    transferDetails: `Sophomore year, I went to India and saw my mom's family surviving on less than a dollar a day. That snapped me out of it. I came back and started grinding. By senior year my GPA was still a 2.7, and I got rejected from schools with 87% acceptance rates.

From April to August, I obsessed over the transfer process. I studied old applications, forums, and built a blueprint. I took summer classes at community college and pulled a 4.0. At UNCG, I built high-impact extracurriculars. By the end of freshman year, I had multiple top-school acceptances and finally got into Cornell.

Now I help other underdogs do what I did, turning low GPAs into strong narratives, building extracurriculars fast, and making schools take a second look.`,
    transferAcceptances: ['Cornell', 'Vanderbilt', 'Michigan', 'USC', 'NYU', 'Boston University', 'University of Miami', 'Lehigh', 'Villanova'],
    stats: { highSchoolGPA: '2.9', collegeGPA: '3.91', from: 'UNC Greensboro' },
    specialties: ['Extracurricular Strategy', 'Narrative Building', 'Essay Writing', 'Recommendation Letters'],
    achievements: ['Senate Internship', 'Hurricane Helene Meal-Swipe Donation Program', 'Helped Multiple UNCG Students Transfer Out'],
  },
  {
    name: 'Caleb Hong',
    role: 'Essay Consultant',
    tier: 'founder',
    photo: '/caleb-hong.jpg',
    schoolKey: 'uchicago',
    pronoun: 'His',
    linkedin: 'https://www.linkedin.com/in/caleb-hong-5623a12a6/',
    fromGpa: '3.4',
    cardSchools: ['uchicago', 'emory', 'washu', 'nyu'],
    story:
      'In a single year, Caleb went from a 3.4 high-school GPA to acceptances at the University of Chicago, Emory, WashU, and NYU, the exact path our students are on.',
    transferDetails:
      'Caleb knows the transfer timeline from the inside: which extracurriculars actually move the needle, how to frame a mid-range GPA, and how to write essays that make an admissions committee reconsider. He works closely with students on narrative and positioning.',
    transferAcceptances: ['University of Chicago', 'Emory', 'WashU', 'NYU'],
    specialties: ['Narrative Building', 'Essay Strategy', 'Extracurricular Planning', 'Transfer Timeline'],
    achievements: ['Accepted to UChicago, Emory, WashU & NYU', 'Transferred in One Year', '3.4 HS GPA → Top-10 University'],
  },
  {
    name: 'Sahaj Satani',
    role: 'First-Year Admissions Consultant',
    tier: 'consultant',
    // Headshot cut out (rembg) + green despill + composited onto the team's cream bg.
    photo: '/sahaj-satani.webp',
    objectPosition: 'center top',
    schoolKey: 'cornell',
    classYear: 'Class of 2028',
    pronoun: 'His',
    email: 'ajay@transferringup.com',
    // Crests for the featured row (renders once he's promoted to FEATURED + has a photo).
    cardSchools: ['cornell', 'columbia', 'jhu', 'vanderbilt', 'rice', 'utaustin'],
    helpedInto: ['stanford', 'upenn'],
    story:
      'Sahaj is a sophomore at Cornell, with acceptances to Columbia, Johns Hopkins, Vanderbilt, Rice, and UT Austin. He leads our first-year (freshman) admissions advising.',
    transferDetails:
      'On the first-year side, Sahaj has helped students from all backgrounds get into schools like Stanford and UPenn M&T. He guides applicants on school strategy, essays, and positioning for the most selective freshman admissions.',
    transferAcceptances: ['Cornell', 'Columbia', 'Johns Hopkins', 'Vanderbilt', 'Rice', 'UT Austin'],
    specialties: ['First-Year Admissions', 'Essay Strategy', 'School Selection', 'BS/MD Applications'],
    achievements: ['Helped Students Into Stanford & UPenn M&T', 'Accepted to Cornell, Columbia, JHU, Vanderbilt, Rice & UT Austin'],
  },
  {
    name: 'Samanyu',
    role: 'Transfer Consultant',
    tier: 'consultant',
    // Cut out + recomposited onto the team cream bg (230,226,215) to match the
    // other consultant headshots. Source: /reviews/samanyu.jpg.
    photo: '/samanyu-team.webp',
    objectPosition: 'center top',
    schoolKey: 'usc',
    pronoun: 'His',
    email: 'ajay@transferringup.com',
    story:
      "From a 3.2 in HS to USC, UT Austin, NYU, UVA, and more. I'm Samanyu, and through TransferringUp I made my dream of getting into a T25 come true.",
    transferDetails:
      "With Ajay's help, I aspire to help others who were in the same shoes as me get to their dream schools, just like I did. Having just been through the transfer process myself, I know exactly where students get stuck and how to build an application that gets a yes.",
    transferAcceptances: ['UVA', 'USC', 'UT Austin', 'NYU', 'Michigan', 'Boston University'],
    stats: { highSchoolGPA: '3.2', collegeGPA: '3.56', from: 'UC Riverside' },
    specialties: ['Transfer Strategy', 'Narrative Building', 'Essay Support', 'Public University Applications'],
    achievements: ['Transferred to USC in one year', 'Accepted to USC, UT Austin, NYU, UVA & more', '3.2 HS GPA → T25'],
  },
  {
    name: 'Sahil Raut',
    role: 'Essay Consultant',
    tier: 'consultant',
    photo: '/sahil-linkedin.jpg',
    linkedin: 'https://www.linkedin.com/in/sahilraut365/',
    schoolKey: 'cornell',
    classYear: 'Class of 2027',
    pronoun: 'His',
    email: 'ajay@transferringup.com',
    story:
      'I had dreams of attending a T20 but was unmotivated to put in the work. My wake-up call arrived too late, and by the time applications rolled around, I was scrambling. A slew of rejections followed.',
    transferDetails: `My unsuccessful first-year attempt gave me direction. I meticulously researched the transfer process over two years at Bentley, finding my passion and carving a niche on campus. On March 30, 2023, I was rejected by Cornell. On April 22, 2025, I was accepted.

I now pay it forward. The transfer process is quite different from the first-year cycle, and I help students weave their weaker past into a stronger narrative, giving admissions context, not flaws.`,
    transferAcceptances: ['Cornell', 'Northwestern', 'USC', 'UNC Chapel Hill', 'Emory', 'University of Richmond', 'University of Rochester'],
    stats: { highSchoolGPA: '3.85', collegeGPA: '3.98', from: 'Bentley University' },
    specialties: ['Narrative Building', 'Essay Writing', 'Recommendation Letters', 'Major Selection'],
    achievements: ['Wealth Management / Finance Internships', 'Editor in Chief of Newspaper', 'Student Research'],
  },
  {
    name: 'Kaveen Shah',
    role: 'Essay Consultant',
    tier: 'consultant',
    photo: '/kaveen-linkedin.jpg',
    linkedin: 'https://www.linkedin.com/in/kaveen-shah-871533239/',
    schoolKey: 'cornell',
    classYear: 'Class of 2027',
    pronoun: 'His',
    story:
      "I transferred from Texas A&M to Cornell, one of the most competitive transfer programs in the country. Navigating the transfer process while pursuing a pre-law path gives me unique insight into what admissions committees value.",
    transferDetails:
      'I specialize in essay review and editing, helping students sharpen their narratives and present the strongest possible version of their story. I also guide students interested in pre-law applications, drawing from my own experience at Cornell.',
    transferAcceptances: ['Cornell'],
    specialties: ['Essay Review & Editing', 'Pre-Law Applications', 'Transfer Narrative Strategy'],
    achievements: ['Transfer to Cornell from Texas A&M', 'Pre-Law Track', 'Political Science Background'],
  },
  {
    name: 'Mike Liang',
    role: 'Essay Consultant',
    tier: 'consultant',
    photo: '/mike-linkedin.jpg',
    linkedin: 'https://www.linkedin.com/in/mliang1/',
    schoolKey: 'cornell',
    classYear: 'Class of 2028',
    pronoun: 'His',
    story:
      'As a sophomore at Cornell majoring in Public Policy, I bring a unique perspective to transfer admissions, particularly for students navigating academic disciplinary records.',
    transferDetails:
      "I specialize in helping students who have faced academic discipline turn their experiences into compelling narratives. Whether it's a suspension, an academic-integrity violation, or another setback, I help students address these challenges head-on while demonstrating growth and resilience.",
    specialties: ['Academic Disciplinary Cases', 'Essay Writing', 'SAT Reading (800 Score)', 'Narrative Building'],
    achievements: ['SAT Reading Score: 800', 'Cornell University Sophomore', 'Public Policy Major'],
  },
  {
    name: 'Akshay Joshi',
    role: 'Essay Consultant',
    tier: 'consultant',
    photo: '/akshay-linkedin.jpg',
    linkedin: 'https://www.linkedin.com/in/akshay-joshi-238465253/',
    schoolKey: 'cornell',
    classYear: 'Class of 2028',
    pronoun: 'His',
    story:
      'I scored 1510 on the SAT with a 790 in Math. My approach is rooted in strategic thinking and the problem-solving techniques I use in my Computer Science studies.',
    transferDetails:
      'SAT success comes from understanding patterns, developing efficient strategies, and building confidence through practice. I break complex problems into manageable steps, teach students to recognize question types quickly, and develop the time-management skills crucial for test day.',
    specialties: ['SAT Math Tutoring', 'Problem-Solving Strategies', 'Test Prep', 'Time Management'],
    achievements: ['SAT Score: 1510 (790 Math)', 'Cornell University Sophomore', 'Computer Science Major'],
  },
  {
    name: 'Abigail So',
    role: 'Essay Consultant',
    tier: 'consultant',
    photo: '/abigail-linkedin.jpg',
    linkedin: 'https://www.linkedin.com/in/abigail-so/',
    schoolKey: 'cornell',
    classYear: 'Class of 2026',
    pronoun: 'Her',
    story:
      "As a senior at Cornell studying Government and Classics, I've developed strong analytical writing skills that I bring to essay editing for transfer applicants.",
    transferDetails:
      'I focus on refining transfer essays to be clear, compelling, and authentic. My background in government and classics gives me an eye for persuasive argumentation and narrative structure, skills that translate directly to crafting standout admissions essays.',
    specialties: ['Essay Editing', 'Narrative Refinement', 'Persuasive Writing'],
    achievements: ['Cornell University Senior', 'Government & Classics Double Major'],
  },
  {
    name: 'Ryan Oh',
    role: 'COO',
    tier: 'consultant',
    photo: '/1752665688145.jpeg',
    linkedin: 'https://www.linkedin.com/in/ryyanoh/',
    schoolKey: 'vanderbilt',
    classYear: 'Class of 2027',
    pronoun: 'His',
    cardSchools: ['brown', 'vanderbilt', 'gatech'],
    story:
      'Ryan went through the transfer process and earned acceptances to Brown, Vanderbilt, and Georgia Tech, ultimately choosing Vanderbilt.',
    transferDetails:
      'Ryan navigated the full transfer process, from building his school list to making the final call, and came out with offers from Brown, Vanderbilt, and Georgia Tech. The decision came down to aid. Brown is need-aware for transfer applicants, so he applied without requesting financial aid, while Vanderbilt was able to meet his need. That made Vanderbilt the clear choice, and it is where he enrolled. Having weighed both admissions and affordability firsthand, he helps students think through the whole picture, alongside building standout finance-oriented profiles, essays, and leadership.',
    transferAcceptances: ['Brown', 'Vanderbilt', 'Georgia Tech'],
    specialties: ['Finance & IB Guidance', 'Leadership Development', 'Business Program Applications', 'Internship Strategy'],
    achievements: ['Accepted to Brown, Vanderbilt & Georgia Tech', 'Chose Vanderbilt for its financial aid', 'Co-Founder & President, Global Delta Securities', 'IB Intern at KCC Capital Partners', 'GPA: 3.97 at Vanderbilt'],
  },
  {
    name: 'Dilan Harrop-Williams',
    role: 'Essay Consultant',
    tier: 'consultant',
    photo: '/dilan-linkedin.jpg',
    linkedin: 'https://www.linkedin.com/in/dilan-harrop-williams/',
    schoolKey: 'cornell',
    schoolLabel: 'Cornell University · Dyson',
    pronoun: 'His',
    email: 'ajay@transferringup.com',
    story:
      'A Cornell Dyson student in Applied Economics & Management and an investment-banking intern, Dilan brings a finance-first lens to building standout business and economics applications.',
    transferDetails:
      'He helps students translate internships, deals, and leadership into a sharp narrative, the kind that makes admissions officers at competitive business programs take a second look.',
    specialties: ['Business & Finance Applications', 'Dyson / Business-School Strategy', 'Resume & Internships', 'Essay Review'],
    achievements: ['Cornell Dyson, Applied Economics & Management', 'Investment Banking Intern @ Young America Capital'],
  },
  {
    name: 'Bryan Liu',
    role: 'Essay Consultant',
    tier: 'consultant',
    photo: '/bryan-linkedin.jpg',
    linkedin: 'https://www.linkedin.com/in/bryanhliu/',
    schoolKey: 'notredame',
    classYear: 'Class of 2027',
    pronoun: 'His',
    fromGpa: '3.9',
    cardSchools: ['notredame', 'nyu', 'bc', 'georgetown'],
    story:
      'I moved to the U.S. at twelve, had to learn English, and had no one to guide me through the college process. Watching my friends receive admissions support while I had none made me feel defeated.',
    transferDetails:
      "I began researching how to stand out in admissions on my own. Eventually I was accepted into Boston University, but the limited academic support in economics and real estate led me to transfer to Notre Dame. Having navigated the transfer process independently, I understand how hard it is to find trustworthy information. That's why I help students from all backgrounds pursue transfer admissions to their dream schools.",
    transferAcceptances: ['Notre Dame', 'NYU', 'Boston College', 'Georgetown'],
    stats: { highSchoolGPA: '3.9', collegeGPA: '3.78', from: 'Boston University' },
    specialties: ['Major & Class Selection', 'Competition Opportunities', 'Consulting & IB Career Paths'],
    achievements: ['Vice President of Bridge BU', "Dean's List at BU", 'Published Research'],
  },
  {
    name: 'Ryan Gary',
    role: 'Essay Consultant',
    tier: 'consultant',
    photo: '/ryangary-linkedin.jpg',
    linkedin: 'https://www.linkedin.com/in/ryancgary/',
    schoolKey: 'usc',
    classYear: 'Class of 2028',
    pronoun: 'His',
    email: 'rcgary@usc.edu',
    fromGpa: '3.39',
    cardSchools: ['usc'],
    story:
      "In high school, academics weren't my strength. I graduated with a 3.39 GPA and was far more focused on sports than schoolwork. I ended up attending a safety school, but I never let go of my dream of being at a top university.",
    transferDetails:
      'In college, I focused heavily on extracurriculars. I became Director of Outreach for SPAid, a 501(c)(3) nonprofit, and launched a chapter at my university, growing it to hundreds of members. I secured research under a former Harvard researcher and committed to community volunteering. After months of persistence, I was accepted to USC. Now I help others strengthen their profiles and learn how to market themselves to admissions committees.',
    transferAcceptances: ['USC'],
    stats: { highSchoolGPA: '3.39', collegeGPA: '3.67', from: 'Auburn' },
    specialties: ['Resume Building', 'Personal Branding', 'Nonprofit Leadership', 'Research Opportunities'],
    achievements: ['Director of Outreach for SPAid', 'Founded University Chapter (Hundreds of Members)', 'Research Under Former Harvard Researcher'],
  },
];

// Top row of the team section: the two founders plus Sahaj, in this order.
const FEATURED_NAMES = ['Ajay Sharma', 'Ryan Oh', 'Caleb Hong', 'Sahaj Satani'];
const FOUNDERS = FEATURED_NAMES
  .map((n) => TEAM.find((m) => m.name === n))
  .filter((m): m is Member => Boolean(m));

// Grid order (3 across). Row 1 leads with Abigail; Dilan & Ryan Gary sit in row 2;
// Ryan Oh anchors the last slot.
const CONSULTANT_ORDER = [
  'Samanyu',               // UVA, former client, now consultant
  'Abigail So',            // Cornell
  'Sahil Raut',            // Cornell
  'Kaveen Shah',           // Cornell
  'Dilan Harrop-Williams', // Cornell · Dyson
  'Ryan Gary',             // USC
  'Akshay Joshi',          // Cornell
  'Mike Liang',            // Cornell
  'Bryan Liu',             // Notre Dame
  'Ryan Oh',               // Vanderbilt
];
export const CONSULTANTS = TEAM.filter((m) => m.tier === 'consultant' && !FEATURED_NAMES.includes(m.name)).sort(
  (a, b) => (CONSULTANT_ORDER.indexOf(a.name) + 1 || 999) - (CONSULTANT_ORDER.indexOf(b.name) + 1 || 999),
);

// Every headshot links to LinkedIn. Until each person sends their exact
// profile URL, fall back to a LinkedIn people-search for their name so the
// link always lands somewhere real.  TODO: replace placeholders with real URLs.
function linkedInFor(m: Member) {
  return m.linkedin ?? `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(m.name)}`;
}

/** Translucent hover overlay that signals the headshot opens LinkedIn. */
function LinkedInOverlay() {
  return (
    <span
      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      style={{ background: 'rgba(10,21,32,0.5)' }}
    >
      <span
        className="inline-flex items-center"
        style={{ gap: 7, background: '#fff', color: TU.navy, borderRadius: 999, padding: '7px 13px', fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600 }}
      >
        <Linkedin size={15} /> LinkedIn
      </span>
    </span>
  );
}

/* ----------------------------- Founder card ----------------------------- */

/** Acceptance crest, school logo if we have one, else a short wordmark (e.g. JHU). */
function Crest({ schoolKey }: { schoolKey: string }) {
  const logo = LOGO[schoolKey];
  return (
    <span
      title={brand(schoolKey).full}
      className="flex items-center justify-center shrink-0"
      style={{ width: 46, height: 46, borderRadius: '50%', background: '#fff', border: `1px solid ${TU.divider}`, boxShadow: '0 5px 16px rgba(15,28,46,0.10)' }}
    >
      {logo ? (
        <img src={logo} alt={brand(schoolKey).full} loading="lazy" style={{ height: 28, width: 28, objectFit: 'contain' }} />
      ) : (
        <span style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 12, color: TU.navy }}>{schoolKey.toUpperCase()}</span>
      )}
    </span>
  );
}

function FounderCard({ m, delay, onOpen }: { m: Member; delay: number; onOpen: () => void }) {
  const href = linkedInFor(m);
  return (
    <Reveal delay={delay} className="flex flex-col">
      {/* Portrait → LinkedIn */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${m.name} on LinkedIn`}
        className="group relative block w-full overflow-hidden"
        style={{ aspectRatio: '1 / 1', borderRadius: '50%', border: `1px solid ${TU.divider}` }}
      >
        {m.photo ? (
          <img
            src={m.photo}
            alt={`${m.name}, ${m.role} at TransferringUP`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            style={{ objectPosition: m.objectPosition ?? 'center top' }}
          />
        ) : (
          <PortraitPlaceholder name={m.name} ratio="1 / 1" rounded={8} />
        )}
        <LinkedInOverlay />
      </a>

      {/* Name + LinkedIn icon */}
      <div className="flex items-center justify-between" style={{ gap: 12, marginTop: 20 }}>
        <h3 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 25, color: TU.navy, lineHeight: 1.1 }}>
          {m.name}
        </h3>
        <SocialIcon href={href} label={`${m.name} on LinkedIn`} />
      </div>
      <div style={roleStyle}>{m.role}</div>

      {/* Credential, GPA → brand-colored acceptances */}
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${TU.divider}` }}>
        <div style={credLabelStyle}>
          {m.fromGpa ? (
            <>From a <span style={{ fontWeight: 700, color: TU.navy, opacity: 1 }}>{m.fromGpa} GPA</span>, in one year, accepted to</>
          ) : (
            'Accepted to'
          )}
        </div>
        <div className="flex flex-wrap items-center" style={{ gap: 10, marginTop: 14 }}>
          {(m.cardSchools ?? []).map((key) => (
            <Crest key={key} schoolKey={key} />
          ))}
        </div>
        {m.helpedInto && m.helpedInto.length > 0 && (
          <>
            <div style={{ ...credLabelStyle, marginTop: 16 }}>Helped students into</div>
            <div className="flex flex-wrap items-center" style={{ gap: 10, marginTop: 14 }}>
              {m.helpedInto.map((key) => (
                <Crest key={key} schoolKey={key} />
              ))}
            </div>
          </>
        )}
      </div>

      <ReadMore onClick={onOpen} label="Read full story" style={{ marginTop: 16 }} />
    </Reveal>
  );
}

/* ---------------------------- Consultant card --------------------------- */

function ConsultantCard({ m, delay, onOpen }: { m: Member; delay: number; onOpen: () => void }) {
  const b = brand(m.schoolKey);
  const href = linkedInFor(m);
  return (
    <Reveal delay={delay} className="flex flex-col">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${m.name} on LinkedIn`}
        className="group relative block w-full overflow-hidden"
        style={{ aspectRatio: '1 / 1', borderRadius: '50%', border: `1px solid ${TU.divider}` }}
      >
        {m.photo ? (
          <img
            src={m.photo}
            alt={`${m.name}, ${m.role} at TransferringUP`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            style={{ objectPosition: m.objectPosition ?? 'center top' }}
          />
        ) : (
          <PortraitPlaceholder name={m.name} ratio="1 / 1" rounded={8} />
        )}
        <LinkedInOverlay />
      </a>

      <div className="flex items-center justify-between" style={{ gap: 8, marginTop: 16 }}>
        <h3 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 19, color: TU.navy, lineHeight: 1.12 }}>
          {m.name}
        </h3>
        <SocialIcon href={href} label={`${m.name} on LinkedIn`} small />
      </div>
      {m.role && <div style={{ ...roleStyle, fontSize: 10, marginTop: 5 }}>{m.role}</div>}
      <div
        style={{
          fontFamily: '"Fraunces", serif',
          fontWeight: 600,
          fontSize: 14.5,
          color: b.color,
          marginTop: m.role ? 7 : 8,
          lineHeight: 1.25,
        }}
      >
        {m.schoolLabel ?? b.full}
      </div>
      <ReadMore onClick={onOpen} label="View profile" style={{ marginTop: 12 }} small />
    </Reveal>
  );
}

/* ------------------------------- Pieces --------------------------------- */

const roleStyle = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: TU.crimson,
  marginTop: 6,
};

const credLabelStyle = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.03em',
  color: TU.navy,
  opacity: 0.55,
};

function SocialIcon({ href, label, small = false }: { href: string; label: string; small?: boolean }) {
  const s = small ? 30 : 36;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex items-center justify-center shrink-0 transition-colors duration-200"
      style={{ width: s, height: s, borderRadius: 4, border: `1px solid ${TU.divider}`, color: TU.navy }}
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={(e) => { e.currentTarget.style.background = TU.navy; e.currentTarget.style.color = '#fff'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = TU.navy; }}
    >
      <Linkedin size={small ? 15 : 17} />
    </a>
  );
}

function ReadMore({ onClick, label, style, small = false }: { onClick: () => void; label: string; style?: React.CSSProperties; small?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center self-start"
      style={{
        gap: 5,
        fontFamily: 'Inter, sans-serif',
        fontSize: small ? 12 : 13,
        fontWeight: 500,
        color: TU.crimson,
        cursor: 'pointer',
        ...style,
      }}
    >
      <span style={{ borderBottom: '1px solid transparent', transition: 'border-color 0.2s' }} className="group-hover:border-current">
        {label}
      </span>
      <ChevronRight size={small ? 13 : 14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
    </button>
  );
}

/* ------------------------------- Modal ---------------------------------- */

function Chip({ children, tone }: { children: React.ReactNode; tone: 'crimson' | 'gold' | 'navy' }) {
  const tones = {
    crimson: { bg: 'rgba(122,0,0,0.07)', bd: 'rgba(122,0,0,0.22)', fg: TU.crimson },
    gold: { bg: 'rgba(212,170,0,0.12)', bd: 'rgba(212,170,0,0.4)', fg: '#7a6200' },
    navy: { bg: 'rgba(15,28,46,0.05)', bd: 'rgba(15,28,46,0.14)', fg: TU.navy },
  }[tone];
  return (
    <span
      style={{
        background: tones.bg,
        border: `1px solid ${tones.bd}`,
        color: tones.fg,
        borderRadius: 999,
        padding: '5px 11px',
        fontFamily: 'Inter, sans-serif',
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

function GroupHeading({ icon: Icon, children }: { icon: typeof Award; children: React.ReactNode }) {
  return (
    <div className="flex items-center" style={{ gap: 7, marginBottom: 9 }}>
      <Icon size={14} style={{ color: TU.crimson }} />
      <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: TU.navy }}>
        {children}
      </h4>
    </div>
  );
}

function MemberModal({ m, onClose }: { m: Member; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onEsc);
    };
  }, [onClose]);

  const b = brand(m.schoolKey);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ padding: 16 }} onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(8,15,24,0.62)', backdropFilter: 'blur(4px)' }} />
      <div
        className="relative w-full overflow-y-auto"
        style={{ maxWidth: 560, maxHeight: '86vh', background: '#FFFFFF', borderRadius: 12, boxShadow: '0 40px 100px rgba(8,15,24,0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute flex items-center justify-center transition-colors"
          style={{ top: 16, right: 16, width: 34, height: 34, borderRadius: 999, background: 'rgba(15,28,46,0.06)', color: TU.navy, zIndex: 2 }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(15,28,46,0.12)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(15,28,46,0.06)')}
        >
          <X size={17} />
        </button>

        <div style={{ padding: 'clamp(24px, 4vw, 36px)' }}>
          {/* Header */}
          <div className="flex items-center" style={{ gap: 16 }}>
            {m.photo ? (
              <img
                src={m.photo}
                alt={`${m.name}, ${m.role} at TransferringUP`}
                style={{ width: 78, height: 78, borderRadius: 999, objectFit: 'cover', objectPosition: m.objectPosition ?? 'center top', border: `2px solid ${TU.divider}`, flexShrink: 0 }}
              />
            ) : (
              <div style={{ width: 78, height: 78, flexShrink: 0 }}>
                <PortraitPlaceholder name={m.name} ratio="1 / 1" rounded={999} />
              </div>
            )}
            <div>
              <h3 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 24, color: TU.navy, lineHeight: 1.08 }}>{m.name}</h3>
              {m.role && <div style={{ ...roleStyle, marginTop: 5 }}>{m.role}</div>}
              <div style={{ fontFamily: '"Fraunces", serif', fontWeight: 600, fontSize: 15, color: b.color, marginTop: 6 }}>
                {m.schoolLabel ?? b.full}
                {m.classYear && <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 400, color: TU.navy, opacity: 0.5 }}> · {m.classYear}</span>}
              </div>
            </div>
          </div>

          {/* Story */}
          <div style={{ marginTop: 24 }}>
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: TU.navy, marginBottom: 10 }}>
              {m.pronoun} Story
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[m.story, ...m.transferDetails.split('\n\n')].map((p, i) => (
                <p key={i} style={{ fontFamily: 'Inter, sans-serif', fontSize: 14.5, lineHeight: 1.6, color: TU.navy, opacity: 0.82 }}>
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Acceptances */}
          {m.transferAcceptances && m.transferAcceptances.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <GroupHeading icon={Award}>Transfer Acceptances</GroupHeading>
              <div className="flex flex-wrap" style={{ gap: 7 }}>
                {m.transferAcceptances.map((s) => (
                  <Chip key={s} tone="crimson">{s}</Chip>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          {m.stats && (
            <div style={{ marginTop: 22 }}>
              <GroupHeading icon={TrendingUp}>The Numbers</GroupHeading>
              <div className="flex flex-wrap" style={{ gap: 7 }}>
                <Chip tone="gold">HS GPA: {m.stats.highSchoolGPA}</Chip>
                {m.stats.collegeGPA && <Chip tone="gold">College GPA: {m.stats.collegeGPA}</Chip>}
                <Chip tone="gold">From: {m.stats.from}</Chip>
              </div>
            </div>
          )}

          {/* Specialties */}
          <div style={{ marginTop: 22 }}>
            <GroupHeading icon={Target}>Specialties</GroupHeading>
            <div className="flex flex-wrap" style={{ gap: 7 }}>
              {m.specialties.map((s) => (
                <Chip key={s} tone="navy">{s}</Chip>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div style={{ marginTop: 22 }}>
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: TU.navy, marginBottom: 10 }}>
              Key Achievements
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {m.achievements.map((a) => (
                <li key={a} className="flex" style={{ gap: 9 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: TU.crimson, flexShrink: 0, marginTop: 7 }} />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, lineHeight: 1.5, color: TU.navy, opacity: 0.82 }}>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          {(m.email || m.linkedin) && (
            <div className="flex flex-wrap items-center" style={{ gap: 18, marginTop: 26, paddingTop: 20, borderTop: `1px solid ${TU.divider}` }}>
              {m.email && (
                <a href={`mailto:${m.email}`} className="inline-flex items-center transition-opacity" style={{ gap: 7, fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: TU.navy, opacity: 0.7 }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}>
                  <Mail size={15} /> {m.email}
                </a>
              )}
              {m.linkedin && (
                <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center transition-opacity" style={{ gap: 7, fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: TU.navy, opacity: 0.7 }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}>
                  <Linkedin size={15} /> LinkedIn
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Section --------------------------------- */

export default function Team() {
  const [selected, setSelected] = useState<Member | null>(null);

  return (
    <section id="team" style={{ background: TU.offwhite, padding: 'clamp(72px, 12vw, 128px) clamp(24px, 6vw, 80px)' }}>
      <div className="mx-auto" style={{ maxWidth: 1140 }}>
        <Reveal className="text-center" style={{ marginBottom: 'clamp(44px, 6vw, 64px)' }}>
          <Eyebrow label="The Team" />
          <h2
            style={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 700,
              fontSize: 'clamp(40px, 5vw, 60px)',
              color: TU.navy,
              letterSpacing: '-0.02em',
              lineHeight: 1.04,
              marginTop: 18,
            }}
          >
            Coached by People Who Did It Themselves.
          </h2>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(16px, 1.6vw, 18px)',
              lineHeight: 1.6,
              color: TU.navy,
              opacity: 0.62,
              maxWidth: 620,
              margin: '18px auto 0',
            }}
          >
            Led by transfer students who walked the exact path our clients are on, backed by specialists who know the system from the inside.
          </p>
        </Reveal>

        {/* Featured */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 items-start" style={{ maxWidth: 1120, margin: '0 auto' }}>
          {FOUNDERS.map((m, i) => (
            <FounderCard key={m.name} m={m} delay={i * 90} onOpen={() => setSelected(m)} />
          ))}
        </div>

        {/* Divider */}
        <Reveal className="flex items-center" style={{ gap: 16, margin: 'clamp(56px, 8vw, 88px) auto clamp(36px, 5vw, 52px)', maxWidth: 1040 }}>
          <span style={{ flex: 1, height: 1, background: TU.divider }} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: TU.navy, opacity: 0.5 }}>
            Consultants &amp; Specialists
          </span>
          <span style={{ flex: 1, height: 1, background: TU.divider }} />
        </Reveal>

        {/* Consultants */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10" style={{ maxWidth: 960, margin: '0 auto' }}>
          {CONSULTANTS.map((m, i) => (
            <ConsultantCard key={m.name} m={m} delay={(i % 3) * 70} onOpen={() => setSelected(m)} />
          ))}
        </div>
      </div>

      {selected && <MemberModal m={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
