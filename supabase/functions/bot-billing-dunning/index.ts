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

    const subscriptionId = context.subscription_id || context.entity_id;

    if (!subscriptionId) {
      throw new Error("subscription_id required in context");
    }

    // Fetch subscription details
    const { data: subscription } = await supabase
      .from("user_subscriptions")
      .select("*, profiles(*)")
      .eq("id", subscriptionId)
      .maybeSingle();

    if (!subscription) {
      throw new Error(`Subscription not found: ${subscriptionId}`);
    }

    // Get agent config
    const { data: agent } = await supabase
      .from("ai_agents")
      .select("*")
      .eq("agent_key", "BillBot")
      .eq("enabled", true)
      .maybeSingle();

    if (!agent) {
      throw new Error("BillBot not enabled");
    }

    // Determine dunning stage based on metadata
    const attemptNumber = (subscription.metadata?.dunning_attempts || 0) + 1;
    let tone = "polite";
    let urgency = "low";

    if (attemptNumber === 1) {
      tone = "polite";
      urgency = "low";
    } else if (attemptNumber === 2) {
      tone = "concerned";
      urgency = "medium";
    } else if (attemptNumber >= 3) {
      tone = "urgent";
      urgency = "high";
    }

    const prompt = `Create a ${tone} payment recovery email (Attempt #${attemptNumber}):

Customer: ${subscription.profiles?.email || "Customer"}
Subscription: Active for ${subscription.metadata?.months_active || 0} months
Failed Payment: $${((subscription.metadata?.last_payment_cents || 0) / 100).toFixed(2)}

Guidelines:
- Be ${tone} and ${urgency === "high" ? "direct" : "understanding"}
- Acknowledge their value as a customer
- Make it easy to update payment method
- ${attemptNumber >= 3 ? "Mention service will be paused if not resolved" : ""}

Respond with ONLY a JSON object:
{
  "subject": "Email subject",
  "body": "Email body"
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
              "You are BillBot, an expert at payment recovery. Always respond with valid JSON.",
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

    // Send dunning email
    if (subscription.profiles?.email) {
      await supabase.from("comm_outbox").insert({
        channel: "email",
        to_address: subscription.profiles.email,
        subject: result.subject,
        body: result.body,
        metadata: {
          subscription_id: subscriptionId,
          campaign: "dunning",
          attempt: attemptNumber,
          bot: "BillBot",
        },
        status: "queued",
      });
    }

    // Update subscription metadata
    await supabase
      .from("user_subscriptions")
      .update({
        metadata: {
          ...subscription.metadata,
          dunning_attempts: attemptNumber,
          last_dunning_at: new Date().toISOString(),
        },
      })
      .eq("id", subscriptionId);

    // Log audit action
    await supabase.from("audit_actions_log").insert({
      actor_type: "bot",
      actor_key: "BillBot",
      action_type: "DUNNING_EMAIL_SENT",
      entity_type: "subscription",
      entity_id: subscriptionId,
      details: {
        attempt: attemptNumber,
        urgency,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        model: agent.default_model,
        tokens_in: tokensIn,
        tokens_out: tokensOut,
        output: {
          attempt: attemptNumber,
          urgency,
          email_sent: !!subscription.profiles?.email,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[BillBot] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
