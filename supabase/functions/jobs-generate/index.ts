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
    const sb = createClient(supabaseUrl, serviceKey);

    const { exec_case_id } = await req.json();
    if (!exec_case_id) throw new Error("Missing exec_case_id");

    // Fetch case + score_json
    const { data: caseRow, error: caseErr } = await sb
      .from("exec_cases")
      .select("id, org_id, score_json")
      .eq("id", exec_case_id)
      .single();

    if (caseErr || !caseRow) throw new Error("Case not found");

    const scoreJson = caseRow.score_json as any;
    if (!scoreJson?.job_modules || !Array.isArray(scoreJson.job_modules)) {
      throw new Error("score_json.job_modules missing or invalid");
    }

    const jobModules = scoreJson.job_modules;

    // Get existing job titles to prevent duplicates
    const { data: existingJobs } = await sb
      .from("job_tickets")
      .select("title")
      .eq("exec_case_id", exec_case_id);

    const existingTitles = new Set(
      (existingJobs || []).map((j: any) => j.title.toLowerCase().trim())
    );

    // Create jobs
    const jobsToInsert = [];
    for (const mod of jobModules) {
      const titleNorm = mod.title.toLowerCase().trim();
      if (existingTitles.has(titleNorm)) {
        continue; // Skip duplicate
      }

      jobsToInsert.push({
        org_id: caseRow.org_id,
        exec_case_id: exec_case_id,
        title: mod.title,
        description: mod.description || "",
        requirements: mod.requirements || "",
        deliverables: mod.deliverables || "",
        payout_cents: mod.payout_cents || 0,
        status: "open",
      });

      existingTitles.add(titleNorm);
    }

    if (jobsToInsert.length > 0) {
      const { error: insertErr } = await sb
        .from("job_tickets")
        .insert(jobsToInsert);

      if (insertErr) throw insertErr;
    }

    // Timeline event
    await sb.from("exec_case_timeline").insert({
      exec_case_id,
      actor_user_id: null,
      event: "Jobs posted",
      detail: { count: jobsToInsert.length },
    });

    return new Response(
      JSON.stringify({ ok: true, jobs_created: jobsToInsert.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
