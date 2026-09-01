// Outcome-based follow-up engine for TransferringUP.
// Companion to src/lib/psychDoctrine.ts. That file runs a per-archetype
// 3-touch nurture. This file is keyed to what ACTUALLY HAPPENED on or around
// the call, because you follow up with a no-show completely differently than
// with someone who showed, loved it, and now needs to talk to their parents.
//
// Voice: confident 20-something Cornell operator. Warm, human, peer-to-peer,
// honest scarcity, no fake deadlines. Every message is send-ready.
// Tokens: {firstName} {dreamSchool} {currentSchool} {theirWords} {benchmark} {deadline}
//
// Rule of thumb baked into every sequence: escalate honestly toward either a
// decision or a clean release, and let the final takeaway do the closing,
// because a dignified exit relieves the pressure that was blocking the yes.

export type Touch = {
  day: number;
  channel: "text" | "email";
  subject?: string;
  message: string;
  goal: string;
};

export type Sequence = {
  outcome: string;
  label: string;
  psychology: string;
  touches: Touch[];
};

export const SEQUENCES: Record<string, Sequence> = {
  noShow: {
    outcome: "noShow",
    label: "Missed the call entirely (first time)",
    psychology:
      "A first no-show is almost always logistics or a last-second loss of nerve, not a verdict. The person booked because they wanted this, so the fastest recovery treats it as a mutual mixup, not a rejection. Move in minutes not days, give them a graceful out, and make rebooking a single reply.",
    touches: [
      {
        day: 0,
        channel: "text",
        message:
          "{firstName}, I was on at our time and I think we got our wires crossed. Zero stress, it happens. Want to grab a new slot? Reply with a day this week that works and I will lock it in. Still want to get you to {dreamSchool}.",
        goal: "Reopen the loop within minutes and frame it as a mutual mixup.",
      },
      {
        day: 0,
        channel: "email",
        subject: "we missed each other, no big deal",
        message:
          "{firstName}, we crossed wires at our call time, totally fine. The reason I do not want to just let this slide to next month: the transfer window at {dreamSchool} runs on a hard clock, and every week we lose now is a week your file does not get to breathe before {deadline}. That is the whole point of the call. It is where we map your actual shot and what the next 30 days need to look like. Two times I can do this week: Wednesday afternoon or Thursday morning. Reply with one and it is yours.",
        goal: "Re-anchor on the value and the real deadline, not just logistics.",
      },
      {
        day: 2,
        channel: "text",
        message:
          "{firstName}, not going to blow up your phone. I hold a couple of call slots a week for transfer files and I would rather one of them be yours than a stranger's. Still want to talk through {dreamSchool}? One word and I will send a time.",
        goal: "Light re-offer carried by honest scarcity.",
      },
      {
        day: 4,
        channel: "text",
        message:
          "Last one from me, {firstName}, promise. I will stop reaching out so I am not the guy nagging you. If the {dreamSchool} thing is still real, you know where I am. Text the word 'call' anytime before {deadline} and we pick it right back up. Rooting for you either way.",
        goal: "Clean release that leaves the door open on their terms.",
      },
    ],
  },

  noShowRepeat: {
    outcome: "noShowRepeat",
    label: "Missed the call twice",
    psychology:
      "Two misses is a signal, not an accident. Either the timing is genuinely wrong, someone else (usually a parent) is quietly vetoing, or the desire cooled. Chasing harder backfires, so name the pattern out loud without guilt, hand them full control of whether this continues, and stop guessing.",
    touches: [
      {
        day: 0,
        channel: "text",
        message:
          "{firstName}, twice now we have missed each other, so I am not going to just book a third and hope. Straight question, no wrong answer: is the timing just bad right now, or has the {dreamSchool} plan cooled off? Either is completely fine, I just want to stop guessing.",
        goal: "Name the pattern, hand them control, skip the guilt trip.",
      },
      {
        day: 1,
        channel: "email",
        subject: "want to make this easy for you",
        message:
          "{firstName}, I have booked you twice and both times life got in the way, which usually means one of two things. Either you still want this but your schedule is genuinely chaos, in which case tell me and I will bend around you, evenings or weekends, whatever works. Or the moment has passed and staying at {currentSchool} feels more okay than it did, which happens and is nothing to apologize for. I would just rather hear it than keep pinging you. Which one is it? One line back and I will do the right thing.",
        goal: "Force a low-cost binary that either rebooks on their terms or releases cleanly.",
      },
      {
        day: 3,
        channel: "text",
        message:
          "All good, {firstName}, I will take the hint and step back so I am not that guy. If the itch to leave {currentSchool} comes back before {deadline}, my line stays open. Just text me and we skip straight to the real conversation. Genuinely wishing you the best.",
        goal: "Graceful release, since a clean exit often triggers the return.",
      },
    ],
  },

  showedNoClose: {
    outcome: "showedNoClose",
    label: "Good call, no decision made",
    psychology:
      "They showed, engaged, and felt the pull, but did not commit on the call, which for a 3 to 6 thousand dollar decision is normal and healthy. The energy from the call decays by the hour, so the job is to freeze the two or three things that landed while they are still warm, not to re-pitch. Reflect their own words back and make the next step a small, clear yes.",
    touches: [
      {
        day: 0,
        channel: "text",
        message:
          "{firstName}, real talk, that was one of the better calls I have had this week. The part that stuck with me: {theirWords}. That is not someone who belongs at {currentSchool} another year. No pressure tonight, I just wanted you to have it in writing before the day blurs it.",
        goal: "Preserve the emotional peak and their own stated ambition before it decays.",
      },
      {
        day: 1,
        channel: "email",
        subject: "your {dreamSchool} read, in writing",
        message:
          "{firstName}, putting the honest version on paper so you are not deciding off memory. Where you stand: your profile is genuinely in range for {dreamSchool}, transfer admit rates there sit around {benchmark}, and the thing that moves you from in range to in is the file itself, which is exactly the part most people get wrong solo. What the next 30 days look like with me: we lock the narrative, target the right readers, and get your case answering the transfer question instead of the freshman one. This is also the read you can show anyone else who is in the decision. Whenever you are ready, one reply and we start. The clock on {dreamSchool} is {deadline}.",
        goal: "Hand them a concrete, forwardable artifact plus a real deadline.",
      },
      {
        day: 3,
        channel: "text",
        message:
          "{firstName}, no chase, just a heads up. I cap how many transfer files I take a cycle so each one gets real hours, and I am filling this cohort now. I would rather hold a spot for you than someone half as into it as you were on that call. Want me to hold it?",
        goal: "Honest scarcity while keeping them owning the yes.",
      },
      {
        day: 6,
        channel: "text",
        message:
          "{firstName}, where is your head at on {dreamSchool}? Totally fine if you need another beat, I just do not want to assume either way and let your window quietly close on you. A yes and we start, a not-now and I will get out of your hair.",
        goal: "Force a soft decision without pressure.",
      },
      {
        day: 9,
        channel: "text",
        message:
          "I will stop here, {firstName}. You have the full picture and you do not need me in your inbox to make this call. If {dreamSchool} is still the plan, the door is wide open, just text 'go' before {deadline} and we move. If it is not, no hard feelings at all, you were a pleasure to talk to.",
        goal: "Clean release after they have full information.",
      },
    ],
  },

  thinkingAboutIt: {
    outcome: "thinkingAboutIt",
    label: "Let me think about it",
    psychology:
      "Let me think is rarely about thinking. It is an unspoken concern (price, a parent, or fear of a second failure) dressed up as prudence. Pushing harder validates the stall, so make it safe to name the real hesitation and keep the future self vivid so inertia does not win by default. Reassurance beats persuasion here.",
    touches: [
      {
        day: 1,
        channel: "text",
        message:
          "{firstName}, you said you wanted to think it over, which I respect. Honest thing though: when people say that to me it is almost never about thinking, it is usually one specific thing under the surface. Is it the money, is it someone else you need on board, or is it the fear of round two not working? Whatever it is, I would rather help you think about the actual thing.",
        goal: "Surface the real objection hiding under let me think.",
      },
      {
        day: 2,
        channel: "email",
        subject: "the two things people are usually chewing on",
        message:
          "{firstName}, figured I would save you the mental gymnastics. When someone sits on this decision it is almost always one of two fears. One, what if I pay and it does not work. Fair, so here is the truth: I only take files I believe I can win, and yours is one. Transfer admit rates at {dreamSchool} run around {benchmark}, and your profile plays inside that. Two, what if this is fine and I am overreacting about {currentSchool}. Only you can answer that, but you already told me {theirWords}, and people who feel fine do not say that. Sit with it, but sit with the real question, not a fog. I am here when it clears. {deadline} is the date that actually matters.",
        goal: "Preempt the two real fears and replace vague worry with a clear question.",
      },
      {
        day: 5,
        channel: "text",
        message:
          "{firstName}, picture the actual Tuesday. It is next fall, someone asks where you go, and you say {dreamSchool} instead of {currentSchool}. That feeling is the whole decision. I am holding a cohort spot while you think, but I cannot hold it forever without it being fake urgency, and I do not do fake. Where are you leaning?",
        goal: "Re-invoke the future identity and pair it with honest scarcity.",
      },
      {
        day: 8,
        channel: "text",
        message:
          "Not going to keep poking, {firstName}. You have thought about it plenty and more texts from me will not make it clearer. If the answer is yes, text 'in' before {deadline} and we start this week. If it is no, that is genuinely okay and I will stop here. The door does not lock, but the cycle does.",
        goal: "Clean release that separates the door (open) from the cycle (closing).",
      },
    ],
  },

  parentGate: {
    outcome: "parentGate",
    label: "Student sold, needs parent buy-in",
    psychology:
      "The student is your champion but not your check-writer, and they are about to sell your value secondhand to a skeptical, cost-focused parent, which they will do badly if you send them in unarmed. Arm the champion with the exact language and proof a parent needs, and offer to take the heat yourself on a call so they never have to defend the price alone. Parents buy risk-reduction and logistics, not identity.",
    touches: [
      {
        day: 1,
        channel: "text",
        message:
          "{firstName}, you are sold, but now you have to sell it to your parents, and that is a totally different pitch than the one that landed on you. They will not care about the dream, they will care about money and risk. Do not walk in alone. Want me to hop on a 15 minute call with them and take the tough questions myself? Usually way easier than you playing middleman.",
        goal: "Prevent a botched secondhand pitch and offer to carry the load.",
      },
      {
        day: 2,
        channel: "email",
        subject: "something you can forward to your parents",
        message:
          "{firstName}, here is a version written for them, forward it straight if that is easier. For {firstName}'s parents: I am the advisor {firstName} spoke with about transferring from {currentSchool} to {dreamSchool}. Three things you probably want to know. One, this is a real window with a hard deadline of {deadline}, not an open-ended service. Two, I do not take students I do not believe I can help, because my results are the only marketing I have, and I told {firstName} the same to their face. Three, transfer admit rates at {dreamSchool} sit near {benchmark}, which sounds daunting, and that gap is exactly the part a guided file is built to close. Happy to answer anything on a short call, including the honest question of whether this is worth it for your family. My job is to tell you the truth, even when it is no. That is it, {firstName}. Send it and tell me when they want to talk.",
        goal: "Arm the champion with parent-language proof and lower the stakes of the ask.",
      },
      {
        day: 4,
        channel: "text",
        message:
          "{firstName}, how did it land with your folks? If they are on board, let us grab a time and go. If they had questions you could not answer, that is normal, put me on the phone with them and I will handle it. What is the holdup, honestly?",
        goal: "Diagnose the parent block and remove it directly.",
      },
      {
        day: 7,
        channel: "text",
        message:
          "{firstName}, I will give you and your parents room instead of hovering. This has to be a family yes or it is not worth it. If they get there before {deadline}, text me and I will make the start dead simple. If the timing is not right for them this cycle, I understand completely. Either way, you were the easy part.",
        goal: "Respect the family process with a clean release keyed to the parent decision.",
      },
    ],
  },

  priceObjection: {
    outcome: "priceObjection",
    label: "Wants it, choked on the price",
    psychology:
      "They want it and stalled on the number, which means the price feels bigger than the value in that moment, not that the money is impossible. Never discount first, because it teaches them the price was fake and cheapens the outcome. Instead re-anchor the cost against the real alternative, another year at {currentSchool}, which is far more expensive in tuition and lost time. If you flex, flex on terms, not price.",
    touches: [
      {
        day: 1,
        channel: "text",
        message:
          "{firstName}, I could tell the number gave you pause, and I would rather be straight than dance around it. Here is the reframe: the real price is not what I charge, it is what another year at {currentSchool} costs you. That is a full year of tuition for a school you are trying to leave, plus a year you never get back. Next to that, this is the cheap option.",
        goal: "Reframe price against the cost of staying, not against zero.",
      },
      {
        day: 2,
        channel: "email",
        subject: "the honest math",
        message:
          "{firstName}, no games, here is how I actually think about the cost. My fee is real money, I get it. But run the comparison that matters. One more year at {currentSchool} is another full year of tuition, room, and the exact life you called me to help you leave. Against that, my fee is a fraction, and it is the thing that shortens the sentence instead of extending it. I do not discount, because a discounted price would mean the first price was made up, and I do not work that way. What I can do is structure it so it is not one lump, split across the cycle. If money is the only thing between you and {dreamSchool}, let us solve the structure, not pretend the value is lower. {deadline} is the clock.",
        goal: "Hold the price, reframe against staying, offer terms instead of a discount.",
      },
      {
        day: 4,
        channel: "text",
        message:
          "{firstName}, still think you belong at {dreamSchool}, and I do not want a payment question to be the reason you spend another year where you do not want to be. I am holding your cohort spot a little longer, but not forever. Want me to send a couple of ways to structure it so it is doable?",
        goal: "Keep the door open on terms with honest scarcity.",
      },
      {
        day: 7,
        channel: "text",
        message:
          "Last note on this, {firstName}. I will not chase you on price, that is not the relationship. If the value is there for you and the timing works, text me before {deadline} and we will find a structure that fits. If it is genuinely not the year for the investment, I respect that completely and I will step back. The door stays open at the same honest number.",
        goal: "Clean release that protects both the price and the relationship.",
      },
    ],
  },

  timingObjection: {
    outcome: "timingObjection",
    label: "Maybe next cycle",
    psychology:
      "Next cycle feels safe because it defers the risk without saying no, but for a transfer it is the most expensive choice on the board: waiting a cycle means another full year at the school they want to leave, for zero admissions upside. Make the cost of waiting concrete and self-computed, and separate a real reason to wait (a genuinely stronger file next term) from simple avoidance.",
    touches: [
      {
        day: 1,
        channel: "text",
        message:
          "{firstName}, maybe next cycle is the one I have to push back on, gently. Waiting a cycle is not neutral, it is another full year at {currentSchool}, the place you are trying to leave. Real question: what do you actually think will be different about your file in a year that we could not build right now?",
        goal: "Convert a vague deferral into a concrete cost they compute themselves.",
      },
      {
        day: 3,
        channel: "email",
        subject: "does waiting actually help you",
        message:
          "{firstName}, I want to be fair to the idea of waiting, so here is the honest breakdown. A good reason to wait: you genuinely need another term of grades or involvement to have a story worth telling. A bad reason, and the common one: waiting just feels safer than deciding now. For most files a year does not meaningfully change the profile, it just spends another year of tuition at a school you do not want to be at, and then you are having this same conversation in twelve months with less runway. If yours is the first case, tell me and I will tell you straight that waiting is right. If it is the second, the window is now: {deadline}. Which one are you?",
        goal: "Give an honest test that usually reveals avoidance rather than strategy.",
      },
      {
        day: 6,
        channel: "text",
        message:
          "{firstName}, where did you land on now versus next cycle? I am filling this cohort, so the choice is a little more real than it feels. Holding a spot for a maybe is not something I can do for long. Totally fine either way, I just want to know which plan to make.",
        goal: "Honest scarcity to force a soft decision.",
      },
      {
        day: 9,
        channel: "text",
        message:
          "I will leave the timing to you, {firstName}, you know your life better than I do. If now is the move, text me before {deadline} and we start. If it is genuinely next cycle, put a note in your phone to hit me when the window reopens and we pick it up fresh. Not going anywhere, just not going to nag.",
        goal: "Clean release that invites a future re-entry.",
      },
    ],
  },

  ghosted: {
    outcome: "ghosted",
    label: "Went cold after being warm",
    psychology:
      "Someone who was warm and then vanished usually did not lose interest, they hit a wall (a fear, a parent no, a busy stretch, or quiet embarrassment about going silent) and disappearing became easier than an awkward update. Guilt trips and just checking in pings make it worse. A short, warm pattern-interrupt that gives them a dignified way back works better, and one honest are-you-out message revives more than five nudges.",
    touches: [
      {
        day: 3,
        channel: "text",
        message:
          "{firstName}, you went a little quiet on me, which is completely fine, life gets loud. No guilt trip here. Just tell me one thing so I know how to help: are you still in on {dreamSchool}, or did the plan change? A single word is plenty.",
        goal: "Reopen without guilt and make the reply frictionless.",
      },
      {
        day: 6,
        channel: "text",
        message:
          "{firstName}, not chasing, just dropping something useful. The single biggest thing that kills transfer files is starting the essay too late, and readers at {dreamSchool} can smell a rushed one. That is the whole reason I hate letting a good lead go dark near {deadline}. No reply needed, I just did not want you learning that the hard way.",
        goal: "Pattern interrupt with real value to rebuild trust, zero ask.",
      },
      {
        day: 9,
        channel: "email",
        subject: "should I close your file",
        message:
          "{firstName}, I am going to be direct because I think you would want me to be. We had real momentum on getting you from {currentSchool} to {dreamSchool}, and then it went quiet, which usually means one of three things: you got busy, something spooked you, or the plan quietly died. All three are okay, I just do not want to keep a spot warm for someone who has moved on when another student wants it. So tell me straight, should I keep your file open or close it out? You told me {theirWords} not long ago, and that is a hard thing to walk away from, but only you know. One line and I will do exactly what you say.",
        goal: "An honest close-the-file message that respects them and often revives the deal.",
      },
      {
        day: 12,
        channel: "text",
        message:
          "Okay {firstName}, I am reading the silence as a not-right-now, and that is genuinely fine. I am closing the active spot so I am not holding your phone hostage. If the {dreamSchool} thing wakes back up before {deadline}, you have my number, just text and we skip the small talk. Door is open, I am just stepping out of the doorway.",
        goal: "Clean release that reads the silence and invites an easy return.",
      },
    ],
  },

  rescheduleNeeded: {
    outcome: "rescheduleNeeded",
    label: "Asked to move the call",
    psychology:
      "This is your warmest post-call state. They are not objecting, they are managing a calendar, so the only real enemy is drift, where a polite reschedule slowly decays into a ghost. Make rebooking instant and low-effort, confirm the new time so it carries a small commitment, and keep the reason for the call alive so the new slot never feels skippable.",
    touches: [
      {
        day: 0,
        channel: "text",
        message:
          "{firstName}, no problem at all moving it, life happens. Let us not let it drift though, those we-will-find-a-time plans have a way of never happening. Give me a day in the next few that works and I will lock it right now.",
        goal: "Rebook instantly before the reschedule decays into drift.",
      },
      {
        day: 1,
        channel: "email",
        subject: "locking our new time",
        message:
          "{firstName}, quick one to make sure this actually gets back on the calendar. Reply with whichever works and it is set: Tuesday afternoon, Wednesday morning, or Thursday evening. And so the new slot does not feel like just another thing on your list, remember what it is for: this is where we map whether {dreamSchool} is a real shot for you and exactly what the next month has to look like before {deadline}. Worth protecting 30 minutes for. Which time?",
        goal: "Convert the reschedule into a concrete confirmed slot and re-anchor the value.",
      },
      {
        day: 3,
        channel: "text",
        message:
          "{firstName}, still want to get you back on my calendar for the {dreamSchool} conversation, just have not caught a time from you. Not trying to pester, but the window does not pause for scheduling. What day works this week?",
        goal: "Prevent drift while keeping honest urgency.",
      },
      {
        day: 6,
        channel: "text",
        message:
          "{firstName}, I will stop trying to pin a time so I am not clogging your phone. When you are ready to actually talk {dreamSchool}, just text me a day and I will make room, no need to start over. Offer stands right up until {deadline}.",
        goal: "Graceful release while keeping re-entry one text away.",
      },
    ],
  },
};

