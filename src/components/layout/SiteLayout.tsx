import { Outlet } from 'react-router-dom';
import AnnouncementBar from '../home/AnnouncementBar';
import Navbar from '../home/Navbar';
import SiteFooter from '../home/SiteFooter';
import StickyBottomBar from '../home/StickyBottomBar';
import QuickQuestion from '../QuickQuestion';
import { useSmoothScroll } from '../../lib/smoothScroll';
import { usePageTracking } from '../../lib/analytics';
import { useEffect } from 'react';
import { initVisitTracking } from '../../lib/visitTracker';
import { initAdTracking } from '../../lib/adTracking';

export default function SiteLayout() {
  useSmoothScroll();
  usePageTracking();
  useEffect(() => { initVisitTracking(); initAdTracking(); }, []);
  return (
    <div style={{ background: '#0F1C2E', overflowX: 'clip' }}>
      <AnnouncementBar />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
      {/* Spacer so the fixed bottom bar never overlaps footer content */}
      <div aria-hidden style={{ height: 64, background: '#0F1C2E' }} />
      <StickyBottomBar />
      <QuickQuestion />
    </div>
  );
}
