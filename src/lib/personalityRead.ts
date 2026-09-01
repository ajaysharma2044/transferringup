// Personality-typing layer for the /hq command center.
//
// The archetype layer (src/lib/archetypes.ts) reads WHY they buy: the wound,
// the motive, the emotional driver. This layer reads HOW to talk to them: the
// communication style the closer must match to click, inferred purely from the
// lead's own form BEHAVIOR and WORDS (not demographics). Grounded in DISC
// (D/I/S/C), Big Five (conscientiousness, neuroticism, openness), and the
// analytical / driver / amiable / expressive buyer typology, plus the decision
// axis (fast-intuitive vs slow-evidence).
//
// The point is behavioral matching. A Driver wants you blunt and fast; an
// Analytical wants proof and process; an Amiable wants warmth and safety; an
// Expressive wants vision and energy. The right offer in the wrong style loses.
// Deterministic rules, so the read never hallucinates: every call cites the
// exact behavior that triggered it (see the evidence string) so the closer can
// verify it and trust it.

export type PersonaRead = {
  type: string;
  emoji: string;
  evidence: string;
  talkTo: string;
  avoid: string;
  pace: string;
  decisionStyle: string;
};

export const PERSONAS: Record<string, Omit<PersonaRead, "evidence">> = {
  driver: {
    type: "The Driver",
    emoji: "🏎️",
    talkTo:
      "Lead with the bottom line, then support it. Give the plan in three bullets and the outcome first. Let them steer: ask what they want to cover, hit exactly that, stop. Speak in results and decisions, not process. They respect the most decisive person on the call, so be that person.",
    avoid:
      "Long backstory, hedging, and \"it depends.\" Do not walk them through your whole methodology or read proof they did not ask for. Warm-up small talk and filler read as weakness and burn their patience fast.",
    pace:
      "Fast and clipped. Match their tempo, shorten your sentences, never make them wait for the point. If you are still framing at minute five, you have already lost them.",
    decisionStyle:
      "Decides fast and on gut once they trust your competence. Closes when you are direct, give a clear recommendation, and ask for the decision outright. Present ONE strong path, not a menu; a Driver reads options as you dodging the call. Close line: \"Here is what I would do. Want to start?\"",
  },
  analytical: {
    type: "The Analytical",
    emoji: "🔬",
    talkTo:
      "Give them the process, the data, and the reasoning. Show step by step what happens week by week, what the real transfer admit rates are, how the essay work is structured. Cite specifics. Answer every question completely and be precise. Being correctable and admitting what you do not know earns them.",
    avoid:
      "Hype, vague superlatives, and pressure. \"Trust me, it works\" repels them. Do not rush the decision or skip steps; a pushed Analytical goes quiet and ghosts. Never wing a number in front of them.",
    pace:
      "Slow and thorough. Give them room to think and do not fill silences with more selling. Expect a second call or a \"let me review this,\" and do not fight it; structure IS your close.",
    decisionStyle:
      "Decides on evidence, after review, rarely on the first call. Closes when the process is transparent and the risks are named honestly. Send the written plan, the case data, the calendar, and let the machine sell itself. Close line: \"Take the time to verify it, then give me a clean yes or no by [date].\"",
  },
  amiable: {
    type: "The Amiable",
    emoji: "🤝",
    talkTo:
      "Warmth first, business second. Ask how they are actually doing and mean it. Reassure them they are not alone in this and that you will be beside them at every step. Sell safety, partnership, and the relationship over stats. They buy the person as much as the plan.",
    avoid:
      "Cold efficiency, aggressive closes, and hard deadlines that feel like pressure. Do not rush them or make them feel like a transaction. \"Take it or leave it\" framing makes them retreat and go silent rather than say no to your face.",
    pace:
      "Gentle and unhurried. Let the relationship build. Offer a low-risk next step, not a high-stakes commitment; reduce the fear of a wrong move.",
    decisionStyle:
      "Decides on trust and comfort, and usually needs to talk it over with someone they trust. Closes when they feel safe and supported, not sold. Be the guide who has walked others through this. Close line: \"You will not be doing any of this alone. Want to take the first step together?\"",
  },
  expressive: {
    type: "The Expressive",
    emoji: "✨",
    talkTo:
      "Match their energy and paint the picture. Talk about the dream, the transformation, the story of who they become. Be enthusiastic, use vivid language, make them the hero of the narrative. They want to feel seen and inspired, not audited. Big vision first, then the plan.",
    avoid:
      "Dry data dumps, dwelling on risk, and dampening their excitement. Do not bury the vision under process or nitpick their reach schools early. Flat, monotone delivery kills them, and so does raining on the dream before you have built rapport.",
    pace:
      "Upbeat and animated. Ride their momentum. Keep the energy high, tell stories, and let them talk; they think out loud and sell themselves as they go.",
    decisionStyle:
      "Decides on inspiration and gut, fast when excited and cold just as fast. Closes in the emotional peak of the call, so ask for the decision while the vision is still alive; do not send them away to \"think about it\" or the energy dissipates. Close line: \"Let us make this real. Ready to start building the story that gets you there?\"",
  },
  "anxious-deliberator": {
    type: "The Anxious Deliberator",
    emoji: "🌧️",
    talkTo:
      "Lower the stakes before anything else. Name the fear gently out loud (\"a lot of people in your spot feel underwater by all of it\") so they feel understood, then shrink the mountain to one small, safe first step. They need the warmth of an Amiable AND a little proof like an Analytical, so give both. Slow, calm, certain.",
    avoid:
      "Urgency, big asks, and information overload. Do not stack every deadline and risk on them at once; it freezes them. Do not cheerlead past the worry either, because unacknowledged fear does not leave, it goes quiet and ghosts. Never make them feel judged for hesitating.",
    pace:
      "Slow, steady, reassuring. One thing at a time. Expect hesitation and multiple touches; do not read a slow yes as a no. Give permission to decide when ready, then one gentle, specific nudge.",
    decisionStyle:
      "Decides only once the fear is managed and someone they trust signs off. Closes on safety plus a single clear next step, never on pressure. Break the commitment into the smallest possible first move and walk beside them. Close line: \"We do not have to solve all of it today. Let us just handle the first piece together, and go from there.\"",
  },
  "quiet-executor": {
    type: "The Quiet Executor",
    emoji: "🧩",
    talkTo:
      "Respect their homework and show the machine. They have already researched, so do not re-explain the basics. Be precise, competent, low-drama. Give them the plan, the standards, and the evidence, then get out of the way. They are grading your operation, so let it be clean: fewer words, more substance.",
    avoid:
      "Hype, over-talking, and emotional selling. They distrust a hard pitch and read excess enthusiasm as compensating for weak substance. Do not fill silence with filler or push; pressure makes a Quiet Executor quietly decide no.",
    pace:
      "Efficient and calm. Match their economy of words. They do not need hand-holding or a hype-up, they need signal. Give them space to evaluate and a clean way to say yes.",
    decisionStyle:
      "Decides privately, decisively, on evidence, often a quick firm yes once convinced. Closes when the operation looks competent and the standards are clear. State who you take and who you do not, show the process, then let them decide. Close line: \"Take a day to verify whatever you want, then tell me yes or no. Deciders decide.\"",
  },
};

