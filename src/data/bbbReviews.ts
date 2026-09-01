// Verified customer reviews from our Better Business Bureau profile.
// Kept separate from the Supabase-sourced site reviews (reviews.json) because
// these are third-party BBB-verified and have no transfer-school metadata.
// Rendered in the "Verified on BBB" block on the Reviews page.
import type { ReviewRecord } from '../components/shared/ReviewCards';

// School/headshot fields are intentionally blank — these are BBB-verified
// reviews with no transfer-school metadata; the card shows the `source` line
// and a first-letter avatar instead.
const base = { schoolFrom: '', schoolTo: '', schoolsAccepted: [], headshot: '', rating: 5, date: '2026-06-19', source: 'BBB Verified Review' };

export const BBB_REVIEWS: ReviewRecord[] = [
  {
    ...base,
    name: 'Shelly B.',
    text:
      'Working with Ajay was one of the best decisions I made during the college application process. He is incredibly knowledgeable, strategic, and genuinely invested in his students’ success. What sets Ajay apart is his ability to create a personalized plan based on each student’s goals rather than using a one-size-fits-all approach. He helped me understand the transfer and admissions process, strengthened my application, and provided guidance every step of the way. His insight into college admissions is impressive, and he always took the time to answer questions and make sure I felt confident about my next steps.',
  },
  {
    ...base,
    name: 'Rishabh P.',
    text:
      'Very attentive to detail and always responded quickly to me. Carefully planned everything out and made sure I stayed on track to successfully get admitted.',
  },
  {
    ...base,
    name: 'Mathew Z.',
    text:
      'Went through Ajay and he helped me out a lot through the transfer process. Especially regarding my essays, he felt very chill, as if he were my older brother, and helped me during the stressful times.',
  },
  {
    ...base,
    name: 'Daniel L.',
    text:
      'Absolutely loved working with TransferringUp. I had the opportunity to work with Ajay who helped me navigate through the college application transfer process with great detail. He went above and beyond by giving me creative inspirations that would later serve the basis for my college admission story. Overall, stand-up college transfer servic! Would love to work with them again for grad school applications!',
  },
  {
    ...base,
    name: 'Juan D.',
    text:
      'An amazing service from start to finish. Ajay made me feel confident with the situation I was dealt, and helped me turn it into a new vision that could lead me to where I wanted to go. Always was willing to help, and wanted the best for me. Would 100% recommend and hire him again.',
  },
];
