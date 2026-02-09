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

    const leadId = context.lead_id || context.entity_id;

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
      .eq("agent_key", "RouteBot")
      .eq("enabled", true)
      .maybeSingle();

    if (!agent) {
      throw new Error("RouteBot not enabled");
    }

    // Find available partners in the lead's territory
    const { data: partners } = await supabase
      .from("partners")
      .select("*")
      .eq("status", "active")
      .order("created_at");

    if (!partners || partners.length === 0) {
      throw new Error("No active partners available");
    }

    // Simple routing logic: assign to partner with fewest active leads
    const partnerLeadCounts = await Promise.all(
      partners.map(async (p) => {
        const { count } = await supabase
          .from("internal_crm_leads")
          .select("*", { count: "exact", head: true })
          .eq("assigned_partner_id", p.id)
          .eq("status", "open");

        return { partner_id: p.id, partner_name: p.name, lead_count: count || 0 };
      })
    );

    // Sort by lead count ascending
    partnerLeadCounts.sort((a, b) => a.lead_count - b.lead_count);
    const bestPartner = partnerLeadCounts[0];

    // Assign lead to partner
    await supabase
      .from("internal_crm_leads")
      .update({
        assigned_partner_id: bestPartner.partner_id,
        metadata: {
          ...lead.metadata,
          routed_at: new Date().toISOString(),
          routed_by: "RouteBot",
        },
      })
      .eq("id", leadId);

    // Notify partner
    const { data: partner } = await supabase
      .from("partners")
      .select("email, name")
      .eq("id", bestPartner.partner_id)
      .maybeSingle();

    if (partner?.email) {
      await supabase.from("comm_outbox").insert({
        channel: "email",
        to_address: partner.email,
        subject: "New Lead Assigned",
        body: `Hi ${partner.name},

You've been assigned a new lead:

Company: ${lead.company || "N/A"}
Contact: ${lead.first_name || ""} ${lead.last_name || ""}
Score: ${lead.metadata?.qualification_score || 0}/100

Log in to your dashboard to follow up.

Local-Link Team`,
        metadata: {
          lead_id: leadId,
          partner_id: bestPartner.partner_id,
          bot: "RouteBot",
        },
        status: "queued",
      });
    }

    // Log audit action
    await supabase.from("audit_actions_log").insert({
      actor_type: "bot",
      actor_key: "RouteBot",
      action_type: "LEAD_ROUTED",
      entity_type: "lead",
      entity_id: leadId,
      details: {
        partner_id: bestPartner.partner_id,
        partner_name: bestPartner.partner_name,
        partner_lead_count: bestPartner.lead_count,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        model: agent.default_model,
        tokens_in: 0,
        tokens_out: 0,
        output: {
          assigned_to: bestPartner.partner_name,
          partner_id: bestPartner.partner_id,
          notification_sent: !!partner?.email,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[RouteBot] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
