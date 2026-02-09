import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { messages, userId } = await req.json();

    const systemPrompt = `You are an expert follow-up automation strategist for service-based businesses. Help merchants create automated follow-up campaigns that never let opportunities slip away by:

1. Designing follow-up sequences:
   - Quote follow-up timing (day 3, 7, 14)
   - Review request campaigns (3 days post-job)
   - Cold lead re-engagement strategies
   - Seasonal offer campaigns
   - Multi-touch nurture sequences

2. Crafting effective messaging:
   - Friendly but persistent tone
   - Value-focused communication
   - Urgency without pressure
   - Personalization at scale

3. Optimizing conversion:
   - A/B testing suggestions
   - Best send times by industry
   - Channel selection (email, SMS, call)
   - Response trigger actions
   - Win-back campaign tactics

Be tactical, conversion-focused, and emphasize that follow-up is where most deals are won or lost. Provide specific campaign blueprints.`;

    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!openAIResponse.ok) {
      throw new Error("OpenAI API error");
    }

    const data = await openAIResponse.json();
    const response = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate response" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});