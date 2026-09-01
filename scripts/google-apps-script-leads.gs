/**
 * TransferringUP - Lead + Booking tracker (Google Apps Script)
 * ============================================================
 * What this does:
 *   1. doPost(e)      - receives every website form submission (now ~27 fields,
 *                       including IP/geo/UTM enrichment), writes it to the
 *                       "Leads" tab with self-managing column headers, and
 *                       emails you a summary. New fields never require edits
 *                       here: unknown keys automatically become new columns.
 *   2. syncBookings() - scans your Google Calendar for appointment-schedule
 *                       bookings and upserts each one into a "Bookings" tab
 *                       with a Meeting Status dropdown:
 *                       Booked / Showed / No-show / Rescheduled / Canceled.
 *                       After each call you just flip the dropdown, which is
 *                       your show/no-show record.
 *   3. Visitor intel  - doPost also receives 'visit' beacons (one row per
 *                       browsing session, upserted into a "Visits" tab: who,
 *                       when, duration, pages, IP, school/company) and
 *                       'newsletter' signups (a "Newsletter" tab + instant
 *                       email). The hourly trigger sends ONE daily digest
 *                       email (after REPORT_HOUR) summarizing all traffic.
 *
 * INSTALL (keeps your existing form URL working - do not create a new project):
 *   1. Open script.google.com \u2192 your existing lead script project.
 *   2. Replace ALL code with this file. Set CONFIG below if needed.
 *   3. Deploy \u2192 Manage deployments \u2192 pencil (edit) \u2192 Version: "New version"
 *      \u2192 Deploy. (Editing the EXISTING deployment keeps the same /exec URL,
 *      so the website needs no changes. A brand-new deployment would change
 *      the URL and require updating VITE_GOOGLE_SCRIPT_URL in Netlify.)
 *   4. For booking sync: left sidebar \u2192 Triggers (clock icon) \u2192 Add Trigger \u2192
 *      function: syncBookings \u2192 event source: Time-driven \u2192 Hour timer \u2192
 *      Every hour \u2192 Save (grant Calendar permission when asked).
 *   5. RECOMMENDED - start with clean columns: in the spreadsheet, rename your
 *      current lead tab to "Leads (old)". The next submission auto-creates a
 *      fresh "Leads" tab in the new score-first column order. (If you skip
 *      this, old columns stay put and new fields append at the far right.)
 *   6. Run setupSheet() once (editor: select setupSheet \u25B8 Run) after the first
 *      new lead arrives - freezes the header, adds filters, and color-codes
 *      the leadTier column (Hot green / Warm yellow / Cool gray / spam red).
 */

var CONFIG = {
  NOTIFY_EMAIL: 'ajay@transferringup.com, as4489@cornell.edu',
  LEADS_SHEET: 'Leads',
  BOOKINGS_SHEET: 'Bookings',
  VISITS_SHEET: 'Visits',
  PROFILES_SHEET: 'Profiles',
  NEWSLETTER_SHEET: 'Newsletter',
  // Secret key for the private web dashboard (doGet). The /exec URL is public
  // (it's in the website bundle), so the dashboard only renders with
  // ?key=<DASHBOARD_KEY> appended. Treat the full link like a password.
  DASHBOARD_KEY: 'TU-59cacf1056c77198d96a',
  SHEET_URL: 'https://docs.google.com/spreadsheets/d/1zUcsZ0IlPXjr0zvReIBFq4fMU3nV0zJ4yxEJSmK5io8/edit',
  // Hour (0-23, script timezone) after which the hourly trigger sends the
  // once-a-day visitor digest email.
  REPORT_HOUR: 8,
  // Meta pixel/dataset id for server-side conversions. The CAPI access token is
  // NOT stored here: set it once via Project Settings > Script Properties with
  // key META_CAPI_TOKEN. Until the token exists, conversion sends are skipped.
  META_PIXEL_ID: '833203769034453',
  // Default deal value (USD) reported to Meta on Closed - Won when the row has
  // no Deal Value filled in. Edit to your real average engagement price.
  DEAL_VALUE_DEFAULT: 3000,
  // Booking page students use to grab a new time (rebook/reschedule emails).
  BOOKING_PAGE: 'https://calendly.com/ajay-transferringup/30min',
  PREP_PAGE: 'https://transferringup.com/prep',
  // Appointment-schedule events are matched by title. Google titles them with
  // the schedule name, e.g. "Strategy Call (Ajay Sharma and John Doe)".
  // Lowercase substring match - adjust if you rename your schedule.
  BOOKING_TITLE_MATCH: 'call',
  // How far back/forward syncBookings scans.
  SYNC_DAYS_BACK: 7,
  SYNC_DAYS_AHEAD: 21,
};

// Your pipeline "buttons": flip this dropdown on the Bookings tab and the hourly
// engine reacts (reminders restart on Rescheduled, rebook email on No-show,
// Meta conversion fires on Showed / Closed - Won when a CAPI token is set).
var STATUS_OPTIONS = ['Booked', 'Showed', 'No-show', 'Rescheduled', 'Canceled', 'Closed - Won', 'Deal Lost'];

/* ------------------------------ LEADS ------------------------------ */

// Preferred column order - mirrors the live form exactly. Score first so the
// sheet reads hot-to-cold at a glance; the student's answers next; behavior and
// enrichment after. Any future field not listed here auto-appends at the end.
var LEAD_ORDER = [
  // triage
  'timestamp', 'leadTier', 'leadScore',
  // who
  'name', 'phone', 'email', 'filledBy', 'studentType',
  // where they are (adaptive branch)
  'highSchool', 'gradYear', 'gradeLevel', 'currentSchool', 'collegeYear',
  'collegeGPA', 'highSchoolGPA', 'gpaTrajectory', 'testScore',
  // what they want
  'targetSchools', 'ambitionProfile', 'intendedMajor', 'majorCategory', 'majorFit', 'careerGoals', 'cycle',
  // qualification + computed funnel tiers
  'pipelineTier', 'payTier', 'abilityToPay', 'hsCategory', 'collegeCategory',
  'dreamPrestigeCount', 'usedAdvisorBefore', 'previousAdvisorFirm', 'investmentReadiness',
  'investmentDwellSeconds', 'financialAid', 'challenge', 'challengeWordCount',
  // confirmation-page enrichment
  'callGoal', 'lastCycleResults', 'uploads',
  // engagement behavior
  'visitCount', 'firstVisit', 'daysSinceFirstVisit', 'pagesThisSession',
  'viewedReviews', 'viewedResults', 'viewedServices', 'minutesOnSite',
  'formFillSeconds', 'returnedToFinish', 'pasteDetected',
  // identity / verification
  'emailQuality', 'eduEmailDomain', 'phoneAreaCode',
  'ipAddress', 'ipCity', 'ipRegion', 'ipCountry', 'ipPostal', 'ipISP', 'timezone',
  // attribution
  'utmSource', 'utmMedium', 'utmCampaign', 'utmTerm', 'utmContent',
  'gclid', 'fbclid', 'metaFbp', 'metaFbc', 'gaClientId', 'adBlockerLikely',
  'referrer', 'landingPage', 'submittedFrom', 'device', 'screenSize',
  'visitorId', 'source',
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var data = JSON.parse(e.postData.contents || '{}');
    if (data.type === 'visit') return handleVisit(data);
    if (data.type === 'newsletter') return handleNewsletter(data);
    if (data.type === 'enrichment') return handleEnrichment(data);
    data.timestamp = new Date();

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(CONFIG.LEADS_SHEET) || ss.insertSheet(CONFIG.LEADS_SHEET);

    // Self-managing headers: union of (preferred order \u2229 seen keys) + existing + new.
    var headers = sheet.getLastRow() > 0
      ? sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn())).getValues()[0].filter(String)
      : [];
    if (headers.length === 0) {
      headers = LEAD_ORDER.filter(function (k) { return k in data; });
    }
    Object.keys(data).forEach(function (k) {
      if (headers.indexOf(k) === -1) headers.push(k);
    });
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');

    var row = headers.map(function (h) { return h in data ? data[h] : ''; });
    sheet.appendRow(row);

    // Email summary (key fields only, so it's scannable on a phone).
    var brief = ['leadTier', 'leadScore', 'name', 'phone', 'email', 'filledBy',
      'studentType', 'highSchool', 'currentSchool', 'collegeGPA', 'highSchoolGPA',
      'gpaTrajectory', 'targetSchools', 'ambitionProfile', 'intendedMajor',
      'careerGoals', 'cycle', 'investmentReadiness', 'usedAdvisorBefore',
      'previousAdvisorFirm', 'financialAid', 'visitCount', 'pagesThisSession',
      'ipCity', 'ipRegion', 'utmSource', 'challenge']
      .filter(function (k) { return data[k]; })
      .map(function (k) { return k + ': ' + data[k]; })
      .join('\n');
    var tierEmoji = data.leadTier === 'Hot' ? '\uD83D\uDD25' : data.leadTier === 'Warm' ? '\uD83C\uDF24' :
      data.leadTier === 'Likely spam' ? '\uD83D\uDEAB' : '\uD83E\uDDCA';
    MailApp.sendEmail({
      to: CONFIG.NOTIFY_EMAIL,
      subject: tierEmoji + ' ' + (data.leadTier || 'New') + ' lead (' + (data.leadScore || '?') + '): ' +
        (data.name || data.email || 'Unknown') +
        (data.investmentReadiness ? ' - ' + data.investmentReadiness : ''),
      body: brief + '\n\nFull record in the Leads sheet.',
    });

    setupSheet(); // auto-format on every lead
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/* ------------------------- VISITS + NEWSLETTER ------------------------- */

var VISIT_HEADERS = ['Last Seen', 'Visitor', 'Status', 'Visit #', 'Duration (min)',
  'Pages', 'Page Trail', 'City', 'Region', 'Country', 'ISP / Org', 'IP',
  'Device', 'Referrer', 'UTM Source', 'UTM Campaign', 'Landing Page',
  'Timezone', 'Session ID', 'Visitor ID',
  'Page Dwell', 'Page Times', 'Page Scroll', 'Page Log', 'Max Scroll %'];
// 0-based Visits column indices (used by profile aggregation + dashboard).
var V = { seen: 0, who: 1, status: 2, visit: 3, mins: 4, pages: 5, trail: 6,
  city: 7, region: 8, country: 9, isp: 10, ip: 11, device: 12, ref: 13,
  utm: 14, utmCamp: 15, landing: 16, tz: 17, sid: 18, vid: 19,
  dwell: 20, times: 21, scroll: 22, log: 23, maxScroll: 24 };

/** One row per browsing session, upserted by session id (latest beacon wins).
 * knownName/knownEmail arrive once that browser has ever submitted the form
 * or joined the newsletter - that's the profile match. Every session then rolls
 * up into the per-person Profiles tab. */
function handleVisit(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.VISITS_SHEET);
  var fresh = !sheet;
  if (fresh) sheet = ss.insertSheet(CONFIG.VISITS_SHEET);
  // Self-healing header (widens the sheet if new columns were added).
  sheet.getRange(1, 1, 1, VISIT_HEADERS.length).setValues([VISIT_HEADERS]);
  if (fresh) { try { beautifyVisits(ss); } catch (e) {} }

  var who = data.knownEmail
    ? ((data.knownName ? data.knownName + ' ' : '') + '(' + data.knownEmail + ')')
    : 'Anonymous';
  var status = data.knownEmail ? 'Known' : (Number(data.visitCount) > 1 ? 'Returning' : 'New');
  var mins = Math.round((Number(data.durationSeconds) || 0) / 6) / 10;
  var rowVals = [
    new Date(), who, status, Number(data.visitCount) || 1, mins,
    Number(data.pageCount) || 0, data.pageTrail || '',
    data.ipCity || '', data.ipRegion || '', data.ipCountry || '',
    data.ipISP || '', data.ipAddress || '',
    data.device || '', data.referrer || '', data.utmSource || '',
    data.utmCampaign || '', data.landingPage || '', data.timezone || '',
    data.sessionId || '', data.visitorId || '',
    data.pageDwell || '', data.pageTimesJson || '', data.pageScrollJson || '',
    data.pageLogJson || '', Number(data.maxScroll) || 0
  ];

  var rowNum = 0;
  if (data.sessionId && sheet.getLastRow() > 1) {
    var ids = sheet.getRange(2, V.sid + 1, sheet.getLastRow() - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      if (ids[i][0] === data.sessionId) { rowNum = i + 2; break; }
    }
  }
  if (rowNum) {
    sheet.getRange(rowNum, 1, 1, rowVals.length).setValues([rowVals]);
  } else {
    sheet.appendRow(rowVals);
  }
  try { rebuildProfiles(ss); } catch (e) {}
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ------------------------------- PROFILES ------------------------------- */

var PROFILE_HEADERS = ['Visitor', 'Status', 'First Seen', 'Last Seen', 'Days',
  'Visits', 'Sessions', 'Total Time (min)', 'Pageviews', 'Top Pages (by time)',
  'Max Scroll %', 'Location', 'Network', 'Device', 'Arrived Via',
  'Landing Page', 'IP(s)', 'Visitor ID'];

function mostFrequent(arr) {
  var c = {}, best = '', n = 0;
  arr.forEach(function (x) { if (!x) return; c[x] = (c[x] || 0) + 1; if (c[x] > n) { n = c[x]; best = x; } });
  return best;
}
function uniqueList(arr) {
  var seen = {}, out = [];
  arr.forEach(function (x) { if (x && !seen[x]) { seen[x] = 1; out.push(x); } });
  return out;
}
function domainOf(url) {
  var m = /https?:\/\/([^\/]+)/.exec(String(url || ''));
  return m ? m[1].replace(/^www\./, '') : '';
}
function arrivedVia(utm, ref) {
  if (utm) return utm;
  var d = domainOf(ref);
  return d || 'Direct';
}
function fmtMin(sec) {
  var s = Math.round(sec);
  if (s < 60) return s + 's';
  var m = Math.floor(s / 60), r = s % 60;
  return r ? m + 'm ' + r + 's' : m + 'm';
}
function safeParse(s) { try { return JSON.parse(s || '{}') || {}; } catch (e) { return {}; } }

/** Group all Visits sessions into one object per visitor (keyed by the stable
 * first-party visitor id, falling back to IP). Returns an array of profiles. */
