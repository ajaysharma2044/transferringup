// regionalPsych.ts
// State-culture layer of college prestige psychology for lead profiling.
// Core premise: the same school produces totally different emotions depending on
// where the student grew up and how high-achieving they were in high school.
// Canonical case: a top NJ student at Rutgers feels "stayed behind" shame because
// NJ exports more freshmen than any state and the HS status game is "who got out."
// An Ohio kid at Rutgers feels none of it. The wound is state-relative, not
// school-absolute. Every knowingLine is a verbatim line a closer can say.

export type RegionalRead = {
  culture: string;
  dynamic: string;
  achieverTwist: string;
  knowingLine: string;
  transferFlavor: string;
};

export const STATE_CULTURES: Record<string, RegionalRead> = {
  NJ: {
    culture:
      "New Jersey is the nation's number one exporter of college freshmen: roughly 30,000 leave every fall and only a few thousand come in, the largest net loss of any state. The entire high school status game is 'who got out,' and the state produces elite students at a rate its own flagship cannot absorb.",
    dynamic:
      "Rutgers is the default landing spot everyone knows, which is exactly why staying there reads as 'stayed behind' even though it is a Big Ten AAU research university. TCNJ is the respected small-school alternative, Rowan has risen fast since the Rowan engineering gift, and Montclair, Kean, and William Paterson sit below a line nobody pretends not to see.",
    achieverTwist:
      "A top student at Rutgers carries a wound an average student does not: everyone from their high school knows their rank, so being there feels like public evidence the plan failed. An average student at Rutgers is just a normal Jersey kid; a 1450-SAT kid at Rutgers is a story people tell.",
    knowingLine:
      "In Jersey the whole senior year scoreboard is who got out, so being a strong student at Rutgers can feel like everyone back home is quietly doing the math on what happened. A kid from Ohio at Rutgers would feel none of that.",
    transferFlavor:
      "Shame-repair. The transfer is about rewriting the ending of the high school story, so name the story, not the school: Rutgers is not the problem, staying is.",
  },
  NY: {
    culture:
      "New York splits in two: on Long Island and in Westchester the private-school default runs deep and 'a SUNY' is said with a wince at kitchen tables in Great Neck and Scarsdale, while upstate a SUNY is simply where people go. CUNY carries a separate commuter and immigrant-family value logic where living at home is the plan, not the failure.",
    dynamic:
      "Binghamton is 'the good SUNY,' the one that needs the least explaining, while Stony Brook is respected for STEM but tainted for Long Island kids by commuting-distance familiarity. Albany and Buffalo carry party-school residue downstate, and the affluent-suburb export routes run to Michigan, Wisconsin, Penn State, Maryland, and the Boston privates.",
    achieverTwist:
      "A high achiever from Jericho or Scarsdale at Binghamton still feels they settled, because their reference group went to Cornell, Michigan, and BC; at Stony Brook the extra sting is living twenty minutes from home while friends 'went away.' Average students at these schools feel they landed fine.",
    knowingLine:
      "On Long Island, 'she goes to a SUNY' lands completely differently than it would anywhere else in the country. Binghamton is the only one you don't have to explain, and even then you're kind of explaining.",
    transferFlavor:
      "Shame-repair plus escape: they want a name that survives the diner conversation and a campus that is not commuting distance from their childhood bedroom.",
  },
  CT: {
    culture:
      "Connecticut is prep-school country wrapped around one flagship: in Fairfield County and the Gold Coast towns the assumed path is NESCAC, BC, or an Ivy, and a state school reads as something having gone wrong. In the rest of the state UConn is a proud outcome, so the same campus produces opposite emotions by zip code.",
    dynamic:
      "UConn's basketball-era rise and honors program made it objectively strong, but Darien, New Canaan, and Greenwich families still treat Storrs as the safety that was not supposed to happen. Fairfield, Quinnipiac, and Sacred Heart absorb the private-at-any-cost tier below the NESCAC line.",
    achieverTwist:
      "A top student from a Gold Coast high school at UConn feels demoted in a way a Hartford-area top student never does, because their town's definition of success excludes state schools entirely. UConn honors kids from these towns lead with 'honors' the way ASU kids lead with Barrett.",
    knowingLine:
      "In most of Connecticut, UConn is a win. In Fairfield County it's the school your parents don't mention at parties, and you can tell me which Connecticut you're from in one sentence.",
    transferFlavor:
      "Shame-repair in the Gold Coast, ambition elsewhere: southwest-corner kids want a private name back; the rest want a specific program or city.",
  },
  MA: {
    culture:
      "Massachusetts has the densest concentration of famous private colleges on earth, so the state school sits in permanent comparison: being at UMass means Harvard, MIT, Tufts, BC, BU, Amherst, and Williams are all within a two-hour drive and all in the conversation. In towns like Newton, Lexington, and Wellesley the export-to-private default is nearly total.",
    dynamic:
      "The old 'ZooMass' party label on UMass Amherst has faded nationally but survives intact in prep-town social memory, and Commonwealth Honors College is the internal repair mechanism students cite unprompted. UMass Lowell, Boston, and Dartmouth (the campus) sit clearly below Amherst in-state.",
    achieverTwist:
      "A high achiever at UMass from a high-pressure suburb rehearses a justification, usually money or honors college, before anyone even asks. An average student from Worcester or Springfield at UMass is simply at the state school and feels fine.",
    knowingLine:
      "Being at UMass in Massachusetts is different from being at a flagship anywhere else, because you're surrounded by thirty famous private schools and everyone's cousin goes to one of them.",
    transferFlavor:
      "Shame-repair with a price-tag subplot: many chose UMass rationally over debt and now want the prestige back without having to say the word prestige.",
  },
  CA: {
    culture:
      "California runs the most legible public hierarchy in America: everyone knows the UC ladder (Berkeley and UCLA, then UCSD, UCSB, Irvine, Davis, then Santa Cruz, Riverside, Merced) with the CSU tier below it, and Cal Poly SLO and SDSU as the CSU exceptions that punch upward. Nobody asks if you went to a UC; they ask which one.",
    dynamic:
      "Uniquely, community college transfer is a respected mainstream lane, not a stigma: ASSIST articulation and TAG guarantees at six UCs (Davis, Irvine, Santa Barbara, Santa Cruz, Riverside, Merced) move tens of thousands of students up every year, and Berkeley and UCLA admit large CC cohorts without TAG. USC has fully shed 'University of Spoiled Children' and become a top-25 ambition object; Stanford functions as weather, present but unreachable.",
    achieverTwist:
      "A 4.4-GPA kid who landed at Riverside or Merced feels mis-sorted by an opaque algorithm rather than fairly judged, which produces indignation more than shame. Average students feel the ladder less; for them any UC already beats the CSU line they feared.",
    knowingLine:
      "In California nobody asks whether you got into a UC, they ask which one, and everyone in the room knows exactly where that one sits on the ladder. And you're in the one state where transferring up is a totally normal, mapped-out move.",
    transferFlavor:
      "Ambition, not shame: the transfer lane is institutionalized, so sell the climb as executing a known play (TAG, articulation, junior-entry to UCLA or Berkeley), not as fixing an embarrassment.",
  },
  TX: {
    culture:
      "Texas keeps its kids: in-state tuition, football identity, and family expectation make leaving rare, so the status game is fought almost entirely on the UT Austin versus A&M axis. Out-of-state privates read to many Texas families as either rich or desperate.",
    dynamic:
      "The auto-admit law (top 10 percent statewide, but UT Austin capped so tightly it sits at top 6 percent and drops to top 5 percent for fall 2026) means kids at hyper-competitive suburbs like Plano, Katy, and Westlake can carry a 1500 SAT, miss the cutoff, and watch lower-scoring students from easier schools walk in automatically. UT's CAP program (freshman year at UTSA, UT Arlington, or UTEP with a 3.2 GPA, then guaranteed transfer to Austin) makes the transfer lane official.",
    achieverTwist:
      "The high achiever who missed auto-admit carries resentment at a formula, not doubt about themselves: they can quote their rank, the cutoff, and the kid who got in over them. Average students at Texas State or Tech mostly feel fine; the wound belongs to the ones who were top 7 percent at the wrong school.",
    knowingLine:
      "You can be top 8 percent at a school like Plano West with a 1500 and lose your Austin spot to someone with lower scores at an easier school, and every Texan your age knows exactly how that math works.",
    transferFlavor:
      "Justice-repair ambition: they want the seat the formula denied them, and Texas literally built the road (CAP, external transfer to UT and A&M), so frame transfer as claiming what the rank rule took.",
  },
  GA: {
    culture:
      "Georgia engineered its kids into staying: HOPE (3.0 GPA, most of tuition) and Zell Miller (3.7 GPA plus a 1200 SAT or 26 ACT, 100 percent of tuition) made in-state financially unbeatable, which in turn made UGA and Georgia Tech genuinely selective and genuinely respected. Staying in-state carries no stigma here, which is rare east of the Mississippi.",
    dynamic:
      "The wound moved down a level: it is not 'stayed in Georgia,' it is holding Zell Miller money at Kennesaw State, Georgia State, or Georgia Southern because UGA and Tech said no. Tech carries national engineering prestige, UGA holds the social-flagship crown, and everything below is understood as not-the-plan.",
    achieverTwist:
      "A Zell scholar at Kennesaw feels the scholarship became handcuffs: too financially rational to leave, too proud of their stats to feel correctly placed. Average HOPE students at those schools feel they played it smart, because they did.",
    knowingLine:
      "In Georgia the money made staying smart, so the sting was never staying in-state. It's sitting on a Zell Miller scholarship at a school you know wasn't the plan.",
    transferFlavor:
      "Ambition with a spreadsheet: the move is usually up to UGA or Tech in-state (which keeps the scholarship), or a calculated out-of-state jump that has to beat free, so come armed with the ROI case.",
  },
  FL: {
    culture:
      "Bright Futures rewired Florida: the Academic Scholars tier covers 100 percent of tuition and fees (3.5 core GPA and roughly a 1330 SAT), so nearly every strong student stays, and UF became the single trophy the whole state competes for. UF's climb into the top-5-publics conversation made Gainesville the only acceptable answer in a lot of households.",
    dynamic:
      "FSU is the strong silver medal with a real rivalry identity; UCF is one of the largest universities in the country and pays for that scale with an 'everyone gets in' reputation it only partly deserves; USF is rising fastest on preeminence funding. Ambitious Florida seniors recite the hierarchy: UF, FSU, then daylight.",
    achieverTwist:
      "A high achiever at UCF or USF holding full Bright Futures feels invisible: they kept the money and lost the name, and at UCF's scale they can feel like an ID number in a crowd of 60,000. Average students feel UCF and USF are a good deal, because they are.",
    knowingLine:
      "In Florida the Bright Futures math means all the smart kids stay, so the only question that matters at Thanksgiving is Gainesville or not Gainesville.",
    transferFlavor:
      "Trade-up ambition: the target is almost always UF, occasionally FSU or out-of-state prestige, and the pitch must respect that walking away from Bright Futures has to be justified in dollars.",
  },
  VA: {
    culture:
      "Virginia has two elite publics, UVA and William & Mary, and a Northern Virginia arms race that makes reaching them brutal: Fairfax and Loudoun County kids compete inside the deepest AP-loaded applicant pool in the state, with TJHSST setting a deranged local ceiling. In-state placement is the whole status conversation in the DMV suburbs.",
    dynamic:
      "The NoVa 4.4-GPA kid who lands at Virginia Tech, JMU, or George Mason was often filtered by geography, not ability: the same file from a rural county reads differently. VT holds real engineering respect, JMU is liked but coded social, and GMU carries a commuter stigma inside NoVa itself. Virginia's community colleges hold Guaranteed Admission Agreements into UVA, W&M, and VT at set GPAs, making the transfer road unusually official.",
    achieverTwist:
      "The high achiever at JMU or GMU from NoVa believes, usually correctly, that their zip code cost them UVA, which produces a very specific prove-the-sorting-wrong energy. Average students at those schools are content; the chip belongs to the filtered.",
    knowingLine:
      "Coming out of a NoVa high school, a UVA rejection doesn't feel like a reach school saying no. It feels like your own state telling you that you weren't in the top slice of your own zip code.",
    transferFlavor:
      "Redemption ambition: UVA and W&M take transfers seriously and the guaranteed-admission lane exists, so frame it as the second door into the school their county blocked.",
  },
  MD: {
    culture:
      "Maryland's status culture is DMV status culture: Montgomery and Howard County families run a quiet prestige race where UMD College Park is respectable but default, the school half your AP classes also chose. Baltimore-area and Eastern Shore families read UMD as a genuine prize, so the same campus splits by county.",
    dynamic:
      "UMD's rankings climb, honors colleges, and CS strength made it objectively hard to dismiss, which makes the Bethesda kid's ambivalence feel illegitimate even to themselves. Towson and Salisbury sit clearly below; UMBC holds a nerd-respect niche (Meyerhoff, chess) that punches above its tier.",
    achieverTwist:
      "For a Whitman or Churchill high achiever, UMD feels like 13th grade: they see forty people from their graduating class in the first week and feel their story flatten. Average students feel College Park is a clear win.",
    knowingLine:
      "Half your AP classes moved to College Park with you, so it can feel like 13th grade with a better gym. That feeling is real even when you know Maryland is a good school.",
    transferFlavor:
      "Escape and differentiation: the driver is less prestige-shame than the need for a story that is theirs, so sell distance and identity, not just rank.",
  },
  IL: {
    culture:
      "Illinois is a giant exporter, perennially second only to New Jersey in students it sends away: North Shore and western-suburb money (New Trier, Hinsdale, Naperville) caravans to Madison, Ann Arbor, Bloomington, Boulder, and Iowa City, paying out-of-state freight as a status signal. Staying in-state is the exception in affluent Chicagoland.",
    dynamic:
      "UIUC is two schools in one: the engineering and CS admit holds world-rank prestige nobody questions, while the general LAS admit reads as the default the Madison caravan skipped. ISU, NIU, and SIU sit well below the conversation in status-conscious suburbs.",
    achieverTwist:
      "A UIUC engineering or CS high achiever has no wound at all, and treating them like they do will blow trust. A high achiever in LAS or DGS at UIUC from the North Shore feels like they took the practical option while their group chat is at Camp Randall.",
    knowingLine:
      "In Chicagoland the flex was never in-state, it was paying out-of-state for Madison or Michigan. So being at U of I outside engineering can feel like watching the caravan leave without you.",
    transferFlavor:
      "Escape with a status accent: the pull is toward the Big Ten schools their crowd chose or a coastal name; for UIUC engineering kids, transfer talk is program fit, never shame.",
  },
  PA: {
    culture:
      "Pennsylvania runs on the Penn State cult: 'We Are' is a lifetime identity with one of the largest alumni networks on earth, and in most of the state wearing the logo is the whole point. The Philly ring adds Villanova, Drexel, and state-related Temple, plus Penn as the island nobody counts.",
    dynamic:
      "The real status line runs inside Penn State itself: 'main campus?' is the first question every Pennsylvanian asks, because the 2+2 system routes a huge share of students through 19 Commonwealth campuses (Abington, Altoona, Behrend, Brandywine) before University Park. Pitt's research and medical rise made it a legitimate co-flagship, which older Penn State families still refuse to price in.",
    achieverTwist:
      "A high achiever at a branch campus carries the sharpest wound in the state: they say 'Penn State' and live in the pause before someone asks which one. A high achiever at University Park has no wound; they have season tickets.",
    knowingLine:
      "In Pennsylvania the question is never whether you're at Penn State, it's 'main campus?', and everyone knows exactly what the pause before your answer means.",
    transferFlavor:
      "Shame-repair for branch-campus students (the internal 2+2 climb to University Park, or a jump to Pitt or out-of-state), and program-driven ambition for everyone else.",
  },
  OH: {
    culture:
      "Ohio is a flagship-pride state with a preppy twist: Ohio State is a genuine identity object (Buckeye Saturdays are a civic religion), staying in-state is normal, and the state keeps most of its students. Miami University holds the 'Public Ivy' preppy lane for suburban Cincinnati and Columbus money.",
    dynamic:
      "The internal ladder runs Columbus main campus, then Miami, then Ohio U (party residue), Cincinnati (co-op respect), Kent, Akron, Wright State. The quiet wound is the OSU regional campuses (Newark, Lima, Marion): admitted to the brand, not the stadium.",
    achieverTwist:
      "A high achiever at OSU Columbus feels zero stigma, and a Miami high achiever feels chosen rather than defaulted. The achiever wound lives at OSU regionals and the mid-tier publics, where strong students feel the brand was rationed.",
    knowingLine:
      "In Ohio, Ohio State isn't a consolation, it's the point. The question is only whether you're actually in Columbus or at a regional campus wearing the same sweatshirt.",
    transferFlavor:
      "Mostly career-driven: regional-campus students climb to Columbus through the internal campus-change path, and true shame-repair cases are rarer than in the Northeast.",
  },
  MI: {
    culture:
      "Michigan owns the in-state trophy few states have: Ann Arbor at in-state tuition is the prize, so almost nobody ambitious leaves, and the entire status question is Michigan or Michigan State. Green versus blue is assigned in childhood.",
    dynamic:
      "For metro Detroit's competitive suburbs (Novi, Troy, Bloomfield Hills), MSU is the respectable landing that still stings for Ann Arbor rejects, and the rivalry gives the sting a costume: Sparty pride with a chip underneath. Michigan admits a meaningful number of in-state transfers, so the Lansing-to-Ann-Arbor move is a known play.",
    achieverTwist:
      "The high achiever at MSU from a Michigan-feeder suburb tracks the admitted-friends network obsessively and knows exactly who got in with what. Average students at MSU are fully content: it is a good school with a better tailgate.",
    knowingLine:
      "In Michigan nobody needs the rivalry explained: you can love being a Spartan and still remember the exact day the Michigan decision came out. Both things are true and everyone knows it.",
    transferFlavor:
      "Ambition on a well-worn road: the Ann Arbor transfer is a normal, mapped in-state move, so sell execution (GPA, course match) rather than dwelling on the freshman-year verdict.",
  },
  NC: {
    culture:
      "North Carolina keeps its best kids nearly automatically: state law caps out-of-state freshmen at 18 percent across the UNC system, making Chapel Hill an elite school at a bargain that in-state families treat as the only real target. The Research Triangle suburbs (Cary, Apex, Chapel Hill itself) run a compressed UVA-style race for it.",
    dynamic:
      "NC State holds real engineering respect and a chip about Chapel Hill's polish; the tier below (UNC Charlotte, App State, ECU, UNCW) is understood as missing the two flagships. Duke and Wake Forest function as private islands most in-state families never seriously price.",
    achieverTwist:
      "The Cary high achiever at UNC Charlotte or App State feels sorted out of a birthright, because in-state Chapel Hill was the whole plan and the price made it non-negotiable. Average students settle into the tier system without much pain.",
    knowingLine:
      "In North Carolina, Chapel Hill at in-state price is the deal of a lifetime, so not getting it doesn't feel like a rejection, it feels like losing something your family already counted.",
    transferFlavor:
      "Trade-up ambition toward Chapel Hill or NC State, and the in-state transfer paths are active enough that this is a plan, not a fantasy.",
  },
  SC: {
    culture:
      "South Carolina sorts by family flag: Clemson or Carolina is decided at birth in many households, Palmetto Fellows money keeps strong students in-state, and leaving is mildly eccentric. The rivalry gives both schools genuine pride cover.",
    dynamic:
      "Clemson's engineering rise made it the ambitious pick, USC Columbia holds the capital-city and business lane, and College of Charleston is the lifestyle brand that reads charming to locals and unserious to strivers' parents. The wound tier is Coastal Carolina and the regionals.",
    achieverTwist:
      "A high achiever at College of Charleston hears 'having fun down there?' as a status verdict, while a Clemson honors achiever feels no wound at all. The sting in SC is being at the fun school when your stats said flagship.",
    knowingLine:
      "In South Carolina everyone's family picked Clemson or Carolina for you decades ago, so the real tell is when a top student ends up at neither and has to keep explaining Charleston.",
    transferFlavor:
      "Mostly career-driven, aimed at Clemson engineering or a bigger out-of-state name; shame is mild because the in-state pride canopy covers most outcomes.",
  },
  AL: {
    culture:
      "Alabama is peak flagship pride: Roll Tide or War Eagle is a lifetime affiliation asked about before your job, staying in-state is celebrated, and there is no 'stayed behind' wound at all. The state also runs a famous reverse play: recruiting high-stat out-of-state kids with massive automatic merit, historically including full-tuition-plus for National Merit finalists.",
    dynamic:
      "More than half of recent Tuscaloosa freshman classes came from out of state chasing that money, creating a two-population campus: scholarship imports and legacy locals. Auburn mirrors the identity with an engineering-and-agriculture accent; UAB owns the medical lane.",
    achieverTwist:
      "An in-state high achiever at Alabama or Auburn feels chosen and celebrated, full stop. The complicated psychology belongs to imported merit kids from NJ or Chicagoland whose home-state friends read Alabama as a rankings step down no scholarship fully explains at parties.",
    knowingLine:
      "In Alabama nobody ever asks why you stayed, they ask which side you're on. If you're one of the out-of-state scholarship kids, the questions all come from back home, not from here.",
    transferFlavor:
      "Career-driven, not shame-driven, for locals: transfers chase specific programs or cities. The OOS merit kids transfer when the money stops outweighing the distance from their real network.",
  },
  MS: {
    culture:
      "Mississippi is flagship-proud and export-poor: Ole Miss and Mississippi State split the state by family the way Clemson and Carolina split South Carolina, and the Grove at Ole Miss is a social institution with its own dress code. Staying carries zero stigma.",
    dynamic:
      "Ole Miss codes social-and-law, State codes engineering-and-ag, and the ambitious escape valves are Vanderbilt, Tulane, and Alabama's merit money rather than the coasts. Southern Miss and the regionals sit clearly below.",
    achieverTwist:
      "The high achiever's tension is not school shame but state gravity: they feel the pull between a comfortable known ladder and the sense that their ambitions price in leaving the state entirely. Average students feel the system fits.",
    knowingLine:
      "In Mississippi the school was never the problem, the ceiling is the question, and the honest conversation is whether the next step lives inside the state at all.",
    transferFlavor:
      "Escape, economically flavored: the motivated transfer is about markets and majors (Atlanta, Nashville, Texas) more than repairing any embarrassment.",
  },
  LA: {
    culture:
      "Louisiana built a moat around LSU: TOPS scholarship money makes staying nearly free for qualifiers, Baton Rouge Saturdays are a civic religion, and the cultural pull of home (food, family, festivals) is stronger than almost any state's. Leaving requires a justification; staying never does.",
    dynamic:
      "LSU is the default and the pride object at once; Tulane is the private island filled mostly with out-of-state students; Louisiana Tech and UL Lafayette hold engineering and regional lanes. The TOPS deal means walking away from it is a family finance conversation, not just a personal one.",
    achieverTwist:
      "The high achiever at LSU feels no stigma at home but sometimes feels the ceiling when they compare national outcomes in their field; the wound is quiet and future-tense, not social. Average students feel LSU is exactly right.",
    knowingLine:
      "TOPS made LSU close to free, so nobody questions staying. The question you're actually asking is whether your industry lives in Louisiana, and that's a different conversation than the one your family is having.",
    transferFlavor:
      "Career-driven escape: the pitch is job markets and program depth elsewhere versus the real cost of abandoning TOPS, so bring numbers.",
  },
  TN: {
    culture:
      "Tennessee runs on rising flagship pride: UT Knoxville's checkerboard identity has surged, lottery-funded HOPE money nudges students to stay, and Nashville's boom made in-state feel less like settling every year. Vanderbilt sits in-state but functions as an unreachable private island.",
    dynamic:
      "UTK is the default trophy, MTSU and ETSU hold regional lanes, and ambitious kids who leave mostly go to Georgia, Alabama merit money, or the Carolinas rather than the coasts. Memphis-area families orbit differently than Nashville-area ones.",
    achieverTwist:
      "A high achiever at UTK feels the school rising underneath them, which softens any wound; the sting appears for strong students at MTSU or Memphis who watched the scholarship math make their choices for them. A Vanderbilt rejection stings privately, but it was always priced as a moonshot.",
    knowingLine:
      "UT got cool again fast, so staying stopped being a compromise about three football seasons ago. If you're at one of the regionals on HOPE money, though, you know the scholarship did the choosing.",
    transferFlavor:
      "Ambition, gently held: moves aim at UTK or nearby SEC prestige, and career logic beats shame logic almost every time.",
  },
  WA: {
    culture:
      "Washington's status game is major-gated, not school-gated: UW Seattle is respected everywhere, but 'U-Dub is where everyone goes' makes it the default for Seattle-area kids, and the real prestige gate is direct admission to the Allen School for CS. WSU is the Cougs, with an east-west culture split and ag-and-party residue.",
    dynamic:
      "Getting into UW but not into CS or engineering is the state's signature wound: internal transfer into the Allen School is brutally capped, so students sit at their dream school locked out of their dream major. Tech-industry parents in Bellevue and Redmond price this precisely.",
    achieverTwist:
      "The high achiever at UW outside their intended major feels a uniquely modern trap: right school, wrong door, with the Amazon and Microsoft towers visible from campus. Average students at UW feel fine; WSU students mostly opted into the identity.",
    knowingLine:
      "In Washington the heartbreak isn't missing UW, it's getting into UW and not into Allen. Everyone in Bellevue knows a kid sitting at their dream school locked out of their dream major.",
    transferFlavor:
      "Major-driven ambition: the transfer case is often out-of-state to a school that will actually let them study the thing, and that framing (access, not prestige) is the one that lands.",
  },
  OR: {
    culture:
      "Oregon splits Ducks and Beavers with Nike money coloring the U of O brand, but the ambitious-Portland-kid path has long pointed outward: UW, the UCs, and small privates like Reed and Lewis & Clark absorb the strivers. Flagship pride is real but lighter than in the South or Midwest.",
    dynamic:
      "UO codes social-and-brand thanks to Eugene and the swoosh, OSU codes engineering-and-ag with Corvallis steadiness, and neither carries heavy stigma. The quiet dynamic is ceiling: strong students who stayed for cost sometimes feel the state's limits in their field.",
    achieverTwist:
      "A Portland high achiever at UO or OSU often carries mild 'I could have left' energy rather than shame, especially watching friends at UW or in California. Average students feel the schools match the state's easygoing register.",
    knowingLine:
      "Oregon doesn't really do college shame, but Portland kids keep score quietly, and staying in Eugene or Corvallis when your friends went to Seattle or California is the kind of thing you notice at winter break.",
    transferFlavor:
      "Ambition-lite and career-driven: moves chase bigger programs, bigger cities, or specific industries, so keep the sales conversation practical, not wounded.",
  },
  CO: {
    culture:
      "Colorado runs an inverted market: CU Boulder is a lifestyle trophy that wealthy out-of-state kids from California, Illinois, and Texas pay premium tuition to attain, while in-state kids treat it as the default down the road. The same campus is a flex for imports and a shrug for locals.",
    dynamic:
      "Boulder's out-of-state share is enormous, CSU Fort Collins is the solid second with vet-school respect, and Colorado School of Mines is the quiet in-state prestige pick whose employer respect per student outranks both. Locals know the Mines math even when outsiders don't.",
    achieverTwist:
      "The in-state high achiever at Boulder feels no wound but sometimes feels surrounded by richer imports treating their state school as a ski pass with classes; a Mines achiever feels quietly elite. The import kids' psychology belongs to their home state's file, not Colorado's.",
    knowingLine:
      "Boulder is the school other states' kids pay triple for and Colorado kids shrug about, and if you're in-state at Mines you already know you took the smartest deal nobody outside Colorado claps for.",
    transferFlavor:
      "Career and program driven: in-state moves chase majors, often into Mines or out to bigger CS and business names, with almost no shame component.",
  },
  AZ: {
    culture:
      "Arizona's schools carry a national reputation lag: ASU spent decades as a punchline party school, rebuilt itself into an innovation-rankings giant, and the social memory has not caught up, which is exactly why Barrett Honors College exists as a sentence. The state also absorbs a huge California overflow of kids who missed the UC ladder.",
    dynamic:
      "Barrett is the repair mechanism: ASU students with options say 'Barrett' before 'ASU' because it flips the read from default to selective. U of A holds Tucson pride and a merit-money pipeline for California families doing WUE-style math; the ASU-UofA rivalry is real but lower stakes than Texas or Michigan.",
    achieverTwist:
      "The high achiever at ASU leads with Barrett, scholarships, or Fulton engineering because they know the bare letters undersell them. California transplants carry their home state's UC wound with them; local achievers mostly feel the schools rising underneath them.",
    knowingLine:
      "Every strong student at ASU says Barrett before they say ASU, because they know the name alone gets read ten years out of date. You didn't invent that move, the whole honors college is built on it.",
    transferFlavor:
      "Shame-repair for the California overflow kids aiming back at the UC ladder (the CC-transfer route home is mapped), and program-driven ambition for locals.",
  },
  MN: {
    culture:
      "Minnesota wraps college status in modesty culture: bragging is a minor sin, the U of M Twin Cities is the respectable default, and tuition reciprocity with Wisconsin means Madison costs Minnesota kids close to in-state rates, which quietly makes it the ambitious pick. Madison-or-Minneapolis is the state's real status fork.",
    dynamic:
      "UMN's Carlson business school and engineering hold solid regional weight, Carleton, St. Olaf, and Macalester skim certain families into a private tier, and Duluth or St. Cloud read clearly regional. The reciprocity deal means choosing UMN over Madison was a choice, and strong students know it.",
    achieverTwist:
      "A high achiever at UMN sometimes carries quiet Madison counterfactuals, since the price was the same and the scene was bigger; they will not volunteer this, because complaining is also a minor sin. Average students feel UMN is exactly proportionate.",
    knowingLine:
      "Reciprocity made Madison basically in-state money for Minnesota kids, so if you chose the U instead, you've done that math in your head more than once and never said it out loud.",
    transferFlavor:
      "Understated ambition: moves target Madison, Big Ten peers, or coastal programs, and the pitch should give them permission to want more without making them say it grandly.",
  },
  WI: {
    culture:
      "Wisconsin has a trophy flagship that imports money: Madison is the in-state prize and simultaneously a destination for full-freight Chicago and East Coast kids, producing the campus's famous Coasties-versus-Sconnies split. In-state pride is strong; missing Madison is the wound.",
    dynamic:
      "The ladder drops steeply from Madison to Milwaukee, La Crosse, Eau Claire, and Oshkosh, and everyone in-state knows it; La Crosse and Eau Claire hold respectable niches but nobody confuses the tiers. In-state kids at Madison also nurse quiet class friction with imports whose parents pay triple casually.",
    achieverTwist:
      "The high achiever at a UW satellite campus feels the Madison miss concretely because half their AP cohort is on State Street posting from Camp Randall. At Madison itself, in-state achievers feel earned pride with a side of class awareness.",
    knowingLine:
      "In Wisconsin everything is Madison or not-Madison, and if you're at Eau Claire or Milwaukee watching your old study group's game-day stories, nobody has to explain the difference to you.",
    transferFlavor:
      "Trade-up ambition on a short road: the internal transfer to Madison is a known, achievable play, so sell GPA execution and course articulation.",
  },
  IN: {
    culture:
      "Indiana's status game is major-gated like Washington's: IU Bloomington versus Purdue is the surface rivalry, but the real gates are Kelley (IU's business school) and Purdue engineering, and in-state families track direct-admit versus standard-admit precisely. Both flagships also import heavy Chicagoland money.",
    dynamic:
      "IU without Kelley reads very differently than IU with it, and the standard-admit GPA chase defines many freshman years; Purdue's engineering brand is national and its tuition freeze legendary. Ball State, Indiana State, and the regionals sit clearly below the two flagships.",
    achieverTwist:
      "The high achiever at IU outside Kelley is often mid-campaign to get in and carries admit-tier anxiety rather than school shame; a Purdue engineering achiever has no wound at all. Regional-campus strong students feel the flagship gap daily.",
    knowingLine:
      "At IU the question isn't the school, it's 'are you Kelley?', and everyone in Hodge Hall knows exactly which admit path everyone else took.",
    transferFlavor:
      "Major-driven ambition: internal admit-to-Kelley campaigns, Purdue engineering laterals, or out-of-state jumps when the gate stays shut; sell access to the major, not the campus.",
  },
  MO: {
    culture:
      "Missouri splits between St. Louis and Kansas City orbits with Mizzou as the shared default flagship: solid journalism-and-Greek-life identity, real SEC pride since the conference move, and little stigma in staying. WashU sits in St. Louis as the unreachable private island locals rarely price seriously.",
    dynamic:
      "Bright Flight merit money nudges top test scorers to stay in-state, while Alabama and Arkansas merit packages actively poach the same kids; Missouri S&T in Rolla is the quiet engineering prestige pick employers respect. Truman State holds an honors-college-as-university niche.",
    achieverTwist:
      "A high achiever at Mizzou feels comfortable more than celebrated, and the ambitious ones eye Big Ten and SEC peers with better national gravity in their field; S&T achievers feel quietly elite like Mines kids in Colorado. Average students feel Mizzou fits.",
    knowingLine:
      "Mizzou is easy to stay at and hard to brag about outside the state, and if you took Bright Flight money you know the scholarship was half the decision.",
    transferFlavor:
      "Career-driven ambition: moves chase national program strength or bigger metros, and the case must beat in-state comfort plus scholarship math.",
  },
};

