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

    const { product_key, org_id } = await req.json();

    if (!product_key || !org_id) {
      return new Response(
        JSON.stringify({ error: "Missing product_key or org_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get product
    const { data: product, error: prodErr } = await sb
      .from("exec_products")
      .select("id, name")
      .eq("product_key", product_key)
      .eq("active", true)
      .single();

    if (prodErr || !product) {
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For Phase 1: Create case immediately (simulate payment received)
    const { data: caseRow, error: caseErr } = await sb
      .from("exec_cases")
      .insert({
        org_id,
        exec_product_id: product.id,
        status: "paid",
        created_by: userData.user.id,
      })
      .select("id")
      .single();

    if (caseErr || !caseRow) {
      return new Response(
        JSON.stringify({ error: "Failed to create case" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Timeline event
    await sb.from("exec_case_timeline").insert({
      exec_case_id: caseRow.id,
      actor_user_id: userData.user.id,
      event: "Payment received",
      detail: { product_key },
    });

    // Queue bot run
    await sb.from("event_outbox").insert({
      event_type: "bot.run",
      payload: { exec_case_id: caseRow.id },
      status: "pending",
    });

    return new Response(
      JSON.stringify({ 
        checkout_url: `/exec/cases/${caseRow.id}?org_id=${org_id}`,
        exec_case_id: caseRow.id
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
