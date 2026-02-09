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

    const { job_ticket_id, admin_user_id, decision, notes } = await req.json();

    // Get job details
    const { data: job, error: jobErr } = await sb
      .from("job_tickets")
      .select("claimed_by, payout_cents, exec_case_id")
      .eq("id", job_ticket_id)
      .single();

    if (jobErr || !job) throw new Error("Job not found");

    const newStatus = decision === "approve" ? "approved" : "rejected";

    // Update job status
    const { error: updateErr } = await sb
      .from("job_tickets")
      .update({
        status: newStatus,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", job_ticket_id);

    if (updateErr) throw updateErr;

    // If approved, queue payout
    if (decision === "approve" && job.claimed_by) {
      await sb.from("payout_requests").upsert({
        job_ticket_id,
        partner_user_id: job.claimed_by,
        payout_cents: job.payout_cents,
        status: "requested",
        notes: notes || "",
      });

      // Update job to paid immediately for Phase 1
      await sb.from("job_tickets").update({
        status: "paid",
        updated_at: new Date().toISOString(),
      }).eq("id", job_ticket_id);
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
