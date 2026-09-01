// Sales-psychology doctrine for TransferringUP's /hq dashboard.
// The buyer: a college student (or their parent) paying a premium fee to fix
// a first outcome they experienced as failure or settling. Transfer buyers are
// not freshman buyers: they carry a prior verdict, they already failed at DIY,
// they are time-boxed by the window, and the purchase is often status repair
// for the family. This file is the operating manual: what is true about these
// buyers, and exactly what to say. Companion to src/lib/archetypes.ts, keyed
// by the same eight archetype ids.

export const DOCTRINE: { title: string; insight: string }[] = [
  {
    title: "The Prior-Result Wound",
    insight:
      "Every transfer lead carries a verdict: a rejection, a waitlist, or a settle they signed under pressure. That wound, not the desire for a service, is the buying energy, so label it in the first three minutes (Voss: 'it sounds like the first round still bothers you') and let them confirm it out loud. The person who names the wound accurately is presumed able to heal it. Never minimize the first outcome; minimizing it minimizes the reason they are on the phone.",
  },
  {
    title: "They Already Tried Alone",
    insight:
      "Freshman-help buyers purchase safety; transfer buyers ran the DIY playbook once and are living inside its result. You are not selling information against ignorance, you are selling a guided second attempt against a proven failed method. On the call, have them narrate exactly what they did last cycle, then contrast it with what a guided file looks like: the gap sells itself. This is the Challenger teach in its purest form: their process failed, not their profile.",
  },
  {
    title: "Staying Is the Loss",
    insight:
      "Prospect theory: losses hurt roughly twice as much as equivalent gains, so never frame transferring as an upgrade. Frame staying as an ongoing, compounding loss of semesters, network, and identity. SPIN implication questions do this mechanically: 'what does one more year there cost you?' makes them compute the loss themselves, and a self-computed loss is believed while a quoted one is resisted.",
  },
  {
    title: "The Settling Narrative",
    insight:
      "Most leads have publicly told friends and family 'it's actually fine here,' and part of what they are buying is permission to stop pretending. Create the private space where the real ambition can be said, then make them say it (Cialdini consistency: a stated ambition demands follow-through). Once they have named the real school to you, retreating to 'it's fine' costs them self-consistency, and every follow-up can quote their own words back at them.",
  },
  {
    title: "Status Repair Is the Product",
    insight:
      "For a large share of the pool, especially parent-funded leads, the transfer repairs a family story: the dinner-table question, the sweatshirt, the sibling comparison. Identify early who owns the wound, student or parent, because the wound-owner is the emotional buyer even if the other one pays. Sell relief from the story to the wound-owner and logistics to the other party; reversing that mapping kills deals.",
  },
  {
    title: "Information Asymmetry Is the Anxiety",
    insight:
      "Transfer admissions has no Naviance, no counselor, and almost no public data, so leads arrive convinced everyone else knows rules they cannot see. Authority here is built with specifics, not credentials: quote a real transfer admit rate, name how the essays differ from freshman essays, explain the midterm report. One insider fact they cannot Google, given away free on the call, proves the asymmetry is real and that you sit on the right side of it.",
  },
  {
    title: "They Buy a Guide, Not a Service",
    insight:
      "Nobody pays a premium fee for essay edits; they pay for a person who already crossed the wall they are standing under and will walk them over it. Speak as an operator inside the destination ('here is what readers at these schools actually reward'), never as a vendor listing deliverables. The moment the call becomes about your feature list instead of their crossing, you have become a service, and services get price objections.",
  },
  {
    title: "The Window Is Real",
    insight:
      "Transfer runs on hard windows: miss the cycle and the price is a full year of the exact life they called you to escape. That makes honest urgency structurally available, so you never need a fake deadline, only the calendar counted backwards out loud. Anchor every call to dates, and quantify a missed cycle in their own currency: recruiting seasons, tuition, one more year of Sundays.",
  },
  {
    title: "Whoever Qualifies, Wins",
    insight:
      "In premium services, power belongs to the party doing the evaluating, so make the call a mutual audition and say so in the first two minutes. Standards ('we do not take everyone, and here is the bar') are costly signaling: only an advisor with results to protect can afford to turn money away, so selectivity is itself proof of results. Every takeaway must be sincere and specific to their file; generic hard-to-get reads as a tactic and burns the trust that scarcity was supposed to build.",
  },
  {
    title: "The Trusted Third Party",
    insight:
      "In family deals you are the only neutral actor: the student cannot tell the parents the full truth, and the parents cannot push without damaging the relationship. Occupying that seat, holding both confidences and translating between them, makes you structurally irreplaceable in a way no competitor feature can match. Name the quiet dynamic to each party privately; saying what neither can say to the other is the fastest trust-build in this business.",
  },
  {
    title: "Sell the Future Identity",
    insight:
      "Identity-based motivation beats outcome motivation: people work hardest for who they will become, not what they will get. Get the lead describing a specific Tuesday at the dream school in present tense: the class, the people at the table, answering 'where do you go?' with the new name. Once that future self exists in their head, the current school stops being a preference problem and becomes an obstacle to an identity, and every follow-up should re-invoke that identity rather than restate features.",
  },
];

