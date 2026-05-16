import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SalesforceOpportunityData {
  leadId?: string;
  contactId?: string;
  stageName: string;
  amount?: number;
  closeDate?: string;
  description?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const opportunityData: SalesforceOpportunityData = await req.json();

    const SALESFORCE_INSTANCE_URL = Deno.env.get("SALESFORCE_INSTANCE_URL");
    const SALESFORCE_ACCESS_TOKEN = Deno.env.get("SALESFORCE_ACCESS_TOKEN");

    if (!SALESFORCE_INSTANCE_URL || !SALESFORCE_ACCESS_TOKEN) {
      throw new Error("Salesforce credentials not configured");
    }

    const closeDate = opportunityData.closeDate ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const salesforcePayload = {
      Name: `Transfer Consultation - ${new Date().toISOString().split('T')[0]}`,
      StageName: opportunityData.stageName,
      CloseDate: closeDate,
      Amount: opportunityData.amount || 0,
      Description: opportunityData.description || "",
      LeadSource: "Website",
    };

    const response = await fetch(
      `${SALESFORCE_INSTANCE_URL}/services/data/v57.0/sobjects/Opportunity`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SALESFORCE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(salesforcePayload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Salesforce API error:", errorText);
      throw new Error(`Salesforce API error: ${response.statusText}`);
    }

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating Salesforce opportunity:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
