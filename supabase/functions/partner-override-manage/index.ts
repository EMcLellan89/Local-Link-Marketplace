import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || profile.role !== "admin") {
      throw new Error("Admin access required");
    }

    const {
      partner_id,
      allow_expansion_despite_score,
      max_active_territories_override,
      max_open_requests_override,
      notes,
    } = await req.json();

    if (!partner_id) {
      throw new Error("partner_id required");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const overrideData = {
      allow_expansion_despite_score: !!allow_expansion_despite_score,
      max_active_territories_override:
        max_active_territories_override === null || max_active_territories_override === undefined
          ? null
          : Number(max_active_territories_override),
      max_open_requests_override:
        max_open_requests_override === null || max_open_requests_override === undefined
          ? null
          : Number(max_open_requests_override),
      notes: notes ? String(notes) : null,
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await supabaseAdmin
      .from("partner_overrides")
      .select("id")
      .eq("partner_id", partner_id)
      .maybeSingle();

    let result;
    if (existing) {
      const { data, error } = await supabaseAdmin
        .from("partner_overrides")
        .update(overrideData)
        .eq("partner_id", partner_id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from("partner_overrides")
        .insert({
          partner_id,
          ...overrideData,
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    await supabaseAdmin.from("audit_logs").insert({
      actor_user_id: user.id,
      action: "PARTNER_OVERRIDE_UPDATED",
      entity_type: "PartnerOverride",
      entity_id: result.id,
      metadata: overrideData,
    });

    return Response.json({ ok: true, id: result.id }, { headers: corsHeaders });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 400, headers: corsHeaders }
    );
  }
});
