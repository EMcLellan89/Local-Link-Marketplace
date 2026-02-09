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
    const touchNumber = context.touch_number;
    const messageType = context.message_type;

    if (!leadId || !touchNumber) {
      throw new Error("lead_id and touch_number required in context");
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
      .eq("agent_key", "NurtureBot")
      .eq("enabled", true)
      .maybeSingle();

    if (!agent) {
      throw new Error("NurtureBot not enabled");
    }

    // Build follow-up message
    const prompt = `Create a ${messageType} follow-up email (Touch #${touchNumber}):

Lead: ${lead.first_name || ''} ${lead.last_name || ''}
Company: ${lead.company || 'their company'}
Original inquiry: ${lead.metadata?.pitch_angle || 'business growth solutions'}

Message Type: ${messageType}
Touch Number: ${touchNumber}

Guidelines:
- Keep it brief (2-3 sentences)
- Provide value, don't just "check in"
- Include a clear next step
- Be conversational and helpful

Respond with ONLY a JSON object:
{
  "subject": "Email subject line",
  "body": "Email body text"
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
              "You are NurtureBot, an expert at writing helpful follow-up emails that provide value. Always respond with valid JSON.",
          },
          { role: "user", content: prompt },
        ],
        temperature: agent.temperature || 0.2,
        max_tokens: agent.max_tokens || 700,
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

    // Queue email in comm_outbox
    if (lead.email) {
      await supabase.from("comm_outbox").insert({
        channel: "email",
        to_address: lead.email,
        subject: result.subject,
        body: result.body,
        metadata: {
          lead_id: leadId,
          campaign: "ai_nurture",
          touch_number: touchNumber,
          message_type: messageType,
          bot: "NurtureBot",
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
          last_touch_at: new Date().toISOString(),
          last_touch_number: touchNumber,
        },
      })
      .eq("id", leadId);

    // Log audit action
    await supabase.from("audit_actions_log").insert({
      actor_type: "bot",
      actor_key: "NurtureBot",
      action_type: "FOLLOWUP_SENT",
      entity_type: "lead",
      entity_id: leadId,
      details: {
        touch_number: touchNumber,
        message_type: messageType,
        subject: result.subject,
      },
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
    console.error("[NurtureBot] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
