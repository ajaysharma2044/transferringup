import Seo from '../components/seo/Seo';
import { TU } from '../components/home/shared';
import { SectionHeader, CTAButton } from '../components/shared/ui';
import FAQAccordion from '../components/shared/FAQAccordion';
import { faqSchema, FAQS, breadcrumbSchema } from '../lib/schema';

export default function FaqPage() {
  return (
    <>
      <Seo
        title="TransferringUP FAQ: Reviews, Cost, Legitimacy & Process"
        description="Answers to common questions about TransferringUP: is it legit, is it BBB accredited, what do reviews say, how much it costs, and how the transfer admissions process works."
        path="/faq"
        jsonLd={[
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'FAQ', path: '/faq' },
          ]),
        ]}
      />

      <section style={{ background: TU.navy, padding: 'clamp(96px, 12vw, 140px) clamp(24px, 6vw, 80px) clamp(48px, 7vw, 72px)' }}>
        <div className="mx-auto" style={{ maxWidth: 900 }}>
          <SectionHeader
            dark
            as="h1"
            whisper="Questions, answered."
            title="TransferringUP FAQ"
            body="Straight answers on legitimacy, BBB-verified reviews, pricing, and how our transfer admissions process actually works."
          />
        </div>
      </section>

      <section style={{ background: TU.cream, padding: 'clamp(56px, 9vw, 104px) clamp(24px, 6vw, 80px)' }}>
        <div className="mx-auto" style={{ maxWidth: 820 }}>
          <FAQAccordion faqs={FAQS} />
          <div className="text-center" style={{ marginTop: 56 }}>
            <CTAButton href="/contact">Start My Transfer →</CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
