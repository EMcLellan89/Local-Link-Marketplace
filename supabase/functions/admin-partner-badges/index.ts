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

    // Verify admin user
    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (adminError || !adminUser) {
      throw new Error("Unauthorized: Admin access required");
    }

    if (req.method === "GET") {
      // Get partner badges by partner_id from query string
      const url = new URL(req.url);
      const partnerId = url.searchParams.get("partner_id");

      if (!partnerId) {
        throw new Error("Missing partner_id parameter");
      }

      // Get all badges
      const { data: allBadges, error: badgesError } = await supabase
        .from("badges")
        .select("*")
        .order("sort_order", { ascending: true });

      if (badgesError) throw badgesError;

      // Get partner's earned badges
      const { data: earnedBadges, error: earnedError } = await supabase
        .from("partner_badges")
        .select("badge_id, earned_at, id")
        .eq("partner_id", partnerId);

      if (earnedError) throw earnedError;

      // Create a map of earned badges
      const earnedMap = new Map(
        (earnedBadges || []).map((pb) => [pb.badge_id, { earned_at: pb.earned_at, id: pb.id }])
      );

      // Merge badges with earned status
      const badges = (allBadges || []).map((badge) => ({
        id: badge.id,
        slug: badge.slug,
        name: badge.name,
        description: badge.description,
        icon_key: badge.icon_key,
        audience: badge.audience,
        earned: earnedMap.has(badge.id),
        earned_at: earnedMap.get(badge.id)?.earned_at || null,
        partner_badge_id: earnedMap.get(badge.id)?.id || null,
      }));

      return new Response(JSON.stringify({ badges }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    if (req.method === "POST") {
      // Award badge to partner
      const body = await req.json();
      const { partner_id, badge_id } = body;

      if (!partner_id || !badge_id) {
        throw new Error("Missing partner_id or badge_id");
      }

      // Check if already awarded
      const { data: existing, error: existingError } = await supabase
        .from("partner_badges")
        .select("id")
        .eq("partner_id", partner_id)
        .eq("badge_id", badge_id)
        .maybeSingle();

      if (existingError) throw existingError;

      if (existing) {
        throw new Error("Badge already awarded to this partner");
      }

      // Award badge
      const { data: partnerBadge, error: awardError } = await supabase
        .from("partner_badges")
        .insert({
          partner_id,
          badge_id,
          earned_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (awardError) throw awardError;

      return new Response(JSON.stringify({ success: true, partner_badge: partnerBadge }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    if (req.method === "DELETE") {
      // Revoke badge from partner
      const body = await req.json();
      const { partner_badge_id } = body;

      if (!partner_badge_id) {
        throw new Error("Missing partner_badge_id");
      }

      // Delete partner badge
      const { error: deleteError } = await supabase
        .from("partner_badges")
        .delete()
        .eq("id", partner_badge_id);

      if (deleteError) throw deleteError;

      return new Response(JSON.stringify({ success: true }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    throw new Error("Method not allowed");
  } catch (err: any) {
    console.error("Error in admin-partner-badges:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
