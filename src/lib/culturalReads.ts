// Cross-cultural read for the transfer consult. The owner's insight: you talk to
// an East Asian family differently than a Hispanic/Latino family differently than
// a South Asian family, ESPECIALLY in how they read the current school (shame,
// pragmatic win, or family-honor issue), who actually decides, and what actually
// motivates the buy. This module is consultative selling done as cultural
// competency: meet the family where they are, hear the real motivation, soothe the
// real fear. It is grounded in real anthropology (Hofstede individualism and power
// distance, Hall's high and low context communication, filial piety, familismo,
// face and honor cultures, immigrant selectivity, model-minority pressure, first-gen
// research), NOT stereotype. Every line is a hypothesis to test on the call, never a
// label to assign. The closer never says any of this out loud: they leak
// understanding through better questions and warmer framing, they do not recite it.

export const CULTURAL_DISCLAIMER: string =
  "Hold every line below LIGHTLY. These are hypotheses to test on the call, never labels to assign to a human being. Each is a pattern from cultural anthropology (Hofstede, Hall's high and low context, filial piety, familismo, face and honor cultures, immigrant selectivity, first-gen research), and within-group variation is enormous, often larger than the difference between groups. A given family may match all of it, some of it, or none of it. IMMIGRANT GENERATION is frequently more predictive than ethnicity: a first-gen parent and a second-gen student in the same room are two different cultures negotiating with each other, so read the room, not the surname. Use this to SERVE better, to hear the real motivation and soothe the real fear, not to script or manipulate. Never state a family's culture out loud. You leak understanding through sharper questions and warmer framing, you do not recite it. If the family's own words contradict the card, the family is right and the card is wrong.";

export type CulturalRead = {
  community: string;
  emoji: string;
  viewOfSituation: string;
  decisionMaker: string;
  sellTo: string;
  soothe: string;
  commStyle: string;
  resonanceMove: string;
  trap: string;
  generationShift: string;
};

