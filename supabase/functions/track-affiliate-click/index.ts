import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { referral_code, clicked_url, referrer } = await req.json();

    if (!referral_code) {
      return new Response(
        JSON.stringify({ error: "Missing referral_code" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get partner by referral code
    const { data: partner, error: partnerError } = await supabaseAdmin
      .from("partners")
      .select("id, affiliate_enabled, total_clicks")
      .eq("referral_code", referral_code)
      .eq("affiliate_enabled", true)
      .single();

    if (partnerError || !partner) {
      return new Response(
        JSON.stringify({ error: "Invalid referral code" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get IP and user agent from request
    const ip_address = req.headers.get("x-forwarded-for") || "unknown";
    const user_agent = req.headers.get("user-agent") || "unknown";

    // Record click
    const { error: clickError } = await supabaseAdmin
      .from("affiliate_clicks")
      .insert({
        partner_id: partner.id,
        referral_code: referral_code,
        clicked_url: clicked_url || req.url,
        ip_address: ip_address,
        user_agent: user_agent,
        referrer: referrer || req.headers.get("referer") || null,
        converted: false,
      });

    if (clickError) {
      console.error("Error recording click:", clickError);
    }

    // Increment partner click count
    await supabaseAdmin
      .from("partners")
      .update({ total_clicks: (partner.total_clicks || 0) + 1 })
      .eq("id", partner.id);

    return new Response(
      JSON.stringify({ success: true, partner_id: partner.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Click tracking error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});