function computeProfiles(rows) {
  var groups = {};
  rows.forEach(function (r) {
    if (!(r[V.seen] instanceof Date)) return;
    var key = r[V.vid] || ('ip:' + r[V.ip]);
    (groups[key] = groups[key] || []).push(r);
  });

  var profiles = Object.keys(groups).map(function (key) {
    var g = groups[key].slice().sort(function (a, b) { return a[V.seen] - b[V.seen]; });
    var first = g[0], last = g[g.length - 1];
    var knownRow = null;
    g.forEach(function (r) { if (r[V.status] === 'Known') knownRow = r; });

    var pageSecs = {}, totalPv = 0, totalMin = 0, maxScroll = 0;
    var cities = [], ips = [], isps = [], devices = [];
    g.forEach(function (r) {
      totalMin += Number(r[V.mins]) || 0;
      totalPv += Number(r[V.pages]) || 0;
      maxScroll = Math.max(maxScroll, Number(r[V.maxScroll]) || 0);
      if (r[V.city]) cities.push(r[V.city] + (r[V.region] ? ', ' + r[V.region] : ''));
      if (r[V.ip]) ips.push(r[V.ip]);
      if (r[V.isp]) isps.push(r[V.isp]);
      if (r[V.device]) devices.push(r[V.device]);
      var t = safeParse(r[V.times]);
      Object.keys(t).forEach(function (p) { pageSecs[p] = (pageSecs[p] || 0) + Number(t[p] || 0); });
    });
    var topPages = Object.keys(pageSecs)
      .sort(function (a, b) { return pageSecs[b] - pageSecs[a]; })
      .slice(0, 4)
      .map(function (p) { return p + ' (' + fmtMin(pageSecs[p]) + ')'; })
      .join('  \u00B7  ');

    var days = Math.max(1, Math.round((last[V.seen] - first[V.seen]) / 86400000) + 1);
    var status = knownRow ? 'Known'
      : (Number(last[V.visit]) > 1 || g.length > 1) ? 'Returning' : 'New';

    return {
      who: knownRow ? knownRow[V.who] : 'Anonymous',
      status: status,
      firstSeen: first[V.seen],
      lastSeen: last[V.seen],
      days: days,
      visits: Number(last[V.visit]) || g.length,
      sessions: g.length,
      totalMin: Math.round(totalMin * 10) / 10,
      pageviews: totalPv,
      topPages: topPages,
      maxScroll: maxScroll,
      location: uniqueList(cities).slice(0, 2).join(' | '),
      network: mostFrequent(isps),
      device: mostFrequent(devices),
      arrivedVia: arrivedVia(first[V.utm], first[V.ref]),
      landing: first[V.landing],
      ips: uniqueList(ips).join(', '),
      vid: key
    };
  });

  profiles.sort(function (a, b) { return b.lastSeen - a.lastSeen; });
  return profiles;
}

/** Rebuild the Profiles tab from the Visits tab (source of truth). */
function rebuildProfiles(ss) {
  var visits = ss.getSheetByName(CONFIG.VISITS_SHEET);
  if (!visits || visits.getLastRow() < 2) return;
  var rows = visits.getRange(2, 1, visits.getLastRow() - 1, VISIT_HEADERS.length).getValues();
  var profiles = computeProfiles(rows);

  var sheet = ss.getSheetByName(CONFIG.PROFILES_SHEET) || ss.insertSheet(CONFIG.PROFILES_SHEET);
  sheet.clearContents();
  var out = [PROFILE_HEADERS];
  profiles.forEach(function (p) {
    out.push([p.who, p.status, p.firstSeen, p.lastSeen, p.days, p.visits, p.sessions,
      p.totalMin, p.pageviews, p.topPages, p.maxScroll, p.location, p.network,
      p.device, p.arrivedVia, p.landing, p.ips, p.vid]);
  });
  sheet.getRange(1, 1, out.length, PROFILE_HEADERS.length).setValues(out);
  try { beautifyProfiles(ss); } catch (e) {}
}

var NEWSLETTER_HEADERS = ['Subscribed', 'Email', 'Source Page', 'City', 'Region',
  'ISP / Org', 'IP', 'UTM Source', 'Referrer', 'Device', 'Visitor ID'];

function handleNewsletter(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.NEWSLETTER_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.NEWSLETTER_SHEET);
    sheet.getRange(1, 1, 1, NEWSLETTER_HEADERS.length).setValues([NEWSLETTER_HEADERS]);
    try { beautifyNewsletter(ss); } catch (e) {}
  }
  var email = String(data.email || '').trim().toLowerCase();
  if (!email) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'no email' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Dedupe by email: re-subscribing never creates a second row or a second email.
  if (sheet.getLastRow() > 1) {
    var seen = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
    for (var i = 0; i < seen.length; i++) {
      if (String(seen[i][0]).toLowerCase() === email) {
        return ContentService.createTextOutput(JSON.stringify({ ok: true, dup: true }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
  }

  sheet.appendRow([new Date(), email, data.sourcePage || '', data.ipCity || '',
    data.ipRegion || '', data.ipISP || '', data.ipAddress || '',
    data.utmSource || '', data.referrer || '', data.device || '', data.visitorId || '']);
  try {
    MailApp.sendEmail({
      to: CONFIG.NOTIFY_EMAIL,
      subject: '\uD83D\uDCF0 New newsletter subscriber: ' + email,
      body: 'Email: ' + email +
        '\nPage: ' + (data.sourcePage || '?') +
        '\nLocation: ' + [data.ipCity, data.ipRegion].filter(function (x) { return x; }).join(', ') +
        '\nNetwork: ' + (data.ipISP || '?') +
        '\n\nFull list on the Newsletter tab.',
    });
  } catch (mailErr) {}
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ---------------------- CONFIRMATION-PAGE ENRICHMENT --------------------- */

// Confirmation-page uploads (HS transcript, college transcript, resume/CommonApp)
// + goal + last-cycle results. Files go to a per-student Drive folder; the links
// and answers are written onto that person's existing Leads row (matched by
// email). Then it emails you the packet and sends the student a confirmation.
function handleEnrichment(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var email = String(data.email || '').trim().toLowerCase();
  if (!email) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'no email' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // 1. Save any uploaded files into Drive: /TransferringUP Uploads/<email>/
  var links = [];
  try {
    if (data.files && data.files.length) {
      var root = getOrMakeFolder(DriveApp.getRootFolder(), 'TransferringUP Uploads');
      var folder = getOrMakeFolder(root, email);
      data.files.forEach(function (f) {
        if (!f || !f.b64) return;
        var bytes = Utilities.base64Decode(f.b64);
        var blob = Utilities.newBlob(bytes, f.mime || 'application/octet-stream', f.name || 'upload');
        var file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        links.push((f.label || f.name || 'file') + ': ' + file.getUrl());
      });
    }
  } catch (driveErr) {
    links.push('Upload error: ' + String(driveErr));
  }

  // 2. Write the enrichment onto the student's existing Leads row (match by email).
  try {
    var sheet = ss.getSheetByName(CONFIG.LEADS_SHEET);
    if (sheet && sheet.getLastRow() > 1) {
      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var emailCol = headers.indexOf('email');
      // callGoal/lastCycleResults/uploads from the original confirmation page,
      // plus the deep qualifying questions moved off the booking form to here.
      // These use the SAME column names the sales dossier reads, so a completed
      // prep page back-fills the psychological profile on the lead's row.
      var enrich = {
        callGoal: data.goal || '',
        lastCycleResults: data.lastCycle || '',
        uploads: links.join('\n'),
      };
      if (data.story) enrich.currentSchoolStory = data.story;
      if (data.whyNow) enrich.challenge = data.whyNow;
      if (data.worry) enrich.biggestWorry = data.worry;
      // Parent in the loop = the actual buyer is reachable. Gold for show
      // rate and for the close; surfaces on the /hq profile automatically.
      if (data.parentName) enrich.parentName = data.parentName;
      if (data.parentContact) enrich.parentContact = data.parentContact;
      if (data.familyBenchmark) enrich.familyBenchmark = data.familyBenchmark;
      // Ensure enrichment columns exist.
      Object.keys(enrich).forEach(function (k) {
        if (headers.indexOf(k) === -1) { headers.push(k); sheet.getRange(1, headers.length).setValue(k).setFontWeight('bold'); }
      });
      if (emailCol !== -1) {
        var col = sheet.getRange(2, emailCol + 1, sheet.getLastRow() - 1, 1).getValues();
        for (var i = col.length - 1; i >= 0; i--) { // newest matching row
          if (String(col[i][0]).trim().toLowerCase() === email) {
            var row = i + 2;
            Object.keys(enrich).forEach(function (k) {
              sheet.getRange(row, headers.indexOf(k) + 1).setValue(enrich[k]);
            });
            break;
          }
        }
      }
    }
  } catch (rowErr) {}

  // 3. Email you the packet, and the student a confirmation.
  try {
    MailApp.sendEmail({
      to: CONFIG.NOTIFY_EMAIL,
      subject: '\uD83D\uDCCE Call prep from ' + email,
      body: 'Student: ' + email +
        '\nGoal: ' + (data.goal || '(none)') +
        '\nLast cycle: ' + (data.lastCycle || '(none)') +
        '\n\nUploads:\n' + (links.join('\n') || '(none)') +
        '\n\nAlso saved to their row on the Leads tab.',
    });
  } catch (mailErr) {}
  try {
    MailApp.sendEmail({
      to: email,
      subject: 'Got it - your strategy call is set',
      body: 'Thanks for sharing this ahead of your call. The more we have, the more tailored we make your session.\n\n' +
        'We received: ' + (links.length ? links.map(function (l) { return l.split(':')[0]; }).join(', ') : 'your notes') +
        '.\n\nSee you on the call.\n- TransferringUP',
    });
  } catch (mailErr2) {}

  return ContentService.createTextOutput(JSON.stringify({ ok: true, saved: links.length }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrMakeFolder(parent, name) {
  var it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}

/* --------------------------- BEAUTIFY / SETUP --------------------------- */

// Brand palette (matches transferringup.com)
var NAVY = '#0f1c2e', CREAM = '#f8f4ee', WHITE = '#ffffff';
var TIER_STYLE = {
  'Hot':         { cell: '#34a853', row: '#e6f4ea' },
  'Warm':        { cell: '#f9ab00', row: '#fef7e0' },
  'Cool':        { cell: '#4285f4', row: '#e8f0fe' },
  'Likely spam': { cell: '#ea4335', row: '#fce8e6' }
};
var COL_WIDTHS = {
  timestamp: 130, leadTier: 92, leadScore: 76, name: 170, phone: 130, email: 210,
  filledBy: 140, studentType: 150, highSchool: 170, gradYear: 80, currentSchool: 180,
  collegeYear: 100, collegeGPA: 92, highSchoolGPA: 100, gpaTrajectory: 104, testScore: 104,
  targetSchools: 220, ambitionProfile: 150, intendedMajor: 150, careerGoals: 160, cycle: 104,
  usedAdvisorBefore: 190, previousAdvisorFirm: 220, investmentReadiness: 240,
  investmentDwellSeconds: 84, financialAid: 100, challenge: 320, challengeWordCount: 76,
  visitCount: 70, firstVisit: 96, daysSinceFirstVisit: 76, pagesThisSession: 250,
  viewedReviews: 86, viewedResults: 84, viewedServices: 88, minutesOnSite: 88,
  formFillSeconds: 84, returnedToFinish: 90, pasteDetected: 88, emailQuality: 104,
  eduEmailDomain: 150, phoneAreaCode: 84, ipAddress: 120, ipCity: 110, ipRegion: 120,
  ipCountry: 104, utmSource: 104, utmMedium: 104, utmCampaign: 130, submittedFrom: 104,
  device: 84, source: 150
};
// Technical noise, hidden by default (data stays; unhide any time via View menu).
var HIDE_COLS = ['utmTerm', 'utmContent', 'gclid', 'fbclid', 'metaFbp', 'metaFbc',
  'gaClientId', 'adBlockerLikely', 'userAgent', 'screenSize', 'visitorId',
  'submittedAtLocal', 'timezone', 'ipPostal', 'ipISP', 'landingPage', 'referrer', 'message'];
var WRAP_COLS = ['challenge', 'targetSchools', 'pagesThisSession', 'previousAdvisorFirm'];

function styleHeader(sheet, nCols) {
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 34);
  sheet.getRange(1, 1, 1, nCols)
    .setBackground(NAVY).setFontColor(WHITE).setFontWeight('bold')
    .setFontSize(9).setVerticalAlignment('middle');
}

/** Full visual pass over Leads + Bookings + Dashboard. Idempotent and safe to
 * run on every submission / sheet open / hourly sync. */
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  try { beautifyLeads(ss); } catch (e) {}
  try { addProfileLinks(ss); } catch (e) {}
  try { beautifyBookings(ss); } catch (e) {}
  try { beautifyVisits(ss); } catch (e) {}
  try { rebuildProfiles(ss); } catch (e) {}
  try { beautifyNewsletter(ss); } catch (e) {}
  try { buildDashboard(ss); } catch (e) {}
}

/** "Profile" column on Leads: one click from any row to that person's full
 * profile dashboard in the command center. Idempotent; refreshed on every
 * setupSheet pass so new rows get their link. */
function addProfileLinks(ss) {
  var sheet = ss.getSheetByName(CONFIG.LEADS_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return;
  var base = execUrl();
  if (!base) return;
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var iEmail = headers.indexOf('email');
  if (iEmail === -1) return;
  var iProf = headers.indexOf('Profile');
  if (iProf === -1) {
    iProf = headers.length;
    sheet.getRange(1, iProf + 1).setValue('Profile').setFontWeight('bold');
  }
  var n = sheet.getLastRow() - 1;
  var emails = sheet.getRange(2, iEmail + 1, n, 1).getValues();
  var formulas = emails.map(function (r) {
    var em = String(r[0] || '').trim().toLowerCase();
    return [em ? '=HYPERLINK("' + personLink(em).replace(/"/g, '""') + '","view \u2192")' : ''];
  });
  sheet.getRange(2, iProf + 1, n, 1).setFormulas(formulas);
}

function beautifyLeads(ss) {
  var sheet = ss.getSheetByName(CONFIG.LEADS_SHEET);
  if (!sheet || sheet.getLastRow() === 0) return;
  var nCols = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, nCols).getValues()[0];

  sheet.setTabColor('#7a0000');
  styleHeader(sheet, nCols);
  sheet.setFrozenColumns(4); // timestamp | tier | score | name stay pinned
  if (!sheet.getFilter()) {
    sheet.getRange(1, 1, sheet.getMaxRows(), nCols).createFilter();
  }

  // Column widths + hide the technical noise + wrap the long-text columns.
  headers.forEach(function (h, i) {
    var c = i + 1;
    if (COL_WIDTHS[h]) sheet.setColumnWidth(c, COL_WIDTHS[h]);
    if (HIDE_COLS.indexOf(h) !== -1) sheet.hideColumns(c);
    var strat = WRAP_COLS.indexOf(h) !== -1
      ? SpreadsheetApp.WrapStrategy.WRAP
      : SpreadsheetApp.WrapStrategy.CLIP;
    sheet.getRange(2, c, Math.max(sheet.getMaxRows() - 1, 1), 1).setWrapStrategy(strat);
  });

  // Friendly timestamp + centered small columns.
  var tsCol = headers.indexOf('timestamp') + 1;
  if (tsCol > 0) sheet.getRange(2, tsCol, sheet.getMaxRows() - 1, 1).setNumberFormat('mmm d, h:mm am/pm');
  ['leadTier', 'leadScore', 'visitCount', 'gradYear', 'collegeGPA', 'highSchoolGPA'].forEach(function (h) {
    var c = headers.indexOf(h) + 1;
    if (c > 0) sheet.getRange(2, c, sheet.getMaxRows() - 1, 1).setHorizontalAlignment('center');
  });

  // Conditional formatting: tier cell chips, whole-row tint by tier, score gradient.
  var rules = [];
  var tierCol = headers.indexOf('leadTier') + 1;
  var scoreCol = headers.indexOf('leadScore') + 1;
  var maxR = Math.max(sheet.getMaxRows() - 1, 1);
  if (tierCol > 0) {
    var tierLetter = sheet.getRange(1, tierCol).getA1Notation().replace(/[0-9]+/g, '');
    var tierRange = sheet.getRange(2, tierCol, maxR, 1);
    var rowRange = sheet.getRange(2, 1, maxR, nCols);
    Object.keys(TIER_STYLE).forEach(function (t) {
      rules.push(SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(t).setBackground(TIER_STYLE[t].cell).setFontColor(WHITE).setBold(true)
        .setRanges([tierRange]).build());
    });
    Object.keys(TIER_STYLE).forEach(function (t) {
      rules.push(SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied('=$' + tierLetter + '2="' + t + '"')
        .setBackground(TIER_STYLE[t].row).setRanges([rowRange]).build());
    });
  }
  if (scoreCol > 0) {
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .setGradientMinpointWithValue('#ea4335', SpreadsheetApp.InterpolationType.NUMBER, '0')
      .setGradientMidpointWithValue('#fbbc04', SpreadsheetApp.InterpolationType.NUMBER, '50')
      .setGradientMaxpointWithValue('#34a853', SpreadsheetApp.InterpolationType.NUMBER, '100')
      .setRanges([sheet.getRange(2, scoreCol, maxR, 1)]).build());
  }
  sheet.setConditionalFormatRules(rules);
}

function beautifyBookings(ss) {
  var sheet = ss.getSheetByName(CONFIG.BOOKINGS_SHEET);
  if (!sheet || sheet.getLastRow() === 0) return;
  sheet.setTabColor('#0f1c2e');
  styleHeader(sheet, BOOKING_HEADERS.length);
  [180, 130, 90, 170, 220, 130, 130, 260, 90, 110, 110].forEach(function (w, i) { sheet.setColumnWidth(i + 1, w); });
  sheet.hideColumns(1); // Event ID = plumbing
  sheet.hideColumns(BOOKING_HEADERS.indexOf('Processed Status') + 1); // engine state
  sheet.hideColumns(BOOKING_HEADERS.indexOf('Reminded') + 1); // engine state
  var maxR = Math.max(sheet.getMaxRows() - 1, 1);
  var statusCol = BOOKING_HEADERS.indexOf('Meeting Status') + 1;
  var statusRange = sheet.getRange(2, statusCol, maxR, 1);
  statusRange.setHorizontalAlignment('center');
  var colors = { 'Booked': '#4285f4', 'Showed': '#34a853', 'No-show': '#ea4335', 'Rescheduled': '#f9ab00', 'Canceled': '#9aa0a6', 'Closed - Won': '#188038', 'Deal Lost': '#5f6368' };
  sheet.setConditionalFormatRules(Object.keys(colors).map(function (st) {
    return SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(st).setBackground(colors[st]).setFontColor(WHITE).setBold(true)
      .setRanges([statusRange]).build();
  }));
}

var VISIT_STATUS_STYLE = {
  'Known':     { cell: '#7a0000', row: '#f7e6e6' },
  'Returning': { cell: '#4285f4', row: '#e8f0fe' },
  'New':       { cell: '#9aa0a6', row: '' }
};

function beautifyVisits(ss) {
  var sheet = ss.getSheetByName(CONFIG.VISITS_SHEET);
  if (!sheet || sheet.getLastRow() === 0) return;
  sheet.setTabColor('#188038');
  styleHeader(sheet, VISIT_HEADERS.length);
  sheet.setFrozenColumns(3); // last seen | visitor | status stay pinned
  if (!sheet.getFilter()) {
    sheet.getRange(1, 1, sheet.getMaxRows(), VISIT_HEADERS.length).createFilter();
  }
  [136, 230, 96, 64, 96, 60, 300, 110, 110, 90, 190, 120, 80, 160, 100, 110, 140, 130, 120, 120,
    320, 90, 90, 90, 92]
    .forEach(function (w, i) { sheet.setColumnWidth(i + 1, w); });
  // timezone/session/visitor + the raw JSON columns = plumbing, hidden.
  [18, 19, 20, 22, 23, 24].forEach(function (c) { sheet.hideColumns(c); });
  var maxR = Math.max(sheet.getMaxRows() - 1, 1);
  sheet.getRange(2, 1, maxR, 1).setNumberFormat('mmm d, h:mm am/pm');
  sheet.getRange(2, 3, maxR, 4).setHorizontalAlignment('center');
  sheet.getRange(2, 7, maxR, 1).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  sheet.getRange(2, V.dwell + 1, maxR, 1).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);

  var rules = [];
  var statusRange = sheet.getRange(2, 3, maxR, 1);
  var rowRange = sheet.getRange(2, 1, maxR, VISIT_HEADERS.length);
  Object.keys(VISIT_STATUS_STYLE).forEach(function (st) {
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(st).setBackground(VISIT_STATUS_STYLE[st].cell).setFontColor(WHITE).setBold(true)
      .setRanges([statusRange]).build());
    if (VISIT_STATUS_STYLE[st].row) {
      rules.push(SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied('=$C2="' + st + '"')
        .setBackground(VISIT_STATUS_STYLE[st].row).setRanges([rowRange]).build());
    }
  });
  sheet.setConditionalFormatRules(rules);

  // Newest sessions on top.
  if (sheet.getLastRow() > 2) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, VISIT_HEADERS.length)
      .sort([{ column: 1, ascending: false }]);
  }
}

function beautifyProfiles(ss) {
  var sheet = ss.getSheetByName(CONFIG.PROFILES_SHEET);
  if (!sheet || sheet.getLastRow() === 0) return;
  sheet.setTabColor('#6a1b9a');
  styleHeader(sheet, PROFILE_HEADERS.length);
  sheet.setFrozenColumns(2); // visitor | status stay pinned
  if (!sheet.getFilter()) {
    sheet.getRange(1, 1, sheet.getMaxRows(), PROFILE_HEADERS.length).createFilter();
  }
  [230, 96, 130, 130, 56, 60, 72, 96, 78, 360, 84, 170, 190, 80, 130, 150, 150, 120]
    .forEach(function (w, i) { sheet.setColumnWidth(i + 1, w); });
  sheet.hideColumns(PROFILE_HEADERS.length); // visitor id = plumbing
  var maxR = Math.max(sheet.getMaxRows() - 1, 1);
  sheet.getRange(2, 3, maxR, 2).setNumberFormat('mmm d, h:mm am/pm');
  sheet.getRange(2, 5, maxR, 7).setHorizontalAlignment('center');
  sheet.getRange(2, 10, maxR, 1).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);

  var rules = [];
  var statusRange = sheet.getRange(2, 2, maxR, 1);
  var rowRange = sheet.getRange(2, 1, maxR, PROFILE_HEADERS.length);
  Object.keys(VISIT_STATUS_STYLE).forEach(function (st) {
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(st).setBackground(VISIT_STATUS_STYLE[st].cell).setFontColor(WHITE).setBold(true)
      .setRanges([statusRange]).build());
    if (VISIT_STATUS_STYLE[st].row) {
      rules.push(SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied('=$B2="' + st + '"')
        .setBackground(VISIT_STATUS_STYLE[st].row).setRanges([rowRange]).build());
    }
  });
  sheet.setConditionalFormatRules(rules);
}

