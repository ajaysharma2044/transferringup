// TransferringUP Sales Conversation Architecture
// Question Bank + Objection Library for premium college TRANSFER admissions calls.
// 30-45 min strategy sessions selling to students and often their parents.
//
// Buyer archetype ids:
//   redemption      - fumbled freshman year, wants a second chance to prove themselves
//   escape          - miserable at current school, needs OUT more than needs UP
//   ccClimber       - community college student aiming for a top 4-year transfer
//   bigFish         - top of a mid/low-tier school, wants a bigger pond
//   legacyPressure  - family name/expectation on the line, parents heavily involved
//   mercenary       - ROI-driven, cares about earnings, brand, network, outcomes
//   prestigeChaser  - wants the sticker on the car, the name, the status
//   quietBuilder    - understated, competent, undersells themselves, needs permission to aim high
//
// Frameworks in play: SPIN (situation/problem/implication/need-payoff), Sandler pain funnel,
// Chris Voss calibrated + no-oriented questions, labels, accusation audits.
// Voice: confident 20-something Cornell operator, peer-to-peer, no corporate speak.

export type BankQuestion = { q: string; purpose: string; bestFor: string[] };

export const QUESTION_BANK: Record<string, BankQuestion[]> = {
  rapport: [
    {
      q: "Before we get into any of the strategy stuff, just tell me the real version. How are you actually feeling about where you are right now?",
      purpose: "Disarming opener that signals this is a real conversation, not a pitch. Gives you an instant read on their emotional temperature.",
      bestFor: ["all"],
    },
    {
      q: "So walk me through it like we are just two people talking. What made you book this call instead of just scrolling past another ad?",
      purpose: "Surfaces the trigger event and gets them to say their own reason out loud, which is worth ten of your reasons.",
      bestFor: ["all"],
    },
    {
      q: "I read your form but I do not want to assume anything. If you had to describe your current school in one honest sentence, what would it be?",
      purpose: "Cold-read setup. The one-sentence constraint forces an emotionally loaded answer instead of a safe one.",
      bestFor: ["escape", "bigFish", "redemption"],
    },
    {
      q: "Quick one before we dig in. When you picture the college experience you thought you were going to have, how far off is the one you are actually living?",
      purpose: "Opens the gap between expectation and reality early, gently, so the rest of the call has somewhere to go.",
      bestFor: ["escape", "redemption", "legacyPressure"],
    },
    {
      q: "Is it fair to say part of you has been sitting on this for a while and just never said it out loud to anyone?",
      purpose: "Voss-style label that names the private frustration. Nine times out of ten they exhale and open up.",
      bestFor: ["quietBuilder", "escape", "redemption"],
    },
    {
      q: "Whose idea was it that you should look into transferring, honestly? Yours, your parents, or a bit of both?",
      purpose: "Establishes the true source of motivation and flags parent involvement before you are surprised by it later.",
      bestFor: ["legacyPressure", "prestigeChaser", "quietBuilder"],
    },
    {
      q: "You clearly did not do this on a whim. What is the thing you are hoping is actually possible that you are almost afraid to say?",
      purpose: "Invites the secret ambition. Naming the fear-wrapped hope early makes you the person they trust with it.",
      bestFor: ["quietBuilder", "ccClimber", "bigFish"],
    },
  ],

  pain: [
    {
      q: "When you say the school is not the right fit, tell me more. What specifically happens on a normal Tuesday that reminds you of that?",
      purpose: "Sandler layer one. Vague complaints get turned into concrete, repeatable moments of pain.",
      bestFor: ["escape", "bigFish", "redemption"],
    },
    {
      q: "How long has it felt like this? And has it been getting better on its own, or slowly worse?",
      purpose: "Sandler duration and trajectory. If it is getting worse on its own, doing nothing is the expensive option and they feel it.",
      bestFor: ["all"],
    },
    {
      q: "What have you already tried to fix it yourself before deciding to talk to someone like me?",
      purpose: "Uncovers prior failed attempts, which pre-frames why willpower and free info alone have not worked.",
      bestFor: ["redemption", "ccClimber", "mercenary"],
    },
    {
      q: "Be straight with me. When you scroll past someone who got into the school you actually want, what goes through your head?",
      purpose: "Pulls the comparison wound to the surface. This is where the quiet resentment and real motivation live.",
      bestFor: ["prestigeChaser", "bigFish", "redemption"],
    },
    {
      q: "What is the part of this you have not told your parents, or that you have been softening for them?",
      purpose: "Sandler pain funnel. The softened version they tell family is never the real one. The real one is where the money is.",
      bestFor: ["legacyPressure", "escape", "quietBuilder"],
    },
    {
      q: "If nothing changes and you are still at this school this time next year, how does that actually sit with you?",
      purpose: "Bridges pain into implication. Forces them to sit in the do-nothing outcome for a second instead of avoiding it.",
      bestFor: ["escape", "redemption", "bigFish"],
    },
    {
      q: "You mentioned your GPA and your major and your list. Underneath all of that, what is the one thing that actually keeps you up about this?",
      purpose: "Strips the logistics away to find the single emotional core. Everything else on the call ladders back to this answer.",
      bestFor: ["all"],
    },
    {
      q: "How much of your day right now is spent thinking about getting out versus actually enjoying being a student?",
      purpose: "Quantifies the mental tax of staying. Makes an invisible cost suddenly countable.",
      bestFor: ["escape", "redemption", "quietBuilder"],
    },
  ],

  implication: [
    {
      q: "Let us do quick math. Four more semesters at a school that is not opening doors, versus two years somewhere that is. What is that difference actually worth to you over a career?",
      purpose: "The money-maker. Reframes the fee against lifetime earning and network delta so the price stops feeling like the big number.",
      bestFor: ["mercenary", "bigFish", "ccClimber"],
    },
    {
      q: "If this transfer cycle slips by and you have to reapply next year, what does that extra year cost you? Not just tuition. Time, momentum, the internships you would have qualified for.",
      purpose: "Quantifies the cost of delay across multiple dimensions, so waiting becomes visibly more expensive than acting.",
      bestFor: ["mercenary", "ccClimber", "redemption"],
    },
    {
      q: "Who else is affected if this does not happen? What does another year of this do to how things feel at home?",
      purpose: "Widens the implication to family, especially where parents are footing tuition or emotionally invested.",
      bestFor: ["legacyPressure", "escape", "quietBuilder"],
    },
    {
      q: "You have a strong shot at a target school. If you do this alone and get the essays or the school list wrong, and it costs you the admit, what is that miss worth to you?",
      purpose: "Prices the downside of the DIY path. The cost of a wrong move dwarfs the cost of guidance.",
      bestFor: ["bigFish", "prestigeChaser", "redemption"],
    },
    {
      q: "Say you stay and just white-knuckle it. A year from now, does the version of you that settled feel proud, or does he feel like he flinched?",
      purpose: "Implication aimed at identity and future self. Reframes inaction as a choice they have to live with, not a neutral default.",
      bestFor: ["redemption", "quietBuilder", "bigFish"],
    },
    {
      q: "What happens to your major and your timeline if you transfer late and lose credits because nobody mapped the articulation right?",
      purpose: "Surfaces a concrete, expensive, technical risk of going unguided that most students have not even considered.",
      bestFor: ["ccClimber", "mercenary", "quietBuilder"],
    },
    {
      q: "Every cycle we turn away strong applicants who came to us too late. If the difference between an admit and a rejection was one round of strategy, how would you feel finding that out in March?",
      purpose: "Loss-framed implication with urgency baked in. Puts the regret at a specific future date.",
      bestFor: ["all"],
    },
  ],

  vision: [
    {
      q: "Paint it for me. It is next fall, the deposit is in, you are walking onto the campus you actually wanted. What is the first thing you feel?",
      purpose: "Future-paces the win in sensory, first-person terms so the outcome becomes emotionally real, not abstract.",
      bestFor: ["all"],
    },
    {
      q: "When you tell people where you go to school a year from now, what do you want their reaction to be?",
      purpose: "Targets identity and status. For prestige and legacy buyers this line does more work than any feature list.",
      bestFor: ["prestigeChaser", "legacyPressure", "bigFish"],
    },
    {
      q: "Forget admissions for a second. Who do you want to become at the right school that you cannot become at this one?",
      purpose: "Elevates the conversation from a logo to a self. The transfer becomes a vehicle for identity, which is priceless.",
      bestFor: ["quietBuilder", "redemption", "escape"],
    },
    {
      q: "If two years from now you are sitting in the internship or the lab or the room you always wanted to be in, what had to go right this cycle for that to happen?",
      purpose: "Reverse-engineers the dream back to the decision on the table today, making this call the pivot point.",
      bestFor: ["mercenary", "ccClimber", "bigFish"],
    },
    {
      q: "What is the story you want to be able to tell about this chapter? The one where you stayed stuck, or the one where you made the move?",
      purpose: "Frames the transfer as a narrative they author. People will pay to be the hero of the right story.",
      bestFor: ["redemption", "quietBuilder", "escape"],
    },
    {
      q: "When your parents talk about you at Thanksgiving next year, what do you want them saying?",
      purpose: "Vision aimed straight at the family audience for buyers whose motivation is tangled up with making people proud.",
      bestFor: ["legacyPressure", "prestigeChaser", "redemption"],
    },
  ],

  qualifying: [
    {
      q: "So I can build the right plan and not waste your time. When families decide to invest in something like this, they usually set aside somewhere in the three to six thousand range. Is that in the realm of what you were expecting?",
      purpose: "Anchors and budget-qualifies in one move, framed as building the plan rather than checking their wallet.",
      bestFor: ["all"],
    },
    {
      q: "If we get to the end of this and it clearly makes sense, is this a decision you can make on your own, or is there someone you would want in the room with you?",
      purpose: "Voss-style decision-maker qualifier. Non-crass, and it surfaces the parent conversation before it becomes an objection.",
      bestFor: ["legacyPressure", "quietBuilder", "escape"],
    },
    {
      q: "When were you hoping to actually have this handled? Are we talking this cycle, or is this more of a someday thing?",
      purpose: "Timeline qualifier that also gently separates buyers from browsers by their own words.",
      bestFor: ["all"],
    },
    {
      q: "How are you and your family thinking about funding the transfer itself? I ask because it changes which schools I would even put on your list.",
      purpose: "Connects money to strategy so the funding question feels like advice, not a credit check.",
      bestFor: ["mercenary", "legacyPressure", "ccClimber"],
    },
    {
      q: "Just so I know how to talk to you. Are you the kind of person who wants to move once they see a plan they believe in, or do you need to sit with things for a while?",
      purpose: "Reveals their decision style early and, either way, sets up a later close aligned to how they buy.",
      bestFor: ["all"],
    },
    {
      q: "If your parents are part of this, what is going to matter most to them? The outcome, the cost, or knowing you are in good hands?",
      purpose: "Pre-loads the parent objection by identifying the parent's decision criteria before the parent is even on the phone.",
      bestFor: ["legacyPressure", "quietBuilder", "prestigeChaser"],
    },
    {
      q: "On a scale of putting it off versus this being a real priority, where does fixing this honestly sit for you right now?",
      purpose: "Gets a self-reported priority number you can hold them to at the close.",
      bestFor: ["escape", "redemption", "mercenary"],
    },
  ],

  commitment: [
    {
      q: "Say it plainly for me. What is the school, or the tier of school, you actually want? Not the safe answer.",
      purpose: "Consistency lever. Once they say the real target out loud to you, backing down from it feels like betraying themselves.",
      bestFor: ["quietBuilder", "prestigeChaser", "bigFish"],
    },
    {
      q: "So if I am hearing you right, staying put is off the table and the only real question is how you do this well. Fair?",
      purpose: "Locks in the decision to act and narrows the remaining choice to method, not whether.",
      bestFor: ["escape", "redemption", "bigFish"],
    },
    {
      q: "How committed are you to actually making this move, on a scale of one to ten?",
      purpose: "Classic commitment probe. Whatever number they give, the follow-up (why not lower) makes them argue your case for you.",
      bestFor: ["all"],
    },
    {
      q: "If I told you the plan was solid and the odds were real, is there anything that would stop you from going all in on this?",
      purpose: "Surfaces the last hidden objection before the close, disguised as a commitment question.",
      bestFor: ["mercenary", "legacyPressure", "quietBuilder"],
    },
    {
      q: "You have said you are done settling. Am I right that you would rather stretch and do this properly than half-do it and wonder?",
      purpose: "Ties their earlier words to a commitment, using their own consistency against the temptation to go cheap.",
      bestFor: ["redemption", "bigFish", "prestigeChaser"],
    },
    {
      q: "Where does this rank against everything else you are spending money on this year? Be honest.",
      purpose: "Forces them to place the transfer in their own priority stack, which is where real commitment shows up.",
      bestFor: ["mercenary", "escape", "ccClimber"],
    },
  ],

  trialClose: [
    {
      q: "How does all of this sound to you so far, honestly?",
      purpose: "Low-pressure temperature check that invites objections into the open while you still have time to handle them.",
      bestFor: ["all"],
    },
    {
      q: "Is there any reason, based on everything we have covered, that you would not want to move forward with this?",
      purpose: "Voss no-oriented trial close. A no here means yes to proceeding, and any real hesitation surfaces safely.",
      bestFor: ["all"],
    },
    {
      q: "If the investment were not a factor at all, would this be an easy yes for you?",
      purpose: "Isolates whether price is the true obstacle or a stand-in, before you ever discuss handling the money.",
      bestFor: ["mercenary", "escape", "redemption"],
    },
    {
      q: "On a scale of one to ten, how sure are you that working together is the right move?",
      purpose: "Numeric trial close. Anything under a ten hands you the exact gap to close next.",
      bestFor: ["all"],
    },
    {
      q: "Can you picture us actually doing this together, or is something still not sitting right?",
      purpose: "Visualization check plus a soft invitation to name the last doubt. Either answer moves you forward.",
      bestFor: ["quietBuilder", "legacyPressure", "escape"],
    },
    {
      q: "If we could sort out the logistics in a way that works for you, are you good to get started today?",
      purpose: "Conditional trial close that tests real readiness and pre-frames handling whatever the logistics turn out to be.",
      bestFor: ["all"],
    },
  ],
};

