import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { openaiCategorize } from "../_shared/openaiClient.ts";

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
    const { data: lead, error: leadError } = await supabase
      .from("internal_crm_leads")
      .select("*")
      .eq("id", leadId)
      .maybeSingle();

    if (leadError || !lead) {
      throw new Error(`Lead not found: ${leadId}`);
    }

    // Get agent config
    const { data: agent } = await supabase
      .from("ai_agents")
      .select("*")
      .eq("agent_key", "QualifyBot")
      .eq("enabled", true)
      .maybeSingle();

    if (!agent) {
      throw new Error("QualifyBot not enabled");
    }

    // Build qualification prompt
    const prompt = `Qualify this lead on a scale of 0-100:

Lead Information:
- Name: ${lead.first_name || ''} ${lead.last_name || ''}
- Email: ${lead.email || 'Not provided'}
- Phone: ${lead.phone || 'Not provided'}
- Company: ${lead.company || 'Not provided'}
- Industry: ${lead.metadata?.industry || 'Unknown'}
- Source: ${lead.source || 'Unknown'}
- Notes: ${lead.notes || 'None'}

Scoring criteria:
- 90-100: Hot lead - Has budget, authority, need, timeline (BANT)
- 70-89: Warm lead - Has 3/4 BANT criteria
- 50-69: Cool lead - Has 2/4 BANT criteria
- 0-49: Cold lead - Has 1 or 0 BANT criteria

Respond with ONLY a JSON object:
{
  "score": 0-100,
  "temperature": "hot|warm|cool|cold",
  "reasoning": "Brief explanation",
  "next_action": "call|email|nurture|disqualify"
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
            content: "You are QualifyBot, an expert at qualifying sales leads using BANT criteria. Always respond with valid JSON.",
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

    // Update lead with qualification score
    await supabase
      .from("internal_crm_leads")
      .update({
        metadata: {
          ...lead.metadata,
          qualification_score: result.score,
          temperature: result.temperature,
          qualification_reasoning: result.reasoning,
          next_action: result.next_action,
          qualified_at: new Date().toISOString(),
        },
      })
      .eq("id", leadId);

    // Log audit action
    await supabase.from("audit_actions_log").insert({
      actor_type: "bot",
      actor_key: "QualifyBot",
      action_type: "LEAD_QUALIFIED",
      entity_type: "lead",
      entity_id: leadId,
      details: {
        score: result.score,
        temperature: result.temperature,
        next_action: result.next_action,
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
    console.error("[QualifyBot] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