export const CULTURAL_READS: Record<string, CulturalRead> = {
  east_asian: {
    community: "East Asian (Chinese, Korean, Taiwanese)",
    emoji: "\u{1F3EE}",
    viewOfSituation:
      "The current school often reads as a live scoreboard the whole extended family can see. In a face (mianzi) culture, a mid-tier state school can feel like a quiet loss of prestige for the parents among relatives and colleagues, even when the student is genuinely thriving. Treat the parents' calm as a mask over real stakes, not as low interest.",
    decisionMaker:
      "The parent in the room, frequently the father on money and the mother on education strategy, is usually the true decision-maker and the emotional buyer, even when the student is the one who booked the call. The student may defer visibly and go quiet. Win the parent and you win the deal; win only the student and you often lose both.",
    sellTo:
      "Sell to the upgrade in verifiable prestige and the long-arc payoff: a name relatives recognize, a cleaner path to a top graduate program or a stable elite profession. Rankings-literate specifics and concrete outcomes land harder than inspiration or self-discovery language.",
    soothe:
      "Soothe the fear of a public and permanent verdict, that this student has already fallen behind a cousin or a neighbor's kid and cannot recover. Reframe the transfer as the disciplined, still-open path back to the top tier, so the comparison story can still end well.",
    commStyle:
      "Be formal, prepared, and precise; lead with credentials and a clear plan. Respect hierarchy by addressing the parent with deference and never talking over them. Read the high-context signals: a pause or a polite deflection can mean no, so slow down and leave room rather than pushing.",
    resonanceMove:
      "Ask, 'A year from now, when family or friends ask where your son or daughter is studying, what would you want to be able to say?' It names the comparison pressure without ever stating it, and lets the parent hand you the real target.",
    trap:
      "The biggest trap is overselling warmth and self-discovery while under-delivering rigor and proof; it reads as lightweight. The second trap is pitching the student as the buyer and ignoring the quiet parent, who then vetoes the whole thing after the call.",
    generationShift:
      "First-gen parents carry the face and comparison weight most intensely and want the prestige story; a second-gen student may be quietly exhausted by it and want permission to choose fit over rank. Your job is to bridge: honor the parent's prestige goal out loud while giving the student a fit-based rationale that still reaches the top tier.",
  },

  south_asian: {
    community: "South Asian / Indian (also Pakistani, Bangladeshi)",
    emoji: "\u{1FA94}",
    viewOfSituation:
      "The current school is scored inside a dense community-comparison engine, the aunty network and biodata-style status tracking, where 'log kya kahenge' (what will people say) is a genuine force, not a punchline. A state school can register as a temporary status problem the family fully intends to fix, which is precisely why they are talking to you.",
    decisionMaker:
      "Decisions are typically family-negotiated with heavy parental weight, often the father on final approval and ROI, the mother on emotion and logistics, and sometimes an influential uncle or older sibling already in the target field. The student advocates hard but rarely decides alone.",
    sellTo:
      "Sell to ROI and trajectory: admission odds into target-brand schools, feeder pipelines into medicine, engineering, CS, or finance, and the concrete return on the spend. The engineering-parent brain wants the numbers, the plan, and the proof that it actually works.",
    soothe:
      "Soothe two fears that coexist: the community-reputation fear, and the value fear (heavy education spend paired with real price scrutiny, 'is this consultant worth it versus doing it ourselves'). Justify the fee with specificity and outcomes, not with pressure.",
    commStyle:
      "Be direct and data-forward, warm but substantive, and ready for pointed questions about price and results without flinching. Show visible respect to the elders in the room. Expect negotiation and comparison to alternatives; do not read scrutiny as disinterest, it is diligence and it means they are serious.",
    resonanceMove:
      "Say, 'Let's map exactly which programs this opens and what the realistic admit picture looks like, so the decision sits on evidence, not hope.' It speaks to the ROI brain and the reputation stakes at once, without naming either one.",
    trap:
      "The trap is a vague, feelings-first pitch with no numbers, or getting rattled by hard price questions. Also fatal: dismissing the parents' target-brand fixation as shallow instead of engaging it as a real and workable goal.",
    generationShift:
      "First-gen parents drive the community-comparison and safe-prestige-major agenda hardest; second-gen students may resent the 'what will people say' pressure and want a major or path off the approved list. Give the parent a credible ROI story and give the student room to widen the definition of success inside it.",
  },

  hispanic_latino: {
    community: "Hispanic / Latino (Mexican-American, Cuban, Central and South American)",
    emoji: "\u{1F30E}",
    viewOfSituation:
      "The current school is often viewed pragmatically or even proudly, not as shame, especially where this student is the first to reach college at all. Staying close to home is frequently a value (familismo), not a weakness, so framing the current school as embarrassing will backfire badly. The opening is aspiration and opportunity, not rescue.",
    decisionMaker:
      "The decision is collective and family-centered; the parents' blessing matters enormously even when the motivated student initiates. The emotional buyer is often the parent who fears losing the child to distance or debt, and sometimes a grandmother or an older sibling holds real, quiet sway.",
    sellTo:
      "Sell to family investment and shared pride: this is the student rising so the whole family rises, a way to honor the parents' sacrifice, not to leave them behind. Concrete upward mobility with the family included is the story that lands.",
    soothe:
      "Soothe the debt-and-departure fear directly: strong financial caution and debt-aversion are common, and 'leaving' can feel like abandoning family. Address cost, aid, and staying-connected out loud and early, before they have to raise it themselves.",
    commStyle:
      "Lead with warmth, relationship, and respect (respeto) before business; personalismo matters, so the human connection precedes the pitch. Be patient and unhurried, and include the parents in the conversation. Reassure rather than pressure; urgency reads as a red flag.",
    resonanceMove:
      "Say, 'This is not about leaving your family behind, it is about what you can bring back to them.' Reframing the transfer as family investment rather than family departure signals you understand the real hesitation, without naming the culture.",
    trap:
      "The trap is treating the current school as shameful or tossing off debt casually; both read as disrespect for the family's caution and pride. Also fatal: rushing to close before trust and warmth are actually established.",
    generationShift:
      "First-gen-immigrant parents feel the proximity and debt fears most and may need the most reassurance; a second-gen or first-to-college student often carries intense obligation and achievement guilt, wanting to rise without hurting the family. Sell the both-and: ambition that repays the family rather than escapes it.",
  },

  african_immigrant: {
    community: "African immigrant (Nigerian, Ghanaian, and others)",
    emoji: "\u{1F30D}",
    viewOfSituation:
      "Education is treated as the central engine of mobility and family pride, and these are among the most highly educated immigrant groups in the US, so expectations run very high. The current school is usually seen as a step that must lead clearly upward to a serious profession; standing still is the real worry, not the school itself.",
    decisionMaker:
      "Parents, often the father as head with strong maternal drive on education, are decisive, and respect for authority and credentials runs deep. A pastor, a church community, or a respected elder can be a genuine endorsing voice, so your own credibility signals carry real weight.",
    sellTo:
      "Sell to the professional-track outcome (medicine, law, engineering, and increasingly tech and finance), credentialed prestige, and the pride and legacy stakes of the family's investment finally paying off. Show that you are a serious, credentialed expert who belongs in this conversation.",
    soothe:
      "Soothe the fear of wasted investment and of the student drifting off the respectable professional path. Reassure that this move sharpens, rather than dilutes, the route to a recognized profession and a return on the family's sacrifice.",
    commStyle:
      "Be formal, respectful, and credential-forward; establish your authority and seriousness early. Honor elders and hierarchy in the room. Directness about outcomes is welcomed, but pair it with clear respect for the parents' standing and everything they have poured in.",
    resonanceMove:
      "Say, 'Everything your family has invested should compound into a credential and a career people respect. Let's make sure this move does exactly that.' It speaks to mobility, pride, and the professional track without stating the culture.",
    trap:
      "The trap is coming across as casual, unqualified, or as steering the student away from a respected profession toward something the family will see as risky. Under-signaling your own credibility empties the room.",
    generationShift:
      "First-gen parents hold the profession-and-respect expectations most firmly and weigh community and church opinion; second-gen students may push for fit or a less traditional field and feel the weight of representing the family's whole sacrifice. Bridge by tying the student's genuine strengths to a path the parents still recognize as serious.",
  },

  middle_eastern: {
    community: "Middle Eastern / Arab / Persian (Iranian)",
    emoji: "\u{1F54C}",
    viewOfSituation:
      "Education carries high prestige and ties to family honor, so the current school can read as a matter of family standing, not just the student's preference. Persian and Arab families often prize elite reputation strongly, so a mid-tier placement can feel like an honor gap the family wants closed.",
    decisionMaker:
      "Structures are frequently patriarchal, with the father or a senior male often holding final say, though mothers commonly drive the education agenda behind the scenes. Read who defers to whom in the room; the quiet authority may not be the loudest voice.",
    sellTo:
      "Sell to honor, prestige, and the family's standing restored or elevated, alongside a clear elite-professional trajectory. The story is a name and a path the family can be proud to claim in front of their community.",
    soothe:
      "Soothe the honor-and-reputation fear and, for some families, real protectiveness about a daughter moving far from home. Address the safety, community, and prestige of the destination, not just the academics.",
    commStyle:
      "Be respectful and somewhat formal, generous with hospitality-style rapport, and deferential to the senior figure. Warmth and relationship matter, but so does gravitas, so avoid overfamiliarity. Indirectness can carry real meaning here, so listen for what is implied.",
    resonanceMove:
      "Say, 'We can target schools your family will be genuinely proud to be associated with, and make sure the fit and the environment are right too.' It honors prestige and, for a daughter, the safety and environment concern, without naming either.",
    trap:
      "The trap is ignoring the patriarch or the honor stakes, or being glib about a daughter's distance and environment. Treating prestige as mere vanity rather than a real family value quietly loses trust.",
    generationShift:
      "First-gen parents weight honor, prestige, and (for daughters) proximity and protection most heavily; second-gen students, often quite Americanized, may chafe at this and want autonomy and fit. Bridge by delivering the prestige the parents need while quietly widening the student's room to choose.",
  },

  jewish_american: {
    community: "Jewish American",
    emoji: "\u{2721}\u{FE0F}",
    viewOfSituation:
      "Education is deeply central and often multigenerational, so the current school is measured against a strong internal expectation of intellectual achievement and a good school 'name.' It is less about outsider shame and more about a family and community standard of academic seriousness and fit.",
    decisionMaker:
      "Typically a collaborative and articulate parent-student negotiation, with parents heavily involved and the student's voice genuinely weighted. Both parents often engage; expect informed, debate-comfortable conversation rather than one-way authority.",
    sellTo:
      "Sell to intellectual fit, quality, and network: the right academic environment, faculty, peer caliber, and long-term professional and social network, not raw ranking alone. Substance and reasoning win the room.",
    soothe:
      "Soothe the fear of settling for a mediocre fit or a lesser network, and of overpaying for something they suspect they could analyze themselves. Show rigorous thinking, not a hard sell.",
    commStyle:
      "Be candid, intellectually substantive, and comfortable with questions, pushback, and debate; treat it as engagement, not resistance. Directness and dry humor are fine. Respect their analysis and never condescend or oversimplify.",
    resonanceMove:
      "Say, 'Let's pressure-test this together. I would rather you poke holes in the plan now than take it on faith.' Inviting scrutiny signals respect for their intellectual seriousness, without stating anything about culture.",
    trap:
      "The trap is a slick, low-substance pitch, or bristling at hard questions; both read as either lightweight or evasive. Talking down to a well-informed family is fatal.",
    generationShift:
      "Immigrant generation varies widely, from long-established families to more recent immigrants from the former USSR, Israel, or elsewhere, so hold this especially lightly. More recently arrived families may weight prestige and security more sharply, while long-established ones may prioritize fit and network; verify which family you are actually with.",
  },

  white_northeast_prep: {
    community: "White American, Northeast prep / legacy affluent",
    emoji: "\u{1F3DB}\u{FE0F}",
    viewOfSituation:
      "The current school is measured against a private prestige map (selective and name schools, legacy expectations), so a state school can register as under-placement relative to the family's peer set. It is a fit-and-status question far more than a financial one.",
    decisionMaker:
      "Usually an involved, credentialed parent (often both) steering with a consultative style, the student's preference weighted but guided. These families are frequently repeat buyers of educational advantage and expect polish and discretion.",
    sellTo:
      "Sell to fit, prestige, and access: the right-caliber institution, network, and outcomes that match the family's expectations, delivered with sophistication. They are buying an edge and real expertise.",
    soothe:
      "Soothe the fear of under-placement and of hiring someone unpolished or generic. Reassure with track record, discretion, and a clearly premium, tailored process.",
    commStyle:
      "Be polished, concise, and consultative; assume sophistication and do not over-explain the basics. Understatement usually beats hard selling. Signal quality through precision and restraint rather than hype.",
    resonanceMove:
      "Say, 'You have likely done a lot of this already, so let me focus on the specific leverage most families miss at the transfer stage.' It respects their existing sophistication and positions you as the edge, without naming class or status.",
    trap:
      "The trap is a generic or hype-heavy pitch that reads as beneath them, or over-explaining what they already know. Any whiff of amateur-hour loses the premium buyer.",
    generationShift:
      "Immigrant generation is often not the axis here; social class and school-savvy are. The relevant 'generation' is how many generations of selective-college fluency the family has, which shapes how much hand-holding versus pure leverage they want from you.",
  },

  white_midwest_pragmatic: {
    community: "White American, Midwest pragmatic / flagship pride",
    emoji: "\u{1F33E}",
    viewOfSituation:
      "The current school, often a respected state flagship, is usually viewed with genuine pride and pragmatism, not shame. The real question is value and outcome, 'is transferring actually worth it,' so any framing that insults the flagship or the practical choice will backfire.",
    decisionMaker:
      "Down-to-earth parents and the student decide together, with a strong value-and-common-sense filter. The emotional buyer wants to feel this is a smart, grounded decision, not a status splurge.",
    sellTo:
      "Sell to concrete outcomes and value: better program fit, clear career payoff, and a sensible return on the money and effort. Practical, honest, and specific beats aspirational every time.",
    soothe:
      "Soothe the 'is this worth it and are you overselling me' skepticism. Reassure with straight talk, real numbers, and no pressure; earn trust by refusing to overreach.",
    commStyle:
      "Be plainspoken, honest, and unpretentious; drop the hard sell and the jargon. Friendliness and straightforwardness build trust. Overpromising is the fastest way to lose them.",
    resonanceMove:
      "Say, 'If transferring does not clearly beat staying put, I will tell you that.' Willingness to talk them out of it signals honesty and respect for their pragmatism, without naming any of it.",
    trap:
      "The trap is slick, high-pressure, status-driven selling, or any disparagement of their flagship. It reads as coastal and untrustworthy and kills the deal.",
    generationShift:
      "Immigrant generation is usually not the axis; the real variable is first-to-college versus college-experienced families. First-to-college Midwest families need more information and reassurance and carry more anxiety; established ones just want efficient, honest value talk.",
  },

  white_southern: {
    community: "White American, Southern (faith, family, flagship)",
    emoji: "\u{1F3C8}",
    viewOfSituation:
      "The current school, often a beloved state flagship, is typically a point of pride and identity tied to family tradition, community, and sometimes faith. A state school is rarely shameful, so the move must be framed as opportunity, never as escaping something lesser.",
    decisionMaker:
      "Family and often the faith community weigh in; parents lead with warmth and tradition, and staying near home and church can matter a great deal. The emotional buyer wants the decision to feel consistent with family and values.",
    sellTo:
      "Sell to opportunity that honors family and roots: a step up the student and family can be proud of without abandoning who they are. Relationship and trust are the real currency, more than data.",
    soothe:
      "Soothe the fear that transferring means leaving home, tradition, or faith behind, or that the consultant is a slick outsider. Reassure with warmth, values-alignment, and no-pressure honesty.",
    commStyle:
      "Be warm, personable, courteous, and relationship-first; manners and sincerity matter. Take your time and do not rush to business. Hard-sell and condescension are poison here.",
    resonanceMove:
      "Say, 'This should feel like an upgrade you are proud of, not like turning your back on home.' It honors roots, family, and belonging without ever naming region or faith.",
    trap:
      "The trap is a fast, impersonal, high-pressure pitch, or any hint of looking down on their school, town, or values. Cold professionalism reads as untrustworthy.",
    generationShift:
      "Immigrant generation is usually not the axis; first-to-college status and rootedness are. First-to-college Southern families need reassurance and clear information; the deeper the local roots, the more the leaving-home reframe matters.",
  },

  white_rural_working: {
    community: "White American, rural / working-class (often first-to-college)",
    emoji: "\u{1F527}",
    viewOfSituation:
      "The current school, or college at all, may be a hard-won achievement, so there is little shame and a lot of pride and caution. The dominant lens is money and risk, 'is this worth it, will it pay off, could it leave us worse off.' Respect that the stakes feel existential.",
    decisionMaker:
      "Parents and the student decide together with a tight-budget, high-caution mindset; extended family may weigh in. The emotional buyer fears wasting scarce money and being taken advantage of by someone slicker than them.",
    sellTo:
      "Sell to concrete, provable payoff and the safety of the investment: real career outcomes, real numbers, and a clear reason the spend is worth it. Honesty and value are the whole game.",
    soothe:
      "Soothe the deep 'is this worth the money and am I being conned' fear. Reassure with transparency, plain numbers, patience, and zero pressure; never once make them feel small for asking.",
    commStyle:
      "Be plainspoken, patient, respectful, and jargon-free; treat them as equals and never talk down. Slow, honest, and concrete builds the trust. Any elitism or pressure ends it instantly.",
    resonanceMove:
      "Say, 'I am not going to talk you into anything, let's just look honestly at whether this pays off for you.' It respects their caution and dignity and defuses the con fear, without naming class.",
    trap:
      "The trap is jargon, pressure, or any condescension that makes them feel out of their depth, plus vague promises with no numbers. Feeling talked-down-to loses them on the spot.",
    generationShift:
      "This overlaps heavily with the first-gen-college axis; the more first-to-college the family, the higher the information anxiety, and the deeper the loyalty once trust is earned. Established-college rural families still lead with value but need less reassurance on the basics.",
  },

  first_gen_college: {
    community: "First-generation-to-college (any background)",
    emoji: "\u{1F331}",
    viewOfSituation:
      "The current school is usually a genuine victory the whole family is watching, not a shame, so never frame it as failure. The lens is high pride mixed with high anxiety, because no one at home has walked this path and the information gap itself feels frightening.",
    decisionMaker:
      "The student often carries the research and the initiative, but the family's blessing and emotional weight are huge and everyone is invested. The real emotional buyer may be a parent who simply wants reassurance their child is not being misled.",
    sellTo:
      "Sell to being the trusted guide through unfamiliar terrain: clarity, a map, and someone in their corner who explains the hidden rules. Reduce overwhelm and imposter fear more than you chase prestige.",
    soothe:
      "Soothe the information anxiety and the imposter feeling, the fear of a costly wrong move and of not belonging. Reassure that not knowing this stuff is completely normal and that guidance is exactly what closes the gap.",
    commStyle:
      "Be patient, warm, and jargon-free; define terms without condescending and check for understanding. Slow the pace and normalize their questions. Never make them feel behind or foolish for asking.",
    resonanceMove:
      "Say, 'No one hands families a manual for this, so let me make the hidden parts obvious. No question is too basic.' It meets the information anxiety and the imposter fear directly, without labeling anyone.",
    trap:
      "The trap is assuming knowledge, using insider jargon, or moving fast; it deepens the imposter feeling and shuts them down. Drowning them in options instead of one clear next step also loses them.",
    generationShift:
      "This IS the generational axis in its purest form, and it cross-cuts every ethnicity above. The classic tension is a first-gen-college parent and their college-going child navigating together; your value is translating between the family's hopes and the system's hidden rules, and that loyalty, once earned, runs very deep.",
  },
};

