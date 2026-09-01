import { useEffect } from 'react';

/**
 * Premium momentum scrolling (Lenis). Gives the whole site that buttery,
 * "immersed" feel where the page glides under you instead of snapping.
 *
 * - Skipped entirely when the user prefers reduced motion.
 * - On-page hash links (#edge, /#letters …) scroll smoothly with a navbar offset.
 * - Auto-pauses while a modal/lightbox locks the page (body overflow:hidden),
 *   so background content never scrolls behind an open overlay.
 * - Loaded via dynamic import so it never runs during static prerender.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let lenis: any;
    let rafId = 0;
    let destroyed = false;
    let teardown = () => {};

    import('lenis').then(({ default: Lenis }) => {
      if (destroyed) return;

      lenis = new Lenis({
        lerp: 0.16,           // higher = catches up fast → swift & light, short tail
        wheelMultiplier: 1.15, // a touch more travel per notch so it feels responsive
        smoothWheel: true,
        syncTouch: true,       // 1:1 trackpad/touch — kills the laggy, heavy feel
      });
      (window as any).lenis = lenis;

      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      // Arriving with a hash (e.g. /#system clicked from another page does a full
      // load): jump to that section once painted, since Lenis owns scroll position
      // and the browser's native hash-scroll won't stick.
      if (window.location.hash.length > 1) {
        const target = window.location.hash;
        setTimeout(() => {
          let el: Element | null = null;
          try { el = document.querySelector(target); } catch { el = null; }
          if (el) lenis.scrollTo(el as HTMLElement, { offset: -84, immediate: true });
        }, 250);
      }

      // Smooth on-page anchor navigation
      const onClick = (e: MouseEvent) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
        const a = (e.target as HTMLElement)?.closest?.('a');
        if (!a) return;
        const href = a.getAttribute('href') || '';
        const hash = href.startsWith('#') ? href : href.startsWith('/#') ? href.slice(1) : '';
        if (hash.length < 2) return;
        let el: Element | null = null;
        try { el = document.querySelector(hash); } catch { el = null; }
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, { offset: -84 });
          history.replaceState(null, '', hash);
        }
      };
      document.addEventListener('click', onClick);

      // Pause momentum while an overlay locks the page
      const syncLock = () => {
        if (!lenis) return;
        if (getComputedStyle(document.body).overflow === 'hidden') lenis.stop();
        else lenis.start();
      };
      const mo = new MutationObserver(syncLock);
      mo.observe(document.body, { attributes: true, attributeFilter: ['style'] });

      teardown = () => {
        document.removeEventListener('click', onClick);
        mo.disconnect();
      };
    });

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      teardown();
      if (lenis) {
        lenis.destroy();
        delete (window as any).lenis;
      }
    };
  }, []);
}
