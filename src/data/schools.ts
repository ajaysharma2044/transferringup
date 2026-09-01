export type School = { name: string; short: string; logo: string };

// Logos sourced from assets the live site already uses (ESPN CDN + local NYU
// mark + Emory brand asset).
export const SCHOOLS: School[] = [
  { name: 'Cornell University', short: 'Cornell', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/172.png' },
  { name: 'Vanderbilt University', short: 'Vanderbilt', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/238.png' },
  { name: 'University of Michigan', short: 'Michigan', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/130.png' },
  { name: 'New York University', short: 'NYU', logo: '/NYU-Symbol.png' },
  { name: 'University of Southern California', short: 'USC', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/30.png' },
  { name: 'Northwestern University', short: 'Northwestern', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/77.png' },
  { name: 'Columbia University', short: 'Columbia', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/171.png' },
  { name: 'University of Pennsylvania', short: 'UPenn', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/219.png' },
  { name: 'Johns Hopkins University', short: 'Johns Hopkins', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/118.png' },
  { name: 'Brown University', short: 'Brown', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/225.png' },
  { name: 'Dartmouth College', short: 'Dartmouth', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/159.png' },
  { name: 'University of Virginia', short: 'UVA', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/258.png' },
  { name: 'Georgetown University', short: 'Georgetown', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/46.png' },
  { name: 'University of Notre Dame', short: 'Notre Dame', logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/87.png' },
  { name: 'Emory University', short: 'Emory', logo: 'https://brand.emory.edu/_includes/images/site-wide/graphic-stylized-logo.png' },
];
