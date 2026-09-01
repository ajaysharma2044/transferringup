/* Builds the TransferringUP proposal for Aryan as print-HTML that matches the
 * live site 1:1 (Fraunces + Inter, navy/crimson/gold tokens, white-circle
 * crests, the editorial results ledger). Fonts + logos are embedded so the
 * file is self-contained, then rendered to PDF via headless Chrome.
 *
 * Layout principle: content FLOWS continuously through margined pages so every
 * page fills densely (no half-empty voids). Only the cover + closing are
 * full-bleed navy pages. Atomic blocks carry break-inside:avoid; headings carry
 * break-after:avoid so nothing strands at a page bottom. */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

/* ----- exact design tokens (src/components/home/shared.tsx) ----- */
const TU = {
  navy: '#0F1C2E', navyDeep: '#0A1520', cream: '#F8F4EE', offwhite: '#F3F5F0',
  crimson: '#7A0000', gold: '#D4AA00', ink: '#20242B', grey: '#55606E',
};

/* ----- school registry (src/data/results.ts) ----- */
const SCHOOL_BRAND = {
  cornell: { full: 'Cornell University', color: '#B31B1B' },
  columbia: { full: 'Columbia University', color: '#1C6BB0' },
  jhu: { full: 'Johns Hopkins University', color: '#002D72' },
  rice: { full: 'Rice University', color: '#00205B' },
  stanford: { full: 'Stanford University', color: '#8C1515' },
  upenn: { full: 'University of Pennsylvania (M&T)', color: '#011F5B' },
  michigan: { full: 'University of Michigan', color: '#C8930A' },
  nyu: { full: 'New York University', color: '#57068C' },
  uva: { full: 'University of Virginia', color: '#E57200' },
  usc: { full: 'University of Southern California', color: '#990000' },
  northwestern: { full: 'Northwestern University', color: '#4E2A84' },
  georgetown: { full: 'Georgetown University', color: '#1C5BA0' },
  emory: { full: 'Emory University', color: '#012169' },
  bc: { full: 'Boston College', color: '#8C2232' },
  bu: { full: 'Boston University', color: '#CC0000' },
  uga: { full: 'University of Georgia', color: '#BA0C2F' },
  umiami: { full: 'University of Miami', color: '#005030' },
  utaustin: { full: 'University of Texas at Austin', color: '#BF5700' },
  tamu: { full: 'Texas A&M University', color: '#500000' },
  tufts: { full: 'Tufts University', color: '#3E8EDE' },
  colgate: { full: 'Colgate University', color: '#821019' },
  rutgers: { full: 'Rutgers University', color: '#CC0033' },
  uiuc: { full: 'University of Illinois Urbana-Champaign', color: '#E84A27' },
  vanderbilt: { full: 'Vanderbilt University', color: '#8E6F2E' },
  uchicago: { full: 'University of Chicago', color: '#800000' },
  washu: { full: 'Washington University in St. Louis', color: '#A51417' },
  notredame: { full: 'University of Notre Dame', color: '#9C7A1E' },
  unc: { full: 'UNC Chapel Hill', color: '#4B9CD3' },
  gatech: { full: 'Georgia Tech', color: '#0C5288' },
};
const brand = (k) => SCHOOL_BRAND[k] || { full: k, color: TU.navy };
const PUBLIC = new Set(['michigan', 'uva', 'utaustin', 'rutgers', 'uiuc', 'unc', 'gatech']);

const RESULTS = [
  { start: '2.8 HS GPA', schools: [{ key: 'nyu' }] },
  { start: '3.0 HS GPA', note: 'Test Optional', schools: [{ key: 'cornell' }, { key: 'emory' }, { key: 'bu' }, { key: 'michigan' }, { key: 'uga', note: 'Full Merit Scholarship' }, { key: 'uva' }, { key: 'bc' }] },
  { start: '3.2 HS GPA', schools: [{ key: 'michigan' }, { key: 'nyu' }, { key: 'uva' }] },
  { start: '3.2 HS GPA', note: 'Test Optional', schools: [{ key: 'uva' }, { key: 'nyu' }, { key: 'usc' }, { key: 'michigan' }, { key: 'utaustin' }] },
  { start: '3.3 HS GPA', note: 'C in Calc', schools: [{ key: 'uva', note: 'Merit Scholarship' }, { key: 'nyu' }, { key: 'umiami', note: 'Presidential Scholarship' }] },
  { start: '3.5 HS GPA', schools: [{ key: 'columbia' }, { key: 'cornell' }, { key: 'nyu' }] },
  { start: 'Rutgers', note: 'Transfer', schools: [{ key: 'northwestern' }, { key: 'georgetown' }] },
  { start: 'UIUC', note: 'Transfer', schools: [{ key: 'usc' }, { key: 'tufts' }, { key: 'colgate' }] },
  { start: '3.3 HS GPA', schools: [{ key: 'usc' }] },
  { start: 'Boston University', note: 'Transfer', schools: [{ key: 'notredame' }, { key: 'georgetown' }, { key: 'nyu', note: 'Stern' }, { key: 'bc' }] },
  { start: 'U of Toronto', note: 'Transfer', schools: [{ key: 'vanderbilt' }, { key: 'gatech' }] },
  { start: '3.4 HS GPA', schools: [{ key: 'uchicago' }, { key: 'emory' }, { key: 'washu' }, { key: 'nyu' }] },
  { start: 'Bentley', note: 'Transfer', schools: [{ key: 'cornell' }, { key: 'emory' }, { key: 'northwestern' }, { key: 'unc' }] },
  { start: 'Top-300 School', note: 'Transfer', schools: [{ key: 'utaustin', inState: true }, { key: 'tamu' }] },
];

