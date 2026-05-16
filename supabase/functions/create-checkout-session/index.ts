import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    
    if (!STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key not configured");
    }

    const { customerEmail, customerName } = await req.json();

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "payment_method_types[0]": "card",
        "line_items[0][price_data][currency]": "usd",
        "line_items[0][price_data][product_data][name]": "1-Hour Strategy Consultation with Ajay",
        "line_items[0][price_data][product_data][description]": "Full application audit: essays, extracurriculars, grades, and school list analysis",
        "line_items[0][price_data][unit_amount]": "8900",
        "line_items[0][quantity]": "1",
        "mode": "payment",
        "success_url": `${req.headers.get("origin")}/consultation-success?session_id={CHECKOUT_SESSION_ID}`,
        "cancel_url": `${req.headers.get("origin")}/#consultation`,
        "customer_email": customerEmail,
        "metadata[customer_name]": customerName,
      }).toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Stripe API error:", error);
      throw new Error(`Stripe API error: ${response.status}`);
    }

    const session = await response.json();

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create checkout session" }),
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