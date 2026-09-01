/**
 * Shared FAQ list in a compact {q, a} shape for pages, components, and the
 * llms.txt / AEO surfaces that prefer terse Q&A.
 *
 * The canonical source of truth is `FAQS` in `src/lib/schema.ts` (used for the
 * FAQPage JSON-LD and the on-page accordion). This module simply re-projects
 * that list to `{ q, a }` so there is exactly one place to edit the copy and no
 * risk of the structured data and the plain-text answers drifting apart.
 */
import { FAQS as SCHEMA_FAQS } from '../lib/schema';

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = SCHEMA_FAQS.map(({ question, answer }) => ({
  q: question,
  a: answer,
}));

export default FAQS;
