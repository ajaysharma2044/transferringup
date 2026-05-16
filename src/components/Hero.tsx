import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from './ui/Button';
import OptimizedImage from './ui/OptimizedImage';
import SchoolBadge from './ui/SchoolBadge';

const HeroImageComposite = () => {
  return (
    <div className="hero-image-reveal relative w-full aspect-[4/3] max-w-[260px] sm:max-w-sm lg:max-w-sm lg:aspect-[4/5] mx-auto lg:mx-auto">
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <div className="absolute -inset-3 bg-cream-200/60 rounded-2xl blur-xl glow-pulse"></div>
          <div className="relative w-full h-full bg-cream-50 p-1.5 rounded-2xl shadow-xl">
            <OptimizedImage
              src="/IMG_5249.jpg"
              alt="Cornell University acceptance letter - admitted to Jeb E. Brooks School of Public Policy"
              className="rounded-xl w-full h-full object-cover object-top"
              priority
            />
          </div>
        </div>
      </div>

      <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-10 w-[55%] sm:w-[50%]">
        <div className="absolute -inset-1 bg-black/10 rounded-lg blur-md"></div>
        <div className="relative bg-cream-50/95 backdrop-blur-sm p-1 sm:p-1.5 rounded-lg shadow-2xl border border-cream-300/50">
          <OptimizedImage
            src="/Screenshot_2026-03-27_at_2.34.30_AM.jpg"
            alt="Performance information showing 2.9 cumulative GPA and class rank 323 of 402"
            className="rounded w-full"
            priority
          />
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const scrollToConsultation = () => {
    const section = document.getElementById('consultation');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-8 pb-6 sm:pt-12 sm:pb-10 lg:pt-16 lg:pb-20 bg-[#F5EDD9] overflow-hidden relative">
      {/* Decorative floating shapes */}
      <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-[#8B1A1A]/10 float-slow hidden lg:block"></div>
      <div className="absolute top-40 right-20 w-5 h-5 rounded-full bg-[#0F1C2E]/5 float-medium hidden lg:block"></div>
      <div className="absolute bottom-20 left-1/4 w-4 h-4 rounded-full bg-[#8B1A1A]/8 float-fast hidden lg:block"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
          <div className="overflow-visible">

            <h1 className="text-center lg:text-left" itemProp="headline">
              <span className="hero-text-reveal hero-text-reveal-1 block text-[3.25rem] sm:text-6xl lg:text-[5.5rem] font-black text-[#1C1C1E] leading-[0.95] tracking-tight">
                <span className="text-[#8B1A1A]">2.9</span> GPA.
              </span>
              <span className="hero-text-reveal hero-text-reveal-2 block mt-2 lg:mt-3 text-lg sm:text-xl lg:text-2xl font-medium text-[#3D3D4E] tracking-normal">
                Bottom of my class. Rejected from my backup schools.
              </span>
            </h1>

            <div className="hero-text-reveal hero-text-reveal-3 mt-4 sm:mt-6 lg:mt-8 mb-4 sm:mb-6 lg:mb-8">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1C1E] text-center lg:text-left">
                Just <span className="font-extrabold">1 year later</span>, accepted to
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-2 lg:gap-x-4">
                <SchoolBadge school="cornell" size="lg" />
                <SchoolBadge school="vanderbilt" size="lg" />
                <SchoolBadge school="michigan" size="lg" />
                <SchoolBadge school="nyu" size="lg" />
                <SchoolBadge school="usc" size="lg" />
              </div>
            </div>

            <p className="hero-text-reveal hero-text-reveal-4 text-2xl sm:text-3xl lg:text-5xl text-[#1C1C1E] font-black mb-4 sm:mb-8 text-center lg:text-left leading-tight tracking-tight lg:hidden">
              Now we help <span className="text-[#8B1A1A]">you</span> transfer up.
            </p>

            <div className="lg:hidden mb-4 sm:mb-8 px-2 sm:px-6 pt-2 pb-2 sm:pt-4 sm:pb-4">
              <HeroImageComposite />
            </div>

            <p className="hero-text-reveal hero-text-reveal-4 hidden lg:block text-3xl sm:text-4xl lg:text-5xl text-[#1C1C1E] font-black mb-10 text-center lg:text-left leading-tight tracking-tight">
              Now we help <span className="text-[#8B1A1A]">you</span> transfer up.
            </p>

            <div className="hero-text-reveal hero-text-reveal-5 mt-4 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-center lg:items-start">
              <div className="pulse-soft rounded-xl">
                <Button
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  ariaLabel="Start your free transfer strategy consultation"
                  onClick={scrollToConsultation}
                >
                  Start My Transfer
                </Button>
              </div>

              <Button
                variant="secondary"
                size="lg"
                ariaLabel="Read the founder's transfer story"
                onClick={() => {
                  const isMobile = window.innerWidth < 1024;
                  if (isMobile) {
                    const teamSection = document.getElementById('team');
                    if (teamSection) {
                      teamSection.scrollIntoView({ behavior: 'smooth' });
                      setTimeout(() => {
                        const ajayStoryButton = document.querySelector('[data-ajay-story="true"]') as HTMLButtonElement;
                        if (ajayStoryButton) {
                          const isExpanded = ajayStoryButton.getAttribute('aria-expanded') === 'true';
                          if (!isExpanded) {
                            ajayStoryButton.click();
                          }
                        }
                      }, 800);
                    }
                  } else {
                    window.location.hash = '#team';
                  }
                }}
              >
                Read My Story
              </Button>
            </div>
          </div>

          <div className="hidden lg:block lg:pl-8 lg:pt-2 lg:pb-6">
            <HeroImageComposite />
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Hero);