function beautifyNewsletter(ss) {
  var sheet = ss.getSheetByName(CONFIG.NEWSLETTER_SHEET);
  if (!sheet || sheet.getLastRow() === 0) return;
  sheet.setTabColor('#f9ab00');
  styleHeader(sheet, NEWSLETTER_HEADERS.length);
  if (!sheet.getFilter()) {
    sheet.getRange(1, 1, sheet.getMaxRows(), NEWSLETTER_HEADERS.length).createFilter();
  }
  [136, 240, 120, 110, 110, 190, 120, 100, 160, 80, 120]
    .forEach(function (w, i) { sheet.setColumnWidth(i + 1, w); });
  sheet.hideColumns(11); // visitor id = plumbing
  sheet.getRange(2, 1, Math.max(sheet.getMaxRows() - 1, 1), 1).setNumberFormat('mmm d, h:mm am/pm');
}

var DASH = '\uD83D\uDCCA Dashboard';

function buildDashboard(ss) {
  var sheet = ss.getSheetByName(DASH);
  var fresh = !sheet;
  if (fresh) sheet = ss.insertSheet(DASH, 0);
  sheet.setTabColor('#d4aa00');
  sheet.setHiddenGridlines(true);
  // Traffic tiles (row 12) arrived after the first dashboards were built -
  // add them once to existing dashboards, then this becomes a no-op.
  var needTraffic = !sheet.getRange('B12').getValue();
  if (!fresh && !needTraffic) return; // formulas & styling live-update; build once

  function tile(row, col, label, formula, color) {
    sheet.getRange(row, col).setValue(label)
      .setFontSize(8).setFontColor('#5f6368').setHorizontalAlignment('center');
    sheet.getRange(row + 1, col).setFormula(formula)
      .setFontSize(22).setFontWeight('bold').setFontColor(color)
      .setHorizontalAlignment('center').setBackground(CREAM);
    sheet.setRowHeight(row + 1, 46);
  }

  if (needTraffic) {
    tile(12, 2, 'VISITS TODAY', '=IFERROR(COUNTIF(Visits!A:A,">="&TODAY()),0)', '#188038');
    tile(12, 3, 'VISITS (7D)', '=IFERROR(COUNTIF(Visits!A:A,">="&(TODAY()-7)),0)', NAVY);
    tile(12, 4, 'KNOWN (7D)', '=IFERROR(COUNTIFS(Visits!A:A,">="&(TODAY()-7),Visits!C:C,"Known"),0)', '#7a0000');
    tile(12, 5, 'AVG VISIT (MIN)', '=IFERROR(ROUND(AVERAGE(Visits!E2:E),1),"-")', NAVY);
    tile(12, 6, 'SUBSCRIBERS', '=IFERROR(COUNTA(Newsletter!B2:B),0)', '#f9ab00');
  }
  if (!fresh) return;

  sheet.setColumnWidth(1, 24);
  for (var c = 2; c <= 6; c++) sheet.setColumnWidth(c, 150);

  sheet.getRange('B2:F2').merge().setValue('TRANSFERRINGUP - LEAD DASHBOARD')
    .setBackground(NAVY).setFontColor(WHITE).setFontWeight('bold').setFontSize(13)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(2, 42);

  tile(4, 2, 'TOTAL LEADS', '=COUNTA(Leads!D2:D)', NAVY);
  tile(4, 3, 'HOT', '=COUNTIF(Leads!B:B,"Hot")', '#34a853');
  tile(4, 4, 'WARM', '=COUNTIF(Leads!B:B,"Warm")', '#f9ab00');
  tile(4, 5, 'COOL', '=COUNTIF(Leads!B:B,"Cool")', '#4285f4');
  tile(4, 6, 'AVG SCORE', '=IFERROR(ROUND(AVERAGE(Leads!C2:C),0),"-")', NAVY);

  tile(7, 2, 'CALLS BOOKED', '=IFERROR(COUNTA(Bookings!B2:B),0)', NAVY);
  tile(7, 3, 'SHOWED', '=IFERROR(COUNTIF(Bookings!G:G,"Showed"),0)', '#34a853');
  tile(7, 4, 'NO-SHOWS', '=IFERROR(COUNTIF(Bookings!G:G,"No-show"),0)', '#ea4335');
  tile(7, 5, 'SHOW RATE', '=IFERROR(TEXT(COUNTIF(Bookings!G:G,"Showed")/(COUNTIF(Bookings!G:G,"Showed")+COUNTIF(Bookings!G:G,"No-show")),"0%"),"-")', NAVY);
  tile(7, 6, 'READY TO INVEST', '=COUNTIF(Leads!$A:$AZ,"Ready to invest in the right guidance")', '#7a0000');

  sheet.getRange('B10:F10').merge()
    .setValue('Leads auto-scored 0-100 - flip Meeting Status on the Bookings tab after each call')
    .setFontSize(9).setFontColor('#9aa0a6').setHorizontalAlignment('center');
}

/** Simple trigger: refresh styling every time the spreadsheet is opened. */
function onOpen() {
  setupSheet();
}

/* ----------------------------- BOOKINGS ----------------------------- */

var BOOKING_HEADERS = ['Event ID', 'Call Date', 'Time', 'Guest Name', 'Guest Email',
  'Booked At', 'Meeting Status', 'Notes', 'Deal Value', 'Processed Status', 'Reminded'];

function syncBookings() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.BOOKINGS_SHEET) || ss.insertSheet(CONFIG.BOOKINGS_SHEET);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, BOOKING_HEADERS.length).setValues([BOOKING_HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  // Dropdown validation on the whole Meeting Status column.
  var statusCol = BOOKING_HEADERS.indexOf('Meeting Status') + 1;
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(STATUS_OPTIONS, true).build();
  sheet.getRange(2, statusCol, Math.max(sheet.getMaxRows() - 1, 1), 1).setDataValidation(rule);

  var existingIds = {};
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().forEach(function (r, i) {
      if (r[0]) existingIds[r[0]] = i + 2; // row number
    });
  }

  var now = new Date();
  var start = new Date(now.getTime() - CONFIG.SYNC_DAYS_BACK * 86400000);
  var end = new Date(now.getTime() + CONFIG.SYNC_DAYS_AHEAD * 86400000);
  var events = CalendarApp.getDefaultCalendar().getEvents(start, end);

  events.forEach(function (ev) {
    var title = (ev.getTitle() || '').toLowerCase();
    // Match current Calendly name ("...call...") AND the pre-rename format
    // ("30 min with Ajay (...)") so old bookings keep syncing + reminding.
    if (title.indexOf(CONFIG.BOOKING_TITLE_MATCH.toLowerCase()) === -1 &&
        title.indexOf('30 min with ajay') === -1) return;
    var guests = ev.getGuestList();
    if (!guests.length) return; // not a booked appointment

    var guest = guests[0];
    var id = ev.getId();
    var rowVals = [
      id,
      Utilities.formatDate(ev.getStartTime(), Session.getScriptTimeZone(), 'EEE, MMM d yyyy'),
      Utilities.formatDate(ev.getStartTime(), Session.getScriptTimeZone(), 'h:mm a'),
      guest.getName() || (ev.getTitle().split(' and ')[1] || '').replace(')', ''),
      guest.getEmail(),
      Utilities.formatDate(ev.getDateCreated(), Session.getScriptTimeZone(), 'MMM d, h:mm a'),
    ];

    if (existingIds[id]) {
      // Update date/time in case they rescheduled; never touch status/notes.
      sheet.getRange(existingIds[id], 1, 1, rowVals.length).setValues([rowVals]);
    } else {
      // Notes, Deal Value blank; Processed Status pre-set so the engine only
      // reacts to YOUR later changes, not the initial sync.
      sheet.appendRow(rowVals.concat(['Booked', '', '', 'Booked', '']));
      // New booking: notify (future events only, so a first sync of history is quiet).
      if (ev.getStartTime() > now) {
        try {
          MailApp.sendEmail({
            to: CONFIG.NOTIFY_EMAIL,
            subject: '\uD83D\uDCC5 New call booked: ' + (rowVals[3] || rowVals[4]) + ' - ' + rowVals[1] + ' at ' + rowVals[2],
            body: 'Guest: ' + rowVals[3] + '\nEmail: ' + rowVals[4] + '\nWhen: ' + rowVals[1] + ' at ' + rowVals[2] + '\n\nTracked on the Bookings tab - flip Meeting Status after the call.',
          });
        } catch (mailErr) {}
      }
    }
  });

  // Newest calls at the top (sort by date desc, keeping the header).
  if (sheet.getLastRow() > 2) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, BOOKING_HEADERS.length)
      .sort([{ column: 2, ascending: false }]);
  }

  setupSheet(); // hourly styling refresh
  try { processStatusChanges(sheet); } catch (e) {}
  try { sendCallReminders(sheet); } catch (e) {}
  maybeSendDailyReport(); // one visitor digest per day, after REPORT_HOUR
}

