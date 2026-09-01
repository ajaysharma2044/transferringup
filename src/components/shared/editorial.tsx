import type { CSSProperties } from 'react';
import { TU } from '../home/shared';

/**
 * Numbered editorial eyebrow, e.g. "01, THE GUARANTEE".
 * The magazine-style section label that gives the site Ivy-Coach structure.
 */
export function Eyebrow({
  index,
  label,
  dark = false,
  align = 'center',
  style,
}: {
  index?: string;
  label: string;
  dark?: boolean;
  align?: 'center' | 'left';
  style?: CSSProperties;
}) {
  const fg = dark ? TU.offwhite : TU.navy;
  return (
    <div
      className="flex items-center"
      style={{
        gap: 12,
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        ...style,
      }}
    >
      {index && (
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: TU.crimson,
          }}
        >
          {index}
        </span>
      )}
      <span style={{ width: 24, height: 1, background: TU.crimson, opacity: 0.8 }} />
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: fg,
          opacity: 0.7,
        }}
      >
        {label}
      </span>
    </div>
  );
}

/** Thin editorial rule. */
export function Rule({ dark = false, width = 56, style }: { dark?: boolean; width?: number; style?: CSSProperties }) {
  return (
    <div
      style={{
        width,
        height: 2,
        background: dark ? 'rgba(243,245,240,0.25)' : TU.crimson,
        ...style,
      }}
    />
  );
}

/**
 * Elegant placeholder portrait, monogram on a navy→crimson gradient with an
 * editorial caption. Stands in for real student photography until photos arrive,
 * without ever rendering a broken image.
 */
export function PortraitPlaceholder({
  name,
  caption,
  ratio = '4 / 5',
  rounded = 4,
  style,
}: {
  name: string;
  caption?: string;
  ratio?: string;
  rounded?: number;
  style?: CSSProperties;
}) {
  const initials = name
    .split(/\s+/)
    .map((w) => w.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{
        aspectRatio: ratio,
        borderRadius: rounded,
        background: `linear-gradient(150deg, ${TU.navy} 0%, #16263b 55%, #3a1418 100%)`,
        ...style,
      }}
    >
      {/* subtle grain/vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 120% at 30% 20%, rgba(243,245,240,0.08), transparent 60%)' }}
      />
      <span
        style={{
          fontFamily: '"Fraunces", serif',
          fontWeight: 700,
          fontSize: 'clamp(48px, 7vw, 84px)',
          color: TU.cream,
          opacity: 0.85,
          letterSpacing: '0.02em',
        }}
      >
        {initials}
      </span>
      {caption && (
        <div
          className="absolute left-0 bottom-0"
          style={{
            background: 'rgba(15,28,46,0.85)',
            color: TU.offwhite,
            fontFamily: 'Inter, sans-serif',
            fontSize: 12,
            letterSpacing: '0.04em',
            padding: '10px 16px',
          }}
        >
          {caption}
        </div>
      )}
      {/* tiny "placeholder" marker, unobtrusive */}
      <span
        className="absolute"
        style={{
          top: 10,
          right: 12,
          fontFamily: 'Inter, sans-serif',
          fontSize: 9,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: TU.offwhite,
          opacity: 0.3,
        }}
      >
        Photo
      </span>
    </div>
  );
}

/** A small "placeholder" tag chip. */
function PlaceholderTag({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className="absolute"
      style={{
        top: 10,
        right: 10,
        fontFamily: 'Inter, sans-serif',
        fontSize: 8,
        fontWeight: 600,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: dark ? TU.offwhite : TU.navy,
        opacity: 0.35,
        border: `1px solid ${dark ? 'rgba(243,245,240,0.3)' : 'rgba(15,28,46,0.25)'}`,
        padding: '3px 6px',
        borderRadius: 2,
      }}
    >
      Placeholder
    </span>
  );
}

/**
 * Stylized acceptance-letter placeholder, paper card with a crest, redacted
 * body lines, and an "Admitted" stamp. Stands in for a real acceptance letter
 * scan without rendering a broken image.
 */
