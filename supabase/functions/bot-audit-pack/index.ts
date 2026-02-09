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

    if (!merchantId) {
      throw new Error("merchant_id required in context");
    }

    // Get agent config
    const { data: agent } = await supabase
      .from("ai_agents")
      .select("*")
      .eq("agent_key", "AuditBot")
      .eq("enabled", true)
      .maybeSingle();

    if (!agent) {
      throw new Error("AuditBot not enabled");
    }

    // Generate audit packet - compile all necessary documents and reports
    const auditPacket = {
      merchant_id: merchantId,
      tax_year: year,
      generated_at: new Date().toISOString(),
      sections: [],
    };

    // 1. Financial Summary
    const { data: monthlyCloses } = await supabase
      .from("monthly_closes")
      .select("*")
      .eq("merchant_id", merchantId)
      .eq("year", year)
      .order("month");

    if (monthlyCloses && monthlyCloses.length > 0) {
      const totalRevenue = monthlyCloses.reduce((sum, m) => sum + (m.revenue_cents || 0), 0);
      const totalExpenses = monthlyCloses.reduce((sum, m) => sum + (m.expenses_cents || 0), 0);
      const netIncome = monthlyCloses.reduce((sum, m) => sum + (m.net_income_cents || 0), 0);

      auditPacket.sections.push({
        section: "financial_summary",
        status: "complete",
        data: {
          total_revenue: totalRevenue / 100,
          total_expenses: totalExpenses / 100,
          net_income: netIncome / 100,
          months_closed: monthlyCloses.length,
        },
      });
    } else {
      auditPacket.sections.push({
        section: "financial_summary",
        status: "missing",
        note: "No monthly closes found for this year",
      });
    }

    // 2. Receipt Documentation
    const { count: receiptCount } = await supabase
      .from("financial_receipts")
      .select("*", { count: "exact", head: true })
      .eq("merchant_id", merchantId);

    auditPacket.sections.push({
      section: "receipts",
      status: "complete",
      data: { total_receipts: receiptCount || 0 },
    });

    // 3. Transaction Records
    const { count: txCount } = await supabase
      .from("financial_transactions")
      .select("*", { count: "exact", head: true })
      .eq("merchant_id", merchantId);

    auditPacket.sections.push({
      section: "transactions",
      status: "complete",
      data: { total_transactions: txCount || 0 },
    });

    // Calculate completeness score
    const completeCount = auditPacket.sections.filter((s) => s.status === "complete").length;
    const completeness = Math.round((completeCount / auditPacket.sections.length) * 100);

    auditPacket.sections.push({
      section: "audit_readiness",
      status: "summary",
      data: {
        completeness_score: completeness,
        sections_complete: completeCount,
        sections_total: auditPacket.sections.length,
      },
    });

    // Store audit packet
    await supabase.from("audit_actions_log").insert({
      actor_type: "bot",
      actor_key: "AuditBot",
      action_type: "AUDIT_PACKET_GENERATED",
      entity_type: "merchant",
      entity_id: merchantId,
      details: auditPacket,
    });

    return new Response(
      JSON.stringify({
        success: true,
        model: agent.default_model,
        tokens_in: 0,
        tokens_out: 0,
        output: {
          completeness_score: completeness,
          sections: auditPacket.sections.length,
          audit_packet: auditPacket,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[AuditBot] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
