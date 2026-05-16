import { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-10 sm:py-16 md:py-24 bg-[#F5EDD9] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-8 sm:mb-14 md:mb-18 scroll-fade-in ${isVisible ? 'visible' : ''}`}>
          <div className="inline-flex items-center px-6 py-3 bg-[#8B1A1A]/10 border border-[#8B1A1A]/30 rounded-full text-[#8B1A1A] text-sm font-medium mb-8 backdrop-blur-sm badge-shimmer uppercase tracking-widest">
            <Sparkles className="h-4 w-4 mr-2 text-[#8B1A1A]" />
            Why TransferringUp
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#0F1C2E] mb-5 tracking-tight">
            Against All Odds.
            <span className="text-[#8B1A1A] block mt-1">Guaranteed Results.</span>
          </h2>

          <p className="text-lg md:text-xl text-[#3D3D4E] max-w-3xl mx-auto leading-relaxed">
            Your high school GPA shaped the hand you were dealt. We play it better than anyone.
          </p>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-10 grid-stagger ${isVisible ? 'visible' : ''}`}>
          <div className="bg-white rounded-2xl border border-[#0F1C2E]/8 overflow-hidden tilt-card">
            <div className="h-1.5 bg-[#8B1A1A]" />
            <div className="px-6 pt-0 md:px-10 md:pt-0">
              <div className="inline-block -mt-px px-5 py-2 bg-[#8B1A1A] text-[#F5EDD9] text-xs font-bold uppercase tracking-widest rounded-b-lg">
                Low High School GPA
              </div>
            </div>
            <div className="p-6 md:px-10 md:pb-10 md:pt-6">
              <h3 className="text-2xl md:text-3xl font-bold text-[#0F1C2E] mb-5">
                The Odds Were Stacked Against Me Too.
              </h3>
              <div className="space-y-4 text-[#3D3D4E] text-sm md:text-base leading-relaxed">
                <p>
                  A 2.9 GPA. Bottom of my class. Rejected from my own safety schools freshman year.
                </p>
                <p>
                  Here is who you are competing against: kids who started Ivy League prep in middle school, had tens of thousands of dollars in private consultants behind them, and built perfect academic profiles over four years. With all of that, they still got rejected or waitlisted. Now they are back as transfer applicants — with every advantage you never had.
                </p>
                <p>
                  You are walking into that same room with a 2.9. That gap is real. And a bad high school GPA is like transferring with a chain around your ankle — other consultants will tell you it does not matter, but that is a lie they tell to take your money.
                </p>
                <p>
                  So here is what I did about it: I gave myself one year. Not two. I found every single lever that was not my GPA and maxed every one of them out. I built extracurriculars from scratch in a timeline most students take years to develop. I engineered a narrative so airtight my transcript became almost irrelevant.
                </p>
                <p>
                  I got into Cornell. NYU. USC. Michigan. Vanderbilt. In one year. With a 2.9. Against kids who had everything I did not.
                </p>
                <p>
                  That forced obsession became the system I use for every student I work with — including you. In one year, we will build you an application that does not just compete with those over-prepared, over-funded applicants. It beats them.
                </p>
              </div>
              <div className="mt-6">
                <span className="inline-block px-4 py-2 bg-[#8B1A1A]/8 border border-[#8B1A1A]/20 rounded-full text-[#8B1A1A] text-sm font-semibold">
                  2.9 GPA &rarr; Cornell, Vanderbilt, Michigan, NYU, USC
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#0F1C2E]/8 overflow-hidden tilt-card">
            <div className="h-1.5 bg-[#8B1A1A]" />
            <div className="px-6 pt-0 md:px-10 md:pt-0">
              <div className="inline-block -mt-px px-5 py-2 bg-[#0F1C2E] text-[#F5EDD9] text-xs font-bold uppercase tracking-widest rounded-b-lg">
                Good High School GPA
              </div>
            </div>
            <div className="p-6 md:px-10 md:pb-10 md:pt-6">
              <h3 className="text-2xl md:text-3xl font-bold text-[#0F1C2E] mb-5">
                You Did Everything Right. The System Failed You.
              </h3>
              <div className="space-y-4 text-[#3D3D4E] text-sm md:text-base leading-relaxed">
                <p>
                  Strong GPA. Solid resume. You walked into freshman applications thinking you'd done everything right. And still got that thin envelope.
                </p>
                <p>
                  Here's the brutal truth nobody tells you: freshman admissions is a lottery. A 6% acceptance rate with ten thousand equally qualified applicants means half of them had your exact profile and got rejected too. That rejection letter says nothing about your ability — and everything about how you were positioned.
                </p>
                <p>
                  That's where we start. I go back through your freshman year application specifically to understand exactly where it broke down — the narrative, the story, the way it was packaged. Most people try to submit a better version of the same application. We don't do that.
                </p>
                <p>
                  The transfer process is a different game with different rules. And I apply the exact same obsessive strategy I use for every client — hyper-specific narrative building, an airtight personal story, extracurriculars and leadership built to signal exactly what your target schools want to see, and rec letters engineered to close the case. The same system that gets my low-GPA students into T30 schools works even harder when the academic foundation is already solid.
                </p>
                <p className="font-medium text-[#0F1C2E]">
                  You didn't lose freshman year because of your grades. You lost because of your story. That's the most fixable problem I know.
                </p>
              </div>
              <div className="mt-6">
                <span className="inline-block px-4 py-2 bg-[#0F1C2E]/8 border border-[#0F1C2E]/20 rounded-full text-[#0F1C2E] text-sm font-semibold">
                  Strong GPA + Right Strategy = T30 Placement, Guaranteed
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`scroll-fade-in ${isVisible ? 'visible' : ''}`}>
          <div className="bg-[#FBF6EC] border-l-4 border-[#8B1A1A] rounded-r-xl p-4 sm:p-6 md:p-10 mb-8 sm:mb-12 md:mb-16">
            <p className="text-[#3D3D4E] text-base md:text-lg leading-relaxed max-w-4xl mx-auto text-center">
              The transfer window is open <span className="font-bold text-[#0F1C2E]">RIGHT NOW.</span> It does not wait. Every month you spend at the wrong school is tuition paid to a degree that doesn't open the doors you want. Whether your GPA held you back or the system failed you — the path forward is the same. One strategy. One team. <span className="font-bold text-[#0F1C2E]">T30 guaranteed or full refund.</span>
            </p>
          </div>
        </div>

        <div className={`relative blur-up ${isVisible ? 'visible' : ''}`}>
          <div className="bg-gradient-to-br from-[#8B1A1A] via-[#6B1515] to-[#8B1A1A] gradient-shift rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-12 text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-6 md:mb-8">
                <h3 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                  We Don't Pick the Easy Cases.
                </h3>
                <p className="text-[#F5EDD9]/80 text-base md:text-xl max-w-3xl mx-auto leading-relaxed">
                  Other firms take the strong profiles, submit clean applications, and take credit for outcomes that were going to happen anyway. We take the hard cases. The low GPAs, the bad starts, the students everyone else turned away. And we still guarantee T30.
                  <span className="font-bold text-white"> That's not a business model — that's personal.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
