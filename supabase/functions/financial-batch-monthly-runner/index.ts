import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { year, month, merchant_id } = await req.json();

    const targetYear = year || new Date().getFullYear();
    const targetMonth = month || new Date().getMonth() + 1;

    const supabase = supabaseAdmin();

    let merchantsQuery = supabase
      .from("merchants")
      .select("id, name")
      .eq("is_active", true);

    if (merchant_id) {
      merchantsQuery = merchantsQuery.eq("id", merchant_id);
    }

    const { data: merchants, error: merchantError } = await merchantsQuery;

    if (merchantError || !merchants) {
      throw new Error(`Failed to fetch merchants: ${merchantError?.message}`);
    }

    let processed = 0;
    let failed = 0;

    for (const merchant of merchants) {
      try {
        const { data: existingClose } = await supabase
          .from("monthly_closes")
          .select("id, status")
          .eq("merchant_id", merchant.id)
          .eq("year", targetYear)
          .eq("month", targetMonth)
          .maybeSingle();

        if (existingClose && existingClose.status === "closed") {
          console.log(`[Batch Monthly] Skipping ${merchant.name} - already closed`);
          continue;
        }

        const { data: pnl, error: pnlError } = await supabase.rpc("pnl_monthly_totals", {
          p_merchant_id: merchant.id,
          p_year: targetYear,
          p_month: targetMonth,
        });

        if (pnlError) {
          throw new Error(`P&L calculation failed: ${pnlError.message}`);
        }

        const { data: pnlLines } = await supabase.rpc("pnl_monthly", {
          p_merchant_id: merchant.id,
          p_year: targetYear,
          p_month: targetMonth,
        });

        const reportData = {
          year: targetYear,
          month: targetMonth,
          summary: pnl,
          line_items: pnlLines,
          generated_at: new Date().toISOString(),
        };

        if (existingClose) {
          await supabase
            .from("monthly_closes")
            .update({
              status: "draft",
              revenue_cents: Math.round((pnl[0]?.revenue || 0) * 100),
              expenses_cents: Math.round(((pnl[0]?.cogs || 0) + (pnl[0]?.expenses || 0)) * 100),
              net_income_cents: Math.round((pnl[0]?.net_income || 0) * 100),
              report_data: reportData,
            })
            .eq("id", existingClose.id);
        } else {
          await supabase.from("monthly_closes").insert({
            merchant_id: merchant.id,
            year: targetYear,
            month: targetMonth,
            status: "draft",
            revenue_cents: Math.round((pnl[0]?.revenue || 0) * 100),
            expenses_cents: Math.round(((pnl[0]?.cogs || 0) + (pnl[0]?.expenses || 0)) * 100),
            net_income_cents: Math.round((pnl[0]?.net_income || 0) * 100),
            report_data: reportData,
          });
        }

        await supabase.from("financial_reports").insert({
          merchant_id: merchant.id,
          report_type: "pnl",
          year: targetYear,
          month: targetMonth,
          data: reportData,
          format: "json",
        });

        processed++;
        console.log(`[Batch Monthly] Processed ${merchant.name} for ${targetYear}-${targetMonth}`);
      } catch (error) {
        failed++;
        console.error(`[Batch Monthly] Failed for ${merchant.name}:`, error.message);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        year: targetYear,
        month: targetMonth,
        total_merchants: merchants.length,
        processed,
        failed,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Financial Batch Monthly Runner] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
