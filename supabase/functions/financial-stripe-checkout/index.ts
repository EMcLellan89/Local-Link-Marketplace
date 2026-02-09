import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { stripeClient } from "../_shared/stripeClient.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const {
      plan_code,
      merchant_id,
      referral_id,
      referral_name,
      partner_id,
      success_url,
      cancel_url,
    } = await req.json();

    if (!plan_code || !merchant_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: plan_code, merchant_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = supabaseAdmin();
    const stripe = stripeClient();

    const { data: plan, error: planError } = await supabase
      .from("plan_pricing")
      .select("*")
      .eq("code", plan_code)
      .maybeSingle();

    if (planError || !plan) {
      return new Response(
        JSON.stringify({ error: "Plan not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: merchant } = await supabase
      .from("merchants")
      .select("name, email")
      .eq("id", merchant_id)
      .maybeSingle();

    const metadata: Record<string, string> = {
      merchant_id,
      plan_code,
    };

    if (referral_id) metadata.referral_id = referral_id;
    if (referral_name) metadata.referral_name = referral_name;
    if (partner_id) metadata.partner_id = partner_id;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: `Financial Engine - ${plan.name}`,
            },
            unit_amount: Math.round(plan.monthly_price * 100),
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      customer_email: merchant?.email || undefined,
      metadata,
      subscription_data: {
        metadata,
      },
      success_url: success_url || `${Deno.env.get("FRONTEND_URL")}/merchant/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${Deno.env.get("FRONTEND_URL")}/merchant/upgrade`,
    });

    return new Response(
      JSON.stringify({ session_id: session.id, url: session.url }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Financial Stripe Checkout] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
