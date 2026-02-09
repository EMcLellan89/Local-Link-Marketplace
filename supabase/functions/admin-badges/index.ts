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
      // Get all badges with earned counts
      const { data: badges, error: badgesError } = await supabase
        .from("badges")
        .select("*")
        .order("sort_order", { ascending: true });

      if (badgesError) throw badgesError;

      // Get earned count for each badge
      const badgesWithCounts = await Promise.all(
        (badges || []).map(async (badge) => {
          const { count, error: countError } = await supabase
            .from("partner_badges")
            .select("*", { count: "exact", head: true })
            .eq("badge_id", badge.id);

          return {
            ...badge,
            earned_count: countError ? 0 : (count || 0),
          };
        })
      );

      return new Response(JSON.stringify({ badges: badgesWithCounts }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    if (req.method === "PUT") {
      const body = await req.json();
      const { badge_id, updates } = body;

      if (!badge_id || !updates) {
        throw new Error("Missing badge_id or updates");
      }

      // Update badge
      const { data: updatedBadge, error: updateError } = await supabase
        .from("badges")
        .update(updates)
        .eq("id", badge_id)
        .select()
        .single();

      if (updateError) throw updateError;

      return new Response(JSON.stringify({ success: true, badge: updatedBadge }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    throw new Error("Method not allowed");
  } catch (err: any) {
    console.error("Error in admin-badges:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
