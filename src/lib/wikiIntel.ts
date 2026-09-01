// Live school intel from Wikipedia's REST API (CORS-enabled, keyless).
// Gives the dossier a real photo + factual blurb for the person's high school
// and university: enrollment, athletics, notable alumni - the "how do you
// know that?" material. Falls back silently when no page exists.

export type WikiCard = { title: string; extract: string; thumb: string; url: string } | null;

const cache: Record<string, WikiCard | 'pending'> = {};

async function fetchSummary(title: string): Promise<WikiCard> {
  try {
    const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
    if (!r.ok) return null;
    const j = await r.json();
    if (j.type && String(j.type).includes('disambiguation')) return null;
    if (!j.extract) return null;
    return {
      title: j.title || title,
      extract: String(j.extract).slice(0, 600),
      thumb: j.thumbnail?.source || '',
      url: j.content_urls?.desktop?.page || '',
    };
  } catch {
    return null;
  }
}

/** Look up a school. Tries the raw name, then without the "(City, ST)" suffix,
 * then a simplified "X High School" form. */
export async function wikiSchool(name: string): Promise<WikiCard> {
  const raw = (name || '').trim();
  if (!raw) return null;
  if (cache[raw] && cache[raw] !== 'pending') return cache[raw] as WikiCard;
  cache[raw] = 'pending';

  const noParen = raw.replace(/\s*\([^)]*\)\s*$/, '').trim();
  const candidates = [noParen];
  const simplified = noParen
    .replace(/\bSenior High School\b/i, 'High School')
    .replace(/\bHigh$/i, 'High School');
  if (simplified !== noParen) candidates.push(simplified);
  if (!/high school|academy|university|college|institute/i.test(noParen)) candidates.push(noParen + ' High School');

  for (const c of candidates) {
    const hit = await fetchSummary(c);
    if (hit) { cache[raw] = hit; return hit; }
  }
  cache[raw] = null;
  return null;
}

/** Keyless embeddable map of the school/town (satellite view). */
export function mapEmbedUrl(place: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&t=k&z=14&output=embed`;
}
