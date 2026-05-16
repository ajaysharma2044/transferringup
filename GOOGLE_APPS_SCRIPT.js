function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();

    var expectedHeaders = [
      'Timestamp',
      'Name',
      'Email',
      'Phone',
      'Address',
      'Zip Code',
      'Current School',
      'High School GPA',
      'College GPA',
      'Target Schools',
      'Test Score',
      'Financial Aid',
      'Intended Major',
      'Transfer Term',
      'Num Schools',
      'Services Interested',
      'Biggest Challenge',
      'Extracurriculars',
      'File Attachments',
      'Additional Info',
      'Message',
      'Status',
      'Source'
    ];

    var lastCol = sheet.getLastColumn();
    var needsHeaderUpdate = false;

    if (lastCol === 0) {
      needsHeaderUpdate = true;
    } else {
      var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
      if (headers[0] !== 'Timestamp' || lastCol !== expectedHeaders.length) {
        needsHeaderUpdate = true;
      }
    }

    if (needsHeaderUpdate) {
      sheet.getRange(1, 1, 1, expectedHeaders.length).setValues([expectedHeaders]);
      sheet.getRange(1, 1, 1, expectedHeaders.length).setFontWeight('bold');
      sheet.getRange(1, 1, 1, expectedHeaders.length).setBackground('#4285f4');
      sheet.getRange(1, 1, 1, expectedHeaders.length).setFontColor('white');
    }

    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        var pairs = e.postData.contents.split('&');
        for (var i = 0; i < pairs.length; i++) {
          var kv = pairs[i].split('=');
          if (kv.length === 2) {
            data[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1].replace(/\+/g, ' '));
          }
        }
      }
    }
    if (!data.name && e.parameter) {
      data = e.parameter;
    }

    var newRow = [
      new Date(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.address || '',
      data.zipCode || '',
      data.currentSchool || '',
      data.highSchoolGPA || '',
      data.collegeGPA || '',
      data.targetSchools || '',
      data.testScore || '',
      data.financialAid || '',
      data.intendedMajor || '',
      data.transferTerm || '',
      data.numSchools || '',
      data.servicesInterested || '',
      data.biggestChallenge || '',
      data.extracurriculars || '',
      data.fileUrls || '',
      data.additionalInfo || '',
      data.message || '',
      'New Request',
      data.source || 'Website Form'
    ];

    sheet.appendRow(newRow);

    var isQuoteRequest = (data.source || '').indexOf('Quote') > -1;

    var emailBody = "NEW " + (isQuoteRequest ? "CUSTOM QUOTE REQUEST" : "CONSULTATION REQUEST") + "\n\n" +
      "Student Information:\n" +
      "- Name: " + (data.name || 'Not provided') + "\n" +
      "- Email: " + (data.email || 'Not provided') + "\n" +
      "- Phone: " + (data.phone || 'Not provided') + "\n" +
      "- Address: " + (data.address || 'Not provided') + "\n" +
      "- Zip Code: " + (data.zipCode || 'Not provided') + "\n\n" +
      "Academic Background:\n" +
      "- Current School: " + (data.currentSchool || 'Not provided') + "\n" +
      "- High School GPA: " + (data.highSchoolGPA || 'Not provided') + "\n" +
      "- College GPA: " + (data.collegeGPA || 'Not provided') + "\n" +
      "- Test Score (SAT/ACT): " + (data.testScore || 'Not provided') + "\n" +
      "- Target Schools: " + (data.targetSchools || 'Not specified') + "\n" +
      "- Financial Aid: " + (data.financialAid || 'Not specified') + "\n";

    if (isQuoteRequest) {
      emailBody +=
        "\nQuote Details:\n" +
        "- Intended Major: " + (data.intendedMajor || 'Not provided') + "\n" +
        "- Transfer Term: " + (data.transferTerm || 'Not provided') + "\n" +
        "- Number of Schools: " + (data.numSchools || 'Not provided') + "\n" +
        "- Services Interested: " + (data.servicesInterested || 'Not provided') + "\n";
    }

    if (data.extracurriculars) {
      emailBody +=
        "\nExtracurricular Activities:\n" +
        data.extracurriculars + "\n";
    }

    if (data.fileUrls) {
      emailBody +=
        "\nAttached Files:\n" +
        data.fileUrls.split(' | ').map(function(url) { return "- " + url; }).join("\n") + "\n";
    }

    emailBody +=
      "\nBiggest Challenge:\n" +
      (data.biggestChallenge || 'Not provided') + "\n\n" +
      "Additional Info:\n" +
      (data.additionalInfo || 'None') + "\n\n" +
      "Message:\n" +
      (data.message || 'No additional notes provided') + "\n\n" +
      "Submission Time: " + new Date().toLocaleString() + "\n\n" +
      "CHECK YOUR GOOGLE SHEET for the full details!\n\n" +
      "Next Steps:\n" +
      "1. Reply to student at " + (data.email || '') + "\n" +
      "2. Schedule consultation meeting\n" +
      "3. Prepare personalized recommendations based on GPA progression\n\n" +
      "Academic Assessment:\n" +
      (data.highSchoolGPA && data.collegeGPA ?
        "- GPA Improvement: " + data.highSchoolGPA + " -> " + data.collegeGPA :
        "- Review academic progression during consultation");

    MailApp.sendEmail({
      to: "as4489@cornell.edu",
      subject: "NEW " + (isQuoteRequest ? "CUSTOM QUOTE" : "CONSULTATION") + " REQUEST - " + (data.name || 'Unknown'),
      body: emailBody
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

function doGet(e) {
  return ContentService
    .createTextOutput("Google Sheets integration is working!")
    .setMimeType(ContentService.MimeType.TEXT);
}

function setupSheet() {
  var sheet = SpreadsheetApp.getActiveSheet();

  sheet.clear();

  var headerRow = [
    'Timestamp',
    'Name',
    'Email',
    'Phone',
    'Address',
    'Zip Code',
    'Current School',
    'High School GPA',
    'College GPA',
    'Target Schools',
    'Test Score',
    'Financial Aid',
    'Intended Major',
    'Transfer Term',
    'Num Schools',
    'Services Interested',
    'Biggest Challenge',
    'Extracurriculars',
    'File Attachments',
    'Additional Info',
    'Message',
    'Status',
    'Source'
  ];

  sheet.getRange(1, 1, 1, headerRow.length).setValues([headerRow]);

  sheet.getRange(1, 1, 1, headerRow.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headerRow.length).setBackground('#4285f4');
  sheet.getRange(1, 1, 1, headerRow.length).setFontColor('white');

  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 120);
  sheet.setColumnWidth(3, 200);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 250);
  sheet.setColumnWidth(6, 100);
  sheet.setColumnWidth(7, 180);
  sheet.setColumnWidth(8, 100);
  sheet.setColumnWidth(9, 100);
  sheet.setColumnWidth(10, 200);
  sheet.setColumnWidth(11, 120);
  sheet.setColumnWidth(12, 120);
  sheet.setColumnWidth(13, 150);
  sheet.setColumnWidth(14, 120);
  sheet.setColumnWidth(15, 100);
  sheet.setColumnWidth(16, 250);
  sheet.setColumnWidth(17, 300);
  sheet.setColumnWidth(18, 400);
  sheet.setColumnWidth(19, 400);
  sheet.setColumnWidth(20, 300);
  sheet.setColumnWidth(21, 300);
  sheet.setColumnWidth(22, 100);
  sheet.setColumnWidth(23, 150);

  Logger.log('Sheet setup complete!');
}
