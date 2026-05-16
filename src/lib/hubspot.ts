const PORTAL_ID = import.meta.env.VITE_HUBSPOT_PORTAL_ID;
const FORM_GUID = import.meta.env.VITE_HUBSPOT_FORM_GUID;

export interface HubSpotFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  currentSchool?: string;
  currentGPA?: string;
  highSchoolGPA?: string;
  collegeGPA?: string;
  targetSchools?: string;
  biggestChallenge?: string;
  question?: string;
  message?: string;
}

export const submitToHubSpot = async (
  data: HubSpotFormData
): Promise<{ success: boolean; message: string }> => {
  if (!PORTAL_ID || !FORM_GUID || PORTAL_ID === 'your_portal_id' || FORM_GUID === 'your_form_guid') {
    return { success: false, message: 'HubSpot not configured' };
  }

  try {
    const fields = [
      { name: 'firstname', value: data.firstName },
      { name: 'lastname', value: data.lastName },
      { name: 'email', value: data.email },
      { name: 'phone', value: data.phone || '' },
      { name: 'current_school', value: data.currentSchool || '' },
      { name: 'current_gpa', value: data.currentGPA || data.collegeGPA || data.highSchoolGPA || '' },
      { name: 'high_school_gpa', value: data.highSchoolGPA || '' },
      { name: 'college_gpa', value: data.collegeGPA || '' },
      { name: 'target_schools', value: data.targetSchools || '' },
      { name: 'biggest_challenge', value: data.biggestChallenge || data.question || data.message || '' },
    ].filter((f) => f.value);

    const response = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_GUID}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields,
          context: {
            pageUri: window.location.href,
            pageName: document.title,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HubSpot Forms API error:', errorText);
      return { success: false, message: `HubSpot error: ${response.statusText}` };
    }

    return { success: true, message: 'Successfully submitted to HubSpot' };
  } catch (error) {
    console.error('Error submitting to HubSpot:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
