import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { TU } from './shared';
import { PRIMARY_NAV, SECONDARY_NAV, type NavGroup } from '../../data/nav';
import { track } from '../../lib/analytics';

const linkStyle = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
  color: TU.offwhite,
};

function NavItem({ item, align = 'left' }: { item: NavGroup; align?: 'left' | 'right' }) {
  if (!item.children) {
    return (
      <a href={item.href} className="transition-opacity duration-150 hover:opacity-60" style={linkStyle}>
        {item.label}
      </a>
    );
  }
  return (
    <div className="relative group">
      <a
        href={item.href}
        className="flex items-center gap-1 transition-opacity duration-150 hover:opacity-60"
        style={linkStyle}
      >
        {item.label}
        <ChevronDown size={12} className="transition-transform duration-200 group-hover:rotate-180" style={{ opacity: 0.6 }} />
      </a>
      {/* dropdown panel (pt-3 forms a hover bridge) */}
      <div
        className={`absolute top-full ${align === 'right' ? 'right-0' : 'left-0'} pt-3 z-50 hidden group-hover:block group-focus-within:block`}
      >
        <div
          style={{
            background: 'rgba(15,28,46,0.98)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(243,245,240,0.12)',
            borderRadius: 6,
            padding: '8px 0',
            minWidth: 220,
            boxShadow: '0 22px 50px rgba(0,0,0,0.45)',
          }}
        >
          {item.children.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="block transition-colors duration-150"
              style={{
                padding: '9px 18px',
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                letterSpacing: '0.02em',
                color: TU.offwhite,
                opacity: 0.7,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
            >
              {c.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const solid = scrolled || !isHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: solid ? 'rgba(13,24,40,0.98)' : 'transparent',
      }}
    >
      <nav
        className="mx-auto grid items-center"
        style={{ maxWidth: 1320, padding: '16px max(24px, 4vw)', gridTemplateColumns: '1fr auto 1fr', columnGap: 'clamp(28px, 4vw, 56px)' }}
      >
        {/* Left nav, hugs the logo (justify-end) so the bar reads as one centred
            cluster instead of links floating at the far edge. The cell stays in the
            grid on mobile (inner links hidden) so the logo is always dead-centre. */}
        <div className="flex items-center justify-end" style={{ minWidth: 0 }}>
          <div className="hidden lg:flex items-center gap-6">
            {PRIMARY_NAV.map((item) => (
              <NavItem key={item.label} item={item} align="left" />
            ))}
          </div>
        </div>

        {/* Center logo */}
        <a href="/" className="flex items-center gap-2.5 justify-self-center">
          <img src="/tupng.png" alt="Transferring Up" style={{ height: 27, width: 'auto', display: 'block' }} />
          <span style={{ fontFamily: '"Fraunces", serif', fontSize: 21, fontWeight: 700, color: TU.offwhite, whiteSpace: 'nowrap' }}>
            Transferring Up
          </span>
        </a>

        {/* Right cell, desktop: nav links hug the logo (mirroring the left), CTA
            pinned to the far-right corner. Mobile: only the toggle, kept at right. */}
        <div className="flex items-center justify-end gap-8" style={{ minWidth: 0 }}>
          <div className="hidden lg:flex items-center gap-6 w-full">
            {SECONDARY_NAV.map((item) => (
              <NavItem key={item.label} item={item} align="right" />
            ))}
            <a
              href="/contact"
              className="transition-colors duration-200 whitespace-nowrap"
              onClick={() => track.startTransfer('navbar')}
              style={{ marginLeft: 'auto', background: TU.crimson, color: TU.offwhite, padding: '10px 18px', borderRadius: 2, fontFamily: 'Inter, sans-serif', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = TU.crimsonHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = TU.crimson)}
            >
              Start My Transfer
            </a>
          </div>

          {/* Mobile toggle */}
          <button type="button" aria-label="Toggle menu" className="lg:hidden" style={{ color: TU.offwhite }} onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu, parents + indented section links */}
      {menuOpen && (
        <div className="lg:hidden flex flex-col gap-1 px-6 pb-8 pt-2 max-h-[80vh] overflow-y-auto" style={{ background: 'rgba(15,28,46,0.99)' }}>
          {[...PRIMARY_NAV, ...SECONDARY_NAV].map((item) => (
            <div key={item.label} style={{ paddingTop: 16, paddingBottom: 6 }}>
              <a
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: '"Fraunces", serif',
                  fontWeight: 700,
                  fontSize: 26,
                  letterSpacing: '-0.01em',
                  color: TU.offwhite,
                  display: 'block',
                  paddingBottom: 8,
                }}
              >
                {item.label}
              </a>
              {item.children?.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  onClick={() => setMenuOpen(false)}
                  className="block"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 500, color: TU.offwhite, opacity: 0.7, padding: '9px 0 9px 16px' }}
                >
                  {c.label}
                </a>
              ))}
            </div>
          ))}
          <a
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="text-center"
            style={{ background: TU.crimson, color: TU.offwhite, padding: '12px 22px', borderRadius: 3, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: '0.03em', marginTop: 12 }}
          >
            Start My Transfer
          </a>
        </div>
      )}
    </header>
  );
}
