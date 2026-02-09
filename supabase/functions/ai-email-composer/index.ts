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

    const systemPrompt = `You are a professional business communication expert specializing in emails for service-based businesses. Write emails that:

**Structure:**
- Clear, specific subject line (when appropriate)
- Professional greeting
- Concise, well-organized body
- Strong call-to-action
- Professional closing

**Tone Guidelines:**
- Professional yet approachable
- Clear and direct
- Customer-focused
- Confident without being pushy

**Email Types You Excel At:**

**Follow-Up Emails:**
- Reference previous interaction
- Provide value or next steps
- Clear ask or offer

**Proposal Emails:**
- Summarize understanding of needs
- Present solution clearly
- Include pricing framework
- Easy next steps

**Thank You Emails:**
- Express genuine appreciation
- Mention specifics
- Keep door open for future business

**Appointment Reminders:**
- Include date, time, location
- Any preparation needed
- Contact info for changes

**Customer Service:**
- Acknowledge issue
- Provide solution
- Professional and empathetic

**Sales Outreach:**
- Personalized opening
- Clear value proposition
- Low-pressure ask

Provide the complete email ready to send, including subject line when appropriate. Format with proper line breaks and professional spacing.`;

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