import { Check } from 'lucide-react';
import { Reveal, TU } from './shared';
import { track } from '../../lib/analytics';

const FEATURES: string[] = [
  'Full application strategy & school targeting',
  'Essay coaching, unlimited revision rounds',
  'Extracurricular development & positioning',
  'Recommendation letters + letters of continued interest',
  '24/7 text + weekly calls for 12 months',
  'Interview prep & portal-check support',
  'Unlimited school applications, one transfer cycle',
];

export function PackageCard({
  lean = false,
  ctaHref = '/contact',
  ctaLabel = 'Request your custom quote →',
}: {
  lean?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div
      style={{
        marginTop: lean ? 36 : 44,
        background: 'rgba(243,245,240,0.05)',
        border: '1px solid rgba(243,245,240,0.14)',
        borderRadius: 14,
        padding: 'clamp(28px, 4vw, 44px)',
        maxWidth: 560,
      }}
    >
      {/* Package label */}
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: TU.gold,
        }}
      >
        The Complete Transfer System
      </div>

      {/* Price, quote style */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 14 }}>
        <span
          style={{
            fontFamily: '"Fraunces", serif',
            fontWeight: 700,
            fontSize: 'clamp(34px, 4.4vw, 46px)',
            color: TU.offwhite,
            lineHeight: 1,
          }}
        >
          Custom quote
        </span>
      </div>
      <div
        style={{
          fontFamily: '"Fraunces", serif',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 16,
          color: TU.offwhite,
          opacity: 0.6,
          marginTop: 8,
        }}
      >
        Priced around your starting point, never a flat template.
      </div>

      {/* Included */}
      <div style={{ marginTop: 26, borderTop: '1px solid rgba(243,245,240,0.12)', paddingTop: 22 }}>
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: TU.offwhite,
            opacity: 0.45,
            marginBottom: 16,
          }}
        >
          Every client gets all of it
        </div>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {FEATURES.map((f) => (
            <li key={f} className="flex" style={{ gap: 12, alignItems: 'flex-start' }}>
              <Check size={17} strokeWidth={2.5} style={{ color: TU.gold, flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 15.5, lineHeight: 1.45, color: TU.offwhite, opacity: 0.86 }}>
                {f}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href={ctaHref}
        className="inline-block text-center w-full transition-colors duration-200"
        onClick={() => track.startTransfer('pricing')}
        style={{
          background: TU.offwhite,
          color: TU.navy,
          padding: '16px 40px',
          borderRadius: 4,
          fontFamily: 'Inter, sans-serif',
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: '0.02em',
          marginTop: 28,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#DAC9BB')}
        onMouseLeave={(e) => (e.currentTarget.style.background = TU.offwhite)}
      >
        {ctaLabel}
      </a>

      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 12.5,
          color: TU.offwhite,
          opacity: 0.4,
          marginTop: 14,
          textAlign: 'center',
        }}
      >
        Installment plans available · Spots are limited
      </p>
    </div>
  );
}

export default function PricingCTA({ lean = false }: { lean?: boolean }) {
  return (
    <section
      id="apply"
      style={{ background: TU.navy, padding: 'clamp(72px, 12vw, 128px) clamp(24px, 6vw, 80px)' }}
    >
      <Reveal className="mx-auto" style={{ maxWidth: 760 }}>
        <p
          style={{
            fontFamily: '"Fraunces", serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 22,
            color: TU.offwhite,
            opacity: 0.55,
          }}
        >
          One investment. One year. One transfer done right.
        </p>
        <h2
          style={{
            fontFamily: '"Fraunces", serif',
            fontWeight: 700,
            fontSize: 'clamp(40px, 5vw, 60px)',
            color: TU.offwhite,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginTop: 12,
          }}
        >
          Full-Service Advising.
          <br />
          Built Around You.
        </h2>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 18,
            lineHeight: 1.65,
            color: TU.offwhite,
            opacity: 0.65,
            marginTop: 24,
            maxWidth: 560,
          }}
        >
          There’s no flat price tag. Every plan is quoted to your exact starting point and goals.
          Tell us where you stand, and we’ll send a custom quote for the one complete package below.
        </p>

        <PackageCard lean={lean} />
      </Reveal>
    </section>
  );
}
