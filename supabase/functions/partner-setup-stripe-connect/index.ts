import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing environment variables");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get partner record
    const { data: partner, error: partnerError } = await supabase
      .from("partners")
      .select("id, stripe_connect_account_id, display_name, user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (partnerError) throw partnerError;

    if (!partner) {
      return new Response(
        JSON.stringify({ error: "Partner profile not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let accountId = partner.stripe_connect_account_id;

    // Create Stripe Connect account if doesn't exist
    if (!accountId) {
      const createAccountResponse = await fetch("https://api.stripe.com/v1/accounts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          type: "express",
          country: "US",
          email: user.email || "",
          capabilities: JSON.stringify({
            transfers: { requested: true },
          }),
          business_type: "individual",
          metadata: JSON.stringify({
            partner_id: partner.id,
            partner_name: partner.display_name,
          }),
        }),
      });

      if (!createAccountResponse.ok) {
        const error = await createAccountResponse.text();
        throw new Error(`Failed to create Stripe account: ${error}`);
      }

      const account = await createAccountResponse.json();
      accountId = account.id;

      // Update partner with Stripe Connect account ID
      const { error: updateError } = await supabase
        .from("partners")
        .update({ stripe_connect_account_id: accountId })
        .eq("id", partner.id);

      if (updateError) throw updateError;

      console.log(`✅ Created Stripe Connect account ${accountId} for partner ${partner.id}`);
    }

    // Create onboarding link
    const returnUrl = `${req.headers.get("origin") || "http://localhost:5173"}/partner/earnings`;
    const refreshUrl = returnUrl;

    const accountLinkResponse = await fetch("https://api.stripe.com/v1/account_links", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        account: accountId,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: "account_onboarding",
      }),
    });

    if (!accountLinkResponse.ok) {
      const error = await accountLinkResponse.text();
      throw new Error(`Failed to create account link: ${error}`);
    }

    const accountLink = await accountLinkResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        onboarding_url: accountLink.url,
        account_id: accountId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in partner-setup-stripe-connect:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
