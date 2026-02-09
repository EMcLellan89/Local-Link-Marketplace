import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

/**
 * GET /api/referral/resolve?slug=partner-slug
 *
 * Resolves a referral slug to partner information.
 *
 * Response:
 * {
 *   "ok": true,
 *   "partner": {
 *     "id": "uuid",
 *     "partner_id_num": 3817,
 *     "name": "John Smith",
 *     "tier": "starter",
 *     "referral_slug": "john-smith-3817"
 *   },
 *   "canonical_ref_url": "https://local-linkmarketplace.com/r/john-smith-3817"
 * }
 */

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ ok: false, error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug")?.trim();

    if (!slug) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing slug parameter" }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Query partners by referral_slug
    const { data: partner, error: pErr } = await supabaseAdmin
      .from("partners")
      .select("id, partner_id_num, primary_contact, tier_key, status, referral_slug")
      .eq("referral_slug", slug)
      .maybeSingle();

    if (pErr) {
      console.error("Database error:", pErr);
      return new Response(
        JSON.stringify({ ok: false, error: `DB error: ${pErr.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!partner) {
      return new Response(
        JSON.stringify({ ok: false, error: "Referral not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (partner.status !== "Active") {
      return new Response(
        JSON.stringify({ ok: false, error: "Partner is inactive" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        partner: {
          id: partner.id,
          partner_id_num: partner.partner_id_num,
          name: partner.primary_contact,
          tier: partner.tier_key,
          referral_slug: partner.referral_slug,
        },
        canonical_ref_url: `https://local-linkmarketplace.com/ref/${partner.referral_slug}`,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error resolving referral:", error);
    return new Response(
      JSON.stringify({ ok: false, error: `Server error: ${error.message || "Unknown error"}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