export type CallPlan = {
  opening: string;
  discovery: string[];
  reframe: string;
  close: string;
  followUp: { day: number; channel: "text" | "email"; message: string }[];
};

export const CALL_PLANS: Record<string, CallPlan> = {
  redemption: {
    opening:
      "Straight up, {firstName}: most people I talk to are running from something. You are running back at something. You applied, they said no, and reading your form it is obvious you never actually accepted that verdict. I respect it, and I am not going to pretend round one did not happen. What I want to show you today is why round two is a completely different game than the one you lost.",
    discovery: [
      "Take me back to decision day last cycle. Where were you when you opened it, and what did you do with the rest of that day?",
      "What is your honest theory on why it was a no? Not the polite version you tell people. Your real one.",
      "Say it out loud for me: if the retry works, where are you enrolled next fall?",
      "Now play the other branch. You skip this cycle, stay at {currentSchool}, maybe try again later. What does that extra year actually cost you, in money, momentum, and how it feels walking that campus?",
      "What is concretely different about your application this time? Besides wanting it more.",
    ],
    reframe:
      "Here is what almost every reapplicant gets wrong: they treat transfer as a second swing at the same game, so they polish the freshman application and resubmit their case. But transfer admissions is a different sport. Different readers, a far smaller pool, and one governing question: what did you do with the seat you actually got? Your freshman rejection is not even in the room; nobody is re-judging that verdict, they are judging your semesters at {currentSchool}. Rerun the round-one playbook and you will recreate the round-one result. Answer the new question and the slate is genuinely clean.",
    close:
      "Here is how I decide who I take. I only work with reapplicants where the first no was a positioning problem, not a profile problem, because those are the retries I can actually win, and my results depend on saying no to the rest. From this call, you are in that category. But I cap the cohort so every file gets my hours, and retry files take the most work of any type I handle. If you want the spot, we make the call this week, because your essay timeline starts eating itself after that.",
    followUp: [
      {
        day: 1,
        channel: "text",
        message:
          "{firstName}, one thing stuck with me from the call. You said {theirWords}. People who talk like that do not stay at {currentSchool} by choice. The spot we discussed holds through {deadline}. Want it?",
      },
      {
        day: 3,
        channel: "email",
        message:
          "{firstName}, putting the diagnosis in writing so you have it either way. Round one failed on positioning, not profile: your file answered the freshman question and never made the case a transfer reader needed to see. That is fixable, and it is exactly the kind of retry I take, because I can see the win. Last cycle I worked with a reapplicant whose numbers were below yours who got the yes, because the second file answered a different question than the first. You told me {theirWords}, and people who talk like that do not stay put by choice. I cap the cohort so every file gets my hours, and it closes {deadline}. One-word reply and we start this week.",
      },
      {
        day: 7,
        channel: "text",
        message:
          "Closing the cohort tomorrow, {firstName}. If the plan is to reapply solo, I respect the guts, but that was also the plan last time. Tell me which way you are going and I will either send the start docs or get out of your way.",
      },
    ],
  },

  escape: {
    opening:
      "I read every word of your form, {firstName}, so I am not going to make you re-perform how bad it is at {currentSchool}. I believe you. The question this call answers is not whether you leave. It is whether you land somewhere worth leaving for, and whether you move fast enough to make this the last year you feel like this.",
    discovery: [
      "What is the exact moment in a normal week when being there hurts the most? Paint it for me.",
      "What have you already tried to make it work there? Clubs, new people, different classes, whatever you threw at it.",
      "If nothing changes and you are unpacking boxes at {currentSchool} again in September, honestly, what does that do to you?",
      "Now flip it. It is a Tuesday next fall and the transfer worked. Where are you? Say the actual school out loud.",
      "Who in your life knows the full version of how bad it is? Or am I the first?",
    ],
    reframe:
      "Now the thing nobody tells students in your seat: admissions committees reject escape stories. 'I am unhappy and want out' is the most common transfer essay in the pile and the least effective, because schools do not want to be somebody's exit, they want to be somebody's destination. The craft, and it is genuinely craft, is converting your very real reasons for leaving into a running-toward story built on what the new school specifically offers. That conversion is the difference between a sympathy read and an admit, and it is exactly the work we do in the first two weeks.",
    close:
      "My standard for files like yours is simple: I only take students who can commit to the calendar, because wanting out without a deadline is just a mood, and I do not sell moods. The calendar looks like this: list and narrative locked in two weeks, essays drafted by week six, submitted inside the window, out by fall. If you can execute weekly, I will take you, and your last Sunday night there gets an actual date on it. If you cannot, tell me now and save your own year.",
    followUp: [
      {
        day: 1,
        channel: "text",
        message:
          "{firstName}, ran your calendar after the call. If we start now, your last Sunday night at {currentSchool} has an actual date on it. That is the entire point of moving fast. Want the week-by-week?",
      },
      {
        day: 3,
        channel: "email",
        message:
          "{firstName}, on the call you said {theirWords}. Reread that sentence and ask whether that person should spend another year where they are. Here is the exit in writing: weeks 1-2 we lock the school list and convert your reasons for leaving into a running-toward story (committees reject escape essays, which is why this step is everything), weeks 3-6 essays on a fixed cadence, submit inside the window, decisions by spring, out by fall. I take a limited number of files per cycle, and escape files need the narrative work started earliest. Your spot holds through {deadline}. After that it goes to the next person on the list, not as a tactic, just as how a capped cohort works.",
      },
      {
        day: 7,
        channel: "text",
        message:
          "Last one from me, {firstName}. The window does not move, and not deciding is deciding to stay. You told me what Sundays there feel like. If staying is the call, own it and I will respect it. If it is not, say the word today.",
      },
    ],
  },

  ccClimber: {
    opening:
      "Let me say the thing first so we can skip the weird part, {firstName}: community college to a top four-year is the most underrated lane in all of admissions, and you are one of the few people running it on purpose. I take these calls because the students with the least guidance are usually the ones with the most upside. So there is zero judgment coming from this side. Show me what you are working with.",
    discovery: [
      "Who at {currentSchool} actually knows what you are aiming for? Is there one person there who matches your ambition?",
      "Walk me through your credits so far. Do you know, today, which ones actually transfer to {dreamSchool} and which ones evaporate on arrival?",
      "Give me the real target, out loud. Not the safe answer you give relatives. The one you actually think about.",
      "Say you play it safe and land at a mid-tier four-year instead. Ten years out, what is the difference in your life between that and {dreamSchool}? Put something concrete on it.",
      "If you run articulation and requirements alone and get one thing wrong, what happens to your timeline?",
    ],
    reframe:
      "Here is what almost nobody tells CC students: the top schools do not merely tolerate community college transfers, several actively recruit them, because a high-GPA CC student with a real story is admissions gold, and Cornell in particular has one of the most transfer-friendly cultures in the Ivy League. The catch is that the machinery is brutal: credit articulation, course rigor mapping, the exact why-now narrative, and no one at your school is paid to know it. Your gap was never worthiness. It is navigation, and navigation is a solved problem the moment someone hands you the map.",
    close:
      "I do not take every CC student who calls, because my results depend on who I say yes to. I take the ones with the GPA, the story, and the work rate, since those are the files that win. You clear my bar, and honestly not everyone on these calls does. So the question is not whether you are good enough. That part is settled. It is whether you keep doing this solo with no map, or run it with someone who has walked people through this exact door.",
    followUp: [
      {
        day: 1,
        channel: "text",
        message:
          "{firstName}, meant every word today. CC to {dreamSchool} is a real lane and you have the numbers to run it. Most people in your seat never hear that from someone who actually knows the machinery. The spot from our call holds through {deadline}.",
      },
      {
        day: 3,
        channel: "email",
        message:
          "{firstName}, putting this in writing because you should have it either way. Your path is three parts: GPA (you have it), articulation (fixable with the map), and narrative (we build it together). What kills CC files is never talent. It is one mis-transferred credit or a generic essay, discovered after decisions come back when it is too late to fix. You said {theirWords} on our call, and that is the sentence of someone who should not be navigating this solo. I take a limited number of CC files each cycle because they need the most map work, and this cohort closes {deadline}. Reply and we start with your credit audit this week.",
      },
      {
        day: 7,
        channel: "text",
        message:
          "Closing the cohort, {firstName}. Whatever you decide, hear this once from someone who knows the pool: you are not a community college student who might sneak in somewhere. You are a {dreamSchool} candidate who currently attends a community college. Decide from that. In or out by tonight.",
      },
    ],
  },

  bigFish: {
    opening:
      "{firstName}, your numbers force me to open with the honest question: why are you still at {currentSchool}? From where I sit, you won that game about three semesters early, and people built like you do not handle boredom well. So this call is not about whether you can move up. It is about whether you are actually going to.",
    discovery: [
      "When is the last time a class there genuinely pushed you? Like, made you nervous.",
      "Who is the most ambitious person you talk to in a normal week, and where are they headed? Do they raise your ceiling or do you raise theirs?",
      "Name the room you actually belong in. Say the school out loud, no hedging.",
      "Run it forward: four more semesters of being the smartest person in every room. What does that cost you by 25, in network, in sharpness, in the offers sitting on your desk?",
      "You clearly could have started this before now. What has actually stopped you?",
    ],
    reframe:
      "Here is the part your transcript cannot see: at the top of the transfer market, numbers do not carry the file. The committees you are targeting see 4.0s from every school in America, and they admit narratives, not stats. And the big-fish story has a trap in it: written naively, 'my school is too easy for me' reads as arrogance and gets binned. Written correctly, it is a trajectory story: what you built when nothing pushed you, and why your ceiling requires their room. Your profile is finished. Your positioning has not started, and positioning is the entire remaining game.",
    close:
      "My standard for files like yours: I take students whose ceiling is provably above their current room, and who can handle hearing that their essays are the weak point even when the GPA is perfect, because that is exactly the feedback your file needs. You qualify on the first, and this call tells me you can take the second. I hold very few spots for high-stat files because the positioning work is heavy. Move like someone who belongs in the bigger room and it is yours.",
    followUp: [
      {
        day: 1,
        channel: "text",
        message:
          "{firstName}, you have been the biggest fish in that pond long enough that it stopped being a compliment. You said {theirWords} today. Rooms that push back exist, and your numbers already clear their bar. Door is open through {deadline}.",
      },
      {
        day: 3,
        channel: "email",
        message:
          "{firstName}, the short version of our call: your profile is finished and your positioning has not started. That is the entire diagnosis. Numbers like yours are common in the transfer pool at the top. A story that explains what you built when nothing pushed you is rare, and that story does not write itself in the last two weeks before the window. I keep only a few spots for high-stat files because the positioning work is heavy, and yours would be one of the strongest files I take this cycle, which is exactly why watching it sit unused at {currentSchool} would bug me. Cohort locks {deadline}.",
      },
      {
        day: 7,
        channel: "text",
        message:
          "Finalizing the list tomorrow, {firstName}. One way to see it: staying is choosing four more semesters of easy wins over one semester of real ones. You already know which one you respect. In or out?",
      },
    ],
  },

  legacyPressure: {
    opening:
      "Before we do logistics, let me name what is actually happening here, because someone should: this transfer is a family project with family stakes, spoken or not. That is normal, and it is real fuel, but it is heavy to carry alone. My job is to be the one person in this who is not the parent and not the kid. The student can tell me the full truth, and the parents get a driver they can finally stop pushing. That neutral seat is most of what you are buying.",
    discovery: [
      "When school comes up at the dinner table right now, what actually happens? Walk me through the last time.",
      "Honest answer, and there is no wrong one: whose idea was this call?",
      "{firstName}, forget everyone else's expectations for one second. If it were only up to you, where are you enrolled next fall? Say it.",
      "If this cycle slips and next Thanksgiving arrives with nothing changed, what is that like? For you, and for the family?",
      "Now flip it: the admit comes in. Who gets the first call, and what changes in the house that week?",
    ],
    reframe:
      "Here is the counterintuitive thing about family-driven transfers: parental pressure, applied directly, is the number one killer of these applications. Committees have read ten thousand essays written to please parents, and they can smell one inside a paragraph; the file reads hollow, and hollow files lose. The fix is not less family investment. It is a third party who converts family expectation into student ownership. When the student owns the project and the family backs it, that is the exact configuration that wins, and manufacturing that configuration is precisely what my process does.",
    close:
      "My standard for family engagements: I only take them when both sides are in. If the student is doing this to make the parents happy, I pass, because it shows up in the file and I do not submit hollow files. If the student owns it and the family backs it, that combination wins, and from this call I believe it is buildable here. So the next step is everyone on one call this week: the parents get process, outcomes, and accountability, and {firstName} gets ownership of the work. That call is where this becomes real.",
    followUp: [
      {
        day: 1,
        channel: "text",
        message:
          "{firstName}, good call today. The one thing to sit with: this wins when it becomes YOUR project with the family behind you, not the family's project with you inside it. Building that flip is literally what my process does. Get me the family call by {deadline} and we start this right.",
      },
      {
        day: 3,
        channel: "email",
        message:
          "{firstName}, sharing what I would tell any family in this seat. The pattern that fails: parents push, student complies, essays read hollow, committees pass, and next Thanksgiving is worse than this one. The pattern that wins: a third party turns the family's expectation into the student's ownership, the parents get real reporting instead of nagging rights, and the file reads true. That second pattern is manufactured, not hoped for, and manufacturing it is my job. You told me {theirWords}, and that is exactly the energy that works once it is pointed right. I hold spots for a limited number of families per cycle. Let's get everyone on one call before {deadline} and decide this properly.",
      },
      {
        day: 7,
        channel: "text",
        message:
          "{firstName}, closing this cycle's roster by {deadline}. One question decides it: does the family talk about {dreamSchool} at next Thanksgiving as the plan that happened, or as the thing everyone stopped bringing up? Book the call and I will handle the rest.",
      },
    ],
  },

  mercenary: {
    opening:
      "I will skip the college-experience speech, {firstName}. You want {dreamSchool} because that is where the firms recruit and {currentSchool} is not on the list. That is a completely rational trade, and you have clearly done the 2am Reddit and WSO homework. So this call is one question: does the transfer math clear on your recruiting timeline, or not. Let's run it.",
    discovery: [
      "Name the end state precisely: which firms, which group, what is the actual dream desk?",
      "Walk me through the recruiting timeline as you understand it. When do the internship apps that feed your junior offer actually open?",
      "Have you run the placement delta between {currentSchool} and a target for your firms? Give me your numbers.",
      "Cost the non-target path honestly: staying put, how do you get to the same seat, and how many extra years and coin flips does that route add?",
      "Real talk on bandwidth: can your GPA survive running a transfer and recruiting prep in the same semesters? Because both of them are watching it.",
    ],
    reframe:
      "Here is what the forums get wrong: the transfer is not the play, the timing of the transfer is the play. A target-school admit that lands one semester after the internship window closes is worth less than staying non-target and grinding the network game, because you would arrive at the brand after the pipeline moment has passed. This cycle, your math closes: you land with runway before the window. Next cycle, it inverts. Sequencing, not admission, is the actual product here, and sequencing is exactly what I sell.",
    close:
      "My bar for pipeline files: I only take students where the timeline math actually closes, because getting someone a target admit that misses their window is a loss I do not put my name on. Yours closes this cycle, and this cycle only. I need your decision by {deadline}, not for pressure, but because the file work backwards-schedules from the transfer window and we are already inside it. You respect operators, so I will talk to you like one: the trade is on the table, and it expires.",
    followUp: [
      {
        day: 1,
        channel: "text",
        message:
          "{firstName}, reran the math after we hung up. Start this cycle: you land at {dreamSchool} with runway before the internship window. Start next cycle: you land after it closes. Same admit, completely different trade. That is the whole decision.",
      },
      {
        day: 3,
        channel: "email",
        message:
          "{firstName}, the numbers one more time, since numbers are how you decide. The seat you named recruits almost exclusively from targets. From {currentSchool}, the honest path is a coin-flip process plus years of lateral grinding. From {dreamSchool}, it is the standard pipeline you already understand. The fee is a rounding error against the comp delta of reaching that seat even one year earlier, and you know it, because you have already run this math at 2am. What you cannot buy later is the timeline: the file must backwards-schedule from the transfer window, and we are inside it now. Decision by {deadline}. In or out, no hard feelings either way, but the window does not do feelings.",
      },
      {
        day: 7,
        channel: "text",
        message:
          "Last ping, {firstName}. You told me {theirWords}. Operators do not let a positive-EV trade expire from indecision. {deadline} is the line. Call it.",
      },
    ],
  },

  prestigeChaser: {
    opening:
      "You put real names on your list, {firstName}, and I am not going to spend this call talking you down from them. Most advisors would open with 'let's be realistic.' I would rather open with what those exact schools actually take in a transfer, because the list you wrote is gettable for the right file, and building that file is literally my job.",
    discovery: [
      "Rank the list for me. If you could only have one name on the sweatshirt, which one is it? Say it.",
      "What happens in your chest right now when someone asks where you go to school?",
      "You mentioned the academics. What specifically does {dreamSchool} have that {currentSchool} cannot give you?",
      "Play the long game out: you graduate from {currentSchool} instead. How do you tell that story at 30, and does it ever fully sit right?",
      "How many transfer spots do you think {dreamSchool} actually gave out last cycle? Want the real number and what it means for your file?",
    ],
    reframe:
      "Here is what most people chasing names never learn: elite transfer admissions is not a deservingness contest. The slots are tiny, and committees do not hand them to the shiniest stats, they hand them to applicants who make the school's own story better, which is a completely different filter. The good news: that filter can be reverse-engineered school by school. Each name on your list is buying something specific, and the file that wins is the one that sells them exactly that. Generic excellence loses to engineered fit at every school you listed. So we do not make you more impressive. We make you inevitable to a specific reader.",
    close:
      "Here is the symmetry you will appreciate: the schools on your list say no to almost everyone, and that is exactly why you want them. I run the same math. My results only hold because I am selective about who I take, so a yes from me actually means something, and from this call, you are a yes. The question is whether you move like someone who wants the name or someone who just likes wanting it. The cohort caps soon, and I would rather have your file in it than not.",
    followUp: [
      {
        day: 1,
        channel: "text",
        message:
          "{firstName}, still thinking about your list. Every other advisor would have spent today lowering it. I spent it telling you what {dreamSchool} actually buys in a transfer file. That difference is the whole service. Spot holds through {deadline}.",
      },
      {
        day: 3,
        channel: "email",
        message:
          "{firstName}, one thing from the call worth repeating: the names on your list do not admit the most impressive applicants, they admit the ones engineered for their specific filter, and that engineering is learnable. Your file, positioned right, belongs in that conversation, and you said it yourself: {theirWords}. Here is the honest scarcity: I cap the cohort to protect my results, the same way your schools cap their class to protect their brand. That symmetry is why my yes is worth something, and you have it. It expires {deadline}.",
      },
      {
        day: 7,
        channel: "text",
        message:
          "Cohort locks tomorrow, {firstName}. A year from now you are either answering 'where do you go?' differently, or you are still rehearsing the current answer. You know which one you want. Tell me by tonight.",
      },
    ],
  },

  quietBuilder: {
    opening:
      "My read on you, {firstName}, is that you have already done more research than most people who call me, and right now you are quietly evaluating whether I actually know what I am doing. Good. That is exactly how you should buy this. So instead of a pitch, let me show you the machine, and you can grade it question by question.",
    discovery: [
      "Start with what you have already figured out about transfer admissions on your own. I will tell you where you are right and where the map is wrong.",
      "On paper, {currentSchool} is fine, and fine does not usually generate this call. What is the actual trigger?",
      "Commit to a name for me: if this whole thing goes right, where are you enrolled next fall?",
      "Cost out another year of fine. Not misery, just fine. What does it run you in the things you actually care about?",
      "Last one: what would you need to see from me, concretely, to know this is a sound investment and not a gamble?",
    ],
    reframe:
      "Here is the flaw in the careful-researcher plan, and I say it with respect because I am one too: in transfer admissions, the fatal risk is not bad help, it is invisible error. The solo applicant does not find out the school list was miscalibrated, the why-essay was generic, or the midterm report was mishandled until decisions come back, and by then the cycle is spent with no retry for a year. There is no feedback loop until it is too late to use one. Process is not a luxury here, it is the only available risk control, and buying it from someone who runs the loop every cycle is the conservative move, not the extravagant one.",
    close:
      "Here is my standard, stated upfront because you will appreciate it: I take students who execute. The process is week by week, list and narrative first, essays in structured drafts, every deadline scheduled backwards from the window, and if assignments come back late twice, we part ways, which I tell everyone before they pay me. That standard is why my results hold, and it is why my spots cap. Take 48 hours, verify whatever you want to verify, then give me a clean yes or no. Deciders decide, and everything about this call says you are one.",
    followUp: [
      {
        day: 1,
        channel: "text",
        message:
          "{firstName}, no push here, just the one fact worth keeping from today: solo transfer files fail on errors you cannot see until decisions come back, and by then the year is spent. Process is the risk control. Your 48 hours started at the call.",
      },
      {
        day: 3,
        channel: "email",
        message:
          "{firstName}, since you evaluate on evidence, here is the machine in writing: weeks 1-2 school list and narrative, weeks 3-6 essay drafts on a fixed cadence, every deadline scheduled backwards from the transfer window, weekly check-ins, and a late-work standard I actually enforce, because it is why my results hold. You told me {theirWords}, which tells me the trigger is real even if the volume is low. The honest constraint: spots cap, and essay quality degrades with every week of runway we lose, so a slow yes costs the same as a fast no. Whatever you decide, decide by {deadline}.",
      },
      {
        day: 7,
        channel: "text",
        message:
          "{firstName}, closing enrollment {deadline}. If it is a no, say so and I will not follow up again, zero hard feelings. If it is a yes, we start Monday and your first assignment is already written. Deciders decide.",
      },
    ],
  },
};

