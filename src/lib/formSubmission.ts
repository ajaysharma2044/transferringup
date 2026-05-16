const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

export interface FormSubmissionData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone?: string;
  address?: string;
  zipCode?: string;
  currentSchool?: string;
  currentGPA?: string;
  highSchoolGPA?: string;
  collegeGPA?: string;
  targetSchools?: string;
  biggestChallenge?: string;
  testScore?: string;
  financialAid?: string;
  intendedMajor?: string;
  transferTerm?: string;
  numSchools?: string;
  servicesInterested?: string;
  additionalInfo?: string;
  extracurriculars?: string;
  fileUrls?: string;
  question?: string;
  message?: string;
  source?: string;
}

export const submitFormWithNotification = async (
  data: FormSubmissionData
): Promise<{ success: boolean }> => {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('YOUR_DEPLOYED_SCRIPT_ID')) {
    return { success: false };
  }

  const fullName = data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim();

  const payload: Record<string, string> = {
    name: fullName,
    firstName: data.firstName || fullName.split(' ')[0] || '',
    lastName: data.lastName || fullName.split(' ').slice(1).join(' ') || '',
    email: data.email,
    phone: data.phone || '',
    address: data.address || '',
    zipCode: data.zipCode || '',
    currentSchool: data.currentSchool || '',
    currentGPA: data.currentGPA || '',
    highSchoolGPA: data.highSchoolGPA || '',
    collegeGPA: data.collegeGPA || '',
    targetSchools: data.targetSchools || '',
    biggestChallenge: data.biggestChallenge || '',
    testScore: data.testScore || '',
    financialAid: data.financialAid || '',
    intendedMajor: data.intendedMajor || '',
    transferTerm: data.transferTerm || '',
    numSchools: data.numSchools || '',
    servicesInterested: data.servicesInterested || '',
    additionalInfo: data.additionalInfo || '',
    extracurriculars: data.extracurriculars || '',
    fileUrls: data.fileUrls || '',
    question: data.question || '',
    message: data.message || '',
    source: data.source || 'Website',
    timestamp: new Date().toISOString(),
    sendEmail: 'true',
  };

  try {
    const formBody = new URLSearchParams(payload).toString();
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody,
    });
    return { success: true };
  } catch (err) {
    console.error('Form submission error:', err);
    return { success: false };
  }
};
