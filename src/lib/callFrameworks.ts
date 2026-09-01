// Call-architecture doctrine for TransferringUP's /hq dashboard.
// This is the layer ABOVE the per-archetype call plans in src/lib/psychDoctrine.ts.
// psychDoctrine tells the closer what to SAY to each of the eight archetypes.
// This file tells the closer the STRUCTURE every call runs on, the named
// consultative-sales frameworks the structure is built from, which framework to
// lead with for which buyer, and the voice to run it all in. The sale: a 30-45
// minute video strategy session, a Cornell-student closer, a premium fee,
// and often two people on the line (the student who owns the wound and the
// parent who owns the checkbook). Nothing here repeats the archetype scripts;
// this is the reusable spine that sits under all of them.

export type CallPhase = {
  phase: string;
  minutes: string;
  goal: string;
  how: string;
  transitionOut: string;
};

export const CALL_BLUEPRINT: CallPhase[] = [
  {
    phase: "1. Frame and Up-Front Contract",
    minutes: "0-3",
    goal:
      "Set the mutual-audition frame and the honest end-state before any selling starts: a clear yes or a clear no by the end of this call, never a 'let me think about it.' Kill the buyer's fear that they are about to be pitched.",
    how:
      "Run Sandler's up-front contract out loud: the time box, the agenda, and the two legitimate outcomes. Then run Voss's accusation audit to disarm the fear before they feel it: 'You are probably bracing for a hard pitch and a price at the end. I would rather do the opposite.' Flip to the audition frame from the first minute: this call is me deciding whether I can actually win with your file as much as it is you deciding on me. Tell them plainly that you would rather hear a no today than a maybe, because a maybe helps no one and the transfer window does not wait on maybes.",
    transitionOut:
      "Fair deal? Good. Then let me start where this actually gets decided, which is you.",
  },
  {
    phase: "2. Rapport and Cold-Read",
    minutes: "3-7",
    goal:
      "Earn the right to go deep fast, prove you already read their file, and identify the wound-owner (student or parent) so you know who the emotional buyer is even when the other one pays.",
    how:
      "Skip generic rapport; it reads as filler to internet-raised buyers. Open with one specific cold-read pulled straight off their intake form, something only someone who studied it could say, then land a single tentative Voss label on the emotion underneath it ('it sounds like the first round still stings'). Keep the late-night-FM voice: slow, warm, unhurried, zero sales lilt. If a parent is on the line, spend these minutes mapping who carries the wound versus who carries the logistics, because you will sell relief to the first and process to the second. Mirror their last three words once to pull the real answer out.",
    transitionOut:
      "Before I tell you what I see in your file, I want the version you have not told anyone yet. Walk me through how you actually ended up here.",
  },
  {
    phase: "3. Discovery and Pain",
    minutes: "7-16",
    goal:
      "Get them narrating their current state and the prior-result wound in their own words, and surface pain at three levels: the technical (what is broken in the file or the school), the practical (what it is costing in time and options), and the personal (how it actually feels).",
    how:
      "Ask, never tell. Run SPIN situation questions only for the few facts you could not read off the form, then move fast to problem questions. Layer Sandler's pain funnel down the three levels, and use GAP discovery to map the current state precisely before you go near a solution. Make them narrate exactly what they tried on their own last cycle; the DIY-failed story is the single most valuable thing you can extract, because the gap between it and a guided file sells itself later. Let silence do the pulling after each question. Write down their exact phrases; those words become the close and every follow-up.",
    transitionOut:
      "Okay. I have the full picture now. Next I want you to do a piece of math with me that you have probably been avoiding.",
  },
  {
    phase: "4. Implication and Cost-of-Inaction",
    minutes: "16-23",
    goal:
      "Turn staying into the felt loss. Make them compute the cost of one more year themselves, because a self-computed loss is believed while a quoted one is argued with.",
    how:
      "This is SPIN implication territory and Sandler's personal-pain level, run on loss framing: losses hurt about twice as much as equal gains, so never frame the transfer as an upgrade, frame staying as a compounding loss of semesters, network, and identity. Widen the GAP here, do not close it. Ask 'what does one more year there cost you, in money, in momentum, and in how it feels to walk that campus?' and then go quiet. Quantify a missed cycle in the buyer's own currency: tuition, recruiting seasons, one more year of Sunday nights. Resist every urge to solve; solving now collapses the pressure you need.",
    transitionOut:
      "So that is the real cost of the road you are on. Here is the part almost nobody explains to you, and it changes the entire game.",
  },
  {
    phase: "5. Teach and Reframe",
    minutes: "23-30",
    goal:
      "Deliver the commercial insight that reframes the whole problem and repositions you from vendor to the one person who sees what they cannot. This is where you earn the fee.",
    how:
      "Run the Challenger teach: warmer, reframe, rational drowning, a new way. The governing reframe for this business is that their process failed, not their profile, and that transfer admissions is a different sport than the freshman round they know, with different readers, a tiny pool, and one question ('what did you do with the seat you got?'). Take control of the frame; do not ask permission to teach. Give away exactly one insider fact they could never Google (a real transfer admit rate, how the essays actually differ, the midterm report) to prove the information asymmetry is real and you sit on the right side of it. Then stop teaching, so they leave knowing you know more, not knowing what you know.",
    transitionOut:
      "That is the game. Now let me show you what it looks like when it is run correctly, and you tell me if that is the fall you want.",
  },
  {
    phase: "6. Vision and Future-Pace",
    minutes: "30-34",
    goal:
      "Install the future identity. Get them describing the destination in present tense so the current school stops being a preference and becomes an obstacle to who they are becoming.",
    how:
      "Use NEPQ solution-awareness questions to let them articulate the future rather than you selling it: 'if this goes exactly right, walk me through a normal Tuesday next fall.' Get the target school said out loud, in the room, in their voice. Have them describe the class, the table, the new answer to 'where do you go?' Identity-based motivation outpulls outcome motivation, and once that future self exists in their head it does the persuading for you. Capture the exact words; they are the ammunition for the offer and the follow-up.",
    transitionOut:
      "Good. Hold onto that, because that is what we are actually deciding on today. Let me tell you exactly how it runs and what it costs.",
  },
  {
    phase: "7. Offer and Price",
    minutes: "34-40",
    goal:
      "Present the engagement as the only bridge across the gap you just widened, state your standard for who you take, say the number one time inside the value context, and then hold silence.",
    how:
      "Frame the offer GAP-style: the bridge between the current state and the future self they just described, never a list of deliverables. Before the number, state who you do NOT take (costly signaling: only an advisor with results to protect can afford to turn money away, so the refusal is itself the proof). Build Belfort's three certainties on the way in: certainty in the method, in you, and in the outcome. Say the price once, calmly, with downward inflection, inside the value you built, then stop completely. Do not soften it, do not stack justifications on top of it. The first person to speak after the number owns the discomfort, so make it them.",
    transitionOut:
      "I am going to stop talking now. What is going through your head?",
  },
  {
    phase: "8. Close and Next-Step",
    minutes: "40-45",
    goal:
      "Get a real decision, or a scheduled one with owned homework and a dated next action. End with the buyer holding the next move, not you.",
    how:
      "Handle objections with Belfort looping: deflect, then rebuild certainty on the three tens (method, you, outcome) and ask for the decision again, raising certainty each pass, but stop well short of pressure with parents protecting a kid. Use Voss calibrated and no-oriented questions to make deciding feel safe ('is it a bad idea to lock the spot before the essay runway starts eating itself?'). Honor the up-front contract by refusing the vague 'I will think about it'; name it and convert it to a real yes, a real no, or a dated decision. Never end with 'I will send you some stuff.' End with the buyer owning a specific action on a specific date: the parent call booked, the deposit decision made, the text sent by Thursday. If two-party, book the full-family call before anyone hangs up.",
    transitionOut:
      "So here is exactly what happens next, and you are the one who makes it happen. Say it back to me so I know we are aligned.",
  },
];

