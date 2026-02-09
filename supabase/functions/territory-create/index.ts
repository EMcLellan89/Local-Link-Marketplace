import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || profile.role !== "admin") {
      throw new Error("Admin access required");
    }

    const {
      territory_name,
      territory_type = "Metro",
      country_code,
      currency_code = "USD",
      language_code = "en",
    } = await req.json();

    if (!territory_name || !territory_name.trim()) {
      throw new Error("territory_name required");
    }

    if (!country_code || country_code.length < 2) {
      throw new Error("country_code required");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: existing } = await supabaseAdmin
      .from("territories")
      .select("id")
      .ilike("territory_name", territory_name.trim())
      .eq("country_code", country_code.toUpperCase())
      .maybeSingle();

    if (existing) {
      throw new Error("Territory already exists");
    }

    const { data: created, error: createError } = await supabaseAdmin
      .from("territories")
      .insert({
        territory_name: territory_name.trim(),
        territory_type,
        country_code: country_code.toUpperCase(),
        currency_code: currency_code.toUpperCase(),
        language_code: language_code.toLowerCase(),
        status: "Available",
      })
      .select()
      .single();

    if (createError) throw createError;

    await supabaseAdmin.from("audit_logs").insert({
      actor_user_id: user.id,
      action: "TERRITORY_CREATED",
      entity_type: "Territory",
      entity_id: created.id,
      metadata: { territory_name, country_code },
    });

    return Response.json(
      { ok: true, id: created.id },
      { headers: corsHeaders }
    );
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 400, headers: corsHeaders }
    );
  }
});
