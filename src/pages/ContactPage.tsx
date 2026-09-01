import Seo from '../components/seo/Seo';
import { Reveal, TU } from '../components/home/shared';
import ApplicationForm from '../components/ApplicationForm';
import ServicesShowcase from '../components/ServicesShowcase';
import { breadcrumbSchema } from '../lib/schema';

export default function ContactPage() {
  return (
    <>
      <Seo
        title="Book a Free Transfer Consultation | TransferringUP"
        description="Book a free transfer admissions consultation with a transfer application consultant. See how TransferringUP can help you transfer to a top university. Get started."
        path="/contact"
        jsonLd={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
        ]}
      />

      {/* Header */}
      <section style={{ background: TU.navy, padding: 'clamp(96px, 12vw, 140px) clamp(24px, 6vw, 80px) clamp(56px, 8vw, 80px)' }}>
        <Reveal className="mx-auto text-center" style={{ maxWidth: 760 }}>
          <h1
            style={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 700,
              fontSize: 'clamp(40px, 5vw, 64px)',
              color: TU.offwhite,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
            }}
          >
            Let's Talk About Your Transfer
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 18, color: TU.offwhite, opacity: 0.65, marginTop: 16 }}>
            Tell us about your transfer below. Your strategy call is where we walk you through
            exactly how our program would help you make the move.
          </p>
        </Reveal>
      </section>

      {/* What happens in a consultation + the application form */}
      <section style={{ background: TU.cream, padding: 'clamp(56px, 9vw, 96px) clamp(24px, 6vw, 80px)' }}>
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-12 lg:gap-20 items-start" style={{ maxWidth: 1140 }}>
          {/* Left, consultation steps + direct contact */}
          <div>
            <Reveal>
              <ServicesShowcase />
            </Reveal>
            <Reveal delay={80}>
              <div style={{ fontFamily: 'Inter, sans-serif', color: TU.navy, marginTop: 'clamp(40px, 5vw, 56px)' }}>
                <h2 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 22 }}>Reach us directly</h2>
                <div style={{ marginTop: 14, lineHeight: 2, fontSize: 16, opacity: 0.8 }}>
                  <div>
                    <a href="mailto:ajay@transferringup.com" style={{ color: TU.crimson }}>ajay@transferringup.com</a>
                  </div>
                  <div>
                    <a href="tel:+16462462458" style={{ color: TU.crimson }}>(646) 246-2458</a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right, the application form ("Get In Touch") */}
          <Reveal delay={60}>
            <div style={{ background: '#FFFFFF', border: `1px solid ${TU.divider}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 18px 50px rgba(15,28,46,0.08)' }}>
              <div style={{ height: 4, background: `linear-gradient(90deg, ${TU.crimson}, #C9A227)` }} />
              <div style={{ padding: 'clamp(24px, 3vw, 38px)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9A7B1F', marginBottom: 14 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: '#9A7B1F' }} />
                  Premium · 1-on-1 · By application
                </div>
                <h2 style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 'clamp(24px, 2.6vw, 30px)', color: TU.navy }}>Book Your Strategy Call</h2>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14.5, color: TU.navy, opacity: 0.6, marginTop: 6, marginBottom: 24 }}>
                  This is a high-end, fully personalized service, we work one-on-one with a limited
                  number of students each cycle. Share your details and we’ll walk you through
                  exactly how our program would handle your transfer.
                </p>
                <div style={{ borderLeft: '3px solid #C9A227', background: 'rgba(201,162,39,0.06)', borderRadius: '0 8px 8px 0', padding: '11px 14px', marginBottom: 22 }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12.5, lineHeight: 1.55, color: TU.navy, opacity: 0.8, margin: 0 }}>
                    <strong style={{ fontWeight: 700 }}>Please note:</strong> this strategy call is a walkthrough of how our program would handle your transfer , 
                    it isn’t free, one-off advising. We’ll show you the plan and whether we’re the right fit; the hands-on
                    coaching, essays, and execution come with joining as a client.
                  </p>
                </div>
                <ApplicationForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Questions → the canonical FAQ lives on the Services page */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(40px, 6vw, 64px) clamp(24px, 6vw, 80px)', textAlign: 'center' }}>
        <a href="/services" style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600, color: TU.crimson }}>
          Have questions? Read our FAQ →
        </a>
      </section>
    </>
  );
}
