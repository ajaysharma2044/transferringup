import { useEffect, useRef, useState } from 'react';
import { TU } from '../home/shared';

// Type-ahead input backed by a dataset lazy-loaded from /data. Two modes:
//   - whole-file (datasetUrl): one JSON fetched on focus. Good for small lists
//     (colleges, ~67KB).
//   - sharded (shardBase): the huge high-school list (2MB) is split by first
//     letter into /data/hs/<char>.txt; we fetch only the ~50KB slice matching
//     what they type, and only once they type. This is what keeps mobile fast.
// Free text is always allowed, so an unusual school still submits fine.

const labelStyle = {
  fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500,
  letterSpacing: '0.08em', textTransform: 'uppercase' as const,
  color: TU.navy, opacity: 0.6,
};
const fieldStyle: React.CSSProperties = {
  width: '100%', background: '#FFFFFF', border: `1px solid ${TU.divider}`,
  borderRadius: 4, padding: '12px 14px', fontFamily: 'Inter, sans-serif',
  fontSize: 15, color: TU.navy, marginTop: 6,
};

// Module-level cache: each dataset is fetched once and shared across fields.
const cache: Record<string, string[] | undefined> = {};
const inflight: Record<string, Promise<string[]> | undefined> = {};

function loadDataset(url: string): Promise<string[]> {
  const cached = cache[url];
  if (cached) return Promise.resolve(cached);
  const pending = inflight[url];
  if (pending) return pending;
  const isText = url.endsWith('.txt');
  inflight[url] = fetch(url)
    .then((r) => (r.ok ? (isText ? r.text() : r.json()) : isText ? '' : []))
    .then((body: string | string[]) => {
      const arr = typeof body === 'string' ? body.split('\n').filter(Boolean) : Array.isArray(body) ? body : [];
      cache[url] = arr;
      return arr;
    })
    .catch(() => {
      cache[url] = [];
      return cache[url] as string[];
    });
  return inflight[url] as Promise<string[]>;
}

// The shard URL for a query: first a-z of what they typed, else the "_" bucket.
function shardUrl(base: string, q: string): string {
  const m = /[a-z]/.exec(q.toLowerCase());
  return base + (m ? m[0] : '_') + '.txt';
}

export default function Autocomplete({
  label, value, onChange, datasetUrl, shardBase, placeholder, required, hint, maxResults = 8,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  datasetUrl?: string;
  shardBase?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  maxResults?: number;
}) {
  const [data, setData] = useState<string[]>((datasetUrl && cache[datasetUrl]) || []);
  const [open, setOpen] = useState(false);
  const [matches, setMatches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLLabelElement>(null);

  // Whole-file mode preloads on focus; shard mode loads nothing until typing.
  const ensureData = () => {
    if (shardBase || !datasetUrl) return;
    if (data.length || cache[datasetUrl]) return;
    loadDataset(datasetUrl).then(setData);
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const recompute = (v: string, list: string[]) => {
    const q = v.trim().toLowerCase();
    if (q.length < 2) { setMatches([]); return; }
    const starts: string[] = [];
    const contains: string[] = [];
    for (let i = 0; i < list.length && starts.length < maxResults; i++) {
      const s = list[i];
      const low = s.toLowerCase();
      if (low.startsWith(q)) starts.push(s);
      else if (contains.length < maxResults && low.includes(q)) contains.push(s);
    }
    setMatches(starts.concat(contains).slice(0, maxResults));
  };

  const handleChange = (v: string) => {
    onChange(v);
    setActive(-1);
    setOpen(true);
    const q = v.trim().toLowerCase();
    if (shardBase) {
      if (q.length < 2) { setMatches([]); setLoading(false); return; }
      const url = shardUrl(shardBase, q);
      const cached = cache[url];
      if (cached) { recompute(v, cached); return; }
      setMatches([]); setLoading(true);
      loadDataset(url).then((d) => { setLoading(false); recompute(v, d); });
      return;
    }
    const list = data.length ? data : (datasetUrl && cache[datasetUrl]) || [];
    recompute(v, list);
    if (!list.length && datasetUrl) loadDataset(datasetUrl).then((d) => { setData(d); recompute(v, d); });
  };

  const pick = (s: string) => { onChange(s); setOpen(false); setMatches([]); };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || !matches.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, matches.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); pick(matches[active]); }
    else if (e.key === 'Escape') setOpen(false);
  };

  return (
    <label className="block" style={{ marginBottom: 18, position: 'relative' }} ref={boxRef}>
      <span style={labelStyle}>{label}{required ? ' *' : ''}</span>
      {hint && (
        <span style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: 13.5, lineHeight: 1.5, color: TU.navy, opacity: 0.62, marginTop: 5 }}>
          {hint}
        </span>
      )}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        style={fieldStyle}
        onFocus={() => { ensureData(); if (value.trim().length >= 2) handleChange(value); }}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      {open && loading && !matches.length && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 30, background: '#FFFFFF', border: `1px solid ${TU.divider}`, borderTop: 'none', borderRadius: '0 0 6px 6px', padding: '10px 14px', fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: TU.navy, opacity: 0.6 }}>
          Searching schools...
        </div>
      )}
      {open && matches.length > 0 && (
        <div
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 30,
            background: '#FFFFFF', border: `1px solid ${TU.divider}`, borderTop: 'none',
            borderRadius: '0 0 6px 6px', boxShadow: '0 10px 24px rgba(15,28,46,0.14)',
            maxHeight: 260, overflowY: 'auto',
          }}
        >
          {matches.map((m, i) => (
            <div
              key={m}
              onMouseDown={(e) => { e.preventDefault(); pick(m); }}
              onMouseEnter={() => setActive(i)}
              style={{
                padding: '10px 14px', fontFamily: 'Inter, sans-serif', fontSize: 14,
                color: TU.navy, cursor: 'pointer',
                background: i === active ? 'rgba(122,0,0,0.06)' : 'transparent',
              }}
            >
              {m}
            </div>
          ))}
        </div>
      )}
    </label>
  );
}
