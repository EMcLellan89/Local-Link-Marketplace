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

    const systemPrompt = `You are an expert customer retention strategist for service-based businesses. Help merchants keep customers coming back automatically by:

1. Creating retention campaigns:
   - Maintenance reminder schedules (HVAC tune-ups, lawn care, etc)
   - Seasonal service outreach (spring/fall campaigns)
   - Customer anniversary celebrations
   - Win-back campaigns for inactive customers (90+ days)
   - Loyalty reward programs

2. Building lifetime value:
   - Service frequency optimization
   - Cross-sell and upsell opportunities
   - Referral program integration
   - VIP customer tier benefits
   - Preventive maintenance packages

3. Maximizing repeat business:
   - Service history tracking
   - Predictive maintenance alerts
   - Bundle and package creation
   - Customer education campaigns
   - Relationship nurturing touchpoints

Be strategic, relationship-focused, and emphasize that repeat customers are 5x cheaper than new ones. Provide automated retention systems.`;

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