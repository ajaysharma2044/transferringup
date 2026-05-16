import { useState, useEffect } from 'react';
import { X, Award, Target, TrendingUp, Mail, Sparkles, User, ChevronRight, GraduationCap } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  subRole?: string;
  school: string;
  schoolLogo: string;
  classYear: string;
  image: string;
  email?: string;
  pronoun: 'His' | 'Her';
  story: string;
  transferDetails: string;
  transferAcceptances?: string[];
  specialties: string[];
  achievements: string[];
  stats?: {
    highSchoolGPA: string;
    collegeGPA: string;
    from: string;
  };
}

const universityLogos: Record<string, string> = {
  'Cornell University': 'https://a.espncdn.com/i/teamlogos/ncaa/500/172.png',
  'University of Notre Dame': 'https://a.espncdn.com/i/teamlogos/ncaa/500/87.png',
  'University of Southern California': 'https://a.espncdn.com/i/teamlogos/ncaa/500/30.png',
  'Vanderbilt University': 'https://a.espncdn.com/i/teamlogos/ncaa/500/238.png',
};

const allMembers: TeamMember[] = [
  {
    name: "Ajay Sharma",
    role: "CEO & Co-Founder",
    subRole: "Transfer Strategist",
    image: "/ajay head11111.jpeg",
    school: "Cornell University",
    schoolLogo: universityLogos['Cornell University'],
    classYear: "Class of 2028",
    email: "as4489@cornell.edu",
    pronoun: "His",
    story: "Since I was 8, I dreamed of going to an Ivy. Then COVID hit, and everything collapsed. Freshman year, I had a 1.25 GPA, ranked 399 of 411, failed most classes, and stopped caring.",
    transferDetails: `Sophomore year, I went to India and saw my mom's family surviving on less than a dollar a day. That snapped me out of it. I came back and started grinding. By senior year my GPA was still a 2.7, and I got rejected from schools with 87% acceptance rates.

From April to August, I obsessed over the transfer process. I studied old applications, forums, and built a blueprint. I took summer classes at community college and pulled a 4.0. At UNCG, I built high-impact extracurriculars. By the end of freshman year, I had multiple top school acceptances and finally got into Cornell.

Now I help other underdogs do what I did. I specialize in turning low GPAs into strong narratives, building extracurriculars fast, and making schools take a second look.`,
    transferAcceptances: ["Cornell", "Vanderbilt", "Michigan", "USC", "NYU", "Boston University", "University of Miami", "Lehigh", "Villanova"],
    specialties: ["Extracurricular Strategy", "Narrative Building", "Essay Writing", "Recommendation Letter Support"],
    achievements: [
      "Senate Internship",
      "Hurricane Helene Meal Swipe Donation Program",
      "Helped Multiple UNCG Students Transfer Out",
    ],
    stats: {
      highSchoolGPA: "2.9",
      collegeGPA: "3.91",
      from: "UNC Greensboro (Top 300)"
    }
  },
  {
    name: "Bryan Liu",
    role: "COO & Co-Founder",
    subRole: "Transfer Strategist",
    image: "/pink.jpg",
    school: "University of Notre Dame",
    schoolLogo: universityLogos['University of Notre Dame'],
    classYear: "Class of 2027",
    email: "bryankliu@gmail.com",
    pronoun: "His",
    story: "I moved to the U.S. at twelve, had to learn English, and had no one to guide me through the college process. Watching my friends receive admissions support while I had none made me feel defeated.",
    transferDetails: "I began researching how to stand out in admissions on my own. Eventually I was accepted into Boston University, but the limited academic support in economics and real estate led me to transfer to Notre Dame. Having navigated the transfer process independently, I understand how hard it is to find trustworthy information. That's why I help students from all backgrounds pursue transfer admissions to their dream schools.",
    transferAcceptances: ["Notre Dame", "NYU", "Boston College", "Georgetown"],
    stats: {
      highSchoolGPA: "3.9",
      collegeGPA: "3.78",
      from: "Boston University (T40)"
    },
    specialties: ["Major & Class Selection", "Competition Opportunities", "Consulting & IB Career Paths"],
    achievements: [
      "Vice President of Bridge BU",
      "Dean's List at BU",
      "Published Research",
    ]
  },
  {
    name: "Ryan Gary",
    role: "CMO & Co-Founder",
    image: "/RYANGARY.jpg",
    school: "University of Southern California",
    schoolLogo: universityLogos['University of Southern California'],
    classYear: "Class of 2028",
    email: "rcgary@usc.edu",
    pronoun: "His",
    story: "In high school, academics weren't my strength. I graduated with a 3.39 GPA and was far more focused on sports than schoolwork. I ended up attending a safety school, but I never let go of my dream of being at a top university.",
    transferDetails: "In college, I focused heavily on extracurriculars. I became Director of Outreach for SPAid, a 501(c)(3) nonprofit, and launched a chapter at my university growing it to hundreds of members. I secured research under a former Harvard researcher and committed to community volunteering. After months of persistence, I was accepted to USC. Now I help others strengthen their profiles and learn how to market themselves to admissions committees.",
    transferAcceptances: ["USC"],
    stats: {
      highSchoolGPA: "3.39",
      collegeGPA: "3.67",
      from: "Auburn (Regional)"
    },
    specialties: ["Resume Building", "Personal Branding", "Nonprofit Leadership", "Research Opportunities"],
    achievements: [
      "Director of Outreach for SPAid",
      "Founded University Chapter (Hundreds of Members)",
      "Research Under Former Harvard Researcher",
    ]
  },
  {
    name: "Sahil Raut",
    role: "Senior Writing Consultant",
    school: "Cornell University",
    schoolLogo: universityLogos['Cornell University'],
    classYear: "Class of 2027",
    image: "/sahil.png",
    email: "ssr247@cornell.edu",
    pronoun: "His",
    story: "I had dreams of attending a T20 but was unmotivated to put in the work. My wake-up call arrived too late, and by the time applications rolled around, I was scrambling. A slew of rejections followed.",
    transferDetails: `My unsuccessful first-year attempt gave me direction. I meticulously researched the transfer process over two years at Bentley, finding my passion and carving a niche on campus. On March 30, 2023, I was rejected by Cornell. On April 22, 2025, I was accepted.

I now pay it forward. The transfer process is quite different from the first-year cycle, and I help students weave their weaker past into a stronger narrative -- giving admissions context, not flaws.`,
    transferAcceptances: ["Cornell", "Northwestern", "USC", "UNC Chapel Hill", "Emory", "University of Richmond", "University of Rochester"],
    specialties: ["Narrative Building", "Essay Writing", "Recommendation Letter Support", "Major Selection"],
    achievements: ["Wealth Management/Finance Internships", "Editor in Chief of Newspaper", "Student Research"],
    stats: {
      highSchoolGPA: "3.85",
      collegeGPA: "3.98",
      from: "Bentley University"
    }
  },
  {
    name: "Mike Liang",
    role: "Academic Discipline & Essay Consultant",
    school: "Cornell University",
    schoolLogo: universityLogos['Cornell University'],
    classYear: "Class of 2028",
    image: "/mike-liang.jpg",
    pronoun: "His",
    story: "As a sophomore at Cornell majoring in Public Policy, I bring a unique perspective to transfer admissions -- particularly for students navigating academic disciplinary records.",
    transferDetails: "I specialize in helping students who have faced academic discipline turn their experiences into compelling narratives. Whether it's a suspension, academic integrity violation, or other setback, I help students address these challenges head-on in their applications while demonstrating growth and resilience.",
    specialties: ["Academic Disciplinary Cases", "Essay Writing", "SAT Reading (800 Score)", "Narrative Building"],
    achievements: [
      "SAT Reading Score: 800",
      "Cornell University Sophomore",
      "Public Policy Major",
    ]
  },
  {
    name: "Kaveen Shah",
    role: "Essay Review & Pre-Law Consultant",
    school: "Cornell University",
    schoolLogo: universityLogos['Cornell University'],
    classYear: "Class of 2027",
    image: "/kaveen-shah.jpg",
    pronoun: "His",
    story: "I transferred from Texas A&M to Cornell's ILR School, one of the most competitive transfer programs in the country. My experience navigating the transfer process while pursuing a pre-law path gives me unique insight into what admissions committees value.",
    transferDetails: "I specialize in essay review and editing, helping students sharpen their narratives and present the strongest possible version of their story. I also guide students interested in pre-law applications, drawing from my own experience in Labor and Industrial Relations at Cornell.",
    transferAcceptances: ["Cornell ILR"],
    specialties: ["Essay Review & Editing", "Pre-Law Applications", "Transfer Narrative Strategy"],
    achievements: [
      "Transfer to Cornell ILR from Texas A&M",
      "Labor & Industrial Relations Major",
      "Political Science Background",
    ]
  },
  {
    name: "Abigail So",
    role: "Essay Editor",
    school: "Cornell University",
    schoolLogo: universityLogos['Cornell University'],
    classYear: "Class of 2026",
    image: "/abigail-so.jpg",
    pronoun: "Her",
    story: "As a senior at Cornell studying Government and Classics, I've developed strong analytical writing skills that I bring to essay editing for transfer applicants.",
    transferDetails: "I focus on refining transfer essays to be clear, compelling, and authentic. My background in government and classics gives me an eye for persuasive argumentation and narrative structure -- skills that translate directly to crafting standout admissions essays.",
    specialties: ["Essay Editing", "Narrative Refinement", "Persuasive Writing"],
    achievements: [
      "Cornell University Senior",
      "Government & Classics Double Major",
    ]
  },
  {
    name: "Akshay Joshi",
    role: "SAT Math Tutor",
    school: "Cornell University",
    schoolLogo: universityLogos['Cornell University'],
    classYear: "Class of 2028",
    image: "/akshayphoto.JPG",
    pronoun: "His",
    story: "I scored 1510 on the SAT with a 790 in Math. My approach is rooted in strategic thinking and problem-solving techniques from my Computer Science studies.",
    transferDetails: "SAT success comes from understanding patterns, developing efficient strategies, and building confidence through practice. I focus on breaking down complex problems into manageable steps, teaching students to recognize question types quickly, and developing time management skills crucial for test day.",
    specialties: ["SAT Math Tutoring", "Problem-Solving Strategies", "Test Prep", "Time Management"],
    achievements: [
      "SAT Score: 1510 (790 Math)",
      "Cornell University Sophomore",
      "Computer Science Major",
    ]
  },
  {
    name: "Ryan Oh",
    role: "Finance & IB Consultant",
    school: "Vanderbilt University",
    schoolLogo: universityLogos['Vanderbilt University'],
    classYear: "Class of 2027",
    image: "/1752665688145.jpeg",
    pronoun: "His",
    story: "My path to Vanderbilt wasn't traditional, but it led me to discover my passion for finance and investment banking. I've built extensive experience in equity research, financial modeling, and market analysis.",
    transferDetails: "I help students build compelling finance-oriented profiles, develop technical skills, and create leadership experiences that stand out to admissions committees. Having navigated the transfer process and now thriving in Vanderbilt's competitive finance environment, I understand what admissions committees look for in transfer students pursuing business and finance programs.",
    specialties: ["Finance & IB Guidance", "Leadership Development", "Business Program Applications", "Internship Strategy"],
    achievements: [
      "Co-Founder & President of Global Delta Securities",
      "Chapter President - Wall Street Prep Young Leaders in Finance",
      "IB Intern at KCC Capital Partners",
      "GPA: 3.97 at Vanderbilt University",
    ]
  }
];

function MemberModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#0F1C2E]/5 hover:bg-[#0F1C2E]/10 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-[#0F1C2E]" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={member.image}
              alt={member.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#8B1A1A]/20"
              style={member.name === "Sahil Raut" ? { objectPosition: 'center 20%' } : {}}
            />
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0F1C2E]">{member.name}</h3>
              <p className="text-[#8B1A1A] font-semibold text-sm sm:text-base">{member.role}</p>
              {member.subRole && (
                <p className="text-[#8B1A1A]/70 text-xs sm:text-sm">{member.subRole}</p>
              )}
              <div className="flex items-center gap-1.5 mt-1">
                <img src={member.schoolLogo} alt={member.school} className="w-5 h-5 object-contain" />
                <span className="text-sm text-[#3D3D4E]">{member.school}</span>
                <span className="text-xs text-[#3D3D4E]/60 ml-1">{member.classYear}</span>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-semibold text-[#0F1C2E] mb-2">{member.pronoun} Story</h4>
              <div className="space-y-2 text-sm text-[#3D3D4E] leading-relaxed">
                <p>{member.story}</p>
                {member.transferDetails.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {member.transferAcceptances && member.transferAcceptances.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Award className="h-3.5 w-3.5 text-[#8B1A1A]" />
                  <h4 className="text-sm font-semibold text-[#0F1C2E]">Transfer Acceptances</h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {member.transferAcceptances.map((school, idx) => (
                    <span key={idx} className="bg-[#8B1A1A]/8 text-[#8B1A1A] px-2.5 py-1 rounded-full text-xs font-medium border border-[#8B1A1A]/20">
                      {school}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {member.stats && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp className="h-3.5 w-3.5 text-[#8B1A1A]" />
                  <h4 className="text-sm font-semibold text-[#0F1C2E]">Stats</h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="bg-gold-100 text-[#0F1C2E] px-2.5 py-1 rounded-full text-xs font-medium border border-gold-300">
                    HS GPA: {member.stats.highSchoolGPA}
                  </span>
                  <span className="bg-gold-100 text-[#0F1C2E] px-2.5 py-1 rounded-full text-xs font-medium border border-gold-300">
                    College GPA: {member.stats.collegeGPA}
                  </span>
                  <span className="bg-gold-100 text-[#0F1C2E] px-2.5 py-1 rounded-full text-xs font-medium border border-gold-300">
                    {member.stats.from}
                  </span>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Target className="h-3.5 w-3.5 text-[#0F1C2E]" />
                <h4 className="text-sm font-semibold text-[#0F1C2E]">Specialties</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {member.specialties.map((specialty, idx) => (
                  <span key={idx} className="bg-[#0F1C2E]/6 text-[#0F1C2E] px-2.5 py-1 rounded-full text-xs font-medium border border-[#0F1C2E]/12">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#0F1C2E] mb-2">Key Achievements</h4>
              <ul className="space-y-1.5">
                {member.achievements.map((achievement, idx) => (
                  <li key={idx} className="text-sm text-[#3D3D4E] flex items-start">
                    <div className="w-1.5 h-1.5 bg-[#8B1A1A]/40 rounded-full mr-2 flex-shrink-0 mt-1.5"></div>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>

            {member.email && (
              <div className="pt-4 border-t border-[#0F1C2E]/8">
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-2 text-sm text-[#3D3D4E] hover:text-[#8B1A1A] transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {member.email}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FounderCard({ member, onSelect, featured }: {
  member: TeamMember;
  onSelect: () => void;
  featured?: boolean;
}) {
  const [imgErr, setImgErr] = useState(false);
  const imgSize = featured ? 'w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44' : 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32';
  const ringSize = featured
    ? 'ring-4 ring-[#8B1A1A]/30 ring-offset-4 ring-offset-[#F5EDD9]'
    : 'ring-[3px] ring-[#0F1C2E]/15 ring-offset-[3px] ring-offset-[#F5EDD9]';

  return (
    <button
      onClick={onSelect}
      className="group cursor-pointer flex flex-col items-center text-center"
    >
      <div className={`relative ${imgSize} rounded-full overflow-hidden ${ringSize} transition-all duration-500 group-hover:ring-[#8B1A1A]/50 group-hover:scale-105`}>
        {imgErr ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0F1C2E]">
            <User className={`${featured ? 'w-16 h-16' : 'w-10 h-10'} text-white/40`} />
          </div>
        ) : (
          <img
            src={member.image}
            alt={member.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            style={member.name === "Sahil Raut" ? { objectPosition: 'center 20%' } : {}}
            onError={() => setImgErr(true)}
          />
        )}
      </div>
      <div className={`mt-4 ${featured ? 'mt-5' : ''}`}>
        <h3 className={`font-bold text-[#0F1C2E] leading-tight group-hover:text-[#8B1A1A] transition-colors ${featured ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}>
          {member.name}
        </h3>
        <p className={`text-[#8B1A1A] font-semibold mt-1 ${featured ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>{member.role}</p>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <img src={member.schoolLogo} alt={member.school} className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
          <span className="text-[#3D3D4E] text-xs sm:text-sm">{member.school}</span>
        </div>
        {member.stats && (
          <div className="mt-2">
            <span className="text-[#3D3D4E]/60 text-xs">GPA: <span className="text-[#0F1C2E] font-semibold">{member.stats.highSchoolGPA}</span> <span className="text-[#3D3D4E]/40">{"→"}</span> <span className="text-emerald-600 font-semibold">{member.stats.collegeGPA}</span></span>
          </div>
        )}
        <div className="flex items-center justify-center gap-1 mt-2.5 text-[#3D3D4E]/40 text-xs group-hover:text-[#8B1A1A] transition-colors">
          <span>Read story</span>
          <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </button>
  );
}

function TeamMemberCard({ member, onSelect, index }: {
  member: TeamMember;
  onSelect: () => void;
  index: number;
}) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <button
      onClick={onSelect}
      className="group cursor-pointer flex flex-col items-center text-center scroll-fade-in"
      style={{ transitionDelay: `${0.06 * index}s` }}
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-[3px] ring-[#0F1C2E]/10 ring-offset-[3px] ring-offset-[#F5EDD9] transition-all duration-500 group-hover:ring-[#8B1A1A]/40 group-hover:scale-105">
        {imgErr ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0F1C2E]">
            <User className="w-8 h-8 text-white/40" />
          </div>
        ) : (
          <img
            src={member.image}
            alt={member.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            style={member.name === "Sahil Raut" ? { objectPosition: 'center 20%' } : {}}
            onError={() => setImgErr(true)}
          />
        )}
      </div>
      <div className="mt-3">
        <h3 className="text-sm sm:text-base font-bold text-[#0F1C2E] leading-tight group-hover:text-[#8B1A1A] transition-colors">
          {member.name}
        </h3>
        <p className="text-xs text-[#8B1A1A] font-medium leading-tight mt-0.5">{member.role}</p>
        <div className="flex items-center justify-center gap-1.5 mt-1.5">
          <img src={member.schoolLogo} alt={member.school} className="w-3.5 h-3.5 object-contain" />
          <span className="text-xs text-[#3D3D4E]">{member.school.replace('University of ', '').replace('University', 'U.')}</span>
        </div>
        <div className="flex items-center justify-center gap-1 mt-2 text-[#3D3D4E]/30 text-[10px] group-hover:text-[#8B1A1A] transition-colors">
          <span>View profile</span>
          <ChevronRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </button>
  );
}

const Team = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const ajay = allMembers[0];
  const coFounders = allMembers.slice(1, 3);
  const consultants = allMembers.slice(3);

  return (
    <section id="team" className="py-10 sm:py-16 md:py-28 bg-[#F5EDD9] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#8B1A1A]/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16 scroll-fade-in">
          <div className="inline-flex items-center px-5 py-2.5 bg-[#8B1A1A]/10 border border-[#8B1A1A]/30 rounded-full text-[#8B1A1A] text-sm font-medium mb-5 badge-shimmer">
            <Sparkles className="h-4 w-4 mr-2 text-[#8B1A1A]" />
            Transfer Students Who Actually Did It
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#0F1C2E] mb-4">
            Meet Your <span className="text-[#8B1A1A]">Transfer</span> Team
          </h2>
          <p className="text-base sm:text-lg text-[#3D3D4E] max-w-2xl mx-auto leading-relaxed">
            Led by transfer students who've walked the path, supported by experts who know the system.
          </p>
        </div>

        <div className="flex flex-col items-center mb-6 sm:mb-10 md:mb-14 scroll-fade-in">
          <FounderCard member={ajay} onSelect={() => setSelectedMember(ajay)} featured />
        </div>

        <div className="flex justify-center gap-8 sm:gap-20 md:gap-28 mb-8 sm:mb-14 md:mb-20 scroll-fade-in">
          <FounderCard member={coFounders[0]} onSelect={() => setSelectedMember(coFounders[0])} />
          <FounderCard member={coFounders[1]} onSelect={() => setSelectedMember(coFounders[1])} />
        </div>

        <div className="mb-8 scroll-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-[#0F1C2E]/10" />
            <div className="flex items-center gap-2 text-[#0F1C2E]/60">
              <GraduationCap className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide uppercase">Consultants & Specialists</span>
            </div>
            <div className="h-px flex-1 bg-[#0F1C2E]/10" />
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
          {consultants.map((member, index) => (
            <TeamMemberCard
              key={member.name}
              member={member}
              onSelect={() => setSelectedMember(member)}
              index={index}
            />
          ))}
        </div>
      </div>

      {selectedMember && (
        <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </section>
  );
};

export default Team;
