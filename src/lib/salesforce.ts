const SALESFORCE_ENABLED = import.meta.env.VITE_SALESFORCE_ENABLED === 'true';

export interface SalesforceLeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  leadSource?: string;
  description?: string;
  status?: string;
  customFields?: Record<string, any>;
}

export interface SalesforceContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  description?: string;
  customFields?: Record<string, any>;
}

export const submitLeadToSalesforce = async (
  leadData: SalesforceLeadData
): Promise<{ success: boolean; message: string; leadId?: string }> => {
  if (!SALESFORCE_ENABLED) {
    console.log('Salesforce integration disabled');
    return {
      success: true,
      message: 'Salesforce integration is disabled',
    };
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/salesforce-lead`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(leadData),
      }
    );

    if (!response.ok) {
      throw new Error(`Salesforce API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: 'Lead created successfully',
      leadId: data.id,
    };
  } catch (error) {
    console.error('Error submitting lead to Salesforce:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const submitContactToSalesforce = async (
  contactData: SalesforceContactData
): Promise<{ success: boolean; message: string; contactId?: string }> => {
  if (!SALESFORCE_ENABLED) {
    console.log('Salesforce integration disabled');
    return {
      success: true,
      message: 'Salesforce integration is disabled',
    };
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/salesforce-contact`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(contactData),
      }
    );

    if (!response.ok) {
      throw new Error(`Salesforce API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: 'Contact created successfully',
      contactId: data.id,
    };
  } catch (error) {
    console.error('Error submitting contact to Salesforce:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const updateSalesforceOpportunity = async (
  opportunityData: {
    leadId?: string;
    contactId?: string;
    stageName: string;
    amount?: number;
    closeDate?: string;
    description?: string;
  }
): Promise<{ success: boolean; message: string }> => {
  if (!SALESFORCE_ENABLED) {
    return {
      success: true,
      message: 'Salesforce integration is disabled',
    };
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/salesforce-opportunity`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(opportunityData),
      }
    );

    if (!response.ok) {
      throw new Error(`Salesforce API error: ${response.statusText}`);
    }

    return {
      success: true,
      message: 'Opportunity updated successfully',
    };
  } catch (error) {
    console.error('Error updating Salesforce opportunity:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
