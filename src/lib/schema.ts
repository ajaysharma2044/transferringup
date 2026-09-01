/**
 * JSON-LD structured data generators. All output is serialized into a
 * <script type="application/ld+json"> in the static HTML <head> via the Seo
 * component, never injected client-side.
 */

export const SITE_URL = 'https://transferringup.com';
export const SITE_NAME = 'TransferringUP';
/** Stable @id so every node about the business merges into one entity for
 * search engines + AI answer engines (GEO). */
export const ORG_ID = `${SITE_URL}/#organization`;
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const LOGO_URL = `${SITE_URL}/logotransferringup.png`;
export const PHONE = '+1-646-246-2458';
export const EMAIL = 'ajay@transferringup.com';
export const FOUNDER_NAME = 'Ajay Sharma';
export const FOUNDER_LINKEDIN = 'https://www.linkedin.com/in/ajay-sharma-ab8869183/';
export const SLOGAN = 'Transfer up, for the students the system overlooked.';

// Better Business Bureau, Accredited Business (A− rating), accredited 6/19/2026.
// Local BBB: BBB of Southern Piedmont and Western N.C. Business: Transferringup, LLC.
export const BBB_PROFILE_URL =
  'https://www.bbb.org/us/nc/concord/profile/college-admissions-counselor/transferringup-llc-0473-92038264';
export const BBB_RATING = 'A-';

/** Topics the brand is authoritative on, surfaced for AI answer engines (AEO). */
export const KNOWS_ABOUT = [
  'College transfer admissions',
  'Transfer application strategy',
  'Transfer essays',
  'Low GPA transfer strategy',
  'Community college to university transfer',
  'Ivy League transfer admissions',
  'Cornell transfer admissions',
  'College essay coaching',
];

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': ['EducationalOrganization', 'ProfessionalService'],
  '@id': ORG_ID,
  name: SITE_NAME,
  alternateName: 'Transferring Up',
  url: SITE_URL,
  logo: LOGO_URL,
  image: DEFAULT_OG_IMAGE,
  slogan: SLOGAN,
  foundingDate: '2024',
  description:
    'Specialist college transfer admissions consulting for students the system overlooked, low GPAs, rejections, community college, placed at Top-30 universities.',
  founder: {
    '@type': 'Person',
    name: FOUNDER_NAME,
    jobTitle: 'Founder & Lead Consultant',
    alumniOf: [{ '@type': 'CollegeOrUniversity', name: 'Cornell University' }],
    sameAs: [FOUNDER_LINKEDIN],
  },
  knowsAbout: KNOWS_ABOUT,
  areaServed: { '@type': 'Country', name: 'United States' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Concord',
    addressRegion: 'NC',
    postalCode: '28027',
    addressCountry: 'US',
  },
  serviceType: 'College Transfer Admissions Consulting',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    bestRating: '5',
    worstRating: '1',
    reviewCount: '9',
  },
  // Third-party trust signal, surfaced to AI answer engines deciding "is this
  // business legit?". Paired with the BBB profile in sameAs below.
  award: 'Better Business Bureau Accredited Business (A- Rating)',
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'Accreditation',
    name: 'BBB Accredited Business, A- Rating',
    recognizedBy: {
      '@type': 'Organization',
      name: 'Better Business Bureau',
      url: 'https://www.bbb.org',
    },
    url: BBB_PROFILE_URL,
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Transfer Consulting Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Full Transfer Package',
          description:
            'End-to-end transfer admissions consulting, school strategy, essays, extracurriculars, and 12 months of support',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Essay Intensive',
          description: 'Focused essay writing and editing for transfer applications',
        },
      },
    ],
  },
  // Social/verified profiles, only real, verified URLs (the previous
  // @transferringup Instagram/TikTok handles 404'd, so they were removed).
  // The founder's LinkedIn and the BBB Accredited Business listing are the
  // confirmed profiles. Linking the BBB profile here ties the site to the
  // verified accreditation for search + AI answer engines.
  sameAs: [FOUNDER_LINKEDIN, BBB_PROFILE_URL],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: PHONE,
    email: EMAIL,
    contactType: 'customer service',
  },
});

export const personSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: FOUNDER_NAME,
  jobTitle: 'Founder & Lead Consultant',
  worksFor: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  sameAs: [FOUNDER_LINKEDIN],
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Cornell University' },
    { '@type': 'CollegeOrUniversity', name: 'University of Notre Dame' },
    { '@type': 'CollegeOrUniversity', name: 'University of Southern California' },
  ],
  knowsAbout: KNOWS_ABOUT,
});

