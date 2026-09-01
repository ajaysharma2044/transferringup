import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { recordPageView } from './leadSignals';
import { trackPageChange } from './visitTracker';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const GA_ID = 'G-LTQDXNF9YW';

/**
 * Fire a conversion/interaction event to BOTH GA4 and the Meta Pixel.
 * @param gaName     GA4 event name (snake_case)
 * @param params     extra params (sent to both)
 * @param metaEvent  a Meta STANDARD event (e.g. 'Schedule', 'Lead', 'Contact',
 *                   'InitiateCheckout', 'ViewContent') → fbq('track', …). If
 *                   omitted, fires fbq('trackCustom', gaName, …) instead.
 */
export function trackEvent(
  gaName: string,
  params: Record<string, unknown> = {},
  metaEvent?: string,
): void {
  if (typeof window === 'undefined') return;
  try {
    window.gtag?.('event', gaName, { ...params, send_to: GA_ID });
  } catch {
    /* gtag not loaded */
  }
  try {
    if (metaEvent) window.fbq?.('track', metaEvent, params);
    else window.fbq?.('trackCustom', gaName, params);
  } catch {
    /* fbq not loaded */
  }
}

/** Named helpers for the key funnel steps — keeps event names consistent. */
export const track = {
  /** Any primary CTA button click (micro-conversion). */
  cta: (label: string, location: string) =>
    trackEvent('cta_click', { label, location }),
  /** "Start My Transfer" intent — top of the lead funnel. */
  startTransfer: (location: string) =>
    trackEvent('start_transfer_click', { location }, 'InitiateCheckout'),
  /** Opened / clicked the booking calendar (strategy call). */
  booking: (location: string) =>
    trackEvent('booking_click', { location }, 'Schedule'),
  /** Viewed the pricing/package section or page. */
  viewPricing: (location: string) =>
    trackEvent('view_pricing', { location }, 'ViewContent'),
  /** Landed on the paid-ads landing page. */
  landingView: (campaign: string) =>
    trackEvent('landing_view', { campaign }, 'ViewContent'),
};

/**
 * Fires a Google Analytics `page_view` and a Meta Pixel `PageView` on every
 * client-side route change.
 *
 * The scripts themselves live in index.html (so they're present in the <head>
 * of every statically-prerendered page and fire on the initial/direct load).
 * Because this is an SPA, in-app navigations don't reload the page — this hook
 * re-fires the page-view events for those. The very first render is skipped so
 * the initial load isn't double-counted.
 */
export function usePageTracking() {
  const location = useLocation();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (typeof window === 'undefined') return;

    const pagePath = location.pathname + location.search;
    recordPageView(location.pathname); // feeds the lead-signal engagement trail
    trackPageChange(location.pathname); // per-page dwell + timeline for profiles

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: pagePath,
        page_location: window.location.href,
        page_title: document.title,
        send_to: GA_ID,
      });
    }

    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [location.pathname, location.search]);
}