// Revive a lead who went dark weeks or months ago. New cycle, new deadline,
// requalify-from-zero framing. This is not a continuation of an old thread,
// it is a fresh clean slate with no baggage about the silence.
export const REACTIVATION: Touch[] = [
  {
    day: 0,
    channel: "text",
    message:
      "{firstName}, blast from the past. We talked a while back about getting you out of {currentSchool} and into {dreamSchool}, then life took over, all good. Reason I am reaching out now: a new transfer cycle just opened, which means a clean slate and a fresh deadline. No assumptions from me about where your head is at. Are you still thinking about the move?",
    goal: "Reopen on a new-cycle clean slate with no baggage from the last silence.",
  },
  {
    day: 3,
    channel: "email",
    subject: "new cycle, clean slate",
    message:
      "{firstName}, checking in because the calendar reset, not to guilt you about going quiet, that is ancient history. Here is the honest frame: whatever we talked about last time, forget it. A new transfer cycle means new deadlines and a fresh shot at {dreamSchool}, and your file may look different now than it did then, hopefully stronger. So let us not pick up where we left off, let us requalify from zero. Are you still at {currentSchool}, still wanting out, and is {dreamSchool} still the target? If yes to those, a quick call and I will tell you exactly where you stand this cycle. The new window closes {deadline}.",
    goal: "Requalify from scratch and re-anchor on a fresh, real deadline.",
  },
  {
    day: 6,
    channel: "text",
    message:
      "{firstName}, that is my one nudge for this cycle, I will not keep resurfacing every few months. If the {dreamSchool} plan is alive, text me before {deadline} and we start clean. If you have made peace with {currentSchool}, that is a real and okay answer too, and I will genuinely wish you well. Your call.",
    goal: "Single honest re-offer with a clean release, no perpetual pinging.",
  },
];

