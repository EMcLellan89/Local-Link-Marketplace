import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return new Response(
        JSON.stringify({ error: "Certificate code required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: certificate, error } = await supabaseAdmin
      .from("certificates")
      .select(`
        certificate_code,
        issued_at,
        user:profiles!user_id (
          first_name,
          last_name
        ),
        course:courses!course_id (
          title,
          subtitle
        )
      `)
      .eq("certificate_code", code)
      .single();

    if (error || !certificate) {
      return new Response(
        JSON.stringify({ valid: false, error: "Certificate not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        valid: true,
        certificate: {
          code: certificate.certificate_code,
          issued_at: certificate.issued_at,
          recipient_name: `${certificate.user?.first_name || ""} ${certificate.user?.last_name || ""}`.trim() || "Unknown",
          course_title: certificate.course?.title || "Unknown Course",
          course_subtitle: certificate.course?.subtitle || "",
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Verify certificate error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});