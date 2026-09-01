import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import Seo from '../components/seo/Seo';
import { Reveal, TU } from '../components/home/shared';
import SectionSeam from '../components/home/SectionSeam';
import ApplicationForm from '../components/ApplicationForm';
import ReceiptsScroll from '../components/home/ReceiptsScroll';
import OurEdge from '../components/home/OurEdge';
import TeamTeaser from '../components/home/TeamTeaser';
import { PackageCard } from '../components/home/PricingCTA';
import { REVIEWS, REVIEW_AGGREGATE, type ReviewRecord } from '../components/shared/ReviewCards';
import { SCHOOLS } from '../data/schools';
import { track } from '../lib/analytics';

// Paid-ads landing page = a condensed, conversion-optimized cut of the real
// homepage: the cinematic campus scroll (ReceiptsScroll) and the full placements
// ledger (OurEdge) are reused verbatim, wrapped with a lead-form hero + founder
// proof + a hard CTA. Stripped of the global nav/footer; noindex (paid traffic).

const ACCEPTED = ['Cornell', 'Vanderbilt', 'Michigan', 'NYU', 'USC']
  .map((short) => SCHOOLS.find((s) => s.short === short))
  .filter((s): s is (typeof SCHOOLS)[number] => Boolean(s));

const serif = { fontFamily: '"Fraunces", serif' } as const;
const sans = { fontFamily: 'Inter, sans-serif' } as const;

function Stars({ rating = 5, size = 15 }: { rating?: number; size?: number }) {
  return (
    <div className="flex" style={{ gap: 3 }} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} strokeWidth={0} fill={n <= rating ? TU.gold : 'rgba(255,255,255,0.25)'} />
      ))}
    </div>
  );
}

/** Review card, student's face top-right, with a "Read more" toggle that
 *  expands the full review inline (no leaving the page). */
function ReviewCard({ r, delay }: { r: ReviewRecord; delay: number }) {
  const [open, setOpen] = useState(false);
  const long = r.text.length > 230;
  // Every school they were admitted to (drop the "(Merit Scholarship)" notes for a clean list).
  const admitted = (r.schoolsAccepted || [r.schoolTo]).map((s) => s.replace(/\s*\(.*?\)/g, '').trim());
  return (
    <Reveal delay={delay} style={{ background: '#FFFFFF', border: `1px solid ${TU.divider}`, borderRadius: 14, padding: 'clamp(22px, 2.6vw, 30px)', display: 'flex', flexDirection: 'column', boxShadow: '0 18px 44px rgba(15,28,46,0.07)' }}>
      <div className="flex items-start justify-between" style={{ gap: 12 }}>
        <Stars rating={r.rating} />
        {r.headshot && (
          <img
            src={r.headshot}
            alt={r.name}
            width={52}
            height={52}
            loading="lazy"
            style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 28%', border: '2px solid #fff', boxShadow: '0 5px 16px rgba(15,28,46,0.2)', flexShrink: 0, marginTop: -4 }}
          />
        )}
      </div>
      <p
        style={{
          fontFamily: 'Inter, sans-serif', fontSize: 14.5, lineHeight: 1.62, color: TU.navy, opacity: 0.82, marginTop: 14,
          ...(open ? {} : { display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }),
        }}
      >
        “{r.text}”
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          style={{ fontFamily: 'Inter, sans-serif', alignSelf: 'flex-start', marginTop: 10, fontSize: 13, fontWeight: 600, color: TU.crimson, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        >
          {open ? 'Read less' : 'Read full review →'}
        </button>
      )}
      <div style={{ marginTop: 'auto', paddingTop: 18, borderTop: `1px solid ${TU.divider}` }}>
        <div style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 16, color: TU.navy }}>{r.name}</div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: TU.navy, opacity: 0.42, marginTop: 8 }}>
          Admitted to
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12.5, lineHeight: 1.5, color: TU.crimson, fontWeight: 600, marginTop: 3 }}>
          {admitted.join(' · ')}
        </div>
      </div>
    </Reveal>
  );
}