const norm = (s: string) => s.toLowerCase();

export function readPersonality(f: Record<string, string>): PersonaRead {
  const g = (k: string) => (f[k] || "").trim();

  /* -------- free-text behavior: length, emotion, hedging, decisiveness ------ */
  const free = [g("challenge"), g("currentSchoolStory"), g("lastCycleResults"), g("callGoal")]
    .filter(Boolean)
    .join("  ");
  const t = norm(free);
  const words = free ? free.split(/\s+/).filter(Boolean).length : 0;
  const sentences = free ? free.split(/[.!?]+/).filter((s) => s.trim().length > 0).length || 1 : 0;
  const exclaims = (free.match(/!/g) || []).length;
  const capsWords = (free.match(/\b[A-Z]{3,}\b/g) || []).length;

  const hits = (re: RegExp) => (t.match(re) || []).length;
  const hedges = hits(
    /\b(maybe|probably|not sure|i think|i guess|kind of|kinda|sort of|hopefully|might|possibly|perhaps|unsure|i dont know|i don't know|idk|we'll see|well see|somewhat|a bit)\b/g
  );
  const emotion = hits(
    /\b(love|hate|miserable|scared|afraid|terrified|excited|thrilled|desperate|hopeless|amazing|dream|passion|heartbroken|devastated|frustrated|angry|anxious|nervous|worried|stressed|overwhelmed|stuck|trapped|lonely|happy|hopeful|obsessed)\b/g
  );
  const decisive = hits(
    /\b(will|definitely|absolutely|no matter what|need to|have to|ready|committed|done|for sure|going to|gonna|determined|whatever it takes)\b/g
  );
  const fear = hits(/\b(scared|afraid|terrified|anxious|nervous|worried|stressed|overwhelmed|panic|dread)\b/g);

  /* --------------------------- structured picks ----------------------------- */
  const commit = g("commitmentLevel");
  const worry = g("biggestWorry");
  const invest = g("investmentReadiness");
  const advisor = g("usedAdvisorBefore");
  const testPrep = g("testPrepUsed");
  const filledBy = g("filledBy");
  const paste = g("pasteDetected");
  const fillSecs = Number(g("formFillSeconds")) || 0;
  const visits = Number(g("visitCount")) || 0;

  /* ------------------------------ scoring ----------------------------------- */
  const score = { driver: 0, analytical: 0, amiable: 0, expressive: 0 };
  let anxiety = 0;
  let reserve = 0;
  const cues: string[] = [];

  if (words === 0) {
    cues.push("no free-text to read, leaning on the structured picks");
  } else {
    cues.push("wrote " + words + " word" + (words === 1 ? "" : "s") + " across ~" + sentences + " sentence" + (sentences === 1 ? "" : "s"));
    if (words <= 12) {
      score.driver += 2;
      reserve += 1;
      cues.push("terse (few words -> reserved/decisive)");
    } else if (words >= 45) {
      score.analytical += 1;
      cues.push("long, detailed answer");
    }
  }
  if (hedges >= 2) {
    anxiety += 2;
    score.analytical += 1;
    score.driver -= 2;
    cues.push("hedged " + hedges + "x (\"maybe/not sure\" -> cautious, low-assertive)");
  } else if (hedges === 1) {
    anxiety += 1;
    cues.push("hedged once");
  }
  if (emotion >= 3) {
    score.expressive += 3;
    score.amiable += 1;
    cues.push("high emotional-word density (" + emotion + " -> expressive/feeling-led)");
  } else if (emotion === 2) {
    score.expressive += 1;
    score.amiable += 1;
    cues.push("some emotional language");
  } else if (words >= 25 && emotion === 0) {
    score.analytical += 2;
    reserve += 1;
    cues.push("long but matter-of-fact, no emotion words (-> analytical/reserved)");
  }
  if (decisive >= 2) {
    score.driver += 3;
    cues.push("decisive language (" + decisive + "x \"will/need to/no matter what\" -> driver)");
  } else if (decisive === 1) {
    score.driver += 1;
  }
  if (exclaims + capsWords >= 2) {
    score.expressive += 2;
    cues.push("exclamation/emphasis marks (-> expressive energy)");
  }
  if (fear >= 1) {
    anxiety += fear;
    score.amiable += 1;
    cues.push("fear words in the text (" + fear + " -> anxiety present)");
  }

  if (/^Applying/.test(commit)) {
    score.driver += 3;
    cues.push("\"Applying this cycle no matter what\" -> driver commitment");
  } else if (/^Very likely/.test(commit)) {
    score.driver += 1;
    score.amiable += 1;
    cues.push("\"Very likely, if I find the right guidance\" -> leaning in, wants a guide");
  } else if (/^Still deciding/.test(commit)) {
    score.analytical += 1;
    anxiety += 1;
    cues.push("\"Still deciding if transferring is right\" -> deliberate, not yet sold");
  }

  if (/^My GPA/.test(worry)) {
    score.analytical += 1;
    anxiety += 1;
    cues.push("worry = \"My GPA\" -> metric-focused self-doubt (pragmatic/cautious)");
  } else if (/^Telling my story/.test(worry)) {
    score.expressive += 2;
    cues.push("worry = \"telling my story\" -> expressive (self-expression is the fear)");
  } else if (/^Not knowing what/.test(worry)) {
    score.analytical += 3;
    cues.push("worry = \"not knowing what committees want\" -> analytical (information-asymmetry)");
  } else if (/^Deadlines/.test(worry)) {
    score.driver += 1;
    score.analytical += 1;
    cues.push("worry = \"deadlines and timing\" -> pragmatic, execution-focused");
  } else if (/^The cost/.test(worry)) {
    score.analytical += 2;
    score.driver += 1;
    cues.push("worry = \"the cost\" -> pragmatic, wants value proof");
  } else if (/^Doing this alone/.test(worry)) {
    score.amiable += 3;
    cues.push("worry = \"doing this alone\" -> amiable (wants partnership/support)");
  } else if (/^Honestly, all/.test(worry)) {
    anxiety += 3;
    score.amiable += 1;
    cues.push("worry = \"honestly, all of it\" -> overwhelmed (high anxiety)");
  }

  if (/^Ready to invest/.test(invest)) {
    score.driver += 2;
    cues.push("\"" + invest + "\" -> ready, low friction");
  } else if (/^Serious/.test(invest)) {
    score.analytical += 2;
    cues.push("\"" + invest + "\" -> serious but wants convincing (evidence-seeking)");
  } else if (/^Exploring/.test(invest)) {
    anxiety += 1;
    score.amiable += 1;
    cues.push("\"exploring, cannot fund right now\" -> low readiness, needs safety");
  }

  if (/^Yes, a private/.test(advisor)) {
    score.analytical += 2;
    reserve += 1;
    cues.push("paid a private counselor before -> evidence-driven, been-burned, wants proof");
  }
  if (/^Yes, paid/.test(testPrep)) {
    score.analytical += 1;
    cues.push("paid for test prep before -> process/prep oriented (conscientious)");
  }
  if (/[Pp]arent/.test(filledBy)) {
    score.analytical += 1;
    score.amiable += 1;
    cues.push("a parent filled the form -> read the parent's style live; often more measured");
  }
  if (/^Yes/i.test(paste)) {
    score.analytical += 1;
    reserve += 1;
    cues.push("pasted text (drafted elsewhere) -> prepared, deliberate");
  }
  if (fillSecs > 0 && fillSecs < 45 && words < 25) {
    score.driver += 1;
    cues.push("filled fast (" + fillSecs + "s) -> fast-intuitive tempo");
  } else if (fillSecs >= 300) {
    score.analytical += 1;
    reserve += 1;
    cues.push("filled slowly (" + fillSecs + "s) -> deliberate");
  }
  if (visits >= 3 && /^Still deciding/.test(commit)) {
    score.analytical += 1;
    reserve += 1;
    cues.push(visits + " visits while \"still deciding\" -> researching quietly before acting");
  }

  /* ----------------------------- pick the type ------------------------------ */
  const primaries: Array<[string, number]> = [
    ["driver", score.driver],
    ["analytical", score.analytical],
    ["amiable", score.amiable],
    ["expressive", score.expressive],
  ];
  primaries.sort((a, b) => b[1] - a[1]);
  const topScore = primaries[0][1];
  const runnerUp = primaries[1];
  let key = primaries[0][0];

  // Blend overrides. Quiet-executor: decisive AND reserved AND evidence-driven
  // AND not loud/emotional. Anxious-deliberator: fear/hedging dominant with low
  // assertiveness. The two conditions cannot both fire (driver >= 3 vs <= 2).
  if (reserve >= 2 && score.driver >= 3 && score.analytical >= 2 && score.expressive <= 1) {
    key = "quiet-executor";
  } else if (anxiety >= 4 && score.driver <= 2) {
    key = "anxious-deliberator";
  }

  /* --------------------- confidence / conflict caveat ----------------------- */
  let caveat = "";
  const blended = key === "quiet-executor" || key === "anxious-deliberator";
  if (topScore <= 0 && !blended) {
    key = "amiable";
    caveat = "almost no behavioral signal in the form, so this is a provisional low-pressure default; re-read them live in the first two minutes";
  } else if (!blended && runnerUp[1] > 0 && topScore - runnerUp[1] <= 1) {
    caveat = "signals split between " + key + " and " + runnerUp[0] + ", so hold this loosely and confirm early on the call";
  }

  const trigger = cues.length ? cues.join("; ") : "sparse form, minimal behavioral signal";
  let evidence = trigger + " -> " + key;
  if (caveat) evidence += ". Caveat: " + caveat;

  return { ...PERSONAS[key], evidence };
}

