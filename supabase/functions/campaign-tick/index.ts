import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

/**
 * Daily Campaign Tick Job
 *
 * Runs once per day to:
 * 1. Log daily ad spend for active campaigns
 * 2. Update funding totals (weeks 1-8)
 * 3. Process payback deductions (weeks 9+)
 * 4. Update ledger entries
 *
 * Called by Vercel cron job daily
 */
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify cron secret (basic security)
    const cronSecret = req.headers.get("X-Cron-Secret");
    const expectedSecret = Deno.env.get("CRON_SECRET") || "change-me-in-production";

    if (cronSecret !== expectedSecret) {
      return new Response(
        JSON.stringify({ error: "unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const today = new Date().toISOString().split('T')[0];

    // Get all active campaigns
    const { data: campaigns, error: campaignsError } = await supabase
      .from("partner_campaigns")
      .select("*")
      .eq("status", "active");

    if (campaignsError) throw campaignsError;

    if (!campaigns || campaigns.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No active campaigns to process",
          processed: 0
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let processedCount = 0;
    const errors: any[] = [];

    for (const campaign of campaigns) {
      try {
        // Calculate week number since deployment
        const deployedAt = new Date(campaign.deployed_at);
        const daysSince = Math.floor((new Date().getTime() - deployedAt.getTime()) / (86400000));
        const weekNumber = Math.floor(daysSince / 7) + 1;

        // Calculate week start date (Monday)
        const date = new Date(today);
        const dayOfWeek = date.getUTCDay();
        const offset = (dayOfWeek + 6) % 7;
        const mondayDate = new Date(date);
        mondayDate.setUTCDate(date.getUTCDate() - offset);
        const weekStartDate = mondayDate.toISOString().split('T')[0];

        const dailyBudget = campaign.daily_budget_cents;
        const isInFundedPeriod = weekNumber <= 8;

        // Get current partner ledger balance
        const { data: latestEntry } = await supabase
          .from("partner_ledger")
          .select("balance_after_cents")
          .eq("partner_id", campaign.partner_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        const currentBalance = latestEntry?.balance_after_cents || 0;

        // Log ad spend for today
        const { error: spendError } = await supabase
          .from("partner_ledger")
          .insert({
            partner_id: campaign.partner_id,
            campaign_id: campaign.id,
            entry_type: "ad_spend",
            amount_cents: -dailyBudget, // Negative = deduction
            balance_after_cents: currentBalance - dailyBudget,
            week_start_date: weekStartDate,
            week_number: weekNumber,
            description: `Daily ad spend for campaign (Week ${weekNumber}, ${isInFundedPeriod ? 'Funded' : 'Payback'} period)`,
            meta: {
              daily_budget_cents: dailyBudget,
              is_funded_period: isInFundedPeriod,
              date: today,
            },
          });

        if (spendError) throw spendError;

        // Update campaign totals
        const newTotalSpend = campaign.total_ad_spend_cents + dailyBudget;
        let newTotalFunded = campaign.total_funded_cents;
        let newPaybackBalance = campaign.payback_balance_cents;

        if (isInFundedPeriod) {
          // Platform is funding this spend
          newTotalFunded += dailyBudget;
          newPaybackBalance += dailyBudget; // This will need to be paid back starting week 9
        } else {
          // Partner is in payback period - already deducted from ledger above
          // No additional action needed
        }

        const { error: updateError } = await supabase
          .from("partner_campaigns")
          .update({
            total_ad_spend_cents: newTotalSpend,
            total_funded_cents: newTotalFunded,
            payback_balance_cents: newPaybackBalance,
            updated_at: new Date().toISOString(),
          })
          .eq("id", campaign.id);

        if (updateError) throw updateError;

        // If in payback period (week 9+), process weekly payback deduction
        if (!isInFundedPeriod && dayOfWeek === 1) { // Monday
          const paybackAmount = campaign.payback_per_week_cents;

          if (campaign.payback_balance_cents > 0) {
            const deductionAmount = Math.min(paybackAmount, campaign.payback_balance_cents);

            // Get updated balance after ad spend
            const { data: updatedEntry } = await supabase
              .from("partner_ledger")
              .select("balance_after_cents")
              .eq("partner_id", campaign.partner_id)
              .order("created_at", { ascending: false })
              .limit(1)
              .single();

            const balanceAfterSpend = updatedEntry?.balance_after_cents || currentBalance - dailyBudget;

            // Log payback deduction
            const { error: paybackError } = await supabase
              .from("partner_ledger")
              .insert({
                partner_id: campaign.partner_id,
                campaign_id: campaign.id,
                entry_type: "payback_deduction",
                amount_cents: -deductionAmount, // Negative = deduction
                balance_after_cents: balanceAfterSpend - deductionAmount,
                week_start_date: weekStartDate,
                week_number: weekNumber,
                description: `Weekly payback deduction (Week ${weekNumber})`,
                meta: {
                  payback_amount: deductionAmount,
                  remaining_balance: campaign.payback_balance_cents - deductionAmount,
                },
              });

            if (paybackError) throw paybackError;

            // Update campaign payback balance
            const { error: paybackUpdateError } = await supabase
              .from("partner_campaigns")
              .update({
                payback_balance_cents: campaign.payback_balance_cents - deductionAmount,
                updated_at: new Date().toISOString(),
              })
              .eq("id", campaign.id);

            if (paybackUpdateError) throw paybackUpdateError;
          }
        }

        processedCount++;
      } catch (error: any) {
        console.error(`[campaign-tick] Error processing campaign ${campaign.id}:`, error);
        errors.push({
          campaign_id: campaign.id,
          error: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedCount,
        total_campaigns: campaigns.length,
        errors: errors.length > 0 ? errors : undefined,
        date: today,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[campaign-tick] Fatal error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "tick_failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
