import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { job_id, context } = await req.json();
    const supabase = supabaseAdmin();

    const merchantId = context.merchant_id;
    const year = context.year || new Date().getFullYear();
    const month = context.month || new Date().getMonth() + 1;

    if (!merchantId) {
      throw new Error("merchant_id required in context");
    }

    // Get agent config
    const { data: agent } = await supabase
      .from("ai_agents")
      .select("*")
      .eq("agent_key", "RiskBot")
      .eq("enabled", true)
      .maybeSingle();

    if (!agent) {
      throw new Error("RiskBot not enabled");
    }

    // Check for compliance risks
    const risks = [];

    // Check for missing receipts
    const { data: txWithoutReceipts } = await supabase
      .from("financial_transactions")
      .select("id, description, amount_cents")
      .eq("merchant_id", merchantId)
      .is("receipt_id", null)
      .gte("transaction_date", `${year}-${String(month).padStart(2, "0")}-01`)
      .limit(10);

    if (txWithoutReceipts && txWithoutReceipts.length > 0) {
      risks.push({
        type: "missing_receipts",
        severity: "medium",
        count: txWithoutReceipts.length,
        description: `${txWithoutReceipts.length} transactions missing receipts`,
      });
    }

    // Check for uncategorized transactions
    const { data: uncategorized } = await supabase
      .from("financial_transactions")
      .select("id")
      .eq("merchant_id", merchantId)
      .is("coa_id", null)
      .gte("transaction_date", `${year}-${String(month).padStart(2, "0")}-01`)
      .limit(10);

    if (uncategorized && uncategorized.length > 0) {
      risks.push({
        type: "uncategorized_transactions",
        severity: "low",
        count: uncategorized.length,
        description: `${uncategorized.length} transactions need categorization`,
      });
    }

    // Check for large cash transactions
    const { data: largeCash } = await supabase
      .from("financial_transactions")
      .select("id, amount_cents")
      .eq("merchant_id", merchantId)
      .eq("payment_method", "cash")
      .gte("amount_cents", 1000000)
      .gte("transaction_date", `${year}-${String(month).padStart(2, "0")}-01`);

    if (largeCash && largeCash.length > 0) {
      risks.push({
        type: "large_cash_transactions",
        severity: "high",
        count: largeCash.length,
        description: `${largeCash.length} large cash transactions require documentation`,
      });
    }

    // Generate risk summary
    const highRisks = risks.filter((r) => r.severity === "high").length;
    const mediumRisks = risks.filter((r) => r.severity === "medium").length;
    const lowRisks = risks.filter((r) => r.severity === "low").length;

    const riskScore = 100 - (highRisks * 30 + mediumRisks * 15 + lowRisks * 5);

    // Store risk scan results
    await supabase.from("audit_actions_log").insert({
      actor_type: "bot",
      actor_key: "RiskBot",
      action_type: "RISK_SCAN_COMPLETED",
      entity_type: "merchant",
      entity_id: merchantId,
      details: {
        year,
        month,
        risk_score: riskScore,
        risks,
        high_count: highRisks,
        medium_count: mediumRisks,
        low_count: lowRisks,
      },
    });

    // If high risks found, alert admin
    if (highRisks > 0) {
      const adminEmail = Deno.env.get("ADMIN_EMAIL") || "admin@local-link.com";

      await supabase.from("comm_outbox").insert({
        channel: "email",
        to_address: adminEmail,
        subject: `Risk Alert: Merchant ${merchantId} has ${highRisks} high-severity issues`,
        body: `RiskBot detected compliance issues:

${risks
  .filter((r) => r.severity === "high")
  .map((r) => `- ${r.description}`)
  .join("\n")}

Review required.`,
        metadata: {
          merchant_id: merchantId,
          bot: "RiskBot",
          alert_type: "high_risk",
        },
        status: "queued",
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        model: agent.default_model,
        tokens_in: 0,
        tokens_out: 0,
        output: {
          risk_score: riskScore,
          risks,
          alert_sent: highRisks > 0,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[RiskBot] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