export type Framework = {
  name: string;
  useWhen: string;
  coreMove: string;
  watchOut: string;
};

export const FRAMEWORKS: Framework[] = [
  {
    name: "SPIN Selling (Rackham: Situation, Problem, Implication, Need-payoff)",
    useWhen:
      "Reach for it with analytical and quiet buyers, ROI parents, and anyone who resists being told and needs to reason their own way in. It is the engine of the discovery and implication phases.",
    coreMove:
      "The implication question. Make them compute the cost of another year at the current school themselves ('what does one more year there actually cost you?'), because a loss they authored is believed and a loss you quoted is argued with.",
    watchOut:
      "Stacking situation questions you could have read off the intake form. It bores high-status buyers and burns the cold-read credibility you just built. Ask only what the form did not tell you, then move to problem and implication fast.",
  },
  {
    name: "Sandler Selling System (up-front contract, pain funnel, budget and decision)",
    useWhen:
      "Every call for the up-front contract. Especially valuable with drivers and busy parents who hate ambiguity, and for disqualifying tire-kickers before you spend the hour.",
    coreMove:
      "The up-front contract. Agree at the top that the honest outcome is a yes or a no on this call, which quietly removes the 'let me think about it' exit before it can ever form, and makes a same-call decision feel expected rather than pushy.",
    watchOut:
      "The pain funnel can feel like an interrogation with an emotionally raw eighteen-year-old. Run it slower and warmer than the training implies, or they close down and you lose the discovery you needed.",
  },
  {
    name: "Challenger Sale (Dixon and Adamson: teach, tailor, take control)",
    useWhen:
      "Use it with buyers who already believe they know the game (bigFish, prestigeChaser, quietBuilder, ccClimber) and any parent who thinks this is just essay help. The reframe is your primary authority builder.",
    coreMove:
      "The teach-reframe: 'your process failed, not your profile, and transfer is a different sport than the round you know.' It repositions you from a vendor listing features to the one person in the buyer's life who sees the game they cannot.",
    watchOut:
      "Teaching before you have earned it, or before the pain is felt, reads as arrogance and gets you binned. The reframe only lands after discovery and implication have made them hungry for a new answer. Never open cold with it.",
  },
  {
    name: "Chris Voss Tactical Empathy (labels, calibrated questions, mirrors, accusation audit, no-oriented questions)",
    useWhen:
      "The default tonality for the whole call, and the lead framework on any high-emotion or two-party call (escape, legacyPressure, amiable and anxious buyers).",
    coreMove:
      "The label plus the accusation audit. Name the wound out loud ('it sounds like the first round still bothers you') and pre-say their worst objection ('you are probably thinking this is just an expensive essay service') so it loses its charge before they can wield it.",
    watchOut:
      "A label that is wrong, or delivered too warm and knowing, flips into feeling manipulated. Keep every label tentative ('it seems like...', 'it sounds like...') so they can correct you, which is also free discovery.",
  },
  {
    name: "NEPQ (Miner: connection, situation, problem-awareness, solution-awareness, consequence, commitment questions, neutral tonality)",
    useWhen:
      "Best with internet-native buyers who have been pitched before and are allergic to salesy energy, and skeptical or expressive students. The tonality baseline that pairs with Voss.",
    coreMove:
      "Neutral, genuinely curious tonality plus problem-awareness and consequence questions that get the buyer arguing for the change, so you never have to push. The prospect self-persuades and you stay the calm problem-finder, not the product-pusher.",
    watchOut:
      "The scripted question ladders sound robotic if you run them word-for-word. The tonality is the actual method; the exact wording is not. Deliver it as real curiosity or it pattern-matches to every telemarketer they have hung up on.",
  },
  {
    name: "Straight Line Selling (Belfort: looping, the three tens, certainty tonality)",
    useWhen:
      "Objection handling in the close, and with fast-moving drivers who decide on certainty. Use its structure and its tonality, never its high-pressure reputation.",
    coreMove:
      "Looping. When they object, deflect it, then rebuild certainty on the three tens (the method, you, the outcome) before asking for the decision again, lifting the certainty level a notch on each pass instead of arguing the objection head-on.",
    watchOut:
      "Its aggression is exactly wrong for a parent protecting a child and a fee this size. Over-loop and you slide from confident to slippery, which is fatal here. One or two calm passes, then a clean takeaway, never a hard-sell spiral.",
  },
  {
    name: "GAP Selling (Keenan: current state, future state, and the gap between)",
    useWhen:
      "Lead with it for logic-and-numbers buyers (mercenary, ROI parents) and use it as the backbone from discovery through the offer for everyone.",
    coreMove:
      "Diagnose and quantify the gap between the current state and the future self they described, then position the engagement as the only bridge across it, so the fee is measured against the size of the gap and not against the price of essay edits.",
    watchOut:
      "Quantifying a gap you have not fully diagnosed produces a number they can dispute, and one disputed number wobbles the whole case. Finish the diagnosis completely before you size the gap or name the bridge.",
  },
];

