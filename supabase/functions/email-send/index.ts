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

    const { merchantId, toEmail, subject, bodyHtml, bodyText, leadId } = await req.json();
    if (!merchantId || !toEmail || !subject || (!bodyHtml && !bodyText)) {
      throw new Error("merchantId, toEmail, subject, and body are required");
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
      .eq("email_enabled", true)
      .maybeSingle();

    const BREVO_API_KEY = config?.brevo_api_key || Deno.env.get("BREVO_API_KEY");
    const fromEmail = config?.email_from_address || Deno.env.get("BREVO_FROM_EMAIL") || "crm@locallinkmarketplace.com";
    const fromName = config?.email_from_name || "Local-Link CRM";

    if (!BREVO_API_KEY) throw new Error("Brevo email not configured");

    const payload: Record<string, unknown> = {
      sender: { email: fromEmail, name: fromName },
      to: [{ email: toEmail }],
      subject,
      htmlContent: bodyHtml || "",
    };
    if (bodyText) payload.textContent = bodyText;

    const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(json?.message || `Brevo email failed (${resp.status})`);

    const messageId = String(json.messageId || Date.now());

    await supabaseClient.from("comm_email_logs").insert({
      merchant_id: merchantId,
      lead_id: leadId || null,
      message_id: messageId,
      from_email: fromEmail,
      to_email: toEmail,
      subject,
      body_html: bodyHtml || "",
      body_text: bodyText || "",
      status: "sent",
    });

    return new Response(
      JSON.stringify({ success: true, messageId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
