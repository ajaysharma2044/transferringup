import { useEffect, useRef } from 'react';
import { TU } from './shared';
import { SCHOOLS } from '../../data/schools';
import { track } from '../../lib/analytics';

// The founder's five acceptances, with crests.
const ACCEPTED = ['Cornell', 'Vanderbilt', 'Michigan', 'NYU', 'USC']
  .map((short) => SCHOOLS.find((s) => s.short === short))
  .filter((s): s is (typeof SCHOOLS)[number] => Boolean(s));

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // The hero film plays ONLY while the hero is on screen. A 9MB looping video
  // left running off-screen burns GPU/CPU/battery and makes the whole page feel
  // heavy to scroll, so an IntersectionObserver pauses it the moment you scroll
  // past, and resumes when you return. (No 'pause'→play re-assertion, which used
  // to force it to run forever.)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let inView = true;
    const play = () => {
      if (inView) v.play().catch(() => {});
    };
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (inView) play();
        else v.pause();
      },
      { threshold: 0.01 },
    );
    io.observe(v);
    v.addEventListener('loadeddata', play);
    v.addEventListener('stalled', play);
    const onVisible = () => {
      if (!document.hidden) play();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      io.disconnect();
      v.removeEventListener('loadeddata', play);
      v.removeEventListener('stalled', play);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return (
    <section
      id="top"
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100dvh', marginTop: -64, background: TU.navy }}
    >
      {/* Cinematic background. Drop a real campus film at /hero-campus.mp4
          (poster /hero-campus.jpg) and it covers the animated placeholder. */}
      <div className="tu-hero-bg" aria-hidden>
        <span className="tu-hero-bg__block" style={{ left: '10%', top: '24%', width: '13%', height: '46%' }} />
        <span className="tu-hero-bg__block" style={{ left: '28%', top: '16%', width: '9%', height: '62%' }} />
        <span className="tu-hero-bg__block" style={{ left: '52%', top: '30%', width: '16%', height: '40%' }} />
        <span className="tu-hero-bg__block" style={{ left: '74%', top: '20%', width: '11%', height: '54%' }} />
      </div>
      {/* Cinematic background film, shown on every viewport, exactly as designed.
          Same clip, just a smaller encode (3.3 MB) with a real poster frame, and
          preload="metadata" so the poster paints instantly and the film streams in
          afterward instead of blocking first paint. Nothing is hidden or removed. */}
      <video
        ref={videoRef}
        className="tu-hero-video absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/hero-campus.jpg"
      >
        <source src="/hero-campus.mp4" type="video/mp4" />
      </video>

      {/* Scrim, keeps the headline razor-sharp over any footage */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(15,28,46,0.92) 0%, rgba(15,28,46,0.72) 45%, rgba(15,28,46,0.55) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(15,28,46,0.55) 0%, transparent 28%, transparent 64%, rgba(15,28,46,0.78) 100%)',
        }}
      />

      {/* Evidence composite, Cornell acceptance letter + GPA/class-rank card,
          floating over the aerial film on the right (desktop only). */}
      <div
        className="absolute z-10 hidden lg:block"
        style={{ right: 'max(40px, 4vw)', top: '50%', transform: 'translateY(-50%)', width: 'min(36%, 430px)' }}
      >
        <div className="relative" style={{ aspectRatio: '4 / 5' }}>
          {/* Acceptance letter */}
          <div className="absolute inset-0" style={{ transform: 'rotate(-3deg)' }}>
            <div style={{ background: '#fff', padding: 7, borderRadius: 10, boxShadow: '0 34px 80px rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.5)' }}>
              <img
                src="/IMG_5249.webp"
                srcSet="/IMG_5249-640.webp 640w, /IMG_5249.webp 1000w"
                sizes="430px"
                alt="Cornell University acceptance letter, admitted to the Jeb E. Brooks School of Public Policy"
                width={1000}
                height={1731}
                fetchPriority="high"
                style={{ width: '100%', height: 'auto', borderRadius: 5, display: 'block' }}
              />
            </div>
          </div>
          {/* GPA / class-rank card, overlapping top-right */}
          <div className="absolute" style={{ top: '-7%', right: '-9%', width: '58%', transform: 'rotate(3deg)' }}>
            <div style={{ background: '#fff', padding: 6, borderRadius: 8, boxShadow: '0 22px 55px rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.5)' }}>
              <img
                src="/Screenshot_2026-03-27_at_2.34.30_AM.webp"
                alt="Performance information showing a 2.9 cumulative GPA and class rank 323 of 402"
                width={531}
                height={386}
                style={{ width: '100%', height: 'auto', borderRadius: 4, display: 'block' }}
              />
            </div>
          </div>
          {/* Admitted tag */}
          <div
            className="absolute"
            style={{ bottom: '4%', left: '-5%', background: TU.crimson, color: TU.offwhite, fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '7px 14px', borderRadius: 2, transform: 'rotate(-3deg)', boxShadow: '0 10px 24px rgba(0,0,0,0.4)' }}
          >
            Admitted · Cornell
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center" style={{ minHeight: '100dvh', paddingTop: 64 }}>
        <div
          className="w-full lg:w-[60%] flex flex-col justify-center"
          style={{ paddingLeft: 'clamp(24px, 7vw, 80px)', paddingRight: '24px', paddingTop: 40, paddingBottom: 40 }}
        >
          {/* Kicker */}
          <p
            style={{
              fontFamily: '"Fraunces", serif',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(18px, 1.8vw, 24px)',
              color: TU.offwhite,
              opacity: 0.78,
            }}
          >
            Everyone said it was impossible.
          </p>

          {/* H1, the founder's record (the brand's spine) */}
          <h1
            style={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 700,
              fontSize: 'clamp(64px, 7.8vw, 104px)',
              color: TU.offwhite,
              lineHeight: 0.9,
              letterSpacing: '-0.035em',
              marginTop: 10,
            }}
          >
            2.9 GPA.
            <br />
            One Year.
            <br />
            <span style={{ position: 'relative' }}>
              Cornell<span style={{ color: TU.crimson }}>.</span>
            </span>
          </h1>

          {/* Accent rule */}
          <div style={{ width: 56, height: 2, background: TU.crimson, margin: '30px 0' }} />

          {/* Body, the claim */}
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: 18,
              lineHeight: 1.68,
              color: TU.offwhite,
              opacity: 0.82,
              maxWidth: 460,
            }}
          >
            A low GPA isn’t a life sentence. Our founder turned a 2.9 into Cornell, UVA, Michigan,
            NYU, and USC, all in one year.
          </p>

          {/* Accepted-to crest row */}
          <div style={{ marginTop: 34 }}>
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: TU.offwhite,
                opacity: 0.5,
                marginBottom: 16,
              }}
            >
              Accepted in one year to
            </div>
            <div className="flex items-center" style={{ gap: 12 }}>
              {ACCEPTED.map((s) => (
                <span
                  key={s.short}
                  title={s.name}
                  className="flex items-center justify-center shrink-0"
                  style={{ width: 42, height: 42, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 4px 16px rgba(0,0,0,0.28)' }}
                >
                  <img src={s.logo} alt={s.short} style={{ height: 25, width: 'auto', objectFit: 'contain' }} />
                </span>
              ))}
            </div>
          </div>

          {/* CTAs, stack full-width and prominent on phones, inline on tablet+ */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center" style={{ marginTop: 'clamp(28px, 4vw, 44px)', gap: 14 }}>
            <a
              href="#apply"
              className="group inline-flex items-center justify-center w-full sm:w-auto"
              onClick={() => track.startTransfer('hero')}
              style={{
                background: TU.crimson,
                color: TU.offwhite,
                padding: '18px 32px',
                borderRadius: 4,
                fontFamily: 'Inter, sans-serif',
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: '0.01em',
                gap: 10,
                boxShadow: '0 14px 30px -10px rgba(122,0,0,0.7)',
                transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease, background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = TU.crimsonHover;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 20px 42px -10px rgba(122,0,0,0.85)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = TU.crimson;
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 14px 30px -10px rgba(122,0,0,0.7)';
              }}
            >
              Start My Transfer
              <span
                aria-hidden
                style={{ display: 'inline-block', transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1)' }}
                className="group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href="#founder"
              className="inline-flex items-center justify-center w-full sm:w-auto"
              style={{
                background: 'rgba(243,245,240,0.04)',
                border: '1px solid rgba(243,245,240,0.28)',
                color: TU.offwhite,
                padding: '17px 30px',
                borderRadius: 4,
                fontFamily: 'Inter, sans-serif',
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: '0.01em',
                transition: 'background 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(243,245,240,0.12)';
                e.currentTarget.style.borderColor = 'rgba(243,245,240,0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(243,245,240,0.04)';
                e.currentTarget.style.borderColor = 'rgba(243,245,240,0.28)';
              }}
            >
              Read the founder’s story
            </a>
          </div>

          {/* Acceptance proof, shown inline on mobile (the desktop floating
              composite is hidden below lg). Keeps the hero's evidence on phones. */}
          <div className="lg:hidden" style={{ marginTop: 44, position: 'relative', width: 'min(80%, 320px)' }}>
            <div style={{ transform: 'rotate(-2.5deg)', background: '#fff', padding: 6, borderRadius: 8, boxShadow: '0 22px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.5)' }}>
              <img
                src="/IMG_5249.webp"
                srcSet="/IMG_5249-640.webp 640w, /IMG_5249.webp 1000w"
                sizes="320px"
                alt="Cornell University acceptance letter, admitted with a 2.9 GPA"
                width={1000}
                height={1731}
                fetchPriority="high"
                style={{ width: '100%', height: 'auto', borderRadius: 4, display: 'block' }}
              />
            </div>
            <div
              className="absolute"
              style={{ bottom: -8, left: 10, background: TU.crimson, color: TU.offwhite, fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '7px 13px', borderRadius: 2, transform: 'rotate(-2.5deg)', boxShadow: '0 10px 24px rgba(0,0,0,0.4)' }}
            >
              Admitted · Cornell
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