export const FRAMEWORK_BY_BUYER: Record<string, string> = {
  // The eight archetype ids (must match src/lib/psychDoctrine.ts and archetypes.ts).
  redemption:
    "Lead Challenger reframe ('round two is a different sport') over a single Voss label of the still-open verdict. The pain is already proven, so the win is repositioning the loss as a fixable positioning problem, not rediscovering that it hurts.",
  escape:
    "Lead with Voss tactical empathy and a NEPQ neutral tone. The pain is already screaming, so labeling it and being the calm presence out of the storm beats any implication question, which would only re-traumatize. Save the Challenger teach for converting the escape story into a running-toward story.",
  ccClimber:
    "Lead Challenger teach: the insider fact that top schools actively recruit high-GPA community-college transfers, delivered with specifics, plus SPIN situation questions on credit articulation. Authority through concrete knowledge is exactly what no one has ever given them.",
  bigFish:
    "Lead a hard Challenger reframe (stats do not carry the file at the top, positioning does) in Belfort certainty tonality. They only respect the advisor confident enough to tell them their essays, not their numbers, are the weak point.",
  legacyPressure:
    "Lead Voss tactical empathy across two parties, with a private label for each side, because the trusted-third-party seat is the actual product and tonality outranks any single framework here. Bring GAP and ROI logic for the parent once the student owns the work.",
  mercenary:
    "Lead GAP selling and SPIN implication, pure numbers, zero warmth. Quantify the sequencing gap and the compensation delta of arriving before the recruiting window, and close like an operator on expected value.",
  prestigeChaser:
    "Lead Challenger reframe (engineered fit beats generic excellence, school by school) paired with the selectivity mirror. Match their name-status hunger with your own scarcity so your yes carries the same weight the schools' yes does.",
  quietBuilder:
    "Lead SPIN and GAP and let them grade the machine, with a Challenger teach on invisible-error risk and a Sandler up-front contract for a clean decision. Zero pressure; they buy process as risk control, so sell the loop, not the enthusiasm.",
  // The six personality types (orthogonal to archetype; read the temperature live).
  driver:
    "Lead Sandler up-front contract and Belfort pace. Fast agenda, honest outcomes named up front, the number without a runway of preamble, and a decision on this call. Cut warmth they will read as stalling.",
  analytical:
    "Lead SPIN and GAP. Let self-computed cost and quantified gap carry it, give evidence and a written spine, justify the price against the gap, and never rush. Pressure reads to them as a missing argument.",
  amiable:
    "Lead Voss tactical empathy, warm and slow. Safety and relationship before any ask; let them feel fully understood, use calibrated questions so they never feel cornered, and let them arrive at the decision rather than be walked to it.",
  expressive:
    "Lead NEPQ curiosity and the future-pace vision phase. Feed the identity and the story, let them talk and paint the destination out loud, then anchor their own words back at the close.",
  "anxious-deliberator":
    "Lead Voss late-night-FM calm with an accusation audit on their specific fears, plus a Sandler up-front contract that makes deciding on the call safe and expected so 'I need to think' never becomes the escape hatch. NEPQ neutral tone to keep the temperature down.",
  "quiet-executor":
    "Lead SPIN and GAP with a Challenger invisible-error teach. State the standard, hand them the process, give a dated next step, and get out of the way. They decide privately and act, so supply evidence and structure, not energy.",
};

