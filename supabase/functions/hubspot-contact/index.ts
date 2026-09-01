import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface HubSpotContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source?: string;
  message?: string;
  currentSchool?: string;
  currentGPA?: string;
  highSchoolGPA?: string;
  collegeGPA?: string;
  targetSchools?: string;
  biggestChallenge?: string;
  question?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const contactData: HubSpotContactData = await req.json();

    const HUBSPOT_ACCESS_TOKEN = Deno.env.get("HUBSPOT_ACCESS_TOKEN");

    if (!HUBSPOT_ACCESS_TOKEN) {
      throw new Error("HubSpot access token not configured");
    }

    const notes: string[] = [];
    if (contactData.currentSchool)
      notes.push(`Current School: ${contactData.currentSchool}`);
    if (contactData.currentGPA)
      notes.push(`Current GPA: ${contactData.currentGPA}`);
    if (contactData.highSchoolGPA)
      notes.push(`High School GPA: ${contactData.highSchoolGPA}`);
    if (contactData.collegeGPA)
      notes.push(`College GPA: ${contactData.collegeGPA}`);
    if (contactData.targetSchools)
      notes.push(`Target Schools: ${contactData.targetSchools}`);
    if (contactData.biggestChallenge)
      notes.push(`Biggest Challenge: ${contactData.biggestChallenge}`);
    if (contactData.question)
      notes.push(`Question: ${contactData.question}`);
    if (contactData.message)
      notes.push(`Message: ${contactData.message}`);

    const hubspotPayload: Record<string, unknown> = {
      properties: {
        firstname: contactData.firstName,
        lastname: contactData.lastName,
        email: contactData.email,
        phone: contactData.phone || "",
        hs_lead_status: "NEW",
        lifecyclestage: "lead",
      },
    };

    if (contactData.source) {
      (hubspotPayload.properties as Record<string, string>).leadsource =
        contactData.source;
    }

    if (notes.length > 0) {
      (hubspotPayload.properties as Record<string, string>).notes_last_contacted =
        "";
      (hubspotPayload.properties as Record<string, string>).message =
        notes.join("\n");
    }

    const response = await fetch(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hubspotPayload),
      }
    );

    if (response.status === 409) {
      const errorData = await response.json();
      const existingId = errorData?.message?.match(/Existing ID: (\d+)/)?.[1];

      if (existingId) {
        const updatePayload: Record<string, unknown> = {
          properties: {
            phone: contactData.phone || "",
            hs_lead_status: "NEW",
          },
        };

        if (notes.length > 0) {
          (updatePayload.properties as Record<string, string>).message =
            notes.join("\n");
        }

        const updateResponse = await fetch(
          `https://api.hubapi.com/crm/v3/objects/contacts/${existingId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatePayload),
          }
        );

        if (!updateResponse.ok) {
          const updateError = await updateResponse.text();
          console.error("HubSpot update error:", updateError);
          throw new Error(`HubSpot update error: ${updateResponse.statusText}`);
        }

        const updateResult = await updateResponse.json();
        return new Response(
          JSON.stringify({ id: updateResult.id, updated: true }),
          {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      throw new Error("Contact already exists but could not extract ID");
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HubSpot API error:", errorText);
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    const result = await response.json();

    return new Response(JSON.stringify({ id: result.id }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating HubSpot contact:", error);
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