// Landing-page review lineup, all four, with Yash shown second.
const LANDING_REVIEWS = ['Samanyu', 'Yash', 'Adam', 'Brody']
  .map((n) => REVIEWS.find((r) => r.name === n))
  .filter((r): r is ReviewRecord => Boolean(r));

export default function LandingPage() {
  useEffect(() => {
    track.landingView('meta_ads');
  }, []);

  return (
    <div style={{ background: TU.navy }}>
      <Seo
        title="Transfer to a Top University: Strategy Consultation | TransferringUP"
        description="Specialist transfer admissions consulting. From a 2.9 GPA to Cornell in one year, now a repeatable system. Request a strategy consultation and custom quote."
        path="/get-started"
        noindex
      />

      {/* ───────────────────────── HERO, cinematic + form ───────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: TU.navy }}>
        <div aria-hidden className="absolute inset-0">
          <img src="/images/campus/cornell.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(15,28,46,0.96) 0%, rgba(15,28,46,0.82) 42%, rgba(15,28,46,0.62) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,28,46,0.5) 0%, transparent 30%, transparent 70%, rgba(15,28,46,0.85) 100%)' }} />
        </div>

        <header className="relative z-10 flex items-center justify-between" style={{ padding: '18px max(20px, 5vw)' }}>
          <a href="/" className="flex items-center gap-2.5">
            <img src="/tupng.png" alt="TransferringUP" style={{ height: 26, width: 'auto', display: 'block' }} />
            <span style={{ ...serif, fontSize: 20, fontWeight: 700, color: TU.offwhite }}>Transferring Up</span>
          </a>
          <a href="tel:+16462462458" className="hidden sm:block" style={{ ...sans, fontSize: 14, fontWeight: 600, color: TU.offwhite, opacity: 0.85 }}>
            (646) 246-2458
          </a>
        </header>

        <div className="relative z-10 mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] items-center" style={{ maxWidth: 1240, gap: 'clamp(26px, 5vw, 76px)', padding: 'clamp(18px, 5vw, 64px) max(20px, 5vw) clamp(40px, 8vw, 96px)' }}>
          <Reveal>
            <p style={{ ...serif, fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(18px, 1.8vw, 23px)', color: TU.offwhite, opacity: 0.8 }}>
              Everyone said it was impossible.
            </p>
            <h1 style={{ ...serif, fontWeight: 700, fontSize: 'clamp(44px, 6vw, 76px)', color: TU.offwhite, lineHeight: 0.96, letterSpacing: '-0.03em', marginTop: 12 }}>
              Written off
              <br />
              the first time?
              <br />
              <span>Transfer up<span style={{ color: TU.crimson }}>.</span></span>
            </h1>
            <div style={{ width: 56, height: 2, background: TU.crimson, margin: 'clamp(18px, 4vw, 28px) 0' }} />
            <p style={{ ...sans, fontSize: 'clamp(16px, 1.3vw, 18px)', lineHeight: 1.66, color: TU.offwhite, opacity: 0.82, maxWidth: 480 }}>
              Our founder turned a 2.9 GPA into Cornell, UVA, Michigan, NYU, and USC in one year,
              then built the system that does it again. Request a strategy consultation and we’ll
              show you exactly how we’d handle your transfer.
            </p>

            <div style={{ marginTop: 'clamp(20px, 4vw, 30px)' }}>
              <div style={{ ...sans, fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: TU.offwhite, opacity: 0.5, marginBottom: 14 }}>
                Accepted in one year to
              </div>
              <div className="flex items-center flex-wrap" style={{ gap: 12 }}>
                {ACCEPTED.map((s) => (
                  <span key={s.short} title={s.name} className="flex items-center justify-center shrink-0" style={{ width: 44, height: 44, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                    <img src={s.logo} alt={s.name} style={{ height: 26, width: 'auto', objectFit: 'contain' }} />
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center" style={{ gap: 12, marginTop: 'clamp(16px, 3.5vw, 26px)' }}>
              <Stars rating={5} />
              <span style={{ ...sans, fontSize: 13.5, color: TU.offwhite, opacity: 0.78 }}>
                {REVIEW_AGGREGATE.ratingValue} / 5.0 · verified client reviews
              </span>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div id="apply" style={{ background: '#FFFFFF', borderRadius: 16, overflow: 'hidden', boxShadow: '0 40px 90px rgba(0,0,0,0.5)' }}>
              <div style={{ height: 4, background: `linear-gradient(90deg, ${TU.crimson}, ${TU.gold})` }} />
              <div style={{ padding: 'clamp(24px, 3vw, 36px)' }}>
                <div style={{ ...sans, display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9A7B1F', marginBottom: 12 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: '#9A7B1F' }} />
                  Premium, extremely personalized service
                </div>
                <h2 style={{ ...serif, fontWeight: 700, fontSize: 'clamp(23px, 2.4vw, 29px)', color: TU.navy }}>
                  Request Your Consultation
                </h2>
                <p style={{ ...sans, fontSize: 14, color: TU.navy, opacity: 0.6, marginTop: 6, marginBottom: 16 }}>
                  Tell us about your transfer. We’ll map the path to your top schools and show you
                  exactly how we’d get you there.
                </p>
                <div style={{ borderLeft: `3px solid ${TU.gold}`, background: 'rgba(201,162,39,0.06)', borderRadius: '0 8px 8px 0', padding: '11px 14px', marginBottom: 22 }}>
                  <p style={{ ...sans, fontSize: 12.5, lineHeight: 1.55, color: TU.navy, opacity: 0.8, margin: 0 }}>
                    <strong style={{ fontWeight: 700 }}>Please note:</strong> this isn’t a free advising session. It’s a
                    call to learn about our services, how we run things, how we can help you, and your custom quote.
                  </p>
                </div>
                <ApplicationForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ──────── What you’re applying for: the complete package ──────── */}
      <section style={{ background: TU.navy, padding: 'clamp(40px, 7vw, 80px) max(20px, 5vw) clamp(56px, 8vw, 96px)' }}>
        <Reveal className="mx-auto text-center" style={{ maxWidth: 700 }}>
          <div style={{ ...sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: TU.gold, opacity: 0.92 }}>
            What you’re applying for
          </div>
          <h2 style={{ ...serif, fontWeight: 700, fontSize: 'clamp(28px, 3.6vw, 44px)', color: TU.offwhite, letterSpacing: '-0.02em', lineHeight: 1.08, marginTop: 12 }}>
            One package. Everything included.
          </h2>
          <p style={{ ...sans, fontSize: 16, lineHeight: 1.65, color: TU.offwhite, opacity: 0.66, maxWidth: 520, margin: '16px auto 0' }}>
            No flat price tag. Every plan is quoted to your starting point, and every client gets the full system below.
          </p>
        </Reveal>
        <Reveal className="mx-auto" style={{ maxWidth: 560 }}>
          <PackageCard ctaHref="#apply" ctaLabel="Apply for your spot →" />
        </Reveal>
      </section>

      <SectionSeam from={TU.navy} to="#FFFFFF" />

      {/* ──────── Every placement, on the record, RESULTS lifted high for proof ──────── */}
      <OurEdge />

      <SectionSeam from="#FFFFFF" to={TU.navy} />

      {/* ──────── The scroll-through campus collage (the homepage set-piece) ──────── */}
      <ReceiptsScroll cta={{ href: '#apply', label: 'Request my consultation →' }} />

      <SectionSeam from={TU.navy} to={TU.cream} />

      {/* ───────────────────────── REVIEWS (cream) ───────────────────────── */}
      <section style={{ background: TU.cream, padding: 'clamp(64px, 9vw, 112px) max(20px, 5vw)' }}>
        <div className="mx-auto" style={{ maxWidth: 1120 }}>
          <Reveal className="text-center" style={{ marginBottom: 'clamp(36px, 5vw, 52px)' }}>
            <h2 style={{ ...serif, fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(30px, 4vw, 50px)', color: TU.navy, letterSpacing: '-0.02em' }}>
              In their words.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 items-start" style={{ gap: 'clamp(18px, 2.4vw, 28px)' }}>
            {LANDING_REVIEWS.map((r, i) => (
              <ReviewCard key={r.name + i} r={r} delay={(i % 2) * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── FOUNDER (cream) ───────────────────────── */}
      <section style={{ background: TU.cream, padding: '0 max(20px, 5vw) clamp(72px, 10vw, 120px)' }}>
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] items-center" style={{ maxWidth: 1040, gap: 'clamp(32px, 5vw, 64px)' }}>
          <Reveal className="flex justify-center">
            <img
              src="/ajay-linkedin.jpg"
              alt="Ajay Sharma, founder of TransferringUP, Cornell transfer admissions consultant"
              style={{ width: 'clamp(180px, 24vw, 240px)', aspectRatio: '1 / 1', objectFit: 'cover', objectPosition: 'center 12%', borderRadius: '50%', border: '5px solid #fff', boxShadow: '0 28px 60px rgba(15,28,46,0.22)' }}
            />
          </Reveal>
          <Reveal delay={80}>
            <div style={{ ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: TU.crimson }}>
              Built by someone who did it
            </div>
            <blockquote style={{ ...serif, fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(22px, 2.6vw, 32px)', lineHeight: 1.35, color: TU.navy, marginTop: 16, letterSpacing: '-0.01em' }}>
              “Freshman year of high school I had a 1.25 GPA, ranked 399 of 411. One year of obsessing
              over the transfer process later, I was at Cornell. Now I help other underdogs do the
              same.”
            </blockquote>
            <div style={{ ...sans, fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: TU.navy, opacity: 0.5, marginTop: 22 }}>
              Ajay Sharma · Founder · Cornell University
            </div>
          </Reveal>
        </div>
      </section>

      <SectionSeam from={TU.cream} to="#FFFFFF" />

      {/* ───────────────────────── THE TEAM (Ajay & Caleb + consultants) ───────────────────────── */}
      <TeamTeaser />

      <SectionSeam from="#FFFFFF" to={TU.navy} />

      {/* ───────────────────────── FINAL CTA (cinematic) ───────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: TU.navy, padding: 'clamp(64px, 9vw, 112px) max(20px, 5vw)' }}>
        <div aria-hidden className="absolute inset-0">
          <img src="/images/campus/michigan.webp" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ opacity: 0.32 }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,28,46,0.86), rgba(10,16,24,0.95))' }} />
        </div>
        <div className="relative z-10 mx-auto text-center" style={{ maxWidth: 680 }}>
          <h2 style={{ ...serif, fontWeight: 700, fontSize: 'clamp(32px, 4.4vw, 56px)', color: TU.offwhite, letterSpacing: '-0.02em', lineHeight: 1.06 }}>
            Your transfer starts with one conversation.
          </h2>
          <p style={{ ...sans, fontSize: 17, lineHeight: 1.6, color: TU.offwhite, opacity: 0.78, marginTop: 18 }}>
            Spots are limited each cycle. Request your strategy consultation and see exactly
            how we’d handle your transfer.
          </p>
          <a
            href="#apply"
            onClick={() => track.startTransfer('landing_final_cta')}
            className="inline-flex items-center group"
            style={{ marginTop: 30, gap: 10, background: TU.crimson, color: TU.offwhite, padding: '17px 46px', borderRadius: 4, ...sans, fontSize: 15, fontWeight: 600, letterSpacing: '0.02em', boxShadow: '0 16px 36px -10px rgba(122,0,0,0.8)' }}
          >
            Request my consultation
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </div>
      </section>

      {/* Minimal footer */}
      <footer style={{ background: '#0A1018', padding: '30px max(20px, 5vw)', textAlign: 'center' }}>
        <div style={{ ...sans, fontSize: 13, color: TU.offwhite, opacity: 0.6 }}>
          <a href="mailto:ajay@transferringup.com" style={{ color: TU.offwhite }}>ajay@transferringup.com</a>
          {'  ·  '}
          <a href="tel:+16462462458" style={{ color: TU.offwhite }}>(646) 246-2458</a>
        </div>
        <div style={{ ...sans, fontSize: 12, color: TU.offwhite, opacity: 0.35, marginTop: 8 }}>
          © 2025 TransferringUP. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
