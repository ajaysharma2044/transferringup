import { useEffect, useState } from 'react';

const placements = [
  { name: 'Jordan T.', school: 'Cornell University', detail: '3.1 HS GPA · Community College' },
  { name: 'Marcus R.', school: 'Johns Hopkins', detail: '3.0 HS GPA · Test Optional' },
  { name: 'Keiko A.', school: 'Northwestern', detail: '3.3 HS GPA · Rutgers Transfer' },
  { name: 'Yash S.', school: 'University of Michigan', detail: '3.2 HS GPA · Drexel Transfer' },
  { name: 'Brody K.', school: 'University of Virginia', detail: '3.3 HS GPA · C in Calc' },
  { name: 'Adam L.', school: 'Cornell University', detail: 'Indiana University Transfer' },
];

export default function SocialProofPopup() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;
    const initialDelay = setTimeout(() => {
      setVisible(true);
      hideTimer = setTimeout(() => setVisible(false), 4500);
    }, 4000);

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % placements.length);
      setVisible(true);
      hideTimer = setTimeout(() => setVisible(false), 4500);
    }, 9000);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(hideTimer);
      clearInterval(interval);
    };
  }, []);

  const current = placements[index];

  return (
    <div className={`tu-proof-popup ${visible ? 'visible' : ''}`} aria-live="polite">
      <div className="tu-proof-popup__title">✓ Recently Accepted</div>
      <div className="tu-proof-popup__school">{current.school}</div>
      <div className="tu-proof-popup__detail">{current.detail}</div>
    </div>
  );
}
