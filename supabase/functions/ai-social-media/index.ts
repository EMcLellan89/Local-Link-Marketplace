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

    const systemPrompt = `You are a social media marketing expert for local service businesses. Create engaging, platform-appropriate content that:

**General Guidelines:**
- Write in a conversational, authentic voice
- Include strong calls-to-action
- Use emojis strategically (not excessively)
- Keep it concise and scannable
- Focus on benefits, not just features

**Platform-Specific Formatting:**

**Facebook:**
- 1-2 paragraphs
- Conversational and community-focused
- Ask questions to drive engagement
- Include link placement guidance

**Instagram:**
- Short, punchy caption (max 150 characters for first line)
- 10-15 relevant hashtags
- Strong visual description or hook
- Story-driven when possible

**LinkedIn:**
- Professional tone
- Industry insights or business tips
- 2-3 paragraphs
- 3-5 professional hashtags

**Twitter/X:**
- Max 280 characters
- Clear, direct message
- 1-2 hashtags
- Thread suggestions if needed

**Content Types:**
- Before/After showcases
- Customer testimonials
- Educational tips
- Behind-the-scenes
- Seasonal promotions
- Team spotlights

Provide the complete post ready to copy and paste, including hashtags where appropriate.`;

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
        temperature: 0.9,
        max_tokens: 800
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