/* ----- logo sources (src/components/home/Team.tsx LOGO map) ----- */
const ESPN = (id) => `https://a.espncdn.com/i/teamlogos/ncaa/500/${id}.png`;
const LOGO_SRC = {
  cornell: ESPN(172), columbia: ESPN(171), vanderbilt: ESPN(238), michigan: ESPN(130),
  usc: ESPN(30), rice: ESPN(242), utaustin: ESPN(251), stanford: ESPN(24), upenn: ESPN(219),
  notredame: ESPN(87), georgetown: ESPN(46), northwestern: ESPN(77), gatech: ESPN(59),
  unc: ESPN(153), uva: ESPN(258), tamu: ESPN(245), bc: ESPN(103),
  nyu: path.join(ROOT, 'public/NYU-Symbol.png'),
  uchicago: path.join(ROOT, 'public/uchicago-logo.png'),
  washu: path.join(ROOT, 'public/washu-logo.png'),
};
const SHORT = {
  cornell: 'Cornell', columbia: 'Columbia', jhu: 'JHU', vanderbilt: 'Vanderbilt', michigan: 'Michigan',
  rice: 'Rice', utaustin: 'UT Austin', stanford: 'Stanford', upenn: 'Penn', nyu: 'NYU', usc: 'USC',
  uchicago: 'UChicago', emory: 'Emory', washu: 'WashU', notredame: 'Notre Dame', georgetown: 'Georgetown',
  northwestern: 'Northwestern', gatech: 'Georgia Tech', unc: 'UNC', uva: 'UVA', tamu: 'Texas A&M', bc: 'Boston College',
};

/* ----- reviews (3 BBB-verified + 4 site) ----- */
const REVIEWS = [
  { n: 'Shelly B.', t: 'BBB Verified Review', bbb: true, s: `Working with Ajay was one of the best decisions I made during the college application process. He is incredibly knowledgeable, strategic, and genuinely invested in his students' success. What sets Ajay apart is his ability to create a personalized plan based on each student's goals rather than using a one-size-fits-all approach. He helped me understand the transfer and admissions process, strengthened my application, and provided guidance every step of the way.` },
  { n: 'Rishabh P.', t: 'BBB Verified Review', bbb: true, s: `Very attentive to detail and always responded quickly to me. Carefully planned everything out and made sure I stayed on track to successfully get admitted.` },
  { n: 'Mathew Z.', t: 'BBB Verified Review', bbb: true, s: `Went through Ajay and he helped me out a lot through the transfer process. Especially regarding my essays, he felt very chill, as if he were my older brother, and helped me during the stressful times.` },
  { n: 'Samanyu', t: 'UC Riverside to UVA', s: `Coming out of high school, I had a 3.2 and thought it'd be impossible to transfer in just one year. TransferringUp reassured me and made me feel secure of the entire procedure. From creating an entire narrative for my application to calls every other day, they were very caring. I loved having their number and having them accessible 24/7. When that first NYU acceptance rolled through, it felt like all the weight on my shoulders just dissipated.` },
  { n: 'Adam', t: 'Indiana University to Cornell', s: `TransferringUp really helped me figure out how to properly approach my academic endeavors, as I needed hands-on support throughout the process. Ajay and his team were very successful in ensuring that my college career could outshine what I had accomplished in high school. When I saw that I got into Cornell, I was beyond excited. I give a lot of props to the long phone calls and hours of help I received.` },
  { n: 'Brody', t: 'Keuka College to UVA', s: `Transferring was a process I committed to early; the issue was that I had no direction. That's where Ajay came in. Coming out of high school I had a 3.3 GPA and a C in Calc 1, which is why I thought I wouldn't be able to transfer. Ajay walked me through each step of building up my extracurriculars. My first acceptance was Tulane, then NYU, then U Miami with a merit scholarship, and finally UVA with a merit scholarship.` },
  { n: 'Yash', t: 'Drexel University to Michigan', s: `Everyone told me transferring to Michigan was impossible with a 3.2 high-school GPA, especially for Computer Science. TransferringUp didn't just reassure me; they walked me through building my profile from scratch and writing essays that actually told my story instead of listing my stats. When the Michigan acceptance came through, it didn't feel real.` },
];