// SiteNavigationElement, a recognized hint that helps Google choose which
// pages appear as sitelinks under the brand result. Mirrors the primary nav.
export const siteNavigationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${SITE_URL}/#nav`,
  name: 'TransferringUP main navigation',
  itemListElement: [
    { '@type': 'SiteNavigationElement', position: 1, name: 'Services', url: `${SITE_URL}/services` },
    { '@type': 'SiteNavigationElement', position: 2, name: 'Reviews', url: `${SITE_URL}/reviews` },
    { '@type': 'SiteNavigationElement', position: 3, name: 'Results', url: `${SITE_URL}/results` },
    { '@type': 'SiteNavigationElement', position: 4, name: 'FAQ', url: `${SITE_URL}/faq` },
    { '@type': 'SiteNavigationElement', position: 5, name: 'About', url: `${SITE_URL}/about` },
    { '@type': 'SiteNavigationElement', position: 6, name: 'Blog', url: `${SITE_URL}/blog` },
    { '@type': 'SiteNavigationElement', position: 7, name: 'Contact', url: `${SITE_URL}/contact` },
  ],
});

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  alternateName: 'Transferring Up',
  url: SITE_URL,
  description:
    'College transfer admissions consulting for students written off the first time, transfer to Cornell and Ivy League schools, transfer with a low GPA, and go from community college to a top university.',
  publisher: { '@type': 'EducationalOrganization', name: SITE_NAME, url: SITE_URL },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

export const serviceSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${SITE_URL}/services#service`,
  serviceType: 'College Transfer Admissions Consulting',
  name: 'College Transfer Admissions Consulting',
  provider: { '@type': 'EducationalOrganization', name: SITE_NAME, url: SITE_URL },
  description:
    'Complete transfer admissions consulting including transfer essay help, school selection, extracurricular development, interview prep, and 24/7 support for 12 months, the system that took our founder from a 2.9 GPA to Cornell. We specialize in transferring with a low GPA and community-college-to-top-university transfers.',
  areaServed: { '@type': 'Country', name: 'United States' },
  audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Service Tiers',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Full Transfer Package' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Essay Intensive' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'School Selection Strategy' } },
    ],
  },
});

export type BreadcrumbItem = { name: string; path: string };

export const breadcrumbSchema = (items: BreadcrumbItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: `${SITE_URL}${item.path === '/' ? '' : item.path.endsWith('/') ? item.path : item.path + '/'}`,
  })),
});

export type FaqItem = { question: string; answer: string };

