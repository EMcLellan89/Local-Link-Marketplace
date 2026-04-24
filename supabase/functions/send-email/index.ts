import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Internal-Api-Key",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    const EMAIL_FROM = Deno.env.get("EMAIL_FROM") || "partners@locallinkmarketplace.com";
    const FROM_NAME = Deno.env.get("BREVO_FROM_NAME") || "Local-Link";
    const INTERNAL_API_KEY = Deno.env.get("INTERNAL_API_KEY");

    if (!BREVO_API_KEY || !INTERNAL_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing env vars" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const key = req.headers.get("x-internal-api-key") || "";
    if (key !== INTERNAL_API_KEY) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const to = String(body.to || "");
    const subject = String(body.subject || "");
    const html = String(body.html || "");
    const text = body.text ? String(body.text) : undefined;
    const toName = body.toName ? String(body.toName) : undefined;

    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ error: "to, subject, html required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload: Record<string, unknown> = {
      sender: { email: EMAIL_FROM, name: FROM_NAME },
      to: [{ email: to, ...(toName ? { name: toName } : {}) }],
      subject,
      htmlContent: html,
    };

    if (text) payload.textContent = text;

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
    if (!resp.ok) {
      console.error("Brevo send failed:", json);
      return new Response(
        JSON.stringify({ error: "Brevo send failed", details: json }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ ok: true, messageId: json.messageId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
