import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error("Invalid user token");
    }

    // Get partner record
    const { data: partner, error: partnerError } = await supabase
      .from("partners")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (partnerError) throw partnerError;
    if (!partner) {
      throw new Error("Partner not found");
    }

    // Get all badges
    const { data: allBadges, error: badgesError } = await supabase
      .from("badges")
      .select("*")
      .order("sort_order", { ascending: true });

    if (badgesError) throw badgesError;

    // Get earned badges for this partner
    const { data: earnedBadges, error: earnedError } = await supabase
      .from("partner_badges")
      .select("badge_id, earned_at")
      .eq("partner_id", partner.id);

    if (earnedError) throw earnedError;

    // Create a map of earned badge IDs
    const earnedMap = new Map(
      (earnedBadges || []).map(eb => [eb.badge_id, eb.earned_at])
    );

    // Merge badges with earned status
    const badges = (allBadges || []).map(badge => ({
      id: badge.id,
      slug: badge.slug,
      name: badge.name,
      description: badge.description,
      icon_key: badge.icon_key,
      audience: badge.audience,
      sort_order: badge.sort_order,
      earned: earnedMap.has(badge.id),
      earned_at: earnedMap.get(badge.id) || null,
    }));

    const earnedCount = earnedBadges?.length || 0;

    return new Response(JSON.stringify({ badges, earned_count: earnedCount }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error("Error in partner-badges:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
