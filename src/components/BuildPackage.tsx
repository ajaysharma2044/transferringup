import { Check, ArrowRight, Award, Shield, Clock, BookOpen } from 'lucide-react';
import { MetaPixelEvents } from '../lib/metaPixel';

const BuildPackage = () => {
  const handleGetStarted = () => {
    MetaPixelEvents.InitiateCheckout(0);
    localStorage.setItem('package_value', 'custom');
    localStorage.setItem('package_name', 'Full-Service Advising');

    const element = document.querySelector('#consultation');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <section id="build-package" className="py-14 sm:py-20 md:py-28 bg-[#F5EDD9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Headline */}
        <div className="text-center mb-12 sm:mb-16 scroll-fade-in">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#0F1C2E] mb-5 leading-tight">
            One year. One package.<br />
            <span className="text-[#8B1A1A]">We bet on you, or you don't pay.</span>
          </h2>
          <p className="text-xl sm:text-2xl text-[#3D3D4E] max-w-2xl mx-auto">
            The only refund-guaranteed transfer advising program in the country.
          </p>
        </div>

        {/* Single Pricing Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-[#0F1C2E]/8 overflow-hidden scroll-scale-in tilt-card">

          {/* Guarantee Banner */}
          <div className="bg-[#0F1C2E] px-8 sm:px-10 py-7 flex items-center gap-5">
            <Shield className="h-9 w-9 text-[#F5EDD9] flex-shrink-0" />
            <div>
              <p className="text-[#F5EDD9] font-semibold text-lg sm:text-xl">
                Top university placement guaranteed — or a full refund.
              </p>
              <p className="text-[#F5EDD9]/70 text-base mt-1">
                We stake our fee on your outcome. No other transfer consultant does this.
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-12">

            {/* Price */}
            <div className="text-center mb-10 pb-10 border-b border-[#0F1C2E]/8">
              <p className="text-base font-medium text-[#3D3D4E] uppercase tracking-wide mb-3">Full-Service Advising</p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl md:text-5xl font-bold text-[#0F1C2E]">Custom Pricing</span>
              </div>
              <p className="text-[#3D3D4E] text-lg mt-3">Tailored to your situation and goals</p>
            </div>

            {/* Grouped Benefits */}
            <div className="space-y-10 mb-12">

              {/* What We Promise */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <Award className="h-6 w-6 text-[#8B1A1A]" />
                  <p className="text-sm sm:text-base font-bold text-[#8B1A1A] uppercase tracking-wider">What We Promise</p>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <Check className="h-6 w-6 text-[#8B1A1A] flex-shrink-0 mt-0.5" />
                    <span className="text-[#1C1C1E] text-lg">Unlimited schools — apply to as many as you want</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="h-6 w-6 text-[#8B1A1A] flex-shrink-0 mt-0.5" />
                    <span className="text-[#1C1C1E] text-lg">1 full year of dedicated support from our team</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="h-6 w-6 text-[#8B1A1A] flex-shrink-0 mt-0.5" />
                    <span className="text-[#1C1C1E] text-lg">Placement at a top university or your money back</span>
                  </li>
                </ul>
              </div>

              {/* What We Do */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <BookOpen className="h-6 w-6 text-[#0F1C2E]" />
                  <p className="text-sm sm:text-base font-bold text-[#0F1C2E] uppercase tracking-wider">What We Do</p>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <Check className="h-6 w-6 text-[#0F1C2E] flex-shrink-0 mt-0.5" />
                    <span className="text-[#3D3D4E] text-lg">Full application strategy and school targeting</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="h-6 w-6 text-[#0F1C2E] flex-shrink-0 mt-0.5" />
                    <span className="text-[#3D3D4E] text-lg">We build the story that ties your whole application together</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="h-6 w-6 text-[#0F1C2E] flex-shrink-0 mt-0.5" />
                    <span className="text-[#3D3D4E] text-lg">Extracurricular development and positioning</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="h-6 w-6 text-[#0F1C2E] flex-shrink-0 mt-0.5" />
                    <span className="text-[#3D3D4E] text-lg">Essay coaching with unlimited rounds of revision</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="h-6 w-6 text-[#0F1C2E] flex-shrink-0 mt-0.5" />
                    <span className="text-[#3D3D4E] text-lg">Letters of Continued Interest coaching and interview prep</span>
                  </li>
                </ul>
              </div>

              {/* What's Included */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <Clock className="h-6 w-6 text-[#3D3D4E]" />
                  <p className="text-sm sm:text-base font-bold text-[#3D3D4E] uppercase tracking-wider">What's Included</p>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <Check className="h-6 w-6 text-[#3D3D4E] flex-shrink-0 mt-0.5" />
                    <span className="text-[#5A5A6E] text-lg">Course selection and academic planning</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="h-6 w-6 text-[#3D3D4E] flex-shrink-0 mt-0.5" />
                    <span className="text-[#5A5A6E] text-lg">Full essay team review on all materials</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="h-6 w-6 text-[#3D3D4E] flex-shrink-0 mt-0.5" />
                    <span className="text-[#5A5A6E] text-lg">Installment plans available</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleGetStarted}
              className="w-full bg-[#8B1A1A] hover:bg-[#7A1717] text-[#F5EDD9] py-5 px-8 rounded-xl flex items-center justify-center space-x-3 group font-semibold text-lg btn-magnetic shadow-lg shadow-[#8B1A1A]/20"
            >
              <span>Apply to Work With Us</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </button>

          </div>
        </div>

      </div>
    </section>
  );
};

export default BuildPackage;
