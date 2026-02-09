import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ ok: false, error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin" && profile?.role !== "internal_team") {
      return new Response(JSON.stringify({ ok: false, error: "Forbidden - Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "GET") {
      return await handleGetReferrals(supabase, req);
    } else if (req.method === "POST") {
      return await handleFixReferral(supabase, req);
    }

    return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function handleGetReferrals(supabase: any, req: Request) {
  const url = new URL(req.url);
  const merchant_org_id = url.searchParams.get("org_id");

  if (!merchant_org_id) {
    return new Response(JSON.stringify({ ok: false, error: "Missing org_id" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // List customers that were referred (and by whom)
  const { data, error } = await supabase
    .from("customers")
    .select("id, name, email, referred_by_customer_id, created_at")
    .eq("merchant_org_id", merchant_org_id)
    .not("referred_by_customer_id", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Get referrer names
  const referrals = await Promise.all(
    (data || []).map(async (customer: any) => {
      const { data: referrer } = await supabase
        .from("customers")
        .select("name, email")
        .eq("id", customer.referred_by_customer_id)
        .single();

      return {
        ...customer,
        referrer_name: referrer?.name || "Unknown",
        referrer_email: referrer?.email || "",
      };
    })
  );

  return new Response(JSON.stringify({ ok: true, referrals }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function handleFixReferral(supabase: any, req: Request) {
  const body = await req.json();
  const { merchant_org_id, referred_customer_id, new_referrer_customer_id } = body;

  if (!merchant_org_id || !referred_customer_id) {
    return new Response(JSON.stringify({ ok: false, error: "Missing required fields" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data, error } = await supabase
    .from("customers")
    .update({ referred_by_customer_id: new_referrer_customer_id || null })
    .eq("merchant_org_id", merchant_org_id)
    .eq("id", referred_customer_id)
    .select("id, name, referred_by_customer_id")
    .single();

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true, customer: data }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
