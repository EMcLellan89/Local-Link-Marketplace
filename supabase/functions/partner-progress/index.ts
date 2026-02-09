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

    // Get badges progress
    const { data: earnedBadges, error: badgesError } = await supabase
      .from("partner_badges")
      .select("id")
      .eq("partner_id", partner.id);

    if (badgesError) throw badgesError;

    const { count: totalBadges, error: totalBadgesError } = await supabase
      .from("badges")
      .select("*", { count: "exact", head: true });

    if (totalBadgesError) throw totalBadgesError;

    // Get certifications progress
    const { data: earnedCerts, error: certsError } = await supabase
      .from("partner_certifications")
      .select("id")
      .eq("partner_id", partner.id);

    if (certsError) throw certsError;

    const { count: totalCerts, error: totalCertsError } = await supabase
      .from("certifications")
      .select("*", { count: "exact", head: true });

    if (totalCertsError) throw totalCertsError;

    // Get outreach count
    const { count: outreachCount, error: outreachError } = await supabase
      .from("partner_outreach_logs")
      .select("*", { count: "exact", head: true })
      .eq("partner_id", partner.id);

    if (outreachError) throw outreachError;

    // Calculate completion percentage
    const badgesEarned = earnedBadges?.length || 0;
    const certsEarned = earnedCerts?.length || 0;
    const totalItems = (totalBadges || 0) + (totalCerts || 0);
    const earnedItems = badgesEarned + certsEarned;
    const completionPercentage = totalItems > 0 ? Math.round((earnedItems / totalItems) * 100) : 0;

    // Get next badge recommendation (first unearned badge)
    const earnedBadgeIds = earnedBadges?.map(b => b.id) || [];
    const { data: nextBadge, error: nextBadgeError } = await supabase
      .from("badges")
      .select("name, description")
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();

    const response = {
      badges_earned: badgesEarned,
      total_badges: totalBadges || 0,
      certs_earned: certsEarned,
      total_certs: totalCerts || 0,
      outreach_count: outreachCount || 0,
      completion_percentage: completionPercentage,
      next_badge: nextBadge || null,
    };

    return new Response(JSON.stringify(response), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error("Error in partner-progress:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
