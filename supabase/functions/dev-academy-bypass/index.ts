import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, x-dev-key",
};

const DEV_KEY = Deno.env.get("DEV_KEY") || "dev-local-link-2025";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Verify DEV key
    const devKey = req.headers.get("x-dev-key");
    if (devKey !== DEV_KEY) {
      return new Response(JSON.stringify({ error: "Invalid dev key" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // Mark all lessons as complete for a user
    if (action === "complete-course" && req.method === "POST") {
      const { userId, courseSlug } = await req.json();

      // This would normally create progress records
      // In DEV mode, we just return success
      return new Response(
        JSON.stringify({
          success: true,
          message: `All lessons marked complete for course: ${courseSlug}`,
          devMode: true,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Grant certification
    if (action === "grant-cert" && req.method === "POST") {
      const { userId, courseSlug, badgeName } = await req.json();

      return new Response(
        JSON.stringify({
          success: true,
          message: `Certification granted: ${badgeName}`,
          devMode: true,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Reset progress
    if (action === "reset-progress" && req.method === "POST") {
      const { userId, courseSlug } = await req.json();

      return new Response(
        JSON.stringify({
          success: true,
          message: `Progress reset for course: ${courseSlug}`,
          devMode: true,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Pass all quizzes
    if (action === "pass-quizzes" && req.method === "POST") {
      const { userId, courseSlug } = await req.json();

      return new Response(
        JSON.stringify({
          success: true,
          message: `All quizzes passed for course: ${courseSlug}`,
          devMode: true,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        error: "Unknown action",
        availableActions: [
          "complete-course",
          "grant-cert",
          "reset-progress",
          "pass-quizzes",
        ],
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