// Light per-archetype tilt. These sequences are outcome-keyed, but any touch
// can be angled toward the buyer using their archetype id from archetypes.ts.
// One line each, in the same voice, applied on top of the copy above.
export const ARCHETYPE_TILT: Record<string, string> = {
  redemption:
    "Lean on round two being a different game, and quote their refusal to accept the first verdict back at them.",
  escape:
    "Keep the pain of staying vivid and move fast. Speed of relief matters to them more than polish.",
  ccClimber:
    "Frame the transfer as the plan working, not a rescue. Respect the grind and the GPA they earned to get here.",
  bigFish:
    "Frame the move as needing a bigger room, not fixing a failure. Keep it ego-safe, never remedial.",
  legacyPressure:
    "The family story is the buyer. Arm them hardest for the dinner-table conversation and put the parent front and center.",
  mercenary:
    "Lead with outcomes and numbers, {benchmark} and the cost of staying. Skip the feelings, sell the ROI.",
  prestigeChaser:
    "Sell the name and the identity out loud: the sweatshirt, the answer to where do you go, the future self.",
  quietBuilder:
    "Low hype, evidence and process. Never oversell. Let the plan speak and give them room to decide.",
};

// Rules governing all follow-up. These override any single-message instinct.
export const FOLLOWUP_RULES: string[] = [
  "One message per channel per stage. Never double-text or send two emails in the same beat. A single well-aimed message beats a barrage and keeps you on the confident side of the power dynamic.",
  "Every message ends with them owning the next action. Close on a question or a one-word reply they control (text 'go', which time, yes or not-now), never on you promising to follow up again. Whoever is chasing looks like the one who needs it more.",
  "Never chase past what the sequence allows. Cap at 4 to 5 touches per outcome, then release. Beyond that you are training them that ignoring you has no cost, and burning the trust that scarcity is supposed to build.",
  "Send the first personal text within 5 minutes of a booking, and within 15 minutes of a no-show. Speed is the single highest-leverage variable. A human note in the first few minutes prevents most no-shows and recovers most of the ones that happen.",
  "Make scarcity honest, never fake. Only cite a cohort cap, a held slot, or a deadline that is actually real ({deadline}, a true cohort limit). These buyers already failed at DIY and can smell a manufactured clock, and one fake deadline poisons every real one after it.",
  "Reassure, do not pressure, on think-about-it and price. Hesitation is a request for safety, not a fight to win. Surface the real fear and answer it, because pushing harder just validates the stall.",
  "Deploy the takeaway when momentum is dead, not when it is inconvenient. The graceful release (I will stop reaching out, the door is open, here is how to walk back through it) is the final touch of almost every sequence, because a clean dignified exit relieves the pressure blocking the yes and frequently triggers the return. Use it once and mean it.",
  "Match the follow-up to what actually happened, not the archetype alone. A no-show, a parent-gate, and a price choke are three different psychological states and get three different sequences. Quote their own words ({theirWords}) back so every touch reads like a continuation of the call, not a template.",
];
