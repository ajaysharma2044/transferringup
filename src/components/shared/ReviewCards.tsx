import { Star } from 'lucide-react';
import { Reveal, TU } from '../home/shared';
import reviewsData from '../../data/reviews.json';

export type ReviewRecord = {
  name: string;
  schoolFrom: string;
  schoolTo: string;
  schoolsAccepted: string[];
  rating: number;
  date: string;
  headshot: string;
  text: string;
  /** For third-party reviews with no transfer line (e.g. "BBB Verified Review"). */
  source?: string;
};

export const REVIEWS = reviewsData.reviews as ReviewRecord[];
export const REVIEW_AGGREGATE = reviewsData.aggregate;

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex" style={{ gap: 3 }} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={16} strokeWidth={0} style={{ color: '#D4AA00' }} fill={n <= rating ? '#D4AA00' : 'rgba(243,245,240,0.18)'} />
      ))}
    </div>
  );
}

export default function ReviewCards({ reviews = REVIEWS }: { reviews?: ReviewRecord[] }) {
  return (
    <div className="mx-auto flex flex-col gap-6" style={{ maxWidth: 880 }}>
      {reviews.map((r, i) => (
        <Reveal
          key={r.name + i}
          delay={(i % 3) * 80}
          className="flex flex-col sm:flex-row gap-6"
          style={{
            background: 'rgba(243,245,240,0.05)',
            border: '1px solid rgba(243,245,240,0.12)',
            borderRadius: 14,
            padding: '34px 32px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.22)',
          }}
        >
          <div className="flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-0 flex-shrink-0" style={{ minWidth: 140 }}>
            {r.headshot ? (
              <img
                src={r.headshot}
                alt={r.name}
                loading="lazy"
                style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(243,245,240,0.2)' }}
              />
            ) : (
              <div
                style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(243,245,240,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: TU.offwhite, fontFamily: '"Fraunces", serif', fontSize: 24 }}
              >
                {r.name.charAt(0)}
              </div>
            )}
            <div className="sm:mt-3">
              <div style={{ fontFamily: '"Fraunces", serif', fontWeight: 700, fontSize: 18, color: TU.offwhite }}>{r.name}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: TU.offwhite, opacity: 0.55, marginTop: 2 }}>
                {r.schoolFrom && r.schoolTo ? `${r.schoolFrom} → ${r.schoolTo}` : r.source}
              </div>
              <div className="mt-2">
                <Stars rating={r.rating} />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15.5, lineHeight: 1.75, color: TU.offwhite, opacity: 0.9 }}>
              “{r.text}”
            </p>
            {r.schoolsAccepted && r.schoolsAccepted.length > 0 && (
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(243,245,240,0.08)' }}>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: TU.offwhite, opacity: 0.45, marginBottom: 8 }}>
                  Accepted to
                </div>
                <div className="flex flex-wrap gap-2">
                  {r.schoolsAccepted.map((s) => (
                    <span
                      key={s}
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: TU.offwhite, opacity: 0.8, background: 'rgba(243,245,240,0.08)', padding: '4px 10px', borderRadius: 999 }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
