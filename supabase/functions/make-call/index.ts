import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    const { merchantId, toNumber, leadId, agentId, metadata } = await req.json();
    if (!merchantId || !toNumber) {
      throw new Error("merchantId and toNumber are required");
    }

    const { data: merchant } = await supabaseClient
      .from("merchants")
      .select("user_id")
      .eq("id", merchantId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!merchant) throw new Error("Merchant not found or unauthorized");

    const { data: config } = await supabaseClient
      .from("comm_configurations")
      .select("*")
      .eq("merchant_id", merchantId)
      .eq("is_active", true)
      .maybeSingle();

    const RETELL_API_KEY = config?.retell_api_key || Deno.env.get("RETELL_API_KEY");
    const resolvedAgentId = agentId || config?.retell_agent_id || Deno.env.get("RETELL_DEFAULT_AGENT_ID");

    if (!RETELL_API_KEY || !resolvedAgentId) {
      throw new Error("Retell AI not configured for this merchant");
    }

    const resp = await fetch("https://api.retellai.com/v2/create-phone-call", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RETELL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to_number: toNumber,
        agent_id: resolvedAgentId,
        metadata: { merchant_id: merchantId, lead_id: leadId, ...metadata },
      }),
    });

    const json = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(json?.error?.message || `Retell call failed (${resp.status})`);

    await supabaseClient.from("comm_call_logs").insert({
      merchant_id: merchantId,
      lead_id: leadId || null,
      call_id: json.call_id || String(Date.now()),
      direction: "outbound",
      to_number: toNumber,
      status: json.call_status || "initiated",
      agent_id: resolvedAgentId,
    });

    return new Response(
      JSON.stringify({ success: true, callId: json.call_id, status: json.call_status }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