export function LetterPlaceholder({
  school,
  logo,
  style,
}: {
  school: string;
  logo?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        aspectRatio: '17 / 22',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FBF8F1 100%)',
        borderRadius: 4,
        border: '1px solid rgba(15,28,46,0.1)',
        boxShadow: '0 24px 60px rgba(15,28,46,0.18)',
        padding: '26px 24px',
        ...style,
      }}
    >
      <div className="flex flex-col items-center text-center" style={{ gap: 8 }}>
        {logo ? (
          <img src={logo} alt={school} style={{ height: 34, width: 'auto', objectFit: 'contain', opacity: 0.85 }} loading="lazy" />
        ) : (
          <div style={{ width: 30, height: 30, borderRadius: 999, background: 'rgba(15,28,46,0.1)' }} />
        )}
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 9,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: TU.navy,
            opacity: 0.5,
          }}
        >
          Office of Admissions
        </div>
      </div>

      <div style={{ fontFamily: '"Fraunces", serif', fontSize: 14, color: TU.navy, opacity: 0.85, marginTop: 18 }}>
        Dear Applicant,
      </div>
      {/* redacted body lines */}
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 7 }}>
        {[1, 0.95, 0.88, 0.97, 0.7].map((w, i) => (
          <span key={i} style={{ height: 6, width: `${w * 100}%`, background: 'rgba(15,28,46,0.1)', borderRadius: 2 }} />
        ))}
      </div>

      {/* admitted stamp */}
      <div
        style={{
          marginTop: 18,
          display: 'inline-block',
          border: `2px solid ${TU.crimson}`,
          color: TU.crimson,
          fontFamily: 'Inter, sans-serif',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          padding: '6px 12px',
          transform: 'rotate(-4deg)',
        }}
      >
        Admitted
      </div>

      <div
        className="absolute"
        style={{
          left: 24,
          bottom: 20,
          fontFamily: '"Fraunces", serif',
          fontWeight: 700,
          fontSize: 15,
          color: TU.navy,
        }}
      >
        {school}
      </div>
    </div>
  );
}

/**
 * Aerial campus-shot placeholder, wide aspirational band with an abstract
 * "aerial" treatment and a caption. Stands in for real campus photography.
 */
export function CampusPlaceholder({
  campus,
  ratio = '16 / 9',
  style,
}: {
  campus: string;
  ratio?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: ratio,
        background: `linear-gradient(160deg, #1b3454 0%, ${TU.navy} 45%, #0b1622 100%)`,
        ...style,
      }}
    >
      {/* abstract "aerial" blocks suggesting a campus from above */}
      <div className="absolute inset-0" style={{ opacity: 0.16 }}>
        <div className="absolute" style={{ left: '12%', top: '30%', width: '14%', height: '34%', background: TU.cream, transform: 'skewX(-12deg)' }} />
        <div className="absolute" style={{ left: '30%', top: '20%', width: '10%', height: '52%', background: TU.cream, transform: 'skewX(-12deg)' }} />
        <div className="absolute" style={{ left: '46%', top: '38%', width: '18%', height: '30%', background: TU.cream, transform: 'skewX(-12deg)' }} />
        <div className="absolute" style={{ left: '70%', top: '26%', width: '12%', height: '44%', background: TU.cream, transform: 'skewX(-12deg)' }} />
      </div>
      {/* horizon glow */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(80% 60% at 50% 110%, rgba(139,0,0,0.25), transparent 60%)' }} />
      <PlaceholderTag dark />
      <div
        className="absolute flex items-center"
        style={{ left: 'max(20px, 3vw)', bottom: 'max(18px, 3vw)', gap: 10 }}
      >
        <span style={{ width: 6, height: 6, borderRadius: 999, background: TU.crimson }} />
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: TU.offwhite, opacity: 0.85 }}>
          {campus} · Aerial
        </span>
      </div>
    </div>
  );
}
