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

    const body = await req.json();
    const { partner_id, badge_id, reason } = body;

    if (!partner_id || !badge_id) {
      throw new Error("Missing partner_id or badge_id");
    }

    // Check if badge already awarded
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

    // Award badge with metadata
    const metadata = {
      awarded_by_admin: user.id,
      reason: reason || null,
      awarded_at: new Date().toISOString(),
    };

    const { data: partnerBadge, error: awardError } = await supabase
      .from("partner_badges")
      .insert({
        partner_id,
        badge_id,
        earned_at: new Date().toISOString(),
        metadata,
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
  } catch (err: any) {
    console.error("Error in admin-award-badge:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
