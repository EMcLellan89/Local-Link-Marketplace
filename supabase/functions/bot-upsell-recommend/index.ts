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
      .eq("agent_key", "UpsellBot")
      .eq("enabled", true)
      .maybeSingle();

    if (!agent) {
      throw new Error("UpsellBot not enabled");
    }

    // Fetch merchant's current subscriptions
    const { data: currentSubs } = await supabase
      .from("user_subscriptions")
      .select("*, marketplace_products(*)")
      .eq("user_id", merchant.user_id)
      .eq("status", "active");

    // Fetch available products they don't have
    const currentProductIds = currentSubs?.map((s) => s.product_id) || [];
    const { data: availableProducts } = await supabase
      .from("marketplace_products")
      .select("*")
      .eq("is_active", true)
      .not("id", "in", `(${currentProductIds.join(",")})`);

    if (!availableProducts || availableProducts.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          output: { message: "No upsell opportunities found" },
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build context for AI
    const currentProducts = currentSubs?.map((s) => s.marketplace_products?.name).join(", ") || "None";
    const availableList = availableProducts
      .map((p) => `- ${p.name} ($${(p.price_cents / 100).toFixed(2)}): ${p.description || ""}`)
      .join("\n");

    const prompt = `Analyze upsell opportunities for this merchant:

Business: ${merchant.name}
Industry: ${merchant.category || "General"}
Current Products: ${currentProducts}

Available Products:
${availableList}

Recommend up to 2 products that would provide the most value based on their current usage.

Respond with ONLY a JSON object:
{
  "recommendations": [
    {
      "product_name": "Product Name",
      "value_proposition": "Why this would help them",
      "timing": "now|next_month|next_quarter"
    }
  ],
  "email_subject": "Subject line for upsell email",
  "email_pitch": "Brief 2-paragraph pitch"
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
              "You are UpsellBot, an expert at identifying valuable product expansion opportunities. Always respond with valid JSON.",
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

    // Only send email if timing is "now"
    const nowRecommendations = result.recommendations?.filter((r) => r.timing === "now") || [];

    if (nowRecommendations.length > 0 && merchant.email) {
      await supabase.from("comm_outbox").insert({
        channel: "email",
        to_address: merchant.email,
        subject: result.email_subject,
        body: result.email_pitch,
        metadata: {
          merchant_id: merchantId,
          campaign: "upsell",
          bot: "UpsellBot",
          recommendations: nowRecommendations,
        },
        status: "queued",
      });
    }

    // Log audit action
    await supabase.from("audit_actions_log").insert({
      actor_type: "bot",
      actor_key: "UpsellBot",
      action_type: "UPSELL_RECOMMENDED",
      entity_type: "merchant",
      entity_id: merchantId,
      details: {
        recommendations: result.recommendations,
        email_sent: nowRecommendations.length > 0,
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
    console.error("[UpsellBot] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