/* --------------------- STATUS ENGINE (your "buttons") --------------------- */

// Runs hourly: compares each booking's Meeting Status dropdown to the hidden
// Processed Status column. When YOU flip a status, the engine reacts once:
//   Rescheduled -> emails the guest a rebooking link + resets their reminders
//   No-show     -> "sorry we missed you" rebook email + notifies you
//   Showed      -> Meta CAPI 'CallShowed' event (mid-funnel quality signal)
//   Closed - Won-> Meta CAPI 'Purchase' with Deal Value + notifies you
//   Deal Lost   -> logged only (kept out of the pixel so it never optimizes for losses)
function processStatusChanges(sheet) {
  if (sheet.getLastRow() < 2) return;
  var n = sheet.getLastRow() - 1;
  var data = sheet.getRange(2, 1, n, BOOKING_HEADERS.length).getValues();
  var iStatus = BOOKING_HEADERS.indexOf('Meeting Status');
  var iProc = BOOKING_HEADERS.indexOf('Processed Status');
  var iName = BOOKING_HEADERS.indexOf('Guest Name');
  var iEmail = BOOKING_HEADERS.indexOf('Guest Email');
  var iDate = BOOKING_HEADERS.indexOf('Call Date');
  var iTime = BOOKING_HEADERS.indexOf('Time');
  var iValue = BOOKING_HEADERS.indexOf('Deal Value');
  var iRem = BOOKING_HEADERS.indexOf('Reminded');

  for (var r = 0; r < n; r++) {
    var status = String(data[r][iStatus] || '');
    var processed = String(data[r][iProc] || '');
    if (!status || status === processed) continue;
    var name = String(data[r][iName] || 'there');
    var first = name.split(' ')[0];
    var email = String(data[r][iEmail] || '');
    var when = data[r][iDate] + ' at ' + data[r][iTime];

    try {
      if (status === 'Rescheduled') {
        sheet.getRange(r + 2, iRem + 1).setValue(''); // restart reminder cycle
        if (email) {
          MailApp.sendEmail({
            to: email,
            subject: 'Rescheduling your TransferringUP strategy call',
            body: 'Hey ' + first + ',\n\nNo problem at all about ' + when + '. Grab a new time here and we will pick right back up:\n' + CONFIG.BOOKING_PAGE + '\n\nTalk soon,\nAjay\nTransferringUP',
          });
        }
      } else if (status === 'No-show') {
        // Teach Meta who ghosts: value-0 custom event, used as an exclusion
        // audience so the pixel stops finding people who book and vanish.
        sendMetaConversion('NoShow', email, 0);
        logPixelTraining(email, 'NoShow', 0);
        if (email) {
          MailApp.sendEmail({
            to: email,
            subject: 'We missed you today',
            body: 'Hey ' + first + ',\n\nSorry we missed each other for your call (' + when + '). Life happens. If you are still serious about your transfer, grab a new time here:\n' + CONFIG.BOOKING_PAGE + '\n\nAjay\nTransferringUP',
          });
        }
        MailApp.sendEmail({ to: CONFIG.NOTIFY_EMAIL, subject: '\uD83D\uDC7B No-show: ' + name, body: name + ' (' + email + ') no-showed ' + when + '. Rebook email sent automatically.' });
      } else if (status === 'Showed') {
        sendMetaConversion('CallShowed', email, 0);
      } else if (status === 'Closed - Won') {
        var val = Number(data[r][iValue]) || CONFIG.DEAL_VALUE_DEFAULT;
        sendMetaConversion('Purchase', email, val);
        MailApp.sendEmail({ to: CONFIG.NOTIFY_EMAIL, subject: '\uD83D\uDCB0 CLOSED: ' + name + ' ($' + val + ')', body: name + ' marked Closed - Won at $' + val + '. Conversion sent to Meta' + (getCapiToken() ? '.' : ' (SKIPPED: no META_CAPI_TOKEN set in Script Properties).') });
      }
    } catch (actErr) {}
    sheet.getRange(r + 2, iProc + 1).setValue(status);
  }
}

// Reminders for upcoming calls, sent by the hourly run and stamped in the
// hidden Reminded column so nothing doubles: one the day before, one day-of.
function sendCallReminders(sheet) {
  if (sheet.getLastRow() < 2) return;
  var n = sheet.getLastRow() - 1;
  var data = sheet.getRange(2, 1, n, BOOKING_HEADERS.length).getValues();
  var iStatus = BOOKING_HEADERS.indexOf('Meeting Status');
  var iName = BOOKING_HEADERS.indexOf('Guest Name');
  var iEmail = BOOKING_HEADERS.indexOf('Guest Email');
  var iDate = BOOKING_HEADERS.indexOf('Call Date');
  var iTime = BOOKING_HEADERS.indexOf('Time');
  var iRem = BOOKING_HEADERS.indexOf('Reminded');
  var now = new Date();

  // Which leads already did the /prep page (any prep field counts), so the
  // prep-nudge email below only chases the ones who skipped it.
  var prepDoneByEmail = {};
  try {
    var lt = dashTable(CONFIG.LEADS_SHEET);
    var lE = lt.headers.indexOf('email');
    var lCols = ['callGoal', 'uploads', 'lastCycleResults', 'currentSchoolStory'].map(function (c) { return lt.headers.indexOf(c); });
    lt.rows.forEach(function (lr) {
      var em = String(lr[lE] || '').trim().toLowerCase();
      if (!em) return;
      var done = lCols.some(function (ci) { return ci !== -1 && String(lr[ci] || '').trim(); });
      if (done) prepDoneByEmail[em] = true;
    });
  } catch (pe) {}

  for (var r = 0; r < n; r++) {
    var status = String(data[r][iStatus] || '');
    if (status !== 'Booked' && status !== 'Rescheduled') continue;
    var email = String(data[r][iEmail] || '');
    if (!email) continue;
    var callAt;
    try {
      callAt = new Date(String(data[r][iDate]).replace(/^\w+, /, '') + ' ' + data[r][iTime]);
    } catch (perr) { continue; }
    if (!callAt || isNaN(callAt.getTime()) || callAt < now) continue;
    var hoursOut = (callAt.getTime() - now.getTime()) / 3600000;
    var stamped = String(data[r][iRem] || '');
    var first = String(data[r][iName] || 'there').split(' ')[0];
    var when = data[r][iDate] + ' at ' + data[r][iTime];

    var sameDay = callAt.toDateString() === now.toDateString();

    // Booked 30h+ out but skipped /prep: one nudge asking for the info, sent
    // by the first hourly run after the booking lands. Next-day bookings skip
    // this (the 24h email below already carries the prep link), so nobody
    // gets two emails in one day.
    if (hoursOut > 30 && stamped.indexOf('prep') === -1) {
      if (!prepDoneByEmail[email.trim().toLowerCase()]) {
        var prepLink = CONFIG.PREP_PAGE + '?email=' + encodeURIComponent(email);
        var bodyPrep = 'Hey ' + first + ',\n\nYou are locked in for ' + when + '. One thing before we talk.\n\nThere is a 2-minute prep page you have not filled out yet. It is the difference between a call spent collecting your stats and a call spent building your strategy.\n\nDrop your transcript, your goals, and what happened last cycle here:\n' + prepLink + '\n\nEverything you give us now is a question we do not spend your call time on.\n\nAjay\nTransferringUP';
        MailApp.sendEmail({
          to: email,
          subject: 'Locked in for ' + data[r][iDate] + ' - one thing before your call',
          body: bodyPrep,
          htmlBody: bodyPrep.replace(/\n/g, '<br>') + openPixel(email, 'prep-nudge'),
        });
      }
      sheet.getRange(r + 2, iRem + 1).setValue(stamped ? stamped + ',prep' : 'prep');
      stamped = stamped ? stamped + ',prep' : 'prep';
    }

    if (hoursOut <= 30 && hoursOut > 6 && !sameDay && stamped.indexOf('24h') === -1) {
      var body24 = 'Hey ' + first + ',\n\nYour strategy call is ' + when + '. We will map the exact path to your target schools.\n\nCan you still make it? Just reply "yes" to this email and you are locked in.\n\nTwo minutes of prep doubles what you get out of the call - share your transcript and goals here:\n' + CONFIG.PREP_PAGE + '\n\nIf something came up, no stress - grab a new time instead:\n' + CONFIG.BOOKING_PAGE + '\n\nSee you then,\nAjay\nTransferringUP';
      MailApp.sendEmail({
        to: email,
        subject: 'Your TransferringUP call is tomorrow - can you still make it?',
        body: body24,
        htmlBody: body24.replace(/\n/g, '<br>') + openPixel(email, '24h'),
      });
      sheet.getRange(r + 2, iRem + 1).setValue(stamped ? stamped + ',24h' : '24h');
    } else if (sameDay && now.getHours() >= 8 && stamped.indexOf('day') === -1) {
      var bodyDay = 'Hey ' + first + ',\n\nWe are on for today at ' + data[r][iTime] + '. Still good to go? Reply "yes" and I will make sure everything is ready for you.\n\nThe meeting link is in your calendar invite. Grab somewhere quiet with 30-45 minutes blocked.\n\nNeed to move it? Rebook here so your spot goes to another student:\n' + CONFIG.BOOKING_PAGE + '\n\nAjay\nTransferringUP';
      MailApp.sendEmail({
        to: email,
        subject: 'Today: your strategy call (' + data[r][iTime] + ') - reply to confirm',
        body: bodyDay,
        htmlBody: bodyDay.replace(/\n/g, '<br>') + openPixel(email, 'day-of'),
      });
      sheet.getRange(r + 2, iRem + 1).setValue(stamped ? stamped + ',day' : 'day');
    }
  }
}

/* ---------------------- META CONVERSIONS API (server) --------------------- */

function getCapiToken() {
  try { return PropertiesService.getScriptProperties().getProperty('META_CAPI_TOKEN') || ''; } catch (e) { return ''; }
}

function sha256hex(s) {
  var raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(s).trim().toLowerCase());
  return raw.map(function (b) { var v = (b < 0 ? b + 256 : b).toString(16); return v.length === 1 ? '0' + v : v; }).join('');
}

// Server-side conversion, matched on hashed email (+ phone when available for a
// better match). Skips silently until a META_CAPI_TOKEN is saved in Script
// Properties, so it is always safe to call. A stable event_id per email+event
// means re-firing the SAME client never double-counts (Meta dedupes on it),
// which makes bulk pixel-training from past clients idempotent. Returns true on
// a 200 from Meta so callers can report success.
function sendMetaConversion(eventName, email, value, phone) {
  var token = getCapiToken();
  if (!token || !email) return false;
  var em = sha256hex(email);
  var ud = { em: [em] };
  if (phone) {
    var ph = String(phone).replace(/[^0-9]/g, '');
    if (ph.length === 10) ph = '1' + ph;
    if (ph) ud.ph = [sha256hex(ph)];
  }
  var payload = {
    data: [{
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventName + '_' + em.substring(0, 20),
      action_source: 'system_generated',
      user_data: ud,
      custom_data: value ? { currency: 'USD', value: value } : {},
    }],
  };
  try {
    var resp = UrlFetchApp.fetch('https://graph.facebook.com/v21.0/' + CONFIG.META_PIXEL_ID + '/events?access_token=' + token, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    });
    return resp.getResponseCode() === 200;
  } catch (e) { return false; }
}

/** Bulk pixel training: fire Purchase (+ QualifiedLead) conversions for a list
 * of past/current client emails so Meta learns who your real buyers are and
 * builds lookalikes from them. Enriches phone from the Leads tab when present.
 * Idempotent thanks to the stable event_id, so re-running is safe. */
function apiTrainPixel(p) {
  if (!getCapiToken()) {
    return { ok: false, error: 'no_token', message: 'Set META_CAPI_TOKEN in Project Settings > Script Properties first, then try again.', sent: 0 };
  }
  var list = String(p.emails || '').split(/[\s,;]+/);
  var event = p.event || 'Purchase';
  // NoShow is a negative signal: never let it inherit the deal value.
  var value = event === 'NoShow' ? (Number(p.value) || 0) : (Number(p.value) || CONFIG.DEAL_VALUE_DEFAULT);
  var phoneByEmail = {};
  try {
    var leads = dashTable(CONFIG.LEADS_SHEET);
    var iE = leads.headers.indexOf('email'), iP = leads.headers.indexOf('phone');
    if (iE !== -1) leads.rows.forEach(function (r) {
      var e = String(r[iE] || '').trim().toLowerCase();
      if (e) phoneByEmail[e] = iP !== -1 ? r[iP] : '';
    });
  } catch (le) {}
  var sent = 0, failed = [], seen = {};
  for (var i = 0; i < list.length; i++) {
    var em = String(list[i]).trim().toLowerCase();
    if (em.indexOf('@') < 1 || seen[em]) continue;
    seen[em] = 1;
    var ok = sendMetaConversion(event, em, value, phoneByEmail[em] || '');
    if (event === 'Purchase') sendMetaConversion('QualifiedLead', em, value, phoneByEmail[em] || '');
    if (ok) { sent++; logPixelTraining(em, event, value); } else { failed.push(em); }
  }
  return { ok: true, sent: sent, failed: failed, event: event, value: value };
}

/** Mark a call outcome from /hq: sets the person's latest Bookings row to the
 * given Meeting Status and runs the status engine right away, so the exact
 * same things happen as flipping the dropdown in the sheet (No-show -> rebook
 * email + NoShow pixel event, Showed -> CallShowed, Closed - Won -> Purchase).
 * If the person has no Bookings row, the pixel event still fires so Meta
 * learns either way. */
