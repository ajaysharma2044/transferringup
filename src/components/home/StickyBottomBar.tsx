import { useEffect, useState } from 'react';
import { TU } from './shared';
import { track } from '../../lib/analytics';

export default function StickyBottomBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 200);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed left-0 right-0 bottom-0 flex items-center justify-between gap-4"
      style={{
        zIndex: 1000,
        background: TU.navyDeep,
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '14px clamp(20px, 5vw, 48px)',
        transform: show ? 'translateY(0)' : 'translateY(100%)',
        opacity: show ? 1 : 0,
        transition: 'transform 300ms ease, opacity 300ms ease',
      }}
    >
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 15,
          color: 'rgba(255,255,255,0.82)',
        }}
        className="hidden sm:block"
      >
        Specialist transfer admissions for students the system passed on. Spots are limited.
      </p>
      <a
        href="/contact"
        className="transition-colors duration-200 whitespace-nowrap"
        onClick={() => track.startTransfer('sticky_bar')}
        style={{
          background: TU.crimson,
          color: TU.offwhite,
          padding: '11px 26px',
          borderRadius: 3,
          fontFamily: 'Inter, sans-serif',
          fontSize: 14,
          fontWeight: 600,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = TU.crimsonHover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = TU.crimson)}
      >
        Start My Transfer
      </a>
    </div>
  );
}
