import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const INACTIVITY_DAYS = 21;

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

    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - INACTIVITY_DAYS);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: candidates } = await supabaseAdmin
      .from("territories")
      .select("id, assigned_partner_id, territory_name, last_activity_at")
      .eq("status", "Assigned")
      .or(`last_activity_at.lt.${cutoff.toISOString()},last_activity_at.is.null`)
      .limit(500);

    if (!candidates || candidates.length === 0) {
      return Response.json(
        { ok: true, evaluated: 0, movedToRecovering: 0 },
        { headers: corsHeaders }
      );
    }

    let moved = 0;
    const start30d = new Date(now);
    start30d.setDate(start30d.getDate() - 30);

    for (const territory of candidates) {
      if (!territory.assigned_partner_id) continue;

      const { count } = await supabaseAdmin
        .from("transactions")
        .select("id", { count: "exact", head: true })
        .eq("territory_id", territory.id)
        .eq("payment_status", "Paid")
        .gte("created_at", start30d.toISOString());

      if ((count || 0) === 0) {
        await supabaseAdmin
          .from("territories")
          .update({ status: "Recovering" })
          .eq("id", territory.id);

        moved++;

        await supabaseAdmin.from("audit_logs").insert({
          actor_user_id: user.id,
          action: "TERRITORY_AUTO_RECOVER",
          entity_type: "Territory",
          entity_id: territory.id,
          metadata: {
            reason: `No paid tx in 30d and inactive > ${INACTIVITY_DAYS}d`,
          },
        });
      }
    }

    return Response.json(
      { ok: true, evaluated: candidates.length, movedToRecovering: moved },
      { headers: corsHeaders }
    );
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 400, headers: corsHeaders }
    );
  }
});