export type Objection = {
  trigger: string;
  whatItReallyMeans: string;
  responses: string[];
  thenAsk: string;
};

export const OBJECTION_LIBRARY: Objection[] = [
  {
    trigger: "I need to think about it.",
    whatItReallyMeans: "There is a specific unspoken doubt, or they are not the sole decision-maker. Think about it is almost never about thinking. It is a polite exit.",
    responses: [
      "Totally fair, and I would never want you to jump into something like this. Usually when someone says they want to think about it, it is one of three things. It is the money, it is whether you believe it will actually work, or it is a conversation you need to have with someone else. Which of those is it, honestly? Because I can help with all three right now.",
      "It sounds like something specific is holding you back and you are just being polite about it. I respect that. Do me a favor and say the real thing out loud. Whatever it is, I would rather hear it now than have you talk yourself out of a decision you actually want.",
      "Here is what I have learned. Thinking about it usually means sleeping on the same worry twice and waking up with the same worry. The doubt does not shrink on its own, it just gets quieter. So let us not send you home with it. What is the piece you are not sure about?",
    ],
    thenAsk: "When you say you want to think it over, what is the one thing you would be thinking about?",
  },
  {
    trigger: "I need to talk to my parents.",
    whatItReallyMeans: "Either the parents genuinely control the money, or the student is using them as a shield because they themselves are not fully sold yet.",
    responses: [
      "Of course, this is a family decision and it should be. Let me ask you this though. If your parents said yes tomorrow, would you be a yes today? Because if you are still on the fence yourself, talking to them just moves the fence to a different yard. Let us make sure you are solid first, then we bring them the strong version.",
      "Smart. And I want you walking into that conversation with something better than I kind of liked the guy. Let me help you build the case, the school list, the odds, the timeline, so when your parents ask why this, you have real answers. Better yet, can we get them on a quick call together so they can ask me directly instead of you playing telephone?",
      "I would want to talk to mine too. Real question though. What do you think their actual concern is going to be? Because it is usually one of two things, is this legit and is this worth the money. If we handle both of those right now, you make their yes a lot easier.",
    ],
    thenAsk: "If it were entirely your call and the money was handled, would you already be in?",
  },
  {
    trigger: "It is too expensive. I can't afford it.",
    whatItReallyMeans: "Either genuine cash-flow reality, or they have not yet decided the outcome is worth more than the price. Usually the second dressed up as the first.",
    responses: [
      "I hear you, and I am not going to pretend it is pocket change. Let me reframe it though. You are not spending three to six thousand dollars. You are deciding whether a better school, a better network, and a stronger career are worth that. Students who transfer up out-earn where they would have landed by far more than this over a lifetime. The price is real, but next to what it buys, it is small. Is it the total number that stings, or how it is spread out?",
      "Fair. Let me ask it a different way. If money were completely off the table, is this something you would want to do? Because if yes, then this is not a can-I-afford-it problem, it is a how-do-we-make-it-work problem, and I am very good at that second one. If no, then money was never the real issue and we should talk about what is.",
      "Expensive compared to what, is the question I would push back on. Compared to nothing, sure. Compared to another year stuck, or a solo application that misses and costs you the whole cycle, this is the cheap option. What would it be worth to you to get this right the first time?",
    ],
    thenAsk: "If we found a way to make the investment work for your situation, would you want to move forward?",
  },
  {
    trigger: "How do I know this actually works? What are your results?",
    whatItReallyMeans: "A buying question in disguise. They are trying to justify the leap and want ammunition, not a reason to walk. This is interest, not resistance.",
    responses: [
      "Great question, and you should ask it before spending real money. Here is the honest version. We have placed students into schools they were told to forget about, from community colleges into top thirties, from schools they hated into ones they are proud of. I can walk you through a case that looks almost exactly like yours right now. Want the one closest to your situation?",
      "I love that you asked, because if you did not care about results I would be worried. Let me be straight though. No one can promise you a specific school, and anyone who does is lying to you. What I can show you is the process, the students it has worked for, and exactly where you fit in that pattern. Fair trade?",
      "Results matter, so let me flip it into something useful for you. Instead of a stat that means nothing about you, let me map your specific profile against students we have taken where you are now. That tells you far more than a testimonial. Should we do that?",
    ],
    thenAsk: "If I show you a student who started exactly where you are and got where you want to go, does that put this to bed?",
  },
  {
    trigger: "My GPA is too low anyway.",
    whatItReallyMeans: "Fear of rejection dressed as logic. They are pre-rejecting themselves so the process cannot do it to them. Often the strongest hidden buyer.",
    responses: [
      "Can I be honest with you? That sentence is exactly why students like you need someone in their corner. Transfer admissions is not your freshman GPA on a spreadsheet. It is trajectory, narrative, fit, and the story you tell about what happened. I have taken students with worse numbers than yours into better schools than you are naming. Your GPA is a chapter, not the verdict.",
      "It sounds like you have already decided the answer is no, so let me push on that. What is your number? Because I promise you it is either workable or it is a positioning problem, and both of those are literally my job. The students who self-reject are the ones who never find out they had a real shot.",
      "Here is the trap. Doing it alone with a low GPA is exactly how a workable profile becomes a rejection, because you present the weakness instead of the arc. That is the specific thing I fix. So the low GPA is not a reason to skip help, it is the strongest reason to get it.",
    ],
    thenAsk: "If I told you your GPA was workable with the right strategy, would you actually go for the schools you want?",
  },
  {
    trigger: "I can just do this myself. There's free info online.",
    whatItReallyMeans: "They are testing whether you are worth the premium over free, or protecting their ego by claiming self-sufficiency. They want to be talked into the value.",
    responses: [
      "You absolutely could, and some people do. Here is the honest gap though. Free info tells you what a transfer application is. It does not tell you which schools would actually take you, how to position your specific mess of a story, or the mistakes that quietly kill an application. Free info is the map. I am the person who has driven the road a hundred times. Which one loses you the cycle if it is wrong?",
      "I respect the DIY instinct, I have it too. Let me ask this though. If free info online were enough, why are you still stuck? It is not a knowledge problem, it is an execution and judgment problem, and that is precisely what you cannot Google. You can read every article about transfers and still pick the wrong twelve schools.",
      "Totally, and if this were a low-stakes thing I would tell you to save your money and do it yourself. But you get one shot at this cycle, and the cost of a DIY mistake is not a bad grade, it is a rejection you cannot undo. Do you want to be learning on the one attempt that actually counts?",
    ],
    thenAsk: "What is a wasted transfer cycle actually worth to you, versus getting it right the first time?",
  },
  {
    trigger: "What makes you different from [other firm]?",
    whatItReallyMeans: "They are comparison shopping and near the decision. They want a reason to choose you specifically. This is late-stage interest, not doubt.",
    responses: [
      "Straight answer. Most of those firms are general admissions shops that treat transfers like an afterthought, run by people who have not sat where you are sitting in years. Transfer is a completely different game from freshman admissions, different timelines, different criteria, different story. This is the thing I specialize in, and I did it myself recently enough to remember exactly what it feels like. You are not getting a recycled freshman playbook.",
      "Good, you should compare. Here is the difference that actually matters. The big firms sell you volume and a template. I take a small number of students and get in the weeds on your specific story. Ask them how many students each advisor carries, then ask me. That one number tells you everything about the attention you will get.",
      "Honestly, I would not tell you to pick me over them for the brand. I would tell you to pick based on who understands the transfer game and who actually answers when you are panicking at eleven at night in December. Want to know how I handle that part, because that is where most firms quietly disappear?",
    ],
    thenAsk: "What matters most to you in who you pick, so I can tell you straight whether that is me?",
  },
  {
    trigger: "I already paid someone and it didn't work.",
    whatItReallyMeans: "Real trust wound plus buyer's remorse. They are protecting themselves from being burned twice. Needs empathy and a clear reason this is different, not a hard push.",
    responses: [
      "That genuinely sucks, and I am sorry someone took your money and left you here. Let me ask what actually went wrong, because I want to make sure I am not about to sell you the same thing in a different jacket. Usually it is one of two failures, either they were a generalist who did not know transfers, or they handed you templates and disappeared. Which was it?",
      "I get why you are guarded, and you should be. Here is the difference I will commit to out loud. You are not going to get a template and a ghost. You will know exactly what we are doing and why at every step. Before you trust me a dollar, tell me what the last person did that lost your trust, so I can tell you honestly whether I do it differently.",
      "Being burned once is exactly why the second choice has to be surgical, not another leap of faith. So let us not do faith. Let me show you specifically how my process avoids the thing that failed you last time. What was the moment you realized it was not working?",
    ],
    thenAsk: "If I can show you exactly why what failed last time will not happen here, are you open to giving this a real look?",
  },
  {
    trigger: "Let me get back to you.",
    whatItReallyMeans: "The soft goodbye. Interest is real but momentum is dying and a specific doubt is unspoken. Once they hang up, urgency evaporates and so does the deal.",
    responses: [
      "I hear you, and I want to respect that. Can I be a little bold though? In my experience, get back to you almost always means the moment ends here and life gets busy and this quietly slips, not because you did not want it but because the doubt never got answered. So before you go, tell me the real hesitation. Let us not let a maybe become a never by accident.",
      "Totally fine. Quick gut check first though. When you say you will get back to me, is that a real maybe, or is it the nice way of saying not for me? I genuinely will not be offended. I would just rather know where we actually stand than chase a ghost.",
      "Fair enough. Here is my worry for you, not for me. The clarity you have right now, on this call, is the most clarity you will ever have about this decision. It only fades from here. So what would you need to see in the next five minutes to not have to get back to me at all?",
    ],
    thenAsk: "If you are being honest with yourself, what is the actual reason you are not saying yes right now?",
  },
  {
    trigger: "I want to see it in writing. Just email me the pricing.",
    whatItReallyMeans: "A stall to end the call without saying no, or a genuine need to review with someone. The email usually goes unread and unfollowed. Control is leaving the room.",
    responses: [
      "I can do that, and I will. Before I do, let me save you from a bad version of this decision. Pricing in an email with no strategy attached is just a number with no context, and numbers with no context always look expensive. The reason this call exists is so you decide based on the plan, not a line item. So let us finish the plan, and I will absolutely put it in writing after. What is the piece you wanted to see written down?",
      "Happy to send it. Real talk though, an email is where good intentions go to die. You will read it once, life happens, and we never talk again, not because you did not want this but because paper does not answer questions. What is the thing you actually wanted to review, so we handle it live while I am right here?",
      "Sure. Let me ask what the writing is for though. If it is to show your parents, let us get them on and I will present it properly. If it is to think it over alone, then the real issue is a doubt, and email will not fix a doubt. Which is it?",
    ],
    thenAsk: "What specifically do you need to see on paper before this becomes a yes?",
  },
  {
    trigger: "I'm not sure I even want to transfer.",
    whatItReallyMeans: "Either genuine ambivalence about leaving, or cold feet at the decision point. The desire is usually there but fear of the unknown is louder in the moment.",
    responses: [
      "That is completely fair, and I am not here to push you out of a school you might actually love. So let us find out. If a magic wand dropped you into your dream school tomorrow, no application, no risk, would you take it? Because if the answer is yes, then you do want to transfer, you are just scared of the leap, and those are two very different problems.",
      "Good, I would rather you be honest than fake certainty. Let me ask the other side though. When you imagine four more years right where you are, does that feel like relief or does it feel like settling? Your gut answer to that tells us more than any pros and cons list.",
      "Then maybe you should not, and I mean that. But let me name what I am hearing. It sounds less like you do not want to leave and more like you are not sure it is possible, so you are protecting yourself by not wanting it. Am I close?",
    ],
    thenAsk: "Forget the how for a second. If the transfer were guaranteed, would you want it?",
  },
  {
    trigger: "The timing is bad. Maybe next cycle.",
    whatItReallyMeans: "Avoidance framed as scheduling. Next cycle rarely comes because the underlying hesitation travels with them. Also a real cost they may not see.",
    responses: [
      "I understand the instinct, but let me show you the hidden price of that. Waiting a cycle is not a pause, it is another full year at a school you are trying to leave, another year of tuition, and a year of internships and momentum you do not get back. The timing never feels perfect. The question is whether next year is genuinely better or just further away. Which is it?",
      "Here is the pattern I see. Maybe next cycle almost always becomes the same conversation twelve months from now with twelve months less runway. The hesitation does not expire on its own, it just costs you a year first. So what would actually be different next cycle that we could not solve right now?",
      "Fair, and if there is a real reason to wait I will be the first to tell you to wait. But be honest with me. Is the timing actually bad, or is timing the comfortable reason because the decision feels big? Because those need very different conversations.",
    ],
    thenAsk: "What specifically would be true next cycle that is not true today, that makes waiting the better move?",
  },
  {
    trigger: "My friend transferred without any help.",
    whatItReallyMeans: "They are looking for permission to save the money and want you to justify why their situation is not their friend's. Often masks insecurity that their own case is weaker.",
    responses: [
      "That is awesome for your friend, genuinely. Here is what I would gently point out. You are hearing the highlight reel, not the near misses, and not the schools they did not get into that they could have. Survivorship is a real thing. The question is not can it be done alone, of course it can. It is whether your specific profile and your specific list can afford the margin for error. Do you know exactly why your friend got in?",
      "Love that. Let me ask though, did your friend have the same GPA, the same major, the same target schools as you? Because transfer is brutally case-specific. What worked for them tells you almost nothing about your odds. Copying a path that fit someone else is how good applicants end up with surprising rejections.",
      "Totally possible to do alone, no argument. But think about what you are actually comparing. Your friend gambled and it happened to work. You are deciding whether to gamble your one cycle on the hope that you are as lucky. Would you rather match their luck or beat their odds?",
    ],
    thenAsk: "How confident are you that your case is strong enough to leave to chance the way your friend did?",
  },
  {
    trigger: "You're basically a college student yourself. Why should I trust you with this?",
    whatItReallyMeans: "A credibility test and a power move, often from a parent. They want to see if you fold. How you handle this IS the proof of competence. Weakness here loses the deal, strength wins it outright.",
    responses: [
      "You know what, that is exactly why I am the right person for this. I did not read about transfer admissions in a training manual a decade ago. I lived it, recently, at a level most people do not reach, and I remember every move that worked and every one that did not. The people who did this fifteen years ago are working off a game that has completely changed. I am close enough to it to still have the playbook memorized. That is an advantage, not a liability.",
      "I get the skepticism, and I would rather you say it than think it. So judge me on the only thing that matters. In the last twenty minutes, have I understood your situation better than anyone you have talked to about this? Age is a proxy for competence, and a bad one. Let me be judged on the real thing instead.",
      "Fair shot, I will take it head on. Being young is not my weakness here, it is the entire product. I sat in this exact seat, I know what actually moves a transfer committee today, and I know what it feels like to be where your kid is right now. A fifty year old consultant is guessing at that from memory. I am not guessing. Want me to prove it with your specific case right now?",
    ],
    thenAsk: "Let me earn it instead of claim it. Give me your hardest question about your situation and judge me on the answer.",
  },
  {
    trigger: "This feels like a lot of pressure. I don't like being sold to.",
    whatItReallyMeans: "They feel cornered and their guard is up. Pushing harder here backfires completely. They need to feel they are in control again before any yes is possible.",
    responses: [
      "You are right, and I appreciate you saying it. Let me take the pressure off entirely. I do not want you in this if it is not clearly right for you, because unhappy students are bad for my reputation and I actually care about that. So let us slow all the way down. No pitch. Just tell me what you would need to feel to know this was a good decision, with zero pressure from me.",
      "Fair, and I would hate it too. Here is the truth though. I am not trying to sell you something you do not want, I am trying to make sure you do not talk yourself out of something you clearly do want out of fear. Those look similar but they are opposites. Which one do you think is happening here?",
      "That is a totally reasonable thing to feel, and it is on me for the energy. Let me reset. You are in the driver seat completely. If the answer is no, no is a full sentence and I respect it. So no pressure at all, just curiosity. What is the part that feels off?",
    ],
    thenAsk: "With zero pressure from me, what would you need to be true to feel genuinely good about doing this?",
  },
];

