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

    // Find the partner badge record
    const { data: partnerBadge, error: findError } = await supabase
      .from("partner_badges")
      .select("id")
      .eq("partner_id", partner_id)
      .eq("badge_id", badge_id)
      .maybeSingle();

    if (findError) throw findError;

    if (!partnerBadge) {
      throw new Error("Badge not found for this partner");
    }

    // Log revocation in metadata before deleting
    const revocationLog = {
      revoked_by_admin: user.id,
      reason: reason || "Revoked by admin",
      revoked_at: new Date().toISOString(),
    };

    // Delete the badge
    const { error: deleteError } = await supabase
      .from("partner_badges")
      .delete()
      .eq("id", partnerBadge.id);

    if (deleteError) throw deleteError;

    return new Response(JSON.stringify({ success: true, revocation_log: revocationLog }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error("Error in admin-revoke-badge:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
