import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface StripeAccount {
  id: string;
  details_submitted: boolean;
  charges_enabled: boolean;
  payouts_enabled: boolean;
}

interface StripeAccountLink {
  url: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase environment variables not configured");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: creator, error: creatorError } = await supabaseClient
      .from("ugc_creators")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (creatorError) {
      throw creatorError;
    }

    if (!creator) {
      return new Response(
        JSON.stringify({ error: "Creator profile not found. Please apply to be a creator first." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let accountId = creator.stripe_connect_account_id;

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
          email: creator.payout_email || user.email || "",
          capabilities: JSON.stringify({
            card_payments: { requested: true },
            transfers: { requested: true },
          }),
          business_type: "individual",
        }),
      });

      if (!createAccountResponse.ok) {
        const error = await createAccountResponse.text();
        throw new Error(`Failed to create Stripe account: ${error}`);
      }

      const account: StripeAccount = await createAccountResponse.json();
      accountId = account.id;

      const { error: updateError } = await supabaseClient
        .from("ugc_creators")
        .update({
          stripe_connect_account_id: accountId,
          connect_details_submitted: account.details_submitted,
          connect_charges_enabled: account.charges_enabled,
          connect_payouts_enabled: account.payouts_enabled,
          connect_enabled: account.details_submitted && account.charges_enabled && account.payouts_enabled,
          updated_at: new Date().toISOString(),
        })
        .eq("id", creator.id);

      if (updateError) {
        throw updateError;
      }
    }

    const returnUrl = `${req.headers.get("origin") || "http://localhost:5173"}/creator/wallet`;
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

    const accountLink: StripeAccountLink = await accountLinkResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        onboarding_url: accountLink.url,
        account_id: accountId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in create-stripe-connect-account:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
