/* Builds a branded TransferringUP proposal document for Aryan. */
const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign, LevelFormat, HeadingLevel, PageBreak,
} = require('docx');

const NAVY = '0F1C2E', CRIMSON = '7A0000', GOLD = '9A7B1F', INK = '20242B', GREY = '55606E', CREAM = 'F6F2EB', LINE = 'D9D3C8';
const CW = 9360; // content width (US Letter, 1" margins)

const serif = (text, opts = {}) => new TextRun({ text, font: 'Georgia', ...opts });
const sans = (text, opts = {}) => new TextRun({ text, font: 'Arial', ...opts });

const rule = (color = CRIMSON, size = 14) =>
  new Paragraph({ spacing: { before: 60, after: 160 }, border: { bottom: { style: BorderStyle.SINGLE, size, color, space: 1 } } });

const eyebrow = (text) => new Paragraph({
  spacing: { before: 260, after: 60 },
  children: [sans(text.toUpperCase(), { bold: true, color: CRIMSON, size: 18, characterSpacing: 30 })],
});

const h2 = (text) => new Paragraph({
  spacing: { before: 40, after: 140 },
  children: [serif(text, { bold: true, color: NAVY, size: 30 })],
});

const body = (text, opts = {}) => new Paragraph({
  spacing: { after: 120, line: 300 },
  children: [sans(text, { color: INK, size: 21, ...opts })],
});

const bullet = (lead, rest) => new Paragraph({
  numbering: { reference: 'feat', level: 0 },
  spacing: { after: 90, line: 290 },
  children: [sans(lead, { bold: true, color: NAVY, size: 21 }), sans(rest, { color: GREY, size: 21 })],
});

// ---- Reviews ----
const reviews = [
  { n: 'Shelly B.', t: 'BBB Verified Review', s: `Working with Ajay was one of the best decisions I made during the college application process. He is incredibly knowledgeable, strategic, and genuinely invested in his students’ success. What sets Ajay apart is his ability to create a personalized plan based on each student’s goals rather than using a one-size-fits-all approach. He helped me understand the transfer and admissions process, strengthened my application, and provided guidance every step of the way. His insight into college admissions is impressive, and he always took the time to answer questions and make sure I felt confident about my next steps.` },
  { n: 'Rishabh P.', t: 'BBB Verified Review', s: `Very attentive to detail and always responded quickly to me. Carefully planned everything out and made sure I stayed on track to successfully get admitted.` },
  { n: 'Mathew Z.', t: 'BBB Verified Review', s: `Went through Ajay and he helped me out a lot through the transfer process. Especially regarding my essays, he felt very chill, as if he were my older brother, and helped me during the stressful times.` },
  { n: 'Samanyu', t: 'UC Riverside → University of Virginia', s: `Coming out of high school, I had a 3.2 and thought it’d be impossible to transfer in just one year. Even through college, I was only able to maintain a 3.56 at UC Riverside. TransferringUp reassured me and made me feel secure of the entire transfer procedure. From creating an entire narrative for my application to calls every other day, they were very caring. I loved having their phone number and having them accessible 24/7. When that first NYU acceptance rolled through, it felt like all the weight on my shoulders just dissipated. Then the other acceptances started rolling through again and again and it felt unbelievable.` },
  { n: 'Adam', t: 'Indiana University → Cornell University', s: `TransferringUp really helped me figure out how to properly approach my academic endeavors, as I needed hands-on support throughout the college transfer admission process. Ajay and his team were very successful in ensuring that my college career could outshine what I had accomplished in high school. When I saw that I got into Cornell, I was beyond excited, but I give a lot of props to the long phone calls and hours of help I received from the TransferringUp team. I highly recommend this service to others who want to transfer to T-25s.` },
  { n: 'Brody', t: 'Keuka College → University of Virginia', s: `Transferring was a process I committed to early in my first year; the issue was that I had no direction. That’s where Transferring Up and Ajay came in. Coming out of high school I had a 3.3 GPA, and a C in Calc 1, which is why I originally thought I wouldn’t be able to transfer. Ajay walked me through each step of building up my extracurriculars, which is a big reason it turned out so well. My first acceptance was Tulane, then NYU, then U Miami with a merit scholarship, and finally UVA with a merit scholarship. Transferring Up has allowed me to attend a school I could only have imagined attending.` },
  { n: 'Yash', t: 'Drexel University → University of Michigan', s: `Everyone told me transferring to Michigan was impossible with a 3.2 high-school GPA, especially for Computer Science. TransferringUp didn’t just reassure me; they walked me through building my profile from scratch and writing essays that actually told my story instead of listing my stats. When the Michigan acceptance finally came through, it didn’t feel real. I’m now studying Computer Science at the University of Michigan.` },
];

