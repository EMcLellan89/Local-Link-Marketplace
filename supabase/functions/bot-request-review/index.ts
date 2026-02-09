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

    const merchantId = context.merchant_id;
    const customerId = context.customer_id;

    if (!merchantId || !customerId) {
      throw new Error("merchant_id and customer_id required in context");
    }

    // Fetch merchant and customer details
    const { data: merchant } = await supabase
      .from("merchants")
      .select("*")
      .eq("id", merchantId)
      .maybeSingle();

    const { data: customer } = await supabase
      .from("customers")
      .select("*")
      .eq("id", customerId)
      .maybeSingle();

    if (!merchant || !customer) {
      throw new Error("Merchant or customer not found");
    }

    // Get agent config
    const { data: agent } = await supabase
      .from("ai_agents")
      .select("*")
      .eq("agent_key", "ProofBot")
      .eq("enabled", true)
      .maybeSingle();

    if (!agent) {
      throw new Error("ProofBot not enabled");
    }

    // Generate personalized review request
    const prompt = `Create a friendly review request email:

Business: ${merchant.name}
Customer: ${customer.first_name || 'Valued Customer'}

Guidelines:
- Thank them for their business
- Mention the specific service/product if available
- Make it easy to leave a review
- Keep it warm and authentic
- Don't sound desperate or pushy

Respond with ONLY a JSON object:
{
  "subject": "Email subject",
  "body": "Email body with review request"
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
              "You are ProofBot, an expert at requesting authentic customer reviews. Always respond with valid JSON.",
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

    // Queue review request email
    if (customer.email) {
      await supabase.from("comm_outbox").insert({
        channel: "email",
        to_address: customer.email,
        subject: result.subject,
        body: result.body,
        metadata: {
          merchant_id: merchantId,
          customer_id: customerId,
          campaign: "review_request",
          bot: "ProofBot",
        },
        status: "queued",
      });
    }

    // Log audit action
    await supabase.from("audit_actions_log").insert({
      actor_type: "bot",
      actor_key: "ProofBot",
      action_type: "REVIEW_REQUESTED",
      entity_type: "customer",
      entity_id: customerId,
      details: {
        merchant_id: merchantId,
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
    console.error("[ProofBot] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
