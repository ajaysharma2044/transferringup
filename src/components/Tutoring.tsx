import { useState } from 'react';
import { Calculator, Target, TrendingUp, Award, ChevronDown, ChevronUp, BookOpen, User, Mail, ExternalLink } from 'lucide-react';

const Tutoring = () => {
  const [expandedStories, setExpandedStories] = useState<{ [key: number]: boolean }>({});
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  const toggleStory = (index: number) => {
    setExpandedStories(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const tutors = [
    {
      name: "Akshay Patel",
      role: "SAT Math Tutor",
      subRole: "Test Prep Specialist",
      image: "/akshayphoto.JPG",
      school: "Cornell University",
      classYear: "Class of 2027",
      email: "akshay@transferringup.com",
      story: "Hi, I'm Akshay! I'm a sophomore at Cornell University, originally from Palo Alto, California. I'm passionate about Computer Science, AI, and the startup world, and I bring that same problem-solving mindset to tutoring. Outside academics, I enjoy playing chess, strategy games, basketball, and pickleball.",
      tutoringDetails: `My approach to SAT tutoring is rooted in strategic thinking and problem-solving techniques I've developed through my Computer Science studies and passion for strategy games. Having scored 1510 on the SAT with a 790 in Math, I understand what it takes to excel on this test.

I believe that SAT success comes from understanding patterns, developing efficient problem-solving strategies, and building confidence through practice. My tutoring style focuses on breaking down complex problems into manageable steps, teaching students to recognize question types quickly, and developing time management skills that are crucial for test day success.

Coming from the competitive academic environment of Palo Alto and now thriving at Cornell, I know firsthand the pressure students face. I work to create a supportive learning environment where students can build both their skills and confidence. Whether you're struggling with algebra concepts or aiming to perfect your approach to advanced math topics, I'm here to help you reach your SAT goals.`,
      testScores: ["SAT: 1510", "SAT Math: 790"],
      stats: {
        satScore: "1510",
        mathScore: "790",
        school: "Cornell University",
        major: "Computer Science"
      },
      background: [
        "Palo Alto, California",
        "Computer Science & AI Enthusiast",
        "Chess & Strategy Games",
        "Basketball & Pickleball Player"
      ],
      specialties: ["SAT Math Tutoring", "Problem-Solving Strategies", "Test Prep", "Time Management", "Confidence Building"],
      achievements: [
        "SAT Score: 1510 (790 Math)",
        "Cornell University Sophomore",
        "Computer Science Major",
        "Strategic Thinking Expert"
      ]
    }
  ];

  return (
    <section id="tutoring" className="py-10 sm:py-16 md:py-24 bg-[#F5EDD9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-[#8B1A1A]/10 border border-[#8B1A1A]/30 rounded-full text-[#8B1A1A] text-sm font-medium mb-6">
            <Calculator className="h-4 w-4 mr-2 text-[#8B1A1A]" />
            Expert Test Prep • Proven Results
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            SAT <span className="text-[#8B1A1A]">Tutoring</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get personalized SAT Math tutoring from a Cornell student who scored 790 on the Math section.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#0F1C2E]/10">
              <Target className="h-8 w-8 text-[#8B1A1A] mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Targeted Strategies</h3>
              <p className="text-gray-600 text-sm">Learn proven techniques to tackle every SAT Math question type efficiently</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#0F1C2E]/10">
              <TrendingUp className="h-8 w-8 text-[#8B1A1A] mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Score Improvement</h3>
              <p className="text-gray-600 text-sm">Systematic approach to boost your math score with personalized practice</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#0F1C2E]/10">
              <BookOpen className="h-8 w-8 text-[#8B1A1A] mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Confidence Building</h3>
              <p className="text-gray-600 text-sm">Develop test-taking confidence through strategic practice and support</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {tutors.map((tutor, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="flex items-start space-x-6 mb-8">
                <div className="relative flex-shrink-0">
                  {imageErrors[index] ? (
                    <div className="w-24 h-24 rounded-full bg-[#8B1A1A] flex items-center justify-center border-2 border-[#8B1A1A]/30">
                      <User className="w-12 h-12 text-white" />
                    </div>
                  ) : (
                    <img
                      src={tutor.image}
                      alt={tutor.name}
                      className="w-24 h-24 rounded-full object-cover border-2 border-[#8B1A1A]/30"
                      onError={() => handleImageError(index)}
                    />
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-[#8B1A1A] rounded-full p-2">
                    <Calculator className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{tutor.name}</h3>
                  <p className="text-[#8B1A1A] font-semibold mb-1 text-lg">{tutor.role}</p>
                  <p className="text-[#8B1A1A]/70 font-medium mb-3">{tutor.subRole}</p>
                  <p className="text-gray-700 font-medium text-lg">{tutor.school}</p>
                  <p className="text-gray-500">{tutor.classYear}</p>
                </div>
              </div>

              <div className="bg-[#8B1A1A]/5 rounded-xl p-6 mb-8 border border-[#8B1A1A]/20">
                <h4 className="font-bold text-gray-900 mb-4 text-center text-xl">Test Scores</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#8B1A1A] mb-1">1510</div>
                    <div className="text-gray-600 font-medium">Total SAT Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0F1C2E] mb-1">790</div>
                    <div className="text-gray-600 font-medium">Math Section</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <button
                  onClick={() => toggleStory(index)}
                  className="flex items-center justify-between w-full text-left group"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-[#8B1A1A] rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-lg">
                      About Akshay & His Tutoring Approach
                    </h4>
                  </div>
                  <div className="text-gray-400 group-hover:text-[#8B1A1A] transition-colors">
                    {expandedStories[index] ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </button>

                {expandedStories[index] && (
                  <div className="mt-4 space-y-4 text-gray-700 leading-relaxed animate-in slide-in-from-top-2 duration-300">
                    <p>{tutor.story}</p>
                    {tutor.tutoringDetails.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-4 h-4 bg-[#0F1C2E] rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <h4 className="font-semibold text-gray-900">Background</h4>
                </div>
                <ul className="space-y-2">
                  {tutor.background.map((item, idx) => (
                    <li key={idx} className="text-gray-700 flex items-center">
                      <div className="w-1.5 h-1.5 bg-[#0F1C2E]/60 rounded-full mr-3 flex-shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Target className="h-4 w-4 text-[#0F1C2E]" />
                  <h4 className="font-semibold text-gray-900">Tutoring Specialties</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tutor.specialties.map((specialty, idx) => (
                    <span key={idx} className="bg-[#0F1C2E]/10 text-[#0F1C2E] px-3 py-1 rounded-full text-sm font-medium">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Award className="h-4 w-4 text-yellow-600" />
                  <h4 className="font-semibold text-gray-900">Achievements</h4>
                </div>
                <ul className="space-y-2">
                  {tutor.achievements.map((achievement, idx) => (
                    <li key={idx} className="text-gray-700 flex items-center">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-3 flex-shrink-0"></div>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{tutor.email}</span>
                </div>
                <div className="flex space-x-3">
                  <a
                    href={`mailto:${tutor.email}?subject=SAT Math Tutoring Inquiry&body=Hi Akshay,%0A%0AI'm interested in SAT Math tutoring. Here are my details:%0A%0AName:%20%0ACurrent SAT Math Score (if taken):%20%0ATarget Score:%20%0APreferred Schedule:%20%0A%0APlease let me know your availability and rates.%0A%0AThanks!`}
                    className="bg-[#8B1A1A] text-[#F5EDD9] px-6 py-2 rounded-md hover:bg-[#7A1717] transition-colors flex items-center space-x-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Contact for Tutoring</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-[#0F1C2E] rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Meet Our SAT Math Tutor
          </h3>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
            Akshay is now part of our Extended Team. Learn more about his tutoring approach and contact him directly.
          </p>
          <a
            href="#team"
            className="inline-flex items-center space-x-2 bg-[#F5EDD9] text-[#0F1C2E] px-8 py-4 rounded-md hover:bg-gray-100 transition-colors font-bold text-lg shadow-lg"
          >
            <Calculator className="h-5 w-5" />
            <span>View Extended Team</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Tutoring;
