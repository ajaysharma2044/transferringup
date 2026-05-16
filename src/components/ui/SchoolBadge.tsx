import React, { useState } from 'react';

type SchoolKey = 'cornell' | 'vanderbilt' | 'michigan' | 'nyu' | 'usc';

const schoolData: Record<SchoolKey, { name: string; logo: string }> = {
  cornell: {
    name: 'Cornell',
    logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/172.png',
  },
  vanderbilt: {
    name: 'Vanderbilt',
    logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/238.png',
  },
  michigan: {
    name: 'Michigan',
    logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/130.png',
  },
  nyu: {
    name: 'NYU',
    logo: '/NYU-Symbol.png',
  },
  usc: {
    name: 'USC',
    logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/30.png',
  },
};

interface SchoolBadgeProps {
  school: SchoolKey;
  size?: 'sm' | 'md' | 'lg';
}

const SchoolBadge: React.FC<SchoolBadgeProps> = ({ school, size = 'md' }) => {
  const data = schoolData[school];
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'text-sm gap-1',
    md: 'text-lg sm:text-xl lg:text-2xl gap-1.5',
    lg: 'text-xl sm:text-2xl lg:text-4xl gap-1.5 lg:gap-2',
  };

  const logoSizes = { sm: 'w-5 h-5', md: 'w-6 h-6 sm:w-7 sm:h-7', lg: 'w-8 h-8 lg:w-10 lg:h-10' };

  return (
    <span
      className={`inline-flex items-center font-bold text-[#1C1C1E] ${sizeClasses[size]} hover:scale-110 transition-transform duration-300 cursor-default`}
    >
      {!imgError ? (
        <img
          src={data.logo}
          alt={`${data.name} logo`}
          className={`${logoSizes[size]} object-contain flex-shrink-0`}
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="font-black text-xs">{data.name[0]}</span>
      )}
      {data.name}
    </span>
  );
};

export default SchoolBadge;
