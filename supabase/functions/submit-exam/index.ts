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
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { courseSlug, answers } = await req.json();

    // Get course
    const { data: course, error: courseError } = await supabaseAdmin
      .from("courses")
      .select("id")
      .eq("slug", courseSlug)
      .single();

    if (courseError || !course) {
      return new Response(JSON.stringify({ error: "Course not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get exam questions
    const { data: questions } = await supabaseAdmin
      .from("course_exam_questions")
      .select("id, question_type, correct_option_id")
      .eq("course_id", course.id)
      .order("question_index");

    // Grade exam
    let correct = 0;
    let total = 0;

    for (const q of questions || []) {
      if (q.question_type === "mcq") {
        total += 1;
        const submitted = answers[q.id];
        if (submitted && submitted === q.correct_option_id) {
          correct += 1;
        }
      }
    }

    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = score >= 80;

    // Save attempt
    await supabaseAdmin.from("course_exam_attempts").upsert({
      course_id: course.id,
      user_id: user.id,
      score,
      passed,
      answers,
      submitted_at: new Date().toISOString(),
    });

    let certificateCode = null;

    // If passed, check if lessons are complete and issue certificate
    if (passed) {
      const { data: modules } = await supabaseAdmin
        .from("course_modules")
        .select("id")
        .eq("course_id", course.id);

      const moduleIds = (modules || []).map((m) => m.id);

      const { data: lessons } = await supabaseAdmin
        .from("course_lessons")
        .select("id")
        .in("module_id", moduleIds);

      const lessonIds = (lessons || []).map((l) => l.id);

      const { data: progress } = await supabaseAdmin
        .from("lesson_progress")
        .select("lesson_id, completed")
        .eq("user_id", user.id)
        .in("lesson_id", lessonIds);

      const completed = new Set(
        (progress || []).filter((p) => p.completed).map((p) => p.lesson_id)
      );

      const lessonsDone =
        lessonIds.length > 0 && lessonIds.every((id) => completed.has(id));

      if (lessonsDone) {
        // Check if certificate already exists
        const { data: existingCert } = await supabaseAdmin
          .from("certificates")
          .select("certificate_code")
          .eq("user_id", user.id)
          .eq("course_id", course.id)
          .single();

        if (existingCert) {
          certificateCode = existingCert.certificate_code;
        } else {
          // Generate new certificate
          const code = crypto.randomUUID().replace(/-/g, "").substring(0, 16).toUpperCase();
          await supabaseAdmin.from("certificates").insert({
            user_id: user.id,
            course_id: course.id,
            certificate_code: code,
            issued_at: new Date().toISOString(),
          });
          certificateCode = code;
        }
      }
    }

    return new Response(
      JSON.stringify({
        score,
        passed,
        certificateCode,
        message: passed
          ? certificateCode
            ? "Congratulations! You passed and earned your certificate!"
            : "You passed! Complete all lessons to earn your certificate."
          : "You need 80% to pass. Review the course and try again.",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in submit-exam:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
