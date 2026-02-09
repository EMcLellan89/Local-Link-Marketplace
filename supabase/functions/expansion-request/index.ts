import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function normalizeTerritoryName(name: string) {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

function overlaps(existing: string, requested: string) {
  const a = normalizeTerritoryName(existing);
  const b = normalizeTerritoryName(requested);
  return a.includes(b) || b.includes(a);
}

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
      .select("partner_id")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || !profile.partner_id) {
      throw new Error("Partner scope missing");
    }

    const partnerId = profile.partner_id;

    if (req.method === "GET") {
      const { data: eligibilityData } = await supabase.functions.invoke(
        "compute-eligibility",
        { body: { partner_id: partnerId } }
      );

      const { data: requests } = await supabase
        .from("expansion_requests")
        .select("*")
        .eq("partner_id", partnerId)
        .order("created_at", { ascending: false })
        .limit(50);

      return Response.json(
        { requests: requests || [], eligibility: eligibilityData || {} },
        { headers: corsHeaders }
      );
    }

    if (req.method === "POST") {
      const { requested_name, country_code, notes } = await req.json();

      if (!requested_name || !requested_name.trim()) {
        throw new Error("requested_name required");
      }

      if (!country_code || country_code.length < 2) {
        throw new Error("country_code required");
      }

      const { data: eligibilityData } = await supabase.functions.invoke(
        "compute-eligibility",
        { body: { partner_id: partnerId } }
      );

      if (!eligibilityData || !eligibilityData.metrics) {
        throw new Error("Could not compute eligibility");
      }

      const maxOpenRequestsCap = eligibilityData.metrics.maxOpenRequestsCap || 3;
      const maxActiveTerritoriesCap = eligibilityData.metrics.maxActiveTerritoriesCap || 10;

      const { count: openCount } = await supabase
        .from("expansion_requests")
        .select("id", { count: "exact", head: true })
        .eq("partner_id", partnerId)
        .in("status", ["Requested", "UnderReview"]);

      if ((openCount || 0) >= maxOpenRequestsCap) {
        throw new Error(
          `Max open requests reached (${maxOpenRequestsCap}).`
        );
      }

      const activeTerritories = eligibilityData.metrics.activeTerritories || 0;

      if (activeTerritories >= maxActiveTerritoriesCap) {
        throw new Error(
          "Active territory cap reached. Contact support for an override."
        );
      }

      const { data: assigned } = await supabase
        .from("territories")
        .select("territory_name, country_code")
        .eq("assigned_partner_id", partnerId)
        .eq("status", "Assigned");

      const overlap = (assigned || []).find(
        (t) =>
          t.country_code.toUpperCase() === country_code.toUpperCase() &&
          overlaps(t.territory_name, requested_name)
      );

      if (overlap) {
        throw new Error(
          `Requested territory overlaps with your existing territory: ${overlap.territory_name}`
        );
      }

      const { data: existing } = await supabase
        .from("expansion_requests")
        .select("id")
        .eq("partner_id", partnerId)
        .ilike("requested_name", requested_name.trim())
        .eq("country_code", country_code.toUpperCase())
        .in("status", ["Requested", "UnderReview"])
        .maybeSingle();

      if (existing) {
        throw new Error(
          "You already have an open request for this territory."
        );
      }

      if (!eligibilityData.eligible) {
        const score = eligibilityData.score || 0;
        const reasons = (eligibilityData.reasons || []).join(" ");
        throw new Error(
          `Not eligible yet (score ${score}/100). Reasons: ${reasons}`
        );
      }

      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      const { data: created, error: createError } = await supabaseAdmin
        .from("expansion_requests")
        .insert({
          partner_id: partnerId,
          requested_name: requested_name.trim(),
          country_code: country_code.toUpperCase(),
          notes: notes || null,
          status: "Requested",
        })
        .select()
        .single();

      if (createError) throw createError;

      return Response.json(
        { ok: true, id: created.id, score: eligibilityData.score },
        { headers: corsHeaders }
      );
    }

    throw new Error("Method not allowed");
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 400, headers: corsHeaders }
    );
  }
});
