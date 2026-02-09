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

    const merchantId = context.merchant_id || context.entity_id;
    const partnerId = context.partner_id;

    if (!merchantId) {
      throw new Error("merchant_id required in context");
    }

    // Fetch merchant details
    const { data: merchant } = await supabase
      .from("merchants")
      .select("*")
      .eq("id", merchantId)
      .maybeSingle();

    if (!merchant) {
      throw new Error(`Merchant not found: ${merchantId}`);
    }

    // Get agent config
    const { data: agent } = await supabase
      .from("ai_agents")
      .select("*")
      .eq("agent_key", "OnboardBot")
      .eq("enabled", true)
      .maybeSingle();

    if (!agent) {
      throw new Error("OnboardBot not enabled");
    }

    // Create onboarding checklist
    const checklist = [
      {
        task: "Complete business profile",
        status: merchant.description ? "complete" : "pending",
        priority: 1,
      },
      {
        task: "Upload logo and branding",
        status: merchant.logo_url ? "complete" : "pending",
        priority: 2,
      },
      {
        task: "Set up payment processing",
        status: "pending",
        priority: 1,
      },
      {
        task: "Create first deal or offer",
        status: "pending",
        priority: 2,
      },
      {
        task: "Review merchant dashboard tutorial",
        status: "pending",
        priority: 3,
      },
    ];

    // Generate personalized welcome message
    const prompt = `Create a warm welcome email for a new merchant:

Business: ${merchant.name}
Industry: ${merchant.category || 'General Business'}
Owner: ${merchant.owner_name || 'Business Owner'}

Include:
- Warm welcome
- Brief overview of what they can accomplish
- Next steps from the checklist
- Offer of support

Keep it friendly and encouraging. 2-3 paragraphs.

Respond with ONLY a JSON object:
{
  "subject": "Email subject",
  "body": "Full email body"
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
              "You are OnboardBot, an expert at welcoming new clients and guiding them through onboarding. Always respond with valid JSON.",
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

    // Queue welcome email
    if (merchant.email) {
      await supabase.from("comm_outbox").insert({
        channel: "email",
        to_address: merchant.email,
        subject: result.subject,
        body: result.body,
        metadata: {
          merchant_id: merchantId,
          campaign: "onboarding",
          bot: "OnboardBot",
        },
        status: "queued",
      });
    }

    // Store checklist in merchant metadata
    await supabase
      .from("merchants")
      .update({
        metadata: {
          ...merchant.metadata,
          onboarding_checklist: checklist,
          onboarded_at: new Date().toISOString(),
          onboarding_bot_ran: true,
        },
      })
      .eq("id", merchantId);

    // Log audit action
    await supabase.from("audit_actions_log").insert({
      actor_type: "bot",
      actor_key: "OnboardBot",
      action_type: "CLIENT_ONBOARDED",
      entity_type: "merchant",
      entity_id: merchantId,
      details: { checklist_items: checklist.length },
    });

    return new Response(
      JSON.stringify({
        success: true,
        model: agent.default_model,
        tokens_in: tokensIn,
        tokens_out: tokensOut,
        output: {
          checklist,
          email_queued: !!merchant.email,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[OnboardBot] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