// Soft surname-origin hint. Returns POSSIBLE cultural-read keys from surname
// patterns, ALWAYS at confidence "low", frequently more than one candidate, and an
// empty array when there is no reasonable signal. This is designed to be SHOWN as
// "possible context, verify on the call," never asserted. Many surnames are shared
// across communities (Khan, Ali, Ahmed, Shah, Mohammed), so those deliberately
// return multiple candidates. A single low-confidence candidate is still a guess,
// not a confident answer. Regional white-American subcultures are intentionally NOT
// guessed from surname, because Anglo surnames are shared across all of them and
// class or region is not knowable from a name.
const SURNAME_MAP: Record<string, string[]> = {
  // East Asian (Chinese, Korean, Taiwanese romanizations)
  wang: ["east_asian"], li: ["east_asian"], zhang: ["east_asian"], liu: ["east_asian"],
  chen: ["east_asian"], yang: ["east_asian"], huang: ["east_asian"], zhao: ["east_asian"],
  wu: ["east_asian"], zhou: ["east_asian"], xu: ["east_asian"], sun: ["east_asian"],
  zhu: ["east_asian"], guo: ["east_asian"], gao: ["east_asian"], lin: ["east_asian"],
  luo: ["east_asian"], zheng: ["east_asian"], liang: ["east_asian"], xie: ["east_asian"],
  tang: ["east_asian"], deng: ["east_asian"], feng: ["east_asian"], peng: ["east_asian"],
  cao: ["east_asian"], jiang: ["east_asian"], shen: ["east_asian"], hsu: ["east_asian"],
  hsieh: ["east_asian"], chang: ["east_asian"], tsai: ["east_asian"], kuo: ["east_asian"],
  yeh: ["east_asian"], lai: ["east_asian"], chiang: ["east_asian"],
  kim: ["east_asian"], park: ["east_asian"], choi: ["east_asian"], jeong: ["east_asian"],
  jung: ["east_asian"], kang: ["east_asian"], cho: ["east_asian"], yoon: ["east_asian"],
  jang: ["east_asian"], kwon: ["east_asian"], hwang: ["east_asian"], ahn: ["east_asian"],
  seo: ["east_asian"], shin: ["east_asian"], bae: ["east_asian"], koo: ["east_asian"],

  // South Asian (Indian, plus Pakistani and Bangladeshi; Sikh names included)
  patel: ["south_asian"], shah: ["south_asian", "middle_eastern"], sharma: ["south_asian"],
  gupta: ["south_asian"], singh: ["south_asian"], kaur: ["south_asian"], kumar: ["south_asian"],
  reddy: ["south_asian"], rao: ["south_asian"], nair: ["south_asian"], menon: ["south_asian"],
  iyer: ["south_asian"], iyengar: ["south_asian"], desai: ["south_asian"], mehta: ["south_asian"],
  joshi: ["south_asian"], verma: ["south_asian"], agarwal: ["south_asian"], aggarwal: ["south_asian"],
  kapoor: ["south_asian"], malhotra: ["south_asian"], chopra: ["south_asian"], banerjee: ["south_asian"],
  chatterjee: ["south_asian"], mukherjee: ["south_asian"], bose: ["south_asian"], das: ["south_asian"],
  dutta: ["south_asian"], ghosh: ["south_asian"], naidu: ["south_asian"], pillai: ["south_asian"],
  krishnan: ["south_asian"], subramanian: ["south_asian"], subramaniam: ["south_asian"],
  raman: ["south_asian"], prasad: ["south_asian"], choudhary: ["south_asian"], chaudhary: ["south_asian"],
  trivedi: ["south_asian"], pandya: ["south_asian"], bhatt: ["south_asian"], pandey: ["south_asian"],
  mishra: ["south_asian"], tiwari: ["south_asian"], saxena: ["south_asian"], sinha: ["south_asian"],
  jain: ["south_asian"], thakur: ["south_asian"], yadav: ["south_asian"], chauhan: ["south_asian"],
  sethi: ["south_asian"], bhatia: ["south_asian"], khanna: ["south_asian"], arora: ["south_asian"],
  kohli: ["south_asian"], gill: ["south_asian"], dhillon: ["south_asian"], sandhu: ["south_asian"],
  grewal: ["south_asian"], brar: ["south_asian"], sidhu: ["south_asian"], bajwa: ["south_asian"],
  dhaliwal: ["south_asian"], chowdhury: ["south_asian"], chaudhry: ["south_asian"],
  siddiqui: ["south_asian"], qureshi: ["south_asian"], zaidi: ["south_asian"], rizvi: ["south_asian"],

  // Shared Muslim-heritage surnames: deliberately multi-candidate
  khan: ["south_asian", "middle_eastern"], ali: ["south_asian", "middle_eastern", "african_immigrant"],
  ahmed: ["south_asian", "middle_eastern", "african_immigrant"], ahmad: ["south_asian", "middle_eastern"],
  hussain: ["south_asian", "middle_eastern"], hussein: ["middle_eastern", "african_immigrant"],
  hassan: ["middle_eastern", "south_asian", "african_immigrant"], hasan: ["middle_eastern", "south_asian"],
  rahman: ["south_asian", "middle_eastern"], malik: ["south_asian", "middle_eastern"],
  syed: ["south_asian", "middle_eastern"], sayed: ["south_asian", "middle_eastern"],
  sheikh: ["south_asian", "middle_eastern"], shaikh: ["south_asian", "middle_eastern"],
  aziz: ["middle_eastern", "south_asian", "african_immigrant"], ansari: ["south_asian", "middle_eastern"],
  abbas: ["middle_eastern", "south_asian"], iqbal: ["south_asian"], farooq: ["south_asian"],
  mohammed: ["middle_eastern", "south_asian", "african_immigrant"],
  mohamed: ["middle_eastern", "african_immigrant", "south_asian"],
  muhammad: ["middle_eastern", "south_asian", "african_immigrant"],
  mohammad: ["middle_eastern", "south_asian"], ibrahim: ["middle_eastern", "african_immigrant", "south_asian"],

  // Hispanic / Latino
  garcia: ["hispanic_latino"], rodriguez: ["hispanic_latino"], martinez: ["hispanic_latino"],
  hernandez: ["hispanic_latino"], lopez: ["hispanic_latino"], gonzalez: ["hispanic_latino"],
  gonzales: ["hispanic_latino"], perez: ["hispanic_latino"], sanchez: ["hispanic_latino"],
  ramirez: ["hispanic_latino"], torres: ["hispanic_latino"], flores: ["hispanic_latino"],
  rivera: ["hispanic_latino"], gomez: ["hispanic_latino"], diaz: ["hispanic_latino"],
  cruz: ["hispanic_latino"], morales: ["hispanic_latino"], reyes: ["hispanic_latino"],
  gutierrez: ["hispanic_latino"], ortiz: ["hispanic_latino"], chavez: ["hispanic_latino"],
  ramos: ["hispanic_latino"], ruiz: ["hispanic_latino"], alvarez: ["hispanic_latino"],
  castillo: ["hispanic_latino"], vasquez: ["hispanic_latino"], vazquez: ["hispanic_latino"],
  mendoza: ["hispanic_latino"], jimenez: ["hispanic_latino"], romero: ["hispanic_latino"],
  herrera: ["hispanic_latino"], medina: ["hispanic_latino"], aguilar: ["hispanic_latino"],
  vargas: ["hispanic_latino"], guzman: ["hispanic_latino"], munoz: ["hispanic_latino"],
  salazar: ["hispanic_latino"], delgado: ["hispanic_latino"], pena: ["hispanic_latino"],
  fuentes: ["hispanic_latino"], rios: ["hispanic_latino"], campos: ["hispanic_latino"],
  vega: ["hispanic_latino"], cabrera: ["hispanic_latino"], soto: ["hispanic_latino"],
  escobar: ["hispanic_latino"], navarro: ["hispanic_latino"], molina: ["hispanic_latino"],
  castro: ["hispanic_latino"], ortega: ["hispanic_latino"], silva: ["hispanic_latino"],
  nunez: ["hispanic_latino"], dominguez: ["hispanic_latino"], cortez: ["hispanic_latino"],
  cortes: ["hispanic_latino"], marquez: ["hispanic_latino"], rojas: ["hispanic_latino"],
  contreras: ["hispanic_latino"], estrada: ["hispanic_latino"], figueroa: ["hispanic_latino"],
  acosta: ["hispanic_latino"], padilla: ["hispanic_latino"], sandoval: ["hispanic_latino"],
  ibarra: ["hispanic_latino"], velasquez: ["hispanic_latino"], velazquez: ["hispanic_latino"],
  guerrero: ["hispanic_latino"], mejia: ["hispanic_latino"], santiago: ["hispanic_latino"],

  // African immigrant (Nigerian Yoruba/Igbo/Hausa, Ghanaian Akan)
  okafor: ["african_immigrant"], okoro: ["african_immigrant"], okonkwo: ["african_immigrant"],
  chukwu: ["african_immigrant"], eze: ["african_immigrant"], nwosu: ["african_immigrant"],
  obi: ["african_immigrant"], nwankwo: ["african_immigrant"], uche: ["african_immigrant"],
  okeke: ["african_immigrant"], ezeh: ["african_immigrant"], adeyemi: ["african_immigrant"],
  adebayo: ["african_immigrant"], adewale: ["african_immigrant"], adeleke: ["african_immigrant"],
  ademola: ["african_immigrant"], adeoye: ["african_immigrant"], adeniyi: ["african_immigrant"],
  afolabi: ["african_immigrant"], balogun: ["african_immigrant"], ogunleye: ["african_immigrant"],
  oladipo: ["african_immigrant"], olawale: ["african_immigrant"], babatunde: ["african_immigrant"],
  abiodun: ["african_immigrant"], akinyemi: ["african_immigrant"], oyelaran: ["african_immigrant"],
  abubakar: ["african_immigrant", "middle_eastern"], yusuf: ["african_immigrant", "middle_eastern"],
  bello: ["african_immigrant", "hispanic_latino"], musa: ["african_immigrant", "middle_eastern"],
  aliyu: ["african_immigrant"], sani: ["african_immigrant"],
  mensah: ["african_immigrant"], owusu: ["african_immigrant"], boateng: ["african_immigrant"],
  asante: ["african_immigrant"], appiah: ["african_immigrant"], osei: ["african_immigrant"],
  adjei: ["african_immigrant"], ofori: ["african_immigrant"], agyeman: ["african_immigrant"],
  kwarteng: ["african_immigrant"], danso: ["african_immigrant"], acheampong: ["african_immigrant"],
  annan: ["african_immigrant"], nkrumah: ["african_immigrant"], frimpong: ["african_immigrant"],
  antwi: ["african_immigrant"], amoah: ["african_immigrant"], opoku: ["african_immigrant"],
  addo: ["african_immigrant"], darko: ["african_immigrant"], sarpong: ["african_immigrant"],

  // Middle Eastern / Arab / Persian
  haddad: ["middle_eastern"], khalil: ["middle_eastern"], nasser: ["middle_eastern"],
  mansour: ["middle_eastern"], najjar: ["middle_eastern"], khoury: ["middle_eastern"],
  younes: ["middle_eastern"], saleh: ["middle_eastern"], said: ["middle_eastern"],
  darwish: ["middle_eastern"], awad: ["middle_eastern"], hariri: ["middle_eastern"],
  maalouf: ["middle_eastern"], nabil: ["middle_eastern"], fahmy: ["middle_eastern"],
  hosseini: ["middle_eastern"], ahmadi: ["middle_eastern"], rezaei: ["middle_eastern"],
  mohammadi: ["middle_eastern"], karimi: ["middle_eastern"], jafari: ["middle_eastern"],
  tehrani: ["middle_eastern"], nazari: ["middle_eastern"], rostami: ["middle_eastern"],
  farahani: ["middle_eastern"], amini: ["middle_eastern"], shirazi: ["middle_eastern"],
  esfahani: ["middle_eastern"], moradi: ["middle_eastern"], kazemi: ["middle_eastern"],
  rahimi: ["middle_eastern"], sadeghi: ["middle_eastern"], akbari: ["middle_eastern"],
  hashemi: ["middle_eastern"], mousavi: ["middle_eastern"], alavi: ["middle_eastern"],
  ghorbani: ["middle_eastern"], bahrami: ["middle_eastern"],

  // Jewish American (strongly-associated names; ambiguous German-shared names omitted)
  cohen: ["jewish_american"], kohen: ["jewish_american"], levy: ["jewish_american"],
  levi: ["jewish_american"], levine: ["jewish_american"], goldberg: ["jewish_american"],
  goldstein: ["jewish_american"], goldman: ["jewish_american"], katz: ["jewish_american"],
  friedman: ["jewish_american"], rosenberg: ["jewish_american"], rosen: ["jewish_american"],
  rosenbaum: ["jewish_american"], shapiro: ["jewish_american"], feldman: ["jewish_american"],
  greenberg: ["jewish_american"], rubin: ["jewish_american"], adler: ["jewish_american"],
  bernstein: ["jewish_american"], weinstein: ["jewish_american"], weinberg: ["jewish_american"],
  horowitz: ["jewish_american"], kaplan: ["jewish_american"], berman: ["jewish_american"],
  lieberman: ["jewish_american"], perlman: ["jewish_american"], mandel: ["jewish_american"],
  birnbaum: ["jewish_american"], mendelsohn: ["jewish_american"], teitelbaum: ["jewish_american"],
  moskowitz: ["jewish_american"], abramowitz: ["jewish_american"], rabinowitz: ["jewish_american"],
  mizrahi: ["jewish_american"], sasson: ["jewish_american"], edelman: ["jewish_american"],
  kahn: ["jewish_american", "middle_eastern", "south_asian"],
};

