import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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
      .select("id, stripe_connect_account_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (partnerError) throw partnerError;

    if (!partner) {
      return new Response(
        JSON.stringify({ error: "Partner profile not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // No Stripe account yet
    if (!partner.stripe_connect_account_id) {
      return new Response(
        JSON.stringify({
          has_account: false,
          details_submitted: false,
          payouts_enabled: false,
          charges_enabled: false,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check Stripe account status
    const accountResponse = await fetch(
      `https://api.stripe.com/v1/accounts/${partner.stripe_connect_account_id}`,
      {
        headers: {
          "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
        },
      }
    );

    if (!accountResponse.ok) {
      throw new Error("Failed to fetch Stripe account");
    }

    const account = await accountResponse.json();

    return new Response(
      JSON.stringify({
        has_account: true,
        account_id: account.id,
        details_submitted: account.details_submitted || false,
        payouts_enabled: account.payouts_enabled || false,
        charges_enabled: account.charges_enabled || false,
        requirements: account.requirements || {},
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in partner-get-connect-status:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
