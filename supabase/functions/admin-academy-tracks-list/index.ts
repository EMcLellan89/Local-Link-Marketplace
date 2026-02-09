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
  return adminKey === Deno.env.get("LOCAL_LINK_ADMIN_KEY");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (!requireAdmin(req)) {
    return new Response(
      JSON.stringify({ ok: false, error: "Invalid admin key" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 200);
    const offset = parseInt(url.searchParams.get("offset") || "0");

    let query = supabaseAdmin
      .from("marketplace_products")
      .select("*, prices:marketplace_product_prices(*)", { count: "exact" })
      .contains("metadata", { kind: "academy_track" })
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (q) query = query.ilike("name", `%${q}%`);

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) throw error;

    return new Response(
      JSON.stringify({ ok: true, count, data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
