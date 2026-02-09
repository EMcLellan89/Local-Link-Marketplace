import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { openaiCategorize } from "../_shared/openaiClient.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { merchant_id, transaction_ids, batch_size = 50 } = await req.json();

    if (!merchant_id) {
      return new Response(
        JSON.stringify({ error: "Missing merchant_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = supabaseAdmin();

    const { data: coa } = await supabase
      .from("chart_of_accounts")
      .select("id, name, type")
      .eq("merchant_id", merchant_id)
      .eq("is_active", true);

    if (!coa || coa.length === 0) {
      return new Response(
        JSON.stringify({ error: "No chart of accounts found. Create categories first." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let query = supabase
      .from("transactions")
      .select("id, name, amount")
      .eq("merchant_id", merchant_id)
      .limit(batch_size);

    if (transaction_ids && transaction_ids.length > 0) {
      query = query.in("id", transaction_ids);
    } else {
      const { data: uncategorized } = await supabase
        .from("transactions")
        .select("id")
        .eq("merchant_id", merchant_id)
        .is("transaction_categorizations.id", null)
        .limit(batch_size);

      if (!uncategorized || uncategorized.length === 0) {
        return new Response(
          JSON.stringify({ success: true, categorized: 0, message: "No transactions to categorize" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      query = query.in("id", uncategorized.map((t) => t.id));
    }

    const { data: transactions, error: txError } = await query;

    if (txError || !transactions) {
      throw new Error(`Failed to fetch transactions: ${txError?.message}`);
    }

    let categorized = 0;

    for (const tx of transactions) {
      try {
        const result = await openaiCategorize(tx.name, tx.amount, coa);

        const { error: catError } = await supabase
          .from("transaction_categorizations")
          .insert({
            transaction_id: tx.id,
            merchant_id,
            coa_id: result.coa_id,
            method: "ai",
            confidence_score: result.confidence,
            approved: result.confidence >= 0.8,
          });

        if (!catError) {
          categorized++;
        }
      } catch (error) {
        console.error(`[AI Categorize] Failed for transaction ${tx.id}:`, error.message);
      }
    }

    console.log(`[AI Categorize] Categorized ${categorized}/${transactions.length} transactions`);

    return new Response(
      JSON.stringify({
        success: true,
        total: transactions.length,
        categorized,
        failed: transactions.length - categorized,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Financial AI Categorize] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
