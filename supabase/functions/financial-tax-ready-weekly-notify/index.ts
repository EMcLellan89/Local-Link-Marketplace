import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = supabaseAdmin();

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const { data: merchants, error: merchantError } = await supabase
      .from("merchants")
      .select("id, name, email")
      .eq("is_active", true);

    if (merchantError || !merchants) {
      throw new Error(`Failed to fetch merchants: ${merchantError?.message}`);
    }

    let notified = 0;

    for (const merchant of merchants) {
      try {
        const { data: score } = await supabase.rpc("tax_ready_score_month", {
          p_merchant_id: merchant.id,
          p_year: year,
          p_month: month,
        });

        if (score === null || score === undefined) {
          continue;
        }

        const { data: fixList } = await supabase
          .from("v_tax_ready_fix_list")
          .select("*")
          .eq("merchant_id", merchant.id)
          .eq("year", year)
          .eq("month", month)
          .order("priority", { ascending: true })
          .limit(10);

        let emoji = "🟢";
        let status = "Excellent";
        if (score < 90) {
          emoji = "🟡";
          status = "Good";
        }
        if (score < 75) {
          emoji = "🟠";
          status = "Needs Attention";
        }
        if (score < 60) {
          emoji = "🔴";
          status = "Action Required";
        }

        const fixItems = fixList?.map((item) =>
          `- ${item.fix_description} (${item.tx_count} transactions, $${item.total_amount?.toFixed(2) || '0.00'})`
        ).join("\n") || "No action items - you're all caught up!";

        const subject = `${emoji} Tax-Ready Score: ${score}/100 - ${status}`;
        const body = `Hi ${merchant.name},

Your Tax-Ready Score for ${year}-${String(month).padStart(2, '0')}: ${score}/100 ${emoji}
Status: ${status}

${fixItems}

Log in to your dashboard to review and fix these items:
${Deno.env.get("FRONTEND_URL")}/merchant/dashboard

Keep your books clean!
Local-Link Financial Engine`;

        if (merchant.email) {
          await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
            },
            body: JSON.stringify({
              to: merchant.email,
              subject,
              body,
            }),
          });

          notified++;
          console.log(`[Tax Ready Notify] Sent score ${score} to ${merchant.name}`);
        }
      } catch (error) {
        console.error(`[Tax Ready Notify] Failed for ${merchant.name}:`, error.message);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        total_merchants: merchants.length,
        notified,
        year,
        month,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Tax Ready Weekly Notify] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
