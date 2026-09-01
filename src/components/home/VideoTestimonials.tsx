import { Play } from 'lucide-react';
import { Reveal, TU } from './shared';
import { Eyebrow } from '../shared/editorial';

/**
 * §B9, video testimonial slots. These are PLACEHOLDERS: drop a 30–60s student
 * clip into each `videoSrc` (and a poster image) when you film them. Until then
 * they render as labeled "coming soon" cards so the layout is ready.
 *
 * To go live: set `videoSrc` to e.g. '/videos/samanyu.mp4' and `poster` to a
 * still frame, and the card becomes a real <video> player.
 */
type Slot = { name: string; path: string; videoSrc?: string; poster?: string };

const SLOTS: Slot[] = [
  { name: 'Samanyu', path: 'UC Riverside → UVA' /* videoSrc: '/videos/samanyu.mp4', poster: '/videos/samanyu.jpg' */ },
  { name: 'Adam', path: 'Indiana → Cornell' /* videoSrc: '/videos/adam.mp4' */ },
  { name: 'Brody', path: 'Keuka → UVA' /* videoSrc: '/videos/brody.mp4' */ },
];

function VideoCard({ slot, delay }: { slot: Slot; delay: number }) {
  return (
    <Reveal delay={delay} className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 5', borderRadius: 12, border: '1px solid rgba(243,245,240,0.12)' }}>
      {slot.videoSrc ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          controls
          playsInline
          preload="none"
          poster={slot.poster}
        >
          <source src={slot.videoSrc} type="video/mp4" />
        </video>
      ) : (
        <>
          {/* placeholder backdrop */}
          <div className="absolute inset-0" style={{ background: `linear-gradient(150deg, #16263b 0%, ${TU.navy} 55%, #0a1420 100%)` }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ gap: 16 }}>
            <span
              className="flex items-center justify-center"
              style={{ width: 64, height: 64, borderRadius: 999, background: 'rgba(243,245,240,0.08)', border: '1px solid rgba(243,245,240,0.2)' }}
            >
              <Play size={24} style={{ color: TU.offwhite, marginLeft: 3 }} fill={TU.offwhite} />
            </span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: TU.offwhite, opacity: 0.45 }}>
              Video coming soon
            </span>
          </div>
        </>
      )}
      {/* caption */}
      <div className="absolute inset-x-0 bottom-0" style={{ background: 'linear-gradient(to top, rgba(8,15,24,0.92), transparent)', padding: '40px 18px 16px' }}>
        <div style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 19, color: TU.offwhite }}>{slot.name}</div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12.5, color: TU.offwhite, opacity: 0.7, marginTop: 2 }}>{slot.path}</div>
      </div>
    </Reveal>
  );
}

export default function VideoTestimonials() {
  return (
    <section className="tu-band-deep" style={{ padding: 'clamp(72px, 12vw, 128px) clamp(24px, 6vw, 80px)' }}>
      <div className="mx-auto" style={{ maxWidth: 1140 }}>
        <Reveal className="text-center" style={{ marginBottom: 48 }}>
          <Eyebrow index="09" label="In Their Own Voice" dark />
          <h2
            style={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 700,
              fontSize: 'clamp(40px, 5vw, 64px)',
              color: TU.offwhite,
              letterSpacing: '-0.02em',
              lineHeight: 1.02,
              marginTop: 18,
            }}
          >
            Hear It From Them.
          </h2>
          <p
            className="mx-auto"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 17, lineHeight: 1.6, color: TU.offwhite, opacity: 0.55, maxWidth: 560, marginTop: 16 }}
          >
            Real students, on camera, telling their own story, unpolished and in their own words.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
          {SLOTS.map((s, i) => (
            <VideoCard key={s.name} slot={s} delay={i * 90} />
          ))}
        </div>
      </div>
    </section>
  );
}