function apiOutcome(p) {
  var status = String(p.status || '');
  if (STATUS_OPTIONS.indexOf(status) === -1) return { ok: false, error: 'bad_status' };
  var email = String(p.email || '').trim().toLowerCase();
  if (email.indexOf('@') < 1) return { ok: false, error: 'bad_email' };
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.BOOKINGS_SHEET);
  var iEmail = BOOKING_HEADERS.indexOf('Guest Email');
  var iStatus = BOOKING_HEADERS.indexOf('Meeting Status');
  var found = -1;
  if (sheet && sheet.getLastRow() > 1) {
    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, BOOKING_HEADERS.length).getValues();
    for (var r = data.length - 1; r >= 0; r--) { // latest booking wins
      if (String(data[r][iEmail] || '').trim().toLowerCase() === email) { found = r; break; }
    }
  }
  if (found === -1) {
    if (status === 'No-show') { sendMetaConversion('NoShow', email, 0); logPixelTraining(email, 'NoShow', 0); }
    else if (status === 'Showed') sendMetaConversion('CallShowed', email, 0);
    else if (status === 'Closed - Won') { sendMetaConversion('Purchase', email, CONFIG.DEAL_VALUE_DEFAULT); logPixelTraining(email, 'Purchase', CONFIG.DEAL_VALUE_DEFAULT); }
    return { ok: true, status: status, booking: false };
  }
  sheet.getRange(found + 2, iStatus + 1).setValue(status);
  processStatusChanges(sheet); // react now instead of on the next hourly run
  return { ok: true, status: status, booking: true };
}

function logPixelTraining(email, event, value) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName('Pixel Training') || ss.insertSheet('Pixel Training');
    if (sh.getLastRow() === 0) {
      sh.getRange(1, 1, 1, 4).setValues([['When', 'Email', 'Event', 'Value']]).setFontWeight('bold');
      sh.setFrozenRows(1);
    }
    sh.appendRow([new Date(), email, event, value]);
  } catch (e) {}
}

/* ------------------------- DAILY VISITOR REPORT ------------------------- */

/** Piggybacks on the hourly booking sync: the first run after REPORT_HOUR each
 * day sends one digest email covering the previous 24 hours of traffic. */
function maybeSendDailyReport() {
  try {
    var props = PropertiesService.getScriptProperties();
    var tz = Session.getScriptTimeZone();
    var now = new Date();
    var today = Utilities.formatDate(now, tz, 'yyyy-MM-dd');
    if (props.getProperty('lastVisitReport') === today) return;
    if (Number(Utilities.formatDate(now, tz, 'H')) < CONFIG.REPORT_HOUR) return;
    sendVisitReport(24);
    props.setProperty('lastVisitReport', today);
  } catch (e) {}
}

function reportTh(t) { return '<th style="text-align:left;padding:8px;border:1px solid #e4e0d8">' + t + '</th>'; }
function reportTd(t) { return '<td style="vertical-align:top;padding:8px;border:1px solid #e4e0d8">' + t + '</td>'; }

function countRecent(sheet, cutoff) {
  if (!sheet || sheet.getLastRow() < 2) return 0;
  var vals = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  var n = 0;
  vals.forEach(function (r) { if (r[0] instanceof Date && r[0] > cutoff) n++; });
  return n;
}

/** The report itself: every visit in the window with when / who (matched
 * name+email where known) / where (city + network/school + IP) / how long /
 * what they read, plus roll-up stats and lead + subscriber counts. */
function sendVisitReport(hoursBack) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.VISITS_SHEET);
  var tz = Session.getScriptTimeZone();
  var cutoff = new Date(Date.now() - hoursBack * 3600000);

  var rows = [];
  if (sheet && sheet.getLastRow() > 1) {
    rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, VISIT_HEADERS.length).getValues()
      .filter(function (r) { return r[0] instanceof Date && r[0] > cutoff; })
      .sort(function (a, b) { return b[0] - a[0]; });
  }

  var visitors = {};
  var known = 0, totalMin = 0;
  rows.forEach(function (r) {
    visitors[r[19] || r[18] || Math.random()] = true;
    if (r[2] === 'Known') known++;
    totalMin += Number(r[4]) || 0;
  });
  var uniq = Object.keys(visitors).length;
  var avgMin = rows.length ? Math.round(totalMin / rows.length * 10) / 10 : 0;
  var leads = countRecent(ss.getSheetByName(CONFIG.LEADS_SHEET), cutoff);
  var subs = countRecent(ss.getSheetByName(CONFIG.NEWSLETTER_SHEET), cutoff);

  var html = '<div style="font-family:Arial,Helvetica,sans-serif;max-width:760px">';
  html += '<div style="background:' + NAVY + ';color:#fff;padding:16px 20px;border-radius:6px 6px 0 0">' +
    '<div style="font-size:11px;letter-spacing:2px;opacity:.7">TRANSFERRINGUP</div>' +
    '<div style="font-size:19px;font-weight:bold;margin-top:3px">Daily website report</div>' +
    '<div style="font-size:12px;opacity:.75;margin-top:2px">' +
    Utilities.formatDate(new Date(), tz, 'EEEE, MMMM d') + ' \u00B7 last ' + hoursBack + ' hours</div></div>';

  function stat(n, label, color) {
    return '<td style="padding:12px 6px;text-align:center;border:1px solid #e4e0d8">' +
      '<div style="font-size:22px;font-weight:bold;color:' + (color || NAVY) + '">' + n + '</div>' +
      '<div style="font-size:10px;color:#888;letter-spacing:1px;margin-top:2px">' + label + '</div></td>';
  }
  html += '<table width="100%" cellspacing="0" style="border-collapse:collapse"><tr>' +
    stat(rows.length, 'VISITS') + stat(uniq, 'VISITORS') + stat(known, 'KNOWN', '#7a0000') +
    stat(avgMin + 'm', 'AVG TIME') + stat(leads, 'NEW LEADS', '#188038') + stat(subs, 'NEW SUBS', '#f9ab00') +
    '</tr></table>';

  if (!rows.length) {
    html += '<p style="color:#666;font-size:13px;padding:14px 4px">No tracked visits in this window.</p>';
  } else {
    html += '<table width="100%" cellspacing="0" style="border-collapse:collapse;font-size:12px;margin-top:10px">';
    html += '<tr style="background:#f4f1ea;color:#555">' + reportTh('When') + reportTh('Who') +
      reportTh('From') + reportTh('Time') + reportTh('Pages viewed') + '</tr>';
    rows.slice(0, 40).forEach(function (r) {
      var who = r[1];
      if (r[2] === 'Known') who = '<b style="color:#7a0000">' + r[1] + '</b>';
      else if (r[2] === 'Returning') who = r[1] + ' <span style="color:#4285f4">(visit ' + r[3] + ')</span>';
      var from = [r[7], r[8]].filter(function (x) { return x; }).join(', ') || 'Unknown';
      if (r[10]) from += '<br><span style="color:#999">' + r[10] + '</span>';
      if (r[11]) from += '<br><span style="color:#bbb">' + r[11] + '</span>';
      html += '<tr>' +
        reportTd(Utilities.formatDate(r[0], tz, 'EEE h:mm a')) +
        reportTd(who) +
        reportTd(from) +
        reportTd((r[4] || 0) + ' min') +
        reportTd('<span style="color:#666">' + String(r[6] || '').slice(0, 140) + '</span>') +
        '</tr>';
    });
    html += '</table>';
    if (rows.length > 40) {
      html += '<p style="color:#999;font-size:11px">+ ' + (rows.length - 40) + ' more on the Visits tab</p>';
    }
  }
  html += '<p style="font-size:11px;color:#999;margin-top:14px">Known visitors are matched because ' +
    'they submitted the form or joined the newsletter in that browser. Full detail on the Visits tab.</p></div>';

  MailApp.sendEmail({
    to: CONFIG.NOTIFY_EMAIL,
    subject: '\uD83D\uDD75\uFE0F Daily website report: ' + rows.length + ' visits, ' + known + ' known' +
      (leads ? ', ' + leads + ' new lead' + (leads > 1 ? 's' : '') : ''),
    htmlBody: html,
    body: rows.length + ' visits in the last ' + hoursBack + ' hours. View as HTML for the full table.',
  });
}

/* ----------------------------- WEB DASHBOARD ----------------------------- */

/** Private command center: open the /exec URL with ?key=DASHBOARD_KEY.
 * Read-only, auto-refreshes every 5 minutes, safe to bookmark on a phone.
 * Without the key this returns a plain "Not found." (the /exec URL itself is
 * public because the website posts to it). */
function doGet(e) {
  var p = (e && e.parameter) || {};
  // Email-open tracking pixel: no key required (logs only, returns nothing).
  if (p.open) {
    try { logEmailOpen(p.open, p.t || ''); } catch (oerr) {}
    return ContentService.createTextOutput('');
  }
  if (p.key !== CONFIG.DASHBOARD_KEY) {
    return ContentService.createTextOutput('Not found.');
  }
  try {
    // JSON API for the site's /admin command center (fast, CORS-friendly).
    // Pixel training fires live conversions, so it must never be cached.
    if (p.api === 'trainpixel') {
      return ContentService.createTextOutput(JSON.stringify(apiTrainPixel(p)))
        .setMimeType(ContentService.MimeType.JSON);
    }
    // Call outcomes write to the sheet + fire conversions: never cached.
    if (p.api === 'outcome') {
      return ContentService.createTextOutput(JSON.stringify(apiOutcome(p)))
        .setMimeType(ContentService.MimeType.JSON);
    }
    if (p.api) {
      var acache = CacheService.getScriptCache();
      var akey = 'api_' + p.api + '_' + (p.email || '') + '_' + (p.school || '').slice(0, 60);
      var out = p.fresh ? null : acache.get(akey);
      if (!out) {
        out = JSON.stringify(
          p.api === 'person' ? apiPerson(p.email)
          : p.api === 'news' ? apiNews(p.school)
          : apiSummary()
        );
        try { acache.put(akey, out, p.api === 'news' ? 21600 : 60); } catch (ce) {}
      }
      return ContentService.createTextOutput(out).setMimeType(ContentService.MimeType.JSON);
    }
    // 90s HTML cache: repeat loads render instantly instead of re-reading
    // every sheet. Add &fresh=1 to any URL to force a live rebuild.
    var cache = CacheService.getScriptCache();
    var ckey = p.person ? 'pd_' + p.person : p.profile ? 'pf_' + p.profile : 'dash_home';
    var body = p.fresh ? null : cache.get(ckey);
    if (!body) {
      body = p.profile ? renderProfileDetail(p.profile)
        : p.person ? renderPersonDetail(p.person)
        : renderDashboard();
      try { cache.put(ckey, body, 90); } catch (cerr) {}
    }
    return HtmlService.createHtmlOutput(body)
      .setTitle('TransferringUP Command Center')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  } catch (err) {
    return ContentService.createTextOutput('Dashboard error: ' + String(err));
  }
}

/** The deployed /exec URL, for building in-dashboard links (profile drill-down). */
function execUrl() {
  try { return ScriptApp.getService().getUrl(); } catch (e) { return ''; }
}
function profileLink(vid) {
  return execUrl() + '?key=' + encodeURIComponent(CONFIG.DASHBOARD_KEY) +
    '&profile=' + encodeURIComponent(vid);
}
function personLink(email) {
  return execUrl() + '?key=' + encodeURIComponent(CONFIG.DASHBOARD_KEY) +
    '&person=' + encodeURIComponent(String(email || '').trim().toLowerCase());
}

/** Stamp an email-open onto the lead row (called by the tracking pixel). */
function logEmailOpen(tok, which) {
  var email = '';
  try { email = Utilities.newBlob(Utilities.base64DecodeWebSafe(tok)).getDataAsString(); } catch (derr) { return; }
  email = String(email).trim().toLowerCase();
  if (!email) return;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.LEADS_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return;
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var iEmail = headers.indexOf('email');
  if (iEmail === -1) return;
  var iOpens = headers.indexOf('emailOpens');
  if (iOpens === -1) {
    iOpens = headers.length;
    sheet.getRange(1, iOpens + 1).setValue('emailOpens').setFontWeight('bold');
  }
  var col = sheet.getRange(2, iEmail + 1, sheet.getLastRow() - 1, 1).getValues();
  for (var i = col.length - 1; i >= 0; i--) {
    if (String(col[i][0]).trim().toLowerCase() === email) {
      var cell = sheet.getRange(i + 2, iOpens + 1);
      var prev = String(cell.getValue() || '');
      var stamp = (which || 'email') + ' opened ' +
        Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMM d h:mm a');
      if (prev.indexOf(stamp) === -1) cell.setValue(prev ? prev + ' | ' + stamp : stamp);
      break;
    }
  }
}

/** 1x1 tracking pixel img for reminder emails (keyless open logger). */
function openPixel(email, which) {
  var tok = Utilities.base64EncodeWebSafe(String(email || '').trim().toLowerCase());
  return '<img src="' + execUrl() + '?open=' + tok + '&t=' + encodeURIComponent(which) +
    '" width="1" height="1" style="display:none" alt="">';
}
function dashHome() {
  return execUrl() + '?key=' + encodeURIComponent(CONFIG.DASHBOARD_KEY);
}

