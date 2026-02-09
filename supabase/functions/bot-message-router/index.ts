import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface MessageRequest {
  botSlug: string;
  message: string;
  sessionId?: string;
  channelType?: string;
  context?: Record<string, any>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    let userId: string | null = null;

    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    const body: MessageRequest = await req.json();
    const { botSlug, message, sessionId, channelType = "webchat", context = {} } = body;

    if (!botSlug || !message) {
      return new Response(
        JSON.stringify({ error: "botSlug and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get bot profile
    const { data: botProfile, error: botError } = await supabase
      .from("bot_profiles")
      .select("*")
      .eq("slug", botSlug)
      .eq("is_active", true)
      .single();

    if (botError || !botProfile) {
      return new Response(
        JSON.stringify({ error: "Bot not found or inactive" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get bot tool permissions
    const { data: permissions } = await supabase
      .from("bot_tool_permissions")
      .select(`
        tool_id,
        is_allowed,
        restrictions,
        ai_tools:tool_id (
          slug,
          name
        )
      `)
      .eq("bot_profile_id", botProfile.id)
      .eq("is_allowed", true);

    const allowedTools = permissions?.map(p => ({
      slug: (p.ai_tools as any)?.slug,
      name: (p.ai_tools as any)?.name,
      restrictions: p.restrictions
    })) || [];

    // Get or create conversation
    const genSessionId = sessionId || `${userId || 'anon'}_${Date.now()}`;

    let { data: conversation } = await supabase
      .from("bot_conversations")
      .select("*")
      .eq("session_id", genSessionId)
      .eq("bot_profile_id", botProfile.id)
      .single();

    if (!conversation) {
      const { data: newConv, error: convError } = await supabase
        .from("bot_conversations")
        .insert({
          bot_profile_id: botProfile.id,
          user_id: userId,
          session_id: genSessionId,
          channel_type: channelType,
          messages: [],
          context,
          status: "active"
        })
        .select()
        .single();

      if (convError) {
        throw new Error(`Failed to create conversation: ${convError.message}`);
      }
      conversation = newConv;
    }

    // Add user message to conversation
    const messages = conversation.messages as any[] || [];
    messages.push({
      role: "user",
      content: message,
      timestamp: new Date().toISOString()
    });

    // Build AI prompt with system context
    const systemContext = {
      botName: botProfile.name,
      roleType: botProfile.role_type,
      businessId: botProfile.default_business_id,
      allowedProducts: botProfile.allowed_products_rule,
      allowedTools: allowedTools.map(t => t.slug),
      handoffRules: botProfile.handoff_rules
    };

    // Generate AI response (simplified - in production would call OpenAI/Claude)
    // For now, return a basic response demonstrating the bot is working
    const aiResponse = generateBotResponse(botProfile, message, allowedTools);

    // Add AI response to messages
    messages.push({
      role: "assistant",
      content: aiResponse,
      timestamp: new Date().toISOString()
    });

    // Update conversation
    await supabase
      .from("bot_conversations")
      .update({
        messages,
        updated_at: new Date().toISOString()
      })
      .eq("id", conversation.id);

    // Check if handoff needed
    const handoffNeeded = checkHandoffRules(
      message,
      botProfile.handoff_rules as any
    );

    if (handoffNeeded) {
      await supabase.from("bot_handoffs").insert({
        conversation_id: conversation.id,
        bot_profile_id: botProfile.id,
        handoff_reason: handoffNeeded.reason,
        to_queue: handoffNeeded.queue,
        status: "pending"
      });
    }

    return new Response(
      JSON.stringify({
        response: aiResponse,
        sessionId: genSessionId,
        botInfo: {
          name: botProfile.name,
          role: botProfile.role_type
        },
        handoffNeeded: !!handoffNeeded,
        allowedTools: allowedTools.map(t => t.slug)
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Bot router error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper function to generate bot response
function generateBotResponse(
  botProfile: any,
  message: string,
  allowedTools: any[]
): string {
  const lowerMessage = message.toLowerCase();

  // Basic response logic based on bot role
  if (botProfile.role_type === "sales") {
    if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
      return `I'd be happy to help with pricing! I have access to our complete SKU catalog. What specific product or service are you interested in? I can also ${allowedTools.some(t => t.slug === 'create_checkout') ? 'create a checkout session' : 'help you get started'}.`;
    }
    if (lowerMessage.includes("buy") || lowerMessage.includes("purchase")) {
      return `Great! Let me help you with that purchase. ${allowedTools.some(t => t.slug === 'create_checkout') ? "I can create a secure checkout for you. What would you like to buy?" : "Please let me gather some information first."}`;
    }
  }

  if (botProfile.role_type === "booking") {
    if (lowerMessage.includes("appointment") || lowerMessage.includes("schedule")) {
      return "I can help schedule an appointment for you. What day and time works best? Also, please share your name, email, and phone number.";
    }
  }

  if (botProfile.role_type === "support") {
    if (lowerMessage.includes("help") || lowerMessage.includes("problem")) {
      return `I'm here to help! I'm your ${botProfile.name}. Can you tell me more about what you need assistance with?`;
    }
  }

  // Default response
  return `${botProfile.system_prompt}\n\nHow can I help you today?`;
}

// Helper function to check handoff rules
function checkHandoffRules(
  message: string,
  handoffRules: any
): { reason: string; queue: string } | null {
  if (!handoffRules || !handoffRules.handoff_on) return null;

  const lowerMessage = message.toLowerCase();
  const triggers = handoffRules.handoff_on as string[];

  for (const trigger of triggers) {
    if (lowerMessage.includes(trigger.toLowerCase())) {
      return {
        reason: trigger,
        queue: handoffRules.to_queue || "general_support"
      };
    }
  }

  return null;
}
