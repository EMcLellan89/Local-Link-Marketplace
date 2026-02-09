import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SITE = "https://local-linkmarketplace.com";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const {
      price_id,
      mode,
      sku,
      partner_code,
      partner_id,
      tier,
      customer_email,
      success_path,
      cancel_path
    } = await req.json();

    if (!price_id || !mode || !sku) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing price_id/mode/sku" }),
        {
          status: 400,
          headers: { ...corsHeaders, "content-type": "application/json" }
        }
      );
    }

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ ok: false, error: "Stripe not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "content-type": "application/json" }
        }
      );
    }

    const success_url = `${SITE}${success_path ?? "/checkout/success"}?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${SITE}${cancel_path ?? "/checkout/cancel"}`;

    const baseMeta: Record<string, string> = {
      sku: String(sku),
      partner_code: partner_code ? String(partner_code).trim() : "",
      ...(tier ? { tier: String(tier) } : {})
    };

    const subMeta: Record<string, string> = {
      ...baseMeta,
      ...(partner_id ? { partner_id: String(partner_id) } : {})
    };

    const sessionData: any = {
      mode,
      line_items: [{ price: price_id, quantity: 1 }],
      success_url,
      cancel_url,
      allow_promotion_codes: true,
      metadata: baseMeta
    };

    if (customer_email) {
      sessionData.customer_email = customer_email;
    }

    if (mode === "subscription") {
      sessionData.subscription_data = { metadata: subMeta };
    } else {
      sessionData.payment_intent_data = { metadata: baseMeta };
    }

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(sessionData as any).toString(),
    });

    if (!stripeResponse.ok) {
      const error = await stripeResponse.text();
      throw new Error(`Stripe error: ${error}`);
    }

    const session = await stripeResponse.json();

    if (partner_code && session.customer) {
      await fetch(`https://api.stripe.com/v1/customers/${session.customer}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${stripeSecretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          "metadata[partner_code]": String(partner_code).trim()
        }).toString(),
      });
    }

    return new Response(
      JSON.stringify({ ok: true, url: session.url, id: session.id }),
      {
        headers: { ...corsHeaders, "content-type": "application/json" }
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }),
      {
        status: 500,
        headers: { ...corsHeaders, "content-type": "application/json" }
      }
    );
  }
});