export const TONALITY_RULES: string[] = [
  "Default to the Voss late-night-FM voice: slow, low, downward-inflected, unhurried. It signals you are not anxious about the outcome, and visible anxiety about the sale is the single fastest tell that you need it more than they do.",
  "Keep NEPQ neutral curiosity in every question. The instant the tonality turns 'salesy' or leading, an internet-raised buyer pattern-matches you to every scam call and the door closes. Curiosity has to be real, not performed.",
  "Drop the pitch (Belfort and Voss): statements of fact and the price go down at the end, never up. Upward inflection asks permission and signals doubt; downward inflection assumes the frame and lets the number stand on its own.",
  "Discipline the silence. After a label, an implication question, or the price, stop and let the quiet do the work. Count to ten in your head. The first to speak concedes, so make sure it is them.",
  "Match their energy first, then lead it. Mirror the buyer's pace and volume for the first few minutes (fast for a driver, slow for an amiable), then gradually settle them toward your calm. You cannot lead someone you have not first matched.",
  "Slow down exactly where it costs money. The price, the standard for who you take, and the future-pace all get said slowly with a full beat between sentences. Speed there reads as nerves and invites the discount ask.",
  "Calibrate for two parties. When parent and student are both on, shift register between them, warmer and identity-focused to the student, measured and outcome-focused to the parent, without ever sounding like two different people.",
  "Say the takeaway flatter than the pitch. When you state who you do not take, drop the energy rather than amp it. Sincere selectivity is quiet; salesy scarcity is loud, and these buyers can hear the difference instantly.",
];
