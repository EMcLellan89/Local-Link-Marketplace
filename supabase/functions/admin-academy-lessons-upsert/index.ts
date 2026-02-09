import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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
    const body = await req.json();

    if (!body?.module_id || !body?.title) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing module_id or title" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload: any = {
      module_id: body.module_id,
      title: body.title,
      content: body.content ?? null,
      video_url: body.video_url ?? null,
      order_index: body.order_index ?? 0,
      duration_minutes: body.duration_minutes ?? null,
      is_preview: body.is_preview ?? false,
    };

    if (body.id) {
      payload.id = body.id;
    }

    const { data, error } = await supabaseAdmin
      .from("course_lessons")
      .upsert(payload)
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ ok: true, data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