/* ----- the three differentiators (what the proposal leads on) ----- */
const PILLARS = [
  ['Hyper-personalized', 'One student at a time.',
    'We take a limited number of students so every plan is built from scratch around you, your major, your GPA, your story, and the exact schools you want. There is no template, no recycled essay, no generic tier list. We study your situation and build the strategy that actually fits it.'],
  ['Unlimited access', "We're one text away.",
    'You get a direct line to us, 24/7, for your entire cycle. Text us anytime: a question at 11pm, a panic the night before a deadline, "should I add this school," "is this paragraph working." Plus weekly one-on-one calls. No ticket queue, no waiting days for a reply, you reach a real person who already knows your application.'],
  ['Profile building', 'We build it with you, not just edit it.',
    'Most consultants polish what you already have. We help you create what you are missing. We guide you in building high-impact extracurriculars from the ground up, passion projects, nonprofits, research, leadership, then position them so admissions sees real impact. This is often the difference between a maybe and a yes.'],
];

/* ----- everything included (distinct, no repeated filler) ----- */
const INCLUDED = [
  'Custom school list & application strategy',
  'Narrative & storytelling, built from scratch',
  'Personal statement, fully developed',
  'Every supplemental & "why us" essay',
  'Unlimited revisions on every essay',
  'Extracurricular & passion-project building',
  'Resume & activities list',
  'Recommendation letters & LOCI guidance',
  'Major selection & positioning',
  'Interview preparation',
  'Application, portal & deadline management',
  'Scholarship & merit-aid positioning',
  'Unlimited applications, as many as your plan needs',
  '24/7 access & weekly 1:1 calls for the full cycle',
];

/* ===================== asset embedding ===================== */
async function fetchBuf(url, ms = 15000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36' } });
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch { return null; } finally { clearTimeout(t); }
}
const dataUri = (buf, mime) => `data:${mime};base64,${buf.toString('base64')}`;

async function embedLogos() {
  const out = {};
  for (const [key, src] of Object.entries(LOGO_SRC)) {
    try {
      if (src.startsWith('http')) {
        const buf = await fetchBuf(src);
        if (buf && buf.length > 200) out[key] = dataUri(buf, 'image/png');
        else console.warn('  ! logo failed:', key);
      } else out[key] = dataUri(fs.readFileSync(src), 'image/png');
    } catch (e) { console.warn('  ! logo error:', key, e.message); }
  }
  return out;
}