export function guessBackground(name: string): { key: string; confidence: "low" }[] {
  if (!name || typeof name !== "string") return [];
  // Strip diacritics so accented input (Jose, Munoz, Hernandez) still matches.
  const decomposed = name.normalize("NFD");
  let folded = "";
  for (const ch of decomposed) {
    const code = ch.codePointAt(0) || 0;
    if (code >= 0x300 && code <= 0x36f) continue;
    folded += ch;
  }
  const cleaned = folded.toLowerCase().replace(/[^a-z\s-]/g, " ").trim();
  if (!cleaned) return [];
  const parts = cleaned.split(/[\s-]+/).filter(Boolean);
  if (parts.length === 0) return [];
  const surname = parts[parts.length - 1];

  const keys: string[] = [];
  const add = (arr?: string[]) => {
    if (!arr) return;
    for (const k of arr) if (!keys.includes(k)) keys.push(k);
  };

  add(SURNAME_MAP[surname]);

  // Fall back to broad pattern heuristics only when the direct lookup found nothing,
  // to catch the enormous variation these communities carry. Still always "low".
  if (keys.length === 0) {
    if (/(zadeh|zada|pour|poor|nejad|nezhad|khani)$/.test(surname)) {
      add(["middle_eastern"]);
    } else if (
      /^(ade|adu|olu|ola|oye|oluwa|opeyemi)/.test(surname) ||
      /^(chi|chukwu|nwa|obi|eze|ngo|ije)/.test(surname) ||
      /(mensah|owusu|boateng|asante|appiah|osei|adjei|ofori|kwame|kwabena)/.test(surname)
    ) {
      add(["african_immigrant"]);
    }
  }

  return keys.map((k) => ({ key: k, confidence: "low" as const }));
}

