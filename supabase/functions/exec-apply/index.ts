import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const authHeader = req.headers.get("Authorization") || "";

    const sb = createClient(supabaseUrl, serviceKey);
    const anonSb = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userErr } = await anonSb.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { product_key, org_id, intake_json } = await req.json();

    if (!product_key || !org_id) {
      return new Response(
        JSON.stringify({ error: "Missing product_key or org_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get product
    const { data: product, error: prodErr } = await sb
      .from("exec_products")
      .select("id")
      .eq("product_key", product_key)
      .eq("active", true)
      .single();

    if (prodErr || !product) {
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create application case
    const { data: caseRow, error: caseErr } = await sb
      .from("exec_cases")
      .insert({
        org_id,
        exec_product_id: product.id,
        status: "applied",
        created_by: userData.user.id,
        intake_json: intake_json || {},
      })
      .select("id")
      .single();

    if (caseErr || !caseRow) {
      return new Response(
        JSON.stringify({ error: "Failed to create application" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Timeline event
    await sb.from("exec_case_timeline").insert({
      exec_case_id: caseRow.id,
      actor_user_id: userData.user.id,
      event: "Application submitted",
      detail: { product_key },
    });

    return new Response(
      JSON.stringify({
        ok: true,
        exec_case_id: caseRow.id,
        redirect_url: `/exec/apply/${product_key}/confirmation?case_id=${caseRow.id}`
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
