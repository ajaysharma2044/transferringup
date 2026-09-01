import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { TU } from '../home/shared';
import type { FaqItem } from '../../lib/schema';

export default function FAQAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto" style={{ maxWidth: 760 }}>
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.question} style={{ borderBottom: `1px solid ${TU.divider}` }}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between text-left"
              style={{ padding: '24px 0', gap: 24 }}
            >
              <span
                style={{
                  fontFamily: '"Fraunces", serif',
                  fontWeight: 700,
                  fontSize: 'clamp(20px, 2.2vw, 26px)',
                  color: TU.navy,
                }}
              >
                {f.question}
              </span>
              <span style={{ color: TU.crimson, flexShrink: 0 }}>
                {isOpen ? <Minus size={22} /> : <Plus size={22} />}
              </span>
            </button>
            {/* Answers are ALWAYS in the DOM (collapsed via CSS grid) so the
                prerendered HTML contains every answer, crawlers and AI engines
                index the full FAQ, and the FAQPage schema matches visible content. */}
            <div
              style={{
                display: 'grid',
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                transition: 'grid-template-rows 0.3s ease',
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 17,
                    lineHeight: 1.7,
                    color: TU.navy,
                    opacity: 0.72,
                    paddingBottom: 28,
                    maxWidth: 680,
                  }}
                >
                  {f.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
