import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type ExecBotOutput = {
  summary: string;
  scorecard: {
    readiness: number;
    impact: number;
    complexity: number;
    urgency: number;
  };
  scope: {
    objectives: string[];
    constraints: string[];
    assumptions: string[];
  };
  deliverables: {
    merchant_packet: {
      title: string;
      bullets: string[];
      next_steps: string[];
    };
    internal_packet: {
      checklist: string[];
      required_integrations: string[];
    };
  };
  job_modules: Array<{
    title: string;
    description: string;
    requirements?: string;
    deliverables?: string;
    payout_cents: number;
  }>;
};

const BASELINE_JOB_MODULES: Record<string, ExecBotOutput["job_modules"]> = {
  exec_business_systems_audit: [
    { title: "Data collection + intake verification", description: "Collect required CRM exports, confirm pipelines, confirm lead sources and inboxes.", deliverables: "Data checklist completed", payout_cents: 15000 },
    { title: "Audit report formatting", description: "Format the AI audit output into the standard executive structure.", deliverables: "PDF-ready audit doc", payout_cents: 12000 },
  ],
  exec_sales_engine: [
    { title: "Pipeline build + stages", description: "Build/verify Sales Engine pipeline stages inside Local-Link CRM.", deliverables: "Pipeline configured + proof", payout_cents: 25000 },
    { title: "Follow-up sequences setup", description: "Configure SMS/email follow-ups per lead stage + missed-call recovery.", deliverables: "Sequences enabled + test logs", payout_cents: 30000 },
    { title: "QA test leads + booking", description: "Run test leads through intake → follow-up → booking and confirm tracking.", deliverables: "QA checklist completed", payout_cents: 20000 },
  ],
};

function fallbackOutput(product_key: string): ExecBotOutput {
  const baseline = BASELINE_JOB_MODULES[product_key] || [];
  return {
    summary: `Auto-generated scope for ${product_key}. (Fallback mode: AI output unavailable.)`,
    scorecard: { readiness: 65, impact: 75, complexity: 50, urgency: 70 },
    scope: {
      objectives: ["Deploy the purchased system inside Local-Link CRM"],
      constraints: ["Local-Link CRM only"],
      assumptions: ["Merchant is migrated or will complete migration separately"],
    },
    deliverables: {
      merchant_packet: {
        title: "Your Executive Solution is being deployed",
        bullets: ["We created the implementation plan and execution checklist."],
        next_steps: ["Watch the Case Tracker for job progress"],
      },
      internal_packet: {
        checklist: ["Verify org migration status", "Post jobs and confirm partner visibility"],
        required_integrations: ["Twilio (SMS/voice)", "Email (Brevo/SendGrid)"],
      },
    },
    job_modules: baseline.length ? baseline : [
      { title: "Implementation QA & Launch Verification", description: "Verify configuration matches scope and run test scenarios.", deliverables: "QA checklist completed", payout_cents: 25000 },
    ],
  };
}

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

    // Fetch case + product_key
    const { data: caseRow, error: caseErr } = await sb
      .from("exec_cases")
      .select("id, org_id, intake_json, exec_products(product_key,name)")
      .eq("id", exec_case_id)
      .single();

    if (caseErr || !caseRow) throw new Error("Case not found");

    const product_key = (caseRow as any).exec_products?.product_key as string | undefined;
    if (!product_key) throw new Error("Case missing product_key");

    // Timeline: bot started
    await sb.from("exec_case_timeline").insert({
      exec_case_id,
      actor_user_id: null,
      event: "Systems scoping started",
      detail: { product_key },
    });

    // For Phase 1, use fallback output (LLM integration ready for future)
    const output = fallbackOutput(product_key);

    // Write case score_json
    await sb.from("exec_cases").update({
      score_json: output as any,
      status: "in_progress",
      updated_at: new Date().toISOString(),
    }).eq("id", exec_case_id);

    // Timeline: bot complete
    await sb.from("exec_case_timeline").insert({
      exec_case_id,
      actor_user_id: null,
      event: "Systems scoped",
      detail: { product_key, used_fallback: true },
    });

    // Queue job generation
    await sb.from("event_outbox").insert({
      event_type: "jobs.generate",
      payload: { exec_case_id },
      status: "pending",
    });

    // Record telemetry
    await sb.from("bot_run_telemetry").insert({
      exec_case_id,
      product_key,
      ok: true,
      used_fallback: true,
      attempts: 1,
      model: "fallback",
    });

    return new Response(
      JSON.stringify({ ok: true, product_key }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
