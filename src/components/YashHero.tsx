import React from 'react';
import { ArrowRight, Star, Quote, Award } from 'lucide-react';
import Button from './ui/Button';
import OptimizedImage from './ui/OptimizedImage';

const scrollTo = (id: string) => {
  const isMobile = window.innerWidth < 1024;
  if (isMobile) {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.location.hash = `#${id}`;
  }
};

const schools = [
  {
    name: 'University of Michigan',
    logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/130.png',
  },
  {
    name: 'University of Virginia',
    logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/258.png',
  },
  {
    name: 'New York University',
    logo: '/NYU-Symbol.png',
  },
];

const YashHero = () => {
  return (
    <section className="py-10 sm:py-16 md:py-20 bg-[#F5EDD9] relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-16 right-10 w-4 h-4 rounded-full bg-[#8B1A1A]/6 float-slow hidden lg:block"></div>
      <div className="absolute bottom-24 left-16 w-3 h-3 rounded-full bg-[#0F1C2E]/5 float-medium hidden lg:block"></div>
      <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-[#8B1A1A]/10 float-fast hidden lg:block"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12 scroll-fade-in">
          <div className="inline-flex items-center px-6 py-3 bg-[#8B1A1A]/10 border border-[#8B1A1A]/30 rounded-full text-[#8B1A1A] text-sm font-medium mb-6 backdrop-blur-sm badge-shimmer">
            <Award className="h-4 w-4 mr-2 text-[#8B1A1A]" />
            Client Spotlight
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-[#0F1C2E] mb-4">
            From <span className="text-[#8B1A1A]">3.2 HS GPA</span> to <span className="text-[#8B1A1A]">University of Michigan</span>
          </h2>

          <p className="text-xl text-[#3D3D4E] max-w-3xl mx-auto">
            Everyone said it was impossible. We made it happen.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-10 lg:mb-0 scroll-slide-left">
            <div className="relative max-w-lg mx-auto">
              <div className="relative z-10">
                <OptimizedImage
                  src="/Screenshot_2026-03-27_at_12.03.23_AM.jpg"
                  alt="University of Michigan acceptance letter for Yash Singh"
                  className="rounded-2xl shadow-2xl w-full"
                />
              </div>
            </div>

            <div className="mt-6 sm:mt-10 flex flex-col items-center gap-3 sm:gap-4">
              <div className="inline-flex items-center gap-2 bg-[#8B1A1A] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg float-slow">
                <Award className="h-4 w-4" />
                ACCEPTED
              </div>
              <div className="flex items-center justify-center gap-6 sm:gap-10 lg:gap-12">
                {schools.map((school) => (
                  <div key={school.name} className="flex flex-col items-center gap-3">
                    <img
                      src={school.logo}
                      alt={`${school.name} logo`}
                      className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"
                    />
                    <span className="text-[#3D3D4E] text-xs sm:text-sm font-medium text-center leading-tight">
                      {school.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="scroll-slide-right">
            <div className="flex items-center gap-4 mb-6">
              <img
                src="/yash.jpg"
                alt="Yash Singh"
                className="w-20 h-20 rounded-full object-cover border-2 border-[#8B1A1A]/30 shadow-lg"
              />
              <div>
                <h4 className="font-bold text-[#0F1C2E] text-2xl">Yash Singh</h4>
                <p className="text-[#3D3D4E] text-base">Drexel University &rarr; University of Michigan</p>
                <div className="flex mt-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-gold-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 mb-5 sm:mb-8">
              <Quote className="h-8 w-8 text-[#8B1A1A] flex-shrink-0 mt-1" />
              <p className="text-[#3D3D4E] leading-relaxed text-lg italic">
                "Everyone told me Michigan was impossible with a 3.2 HS GPA. They helped me see the transfer path as a real opportunity -- walked me through building my profile, finding the right opportunities, and writing essays that told my story. Without their help, I'd still be wondering what if. Now I'm at Michigan."
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                ariaLabel="Book a free consultation"
                onClick={() => scrollTo('consultation')}
              >
                Start Your Transfer Journey
              </Button>
              <button
                className="inline-flex items-center justify-center font-semibold rounded-md px-8 py-3 text-lg border-2 border-[#8B1A1A] text-[#8B1A1A] hover:bg-[#8B1A1A] hover:text-[#F5EDD9] bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B1A1A]/20 btn-premium"
                aria-label="See more success stories"
                onClick={() => scrollTo('success-stories')}
              >
                More Success Stories
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(YashHero);
