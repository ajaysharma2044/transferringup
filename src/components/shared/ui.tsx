import type { CSSProperties, ReactNode } from 'react';
import { Reveal, TU } from '../home/shared';

export const SECTION_PAD = 'clamp(72px, 12vw, 128px) clamp(24px, 6vw, 80px)';

type SectionHeaderProps = {
  whisper?: string;
  title: string;
  body?: string;
  dark?: boolean;
  align?: 'center' | 'left';
  as?: 'h1' | 'h2';
};

/** Reusable whisper (Playfair italic) + heading + optional body block. */
export function SectionHeader({
  whisper,
  title,
  body,
  dark = false,
  align = 'center',
  as = 'h2',
}: SectionHeaderProps) {
  const fg = dark ? TU.offwhite : TU.navy;
  const Heading = as;
  return (
    <Reveal style={{ textAlign: align }}>
      {whisper && (
        <p
          style={{
            fontFamily: '"Fraunces", serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 22,
            color: fg,
            opacity: 0.6,
          }}
        >
          {whisper}
        </p>
      )}
      <Heading
        style={{
          fontFamily: '"Fraunces", serif',
          fontWeight: 700,
          fontSize: as === 'h1' ? 'clamp(48px, 5.5vw, 72px)' : 'clamp(44px, 5vw, 64px)',
          color: fg,
          letterSpacing: '-0.02em',
          lineHeight: 1.02,
          marginTop: whisper ? 8 : 0,
        }}
      >
        {title}
      </Heading>
      {body && (
        <p
          className={align === 'center' ? 'mx-auto' : ''}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 18,
            lineHeight: 1.65,
            color: fg,
            opacity: 0.65,
            maxWidth: 560,
            marginTop: 20,
            marginLeft: align === 'center' ? 'auto' : 0,
            marginRight: align === 'center' ? 'auto' : 0,
          }}
        >
          {body}
        </p>
      )}
    </Reveal>
  );
}

type CTAButtonProps = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'light';
  style?: CSSProperties;
};

/** Anchor-based CTA so navigation stays crawlable. */
export function CTAButton({ href, children, variant = 'primary', style }: CTAButtonProps) {
  const base: CSSProperties = {
    display: 'inline-block',
    padding: '14px 32px',
    borderRadius: 3,
    fontFamily: 'Inter, sans-serif',
    fontSize: 15,
    fontWeight: 600,
    transition: 'background-color 200ms ease, border-color 200ms ease',
    ...style,
  };

  if (variant === 'secondary') {
    return (
      <a
        href={href}
        style={{
          ...base,
          background: 'transparent',
          border: '1.5px solid rgba(243,245,240,0.45)',
          color: TU.offwhite,
          fontWeight: 400,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = TU.offwhite)}
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = 'rgba(243,245,240,0.45)')
        }
      >
        {children}
      </a>
    );
  }

  if (variant === 'light') {
    return (
      <a
        href={href}
        style={{ ...base, background: TU.offwhite, color: TU.navy }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#DAC9BB')}
        onMouseLeave={(e) => (e.currentTarget.style.background = TU.offwhite)}
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      style={{ ...base, background: TU.crimson, color: TU.offwhite }}
      onMouseEnter={(e) => (e.currentTarget.style.background = TU.crimsonHover)}
      onMouseLeave={(e) => (e.currentTarget.style.background = TU.crimson)}
    >
      {children}
    </a>
  );
}
