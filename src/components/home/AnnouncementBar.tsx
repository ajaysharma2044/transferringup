import { useState } from 'react';
import { X } from 'lucide-react';
import { TU } from './shared';

export default function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div
      className="w-full flex items-center justify-center relative"
      style={{ background: TU.crimson, height: 44 }}
    >
      <p
        className="text-center px-10"
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: TU.offwhite,
        }}
      >
        From a 2.9 GPA to Cornell. The transfer system we now run for students nationwide{'  '}
        →{'  '}
        <a
          href="/#system"
          className="underline underline-offset-2"
          style={{ color: TU.offwhite, fontWeight: 600 }}
        >
          See How It Works
        </a>
      </p>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => setOpen(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-150 hover:opacity-100"
        style={{ color: TU.offwhite, opacity: 0.5 }}
      >
        <X size={16} strokeWidth={2} />
      </button>
    </div>
  );
}
