import { ArrowRight } from 'lucide-react';

const results = [
  {
    from: '3.3 HS GPA, Test Optional',
    to: 'Cornell',
    detail: 'Accepted in 1 Year',
    image: '/IMG_7090.jpeg',
    alt: 'Cornell University acceptance',
    gradient: 'from-[#B31B1B] to-[#7A1212]',
  },
  {
    from: '3.0 HS GPA, Test Optional',
    to: 'Cornell',
    detail: 'Accepted in 1 Year',
    image: '/recent-wins/623285D5-860C-4029-98A8-C5D56D999A50.jpeg',
    alt: 'Cornell University acceptance',
    gradient: 'from-[#B31B1B] to-[#7A1212]',
  },
  {
    from: '3.9 HS GPA',
    to: 'Cornell',
    detail: 'Accepted in 1 Year',
    image: '/recent-wins/41DED9C2-A5C5-4BB9-8C53-F9A27FB7283E.jpeg',
    alt: 'Cornell University acceptance',
    gradient: 'from-[#B31B1B] to-[#7A1212]',
  },
  {
    from: 'Rutgers',
    to: 'Northwestern',
    detail: 'Transfer Acceptance',
    image: '/IMG_5939.jpg',
    alt: 'Northwestern University acceptance letter',
    gradient: 'from-[#4E2A84] to-[#372065]',
  },
  {
    from: '3.0 HS GPA',
    to: 'UMich',
    detail: 'Accepted in 1 Year',
    image: '/IMG_5938.jpg',
    alt: 'University of Michigan acceptance letter',
    gradient: 'from-[#00274C] to-[#001A33]',
  },
  {
    from: '3.0 HS GPA, Test Optional',
    to: 'UVA',
    detail: 'Accepted in 1 Year',
    image: '/recent-wins/7FC5878D-F024-46E8-91D0-3974CA321EEB.jpeg',
    alt: 'University of Virginia acceptance',
    gradient: 'from-[#232D4B] to-[#141B2D]',
  },
  {
    from: '3.3 HS GPA, C in Calc, Test Optional',
    to: 'UVA',
    detail: 'Accepted in 1 Year',
    image: '/recent-wins/2D03B30C-32C9-488F-950B-7FB643385321.jpeg',
    alt: 'University of Virginia acceptance',
    gradient: 'from-[#232D4B] to-[#141B2D]',
  },
  {
    from: '3.2 HS GPA, Test Optional',
    to: 'UVA',
    detail: 'Accepted in 1 Year',
    image: '/recent-wins/2CBAB015-1078-4412-96F6-1B6B8183C94C.jpeg',
    alt: 'University of Virginia acceptance',
    gradient: 'from-[#232D4B] to-[#141B2D]',
  },
];

const ResultsShowcase = () => {
  return (
    <section className="py-6 sm:py-8 bg-[#0D1B2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-6 scroll-fade-in">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Recent Client Wins
          </h2>
          <p className="text-sm sm:text-base text-gray-400 mt-1">
            Here are some of our acceptances so far — we're still adding more as results keep coming back
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 grid-stagger">
          {results.map((result, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden hover:-translate-y-2 hover:shadow-xl hover:shadow-white/5 transition-all duration-400 bg-white/5 border border-white/10 hover:border-white/20"
            >
              <div className={`bg-gradient-to-r ${result.gradient} px-2 py-1.5 flex items-center justify-center gap-1 sm:gap-1.5`}>
                <span className="text-white font-bold text-[10px] sm:text-xs">
                  {result.from}
                </span>
                <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white/70 flex-shrink-0" />
                <span className="text-white font-bold text-[10px] sm:text-xs">
                  {result.to}
                </span>
              </div>

              <div className="overflow-hidden">
                <img
                  src={result.image}
                  alt={result.alt}
                  className="w-full h-auto hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              <div className="px-2 py-1.5 text-center">
                <p className="text-white/50 text-[9px] sm:text-[10px] font-medium tracking-wide uppercase">
                  {result.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsShowcase;
