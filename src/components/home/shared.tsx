import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';

/** Exact design tokens, single source of truth for inline values. */
export const TU = {
  navy: '#0F1C2E',
  navyDeep: '#0A1520',
  cream: '#F8F4EE',
  offwhite: '#F3F5F0',
  crimson: '#7A0000',
  crimsonHover: '#5e0000',
  gold: '#D4AA00',
  muted: 'rgba(243,245,240,0.12)',
  divider: 'rgba(15,28,46,0.12)',
} as const;

/** Reusable IntersectionObserver, fires once when `threshold` is crossed. */
export function useInView<T extends Element>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

type RevealProps = {
  as?: ElementType;
  delay?: number;
  threshold?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * Entrance wrapper: opacity 0 + translateY(18px) -> settled over 600ms.
 * `delay` (ms) is used for 80ms sibling staggering.
 */
export function Reveal({
  as: Tag = 'div',
  delay = 0,
  threshold = 0.15,
  className = '',
  style,
  children,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>(threshold);
  return (
    <Tag
      ref={ref}
      className={`tu-reveal${inView ? ' is-visible' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}

type CountUpProps = {
  end: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  style?: CSSProperties;
};

/** Counts 0 -> end on scroll entry. Duration 1200ms, ease-out. */
export function CountUp({
  end,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1200,
  className,
  style,
}: CountUpProps) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  // Initialize at the FINAL value so the SSG-prerendered HTML carries the real
  // number (crawlers and AI engines read "2.8", not "0.0"). The scroll-triggered
  // animation below still counts 0 -> end for human visitors.
  const [value, setValue] = useState(end);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    let start: number | null = null;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      if (start === null) start = now;
      const progress = Math.min((now - start) / duration, 1);
      setValue(end * easeOut(progress));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Safety net: guarantee the final value even if rAF is throttled/missed.
    const done = setTimeout(() => setValue(end), duration + 400);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(done);
    };
  }, [inView, end, duration]);

  // Last resort: if the observer never fires (offscreen quirks), still show the
  // final number rather than a stuck 0.
  useEffect(() => {
    const t = setTimeout(() => setValue((v) => (v === 0 && end !== 0 ? end : v)), 2500);
    return () => clearTimeout(t);
  }, [end]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
