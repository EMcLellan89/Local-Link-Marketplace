import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Admin-Key",
};

function requireAdmin(req: Request): boolean {
  const adminKey = req.headers.get("x-admin-key");
  const expectedKey = Deno.env.get("LOCAL_LINK_ADMIN_KEY");

  if (!expectedKey || adminKey !== expectedKey) {
    return false;
  }

  return true;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (!requireAdmin(req)) {
    return new Response(
      JSON.stringify({ error: "Invalid admin key" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const url = new URL(req.url);
    const tier = url.searchParams.get("tier");
    const active = url.searchParams.get("active");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 200);
    const offset = parseInt(url.searchParams.get("offset") || "0");

    let query = supabaseAdmin
      .from("marketplace_partners")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (tier) query = query.eq("tier", tier);
    if (active === "true") query = query.eq("membership_active", true);
    if (active === "false") query = query.eq("membership_active", false);

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) throw error;

    return new Response(
      JSON.stringify({ ok: true, count, data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error listing partners:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to list partners" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
