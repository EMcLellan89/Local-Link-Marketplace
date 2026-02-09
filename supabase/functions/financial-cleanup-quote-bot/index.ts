import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const {
      business_name,
      monthly_transactions,
      months_behind,
      has_receipts,
      current_system,
      urgency,
      partner_id,
    } = await req.json();

    if (!business_name || !monthly_transactions || !months_behind) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = supabaseAdmin();

    const totalTransactions = monthly_transactions * months_behind;

    let basePrice = 0;
    let timeline = "";

    if (totalTransactions < 500) {
      basePrice = 499;
      timeline = "3-5 business days";
    } else if (totalTransactions < 1500) {
      basePrice = 999;
      timeline = "5-7 business days";
    } else if (totalTransactions < 3000) {
      basePrice = 1499;
      timeline = "7-10 business days";
    } else {
      basePrice = 2500;
      timeline = "10-14 business days";
    }

    if (!has_receipts) {
      basePrice += 200;
    }

    if (urgency === "rush") {
      basePrice = Math.round(basePrice * 1.5);
      timeline = timeline.replace(/\d+/g, (match) => Math.ceil(parseInt(match) / 2).toString());
    }

    const priceRange = {
      min: basePrice,
      max: Math.round(basePrice * 1.3),
    };

    const { data: quote, error: quoteError } = await supabase
      .from("cleanup_quote_requests")
      .insert({
        business_name,
        monthly_transactions,
        months_behind,
        has_receipts: has_receipts || false,
        current_system: current_system || null,
        urgency: urgency || "standard",
        partner_id: partner_id || null,
        estimated_price_min: priceRange.min,
        estimated_price_max: priceRange.max,
        estimated_timeline: timeline,
        total_transactions: totalTransactions,
      })
      .select()
      .single();

    if (quoteError) {
      throw new Error(`Failed to create quote: ${quoteError.message}`);
    }

    const scope = [];
    scope.push(`${totalTransactions} transactions across ${months_behind} months`);
    scope.push("Full categorization and reconciliation");
    scope.push("Monthly P&L statements");
    scope.push("Tax-ready financial reports");

    if (!has_receipts) {
      scope.push("Missing receipt documentation assistance");
    }

    return new Response(
      JSON.stringify({
        quote_id: quote.id,
        price_range: priceRange,
        timeline,
        scope,
        total_transactions: totalTransactions,
        next_steps: [
          "Review quote details",
          "Connect with assigned bookkeeper",
          "Provide bank statements and access",
          "Receive clean books and reports",
        ],
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Cleanup Quote Bot] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
