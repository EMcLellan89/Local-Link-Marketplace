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

    const { action, territory_id, partner_id } = await req.json();

    if (!territory_id) {
      throw new Error("territory_id required");
    }

    const { data: territory, error: territoryError } = await supabase
      .from("territories")
      .select("*")
      .eq("id", territory_id)
      .maybeSingle();

    if (territoryError || !territory) {
      throw new Error("Territory not found");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (action === "ASSIGN") {
      if (!partner_id) {
        throw new Error("partner_id required");
      }
      if (territory.status === "Locked") {
        throw new Error("Territory is locked");
      }

      const { error: updateError } = await supabaseAdmin
        .from("territories")
        .update({
          status: "Assigned",
          assigned_partner_id: partner_id,
          last_activity_at: new Date().toISOString(),
        })
        .eq("id", territory_id);

      if (updateError) throw updateError;

      await supabaseAdmin.from("audit_logs").insert({
        actor_user_id: user.id,
        action: "TERRITORY_ASSIGNED",
        entity_type: "Territory",
        entity_id: territory_id,
        metadata: { partner_id },
      });

      return Response.json({ ok: true }, { headers: corsHeaders });
    }

    if (action === "RECOVER") {
      if (territory.status === "Locked") {
        throw new Error("Territory is locked");
      }

      const { error: updateError } = await supabaseAdmin
        .from("territories")
        .update({
          status: "Recovering",
          last_activity_at: new Date().toISOString(),
        })
        .eq("id", territory_id);

      if (updateError) throw updateError;

      await supabaseAdmin.from("audit_logs").insert({
        actor_user_id: user.id,
        action: "TERRITORY_RECOVERING",
        entity_type: "Territory",
        entity_id: territory_id,
      });

      return Response.json({ ok: true }, { headers: corsHeaders });
    }

    if (action === "LOCK") {
      const { error: updateError } = await supabaseAdmin
        .from("territories")
        .update({ status: "Locked" })
        .eq("id", territory_id);

      if (updateError) throw updateError;

      await supabaseAdmin.from("audit_logs").insert({
        actor_user_id: user.id,
        action: "TERRITORY_LOCKED",
        entity_type: "Territory",
        entity_id: territory_id,
      });

      return Response.json({ ok: true }, { headers: corsHeaders });
    }

    if (action === "UNLOCK") {
      const nextStatus = territory.assigned_partner_id ? "Assigned" : "Available";
      const { error: updateError } = await supabaseAdmin
        .from("territories")
        .update({ status: nextStatus })
        .eq("id", territory_id);

      if (updateError) throw updateError;

      await supabaseAdmin.from("audit_logs").insert({
        actor_user_id: user.id,
        action: "TERRITORY_UNLOCKED",
        entity_type: "Territory",
        entity_id: territory_id,
        metadata: { nextStatus },
      });

      return Response.json({ ok: true }, { headers: corsHeaders });
    }

    if (action === "UNASSIGN") {
      if (territory.status === "Locked") {
        throw new Error("Territory is locked");
      }

      const { error: updateError } = await supabaseAdmin
        .from("territories")
        .update({
          status: "Available",
          assigned_partner_id: null,
        })
        .eq("id", territory_id);

      if (updateError) throw updateError;

      await supabaseAdmin.from("audit_logs").insert({
        actor_user_id: user.id,
        action: "TERRITORY_UNASSIGNED",
        entity_type: "Territory",
        entity_id: territory_id,
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