// How the advisor must adapt HIS OWN wiring. These render under the persona
// read so the closer flexes instead of defaulting to his native register.
export const MATCH_NOTES: string[] = [
  "Know your own defaults: the operator running these calls is a Cornell Driver/Expressive - fast, blunt, big-vision, allergic to slow. That style clicks with Drivers and Expressives and quietly repels the other half of the board. The read above is your instruction to FLEX, not a description of the lead to admire.",
  "For an ANALYTICAL or QUIET-EXECUTOR: consciously downshift. Cut the hype, slow the tempo, and replace \"trust me\" with numbers - real transfer admit rates, the week-by-week process, one insider mechanic. Offer to send the written plan and let them review; do not push for a same-call yes. Your enthusiasm reads to them as pressure, and pressure loses the sale.",
  "For an AMIABLE or ANXIOUS-DELIBERATOR: add warmth before agenda. Ask how they are actually doing and slow all the way down. Lead with safety and partnership, name the fear out loud, and shrink the ask to one small step. Your instinct to close hard will make them retreat and ghost rather than tell you no.",
  "For a DRIVER or EXPRESSIVE: this is your native register, so the risk flips - you can over-talk or out-energize them. Give the Driver the bottom line and the ask, then stop. Ride the Expressive's vision, but still pin the decision down before the energy fades.",
  "The universal tell: if the lead has gone quiet or clipped, you are almost certainly over-driving. Match tempo DOWN, not up. Style-matching beats a better pitch every time; a right offer delivered in the wrong style loses to a good offer delivered in theirs.",
];