export const FAQS: FaqItem[] = [
  {
    question: 'What does TransferringUP help with?',
    answer:
      'The complete transfer system: transfer strategy (school selection, credit mapping, timeline), essay and narrative development, extracurricular and leadership building, recommendation letters, research and internship placement, and 24/7 support with text access and weekly calls. Everything you need to transfer up, nothing you don’t.',
  },
  {
    question: 'What makes TransferringUP different from other consultants?',
    answer:
      'We specialize in the students other consultants pass on, low GPAs, rejections, community-college transcripts. Our founder went from a 2.9 high-school GPA at the bottom of his class to Cornell, UVA, Michigan, NYU, and USC in one year, then turned it into a repeatable system. And transfer admissions is all we do, it’s a different game from freshman admissions, with rules we’ve mastered.',
  },
  {
    question: 'Is TransferringUP legit and trustworthy?',
    answer:
      'Yes. TransferringUP is independently accredited by the Better Business Bureau (BBB), the long-standing nonprofit that vets businesses, and holds an A- rating. The client reviews on its BBB profile are verified by the BBB as an independent third party, not self-reported, and average 5.0 stars. The company is run by Ajay Sharma, a Cornell transfer, alongside consultants who transferred into top-25 schools themselves.',
  },
  {
    question: 'Is TransferringUP BBB accredited?',
    answer:
      'Yes. TransferringUP, LLC is an accredited business with the Better Business Bureau and holds an A- rating. Its client reviews are independently verified by the BBB, an impartial third party, and can be read directly on the company’s Better Business Bureau profile.',
  },
  {
    question: 'What do TransferringUP reviews say?',
    answer:
      'Reviewers whose feedback is independently verified by the Better Business Bureau describe Ajay as incredibly knowledgeable, strategic, and genuinely invested in their success, and credit the team with turning low GPAs into top-30 acceptances. These are third-party-verified reviews rather than self-collected testimonials, and they average 5.0 stars.',
  },
  {
    question: 'Why do some online reviews mention a $400 package?',
    answer:
      'TransferringUP has never sold a $400 package. We are a premium, full-cycle engagement, quoted custom after a consultation, and we have no record of those accounts among our clients. A review describing a $400 product is not describing a real TransferringUP service. Our verified reviews are on our Better Business Bureau profile, where we hold an A- accredited rating.',
  },
  {
    question: 'What GPA do I need to transfer to a top university?',
    answer:
      'There is no hard minimum. Our founder transferred to Cornell with a 2.9 GPA, and we’ve placed clients with GPAs ranging from 2.9 to 3.9 at T30 schools. Your GPA is one factor, we build the rest of your application to compensate.',
  },
  {
    question: 'Do you only work with students who have a low GPA?',
    answer:
      'No, but it’s our specialty. We work with students across the spectrum, and we’re especially effective for those the system overlooked the first time: low high-school GPAs, rejections, and community-college transcripts. That’s exactly who we’re best at helping.',
  },
  {
    question: 'Can I transfer from a community college to an Ivy League school?',
    answer:
      'Yes. Multiple Ivy League and T30 schools actively recruit transfer students from community colleges. We have placed community-college students at Cornell, Michigan, UVA, and other top schools.',
  },
  {
    question: 'How long does the transfer process take?',
    answer:
      'Most of our clients are placed within one year. We work with you for a full 12 months, covering everything from school selection and essays to extracurricular development and interview prep.',
  },
  {
    question: 'When should I start?',
    answer:
      'As early as possible in your transfer cycle. The more runway we have to build your profile, strengthen your extracurriculars, and craft your essays, the stronger your application, but we’ve also turned around tight timelines. Book a call and we’ll tell you honestly where you stand.',
  },
  {
    question: 'Do you help with transfer essays?',
    answer:
      'Yes. Essay coaching is a core part of every package. We build your narrative from scratch, craft every essay in your application, and offer unlimited revision rounds until every essay is right.',
  },
  {
    question: 'Who will I be working with?',
    answer:
      'Ajay, our founder (Cornell), leads strategy, and you’re supported by a team of consultants who transferred into top-25 schools themselves, Cornell, Vanderbilt, Notre Dame, and more. You get people who have actually done it.',
  },
  {
    question: 'How much does it cost?',
    answer:
      'It depends on how much support you want, we offer a range of packages. We’ll walk you through the options on your free intro call so you only pay for what fits your situation. No obligation.',
  },
  {
    question: 'Do you guarantee admission to a specific school?',
    answer:
      'No honest consultant can guarantee an admissions decision, anyone who does is selling you something. What we commit to is a proven, personalized system and relentless support: the same one that’s produced dozens of top-30 acceptances from students who were told it couldn’t happen.',
  },
  {
    question: 'How do I get started?',
    answer:
      'Fill out the form on our contact page or book a free strategy call. We typically respond within 2 hours during business days and will reach out to schedule your introductory consultation.',
  },
];

export const faqSchema = (faqs: FaqItem[] = FAQS) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
});

export const blogPostingSchema = (post: {
  title: string;
  description: string;
  date: string;
  slug: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.description,
  datePublished: post.date,
  dateModified: post.date,
  author: { '@type': 'Person', name: 'Ajay', url: `${SITE_URL}/about` },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    logo: { '@type': 'ImageObject', url: LOGO_URL },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${SITE_URL}/blog/${post.slug}/`,
  },
});

export type ReviewItem = {
  name: string;
  text: string;
  rating: number;
  /** ISO date the review was published (enables review rich results). */
  date?: string;
  /** Set for third-party reviews (e.g. "BBB Verified Review"). */
  source?: string;
};

export const reviewSchema = (
  aggregate: { ratingValue: string; reviewCount: number; bestRating: string },
  reviews: ReviewItem[]
) => ({
  '@context': 'https://schema.org',
  // @graph: the business node + each review as an INDEPENDENT review *of* the
  // business. Framing reviews as standalone nodes (itemReviewed -> us) rather
  // than nesting them inside our own Organization reads as third-party rather
  // than self-collected. BBB reviews additionally name the Better Business
  // Bureau as publisher, the strongest verification signal for AI engines.
  '@graph': [
    {
      '@type': ['EducationalOrganization', 'ProfessionalService'],
      '@id': ORG_ID, // merges with the global Organization node
      name: SITE_NAME,
      url: SITE_URL,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: aggregate.ratingValue,
        reviewCount: String(aggregate.reviewCount),
        bestRating: aggregate.bestRating,
        worstRating: '1',
      },
    },
    ...reviews.map((r) => ({
      '@type': 'Review',
      itemReviewed: { '@id': ORG_ID },
      author: { '@type': 'Person', name: r.name },
      ...(r.date ? { datePublished: r.date } : {}),
      reviewBody: r.text,
      reviewRating: { '@type': 'Rating', ratingValue: String(r.rating), bestRating: '5', worstRating: '1' },
      ...(r.source
        ? {
            name: 'Better Business Bureau Verified Review',
            publisher: { '@type': 'Organization', name: 'Better Business Bureau', url: 'https://www.bbb.org' },
          }
        : {}),
    })),
  ],
});