async function embedFonts() {
  const cssUrl = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,300..700&family=Inter:wght@300;400;500;600;700&family=Pinyon+Script&display=swap';
  const cssBuf = await fetchBuf(cssUrl);
  if (!cssBuf) { console.warn('  ! font CSS fetch failed; PDF will use fallbacks'); return ''; }
  const css = cssBuf.toString('utf8');
  const blocks = css.split('@font-face').slice(1);
  let outCss = '';
  for (const blk of blocks) {
    const body = '@font-face' + blk.slice(0, blk.indexOf('}') + 1);
    const urlMatch = body.match(/url\((https:[^)]+\.woff2)\)/);
    if (!urlMatch) continue;
    const before = css.indexOf(body);
    const comment = css.lastIndexOf('/*', before);
    const subset = css.slice(comment, before).replace(/[/*]/g, '').trim();
    if (!/^latin/.test(subset)) continue;
    const wbuf = await fetchBuf(urlMatch[1]);
    if (!wbuf) continue;
    outCss += body.replace(urlMatch[0], `url(${dataUri(wbuf, 'font/woff2')}) format('woff2')`) + '\n';
  }
  return outCss;
}

/* ===================== HTML pieces ===================== */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function crest(key, logos, size = 50) {
  const inner = logos[key]
    ? `<img src="${logos[key]}" alt="${esc(brand(key).full)}" style="height:${Math.round(size * 0.6)}px;width:${Math.round(size * 0.6)}px;object-fit:contain"/>`
    : `<span style="font-family:'Fraunces',serif;font-weight:700;font-size:${size * 0.26}px;color:${TU.navy}">${esc(SHORT[key] || key.toUpperCase())}</span>`;
  return `<span class="crest" style="width:${size}px;height:${size}px">${inner}</span>`;
}

function logoWall(logos) {
  const order = ['cornell', 'columbia', 'michigan', 'uchicago', 'vanderbilt', 'usc', 'stanford', 'upenn', 'rice', 'utaustin', 'nyu', 'notredame', 'georgetown', 'northwestern', 'gatech', 'unc', 'uva', 'washu', 'tamu', 'bc'];
  return order.map((k) => `<div class="wallitem">${crest(k, logos, 52)}<div class="wallname">${esc(SHORT[k] || k)}</div></div>`).join('');
}

function resultsLedger() {
  return RESULTS.map((r) => {
    const isGpa = /HS GPA/.test(r.start);
    const value = isGpa ? r.start.replace(/\s*HS GPA.*/, '') : r.start;
    const label = isGpa ? `HS GPA${r.note ? ' &middot; ' + esc(r.note) : ''}` : (r.note || 'Transfer');
    const schools = r.schools.map((s) => {
      const b = brand(s.key);
      const annos = [];
      if (PUBLIC.has(s.key) && !s.inState) annos.push({ label: 'Out of State', color: '#3D4D66' });
      if (s.note) annos.push({ label: s.note, color: /scholarship/i.test(s.note) ? '#9A7B1F' : b.color });
      const tags = annos.map((a) => `<span class="anno" style="color:${a.color}"><i style="background:${a.color}"></i>${esc(a.label).toUpperCase()}</span>`).join('');
      return `<div class="schoolrow"><span class="schoolname" style="color:${b.color}">${esc(b.full)}</span>${tags ? `<span class="annos">${tags}</span>` : ''}</div>`;
    }).join('');
    return `<div class="ledrow"><div class="ledstart"><span class="ledval" style="font-size:${isGpa ? '32px' : '20px'}">${esc(value)}</span><span class="ledlabel">${label}</span></div><div class="ledschools">${schools}</div></div>`;
  }).join('');
}

const review = (r) => `<div class="review"><div class="rhead"><span class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span><span class="rname">${esc(r.n)}</span>${r.bbb ? '<span class="bbbtag">BBB&nbsp;VERIFIED</span>' : `<span class="rtag">${esc(r.t)}</span>`}</div><p class="rbody">&ldquo;${esc(r.s)}&rdquo;</p></div>`;

const pillar = (p, i) => `<div class="pillar"><div class="pnum">${i + 1}</div><div><div class="peyebrow">${esc(p[0])}</div><div class="ptitle">${esc(p[1])}</div><div class="pbody">${esc(p[2])}</div></div></div>`;

function featuredCard(photo, name, role, school, line, crests, logos, helped) {
  const crow = crests.map((k) => crest(k, logos, 42)).join('');
  const hrow = helped && helped.length ? `<div class="cred-sub">Helped students into</div><div class="crests">${helped.map((k) => crest(k, logos, 42)).join('')}</div>` : '';
  const head = photo ? `<img class="fphoto" src="${photo}" alt="${esc(name)}"/>` : '';
  return `<div class="fcard">${head}<div class="fname">${esc(name)}</div><div class="frole">${esc(role)}</div><div class="fschool" style="color:${brand(school).color}">${esc(brand(school).full)}</div><div class="cred-sub">${esc(line)}</div><div class="crests">${crow}</div>${hrow}</div>`;
}

/* ===================== build ===================== */
(async () => {
  console.log('Embedding fonts...');
  const fontCss = await embedFonts();
  console.log('Embedding logos...');
  const logos = await embedLogos();
  const tuLogo = dataUri(fs.readFileSync(path.join(ROOT, 'public/logotransferringup.png')), 'image/png');
  const photo = {
    ajay: dataUri(fs.readFileSync(path.join(ROOT, 'public/ajay-linkedin.jpg')), 'image/jpeg'),
    caleb: dataUri(fs.readFileSync(path.join(ROOT, 'public/caleb-hong.jpg')), 'image/jpeg'),
    sahaj: dataUri(fs.readFileSync(path.join(ROOT, 'public/sahaj-satani.webp')), 'image/webp'),
  };

  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/>
<style>
${fontCss}
*{ margin:0; padding:0; box-sizing:border-box; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
:root{ --navy:${TU.navy}; --crimson:${TU.crimson}; --gold:${TU.gold}; --golddeep:#9A7B1F; --ink:#1B2230; --grey:${TU.grey}; }
html{ font-family:'Inter',-apple-system,sans-serif; color:var(--ink); font-size:14px; }
@page{ size:Letter; margin:15mm 16mm 16mm; }
@page cover{ margin:0; }
.fullbleed{ page:cover; width:8.5in; height:11in; }
.serif{ font-family:'Fraunces',Georgia,serif; }

/* full-bleed cover + closing */
.cover{ background:${TU.navyDeep}; color:#F3F5F0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; position:relative; break-after:page; }
.coverframe{ position:absolute; inset:26px; border:1px solid rgba(212,170,0,.5); pointer-events:none; }
.coverframe2{ position:absolute; inset:31px; border:1px solid rgba(212,170,0,.2); pointer-events:none; }
.cover .logo{ width:74px; height:74px; border-radius:18px; margin-bottom:24px; }
.cover .word{ font-family:'Fraunces',serif; font-weight:700; font-size:42px; letter-spacing:.14em; color:#fff; }
.cover .cline{ font-size:10.5px; letter-spacing:.34em; text-transform:uppercase; color:rgba(243,245,240,.55); margin-top:14px; }
.cover .grule{ width:50px; height:2px; background:var(--gold); margin:34px 0 30px; }
.cover .prep{ font-size:10px; letter-spacing:.3em; text-transform:uppercase; color:var(--gold); margin-bottom:10px; }
.cover .prepared{ font-family:'Fraunces',serif; font-style:italic; font-weight:500; font-size:50px; color:#fff; line-height:1; }
.cover .sub{ font-size:13px; color:rgba(243,245,240,.6); margin-top:18px; max-width:420px; line-height:1.65; }
.cover .foot{ position:absolute; bottom:46px; font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:rgba(243,245,240,.45); }

/* premium primitives */
.shead{ display:flex; gap:16px; align-items:flex-start; margin-bottom:14px; break-after:avoid; }
.secnum{ font-family:'Fraunces',serif; font-weight:700; font-size:34px; line-height:.82; color:var(--golddeep); flex-shrink:0; }
.letter p.lead::first-letter{ font-family:'Fraunces',serif; font-weight:700; font-size:56px; float:left; line-height:.78; padding:6px 11px 0 0; color:var(--navy); }
.sig{ font-family:'Pinyon Script',cursive; font-size:42px; color:var(--navy); line-height:.9; margin-top:18px; }
.signame{ font-size:12px; font-weight:700; letter-spacing:.03em; color:var(--navy); margin-top:8px; }
.sigrole{ font-size:11px; color:var(--grey); margin-top:1px; }
.pull{ text-align:center; margin:8px auto 4px; max-width:560px; break-inside:avoid; }
.pull .mark{ font-family:'Fraunces',serif; font-size:42px; color:var(--golddeep); line-height:0; display:block; height:24px; }
.pull .q{ font-family:'Fraunces',serif; font-weight:500; font-style:italic; font-size:22px; line-height:1.38; color:var(--navy); }
.pull .rule{ width:46px; height:2px; background:var(--gold); margin:16px auto 0; }
.step{ display:flex; gap:15px; padding:13px 0; border-bottom:1px solid rgba(15,28,46,.1); break-inside:avoid; }
.step:last-child{ border-bottom:none; }
.stepnum{ font-family:'Fraunces',serif; font-weight:700; font-size:16px; color:var(--golddeep); flex-shrink:0; width:24px; }
.steph{ font-family:'Fraunces',serif; font-weight:700; font-size:16px; color:var(--navy); margin-bottom:4px; }
.stepb{ font-size:12.5px; line-height:1.55; color:var(--grey); }

/* flow scaffolding */
.eyebrow{ font-size:11px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:var(--crimson); margin-bottom:9px; break-after:avoid; }
h2.sec{ font-family:'Fraunces',serif; font-weight:700; font-size:28px; color:var(--navy); letter-spacing:-.01em; line-height:1.08; margin-bottom:13px; break-after:avoid; }
p.body{ font-size:13.5px; line-height:1.62; color:var(--ink); margin-bottom:10px; max-width:660px; }
.block{ margin-bottom:30px; }
.hr{ height:1px; background:rgba(15,28,46,.12); margin:0 0 30px; }
.goldrule{ width:54px; height:2px; background:var(--gold); border-radius:1px; margin-bottom:15px; break-after:avoid; }

.crest{ display:inline-flex; align-items:center; justify-content:center; background:#fff; border:1px solid rgba(15,28,46,.14); border-radius:50%; flex-shrink:0; }

/* stats band */
.stats{ display:grid; grid-template-columns:repeat(4,1fr); gap:13px; }
.stat{ background:${TU.cream}; border:1px solid rgba(15,28,46,.08); border-radius:12px; padding:16px 12px; text-align:center; break-inside:avoid; }
.stat .big{ font-family:'Fraunces',serif; font-weight:700; font-size:32px; color:var(--crimson); line-height:1; }
.stat .small{ font-size:10px; color:var(--grey); margin-top:7px; line-height:1.4; }

/* pillars */
.pillar{ display:flex; gap:16px; padding:16px 0; border-bottom:1px solid rgba(15,28,46,.1); break-inside:avoid; }
.pillar:last-child{ border-bottom:none; }
.pnum{ font-family:'Fraunces',serif; font-weight:700; font-size:22px; color:#fff; background:var(--navy); width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.peyebrow{ font-size:10px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--gold); filter:saturate(.85) brightness(.78); margin-bottom:3px; }
.ptitle{ font-family:'Fraunces',serif; font-weight:700; font-size:18px; color:var(--navy); margin-bottom:6px; }
.pbody{ font-size:12.5px; line-height:1.55; color:var(--grey); }

/* included checklist */
.included{ display:grid; grid-template-columns:1fr 1fr; gap:8px 26px; margin-top:4px; }
.incl{ display:flex; gap:9px; align-items:flex-start; break-inside:avoid; }
.incl .ck{ color:var(--crimson); font-weight:700; font-size:13px; line-height:1.5; flex-shrink:0; }
.incl span.t{ font-size:12.5px; line-height:1.5; color:var(--ink); }

/* investment */
.invest{ display:flex; align-items:center; gap:26px; background:var(--navy); color:#fff; border-radius:14px; padding:22px 28px; break-inside:avoid; }
.invest .price{ font-family:'Fraunces',serif; font-weight:700; font-size:46px; line-height:1; color:#fff; white-space:nowrap; }
.invest .pcap{ font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:var(--gold); margin-top:6px; }
.invest .pright{ border-left:1px solid rgba(255,255,255,.18); padding-left:24px; }
.invest .pr-h{ font-family:'Fraunces',serif; font-weight:600; font-size:16px; margin-bottom:5px; }
.invest .pr-b{ font-size:12px; line-height:1.55; color:rgba(243,245,240,.78); }

/* logo wall */
.wall{ display:grid; grid-template-columns:repeat(5,1fr); gap:16px 8px; }
.wallitem{ display:flex; flex-direction:column; align-items:center; gap:7px; break-inside:avoid; }
.wallname{ font-size:9px; font-weight:600; letter-spacing:.03em; color:var(--navy); opacity:.6; }

/* results ledger */
.ledger{ column-count:2; column-gap:44px; border-top:1px solid rgba(15,28,46,.14); }
.ledrow{ break-inside:avoid; display:grid; grid-template-columns:96px 1fr; gap:16px; padding:13px 0; border-bottom:1px solid rgba(15,28,46,.1); align-items:baseline; }
.ledval{ font-family:'Fraunces',serif; font-weight:700; color:var(--navy); line-height:1; display:block; }
.ledlabel{ font-size:8px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:var(--navy); opacity:.42; margin-top:5px; display:block; }
.ledschools{ display:flex; flex-direction:column; gap:6px; }
.schoolrow{ display:flex; flex-wrap:wrap; align-items:baseline; gap:3px 10px; }
.schoolname{ font-family:'Fraunces',serif; font-weight:600; font-size:13.5px; line-height:1.2; }
.annos{ display:inline-flex; flex-direction:column; gap:3px; margin-left:auto; align-items:flex-end; }
.anno{ display:inline-flex; align-items:center; gap:5px; font-size:7.5px; font-weight:700; letter-spacing:.12em; white-space:nowrap; }
.anno i{ width:1px; height:8px; opacity:.45; display:inline-block; }

/* reviews */
.reviews{ column-count:2; column-gap:20px; }
.review{ break-inside:avoid; background:${TU.cream}; border-left:3px solid var(--gold); border-radius:0 8px 8px 0; padding:12px 14px; margin-bottom:13px; }
.rhead{ display:flex; align-items:center; flex-wrap:wrap; gap:7px; margin-bottom:6px; }
.stars{ color:var(--gold); font-size:11px; letter-spacing:1px; }
.rname{ font-family:'Fraunces',serif; font-weight:700; font-size:13.5px; color:var(--navy); }
.rtag{ font-size:9px; font-style:italic; color:var(--grey); }
.bbbtag{ font-size:8px; font-weight:700; letter-spacing:.07em; color:#fff; background:#00205B; padding:2px 6px; border-radius:4px; }
.rbody{ font-size:11px; line-height:1.55; color:var(--ink); }

/* bbb inline */
.bbbrow{ display:flex; align-items:center; gap:18px; background:${TU.cream}; border:1px solid rgba(15,28,46,.1); border-radius:12px; padding:16px 20px; margin-top:6px; break-inside:avoid; }
.bbbbox{ display:inline-flex; flex-direction:column; align-items:center; background:#00205B; color:#fff; border-radius:9px; padding:12px 22px; flex-shrink:0; }
.bbbbox .l1{ font-weight:700; font-size:13px; letter-spacing:.1em; }
.bbbbox .l2{ font-size:10px; letter-spacing:.2em; margin-top:4px; opacity:.9; }
.bbbtxt{ font-size:12.5px; line-height:1.55; color:var(--ink); }

/* team */
.fgrid{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
.fcard{ border:1px solid rgba(15,28,46,.12); border-radius:14px; padding:16px 15px; break-inside:avoid; }
.fphoto{ width:62px; height:62px; border-radius:50%; object-fit:cover; object-position:center top; border:1px solid rgba(15,28,46,.14); margin-bottom:12px; display:block; }
.fname{ font-family:'Fraunces',serif; font-weight:700; font-size:19px; color:var(--navy); }
.frole{ font-size:9px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--crimson); margin-top:5px; }
.fschool{ font-family:'Fraunces',serif; font-weight:600; font-size:13.5px; margin-top:6px; }
.cred-sub{ font-size:10px; color:var(--navy); opacity:.55; margin-top:11px; }
.crests{ display:flex; flex-wrap:wrap; gap:7px; margin-top:8px; }
.rostergrid{ display:grid; grid-template-columns:repeat(3,1fr); gap:5px 16px; margin-top:14px; }
.rosteritem{ font-size:11px; color:var(--ink); padding:3px 0; }
.rosteritem b{ font-family:'Fraunces',serif; color:var(--navy); font-weight:600; }
.rosteritem span{ color:var(--grey); }

/* closing */
.closing{ background:${TU.navyDeep}; color:#F3F5F0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; position:relative; break-before:page; }
.closing .clogo{ width:64px; height:64px; border-radius:15px; margin-bottom:30px; }
.closing .ce{ font-size:11px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:var(--gold); margin-bottom:14px; }
.closing h2{ font-family:'Fraunces',serif; font-weight:700; font-size:38px; color:#fff; margin-bottom:16px; }
.closing p{ font-size:13.5px; line-height:1.6; color:rgba(243,245,240,.72); max-width:440px; margin-bottom:26px; }
.closing .priceline{ font-family:'Fraunces',serif; font-size:22px; color:#fff; margin-bottom:30px; }
.closing .priceline b{ color:var(--gold); }
.closing .contact{ font-size:13.5px; line-height:2; }
.closing .contact b{ color:#fff; } .closing .contact .v{ color:var(--gold); }
.closing .foot{ position:absolute; bottom:44px; font-size:10.5px; letter-spacing:.05em; color:rgba(243,245,240,.4); }
</style></head><body>

<!-- COVER -->
<section class="fullbleed cover">
  <div class="coverframe"></div><div class="coverframe2"></div>
  <img class="logo" src="${tuLogo}" alt="TransferringUP"/>
  <div class="word">TRANSFERRING UP</div>
  <div class="cline">Transfer &amp; Admissions Consulting</div>
  <div class="grule"></div>
  <div class="prep">Prepared exclusively for</div>
  <div class="prepared">Aryan</div>
  <div class="sub">A premium, one-on-one plan to take your story and turn it into an admit.</div>
  <div class="foot">transferringup.com &nbsp;&middot;&nbsp; ajay@transferringup.com</div>
</section>

<!-- LETTER FROM AJAY -->
<div class="block letter">
  <div class="goldrule"></div>
  <div class="eyebrow">A letter to Aryan</div>
  <p class="body lead" style="margin-top:8px">Most people in admissions look at a non-traditional path and see a problem to manage. I see the opposite. I started TransferringUP because I lived it: a 1.25 GPA my freshman year of high school, ranked 399 of 411, written off by schools with 87&#37; acceptance rates. What eventually got me into Cornell was not pretending none of that happened, it was learning how to frame it.</p>
  <p class="body">Your background is not something we will apologize for or bury on the second page. Handled right, it becomes the spine of your application, the reason an admissions officer remembers your file instead of the forty others they read that night.</p>
  <p class="body">What follows is exactly how we would do that for you: how we find your real story, how we frame it so it reads as strength, and everything we handle so you are never doing this alone. Read it, then let us talk.</p>
  <div class="sig">Ajay Sharma</div>
  <div class="signame">Ajay Sharma</div>
  <div class="sigrole">Founder &amp; Lead Consultant, TransferringUP &middot; Cornell University</div>
</div>

<div class="block">
  <div class="stats">
    <div class="stat"><div class="big">2.8</div><div class="small">Lowest GPA we&rsquo;ve placed (into NYU)</div></div>
    <div class="stat"><div class="big">44</div><div class="small">Top-30 acceptances on record</div></div>
    <div class="stat"><div class="big">5.0&#9733;</div><div class="small">Average rating from clients</div></div>
    <div class="stat"><div class="big">1 yr</div><div class="small">Typical time to transfer up</div></div>
  </div>
</div>

<div class="hr"></div>

<!-- 01 APPROACH (the centerpiece) -->
<div class="block">
  <div class="shead"><span class="secnum">01</span><div><div class="eyebrow">How we will approach your application</div><h2 class="sec">We make your story the strategy.</h2></div></div>
  <p class="body">Admissions officers spend only a few minutes on each file, and a non-traditional application gets flagged in the first thirty seconds. The question in their head is simple: what happened here? Everything we do is built so the answer is a story about momentum and direction, never a list of things to explain away.</p>
  <div style="margin-top:8px">
    <div class="step"><div class="stepnum">01</div><div><div class="steph">We find the real story.</div><div class="stepb">Before a single essay, we dig into the why behind your path, the decisions, the turning point, what you actually took from it. Most students bury this. For a non-traditional applicant it is usually the most compelling thing on the page.</div></div></div>
    <div class="step"><div class="stepnum">02</div><div><div class="steph">We frame it as strength.</div><div class="stepb">An unconventional route is not a weakness to defend, it is context that makes your trajectory undeniable. We position your background as the setup, not the apology, so the reader sees growth, drive, and someone who will thrive on their campus.</div></div></div>
    <div class="step"><div class="stepnum">03</div><div><div class="steph">We make every piece point the same way.</div><div class="stepb">Your essays, your activities, your recommendations, your major and your school list all reinforce one sharp narrative. When an application is that coherent, admissions stops reading a transcript and starts rooting for a person.</div></div></div>
  </div>
  <div class="pull"><span class="mark">&ldquo;</span><div class="q">Your background isn&rsquo;t a liability to explain away. It&rsquo;s the most interesting thing about your file.</div><div class="rule"></div></div>
</div>

<div class="hr"></div>

<!-- 02 WHAT WORKING WITH US IS LIKE -->
<div class="block">
  <div class="shead"><span class="secnum">02</span><div><div class="eyebrow">What working with us is like</div><h2 class="sec">A genuinely personal service.</h2></div></div>
  <div style="margin-top:2px">${PILLARS.map(pillar).join('')}</div>
</div>

<div class="block">
  <div class="eyebrow">Everything included</div>
  <h2 class="sec" style="font-size:22px">The full system, nothing held back.</h2>
  <div class="included">${INCLUDED.map((x) => `<div class="incl"><span class="ck">&#10003;</span><span class="t">${esc(x)}</span></div>`).join('')}</div>
</div>

<!-- 03 INVESTMENT -->
<div class="block">
  <div class="shead"><span class="secnum">03</span><div><div class="eyebrow">Your investment</div><h2 class="sec">One price. Everything in.</h2></div></div>
  <div class="invest">
    <div><div class="price">$9,000</div><div class="pcap">Complete engagement</div></div>
    <div class="pright">
      <div class="pr-h">One flat price for the full cycle.</div>
      <div class="pr-b">Unlimited applications, unlimited essay revisions, 24/7 access, and a profile built with you from start to finish. No per-school fees, no hourly billing, no upsells.</div>
    </div>
  </div>
</div>

<div class="hr"></div>

<!-- 04 PROOF: LOGO WALL -->
<div class="block">
  <div class="shead"><span class="secnum">04</span><div><div class="eyebrow">The proof</div><h2 class="sec">The schools that said yes.</h2></div></div>
  <p class="body">A selection of the universities our students have been admitted to.</p>
  <div class="wall" style="margin-top:6px">${logoWall(logos)}</div>
</div>

<!-- PROOF: RESULTS LEDGER -->
<div class="block">
  <div class="eyebrow">The track record</div>
  <h2 class="sec">Real students. Real results.</h2>
  <p class="body" style="font-style:italic;color:var(--grey);margin-bottom:10px">Selected acceptances on record, presented without names for privacy.</p>
  <div class="ledger">${resultsLedger()}</div>
</div>

<div class="hr"></div>

<!-- 05 REVIEWS + BBB -->
<div class="block">
  <div class="shead"><span class="secnum">05</span><div><div class="eyebrow">In their words</div><h2 class="sec">What our students say.</h2></div></div>
  <div class="reviews" style="margin-top:4px">${REVIEWS.map(review).join('')}</div>
  <div class="bbbrow">
    <div class="bbbbox"><div class="l1">BBB ACCREDITED</div><div class="l2">A&minus; RATING</div></div>
    <div class="bbbtxt">TransferringUP is a Better Business Bureau Accredited Business with an A&minus; rating. Independently vetted and reviewed, so you are trusting an accountable business, not a stranger on the internet.</div>
  </div>
</div>

<div class="hr"></div>

<!-- 06 TEAM -->
<div class="block">
  <div class="shead"><span class="secnum">06</span><div><div class="eyebrow">The team</div><h2 class="sec">Coached by people who made the move.</h2></div></div>
  <p class="body">You work directly with a team that transferred into these schools themselves.</p>
  <div class="fgrid" style="margin-top:6px">
    ${featuredCard(photo.ajay, 'Ajay Sharma', 'CEO & Lead Consultant', 'cornell', 'From a 2.9 GPA, in one year, accepted to', ['cornell', 'vanderbilt', 'michigan', 'nyu', 'usc'], logos)}
    ${featuredCard(photo.caleb, 'Caleb Hong', 'Essay Consultant', 'uchicago', 'From a 3.4 GPA, in one year, accepted to', ['uchicago', 'emory', 'washu', 'nyu'], logos)}
    ${featuredCard(photo.sahaj, 'Sahaj Satani', 'First-Year Admissions', 'cornell', 'Accepted to', ['cornell', 'columbia', 'jhu', 'vanderbilt', 'rice', 'utaustin'], logos, ['stanford', 'upenn'])}
  </div>
  <div class="cred-sub" style="margin-top:16px;opacity:.7">Supported by a full roster of consultants who transferred into top-25 schools:</div>
  <div class="rostergrid">
    <div class="rosteritem"><b>Sahil Raut</b> &nbsp;<span>Cornell</span></div>
    <div class="rosteritem"><b>Kaveen Shah</b> &nbsp;<span>Cornell</span></div>
    <div class="rosteritem"><b>Mike Liang</b> &nbsp;<span>Cornell</span></div>
    <div class="rosteritem"><b>Akshay Joshi</b> &nbsp;<span>Cornell</span></div>
    <div class="rosteritem"><b>Abigail So</b> &nbsp;<span>Cornell</span></div>
    <div class="rosteritem"><b>Dilan Harrop-Williams</b> &nbsp;<span>Cornell Dyson</span></div>
    <div class="rosteritem"><b>Bryan Liu</b> &nbsp;<span>Notre Dame</span></div>
    <div class="rosteritem"><b>Ryan Oh</b> &nbsp;<span>Vanderbilt</span></div>
    <div class="rosteritem"><b>Ryan Gary</b> &nbsp;<span>USC</span></div>
  </div>
</div>

<!-- CLOSING -->
<section class="fullbleed closing">
  <div class="coverframe"></div><div class="coverframe2"></div>
  <img class="clogo" src="${tuLogo}" alt="TransferringUP"/>
  <div class="ce">Your next step, Aryan</div>
  <h2>Let&rsquo;s build your plan.</h2>
  <p>On a strategy consultation we map your exact path: where you stand, the schools to target, and how we would get you in.</p>
  <div class="priceline">Your engagement: <b>$9,000</b>, everything included.</div>
  <div class="contact">
    <div><b>Book your consultation</b> &nbsp; <span class="v">transferringup.com/get-started</span></div>
    <div><b>Email</b> &nbsp; <span class="v">ajay@transferringup.com</span></div>
    <div><b>Call or text</b> &nbsp; <span class="v">(980) 248-9218</span></div>
  </div>
  <div class="foot">TransferringUP &nbsp;&middot;&nbsp; Premium, extremely personalized transfer admissions.</div>
</section>

</body></html>`;

  const outDir = path.join(ROOT, 'dist-proposal');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'proposal.html'), html);
  console.log('WROTE', path.join(outDir, 'proposal.html'), (html.length / 1024).toFixed(0) + ' KB');
})();
