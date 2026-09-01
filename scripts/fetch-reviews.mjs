#!/usr/bin/env node
/**
 * Refresh src/data/reviews.json from Supabase (approved reviews).
 * Usage: node scripts/fetch-reviews.mjs
 * Reads VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY from .env or process.env.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function readEnv() {
  const env = { ...process.env };
  const envPath = resolve(root, '.env');
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !env[m[1]]) env[m[1]] = m[2];
    }
  }
  return env;
}

const env = readEnv();
const URL = env.VITE_SUPABASE_URL;
const KEY = env.VITE_SUPABASE_ANON_KEY;

if (!URL || !KEY) {
  console.warn('[fetch-reviews] Missing Supabase env — keeping existing snapshot.');
  process.exit(0);
}

const endpoint = `${URL}/rest/v1/reviews?select=name,school_from,school_to,schools_accepted,rating,review_text,headshot_url,created_at&is_approved=eq.true&order=created_at.desc`;

try {
  const res = await fetch(endpoint, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const rows = await res.json();

  const reviews = rows.map((r) => ({
    name: r.name,
    schoolFrom: r.school_from || '',
    schoolTo: r.school_to || '',
    schoolsAccepted: (r.schools_accepted || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    rating: r.rating || 5,
    date: (r.created_at || '').slice(0, 10),
    headshot: r.headshot_url || '',
    text: (r.review_text || '').replace(/\s+/g, ' ').trim(),
  }));

  const avg =
    reviews.length > 0
      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  const out = {
    _note:
      'Snapshot of approved reviews from Supabase (reviews table, is_approved=true). Refresh with scripts/fetch-reviews.mjs. Rendered statically for SEO/crawler visibility.',
    aggregate: { ratingValue: avg, reviewCount: reviews.length, bestRating: '5' },
    reviews,
  };

  writeFileSync(
    resolve(root, 'src/data/reviews.json'),
    JSON.stringify(out, null, 2) + '\n'
  );
  console.log(`[fetch-reviews] Wrote ${reviews.length} reviews to src/data/reviews.json`);
} catch (err) {
  console.warn(`[fetch-reviews] Fetch failed (${err.message}) — keeping existing snapshot.`);
  process.exit(0);
}
