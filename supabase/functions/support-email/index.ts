import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SupportEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  merchantId?: string;
  timestamp: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { name, email, subject, message, merchantId, timestamp }: SupportEmailRequest = await req.json();

    const emailBody = `
New Support Request
==================

From: ${name}
Email: ${email}
Merchant ID: ${merchantId || "N/A"}
Time: ${new Date(timestamp).toLocaleString()}

Subject: ${subject}

Message:
${message}

==================
Reply to: ${email}
    `;

    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");

    if (!BREVO_API_KEY) {
      console.log("Brevo API key not configured. Support email would have been sent.");
      console.log("Email content:", emailBody);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Support request received. We will respond within 24 hours.",
          note: "Email sending is pending configuration",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: "support@locallink.com", name: "LocalLink Support System" },
        to: [{ email: "apptpipeline@gmail.com" }],
        replyTo: { email, name },
        subject: `Support Request: ${subject}`,
        textContent: emailBody,
      }),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("Brevo error:", errorText);
      throw new Error("Failed to send email");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Support request sent successfully. We will respond within 24 hours.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in support-email function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "An error occurred",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