function dashEsc(s) {
  return String(s === undefined || s === null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Shared dark-theme stylesheet for the dashboard + profile pages. */
function dashCss() {
  return '' +
    'body{margin:0;background:#0a1520;color:#e8ecf1;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif}' +
    '.wrap{max-width:1150px;margin:0 auto;padding:18px 14px 60px}' +
    'h1{font-size:17px;letter-spacing:.06em;margin:6px 0 2px}' +
    '.sub{font-size:11.5px;color:#8fa1b8}' +
    '.sub a{color:#d4aa00;text-decoration:none}' +
    '.tiles{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}' +
    '.tile{flex:1 1 96px;min-width:96px;background:#121f33;border:1px solid rgba(255,255,255,.07);border-radius:8px;padding:10px 12px}' +
    '.tile b{display:block;font-size:23px;font-weight:700}' +
    '.tile span{display:block;font-size:9.5px;letter-spacing:.09em;color:#8fa1b8;margin-top:3px;text-transform:uppercase}' +
    '.card{background:#101c2e;border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:14px 16px;margin-top:16px;overflow-x:auto}' +
    '.card h2{font-size:11px;letter-spacing:.12em;color:#d4aa00;margin:0 0 10px;text-transform:uppercase}' +
    'table{width:100%;border-collapse:collapse;font-size:12.5px;white-space:nowrap}' +
    'th{text-align:left;font-size:9.5px;letter-spacing:.08em;color:#8fa1b8;text-transform:uppercase;padding:5px 8px;border-bottom:1px solid rgba(255,255,255,.12)}' +
    'td{padding:7px 8px;border-bottom:1px solid rgba(255,255,255,.05);vertical-align:top}' +
    '.chip{display:inline-block;padding:1px 8px;border-radius:9px;font-size:10.5px;font-weight:700}' +
    '.dim{color:#8fa1b8}.small{font-size:11px}' +
    'a.view{color:#d4aa00;text-decoration:none;font-weight:700}' +
    '.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:0 16px}' +
    '@media(max-width:640px){.tile b{font-size:19px}}';
}

function dashTable(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh || sh.getLastRow() < 2) return { headers: [], rows: [] };
  var vals = sh.getDataRange().getValues();
  return { headers: vals[0], rows: vals.slice(1) };
}

function renderDashboard() {
  var tz = Session.getScriptTimeZone();
  var now = new Date();
  var todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var cut7 = new Date(now.getTime() - 7 * 86400000);

  var leads = dashTable(CONFIG.LEADS_SHEET);
  var visits = dashTable(CONFIG.VISITS_SHEET);
  var bookings = dashTable(CONFIG.BOOKINGS_SHEET);
  var subs = dashTable(CONFIG.NEWSLETTER_SHEET);

  function lval(r, name) { var i = leads.headers.indexOf(name); return i === -1 ? '' : r[i]; }
  function fmt(d, p) { return d instanceof Date ? Utilities.formatDate(d, tz, p) : dashEsc(d); }

  // ---------- lead stats ----------
  var hot = 0, warm = 0, cool = 0, ready = 0, leads7 = 0, scoreSum = 0, scoreN = 0;
  leads.rows.forEach(function (r) {
    var t = lval(r, 'leadTier');
    if (t === 'Hot') hot++; else if (t === 'Warm') warm++; else if (t === 'Cool') cool++;
    if (String(lval(r, 'investmentReadiness')).indexOf('Ready') === 0) ready++;
    var ts = lval(r, 'timestamp');
    if (ts instanceof Date && ts > cut7) leads7++;
    var sc = Number(lval(r, 'leadScore'));
    if (sc) { scoreSum += sc; scoreN++; }
  });
  var avgScore = scoreN ? Math.round(scoreSum / scoreN) : 0;

  // ---------- booking stats ----------
  var bi = {};
  ['Call Date', 'Time', 'Guest Name', 'Guest Email', 'Meeting Status'].forEach(function (h) {
    bi[h] = bookings.headers.indexOf(h);
  });
  var showed = 0, noshow = 0, upcoming = [];
  bookings.rows.forEach(function (r) {
    var st = r[bi['Meeting Status']];
    if (st === 'Showed') showed++;
    if (st === 'No-show') noshow++;
    try {
      var d = new Date(String(r[bi['Call Date']]).replace(/^\w+, /, '') + ' ' + r[bi['Time']]);
      if (!isNaN(d.getTime()) && d >= todayStart && st !== 'Canceled') upcoming.push({ d: d, r: r });
    } catch (perr) {}
  });
  upcoming.sort(function (a, b) { return a.d - b.d; });
  var showRate = (showed + noshow) ? Math.round(showed / (showed + noshow) * 100) + '%' : '-';

  // ---------- visit stats ----------
  var vToday = 0, v7 = 0, known7 = 0, min7 = 0, uniq7 = {};
  var pageCounts = {}, srcCounts = {}, devCounts = {};
  visits.rows.forEach(function (r) {
    var d = r[0];
    if (!(d instanceof Date)) return;
    if (d >= todayStart) vToday++;
    if (d > cut7) {
      v7++;
      if (r[2] === 'Known') known7++;
      min7 += Number(r[4]) || 0;
      uniq7[r[19] || r[18] || String(d.getTime())] = true;
      String(r[6] || '').split(' \u2192 ').forEach(function (p) {
        p = p.trim(); if (p) pageCounts[p] = (pageCounts[p] || 0) + 1;
      });
      var src = String(r[14] || '');
      if (!src && r[13]) {
        var m = /https?:\/\/([^\/]+)/.exec(String(r[13]));
        src = m ? m[1] : String(r[13]);
      }
      srcCounts[src || 'Direct'] = (srcCounts[src || 'Direct'] || 0) + 1;
      devCounts[r[12] || '?'] = (devCounts[r[12] || '?'] || 0) + 1;
    }
  });
  var uniqN = Object.keys(uniq7).length;
  var avgMin7 = v7 ? Math.round(min7 / v7 * 10) / 10 : 0;
  var convRate = v7 ? (Math.round(leads7 / v7 * 1000) / 10) + '%' : '-';
  var profiles = computeProfiles(visits.rows);

  function topOf(obj, n) {
    return Object.keys(obj).map(function (k) { return [k, obj[k]]; })
      .sort(function (a, b) { return b[1] - a[1]; }).slice(0, n);
  }

  // ---------- building blocks ----------
  var CRIMSON = '#c96a6a', GOLD = '#d4aa00';
  var css = dashCss();

  function tile(n, label, color) {
    return '<div class="tile"><b style="color:' + (color || '#e8ecf1') + '">' + n + '</b><span>' + label + '</span></div>';
  }
  function chip(text, bg, fg) {
    return '<span class="chip" style="background:' + bg + ';color:' + (fg || '#fff') + '">' + dashEsc(text) + '</span>';
  }
  function tierChip(t) {
    var bg = t === 'Hot' ? '#34a853' : t === 'Warm' ? '#f9ab00' : t === 'Likely spam' ? '#ea4335' : '#4285f4';
    return chip(t || '-', bg);
  }

  var html = '<meta http-equiv="refresh" content="300"><style>' + css + '</style><div class="wrap">';
  html += '<h1>TRANSFERRINGUP \u00B7 COMMAND CENTER</h1>' +
    '<div class="sub">Live from the lead sheet \u00B7 refreshed ' + fmt(now, 'EEE, MMM d h:mm a') +
    ' \u00B7 auto-reloads every 5 min \u00B7 <a href="' + CONFIG.SHEET_URL + '" target="_blank">open the raw sheet</a></div>';

  // tiles: leads
  html += '<div class="tiles">' +
    tile(leads.rows.length, 'Total leads') + tile(hot, 'Hot', '#34a853') + tile(warm, 'Warm', '#f9ab00') +
    tile(cool, 'Cool', '#6ea8fe') + tile(avgScore, 'Avg score') + tile(ready, 'Ready to invest', CRIMSON) +
    tile(leads7, 'Leads (7d)', GOLD) + '</div>';
  // tiles: calls
  html += '<div class="tiles">' +
    tile(bookings.rows.length, 'Calls booked') + tile(upcoming.length, 'Upcoming', GOLD) +
    tile(showed, 'Showed', '#34a853') + tile(noshow, 'No-shows', '#ea4335') + tile(showRate, 'Show rate') + '</div>';
  // tiles: traffic
  html += '<div class="tiles">' +
    tile(vToday, 'Visits today', '#34a853') + tile(v7, 'Visits (7d)') + tile(uniqN, 'Unique (7d)') +
    tile(known7, 'Known (7d)', CRIMSON) + tile(avgMin7 + 'm', 'Avg visit') +
    tile(convRate, 'Visit>lead (7d)', GOLD) + tile(profiles.length, 'Profiles', '#b06ad4') +
    tile(subs.rows.length, 'Subscribers', '#f9ab00') + '</div>';

  // ---------- PEOPLE: one row per human, click the name for the full profile ----------
  var bstat = {};
  bookings.rows.forEach(function (r) {
    var em = String(r[bi['Guest Email']] || '').trim().toLowerCase();
    if (em) bstat[em] = String(r[bi['Meeting Status']] || 'Booked');
  });
  function statusChip(st) {
    if (!st) return '<span class="dim small">-</span>';
    var bg = st === 'Showed' ? '#34a853' : st === 'Closed - Won' ? '#d4aa00'
      : st === 'No-show' ? '#ea4335' : st === 'Canceled' ? '#5f6b7a' : '#4285f4';
    return chip(st, bg, st === 'Closed - Won' ? '#000' : '#fff');
  }
  html += '<div class="card"><h2>People \u00B7 click a name for their full profile</h2>';
  if (!leads.rows.length) html += '<div class="dim small">No one yet.</div>';
  else {
    html += '<table><tr><th>When</th><th>Name</th><th>Tier</th><th>Pipeline</th><th>School</th><th>Wealth</th><th>Funding answer</th><th>Call</th><th>Score</th></tr>';
    leads.rows.slice(-100).reverse().forEach(function (r) {
      var em = String(lval(r, 'email') || '').trim().toLowerCase();
      html += '<tr><td class="small">' + fmt(lval(r, 'timestamp'), 'MMM d') +
        '</td><td><a class="view" href="' + dashEsc(personLink(em)) + '">' + dashEsc(lval(r, 'name') || em || '?') + '</a>' +
        '</td><td>' + tierChip(lval(r, 'leadTier')) +
        '</td><td class="small">' + dashEsc(String(lval(r, 'pipelineTier')).replace(/Tier (\d) - /, 'T$1 ')) +
        '</td><td class="small">' + dashEsc(String(lval(r, 'currentSchool') || lval(r, 'highSchool')).slice(0, 28)) +
        '</td><td class="small">' + dashEsc(String(lval(r, 'zipWealthTier')).replace(' area', '')) +
        '</td><td class="small">' + dashEsc(String(lval(r, 'fundingSource')).slice(0, 30)) +
        '</td><td>' + statusChip(bstat[em]) +
        '</td><td><b>' + dashEsc(lval(r, 'leadScore')) + '</b></td></tr>';
    });
    html += '</table>';
  }
  html += '</div>';

  // upcoming calls
  html += '<div class="card"><h2>Upcoming calls</h2>';
  if (!upcoming.length) html += '<div class="dim small">Nothing scheduled.</div>';
  else {
    html += '<table><tr><th>When</th><th>Guest</th><th>Email</th><th>Status</th></tr>';
    upcoming.slice(0, 10).forEach(function (u) {
      html += '<tr><td>' + fmt(u.d, 'EEE, MMM d \u00B7 h:mm a') + '</td><td><a class="view" href="' +
        dashEsc(personLink(u.r[bi['Guest Email']])) + '"><b>' + dashEsc(u.r[bi['Guest Name']]) +
        '</b></a></td><td class="dim">' + dashEsc(u.r[bi['Guest Email']]) + '</td><td>' +
        chip(u.r[bi['Meeting Status']] || 'Booked', '#4285f4') + '</td></tr>';
    });
    html += '</table>';
  }
  html += '</div>';

  // hot leads
  var hotRows = leads.rows.filter(function (r) { return lval(r, 'leadTier') === 'Hot'; }).slice(-8).reverse();
  html += '<div class="card"><h2>Hot leads</h2>';
  if (!hotRows.length) html += '<div class="dim small">No hot leads yet.</div>';
  else {
    html += '<table><tr><th>When</th><th>Name</th><th>Contact</th><th>School</th><th>Targets</th><th>Investment answer</th><th>Score</th></tr>';
    hotRows.forEach(function (r) {
      html += '<tr><td>' + fmt(lval(r, 'timestamp'), 'MMM d, h:mm a') + '</td><td><a class="view" href="' +
        dashEsc(personLink(lval(r, 'email'))) + '"><b>' + dashEsc(lval(r, 'name')) +
        '</b></a></td><td class="small">' + dashEsc(lval(r, 'phone')) + '<br class="dim">' + dashEsc(lval(r, 'email')) +
        '</td><td>' + dashEsc(lval(r, 'currentSchool') || lval(r, 'highSchool')) +
        '</td><td>' + dashEsc(String(lval(r, 'targetSchools')).slice(0, 40)) +
        '</td><td class="small">' + dashEsc(String(lval(r, 'investmentReadiness')).slice(0, 34)) +
        '</td><td><b style="color:#34a853">' + dashEsc(lval(r, 'leadScore')) + '</b></td></tr>';
    });
    html += '</table>';
  }
  html += '</div>';

  // recent leads
  html += '<div class="card"><h2>Recent leads</h2>';
  if (!leads.rows.length) html += '<div class="dim small">None yet.</div>';
  else {
    html += '<table><tr><th>When</th><th>Tier</th><th>Score</th><th>Name</th><th>Type</th><th>School</th><th>GPA</th><th>Targets</th><th>Cycle</th></tr>';
    leads.rows.slice(-12).reverse().forEach(function (r) {
      html += '<tr><td>' + fmt(lval(r, 'timestamp'), 'MMM d, h:mm a') + '</td><td>' + tierChip(lval(r, 'leadTier')) +
        '</td><td>' + dashEsc(lval(r, 'leadScore')) + '</td><td><a class="view" href="' +
        dashEsc(personLink(lval(r, 'email'))) + '"><b>' + dashEsc(lval(r, 'name')) +
        '</b></a></td><td class="small">' + dashEsc(String(lval(r, 'studentType')).replace(' student', '')) +
        '</td><td>' + dashEsc(lval(r, 'currentSchool') || lval(r, 'highSchool')) +
        '</td><td>' + dashEsc(lval(r, 'collegeGPA') || lval(r, 'highSchoolGPA')) +
        '</td><td>' + dashEsc(String(lval(r, 'targetSchools')).slice(0, 34)) +
        '</td><td class="small">' + dashEsc(lval(r, 'cycle')) + '</td></tr>';
    });
    html += '</table>';
  }
  html += '</div>';

  // live visitor feed
  html += '<div class="card"><h2>Live visitor feed</h2>';
  var vRows = visits.rows.filter(function (r) { return r[0] instanceof Date; })
    .sort(function (a, b) { return b[0] - a[0]; }).slice(0, 20);
  if (!vRows.length) html += '<div class="dim small">No visits tracked yet.</div>';
  else {
    html += '<table><tr><th>When</th><th>Who</th><th>Status</th><th>Where</th><th>Network</th><th>IP</th><th>Time</th><th>Pages</th></tr>';
    vRows.forEach(function (r) {
      var who = r[2] === 'Known'
        ? '<b style="color:' + CRIMSON + '">' + dashEsc(r[1]) + '</b>'
        : dashEsc(r[1]);
      var stChip = r[2] === 'Known' ? chip('Known', '#7a0000') : r[2] === 'Returning'
        ? chip('Visit ' + r[3], '#4285f4') : chip('New', '#5f6b7a');
      html += '<tr><td>' + fmt(r[0], 'EEE h:mm a') + '</td><td>' + who + '</td><td>' + stChip +
        '</td><td>' + dashEsc([r[7], r[8]].filter(function (x) { return x; }).join(', ')) +
        '</td><td class="small dim">' + dashEsc(String(r[10]).slice(0, 26)) +
        '</td><td class="small dim">' + dashEsc(r[11]) +
        '</td><td>' + dashEsc(r[4]) + 'm</td><td class="small dim">' +
        dashEsc(String(r[6]).slice(0, 60)) + '</td></tr>';
    });
    html += '</table>';
  }
  html += '</div>';

  // traffic breakdowns
  function listCard(title, pairs, total) {
    var out = '<div><h2>' + title + '</h2>';
    if (!pairs.length) out += '<div class="dim small">No data yet.</div>';
    else {
      out += '<table>';
      pairs.forEach(function (p) {
        var pct = total ? Math.round(p[1] / total * 100) : 0;
        out += '<tr><td class="small">' + dashEsc(String(p[0]).slice(0, 34)) + '</td><td style="width:52px;text-align:right"><b>' +
          p[1] + '</b> <span class="dim small">' + pct + '%</span></td></tr>';
      });
      out += '</table>';
    }
    return out + '</div>';
  }
  html += '<div class="card"><div class="cols">' +
    listCard('Top pages (7d)', topOf(pageCounts, 8), v7) +
    listCard('Traffic sources (7d)', topOf(srcCounts, 8), v7) +
    listCard('Devices (7d)', topOf(devCounts, 4), v7) +
    '</div></div>';

  // visitor profiles (click any row to open the full dossier)
  html += '<div class="card"><h2>Visitor profiles - click to open the full dossier</h2>';
  if (!profiles.length) html += '<div class="dim small">No profiles yet.</div>';
  else {
    html += '<table><tr><th>Visitor</th><th>Status</th><th>Visits</th><th>Sessions</th><th>Total time</th>' +
      '<th>Top pages (by time)</th><th>Location</th><th>Network</th><th>Arrived via</th><th></th></tr>';
    profiles.slice(0, 25).forEach(function (p) {
      var who = p.status === 'Known' ? '<b style="color:' + CRIMSON + '">' + dashEsc(p.who) + '</b>' : dashEsc(p.who);
      var stChip = p.status === 'Known' ? chip('Known', '#7a0000') : p.status === 'Returning'
        ? chip('Returning', '#4285f4') : chip('New', '#5f6b7a');
      html += '<tr><td>' + who + '</td><td>' + stChip + '</td><td>' + p.visits + '</td><td>' + p.sessions +
        '</td><td><b>' + p.totalMin + 'm</b></td><td class="small dim">' + dashEsc(String(p.topPages).slice(0, 70)) +
        '</td><td class="small">' + dashEsc(String(p.location).slice(0, 26)) +
        '</td><td class="small dim">' + dashEsc(String(p.network).slice(0, 24)) +
        '</td><td class="small">' + dashEsc(p.arrivedVia) +
        '</td><td><a class="view" target="_top" href="' + dashEsc(profileLink(p.vid)) + '">view \u2192</a></td></tr>';
    });
    html += '</table>';
  }
  html += '</div>';

  // newsletter
  html += '<div class="card"><h2>Newsletter subscribers</h2>';
  if (!subs.rows.length) html += '<div class="dim small">None yet.</div>';
  else {
    html += '<table><tr><th>When</th><th>Email</th><th>From page</th><th>Where</th></tr>';
    subs.rows.slice(-8).reverse().forEach(function (r) {
      html += '<tr><td>' + fmt(r[0], 'MMM d, h:mm a') + '</td><td><b>' + dashEsc(r[1]) +
        '</b></td><td class="small dim">' + dashEsc(r[2]) + '</td><td class="small">' +
        dashEsc([r[3], r[4]].filter(function (x) { return x; }).join(', ')) + '</td></tr>';
    });
    html += '</table>';
  }
  html += '</div>';

  html += '<div class="sub" style="margin-top:18px">Known visitors = matched via a form submission or newsletter signup in that browser. ' +
    'Your own devices stay invisible after visiting the site once with ?notrack=1. Keep this link private.</div>';
  html += '</div>';
  return html;
}

/** Single-person dossier: every session this visitor had, each with its
 * page-by-page dwell, scroll depth, and a timestamped timeline. */
/* ------------------- JSON API for the /admin front-end ------------------- */

/** Live news + sports headlines for a school, via Google News RSS (keyless).
 * Cached 6h by the caller. Feeds the "we know everything" layer of /hq. */
function apiNews(school) {
  var name = String(school || '').replace(/\s*\([^)]*\)\s*$/, '').trim();
  if (!name) return { items: [] };
  var out = [];
  var queries = [
    { q: '"' + name + '" when:180d', kind: 'news' },
    { q: '"' + name + '" (football OR basketball OR athletics OR championship OR playoff) when:180d', kind: 'sports' },
  ];
  for (var i = 0; i < queries.length; i++) {
    try {
      var url = 'https://news.google.com/rss/search?q=' + encodeURIComponent(queries[i].q) + '&hl=en-US&gl=US&ceid=US:en';
      var resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
      if (resp.getResponseCode() !== 200) continue;
      var root = XmlService.parse(resp.getContentText()).getRootElement();
      var channel = root.getChild('channel');
      if (!channel) continue;
      var items = channel.getChildren('item');
      for (var j = 0; j < items.length && j < 8; j++) {
        var it = items[j];
        var src = '';
        try { src = it.getChild('source').getText(); } catch (se) {}
        var when = '';
        try { when = String(it.getChildText('pubDate') || '').replace(/\d\d:\d\d:\d\d.*$/, '').trim(); } catch (pe) {}
        out.push({ title: it.getChildText('title'), when: when, source: src, kind: queries[i].kind });
      }
    } catch (qe) {}
  }
  var seen = {};
  var ded = [];
  for (var k = 0; k < out.length; k++) {
    var key = String(out[k].title || '').slice(0, 60);
    if (!seen[key]) { seen[key] = 1; ded.push(out[k]); }
  }
  return { items: ded.slice(0, 12) };
}

