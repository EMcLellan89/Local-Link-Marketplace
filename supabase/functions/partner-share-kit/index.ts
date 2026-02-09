import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ ok: false, error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get partner profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("referral_name, referral_id, partner_id")
      .eq("id", user.id)
      .single();

    if (!profile?.partner_id) {
      return new Response(JSON.stringify({ ok: false, error: "Not a partner" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get partner link slug
    const { data: partner } = await supabase
      .from("partners")
      .select("link_slug")
      .eq("id", profile.partner_id)
      .single();

    if (!partner?.link_slug) {
      return new Response(JSON.stringify({ ok: false, error: "Partner link not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const baseUrl = Deno.env.get("PUBLIC_BASE_URL") || "https://local-link.com";
    const shareLink = `${baseUrl}/p/${partner.link_slug}`;

    // Generate QR code URL
    const qrUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/generate-qr-code?data=${encodeURIComponent(shareLink)}`;

    // Pre-filled message for copy/paste
    const message =
      `🎯 Grow Your Business with Local-Link!\n\n` +
      `I'm partnering with Local-Link to help local businesses succeed.\n\n` +
      `Get exclusive deals on:\n` +
      `✓ Customer retention & loyalty programs\n` +
      `✓ Marketing automation & AI tools\n` +
      `✓ Payment processing & business capital\n` +
      `✓ And much more!\n\n` +
      `Click here to learn more: ${shareLink}\n\n` +
      `Use these details when signing up:\n` +
      `Referral Name: ${profile.referral_name}\n` +
      `Referral ID#: ${profile.referral_id}`;

    return new Response(JSON.stringify({
      ok: true,
      link: shareLink,
      qr_url: qrUrl,
      message,
      referral_name: profile.referral_name,
      referral_id: profile.referral_id,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
