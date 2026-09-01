// Presentation optimizer: how the closer should LOOK and set the frame on each
// call. People trust and buy from those who match their world's status codes,
// so wardrobe, background, and energy get tuned to the archetype and the money
// tier of the person on the other end. All from data we already hold.

export type PresentationRead = {
  wardrobe: string;
  background: string;
  energy: string;
  props: string;
};

// Base look per archetype (the buying-motive layer).
const BY_ARCHETYPE: Record<string, Partial<PresentationRead>> = {
  redemption: { energy: "Calm, certain, zero pity. You are the person who has seen this exact comeback work. Understated confidence, not hype: they have been sold hope before and it failed." },
  escape: { energy: "Warm and grounded, a little urgent. You are the steady exit, not another stressor. Lower your voice, slow down, be the calmest person in their week." },
  ccClimber: { energy: "Peer respect, high belief, zero condescension. Treat them like the ambitious operator they are. Enthusiasm is fine here; they rarely get it from anyone." },
  bigFish: { energy: "Direct, sharp, slightly challenging. Match their competitiveness. They respect someone who is clearly not impressed easily and holds a high bar." },
  legacyPressure: { energy: "Composed and authoritative, the trusted-adult register. You are the neutral professional both the parent and the student can exhale around." },
  mercenary: { energy: "Crisp, fast, numbers-forward, no fluff. Operator-to-operator. Zero wasted words; they are grading your efficiency." },
  prestigeChaser: { energy: "Polished and insider. You move in the world they want into. Confident name-literacy, never starstruck about the schools they listed." },
  quietBuilder: { energy: "Measured, evidence-first, unhurried. Let competence show, do not perform. They are grading the operation; be the clean machine." },
};

export function presentationRead(archetypeKey: string, marketTier: string | null, wealthTier: string): PresentationRead {
  const premium = marketTier === 'Premium' || /^(Ultra|Wealthy)/.test(wealthTier || '');
  const base = BY_ARCHETYPE[archetypeKey] || {};

  // Wardrobe scales to their world's status code: dress a half-step above the
  // person you are selling, never below and never in costume.
  const wardrobe = premium
    ? "Crisp collared shirt or a clean quarter-zip in a solid dark tone. This crowd reads status instantly, so look like the younger version of the advisor their parents would hire. No hoodie, no logos, nothing loud. Groomed, put-together, quietly expensive."
    : "Clean collared shirt or a neat plain crewneck, approachable not corporate. Overdressing reads as salesy and creates distance in a value-conscious market. Look like a sharp, successful older student, not a suit.";

  const background = premium
    ? "Tidy, warm, intentional: bookshelf with real books, a plant, soft lamp light, Cornell or a diploma subtly in frame. It should whisper 'organized, credentialed, safe to hand my kid to.' Never a messy dorm or a blank wall, both leak amateur."
    : "Clean and real over staged: a neat desk, decent light on your face, an uncluttered wall. Slightly less polished than the premium setup so you read relatable, not corporate. Good lighting matters more than the decor; front-facing light, no window behind you.";

  const props = "Have your results page and this person's matched proof case open in another tab before the call. Screen-share the GPA gap chart at the reframe moment; showing the data mid-call is worth more than describing it. Keep a notebook visible and actually take notes when they talk (it signals they matter).";

  return {
    wardrobe,
    background,
    energy: base.energy || "Confident, warm, and unhurried. Read their pace in the first minute and match it.",
    props,
  };
}
