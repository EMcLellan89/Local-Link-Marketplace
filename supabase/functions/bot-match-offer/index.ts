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
      .eq("agent_key", "MatchBot")
      .eq("enabled", true)
      .maybeSingle();

    if (!agent) {
      throw new Error("MatchBot not enabled");
    }

    // Fetch available products
    const { data: products } = await supabase
      .from("marketplace_products")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (!products || products.length === 0) {
      throw new Error("No active products available");
    }

    // Build product catalog for prompt
    const productList = products
      .map(
        (p) =>
          `- ${p.name} ($${(p.price_cents / 100).toFixed(2)}): ${p.description || 'No description'}`
      )
      .join("\n");

    const prompt = `Match this lead to the best product bundle:

Lead Profile:
- Company: ${lead.company || 'Unknown'}
- Industry: ${lead.metadata?.industry || 'Unknown'}
- Score: ${lead.metadata?.qualification_score || 0}/100
- Budget: ${lead.metadata?.budget || 'Unknown'}
- Pain Points: ${lead.metadata?.pain_points || 'Unknown'}

Available Products:
${productList}

Recommend up to 3 products that best match this lead's needs.

Respond with ONLY a JSON object:
{
  "recommended_products": [
    {
      "product_name": "Product Name",
      "reasoning": "Why this product fits",
      "priority": 1
    }
  ],
  "bundle_discount": 0-30,
  "total_value": 0,
  "pitch_angle": "One sentence value proposition"
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
              "You are MatchBot, an expert at matching leads to the right products. Always respond with valid JSON.",
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

    // Update lead with product recommendations
    await supabase
      .from("internal_crm_leads")
      .update({
        metadata: {
          ...lead.metadata,
          recommended_products: result.recommended_products,
          bundle_discount: result.bundle_discount,
          total_value: result.total_value,
          pitch_angle: result.pitch_angle,
          matched_at: new Date().toISOString(),
        },
      })
      .eq("id", leadId);

    // Log audit action
    await supabase.from("audit_actions_log").insert({
      actor_type: "bot",
      actor_key: "MatchBot",
      action_type: "PRODUCTS_MATCHED",
      entity_type: "lead",
      entity_id: leadId,
      details: result,
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
    console.error("[MatchBot] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
