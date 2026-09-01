import Seo from '../components/seo/Seo';
import { Reveal, TU } from '../components/home/shared';
import { SectionHeader } from '../components/shared/ui';
import FAQAccordion from '../components/shared/FAQAccordion';
import PricingCTA from '../components/home/PricingCTA';
import { serviceSchema, faqSchema, FAQS, breadcrumbSchema } from '../lib/schema';

type Service = { title: string; body: string; deliverables: string[] };

const SERVICES: Service[] = [
  {
    title: 'Transfer Strategy & School Targeting',
    body: 'We map your starting point to a realistic, ambitious school list. Credit mapping, GPA trajectory, and institutional priorities all factor into where you apply.',
    deliverables: ['Personalized school list', 'Credit & GPA analysis', 'Application timeline'],
  },
  {
    title: 'Essay Coaching, Unlimited Rounds',
    body: 'We build your narrative from scratch and craft every essay in your application. Unlimited revision rounds until each one is right.',
    deliverables: ['Narrative development', 'Every supplemental essay', 'Unlimited revisions'],
  },
  {
    title: 'Extracurricular Development & Positioning',
    body: 'We build your activity profile from scratch within the transfer timeline and position it for maximum impact.',
    deliverables: ['Activity strategy', 'Profile building', '12-month build plan'],
  },
  {
    title: 'Application Execution & Review',
    body: 'We review every component of your application before submission, nothing goes out that we haven’t pressure-tested.',
    deliverables: ['Full application review', 'Submission checklist', 'Error-proofing'],
  },
  {
    title: 'Interview Preparation',
    body: 'Mock interviews and coaching so you walk in confident and prepared for every school that interviews transfers.',
    deliverables: ['Mock interviews', 'Question prep', 'Delivery coaching'],
  },
  {
    title: '24/7 Text Support + Weekly Calls',
    body: 'Text anytime, weekly calls throughout. We don’t disappear after onboarding, we’re with you the whole year.',
    deliverables: ['24/7 text access', 'Weekly strategy calls', '12 months of support'],
  },
  {
    title: 'Letters of Continued Interest',
    body: 'We craft strategic letters of continued interest and updates that keep you in front of admissions committees.',
    deliverables: ['LOCI drafting', 'Update letters', 'Waitlist strategy'],
  },
  {
    title: 'Decision & Waitlist Strategy',
    body: 'When decisions land, we’re not done. Waitlist plays, appeals, and final-choice strategy, we help you turn a maybe into a yes and choose the right offer.',
    deliverables: ['Waitlist & appeal strategy', 'Offer comparison', 'Final-decision guidance'],
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Strategy & Targeting',
    body: 'We start by understanding exactly where you are, your GPA, your credits, your goals, and build a school list and timeline around your specific situation.',
  },
  {
    n: '02',
    title: 'Build & Position',
    body: 'We develop your narrative, build your extracurricular profile from scratch, and position every part of your application around the priorities of your target schools.',
  },
  {
    n: '03',
    title: 'Write & Execute',
    body: 'We craft every essay with unlimited revisions, review the full application, and execute submissions cleanly across all your schools.',
  },
  {
    n: '04',
    title: 'Follow Through',
    body: 'Letters of continued interest, interview prep, and waitlist strategy, we stay with you through decisions, the whole way to placement.',
  },
];

export default function ServicesPage() {
  return (
    <>
      <Seo
        title="Transfer Admissions Consulting Services | TransferringUP"
        description="Full-service transfer admissions consulting: transfer essay help, school selection, extracurriculars, and 24/7 support. The system that took our founder to Cornell."
        path="/services"
        jsonLd={[
          serviceSchema(),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
          ]),
        ]}
      />

      {/* Hero */}
      <section style={{ background: TU.navy, padding: 'clamp(96px, 12vw, 140px) clamp(24px, 6vw, 80px) clamp(56px, 8vw, 80px)' }}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <SectionHeader
            dark
            align="left"
            as="h1"
            whisper="One system. Everything included."
            title="One System. One Year. One Transfer."
          />
        </div>
      </section>

      {/* What's included */}
      <section style={{ background: TU.navy, padding: '0 clamp(24px, 6vw, 80px) clamp(72px, 12vw, 128px)' }}>
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-6" style={{ maxWidth: 1100 }}>
          {SERVICES.map((s, i) => (
            <Reveal
              key={s.title}
              delay={(i % 2) * 80}
              className="tu-bento"
              style={{ background: 'rgba(243,245,240,0.04)', borderRadius: 10, padding: '36px 32px' }}
            >
              <h2 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 24, color: TU.offwhite }}>
                {s.title}
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, lineHeight: 1.6, color: TU.offwhite, opacity: 0.6, marginTop: 12 }}>
                {s.body}
              </p>
              <div style={{ marginTop: 18 }}>
                {s.deliverables.map((d, j) => (
                  <div
                    key={d}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 14,
                      color: TU.offwhite,
                      opacity: 0.85,
                      padding: '12px 0',
                      borderTop: j === 0 ? '1px solid rgba(243,245,240,0.1)' : 'none',
                      borderBottom: '1px solid rgba(243,245,240,0.1)',
                    }}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: TU.cream, padding: 'clamp(72px, 12vw, 128px) clamp(24px, 6vw, 80px)' }}>
        <div className="mx-auto" style={{ maxWidth: 1000 }}>
          <SectionHeader whisper="How it works." title="From Where You Are to Where You’re Going" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ marginTop: 56 }}>
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={(i % 2) * 80} style={{ borderTop: `2px solid ${TU.crimson}`, paddingTop: 20 }}>
                <div style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 40, color: TU.crimson, opacity: 0.85 }}>
                  {s.n}
                </div>
                <h3 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 26, color: TU.navy, marginTop: 6 }}>
                  {s.title}
                </h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 17, lineHeight: 1.7, color: TU.navy, opacity: 0.72, marginTop: 10 }}>
                  {s.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing (reused) */}
      <PricingCTA />

      {/* FAQ */}
      <section style={{ background: TU.cream, padding: 'clamp(72px, 12vw, 128px) clamp(24px, 6vw, 80px)' }}>
        <div className="mx-auto" style={{ maxWidth: 820 }}>
          <SectionHeader whisper="Questions, answered." title="Frequently Asked Questions" />
          <div style={{ marginTop: 48 }}>
            <FAQAccordion faqs={FAQS} />
          </div>
        </div>
      </section>
    </>
  );
}
