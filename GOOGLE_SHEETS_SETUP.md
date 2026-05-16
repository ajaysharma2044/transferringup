# Google Sheets Integration Setup Guide

## 🎯 Overview
This guide will help you set up automatic Google Sheets integration for your contact form. When students submit the form, their information will be automatically saved to a Google Spreadsheet.

## 📋 Step-by-Step Setup

### Step 1: Create a Google Spreadsheet

1. **Go to Google Sheets**: https://sheets.google.com
2. **Create a new spreadsheet** called "Transfer Consultation Requests"
3. **Set up the column headers** in Row 1:
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
   K1: Source
   L1: Follow-up Notes
   ```

### Step 2: Create Google Apps Script

1. **In your Google Sheet**, go to `Extensions` → `Apps Script`
2. **Delete the default code** and paste this:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSheet();
    
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Create a new row with the data
    var newRow = [
      new Date(data.timestamp), // Timestamp
      data.name,                // Name
      data.email,               // Email
      data.phone,               // Phone
      data.currentGPA,          // Current GPA
      data.targetSchools,       // Target Schools
      data.preferredDate,       // Preferred Date
      data.preferredTime,       // Preferred Time
      data.message,             // Message
      data.status,              // Status
      data.source               // Source
    ];
    
    // Append the row to the sheet
    sheet.appendRow(newRow);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
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

3. **Save the script** (Ctrl+S or Cmd+S)
4. **Name your project**: "Transfer Form Integration"

### Step 3: Deploy the Web App

1. **Click "Deploy"** → **"New deployment"**
2. **Choose type**: Select "Web app"
3. **Configuration**:
   - Description: "Transfer consultation form handler"
   - Execute as: "Me"
   - Who has access: "Anyone"
4. **Click "Deploy"**
5. **Copy the Web App URL** - it will look like:
   ```
   https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

### Step 4: Update Your Website Code

1. **Open** `src/components/GoogleSheetsForm.tsx`
2. **Find this line** (around line 67):
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. **Replace it with your actual URL**:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```

### Step 5: Test the Integration

1. **Submit a test form** on your website
2. **Check your Google Sheet** - you should see a new row with the data
3. **If it doesn't work**, check the Apps Script logs:
   - Go back to Apps Script
   - Click "Executions" to see any errors

## 🎨 Optional: Format Your Spreadsheet

### Add Conditional Formatting
1. **Select the Status column (J)**
2. **Format** → **Conditional formatting**
3. **Add rules**:
   - "New Request" = Red background
   - "Contacted" = Yellow background
   - "Scheduled" = Green background
   - "Completed" = Blue background

### Add Data Validation
1. **Select the Status column (J)**
2. **Data** → **Data validation**
3. **Criteria**: List of items
4. **Items**: New Request, Contacted, Scheduled, Completed

### Create a Dashboard
1. **Add a new sheet** called "Dashboard"
2. **Add summary formulas**:
   ```
   =COUNTIF(Sheet1!J:J,"New Request")    // Count new requests
   =COUNTIF(Sheet1!J:J,"Scheduled")      // Count scheduled
   =COUNTA(Sheet1!B:B)-1                 // Total submissions
   ```

## 🔧 Advanced Features

### Email Notifications
Add this to your Apps Script to get email notifications:

```javascript
function sendNotificationEmail(data) {
  var subject = "🚨 NEW CONSULTATION REQUEST - " + data.name;
  var body = `
New consultation request received:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
GPA: ${data.currentGPA}
Target Schools: ${data.targetSchools}
Preferred Date: ${data.preferredDate}
Preferred Time: ${data.preferredTime}

Message: ${data.message}

Check your Google Sheet for full details.
  `;
  
  MailApp.sendEmail({
    to: "as4489@cornell.edu,bliu9@nd.edu",
    subject: subject,
    body: body
  });
}
```

Then add this line in your `doPost` function after `sheet.appendRow(newRow);`:
```javascript
sendNotificationEmail(data);
```

### Auto-Response to Students
```javascript
function sendAutoResponse(email, name) {
  var subject = "✅ Consultation Request Received - Transferring Up";
  var body = `
Hi ${name},

Thank you for your consultation request! We've received your information and will get back to you within 24 hours with a Google Meet link.

In the meantime, feel free to reach out if you have any urgent questions:
• Email: as4489@cornell.edu
• Text: (980) 248-9218

Best regards,
The Transferring Up Team
  `;
  
  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: body
  });
}
```

## 🛡️ Security & Privacy

### Data Protection
- Your Google Sheet is private by default
- Only you can access the data
- The web app only accepts POST requests with data
- No sensitive data is logged in Apps Script

### Access Control
- You can share the sheet with specific people
- Set permissions (view only, edit, etc.)
- Track who accesses the data

## 📊 Benefits of This Setup

✅ **Automatic Organization**: All data goes directly to Google Sheets
✅ **Real-time Updates**: See new submissions instantly
✅ **Easy Management**: Sort, filter, and organize data
✅ **Backup Security**: Google automatically backs up your data
✅ **Mobile Access**: Check submissions from your phone
✅ **Collaboration**: Share with team members
✅ **Export Options**: Download as Excel, PDF, etc.
✅ **Integration Ready**: Connect to other Google services
✅ **Free**: No monthly fees or limits

## 🆘 Troubleshooting

### Common Issues:

1. **"Script not found" error**
   - Make sure you deployed the web app
   - Check that the URL is correct
   - Verify the script is saved

2. **"Permission denied" error**
   - Redeploy with "Execute as: Me"
   - Make sure "Who has access" is set to "Anyone"

3. **Data not appearing in sheet**
   - Check Apps Script execution logs
   - Verify column headers match exactly
   - Test with a simple form first

4. **CORS errors**
   - This is normal with `mode: 'no-cors'`
   - The data still gets through
   - Check your Google Sheet to confirm

### Getting Help:
- Email: as4489@cornell.edu
- Include: Error message, screenshot, and what you were trying to do

---

**That's it!** Your contact form will now automatically save all submissions to Google Sheets. You'll have a professional system for managing consultation requests with zero monthly fees! 🎉