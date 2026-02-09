import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);

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
    const {
      checkout_session_id,
      stripe_checkout_session_id,
      customer_email,
    } = await req.json();

    if (!checkout_session_id && !stripe_checkout_session_id) {
      return new Response(
        JSON.stringify({ error: "Provide checkout_session_id or stripe_checkout_session_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Lookup checkout session
    let cs: any = null;

    if (checkout_session_id) {
      const { data } = await supabaseAdmin
        .from("marketplace_checkout_sessions")
        .select("*")
        .eq("id", checkout_session_id)
        .maybeSingle();
      cs = data;
    } else {
      const { data } = await supabaseAdmin
        .from("marketplace_checkout_sessions")
        .select("*")
        .eq("stripe_checkout_session_id", stripe_checkout_session_id)
        .maybeSingle();
      cs = data;
    }

    if (!cs) {
      return new Response(
        JSON.stringify({ error: "Checkout session not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If already paid, don't mark as abandoned
    if (cs.status === "paid") {
      return new Response(
        JSON.stringify({ ok: true, ignored: true, reason: "already_paid" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update email if provided
    if (customer_email && !cs.customer_email) {
      await supabaseAdmin
        .from("marketplace_checkout_sessions")
        .update({ customer_email })
        .eq("id", cs.id);
    }

    // Mark abandoned cart
    await supabaseAdmin.from("marketplace_abandoned_carts").upsert(
      {
        checkout_session_id: cs.id,
        status: "abandoned",
        expires_at: cs.created_at
          ? new Date(new Date(cs.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
          : null,
      },
      { onConflict: "checkout_session_id" }
    );

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error abandoning checkout:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to abandon checkout" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
