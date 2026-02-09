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

    const ticketId = context.ticket_id || context.entity_id;

    if (!ticketId) {
      throw new Error("ticket_id required in context");
    }

    // Fetch ticket details
    const { data: ticket } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("id", ticketId)
      .maybeSingle();

    if (!ticket) {
      throw new Error(`Ticket not found: ${ticketId}`);
    }

    // Get agent config
    const { data: agent } = await supabase
      .from("ai_agents")
      .select("*")
      .eq("agent_key", "HelpBot")
      .eq("enabled", true)
      .maybeSingle();

    if (!agent) {
      throw new Error("HelpBot not enabled");
    }

    // Triage the ticket
    const prompt = `Triage this support ticket:

Subject: ${ticket.subject || 'No subject'}
Description: ${ticket.description || 'No description'}
Category: ${ticket.category || 'Unknown'}

Classify:
1. Urgency: critical | high | medium | low
2. Category: billing | technical | sales | general
3. Complexity: simple | moderate | complex
4. Can be auto-resolved: yes | no
5. Suggested response (if auto-resolvable)

Respond with ONLY a JSON object:
{
  "urgency": "critical|high|medium|low",
  "category": "billing|technical|sales|general",
  "complexity": "simple|moderate|complex",
  "auto_resolvable": true|false,
  "suggested_response": "Response text or null",
  "reasoning": "Brief explanation"
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
              "You are HelpBot, an expert at triaging support tickets. Always respond with valid JSON.",
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

    // Update ticket with triage results
    const updateData: any = {
      priority: result.urgency,
      category: result.category,
      metadata: {
        ...ticket.metadata,
        complexity: result.complexity,
        auto_resolvable: result.auto_resolvable,
        triage_reasoning: result.reasoning,
        triaged_at: new Date().toISOString(),
      },
    };

    // If auto-resolvable, add response and mark as resolved
    if (result.auto_resolvable && result.suggested_response) {
      updateData.status = "resolved";
      updateData.resolved_at = new Date().toISOString();
      updateData.resolution = result.suggested_response;

      // Send response to customer
      if (ticket.requester_email) {
        await supabase.from("comm_outbox").insert({
          channel: "email",
          to_address: ticket.requester_email,
          subject: `Re: ${ticket.subject || 'Your Support Request'}`,
          body: result.suggested_response,
          metadata: {
            ticket_id: ticketId,
            bot: "HelpBot",
          },
          status: "queued",
        });
      }
    } else {
      // Route to appropriate team member based on category
      updateData.status = "open";
    }

    await supabase.from("support_tickets").update(updateData).eq("id", ticketId);

    // Log audit action
    await supabase.from("audit_actions_log").insert({
      actor_type: "bot",
      actor_key: "HelpBot",
      action_type: "TICKET_TRIAGED",
      entity_type: "ticket",
      entity_id: ticketId,
      details: {
        urgency: result.urgency,
        category: result.category,
        auto_resolved: result.auto_resolvable,
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
    console.error("[HelpBot] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
