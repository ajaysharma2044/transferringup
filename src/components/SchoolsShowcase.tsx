import { useState } from 'react';
import { Sparkles } from 'lucide-react';

const schools = [
  {
    name: "Cornell University",
    logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/172.png",
    color: "bg-red-700"
  },
  {
    name: "University of Pennsylvania",
    logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/219.png",
    color: "bg-red-700"
  },
  {
    name: "Duke University",
    logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/150.png",
    color: "bg-blue-800"
  },
  {
    name: "Brown University",
    logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/225.png",
    color: "bg-red-800"
  },
  {
    name: "Columbia University",
    logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/171.png",
    color: "bg-sky-700"
  },
  {
    name: "Dartmouth College",
    logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/159.png",
    color: "bg-green-800"
  },
  {
    name: "Johns Hopkins University",
    logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/118.png",
    color: "bg-sky-800"
  },
  {
    name: "Northwestern University",
    logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/77.png",
    color: "bg-gray-800"
  },
  {
    name: "Vanderbilt University",
    logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/238.png",
    color: "bg-yellow-600"
  },
  {
    name: "Notre Dame",
    logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/87.png",
    color: "bg-blue-900"
  },
  {
    name: "Georgetown University",
    logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/46.png",
    color: "bg-blue-800"
  },
  {
    name: "University of Michigan",
    logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/130.png",
    color: "bg-blue-800"
  },
  {
    name: "USC",
    logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/30.png",
    color: "bg-red-700"
  },
  {
    name: "Emory University",
    logo: "https://brand.emory.edu/_includes/images/site-wide/graphic-stylized-logo.png",
    color: "bg-sky-800"
  },
];

const allItems = schools;

const SchoolLogo = ({ school }: { school: typeof schools[number] }) => {
  const [imgError, setImgError] = useState(false);
  const abbrev = school.name.split(' ').map(w => w[0]).join('').slice(0, 3);

  if (imgError) {
    return (
      <div className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 ${school.color} rounded-2xl flex items-center justify-center text-white font-bold text-base sm:text-lg md:text-xl shadow-lg`}>
        {abbrev}
      </div>
    );
  }

  return (
    <img
      src={school.logo}
      alt={`${school.name} logo`}
      className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain"
      loading="lazy"
      onError={() => setImgError(true)}
    />
  );
};

const SchoolItem = ({ school }: { school: typeof schools[number] }) => (
  <div className="flex flex-col items-center flex-shrink-0 w-32 sm:w-36 md:w-44 mx-3 sm:mx-4 md:mx-6">
    <div className="mb-2 md:mb-3 hover:scale-110 transition-transform duration-200">
      <SchoolLogo school={school} />
    </div>
    <p className="text-[#3D3D4E] text-sm sm:text-base md:text-lg text-center font-medium leading-tight px-1 whitespace-normal">
      {school.name}
    </p>
  </div>
);

const ScrollRow = ({ items, reverse }: { items: typeof schools; reverse?: boolean }) => {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#F5EDD9] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#F5EDD9] to-transparent z-10 pointer-events-none" />
      <div
        className="flex animate-schools-scroll py-4"
        style={{ animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {doubled.map((school, index) => (
          <SchoolItem key={`${school.name}-${index}`} school={school} />
        ))}
      </div>
    </div>
  );
};

const SchoolsShowcase = () => {
  return (
    <section className="py-12 md:py-16 bg-[#F5EDD9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 scroll-fade-in">
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-[#8B1A1A]/10 border border-[#8B1A1A]/30 rounded-full text-[#8B1A1A] text-xs sm:text-sm font-medium mb-4 sm:mb-6 badge-shimmer">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-[#8B1A1A]" />
            Real Acceptances • Real Students
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1C1E] mb-3 sm:mb-4">
            Now Imagine Where We Can Get <span className="text-crimson-500">You</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#3D3D4E] max-w-3xl mx-auto">
            Schools we've been accepted to or helped our clients get into.
          </p>
        </div>
      </div>

      <ScrollRow items={allItems} />
    </section>
  );
};

export default SchoolsShowcase;
