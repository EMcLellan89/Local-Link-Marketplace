import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function generateCertificateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `OSWA-${code}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Not authenticated" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { lessonId } = await req.json();

    // 1. Mark lesson as completed
    await supabaseAdmin
      .from("lesson_progress")
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      });

    // 2. Check if all lessons in course are completed
    const courseSlug = "online-sales-without-ads";

    const { data: course } = await supabaseAdmin
      .from("courses")
      .select("id")
      .eq("slug", courseSlug)
      .single();

    if (!course) {
      return new Response(
        JSON.stringify({ ok: true }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get all modules for this course
    const { data: modules } = await supabaseAdmin
      .from("course_modules")
      .select("id")
      .eq("course_id", course.id);

    if (!modules || modules.length === 0) {
      return new Response(
        JSON.stringify({ ok: true }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const moduleIds = modules.map((m) => m.id);

    // Get all lessons for these modules
    const { data: lessons } = await supabaseAdmin
      .from("course_lessons")
      .select("id")
      .in("module_id", moduleIds);

    if (!lessons || lessons.length === 0) {
      return new Response(
        JSON.stringify({ ok: true }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const lessonIds = lessons.map((l) => l.id);

    // Get user's progress
    const { data: progress } = await supabaseAdmin
      .from("lesson_progress")
      .select("lesson_id, completed")
      .eq("user_id", user.id)
      .in("lesson_id", lessonIds);

    const completedSet = new Set(
      (progress || []).filter((p) => p.completed).map((p) => p.lesson_id)
    );

    const allCompleted = lessonIds.every((id) => completedSet.has(id));

    if (allCompleted) {
      // Check if certificate already exists
      const { data: existingCert } = await supabaseAdmin
        .from("certificates")
        .select("certificate_code")
        .eq("user_id", user.id)
        .eq("course_id", course.id)
        .single();

      if (!existingCert) {
        // Issue new certificate
        const code = generateCertificateCode();
        await supabaseAdmin.from("certificates").insert({
          user_id: user.id,
          course_id: course.id,
          certificate_code: code,
        });

        // Update enrollment completion date
        await supabaseAdmin
          .from("enrollments")
          .update({ completed_at: new Date().toISOString() })
          .eq("user_id", user.id)
          .eq("course_id", course.id);

        return new Response(
          JSON.stringify({ ok: true, certificate_code: code, completed: true }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ ok: true, certificate_code: existingCert.certificate_code, completed: true }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, completed: false }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Complete lesson error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});