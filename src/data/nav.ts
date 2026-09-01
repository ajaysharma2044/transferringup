export type NavLink = { label: string; href: string };
export type NavGroup = { label: string; href: string; children?: NavLink[] };

// Standalone pages
export const PAGES = {
  home: '/',
  about: '/about',
  services: '/services',
  results: '/results',
  reviews: '/reviews',
  faq: '/faq',
  contact: '/contact',
  blog: '/blog',
} as const;

// Every homepage section, each with its own dedicated anchor link.
export const SECTIONS: NavLink[] = [
  { label: 'The Record', href: '/#numbers' },
  { label: 'Our Approach', href: '/#edge' },
  { label: 'The Receipts', href: '/#letters' },
  { label: 'In Their Words', href: '/#words' },
  { label: 'The Founder', href: '/#founder' },
  { label: 'The System', href: '/#system' },
  { label: 'Two Paths', href: '/#paths' },
  { label: 'The Journal', href: '/#journal' },
  { label: 'Apply', href: '/#apply' },
];

export const PRIMARY_NAV: NavGroup[] = [
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'The Complete System', href: '/#system' },
      { label: 'Pricing & Apply', href: '/#apply' },
    ],
  },
  {
    // Promoted to the primary nav: a strong, owned trust page that Google can
    // surface as a sitelink directly beside the brand result.
    label: 'Reviews',
    href: '/reviews',
    children: [
      { label: 'In Their Words', href: '/#words' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    label: 'Why Us',
    href: '/about',
    children: [
      { label: 'Our Approach', href: '/#edge' },
      { label: 'The Founder', href: '/#founder' },
      { label: 'The Team', href: '/#team' },
    ],
  },
  {
    label: 'Success',
    href: '/results',
    children: [
      { label: 'The Record', href: '/#edge' },
      { label: 'The Receipts', href: '/#letters' },
    ],
  },
];

export const SECONDARY_NAV: NavGroup[] = [
  { label: 'Schools', href: '/results' },
  {
    label: 'Resources',
    href: '/blog',
    children: [
      { label: 'From the Journal', href: '/#journal' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Careers', href: '/careers' },
    ],
  },
];
