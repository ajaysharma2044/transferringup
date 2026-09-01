import { TU } from './shared';
import { BBB_PROFILE_URL, BBB_RATING } from '../../lib/schema';

// Each homepage section gets a dedicated link here.
const EXPLORE = [
  { label: 'The Record', href: '/#edge' },
  { label: 'Our Approach', href: '/#edge' },
  { label: 'The Receipts', href: '/#letters' },
  { label: 'In Their Words', href: '/#words' },
  { label: 'The Founder', href: '/#founder' },
  { label: 'The Team', href: '/#team' },
  { label: 'The System', href: '/#system' },
];

const COMPANY = [
  { label: 'Our Story', href: '/about' },
  { label: 'Services & Pricing', href: '/services' },
  { label: 'Results', href: '/results' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Blog', href: '/blog' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
];

const headerStyle = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  color: TU.offwhite,
  opacity: 0.35,
  marginBottom: 18,
};

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="block transition-opacity duration-200"
      style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: 14,
        color: TU.offwhite,
        opacity: 0.55,
        marginBottom: 12,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.55')}
    >
      {label}
    </a>
  );
}

export default function SiteFooter() {
  return (
    <footer
      id="footer"
      style={{
        background: TU.navyDeep,
        borderTop: '1px solid rgba(243,245,240,0.07)',
        padding: '80px clamp(24px, 6vw, 80px) 48px',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/tupng.png" alt="Transferring Up" style={{ height: 30, width: 'auto', display: 'block' }} />
              <span
                style={{
                  fontFamily: '"Fraunces", serif',
                  fontSize: 22,
                  fontWeight: 700,
                  color: TU.offwhite,
                }}
              >
                Transferring Up
              </span>
            </div>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                lineHeight: 1.65,
                color: TU.offwhite,
                opacity: 0.5,
                marginTop: 14,
                maxWidth: 220,
              }}
            >
              Our founder got into Cornell with a 2.9 GPA. We turned that into a system and now
              run it for every student we work with, nationwide.
            </p>
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                color: TU.offwhite,
                opacity: 0.4,
                marginTop: 24,
                lineHeight: 1.8,
              }}
            >
              <div>ajay@transferringup.com</div>
              <div>(646) 246-2458</div>
              <div>Concord, NC</div>
            </div>

            {/* Official BBB Accredited Business seal, linked to our profile.
                Seal image lives at public/bbb-seal.png (the color seal). */}
            <a
              href={BBB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Better Business Bureau Accredited Business, ${BBB_RATING} rating, view our BBB profile`}
              className="inline-flex items-center transition-opacity duration-200"
              style={{
                gap: 12,
                marginTop: 26,
                padding: '12px 16px',
                borderRadius: 12,
                background: '#FFFFFF',
                boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <img
                src="/bbb-seal.png"
                alt={`BBB Accredited Business, ${BBB_RATING} Rating`}
                width={56}
                height={88}
                style={{ height: 88, width: 'auto', display: 'block' }}
              />
              <span style={{ lineHeight: 1.35 }}>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 13,
                    fontWeight: 700,
                    color: TU.navy,
                    letterSpacing: '0.01em',
                  }}
                >
                  Accredited Business
                </span>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 11.5,
                    color: TU.navy,
                    opacity: 0.55,
                    marginTop: 2,
                  }}
                >
                  {BBB_RATING} Rating · BBB Verified
                </span>
              </span>
            </a>
          </div>

          {/* Explore (section anchors) */}
          <div>
            <div style={headerStyle}>Explore</div>
            {EXPLORE.map((s) => (
              <FooterLink key={s.label} label={s.label} href={s.href} />
            ))}
          </div>

          {/* Company (pages) */}
          <div>
            <div style={headerStyle}>Company</div>
            {COMPANY.map((s) => (
              <FooterLink key={s.label} label={s.label} href={s.href} />
            ))}
          </div>

        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{
            marginTop: 56,
            paddingTop: 28,
            borderTop: '1px solid rgba(243,245,240,0.07)',
          }}
        >
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              color: TU.offwhite,
              opacity: 0.3,
            }}
          >
            © 2025 Transferring Up. All rights reserved.
          </span>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              color: TU.offwhite,
              opacity: 0.3,
            }}
          >
            Privacy Policy · Terms of Service
          </span>
        </div>
      </div>
    </footer>
  );
}
