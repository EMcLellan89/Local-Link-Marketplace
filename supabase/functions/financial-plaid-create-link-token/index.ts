import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { plaidClient } from "../_shared/plaidClient.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { Products, CountryCode } from "npm:plaid@18.1.0";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { merchant_id } = await req.json();

    if (!merchant_id) {
      return new Response(
        JSON.stringify({ error: "Missing merchant_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = supabaseAdmin();
    const { data: merchant } = await supabase
      .from("merchants")
      .select("name")
      .eq("id", merchant_id)
      .maybeSingle();

    if (!merchant) {
      return new Response(
        JSON.stringify({ error: "Merchant not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const plaid = plaidClient();

    const request = {
      user: {
        client_user_id: merchant_id,
      },
      client_name: "Local-Link Financial Engine",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
      webhook: `${Deno.env.get("SUPABASE_URL")}/functions/v1/financial-plaid-webhook`,
    };

    const response = await plaid.linkTokenCreate(request);

    return new Response(
      JSON.stringify({ link_token: response.data.link_token }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Plaid Create Link Token] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
