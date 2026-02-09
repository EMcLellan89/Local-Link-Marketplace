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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error("Invalid user token");
    }

    // Get partner record
    const { data: partner, error: partnerError } = await supabase
      .from("partners")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (partnerError) throw partnerError;
    if (!partner) {
      throw new Error("Partner not found");
    }

    // Get all certifications
    const { data: allCerts, error: certsError } = await supabase
      .from("certifications")
      .select("*")
      .order("sort_order", { ascending: true });

    if (certsError) throw certsError;

    // Get earned certifications for this partner
    const { data: earnedCerts, error: earnedError } = await supabase
      .from("partner_certifications")
      .select("certification_id, earned_at, score")
      .eq("partner_id", partner.id);

    if (earnedError) throw earnedError;

    // Create a map of earned cert IDs
    const earnedMap = new Map(
      (earnedCerts || []).map(ec => [ec.certification_id, { earned_at: ec.earned_at, score: ec.score }])
    );

    // Merge certifications with earned status
    const certifications = (allCerts || []).map(cert => ({
      id: cert.id,
      slug: cert.slug,
      name: cert.name,
      description: cert.description,
      required_for_job_categories: cert.required_for_job_categories || [],
      earned: earnedMap.has(cert.id),
      earned_at: earnedMap.get(cert.id)?.earned_at || null,
      score: earnedMap.get(cert.id)?.score || null,
    }));

    const earnedCount = earnedCerts?.length || 0;

    return new Response(JSON.stringify({ certifications, earned_count: earnedCount }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error("Error in partner-certifications:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
