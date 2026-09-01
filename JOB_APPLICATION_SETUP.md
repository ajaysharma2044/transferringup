# Job Applications + Leads → Google Sheets + email to ajay@

The Careers form (`/careers`) and the contact form both POST to the **same**
Google Apps Script you already use (`VITE_GOOGLE_SCRIPT_URL`). This one script
now does three things:

1. **Leads** (contact form) → "Leads" tab in your existing sheet
2. **Job applications** (`/careers`) → a **separate spreadsheet** named
   **"TransferringUP Job Applications"**, created automatically the first time
   someone applies (it lands in the Google Drive of whoever owns the script)
3. **Emails ajay@transferringup.com** on every submission (reply-to = applicant)

No new infrastructure — just update the script you already have.

---

## Update the Apps Script (one time)

1. Open your existing Google Sheet → **Extensions → Apps Script**.
2. **Select all** the existing code and **replace it** with the code below.
3. **Save** (⌘/Ctrl-S).
4. **Deploy → Manage deployments →** click the ✏️ pencil on your existing Web
   App → **Version: New version → Deploy.**
   *(Editing the existing deployment keeps the same URL, so nothing in the site
   needs to change.)*

```javascript
// ===== TransferringUP — form handler (Leads + Job Applications) =====
var NOTIFY_EMAIL = 'ajay@transferringup.com';
var JOB_SHEET_NAME = 'TransferringUP Job Applications';

// Columns written for each submission type (in order)
var LEAD_COLS = ['source','name','email','phone','currentSchool','collegeGPA',
                 'highSchoolGPA','targetSchools','testScore','financialAid','challenge','message'];
var JOB_COLS  = ['source','name','email','phone','position','school',
                 'transferStory','links','resume','message'];

function doPost(e) {
  try {
    var data  = JSON.parse(e.postData.contents);
    var isJob  = String(data.source || '').toLowerCase().indexOf('job') !== -1;
    var cols   = isJob ? JOB_COLS : LEAD_COLS;

    // Job apps go to their OWN spreadsheet; leads stay in this one.
    var sheet;
    if (isJob) {
      sheet = getJobSpreadsheet().getSheets()[0];
    } else {
      var main = SpreadsheetApp.getActiveSpreadsheet();
      sheet = main.getSheetByName('Leads') || main.insertSheet('Leads');
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp'].concat(cols.map(pretty)));
    }
    sheet.appendRow([new Date()].concat(cols.map(function (c) { return data[c] || ''; })));

    notify(data, isJob, cols);

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Opens the separate job-applications spreadsheet, creating it once and
// remembering its ID so every future application appends to the same file.
function getJobSpreadsheet() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('JOB_SHEET_ID');
  if (id) {
    try { return SpreadsheetApp.openById(id); } catch (e) { /* recreate below */ }
  }
  var ss = SpreadsheetApp.create(JOB_SHEET_NAME);
  props.setProperty('JOB_SHEET_ID', ss.getId());
  return ss;
}

function notify(data, isJob, cols) {
  var subject = (isJob ? '💼 New Job Application — ' : '🎓 New Lead — ') + (data.name || 'Unknown');
  var body = (isJob ? 'New job application:\n\n' : 'New website lead:\n\n') +
    cols.map(function (c) { return pretty(c) + ': ' + (data[c] || '—'); }).join('\n');
  if (isJob) {
    body += '\n\nSheet: https://docs.google.com/spreadsheets/d/' +
      PropertiesService.getScriptProperties().getProperty('JOB_SHEET_ID');
  }
  MailApp.sendEmail({ to: NOTIFY_EMAIL, replyTo: data.email || NOTIFY_EMAIL, subject: subject, body: body });
}

function pretty(k) {
  return k.replace(/([A-Z])/g, ' $1').replace(/^./, function (s) { return s.toUpperCase(); });
}

function doGet() {
  return ContentService.createTextOutput('TransferringUP form endpoint is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

5. The **first** time it runs it'll ask you to **authorize** (allow the script
   to manage spreadsheets + send mail as you). Approve it.

That's it. Submit a test from `/careers` — the script creates a new
**"TransferringUP Job Applications"** spreadsheet in your Drive, drops the row
in, and emails ajay@transferringup.com with a link to it. Every later
application appends to that same spreadsheet.

> The notification sends from your own Google account to ajay@transferringup.com.
> If you want it to *send from* ajay@ too, set that address up as a
> "Send mail as" alias on the Google account that owns the script.
