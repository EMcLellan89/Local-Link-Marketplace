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

    const leadId = context.lead_id;
    if (!leadId) {
      throw new Error("lead_id required in context");
    }

    // Fetch lead details
    const { data: lead } = await supabase
      .from("internal_crm_leads")
      .select("*")
      .eq("id", leadId)
      .maybeSingle();

    if (!lead) {
      throw new Error(`Lead not found: ${leadId}`);
    }

    // Get agent config
    const { data: agent } = await supabase
      .from("ai_agents")
      .select("*")
      .eq("agent_key", "DealBot")
      .eq("enabled", true)
      .maybeSingle();

    if (!agent) {
      throw new Error("DealBot not enabled");
    }

    // Build proposal using matched products
    const recommendations = lead.metadata?.recommended_products || [];
    if (recommendations.length === 0) {
      throw new Error("No product recommendations found for this lead");
    }

    const productDetails = recommendations
      .map((r, i) => `${i + 1}. ${r.product_name}: ${r.reasoning}`)
      .join("\n");

    const prompt = `Create a compelling proposal for this lead:

Lead: ${lead.first_name || ''} ${lead.last_name || ''} at ${lead.company || 'their company'}
Industry: ${lead.metadata?.industry || 'Unknown'}
Pain Points: ${lead.metadata?.pain_points || 'General business growth'}

Recommended Products:
${productDetails}

Bundle Value: $${lead.metadata?.total_value || 0}
Bundle Discount: ${lead.metadata?.bundle_discount || 0}%
Pitch Angle: ${lead.metadata?.pitch_angle || 'Drive growth'}

Write a 3-paragraph proposal:
1. Acknowledge their pain points
2. Present the solution bundle
3. Include a clear call-to-action

Respond with ONLY a JSON object:
{
  "subject": "Email subject line",
  "greeting": "Personalized greeting",
  "paragraph_1": "Problem acknowledgment",
  "paragraph_2": "Solution presentation",
  "paragraph_3": "Call to action",
  "ps": "Optional P.S. to create urgency"
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
              "You are DealBot, an expert at writing compelling sales proposals. Write professionally but conversationally. Always respond with valid JSON.",
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

    // Compose full email body
    const emailBody = `${result.greeting}

${result.paragraph_1}

${result.paragraph_2}

${result.paragraph_3}

${result.ps ? `P.S. ${result.ps}` : ''}

Best regards,
Local-Link Team`;

    // Queue email in comm_outbox
    if (lead.email) {
      await supabase.from("comm_outbox").insert({
        channel: "email",
        to_address: lead.email,
        subject: result.subject,
        body: emailBody,
        metadata: {
          lead_id: leadId,
          campaign: "ai_proposal",
          bot: "DealBot",
        },
        status: "queued",
      });
    }

    // Update lead
    await supabase
      .from("internal_crm_leads")
      .update({
        metadata: {
          ...lead.metadata,
          proposal_sent_at: new Date().toISOString(),
          proposal_subject: result.subject,
        },
      })
      .eq("id", leadId);

    // Log audit action
    await supabase.from("audit_actions_log").insert({
      actor_type: "bot",
      actor_key: "DealBot",
      action_type: "PROPOSAL_GENERATED",
      entity_type: "lead",
      entity_id: leadId,
      details: { subject: result.subject },
    });

    return new Response(
      JSON.stringify({
        success: true,
        model: agent.default_model,
        tokens_in: tokensIn,
        tokens_out: tokensOut,
        output: result,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[DealBot] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
