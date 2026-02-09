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

    const userId = context.user_id || context.entity_id;
    const reason = context.cancel_reason || "unknown";

    if (!userId) {
      throw new Error("user_id required in context");
    }

    // Get agent config
    const { data: agent } = await supabase
      .from("ai_agents")
      .select("*")
      .eq("agent_key", "RetentionBot")
      .eq("enabled", true)
      .maybeSingle();

    if (!agent) {
      throw new Error("RetentionBot not enabled");
    }

    // Fetch user details
    const { data: user } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    // Generate retention offer based on cancel reason
    const prompt = `Create a personalized retention offer:

User has been with us: ${context.months_active || 6} months
Cancel Reason: ${reason}
Current Plan: ${context.plan_name || "Standard"}

Create a compelling save offer:
- Address their specific concern
- Offer a meaningful incentive (discount, upgrade, pause)
- Make it easy to stay
- Be empathetic and understanding

Respond with ONLY a JSON object:
{
  "subject": "Email subject",
  "body": "Email body with retention offer",
  "offer_type": "discount|upgrade|pause|custom",
  "offer_details": "Specific offer terms"
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
              "You are RetentionBot, an expert at customer retention. Always respond with valid JSON.",
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

    // Send retention offer
    if (user.email) {
      await supabase.from("comm_outbox").insert({
        channel: "email",
        to_address: user.email,
        subject: result.subject,
        body: result.body,
        metadata: {
          user_id: userId,
          campaign: "retention",
          cancel_reason: reason,
          offer_type: result.offer_type,
          bot: "RetentionBot",
        },
        status: "queued",
      });
    }

    // Log audit action
    await supabase.from("audit_actions_log").insert({
      actor_type: "bot",
      actor_key: "RetentionBot",
      action_type: "RETENTION_OFFER_SENT",
      entity_type: "user",
      entity_id: userId,
      details: {
        reason,
        offer_type: result.offer_type,
        offer_details: result.offer_details,
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
    console.error("[RetentionBot] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
