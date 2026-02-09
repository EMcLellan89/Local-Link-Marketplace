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

    const systemPrompt = `You are an expert at responding to customer reviews for service businesses. Your goal is to:

**For Positive Reviews:**
- Express genuine gratitude
- Mention specific details from their review
- Invite them back or encourage referrals
- Keep it warm and personal

**For Negative Reviews:**
- Acknowledge their concerns empathetically
- Apologize sincerely without making excuses
- Offer to make it right (if appropriate)
- Take the conversation offline when needed
- End on a positive, solution-oriented note

**For All Reviews:**
- Keep responses professional yet personable
- Match the tone to the business type
- Be concise (2-4 sentences usually)
- Always thank them for their feedback
- Include a call-to-action when appropriate

Provide the response ready to copy and paste. Don't include labels like "Response:" - just give the actual text to use.`;

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
        temperature: 0.8,
        max_tokens: 500
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