export const CHASE_RULES: string[] = [
  "Never send pricing after the call. The number is said once, out loud, inside the value context you just built. 'Can you email me the pricing?' gets: 'I do not do pricing emails. If the fit is right we will both know it on this call, and I will tell you the number myself.' Chasing paper is for vendors.",
  "Every deadline gets a reason, said in the same breath. Cohort caps, essay runway, the transfer window itself: all real. A deadline with a reason is information; a deadline without one is a tactic, and these buyers grew up on the internet and can smell the difference instantly.",
  "Open with the mutual audition. First two minutes: 'This call is me figuring out whether I can win with your file as much as you figuring out me.' It flips the frame before any selling starts, and everything afterward becomes them qualifying for a spot.",
  "State who you do NOT take before who you take. 'I pass on students who want it done for them, and on files where I cannot see the win.' Costly signaling: only someone with results to protect can afford to turn away checks, so the refusal itself is the proof.",
  "Hold the silence after the close. Say the number, state the standard, ask the question, then stop talking. The first person to speak owns the discomfort, so make it them. Ten seconds of silence closes more than ten minutes of talking.",
  "One chase per channel, maximum, then a clean takeaway. Scarcity of your attention is part of the product; a seller who follows up six times has told the buyer exactly how empty his roster is.",
  "Decline-then-rescue the borderline lead. 'Honestly, I am not sure I would take this on, and here is the specific reason.' If they argue for the spot, desire has flipped, and you let them earn the yes with a concrete condition: a grade, an essay draft, a parent call. Only use it when the doubt is real; faked doubt reads as negging and dies on contact.",
  "Make them own the next action, always. Never end with 'I will send you some stuff.' End with 'You are talking to your parents tonight and texting me the decision by Thursday.' The person holding homework is the person doing the chasing.",
  "The consult is the free sample, so make it taste expensive. Deliver exactly one insider insight they cannot Google, then stop teaching. They should leave knowing that you know more, not knowing what you know.",
  "When a dead lead resurfaces, requalify from zero. 'A lot has moved since we talked. Tell me where things stand and I will tell you whether there is still a fit this cycle.' Returning leads accept standards they resisted the first time, because coming back was itself a concession.",
];

