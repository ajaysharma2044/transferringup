// ZIP -> household wealth lookup, built from IRS SOI 2022 tax-return data.
// /data/zip-wealth.json holds every US ZIP where 10%+ of households file
// $200k+ returns (or mean AGI >= $200k): { "07078": [58.5, 1044], ... }
//   [0] = % of households with $200k+ income, [1] = mean AGI in $1000s.
// Lazy-fetched once, at submit time only — never on page load.

let cache: Record<string, [number, number]> | null = null;
let inflight: Promise<Record<string, [number, number]>> | null = null;

async function load(): Promise<Record<string, [number, number]>> {
  if (cache) return cache;
  if (!inflight) {
    inflight = fetch('/data/zip-wealth.json')
      .then((r) => r.json())
      .then((j) => (cache = j))
      .catch(() => (cache = {}));
  }
  return inflight;
}

// High school -> ZIP (NCES), for schools sitting in affluent+ ZIPs only. The
// school they attend places the family geographically — no need to ask for a
// ZIP on the form. Keys are the exact autocomplete strings.
let hsCache: Record<string, string> | null = null;
let hsInflight: Promise<Record<string, string>> | null = null;

async function loadHs(): Promise<Record<string, string>> {
  if (hsCache) return hsCache;
  if (!hsInflight) {
    hsInflight = fetch('/data/hs-zips.json')
      .then((r) => r.json())
      .then((j) => (hsCache = j))
      .catch(() => (hsCache = {}));
  }
  return hsInflight;
}

// Private high schools (NCES PSS universe, grades through 10-12): exact
// autocomplete name -> school ZIP. Presence in this map = the family pays
// tuition — the single cleanest ability-to-pay proxy we have.
let pvCache: Record<string, string> | null = null;
let pvInflight: Promise<Record<string, string>> | null = null;

async function loadPrivate(): Promise<Record<string, string>> {
  if (pvCache) return pvCache;
  if (!pvInflight) {
    pvInflight = fetch('/data/private-hs.json')
      .then((r) => r.json())
      .then((j) => (pvCache = j))
      .catch(() => (pvCache = {}));
  }
  return pvInflight;
}

function findKey(data: Record<string, string>, name: string): string {
  if (data[name]) return name;
  const lower = name.toLowerCase();
  for (const k in data) if (k.toLowerCase() === lower) return k;
  return '';
}

export type HsInfo = { zip: string; isPrivate: boolean };

/** Where their high school sits + whether it's a private (tuition) school. */
export async function lookupHsInfo(hsName: string | undefined): Promise<HsInfo> {
  const name = (hsName || '').trim();
  if (!name) return { zip: '', isPrivate: false };
  const [pv, pub] = await Promise.all([loadPrivate(), loadHs()]);
  const pvKey = findKey(pv, name);
  if (pvKey) return { zip: pv[pvKey], isPrivate: true };
  const pubKey = findKey(pub, name);
  return { zip: pubKey ? pub[pubKey] : '', isPrivate: false };
}

export type ZipWealth = {
  zipWealthTier: string; // 'Ultra-wealthy area' | 'Wealthy area' | 'Affluent area' | 'Standard' | ''
  zipTop200kShare: string; // e.g. "31% of households earn $200k+"
  zipMeanIncome: string; // e.g. "$310k avg income"
  wealthZip: string; // the ZIP the wealth data came from
};

export async function lookupZipWealth(zip: string | undefined): Promise<ZipWealth> {
  const empty: ZipWealth = { zipWealthTier: '', zipTop200kShare: '', zipMeanIncome: '', wealthZip: '' };
  const z = (zip || '').trim().slice(0, 5);
  if (!/^\d{5}$/.test(z)) return empty;
  const data = await load();
  const hit = data[z];
  if (!hit) return { ...empty, zipWealthTier: 'Standard', wealthZip: z };
  const [share, mean] = hit;
  const tier =
    share >= 30 || mean >= 400 ? 'Ultra-wealthy area'
    : share >= 18 || mean >= 250 ? 'Wealthy area'
    : 'Affluent area';
  return {
    zipWealthTier: tier,
    zipTop200kShare: share + '% of households earn $200k+',
    zipMeanIncome: '$' + mean + 'k avg income',
    wealthZip: z,
  };
}
