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
    const { user_id, course_slugs, reason } = await req.json();

    if (!user_id || !course_slugs || !Array.isArray(course_slugs)) {
      return new Response(
        JSON.stringify({ error: "Missing user_id or course_slugs array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: courses, error: coursesError } = await supabaseAdmin
      .from("course_products")
      .select("id, slug, title")
      .in("slug", course_slugs);

    if (coursesError || !courses || courses.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid courses found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const enrollments = [];
    const errors = [];

    for (const course of courses) {
      const existing = await supabaseAdmin
        .from("course_enrollments")
        .select("id")
        .eq("user_id", user_id)
        .eq("course_id", course.id)
        .maybeSingle();

      if (existing.data) {
        enrollments.push({
          course_slug: course.slug,
          enrollment_id: existing.data.id,
          status: "already_enrolled"
        });
        continue;
      }

      const { data: enrollment, error: enrollError } = await supabaseAdmin
        .from("course_enrollments")
        .insert({
          user_id: user_id,
          course_id: course.id,
          enrolled_at: new Date().toISOString(),
          progress_percent: 0,
          status: "active",
        })
        .select()
        .single();

      if (enrollError) {
        errors.push({
          course_slug: course.slug,
          error: enrollError.message
        });
      } else {
        enrollments.push({
          course_slug: course.slug,
          enrollment_id: enrollment.id,
          status: "newly_enrolled"
        });
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        enrollments,
        errors,
        reason: reason || "Manual entitlement"
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error creating entitlements:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create entitlements" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