export const PARENT_PLAYBOOK: { situation: string; move: string }[] = [
  {
    situation: "Parent is the buyer and on the call (filledBy is parent, or funding is parents-and-they-know).",
    move:
      "Run a two-audience call: outcomes, process, and accountability aimed at the parent; belonging and ownership aimed at the student. The parent is buying relief from managing an application they cannot control, so show the reporting rhythm (what they will see, and when) and watch the shoulders drop. Close by booking the full-family call before anyone hangs up.",
  },
  {
    situation: "Parent carries round-one guilt: 'we should have gotten help the first time.'",
    move:
      "Absolve fast, then redirect: 'Nobody gets this right solo the first time. That is not a parenting failure, it is an information problem, and the transfer round rewards exactly the kind of family that acts on it.' Guilt frozen is paralysis; guilt absolved becomes budget.",
  },
  {
    situation: "ROI parent: engineer or finance brain, wants the number justified.",
    move:
      "Give the spreadsheet framing without apology: the fee against four years of tuition, the earnings and network delta of the target school, the cost of a lost cycle in both dollars and a year of life. Then add the line ROI parents respect: 'You are not paying for essays. You are paying to not run a six-figure decision on guesswork.'",
  },
  {
    situation: "Status-wound parent: the transfer is repairing the family story.",
    move:
      "Let them talk, then label it: 'It sounds like this has been a hard thing to talk about with friends.' Never name status as their motive out loud; sell the moment the story flips instead: the call home, the new sweatshirt, the easy answer to 'where does your kid go now?' You are selling the ending of a story they have been stuck inside for a year.",
  },
  {
    situation: "Student is sold, parents do not know yet (fundingSource: parents-but-don't-know-yet).",
    move:
      "Never let the student pitch the parents alone; they will undersell it in one sentence and the deal dies at dinner. Coach the ask (when to raise it, what to say, what number to name), arm them with one page of proof, and offer the parent call within 48 hours: 'Have them call me before they decide anything.' You closing the parent IS the service.",
  },
  {
    situation: "Helicopter parent who wants to run the process personally.",
    move:
      "Do the ownership-transfer talk on day one: 'Committees can tell when a parent wrote the file, so my process runs through the student. In exchange, you get a direct line to me and scheduled updates.' The parent trades control for visibility plus a private channel; the student gets the working relationship. Both got what they actually wanted, which was never the same thing.",
  },
  {
    situation: "Sticker shock from the payer.",
    move:
      "Never discount; adjust scope or walk. Reframe exactly once: 'The fee is a fraction of one semester at the school you are trying to leave, and the downside of a botched cycle is a full year, not a fee.' Then hold in silence. A price defended calmly signals the results behind it; a price negotiated signals doubt about them.",
  },
];