export const CLOSE_LINES: { name: string; line: string; useWhen: string }[] = [
  {
    name: "The Assumptive Close",
    line: "Alright, I am sold that this is a fit and I think you are too. Here is what happens next. I will get you set up today, we will lock in your school list this week, and we start on your strongest essay by the weekend. Sound like a plan?",
    useWhen: "Buying signals are strong and the trial closes came back positive. Move as if the decision is already made and simply narrate the next step.",
  },
  {
    name: "The Alternative-Choice Close",
    line: "Most families do one of two things here. Some go with the full-cycle package so nothing is left to chance, and some start with the strategy intensive and expand from there. Knowing your situation, which of those feels more like you?",
    useWhen: "They are sold on working with you but stalling on commitment. Replaces the yes-or-no decision with a this-or-that decision so momentum keeps moving.",
  },
  {
    name: "The Takeaway Close",
    line: "Honestly, I am not sure this is the right fit, and I only take students I know I can move. If you are not fully in, that is completely okay, I would rather you keep your money than half-commit to something this important. So tell me plainly, do you actually want this or not?",
    useWhen: "They are fence-sitting, being passive, or taking you for granted. Removing the offer triggers loss aversion and forces a real answer. Use with conviction, not as a bluff.",
  },
  {
    name: "The Scarcity Close",
    line: "I want to be straight with you about timing. I only take a handful of students per cycle so each one gets real attention, and the deadlines for your target schools are closer than they feel. If we start now you have room to do this right. If we wait, we are cutting it dangerous. I would rather start you strong. Can we lock it in today?",
    useWhen: "Real deadline pressure exists and the buyer is warm but slow. Grounded in a genuine constraint, never a fake one, or it destroys the trust you built.",
  },
  {
    name: "The Summary Close",
    line: "Let me play it back. You want out of a school that is not serving you, you are aiming for a real target, your GPA is workable with the right story, and the only thing standing between you and that campus next fall is a plan and someone who has done this before. That is exactly what I do. So the only real question left is whether we start today. What do you say?",
    useWhen: "After a thorough discovery, when you want to stack all their own stated reasons into one wave right before the ask. Best for analytical or hesitant buyers who need to see it add up.",
  },
  {
    name: "The Direct Ask",
    line: "I have laid it all out and I do not want to overcomplicate this. I think you should do this, and I think you know it too. Are you ready to get started?",
    useWhen: "Rapport is high, the buyer is decisive, and further talking only introduces doubt. Confidence and simplicity close the decisive buyer that a longer pitch would lose.",
  },
  {
    name: "The Standards / Mutual-Fit Close",
    line: "I am a little protective about who I take on, because my results depend on working with students who are actually going to show up and do the work. From everything you have told me, you are exactly the kind of person I want in my corner this cycle. So this goes both ways. I want in on your team. Do you want me on yours?",
    useWhen: "The buyer needs to feel chosen, not sold. Powerful for prestige, quiet-builder, and legacy buyers who value being selected and respond to reciprocity over pressure.",
  },
  {
    name: "The Isolation Close",
    line: "Let me ask it clean. If we set the money completely to the side for one second, is there anything else at all holding you back from doing this? Because if the only thing left is figuring out the investment, that is the easy part and I will walk you through it right now.",
    useWhen: "A single objection is hiding behind vague hesitation. Isolate it, confirm it is the only one, then collapse the decision down to that one solvable thing.",
  },
];
