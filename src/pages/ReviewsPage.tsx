import Seo from '../components/seo/Seo';
import { TU } from '../components/home/shared';
import { SectionHeader, CTAButton } from '../components/shared/ui';
import { REVIEWS, REVIEW_AGGREGATE } from '../components/shared/ReviewCards';
import { ImmersiveCard } from '../components/home/ReviewsProof';
import BBBReviews from '../components/home/BBBReviews';
import { BBB_REVIEWS } from '../data/bbbReviews';
import { reviewSchema, breadcrumbSchema } from '../lib/schema';

export default function ReviewsPage() {
  const allReviews = [...REVIEWS, ...BBB_REVIEWS];
  const schema = reviewSchema(
    { ...REVIEW_AGGREGATE, reviewCount: allReviews.length },
    allReviews.map((r) => ({ name: r.name, text: r.text, rating: r.rating, date: r.date, source: r.source }))
  );

  return (
    <>
      <Seo
        title="TransferringUP Reviews: BBB-Verified Client Ratings"
        description="Real TransferringUP reviews from students who transferred to Cornell, UVA, NYU and Michigan. 5.0 average rating, independently verified by the Better Business Bureau (A- accredited)."
        path="/reviews"
        jsonLd={[
          schema,
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Reviews', path: '/reviews' },
          ]),
        ]}
      />

      <section style={{ background: TU.navy, padding: 'clamp(96px, 12vw, 140px) clamp(24px, 6vw, 80px) clamp(56px, 8vw, 80px)' }}>
        <div className="mx-auto" style={{ maxWidth: 900 }}>
          <SectionHeader
            dark
            as="h1"
            whisper="Real students. Real outcomes."
            title="TransferringUP Reviews"
            body="Real feedback from students and families who trusted us with their transfer. Independently verified by the Better Business Bureau, where we hold an A- accredited rating."
          />
        </div>
      </section>

      <section style={{ background: TU.navy, padding: '0 clamp(24px, 6vw, 80px) clamp(72px, 12vw, 128px)' }}>
        <div className="mx-auto grid grid-cols-1" style={{ maxWidth: 900, gap: 'clamp(20px, 2.5vw, 30px)' }}>
          {REVIEWS.map((r, i) => (
            <ImmersiveCard key={r.name + i} review={r} delay={(i % 2) * 80} full />
          ))}
        </div>
        <div className="text-center" style={{ marginTop: 56 }}>
          <CTAButton href="/contact">Start My Transfer →</CTAButton>
        </div>
      </section>

      {/* Verified on the Better Business Bureau */}
      <BBBReviews />
    </>
  );
}
