# Simple Google Sheets Integration Setup

## 🎯 The RIGHT Way (Simple & Works)

### Step 1: Create Your Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create new sheet: "Transfer Consultation Requests"
3. Add these headers in Row 1:
   ```
   A1: Timestamp
   B1: Name
   C1: Email
   D1: Phone
   E1: Current GPA
   F1: Target Schools
   G1: Preferred Date
   H1: Preferred Time
   I1: Message
   J1: Status
   ```

### Step 2: Create Google Apps Script
1. In your sheet: `Extensions` → `Apps Script`
2. Replace default code with this:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    var newRow = [
      new Date(),           // Timestamp
      data.name,            // Name
      data.email,           // Email
      data.phone || '',     // Phone
      data.currentGPA || '', // Current GPA
      data.targetSchools || '', // Target Schools
      data.preferredDate,   // Preferred Date
      data.preferredTime,   // Preferred Time
      data.message || '',   // Message
      'New Request'         // Status
    ];
    
    sheet.appendRow(newRow);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("Google Sheets integration is working!")
    .setMimeType(ContentService.MimeType.TEXT);
}
```

3. Save the script (Ctrl+S)

### Step 3: Deploy the Script
1. Click `Deploy` → `New deployment`
2. Type: `Web app`
3. Execute as: `Me`
4. Who has access: `Anyone`
5. Click `Deploy`
6. **COPY THE URL** - looks like:
   ```
   https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

### Step 4: Update Your Website
1. Open `src/components/GoogleSheetsForm.tsx`
2. Find line ~67:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxEVDPlzq3JEHSE7P21SfXz4P8DuRogM36Ab5JDg_9dSsipUizHZ6PcrtPJns7U1Y7yuQ/exec';
   ```
3. Replace with YOUR actual URL

### Step 5: Test It
1. Submit a test form
2. Check your Google Sheet for new row
3. Check your email for notification

## 🎯 That's It!

**No complex authentication, no API keys, no complicated setup.**

Just:
1. ✅ Create sheet
2. ✅ Add script
3. ✅ Deploy script
4. ✅ Update URL
5. ✅ Test

Your form will automatically save to Google Sheets and email you notifications!

## 🛠️ Optional: Add Email Notifications

Add this to your Apps Script for instant email alerts:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    var newRow = [
      new Date(),
      data.name,
      data.email,
      data.phone || '',
      data.currentGPA || '',
      data.targetSchools || '',
      data.preferredDate,
      data.preferredTime,
      data.message || '',
      'New Request'
    ];
    
    sheet.appendRow(newRow);
    
    // Send email notification
    MailApp.sendEmail({
      to: "as4489@cornell.edu,bliu9@nd.edu",
      subject: "🚨 NEW CONSULTATION REQUEST - " + data.name,
      body: `
New consultation request:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
GPA: ${data.currentGPA}
Target Schools: ${data.targetSchools}
Preferred: ${data.preferredDate} at ${data.preferredTime}

Message: ${data.message}

Check your Google Sheet for details.
      `
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 🆘 Troubleshooting

**"Script not found"** → Make sure you deployed it and copied the right URL

**"Permission denied"** → Redeploy with "Execute as: Me" and "Anyone" access

**"Data not appearing"** → Check Apps Script execution logs for errors

**"CORS errors"** → Normal! Data still goes through with `mode: 'no-cors'`

---

**Need help?** Email as4489@cornell.edu with your error message and screenshot.