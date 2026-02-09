import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const TIER_PRICES: Record<string, number> = {
  "core": 4900,
  "pro": 9900,
  "elite": 14900
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { tier, partner_id, user_email, return_url } = await req.json();

    if (!tier || !partner_id) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing tier or partner_id" }),
        {
          status: 400,
          headers: { ...corsHeaders, "content-type": "application/json" }
        }
      );
    }

    const amount = TIER_PRICES[tier];
    if (!amount) {
      return new Response(
        JSON.stringify({ ok: false, error: "Invalid tier" }),
        {
          status: 400,
          headers: { ...corsHeaders, "content-type": "application/json" }
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);

    const pbMerchantId = Deno.env.get("GOPAYBRIGHT_MERCHANT_ID");
    const pbApiKey = Deno.env.get("GOPAYBRIGHT_API_KEY");
    const pbEndpoint = Deno.env.get("GOPAYBRIGHT_ENDPOINT") || "https://api.gopaybright.com";

    if (!pbMerchantId || !pbApiKey) {
      return new Response(
        JSON.stringify({ ok: false, error: "GoPayBright not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "content-type": "application/json" }
        }
      );
    }

    const orderId = `partner-crm-${tier}-${partner_id}-${Date.now()}`;

    const checkoutData = {
      merchant_id: pbMerchantId,
      order_id: orderId,
      amount: (amount / 100).toFixed(2),
      currency: "CAD",
      customer_email: user_email,
      recurring: true,
      recurring_frequency: "monthly",
      description: `Partner CRM ${tier.charAt(0).toUpperCase() + tier.slice(1)} - Monthly`,
      callback_url: `${supabaseUrl}/functions/v1/gopaybright-partner-callback`,
      return_url: return_url || "https://local-linkmarketplace.com/partner/crm",
      metadata: JSON.stringify({
        partner_id,
        tier,
        sku: `partner-crm-${tier}`,
        subscription_type: "partner_crm"
      })
    };

    const response = await fetch(`${pbEndpoint}/v1/checkout/create`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${pbApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checkoutData)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GoPayBright error: ${error}`);
    }

    const result = await response.json();

    await sb.from("payment_events").insert({
      provider: "gopaybright",
      event_type: "checkout_created",
      event_id: orderId,
      payload: { request: checkoutData, response: result }
    });

    return new Response(
      JSON.stringify({
        ok: true,
        checkout_url: result.checkout_url || result.payment_url,
        order_id: orderId
      }),
      {
        headers: { ...corsHeaders, "content-type": "application/json" }
      }
    );
  } catch (e) {
    console.error("GoPayBright checkout error:", e);
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }),
      {
        status: 500,
        headers: { ...corsHeaders, "content-type": "application/json" }
      }
    );
  }
});