function apiSummary() {
  var tz = Session.getScriptTimeZone();
  var now = new Date();
  var todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var cut7 = new Date(now.getTime() - 7 * 86400000);
  var leads = dashTable(CONFIG.LEADS_SHEET);
  var bookings = dashTable(CONFIG.BOOKINGS_SHEET);
  var visits = dashTable(CONFIG.VISITS_SHEET);
  function lv(r, name) { var i = leads.headers.indexOf(name); return i === -1 ? '' : r[i]; }
  function s(x) { return x instanceof Date ? Utilities.formatDate(x, tz, 'MMM d, h:mm a') : String(x === undefined || x === null ? '' : x); }

  var bi = {};
  ['Call Date', 'Time', 'Guest Name', 'Guest Email', 'Meeting Status', 'Deal Value'].forEach(function (h) { bi[h] = bookings.headers.indexOf(h); });
  var bstat = {}, showed = 0, noshow = 0, closed = 0, revenue = 0;
  bookings.rows.forEach(function (r) {
    var em = String(r[bi['Guest Email']] || '').trim().toLowerCase();
    var st = String(r[bi['Meeting Status']] || 'Booked');
    if (em) bstat[em] = st;
    if (st === 'Showed') showed++;
    if (st === 'No-show') noshow++;
    if (st === 'Closed - Won') { closed++; revenue += Number(r[bi['Deal Value']]) || CONFIG.DEAL_VALUE_DEFAULT; }
  });

  var hot = 0, ready = 0, leads7 = 0;
  var people = leads.rows.map(function (r) {
    var em = String(lv(r, 'email') || '').trim().toLowerCase();
    var t = lv(r, 'timestamp');
    if (lv(r, 'leadTier') === 'Hot') hot++;
    if (String(lv(r, 'investmentReadiness')).indexOf('Ready') === 0) ready++;
    if (t instanceof Date && t > cut7) leads7++;
    return {
      when: s(t), ts: t instanceof Date ? t.getTime() : 0,
      name: s(lv(r, 'name')) || em, email: em, phone: s(lv(r, 'phone')),
      tier: s(lv(r, 'leadTier')), pipeline: s(lv(r, 'pipelineTier')),
      pay: s(lv(r, 'payTier')), wealth: s(lv(r, 'zipWealthTier')),
      school: s(lv(r, 'currentSchool') || lv(r, 'highSchool')),
      hsCat: s(lv(r, 'hsCategory')), major: s(lv(r, 'intendedMajor')),
      targets: s(lv(r, 'targetSchools')), funding: s(lv(r, 'fundingSource')),
      commitment: s(lv(r, 'commitmentLevel')), score: Number(lv(r, 'leadScore')) || 0,
      call: bstat[em] || '', opens: s(lv(r, 'emailOpens')),
    };
  }).reverse();

  var v7 = 0, vToday = 0;
  visits.rows.forEach(function (r) {
    if (r[0] instanceof Date) { if (r[0] > cut7) v7++; if (r[0] >= todayStart) vToday++; }
  });

  // real calendar agenda: everything on the calendar for the next 7 days
  var agenda = [];
  try {
    var evs = CalendarApp.getDefaultCalendar().getEvents(new Date(now.getTime() - 2 * 3600000), new Date(now.getTime() + 7 * 86400000));
    evs.slice(0, 40).forEach(function (ev) {
      var guests = ev.getGuestList();
      var g = guests.length ? guests[0] : null;
      agenda.push({
        day: Utilities.formatDate(ev.getStartTime(), tz, 'EEE, MMM d'),
        time: Utilities.formatDate(ev.getStartTime(), tz, 'h:mm a'),
        title: ev.getTitle(),
        guest: g ? (g.getName() || g.getEmail()) : '',
        email: g ? String(g.getEmail()).toLowerCase() : '',
        isCall: (ev.getTitle() || '').toLowerCase().indexOf(CONFIG.BOOKING_TITLE_MATCH.toLowerCase()) !== -1 ||
          (ev.getTitle() || '').toLowerCase().indexOf('30 min with ajay') !== -1,
      });
    });
  } catch (calErr) {}

  return {
    generatedAt: Utilities.formatDate(now, tz, 'EEE, MMM d h:mm a'),
    stats: {
      leads: leads.rows.length, hot: hot, ready: ready, leads7: leads7,
      booked: bookings.rows.length, showed: showed, noshow: noshow,
      showRate: (showed + noshow) ? Math.round(showed / (showed + noshow) * 100) : null,
      closed: closed, revenue: revenue,
      visits7: v7, visitsToday: vToday,
    },
    agenda: agenda,
    people: people,
  };
}

function apiPerson(email) {
  email = String(email || '').trim().toLowerCase();
  var tz = Session.getScriptTimeZone();
  var leads = dashTable(CONFIG.LEADS_SHEET);
  var bookings = dashTable(CONFIG.BOOKINGS_SHEET);
  var row = null;
  var ei = leads.headers.indexOf('email');
  for (var i = leads.rows.length - 1; i >= 0; i--) {
    if (ei !== -1 && String(leads.rows[i][ei]).trim().toLowerCase() === email) { row = leads.rows[i]; break; }
  }
  var fields = {};
  if (row) {
    leads.headers.forEach(function (h, idx) {
      var val = row[idx];
      if (val === '' || val === undefined || val === null) return;
      if (val instanceof Date) val = Utilities.formatDate(val, tz, 'MMM d yyyy, h:mm a');
      fields[h] = String(val);
    });
  }
  var bi = {};
  ['Call Date', 'Time', 'Meeting Status', 'Deal Value', 'Notes', 'Guest Email'].forEach(function (h) { bi[h] = bookings.headers.indexOf(h); });
  var calls = [];
  bookings.rows.forEach(function (r) {
    if (String(r[bi['Guest Email']] || '').trim().toLowerCase() !== email) return;
    calls.push({
      date: String(r[bi['Call Date']] || ''), time: String(r[bi['Time']] || ''),
      status: String(r[bi['Meeting Status']] || 'Booked'),
      dealValue: r[bi['Deal Value']] ? String(r[bi['Deal Value']]) : '',
      notes: String(r[bi['Notes']] || ''),
    });
  });
  // Site journey: every tracked session from this person's browser, matched
  // by the visitorId stamped on their lead row or by known email. Powers the
  // "everything they've seen" timeline on /hq.
  var journey = [];
  try {
    var vid = fields.visitorId || '';
    var visits = dashTable(CONFIG.VISITS_SHEET);
    visits.rows.forEach(function (r) {
      if (!(r[V.seen] instanceof Date)) return;
      var who = String(r[V.who] || '').toLowerCase();
      if (!((vid && r[V.vid] === vid) || (email && who.indexOf('(' + email + ')') !== -1))) return;
      journey.push({
        when: Utilities.formatDate(r[V.seen], tz, 'EEE MMM d, h:mm a'),
        ts: r[V.seen].getTime(),
        mins: Math.round((Number(r[V.mins]) || 0) * 10) / 10,
        pages: Number(r[V.pages]) || 0,
        trail: String(r[V.trail] || ''),
        times: safeParse(r[V.times]),
        device: String(r[V.device] || ''),
        via: arrivedVia(r[V.utm], r[V.ref]),
        scroll: Number(r[V.maxScroll]) || 0,
      });
    });
    journey.sort(function (a, b) { return b.ts - a.ts; });
    journey = journey.slice(0, 30);
  } catch (je) {}
  // Did they do the /prep confirmation page? Any prep field counts.
  var prepDone = !!(fields.callGoal || fields.uploads || fields.lastCycleResults ||
    fields.currentSchoolStory || fields.biggestWorry || fields.familyBenchmark);
  return { email: email, fields: fields, calls: calls, journey: journey, prepDone: prepDone };
}

/** The per-person profile dashboard: everything we know about ONE human -
 * background, ambition, money signals, call history, uploads, email opens,
 * site engagement - assembled from Leads + Bookings + Visits by email. */
