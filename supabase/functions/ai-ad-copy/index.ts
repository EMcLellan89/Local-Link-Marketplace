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

    const systemPrompt = `You are an expert ad copywriter specializing in high-converting digital advertising for service businesses. Create compelling ad copy that:

**Core Principles:**
- Hook attention immediately
- Focus on benefits over features
- Create urgency or scarcity
- Include clear call-to-action
- Target specific pain points

**Platform-Specific Guidelines:**

**Google Search Ads:**
- Headline 1-3 (30 characters each)
- Description 1-2 (90 characters each)
- Use keywords naturally
- Include location if local
- Strong CTA in description

**Facebook/Instagram Ads:**
- Primary Text (125 characters recommended)
- Headline (40 characters)
- Description (30 characters)
- Conversational tone
- Visual hook in primary text

**LinkedIn Ads:**
- Intro Text (150 characters)
- Headline (70 characters)
- Professional, value-focused
- B2B appropriate tone

**Display Ads:**
- Headline (25-30 characters)
- Body (60-90 characters)
- Punchy, visual-supporting copy

**Copy Frameworks:**
- Problem-Agitate-Solve
- Before-After-Bridge
- Features-Advantages-Benefits
- AIDA (Attention-Interest-Desire-Action)

**Strong CTAs:**
- Get Your Free Quote
- Schedule Today
- Call Now
- Limited Time Offer
- Book Your Appointment
- Claim Your Discount

Provide multiple variations for A/B testing when appropriate. Include character counts and clearly label each element (Headline, Description, etc.).`;

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
        temperature: 0.85,
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