import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function sendEmail(to: string, subject: string, html: string) {
  const key = Deno.env.get("SENDGRID_API_KEY");
  const from = Deno.env.get("EMAIL_FROM") || "support@locallinkmarketplace.com";
  if (!key) return;
  try {
    await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: from },
        subject,
        content: [{ type: "text/html", value: html }],
      }),
    });
  } catch (e) {
    console.error("sendEmail error:", e);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Unauthorized");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (userError || !user) throw new Error("Unauthorized");

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (profile?.role !== "admin") throw new Error("Admin only");

    const { application_id, status, admin_notes } = await req.json();
    if (!application_id || !status) throw new Error("application_id and status required");

    const { data: app } = await supabase
      .from("merchant_applications")
      .select("business_email, legal_business_name, contact_first_name, contact_last_name, application_number")
      .eq("id", application_id)
      .maybeSingle();

    if (!app?.business_email) {
      return new Response(JSON.stringify({ ok: true, skipped: "no email" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const appUrl = Deno.env.get("APP_BASE_URL") || "https://locallinkmarketplace.com";
    const name = `${app.contact_first_name || ""} ${app.contact_last_name || ""}`.trim() || app.legal_business_name;

    if (status === "approved") {
      await sendEmail(
        app.business_email,
        "Your Merchant Processing Application Has Been Approved!",
        `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
          <div style="background:#2BB673;color:white;padding:12px 20px;border-radius:8px;margin-bottom:24px">
            <strong>APPLICATION APPROVED</strong>
          </div>
          <h2 style="color:#1e293b">Congratulations, ${name}!</h2>
          <p style="color:#475569;font-size:16px">Your merchant processing application (Ref: <strong>${app.application_number}</strong>) for <strong>${app.legal_business_name}</strong> has been approved.</p>
          <p style="color:#475569">Our team will be in touch shortly with your gateway credentials and next steps to get you processing payments.</p>
          ${admin_notes ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:20px 0"><p style="margin:0;color:#166534"><strong>Notes from our team:</strong> ${admin_notes}</p></div>` : ""}
          <p style="margin:28px 0">
            <a href="${appUrl}/merchant/dashboard" style="display:inline-block;padding:14px 28px;background:#2BB673;color:white;text-decoration:none;border-radius:8px;font-weight:bold">
              Go to My Dashboard
            </a>
          </p>
          <p style="color:#64748b;font-size:13px">— The LocalLink Team</p>
        </div>`
      );
    } else if (status === "rejected") {
      await sendEmail(
        app.business_email,
        "Update on Your Merchant Processing Application",
        `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
          <h2 style="color:#1e293b">Application Update — ${name}</h2>
          <p style="color:#475569;font-size:16px">Thank you for applying for merchant processing with LocalLink (Ref: <strong>${app.application_number}</strong>).</p>
          <p style="color:#475569">After review, we are unable to approve your application at this time.</p>
          ${admin_notes ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:20px 0"><p style="margin:0;color:#991b1b"><strong>Reason:</strong> ${admin_notes}</p></div>` : ""}
          <p style="color:#475569">You are welcome to reapply in the future. If you have questions, please reply to this email.</p>
          <p style="color:#64748b;font-size:13px;margin-top:24px">— The LocalLink Team</p>
        </div>`
      );
    } else if (status === "under_review") {
      await sendEmail(
        app.business_email,
        "Your Application is Under Review",
        `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
          <h2 style="color:#1e293b">Application Under Review</h2>
          <p style="color:#475569;font-size:16px">Hi ${name}, we have received your merchant processing application (Ref: <strong>${app.application_number}</strong>) and it is currently under review.</p>
          <p style="color:#475569">You will hear back from us within 2-3 business days. No action is needed from you at this time.</p>
          <p style="color:#64748b;font-size:13px;margin-top:24px">— The LocalLink Team</p>
        </div>`
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