export const SCHOOL_STATE_STIGMA: { schoolRe: string; homeState: string; read: string }[] = [
  {
    schoolRe: "rutgers",
    homeState: "NJ",
    read:
      "The canonical wound: in a state whose whole status game is 'who got out,' Rutgers is the default everyone knows, so a strong student there feels their high school rank got publicly overwritten by their landing spot. The mechanism is audience: everyone from home knows exactly what Rutgers means, so the embarrassment renews every break. Validate that the school is fine and the geography is the problem, then sell the transfer as finishing the getting-out story.",
  },
  {
    schoolRe: "tcnj|college of new jersey|rowan",
    homeState: "NJ",
    read:
      "TCNJ and Rowan are respected inside New Jersey (TCNJ as the smart small school, Rowan rising on the engineering gift) but nearly invisible outside it, so ambitious students feel the brand shrink at the state line. The mechanism is credential localism: the name works at home, where they never wanted to stay. The pitch is portability, a name that travels.",
  },
  {
    schoolRe: "montclair state|kean university|william paterson|stockton university|ramapo|fairleigh dickinson|njit",
    homeState: "NJ",
    read:
      "Below Rutgers in the NJ hierarchy, these schools read in-state as 'didn't leave and didn't get the flagship,' a double miss in export culture (NJIT partially excepted via its engineering-commuter respect in immigrant families). The student usually frames it as a money decision, which is true and also armor. Honor the armor, then pivot to what a bigger name does to their story at home.",
  },
  {
    schoolRe: "university of delaware|\\budel\\b|blue hens",
    homeState: "NJ",
    read:
      "Delaware is the classic NJ spillover school: the student technically got out, but to a campus so full of Jersey plates it reads as Rutgers with a border crossing. The mechanism is diluted escape: they bought the leaving story and received a suburb of it. The transfer pitch is completing the distance they already paid for.",
  },
  {
    schoolRe: "binghamton",
    homeState: "NY",
    read:
      "Binghamton is 'the good SUNY,' which means the student won the public ladder and still lost the private-default game their Long Island or Westchester crowd was playing. The mechanism is reference group: their stats matched friends now at Cornell and Michigan, so best-SUNY feels like first place in the wrong contest. They respond to being treated as under-placed rather than well-placed.",
  },
  {
    schoolRe: "stony brook",
    homeState: "NY",
    read:
      "For Long Island students, Stony Brook's sting is not quality (the STEM is real), it is proximity: college twenty minutes from home reads as high school continued, especially for commuters. The mechanism is the missing departure ritual everyone else got. Sell the transfer as the leaving that never happened.",
  },
  {
    schoolRe: "suny|university at albany|university at buffalo|oneonta|new paltz|geneseo|cortland|oswego|plattsburgh|brockport|fredonia|purchase college",
    homeState: "NY",
    read:
      "In affluent downstate zip codes, 'a SUNY' is pronounced with a wince regardless of the campus's actual quality, while the same school is a normal proud outcome upstate. Read the zip code before the school: a Great Neck kid at Albany is living a different story than a Rochester kid on the same quad. The downstate version wants a name their town's dinner parties respect.",
  },
  {
    schoolRe: "umass|university of massachusetts",
    homeState: "MA",
    read:
      "In prep-belt towns like Newton and Lexington, UMass still carries residual 'ZooMass' social memory even though the school has objectively risen, and students pre-load justifications (honors college, avoided debt) before anyone asks. The mechanism is density: thirty famous privates within driving distance keep the comparison alive daily. Treat their money logic as smart, then sell the upgrade as the part money logic could not buy.",
  },
  {
    schoolRe: "uconn|university of connecticut",
    homeState: "CT",
    read:
      "A Fairfield County student at UConn is at a school their own town's culture defines as the outcome that was not supposed to happen, while a Hartford or New Haven area student on the same quad feels state pride. The mechanism is town-level default: Gold Coast success scripts skip state schools entirely. Ask about their high school before you assume the wound exists.",
  },
  {
    schoolRe: "uc\\s?(riverside|merced|santa cruz)|\\bucr\\b|\\bucsc\\b",
    homeState: "CA",
    read:
      "The bottom-ladder UC student, especially with big stats, feels mis-sorted by an opaque algorithm rather than fairly judged: same application, same essays, different dice. The mechanism is legibility: every Californian can recite the ladder, so the campus name does the ranking for them. These students respond to the mapped transfer-up lane (TAG, articulation, junior entry) because it converts indignation into a plan.",
  },
  {
    schoolRe: "cal state|\\bcsun\\b|\\bcsulb\\b|san jose state|san francisco state|sacramento state|fresno state|long beach state",
    homeState: "CA",
    read:
      "Landing below the UC line at a CSU (Cal Poly SLO and SDSU excepted, they punch upward) reads to ambitious California families as missing the ladder entirely, which stings more because the system is so legible. The offset is that California normalized the climb: CSU and CC students transfer into UCs at scale every year through ASSIST articulation. Frame the current school as a documented on-ramp, not a verdict.",
  },
  {
    schoolRe: "arizona state|\\basu\\b|university of arizona|\\buofa\\b",
    homeState: "CA",
    read:
      "A California kid at ASU or U of A is usually a UC-ladder miss who took the merit money, and back home the read is 'couldn't get into a UC,' which they know and pre-empt with Barrett, scholarships, or Fulton. The mechanism is home-audience lag: Arizona's schools rose faster than California's opinion of them. The transfer conversation is often about going home up the ladder, and the CC-to-UC route is mapped for them too.",
  },
  {
    schoolRe: "texas a\\s?&\\s?m|\\btamu\\b|aggie",
    homeState: "TX",
    read:
      "Handle with care: many Aggies chose College Station outright and the network is a genuine asset, so probe whether UT Austin was the actual goal before assuming a wound. For the Austin-reject subset, the rivalry structure means every football Saturday restages the decision they did not make. When the wound exists it presents as defensive Aggie pride wrapped around rank-rule resentment.",
  },
  {
    schoolRe: "texas state|\\btxst\\b|\\butsa\\b|texas tech|\\bttu\\b|\\buta\\b|\\butd\\b|\\butep\\b|(university of texas|ut)\\s?(at)?\\s?(san antonio|arlington|el paso|dallas|tyler|permian basin|rio grande)",
    homeState: "TX",
    read:
      "These campuses hold Texas's auto-admit casualties: top-8-percent kids from brutal suburbs who watched lower-scoring students from easier schools walk into Austin on the rank rule. The mechanism is procedural injustice, which produces energy rather than paralysis: they can quote the cutoff from memory. CAP and external transfer to UT are official roads, so sell reclamation, not repair.",
  },
  {
    schoolRe: "kennesaw|georgia state|georgia southern|west georgia|valdosta",
    homeState: "GA",
    read:
      "A strong Georgia student here is usually holding HOPE or Zell Miller money that made leaving irrational, so the wound is gilded: nearly free tuition at a school that was not the plan. The mechanism is golden handcuffs: the scholarship re-argues for staying every semester. The trade-up to UGA or Tech in-state preserves the money, which makes the transfer pitch unusually clean.",
  },
  {
    schoolRe: "\\bucf\\b|central florida",
    homeState: "FL",
    read:
      "UCF's scale (one of the largest enrollments in America) gives it an 'everyone gets in' reputation that punishes its strong students most: a Bright Futures scholar in a 500-person lecture feels like the scholarship bought anonymity. The mechanism is the UF counterfactual, refreshed every time Gainesville comes up at family events. They want a name that matches the money they were awarded.",
  },
  {
    schoolRe: "\\bfsu\\b|florida state",
    homeState: "FL",
    read:
      "FSU is a genuinely strong school living next to a trophy: the rivalry keeps UF in every conversation, so ambitious FSU students feel silver-medaled in a two-team state. The mechanism is proximity to the prize, not distance from quality. Probe whether UF was the actual target; if yes, the transfer motivation is already fully formed.",
  },
  {
    schoolRe: "penn state\\s?(abington|altoona|behrend|berks|brandywine|dubois|fayette|greater allegheny|harrisburg|hazleton|lehigh valley|mont alto|new kensington|schuylkill|scranton|shenango|wilkes|york|beaver)",
    homeState: "PA",
    read:
      "The branch-campus student says 'Penn State' and lives in the pause before 'which campus?', the sharpest status line in Pennsylvania because it runs inside the family brand. The mechanism is partial membership: same logo, different story, and everyone in-state knows the difference. The 2+2 climb to University Park is the sanctioned repair, but many would rather jump to Pitt or out-of-state and skip the asterisk years.",
  },
  {
    schoolRe: "university of pittsburgh|\\bpitt\\b",
    homeState: "PA",
    read:
      "Pitt students mostly chose it, and its research and medical rise justifies them, but in Penn State households the choice still gets litigated at holidays, and Philly-suburb strivers treat Pitt as the backup to Northeastern-tier privates. The wound, when present, is mild and social rather than academic. Check whether the family runs blue-and-white before assuming anything.",
  },
  {
    schoolRe: "miami university|miami of ohio|miami \\(ohio\\)|miami \\(oh\\)",
    homeState: "OH",
    read:
      "Miami reads preppy Public Ivy to Ohioans and 'wait, Florida?' to everyone else, so its students pay an explanation tax outside the region that undercuts the in-state polish. The mechanism is brand localism: the J.Crew-campus story only works where people already know it. Strong students eyeing national industries feel the name shrink at the state line.",
  },
  {
    schoolRe: "indiana university|iu bloomington|\\biub\\b",
    homeState: "IL",
    read:
      "IU is a primary Chicagoland money-migration destination, so a North Shore kid at Bloomington is often surrounded by their own high school, which converts 'went away' into '13th grade in Indiana.' The mechanism is failed differentiation: the distance is real but the crowd came along. Kelley admits feel none of this; ask about the business school before reading the wound.",
  },
  {
    schoolRe: "university of alabama|\\bbama\\b|tuscaloosa|crimson tide",
    homeState: "",
    read:
      "Applies to out-of-state students: Alabama usually means a merit package their home-state friends do not price in, so back home the read is a rankings step down no scholarship fully explains at parties. The mechanism is split audience: celebrated on campus, questioned at home, especially for Northeast and Chicagoland imports. In-state students feel pure flagship pride, so skip this read for Alabama residents.",
  },
  {
    schoolRe: "michigan state|\\bmsu\\b",
    homeState: "MI",
    read:
      "For metro Detroit strivers, MSU is the respectable landing that restages the Ann Arbor rejection every rivalry week, with Sparty pride functioning as both real identity and protective costume. The mechanism is the in-state binary: green versus blue was assigned in childhood and everyone knows which one they drew. The Ann Arbor transfer is a mapped play, which keeps the wound ambitious rather than hopeless.",
  },
  {
    schoolRe: "james madison|\\bjmu\\b|george mason|\\bgmu\\b",
    homeState: "VA",
    read:
      "A NoVa high achiever here believes, often correctly, that their zip code cost them UVA: the same file from a rural county lands differently. GMU adds a commuter sting inside NoVa itself; JMU is liked but coded social rather than serious. Virginia's guaranteed-admission transfer agreements make the UVA redemption arc concrete, which is exactly the energy to channel.",
  },
  {
    schoolRe: "university of maryland|\\bumd\\b|college park",
    homeState: "MD",
    read:
      "For Montgomery County students, College Park's problem is not quality but continuity: forty classmates came along, so the story never restarted. The mechanism is failed differentiation in a status-dense county. They respond to distinctiveness (new city, new network) more than to rankings arguments, because UMD's rankings are fine and they know it.",
  },
  {
    schoolRe: "college of charleston|\\bcofc\\b",
    homeState: "SC",
    read:
      "College of Charleston reads charming in-state and unserious to strivers' parents: a strong student there fields 'having fun down there?' as a recurring status verdict. The mechanism is lifestyle-brand discount: the city's glamour prices down the diploma's perceived rigor. They usually want Clemson, Carolina honors, or an out-of-state name that reframes the fun as a phase.",
  },
  {
    schoolRe: "clemson",
    homeState: "SC",
    read:
      "Clemson is mostly a pride object, so check the family flag first: in a Carolina household, being at Clemson carries genuine cross-pressure at every family gathering, and vice versa. The engineering rise made Clemson the ambitious in-state pick, so wounds here are usually major-fit or ceiling questions, not shame. Sell national program depth, not escape.",
  },
  {
    schoolRe: "uw[- ]?(milwaukee|la crosse|eau claire|oshkosh|whitewater|stevens point|green bay|stout|platteville|river falls|superior|parkside)|wisconsin[- ](milwaukee|la crosse|eau claire|oshkosh|whitewater)",
    homeState: "WI",
    read:
      "In a Madison-or-not state, the satellite campuses concretize the miss: half their AP cohort posts from Camp Randall while they attend a school nobody confuses with the flagship. The mechanism is a one-school hierarchy with no ambiguity to hide in. The internal transfer to Madison is short, known, and achievable, which makes this one of the easiest ambition sells in the country.",
  },
];

// Look up the lead's state culture and any school-x-home-state stigma reads.
// homeState is a 2-letter code (case-insensitive). A stigma entry with
// homeState "" applies to students from any state (its read says who it covers).
// When isHighAchiever is true, the culture's achieverTwist is prepended to the
// stigma list so the closer sees the achiever-specific read alongside the
// school-specific ones.
export function regionalRead(
  homeState: string,
  currentSchool: string,
  isHighAchiever: boolean
): { culture: RegionalRead | null; stigma: string[] } {
  const state = (homeState || "").trim().toUpperCase();
  const culture = STATE_CULTURES[state] || null;
  const school = (currentSchool || "").trim();
  const stigma: string[] = [];

  if (school) {
    for (const entry of SCHOOL_STATE_STIGMA) {
      if (entry.homeState !== "" && entry.homeState !== state) continue;
      let re: RegExp;
      try {
        re = new RegExp(entry.schoolRe, "i");
      } catch {
        continue;
      }
      if (re.test(school)) stigma.push(entry.read);
    }
  }

  if (isHighAchiever && culture) {
    stigma.unshift(culture.achieverTwist);
  }

  return { culture, stigma };
}