const reviewBlock = (r) => new Paragraph({
  spacing: { after: 150, line: 290 },
  shading: { type: ShadingType.CLEAR, fill: CREAM },
  border: { left: { style: BorderStyle.SINGLE, size: 18, color: GOLD, space: 10 } },
  indent: { left: 160, right: 120 },
  children: [
    sans('★★★★★   ', { color: GOLD, size: 20 }),
    sans(r.n + '   ', { bold: true, color: NAVY, size: 21 }),
    sans(r.t, { italics: true, color: GREY, size: 16 }),
    new TextRun({ break: 1 }),
    sans('“' + r.s + '”', { color: INK, size: 19 }),
  ],
});

// ---- Results ----
const results = [
  ['2.8 HS GPA', 'New York University'],
  ['3.0 HS GPA · Test Optional', 'Cornell, Emory, Boston University, Michigan, Georgia (Full Merit), UVA, Boston College'],
  ['3.2 HS GPA', 'Michigan, NYU, University of Virginia'],
  ['3.2 HS GPA · Test Optional', 'UVA, NYU, USC, Michigan, UT Austin'],
  ['3.3 HS GPA · C in Calc', 'UVA (Merit), NYU, U Miami (Presidential Scholarship)'],
  ['3.5 HS GPA', 'Columbia, Cornell, NYU'],
  ['3.4 HS GPA', 'UChicago, Emory, WashU, NYU'],
  ['Rutgers · Transfer', 'Northwestern, Georgetown'],
  ['UIUC · Transfer', 'USC, Tufts, Colgate'],
  ['Boston University · Transfer', 'Notre Dame, Georgetown, NYU (Stern), Boston College'],
  ['University of Toronto · Transfer', 'Vanderbilt, Georgia Tech'],
  ['Bentley · Transfer', 'Cornell, Emory, Northwestern, UNC Chapel Hill'],
  ['Top-300 School · Transfer', 'UT Austin, Texas A&M'],
];
const cell = (children, w, shade) => new TableCell({
  width: { size: w, type: WidthType.DXA },
  margins: { top: 70, bottom: 70, left: 130, right: 130 },
  verticalAlign: VerticalAlign.CENTER,
  shading: shade ? { type: ShadingType.CLEAR, fill: shade } : undefined,
  borders: { top: { style: BorderStyle.SINGLE, size: 2, color: LINE }, bottom: { style: BorderStyle.SINGLE, size: 2, color: LINE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
  children,
});
const resultsTable = new Table({
  width: { size: CW, type: WidthType.DXA }, columnWidths: [2900, 6460],
  rows: [
    new TableRow({ tableHeader: true, children: [
      cell([new Paragraph({ children: [sans('STARTED WITH', { bold: true, color: 'FFFFFF', size: 16, characterSpacing: 20 })] })], 2900, NAVY),
      cell([new Paragraph({ children: [sans('ADMITTED TO', { bold: true, color: 'FFFFFF', size: 16, characterSpacing: 20 })] })], 6460, NAVY),
    ]}),
    ...results.map(([a, b], i) => new TableRow({ children: [
      cell([new Paragraph({ children: [serif(a, { bold: true, color: NAVY, size: 19 })] })], 2900, i % 2 ? CREAM : 'FFFFFF'),
      cell([new Paragraph({ children: [sans(b, { color: INK, size: 19 })] })], 6460, i % 2 ? CREAM : 'FFFFFF'),
    ]})),
  ],
});

// ---- Stats row ----
const stat = (big, small) => cell([
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 30 }, children: [serif(big, { bold: true, color: CRIMSON, size: 44 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [sans(small, { color: GREY, size: 16 })] }),
], 2340, CREAM);
const statsTable = new Table({
  width: { size: CW, type: WidthType.DXA }, columnWidths: [2340, 2340, 2340, 2340],
  rows: [new TableRow({ children: [
    stat('2.8', 'Lowest GPA we’ve placed (into NYU)'),
    stat('44', 'Top-30 acceptances on record'),
    stat('5.0★', 'Average rating from clients'),
    stat('1 yr', 'Typical time to transfer up'),
  ]})],
});

// ---- Services ----
const services = [
  ['Application strategy & school targeting. ', 'A custom list and game plan built around your major, goals, and odds, not a template.'],
  ['Narrative & story building. ', 'We build your story from scratch so your application reads as a person, not a transcript.'],
  ['Essay writing & coaching. ', 'Every essay in your application, with unlimited revision rounds until each one is right.'],
  ['Extracurricular development. ', 'We help you build high-impact activities and leadership fast, then position them.'],
  ['Recommendation letters & LOCIs. ', 'Guidance on who to ask, how to brief them, and letters of continued interest.'],
  ['Interview & portal support. ', 'Interview prep and application-portal checks so nothing slips through the cracks.'],
  ['24/7 access for 12 months. ', 'Direct text access plus weekly one-on-one calls for a full transfer cycle.'],
  ['Unlimited applications. ', 'As many schools as your strategy calls for, all handled within the program.'],
];

// ---- Build ----
const logo = fs.readFileSync('public/logotransferringup.png');

const bbbBadge = new Table({
  width: { size: 4200, type: WidthType.DXA }, columnWidths: [4200], alignment: AlignmentType.CENTER,
  rows: [new TableRow({ children: [new TableCell({
    width: { size: 4200, type: WidthType.DXA }, margins: { top: 110, bottom: 110, left: 120, right: 120 },
    shading: { type: ShadingType.CLEAR, fill: '00205B' },
    borders: { top: { style: BorderStyle.SINGLE, size: 6, color: '00205B' }, bottom: { style: BorderStyle.SINGLE, size: 6, color: '00205B' }, left: { style: BorderStyle.SINGLE, size: 6, color: '00205B' }, right: { style: BorderStyle.SINGLE, size: 6, color: '00205B' } },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, children: [sans('BBB  ACCREDITED  BUSINESS', { bold: true, color: 'FFFFFF', size: 22, characterSpacing: 30 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 30 }, children: [sans('A+  RATING', { bold: true, color: 'FFFFFF', size: 18, characterSpacing: 40 })] }),
    ],
  })]})],
});

const doc = new Document({
  numbering: { config: [{ reference: 'feat', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { run: { color: CRIMSON }, paragraph: { indent: { left: 360, hanging: 220 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1300, right: 1440, bottom: 1300, left: 1440 } } },
    children: [
      // Header / cover
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new ImageRun({ type: 'png', data: logo, transformation: { width: 78, height: 78 }, altText: { title: 'TransferringUP', description: 'TransferringUP logo', name: 'logo' } })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 30 }, children: [serif('TRANSFERRING UP', { bold: true, color: NAVY, size: 40, characterSpacing: 40 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [sans('Premium, Extremely Personalized Transfer & Admissions Consulting', { color: GREY, size: 19 })] }),
      rule(GOLD, 12),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 30 }, children: [serif('Prepared for Aryan', { italics: true, color: CRIMSON, size: 26 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [sans('Your personalized plan, our results, and how we’d help you get in.', { color: GREY, size: 18 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [] }),

      // A note for you
      eyebrow('A note for you, Aryan'),
      body('Most admissions help polishes students who are already winning. We do the opposite. From low GPAs and community college to strong students aiming higher, we build transfer applications that land at top-30 schools, often in a single year.'),
      body('This is not a course or a template. It is a one-on-one, done-with-you partnership built entirely around your goals, your story, and the schools you actually want. The pages that follow show our founder’s story, exactly what we do, our track record, and what our students say. Then we’ll map it to you.'),

      // Founder story
      rule(LINE, 8),
      eyebrow('The story behind Transferring Up'),
      h2('From a 1.25 GPA to Cornell.'),
      body('Freshman year of high school, our founder Ajay had a 1.25 GPA and ranked 399 of 411. A trip to India, where he watched family survive on less than a dollar a day, snapped him out of it. He came back and started grinding, but by senior year his GPA was still a 2.9, and he was rejected from schools with 87% acceptance rates.'),
      body('From April to August, he obsessed over the transfer process: old applications, forums, a blueprint. He pulled a 4.0 at community college, built real extracurriculars, and in a single year earned acceptances to Cornell, UVA, Michigan, NYU, and USC. Then he turned that path into a repeatable system, and a team of people who have done the same.'),

      // What we do
      new Paragraph({ children: [new PageBreak()] }),
      eyebrow('What we do'),
      h2('Everything you need to transfer up, tailored to you.'),
      body('Every student gets the full system below, customized to their situation. Nothing is one-size-fits-all.'),
      ...services.map(([a, b]) => bullet(a, b)),

      // Track record
      rule(LINE, 8),
      eyebrow('The track record'),
      h2('Real students. Real results.'),
      new Paragraph({ spacing: { after: 160 }, children: [] }),
      statsTable,
      new Paragraph({ spacing: { before: 200, after: 120 }, children: [sans('Selected acceptances on record (presented without names for privacy):', { color: GREY, size: 18, italics: true })] }),
      resultsTable,

      // Reviews
      new Paragraph({ children: [new PageBreak()] }),
      eyebrow('In their words'),
      h2('What our students say.'),
      ...reviews.map(reviewBlock),

      // Accreditation
      rule(LINE, 8),
      eyebrow('Accredited & trusted'),
      new Paragraph({ spacing: { after: 140 }, children: [sans('TransferringUP is a Better Business Bureau Accredited Business with an A+ rating, our commitment to transparency, responsiveness, and doing right by every student.', { color: INK, size: 21 })] }),
      bbbBadge,

      // The team
      rule(LINE, 8),
      eyebrow('The team'),
      h2('Coached by people who made the move.'),
      body('You work directly with Ajay (Cornell), alongside Caleb (University of Chicago), Sahaj (Cornell, first-year admissions), and a team of consultants who transferred into top-25 schools themselves, including Cornell, Vanderbilt, Notre Dame, and more. You get people who have actually done it.'),

      // Next step
      rule(GOLD, 12),
      eyebrow('Your next step, Aryan'),
      h2('Let’s build your plan.'),
      body('On a strategy consultation, we’ll map your exact path: where you stand, the schools to target, and how we’d get you in. It is a private, one-on-one session built around your case, not generic advice.'),
      new Paragraph({ spacing: { before: 60, after: 30 }, children: [sans('Book your consultation:  ', { bold: true, color: NAVY, size: 21 }), sans('transferringup.com/get-started', { color: CRIMSON, size: 21 })] }),
      new Paragraph({ spacing: { after: 30 }, children: [sans('Email:  ', { bold: true, color: NAVY, size: 21 }), sans('ajay@transferringup.com', { color: INK, size: 21 })] }),
      new Paragraph({ spacing: { after: 30 }, children: [sans('Call or text:  ', { bold: true, color: NAVY, size: 21 }), sans('(980) 248-9218', { color: INK, size: 21 })] }),
      new Paragraph({ spacing: { before: 220 }, alignment: AlignmentType.CENTER, children: [sans('TransferringUP · Specialist transfer admissions for the students the system overlooked.', { color: GREY, size: 15 })] }),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  const out = require('os').homedir() + '/Downloads/TransferringUP-Proposal-Aryan.docx';
  fs.writeFileSync(out, buf);
  console.log('WROTE', out, (buf.length / 1024).toFixed(0) + ' KB');
});
