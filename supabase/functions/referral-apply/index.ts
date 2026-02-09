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

/**
 * POST /api/referral/apply
 *
 * Stores referral attribution for browser/session tracking.
 *
 * Body:
 * {
 *   "referral_slug": "john-smith-3817",
 *   "session_id": "client-generated-uuid",
 *   "visitor_email": "optional@email.com"
 * }
 *
 * Response:
 * {
 *   "ok": true,
 *   "partner_id": "uuid",
 *   "partner_id_num": 3817
 * }
 */

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ ok: false, error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const payload = await req.json().catch(() => null) as any;
    const referral_slug = String(payload?.referral_slug || "").trim();
    const session_id = String(payload?.session_id || "").trim();
    const visitor_email = payload?.visitor_email
      ? String(payload.visitor_email).trim().toLowerCase()
      : null;

    if (!referral_slug) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing referral_slug" }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Resolve partner
    const { data: partner, error: pErr } = await supabaseAdmin
      .from("partners")
      .select("id, partner_id_num, status")
      .eq("referral_slug", referral_slug)
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
        JSON.stringify({ ok: false, error: "Partner inactive" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get client info
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const ua = req.headers.get("user-agent") ?? null;

    // Upsert attribution (update last_seen_at if exists)
    if (session_id) {
      const { error: upErr } = await supabaseAdmin
        .from("referral_attribution")
        .upsert(
          {
            referral_slug,
            attributed_partner_id: partner.id,
            partner_id_num: partner.partner_id_num,
            session_id,
            visitor_email,
            ip,
            user_agent: ua,
            last_seen_at: new Date().toISOString(),
          },
          {
            onConflict: "referral_slug,session_id",
            ignoreDuplicates: false,
          }
        );

      if (upErr) {
        console.error("Upsert error:", upErr);
        // Fallback: try insert
        await supabaseAdmin.from("referral_attribution").insert({
          referral_slug,
          attributed_partner_id: partner.id,
          partner_id_num: partner.partner_id_num,
          session_id,
          visitor_email,
          ip,
          user_agent: ua,
        });
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        partner_id: partner.id,
        partner_id_num: partner.partner_id_num,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error applying referral:", error);
    return new Response(
      JSON.stringify({ ok: false, error: `Server error: ${error.message || "Unknown error"}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