function renderPersonDetail(email) {
  email = String(email || '').trim().toLowerCase();
  var tz = Session.getScriptTimeZone();
  var leads = dashTable(CONFIG.LEADS_SHEET);
  var bookings = dashTable(CONFIG.BOOKINGS_SHEET);
  var visits = dashTable(CONFIG.VISITS_SHEET);

  // newest lead row for this email
  var row = null;
  for (var i = leads.rows.length - 1; i >= 0; i--) {
    var ei = leads.headers.indexOf('email');
    if (ei !== -1 && String(leads.rows[i][ei]).trim().toLowerCase() === email) { row = leads.rows[i]; break; }
  }
  function v(name) {
    if (!row) return '';
    var idx = leads.headers.indexOf(name);
    var val = idx === -1 ? '' : row[idx];
    if (val instanceof Date) return Utilities.formatDate(val, tz, 'EEE, MMM d yyyy h:mm a');
    return String(val === undefined || val === null ? '' : val);
  }
  function chip(text, bg, fg) {
    return text ? '<span class="chip" style="background:' + bg + ';color:' + (fg || '#fff') + '">' + dashEsc(text) + '</span> ' : '';
  }
  function kv(label, val, strong) {
    if (!val) return '';
    return '<tr><th style="width:38%">' + dashEsc(label) + '</th><td>' + (strong ? '<b>' + dashEsc(val) + '</b>' : dashEsc(val)) + '</td></tr>';
  }
  function card(title, inner) {
    return inner ? '<div class="card"><h2>' + title + '</h2><table>' + inner + '</table></div>' : '';
  }

  var name = v('name') || email;
  var html = '<style>' + dashCss() + '</style><div class="wrap">';
  html += '<div class="sub"><a href="' + dashEsc(dashHome()) + '">\u2190 Command Center</a></div>';
  html += '<h1 style="font-size:24px">' + dashEsc(name) + '</h1>';
  html += '<div style="margin:8px 0 2px">' +
    chip(v('leadTier'), v('leadTier') === 'Hot' ? '#34a853' : v('leadTier') === 'Warm' ? '#f9ab00' : '#4285f4') +
    chip(v('pipelineTier'), '#7a0000') +
    chip(v('payTier') ? 'Pay: ' + v('payTier') : '', '#b06ad4') +
    chip(v('zipWealthTier'), '#d4aa00', '#000') +
    chip(v('hsCategory'), '#146c6c') +
    chip(v('majorCategory'), '#5f6b7a') + '</div>';
  html += '<div class="sub">' + dashEsc(email) + (v('phone') ? ' \u00B7 ' + dashEsc(v('phone')) : '') +
    (v('ipCity') ? ' \u00B7 ' + dashEsc(v('ipCity') + ', ' + v('ipRegion')) : '') +
    ' \u00B7 applied ' + dashEsc(v('timestamp')) + '</div>';

  if (!row) {
    html += '<div class="card"><h2>No application on file</h2><div class="dim small">This person booked a call but has not submitted the form. Everything below comes from bookings only.</div></div>';
  }

  html += '<div class="cols">';

  // background
  html += card('Background',
    kv('Student type', v('studentType')) +
    kv('High school', v('highSchool'), true) +
    kv('HS type', [v('hsType'), v('hsCategory')].filter(function (x) { return x; }).join(' \u00B7 ')) +
    kv('HS neighborhood', [v('zipTop200kShare'), v('zipMeanIncome')].filter(function (x) { return x; }).join(' \u00B7 ')) +
    kv('Grade / grad year', [v('gradeLevel'), v('gradYear')].filter(function (x) { return x; }).join(' \u00B7 ')) +
    kv('College', v('currentSchool') ? v('currentSchool') + (v('collegeYear') ? ' (' + v('collegeYear') + ')' : '') : '', true) +
    kv('College tier', v('collegeCategory')) +
    kv('HS GPA', v('highSchoolGPA')) +
    kv('College GPA', v('collegeGPA')) +
    kv('GPA trend', v('gpaTrajectory')) +
    kv('Test score', v('testScore')));

  // ambition
  html += card('Goals + motivation',
    kv('Dream schools', v('targetSchools'), true) +
    kv('Elite targets', v('dreamPrestigeCount')) +
    kv('Major', v('intendedMajor')) +
    kv('Career goal', v('careerGoals')) +
    kv('Cycle', v('cycle')) +
    kv('Why transfer, why now', v('challenge')) +
    kv('Wants from the call', v('callGoal'), true) +
    kv('Last cycle', v('lastCycleResults')));

  // money
  var pay = Number(v('abilityToPay')) || 0;
  var payBar = pay ? '<tr><th style="width:38%">Ability to pay</th><td><div style="background:#1c2b42;border-radius:6px;height:14px;max-width:220px"><div style="background:' +
    (pay >= 65 ? '#34a853' : pay >= 40 ? '#f9ab00' : '#ea4335') + ';width:' + pay + '%;height:14px;border-radius:6px"></div></div><b>' + pay + '/100</b></td></tr>' : '';
  html += card('Money signals',
    payBar +
    kv('Who funds it', v('fundingSource'), true) +
    kv('Commitment', v('commitmentLevel')) +
    kv('Readiness band', v('investmentReadiness')) +
    kv('Paid counselor before', v('usedAdvisorBefore') + (v('previousAdvisorFirm') ? ' - ' + v('previousAdvisorFirm') : '')) +
    kv('Paid test prep', v('testPrepUsed')) +
    kv('Financial aid (legacy)', v('financialAid')) +
    kv('Filled by', v('filledBy')) +
    kv('Lead score', v('leadScore') ? v('leadScore') + '/100' : '', true));

  html += '</div>'; // cols

  // call history
  var bi2 = {};
  ['Call Date', 'Time', 'Guest Name', 'Guest Email', 'Meeting Status', 'Deal Value', 'Notes'].forEach(function (h) {
    bi2[h] = bookings.headers.indexOf(h);
  });
  var calls = bookings.rows.filter(function (r) {
    return String(r[bi2['Guest Email']] || '').trim().toLowerCase() === email;
  });
  html += '<div class="card"><h2>Call history</h2>';
  if (!calls.length) html += '<div class="dim small">No calls booked yet.</div>';
  else {
    html += '<table><tr><th>Date</th><th>Time</th><th>Status</th><th>Deal value</th><th>Notes</th></tr>';
    calls.forEach(function (r) {
      var st = String(r[bi2['Meeting Status']] || 'Booked');
      var bg = st === 'Showed' ? '#34a853' : st === 'Closed - Won' ? '#d4aa00' : st === 'No-show' ? '#ea4335' : '#4285f4';
      html += '<tr><td>' + dashEsc(r[bi2['Call Date']]) + '</td><td>' + dashEsc(r[bi2['Time']]) +
        '</td><td>' + chip(st, bg, st === 'Closed - Won' ? '#000' : '#fff') +
        '</td><td>' + dashEsc(r[bi2['Deal Value']] ? '$' + r[bi2['Deal Value']] : '') +
        '</td><td class="small dim">' + dashEsc(r[bi2['Notes']]) + '</td></tr>';
    });
    html += '</table>';
  }
  html += '</div>';

  // uploads + prep + opens
  var up = v('uploads');
  var upHtml = '';
  if (up) {
    up.split('\n').forEach(function (line) {
      var m = /(.*?):\s*(https?:\S+)/.exec(line);
      if (m) upHtml += '<tr><th style="width:38%">' + dashEsc(m[1]) + '</th><td><a class="view" href="' + dashEsc(m[2]) + '" target="_blank">open \u2192</a></td></tr>';
      else if (line.trim()) upHtml += '<tr><th></th><td class="small dim">' + dashEsc(line) + '</td></tr>';
    });
  }
  html += '<div class="cols">';
  html += card('Uploads + prep', upHtml +
    kv('Show-up agreement', v('showUpAgreement')) +
    kv('Email opens', v('emailOpens'), true));

  // engagement (secondary, from the lead's own tracked fields + visitor link)
  var engHtml =
    kv('Visits before applying', v('visitCount')) +
    kv('Minutes on site', v('minutesOnSite')) +
    kv('Pages that session', v('pagesThisSession')) +
    kv('Viewed services / results / reviews', [v('viewedServices'), v('viewedResults'), v('viewedReviews')].join(' / ')) +
    kv('Form fill time', v('formFillSeconds') ? v('formFillSeconds') + 's' : '') +
    kv('Source', [v('utmSource'), v('utmCampaign')].filter(function (x) { return x; }).join(' / ') || v('source')) +
    kv('Device', [v('device'), v('screenSize')].filter(function (x) { return x; }).join(' \u00B7 '));
  if (v('visitorId')) {
    engHtml += '<tr><th style="width:38%">Full browsing dossier</th><td><a class="view" href="' + dashEsc(profileLink(v('visitorId'))) + '">open \u2192</a></td></tr>';
  }
  html += card('Site engagement', engHtml);
  html += '</div>'; // cols

  // every non-empty field, for completeness
  if (row) {
    html += '<div class="card"><h2>Every field on record</h2><details><summary class="small" style="cursor:pointer;color:#d4aa00">Show all</summary><table>';
    leads.headers.forEach(function (h, idx) {
      var val = row[idx];
      if (val === '' || val === undefined || val === null) return;
      if (val instanceof Date) val = Utilities.formatDate(val, tz, 'MMM d yyyy h:mm a');
      html += '<tr><th style="width:30%">' + dashEsc(h) + '</th><td class="small">' + dashEsc(String(val).slice(0, 300)) + '</td></tr>';
    });
    html += '</table></details></div>';
  }

  html += '</div>';
  return html;
}

function renderProfileDetail(vid) {
  var tz = Session.getScriptTimeZone();
  var visits = dashTable(CONFIG.VISITS_SHEET);
  var rows = visits.rows.filter(function (r) {
    return r[V.seen] instanceof Date && (r[V.vid] === vid || ('ip:' + r[V.ip]) === vid);
  }).sort(function (a, b) { return b[V.seen] - a[V.seen]; });

  function fmt(d, p) { return d instanceof Date ? Utilities.formatDate(d, tz, p) : dashEsc(d); }
  function tile(n, label, color) {
    return '<div class="tile"><b style="color:' + (color || '#e8ecf1') + '">' + n + '</b><span>' + label + '</span></div>';
  }

  var html = '<style>' + dashCss() + '</style><div class="wrap">';
  html += '<div class="sub"><a href="' + dashEsc(dashHome()) + '" target="_top">&larr; back to command center</a></div>';

  if (!rows.length) {
    html += '<h1 style="margin-top:12px">Profile not found</h1><div class="dim small">No sessions match this visitor.</div></div>';
    return html;
  }

  // aggregate across this person's sessions
  var known = null;
  rows.forEach(function (r) { if (r[V.status] === 'Known') known = r; });
  var who = known ? known[V.who] : 'Anonymous';
  var asc = rows.slice().sort(function (a, b) { return a[V.seen] - b[V.seen]; });
  var first = asc[0], last = asc[asc.length - 1];
  var pageSecs = {}, totalMin = 0, totalPv = 0, maxScroll = 0, ips = [], cities = [];
  rows.forEach(function (r) {
    totalMin += Number(r[V.mins]) || 0;
    totalPv += Number(r[V.pages]) || 0;
    maxScroll = Math.max(maxScroll, Number(r[V.maxScroll]) || 0);
    if (r[V.ip]) ips.push(r[V.ip]);
    if (r[V.city]) cities.push(r[V.city] + (r[V.region] ? ', ' + r[V.region] : ''));
    var t = safeParse(r[V.times]);
    Object.keys(t).forEach(function (p) { pageSecs[p] = (pageSecs[p] || 0) + Number(t[p] || 0); });
  });
  var days = Math.max(1, Math.round((last[V.seen] - first[V.seen]) / 86400000) + 1);

  var status = known ? 'Known' : (Number(last[V.visit]) > 1 || rows.length > 1) ? 'Returning' : 'New';
  var stColor = status === 'Known' ? '#7a0000' : status === 'Returning' ? '#4285f4' : '#5f6b7a';
  html += '<h1 style="margin-top:12px">' + (status === 'Known' ? '<span style="color:#c96a6a">' : '') +
    dashEsc(who) + (status === 'Known' ? '</span>' : '') +
    ' <span class="chip" style="background:' + stColor + '">' + status + '</span></h1>';
  html += '<div class="sub">First seen ' + fmt(first[V.seen], 'MMM d, yyyy h:mm a') +
    ' \u00B7 last seen ' + fmt(last[V.seen], 'MMM d, yyyy h:mm a') +
    ' \u00B7 arrived via ' + dashEsc(arrivedVia(first[V.utm], first[V.ref])) +
    ' \u00B7 landed on ' + dashEsc(first[V.landing]) + '</div>';

  html += '<div class="tiles">' +
    tile(rows.length, 'Sessions') + tile(Number(last[V.visit]) || rows.length, 'Visits') +
    tile(Math.round(totalMin * 10) / 10 + 'm', 'Total time') + tile(totalPv, 'Pageviews') +
    tile(maxScroll + '%', 'Max scroll') + tile(days, 'Days active') + '</div>';

  // where / network / device summary
  html += '<div class="card"><h2>Who &amp; where</h2><table>' +
    '<tr><td class="dim">Location(s)</td><td>' + dashEsc(uniqueList(cities).join(' | ') || 'Unknown') + '</td></tr>' +
    '<tr><td class="dim">Network</td><td>' + dashEsc(mostFrequent(rows.map(function (r) { return r[V.isp]; })) || 'Unknown') + '</td></tr>' +
    '<tr><td class="dim">Device</td><td>' + dashEsc(mostFrequent(rows.map(function (r) { return r[V.device]; }))) + '</td></tr>' +
    '<tr><td class="dim">IP(s)</td><td>' + dashEsc(uniqueList(ips).join(', ')) + '</td></tr>' +
    (known ? '<tr><td class="dim">Identity</td><td><b style="color:#c96a6a">' + dashEsc(who) + '</b></td></tr>' : '') +
    '</table></div>';

  // aggregated top pages
  var topPages = Object.keys(pageSecs).sort(function (a, b) { return pageSecs[b] - pageSecs[a]; });
  html += '<div class="card"><h2>Time spent per page (all sessions)</h2>';
  if (!topPages.length) html += '<div class="dim small">Older sessions logged before per-page timing; see the trail in each session below.</div>';
  else {
    html += '<table><tr><th>Page</th><th>Total time</th></tr>';
    topPages.forEach(function (p) {
      html += '<tr><td>' + dashEsc(p) + '</td><td><b>' + fmtMin(pageSecs[p]) + '</b></td></tr>';
    });
    html += '</table>';
  }
  html += '</div>';

  // per-session breakdown, newest first
  html += '<div class="card"><h2>Session-by-session</h2>';
  rows.forEach(function (r, idx) {
    var t = safeParse(r[V.times]), sc = safeParse(r[V.scroll]);
    var log = [];
    try { log = JSON.parse(r[V.log] || '[]') || []; } catch (e) { log = []; }
    html += '<div style="margin:' + (idx ? '18px' : '4px') + ' 0 6px;border-top:1px solid rgba(255,255,255,.08);padding-top:12px">';
    html += '<div><b>' + fmt(r[V.seen], 'EEE, MMM d \u00B7 h:mm a') + '</b> <span class="dim small">\u00B7 ' +
      (r[V.mins] || 0) + ' min \u00B7 ' + dashEsc(r[V.device]) + ' \u00B7 ' +
      dashEsc([r[V.city], r[V.region]].filter(function (x) { return x; }).join(', ') || 'unknown location') +
      ' \u00B7 via ' + dashEsc(arrivedVia(r[V.utm], r[V.ref])) + '</span></div>';
    var pgs = Object.keys(t).sort(function (a, b) { return t[b] - t[a]; });
    if (pgs.length) {
      html += '<table style="margin-top:6px"><tr><th>Page</th><th>Time</th><th>Scroll</th></tr>';
      pgs.forEach(function (p) {
        html += '<tr><td>' + dashEsc(p) + '</td><td>' + fmtMin(t[p]) + '</td><td class="dim">' +
          (sc[p] ? sc[p] + '%' : '-') + '</td></tr>';
      });
      html += '</table>';
    } else if (r[V.trail]) {
      html += '<div class="small dim" style="margin-top:4px">Path: ' + dashEsc(r[V.trail]) + '</div>';
    }
    if (log.length) {
      var tl = log.map(function (e) {
        return fmt(new Date(Number(e[1])), 'h:mm:ss a') + '  ' + dashEsc(e[0]);
      }).join('&nbsp;&nbsp;\u2192&nbsp;&nbsp;');
      html += '<div class="small dim" style="margin-top:6px">Timeline: ' + tl + '</div>';
    }
    html += '</div>';
  });
  html += '</div>';

  html += '</div>';
  return html;
}
