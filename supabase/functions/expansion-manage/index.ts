import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
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

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (req.method === "GET") {
      const { data: requests } = await supabaseAdmin
        .from("expansion_requests")
        .select(`
          *,
          partners (
            id,
            company_name,
            email
          )
        `)
        .order("created_at", { ascending: false })
        .limit(200);

      return Response.json(
        { requests: requests || [] },
        { headers: corsHeaders }
      );
    }

    const { action, request_id, admin_notes, territory_id, create_if_missing, territory_type, currency_code, language_code } = await req.json();

    if (!request_id) {
      throw new Error("request_id required");
    }

    const { data: expansionRequest } = await supabaseAdmin
      .from("expansion_requests")
      .select("*")
      .eq("id", request_id)
      .maybeSingle();

    if (!expansionRequest) {
      throw new Error("Expansion request not found");
    }

    if (action === "update_status") {
      const { status } = await req.json();
      if (!["Requested", "UnderReview", "Approved", "Declined"].includes(status)) {
        throw new Error("Invalid status");
      }

      await supabaseAdmin
        .from("expansion_requests")
        .update({ status })
        .eq("id", request_id);

      await supabaseAdmin.from("audit_logs").insert({
        actor_user_id: user.id,
        action: "EXPANSION_STATUS_UPDATED",
        entity_type: "ExpansionRequest",
        entity_id: request_id,
        metadata: { status },
      });

      return Response.json({ ok: true }, { headers: corsHeaders });
    }

    if (action === "approve") {
      const { data: eligibilityData } = await supabase.functions.invoke(
        "compute-eligibility",
        { body: { partner_id: expansionRequest.partner_id } }
      );

      if (!eligibilityData || !eligibilityData.eligible) {
        const score = eligibilityData?.score || 0;
        const reasons = (eligibilityData?.reasons || []).join(" ");
        throw new Error(
          `Partner not eligible for expansion (score ${score}/100): ${reasons}`
        );
      }

      let territory = null;

      if (territory_id) {
        const { data: t } = await supabaseAdmin
          .from("territories")
          .select("*")
          .eq("id", territory_id)
          .maybeSingle();
        territory = t;
      } else {
        const { data: t } = await supabaseAdmin
          .from("territories")
          .select("*")
          .ilike("territory_name", expansionRequest.requested_name)
          .eq("country_code", expansionRequest.country_code)
          .maybeSingle();
        territory = t;
      }

      if (!territory && create_if_missing) {
        const { data: created } = await supabaseAdmin
          .from("territories")
          .insert({
            territory_name: expansionRequest.requested_name,
            territory_type: territory_type || "Metro",
            country_code: expansionRequest.country_code,
            currency_code: currency_code || "USD",
            language_code: language_code || "en",
            status: "Available",
          })
          .select()
          .single();
        territory = created;
      }

      if (!territory) {
        throw new Error("No territory found and not created");
      }

      if (territory.status === "Locked") {
        throw new Error("Territory is locked");
      }

      await supabaseAdmin
        .from("territories")
        .update({
          status: "Assigned",
          assigned_partner_id: expansionRequest.partner_id,
          last_activity_at: new Date().toISOString(),
        })
        .eq("id", territory.id);

      await supabaseAdmin
        .from("expansion_requests")
        .update({
          status: "Approved",
          admin_notes: admin_notes || `Assigned territory ${territory.territory_name}`,
        })
        .eq("id", request_id);

      await supabaseAdmin.from("audit_logs").insert({
        actor_user_id: user.id,
        action: "EXPANSION_APPROVED_AND_ASSIGNED",
        entity_type: "ExpansionRequest",
        entity_id: request_id,
        metadata: { territory_id: territory.id, partner_id: expansionRequest.partner_id },
      });

      return Response.json(
        { ok: true, territory_id: territory.id },
        { headers: corsHeaders }
      );
    }

    if (action === "decline") {
      await supabaseAdmin
        .from("expansion_requests")
        .update({
          status: "Declined",
          admin_notes: admin_notes || null,
        })
        .eq("id", request_id);

      await supabaseAdmin.from("audit_logs").insert({
        actor_user_id: user.id,
        action: "EXPANSION_DECLINED",
        entity_type: "ExpansionRequest",
        entity_id: request_id,
        metadata: { admin_notes: admin_notes || "" },
      });

      return Response.json({ ok: true }, { headers: corsHeaders });
    }

    throw new Error("Unknown action");
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 400, headers: corsHeaders }
    );
  }
});
