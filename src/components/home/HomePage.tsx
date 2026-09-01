import Seo from '../seo/Seo';
import { websiteSchema, serviceSchema, reviewSchema } from '../../lib/schema';
import { REVIEWS, REVIEW_AGGREGATE } from '../shared/ReviewCards';
import { BBB_REVIEWS } from '../../data/bbbReviews';
import Hero from './Hero';
import OurEdge from './OurEdge';
import ReceiptsScroll from './ReceiptsScroll';
import ReviewsProof from './ReviewsProof';
import FounderStory from './FounderStory';
import TeamTeaser from './TeamTeaser';
import TransferSystem from './TransferSystem';
import FromTheJournal from './FromTheJournal';
import PricingCTA from './PricingCTA';
import SectionSeam from './SectionSeam';
import NewsletterSignup from '../shared/NewsletterSignup';

export default function HomePage() {
  // The homepage displays both the immersive client reviews and the verified
  // BBB reviews, so it carries full Review markup (rich results + GEO trust).
  const allReviews = [...REVIEWS, ...BBB_REVIEWS];
  return (
    <>
      <Seo
        title="College Transfer Admissions Consulting | TransferringUP"
        description="From a 2.9 GPA to Cornell in one year. TransferringUP turns underdogs into top-30 transfers with a proven, one-on-one system. BBB accredited and 5.0-star rated."
        path="/"
        jsonLd={[
          websiteSchema(),
          serviceSchema(),
          reviewSchema(
            { ...REVIEW_AGGREGATE, reviewCount: allReviews.length },
            allReviews.map((r) => ({ name: r.name, text: r.text, rating: r.rating, date: r.date, source: r.source }))
          ),
        ]}
      />
      {/* THE CLAIM */}
      <Hero />
      {/* …then prove it, relentlessly, as you scroll. Seams ease the colour
          handoff between dark and light sections so the flow feels intentional. */}
      <SectionSeam from="#0F1C2E" to="#FFFFFF" />
      <OurEdge />
      <SectionSeam from="#FFFFFF" to="#0A1018" />
      <ReviewsProof />
      <ReceiptsScroll />
      <SectionSeam from="#0E1A2B" to="#F8F4EE" />
      <FounderStory />
      <TeamTeaser />
      <SectionSeam from="#FFFFFF" to="#0F1C2E" />
      {/* The System + Journal are hidden on phones (below md) so the mobile
          experience stays lean (hero → results → school scroll → reviews → team →
          CTA); tablets and up still get them. The seam above bridges white→navy
          for both, since the hidden block and PricingCTA both open on navy. */}
      <div className="hidden md:block">
        <TransferSystem />
        <SectionSeam from="#0F1C2E" to="#F3F5F0" />
        <FromTheJournal />
        <SectionSeam from="#F3F5F0" to="#0F1C2E" />
      </div>
      <PricingCTA lean />
      <NewsletterSignup />
    </>
  );
}
