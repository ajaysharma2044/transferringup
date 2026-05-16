import { useState } from 'react';

const allSchools = [
  { name: "Cornell University", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/172.png" },
  { name: "Duke University", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/150.png" },
  { name: "Northwestern University", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/77.png" },
  { name: "Columbia University", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/171.png" },
  { name: "Vanderbilt University", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/238.png" },
  { name: "University of Pennsylvania", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/219.png" },
  { name: "Johns Hopkins University", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/118.png" },
  { name: "NYU", logo: "/NYU-Symbol.png" },
  { name: "USC", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/30.png" },
  { name: "Brown University", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/225.png" },
  { name: "Dartmouth College", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/159.png" },
  { name: "University of Michigan", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/130.png" },
  { name: "Georgetown University", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/46.png" },
  { name: "UVA", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/258.png" },
  { name: "Notre Dame", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/87.png" },
  { name: "Emory University", logo: "https://brand.emory.edu/_includes/images/site-wide/graphic-stylized-logo.png" },
  { name: "WashU", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/143.png" },
  { name: "Georgia Tech", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/59.png" },
  { name: "UT Austin", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/251.png" },
  { name: "University of Florida", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/57.png" },
  { name: "Boston College", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/103.png" },
  { name: "University of Miami", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2390.png" },
  { name: "Tulane University", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2655.png" },
  { name: "Northeastern University", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/111.png" },
];

type School = typeof allSchools[number];

const duplicated = (arr: School[]) => [...arr, ...arr, ...arr];

const BannerLogo = ({ school }: { school: School }) => {
  const [imgError, setImgError] = useState(false);
  const abbrev = school.name.split(' ').map(w => w[0]).join('').slice(0, 3);

  if (imgError) {
    return (
      <div className="w-8 h-8 bg-cream-200 rounded-lg flex items-center justify-center text-[#3D3D4E] font-bold text-[10px] flex-shrink-0">
        {abbrev}
      </div>
    );
  }

  return (
    <img
      src={school.logo}
      alt={`${school.name} logo`}
      className="w-8 h-8 object-contain flex-shrink-0"
      loading="lazy"
      onError={() => setImgError(true)}
    />
  );
};

const MovingBanner = () => {
  return (
    <div className="bg-cream-50 border-y border-cream-200 py-3 overflow-hidden relative shadow-sm">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-cream-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-cream-50 to-transparent z-10 pointer-events-none" />

      <div className="flex animate-banner-scroll whitespace-nowrap items-center">
        {duplicated(allSchools).map((school, index) => (
          <span
            key={index}
            className="inline-flex items-center mx-6 gap-3 text-sm font-medium text-[#3D3D4E]"
          >
            <BannerLogo school={school} />
            {school.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MovingBanner;
