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

    // Get agent config
    const { data: agent } = await supabase
      .from("ai_agents")
      .select("*")
      .eq("agent_key", "ChiefBot")
      .eq("enabled", true)
      .maybeSingle();

    if (!agent) {
      throw new Error("ChiefBot not enabled");
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // Gather key metrics
    const metrics: any = {};

    // New merchants
    const { count: newMerchants } = await supabase
      .from("merchants")
      .select("*", { count: "exact", head: true })
      .gte("created_at", yesterdayStr);
    metrics.new_merchants = newMerchants || 0;

    // New partners
    const { count: newPartners } = await supabase
      .from("partners")
      .select("*", { count: "exact", head: true })
      .gte("created_at", yesterdayStr);
    metrics.new_partners = newPartners || 0;

    // New deals
    const { count: newDeals } = await supabase
      .from("deals")
      .select("*", { count: "exact", head: true })
      .gte("created_at", yesterdayStr);
    metrics.new_deals = newDeals || 0;

    // Total revenue (orders)
    const { data: orders } = await supabase
      .from("orders")
      .select("total_cents")
      .gte("created_at", yesterdayStr)
      .eq("status", "completed");

    const totalRevenue = orders?.reduce((sum, o) => sum + (o.total_cents || 0), 0) || 0;
    metrics.revenue_cents = totalRevenue;
    metrics.revenue = (totalRevenue / 100).toFixed(2);

    // Support tickets
    const { count: newTickets } = await supabase
      .from("support_tickets")
      .select("*", { count: "exact", head: true })
      .gte("created_at", yesterdayStr);
    metrics.new_tickets = newTickets || 0;

    // Bot activity
    const { count: jobsRun } = await supabase
      .from("ai_runs")
      .select("*", { count: "exact", head: true })
      .gte("started_at", yesterdayStr);
    metrics.jobs_run = jobsRun || 0;

    // Generate executive summary
    const prompt = `Create a concise executive briefing for ${yesterdayStr}:

Key Metrics:
- New Merchants: ${metrics.new_merchants}
- New Partners: ${metrics.new_partners}
- New Deals: ${metrics.new_deals}
- Revenue: $${metrics.revenue}
- Support Tickets: ${metrics.new_tickets}
- AI Jobs Executed: ${metrics.jobs_run}

Create a brief 3-paragraph summary:
1. Key wins and highlights
2. Areas of concern or opportunity
3. Recommended focus for today

Keep it executive-level: strategic, actionable, concise.

Respond with ONLY a JSON object:
{
  "subject": "Email subject",
  "summary": "3-paragraph briefing"
}`;

    // Call OpenAI
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: agent.default_model || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are ChiefBot, an expert executive assistant who creates concise daily briefings. Always respond with valid JSON.",
          },
          { role: "user", content: prompt },
        ],
        temperature: agent.temperature || 0.2,
        max_tokens: agent.max_tokens || 900,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();
    const tokensIn = data.usage?.prompt_tokens || 0;
    const tokensOut = data.usage?.completion_tokens || 0;

    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const result = JSON.parse(content);

    // Send briefing to admin team
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "admin@local-link.com";

    await supabase.from("comm_outbox").insert({
      channel: "email",
      to_address: adminEmail,
      subject: result.subject,
      body: result.summary,
      metadata: {
        campaign: "daily_briefing",
        bot: "ChiefBot",
        metrics,
      },
      status: "queued",
    });

    // Log audit action
    await supabase.from("audit_actions_log").insert({
      actor_type: "bot",
      actor_key: "ChiefBot",
      action_type: "DAILY_BRIEF_SENT",
      entity_type: "system",
      entity_id: "00000000-0000-0000-0000-000000000000",
      details: metrics,
    });

    return new Response(
      JSON.stringify({
        success: true,
        model: agent.default_model,
        tokens_in: tokensIn,
        tokens_out: tokensOut,
        output: {
          metrics,
          briefing: result,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[ChiefBot] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