// The highest-anxiety, highest-loyalty segment, and it cross-cuts every community
// above. First-gen-to-college families reward the closer who becomes their trusted
// translator and punish the one who makes them feel behind. These lines apply to a
// first-gen family of any background.
export const FIRST_GEN_PLAYBOOK: string[] = [
  "Never frame the current school as a failure. For a first-gen family it is usually a hard-won win the whole family is proud of, so build from that pride, not from rescue.",
  "Assume zero insider knowledge without ever letting them feel it. Define every term (transfer credit, articulation agreement, aid appeal) in plain words, and check understanding instead of testing it.",
  "Name the hidden rules out loud. Your core value is making the invisible system visible, so say plainly that no one hands families a manual for this and that is exactly what you are for.",
  "Soothe the imposter feeling head-on. Treat every question as smart rather than basic, and make clear that not having done this before is the norm, not a deficiency.",
  "Sell guidance and safety over prestige and hype. Reduce overwhelm to one clear next step at a time; a confused mind does not buy and a scared family does not commit.",
  "Include the parents even when the student is driving. A parent who fears their child is being misled is the real emotional buyer, so earn their trust with total transparency about cost and process.",
  "Remember this is the most loyal segment you will ever serve. Deliver honestly, protect their scarce money, and they will refer their entire community to you.",
];
