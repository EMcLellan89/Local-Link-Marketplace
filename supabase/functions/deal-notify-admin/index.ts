import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function sendEmail(to: string, subject: string, html: string) {
  const key = Deno.env.get("SENDGRID_API_KEY");
  const from = Deno.env.get("EMAIL_FROM") || "admin@locallinkmarketplace.com";
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

    const { deal_id } = await req.json();
    if (!deal_id) throw new Error("deal_id required");

    const { data: deal } = await supabase
      .from("deals")
      .select("id, title, status, merchant_id, merchants(business_name, email)")
      .eq("id", deal_id)
      .maybeSingle();

    if (!deal) throw new Error("Deal not found");

    const appUrl = Deno.env.get("APP_BASE_URL") || "https://locallinkmarketplace.com";
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "admin@locallinkmarketplace.com";
    const merchant = (deal as any).merchants;

    // Alert admin of new pending deal
    await sendEmail(
      adminEmail,
      `[LocalLink] New Deal Pending Approval — ${deal.title}`,
      `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h2 style="color:#1e293b">New Deal Awaiting Approval</h2>
        <p><strong>Deal:</strong> ${deal.title}</p>
        <p><strong>Merchant:</strong> ${merchant?.business_name || 'Unknown'}</p>
        <p><strong>Merchant Email:</strong> ${merchant?.email || 'N/A'}</p>
        <p style="margin:24px 0">
          <a href="${appUrl}/admin/deals" style="display:inline-block;padding:12px 24px;background:#2BB673;color:white;text-decoration:none;border-radius:8px;font-weight:bold">
            Review Deal
          </a>
        </p>
      </div>`
    );

    // Also send confirmation to merchant
    if (merchant?.email) {
      await sendEmail(
        merchant.email,
        "Your Deal Has Been Submitted for Review",
        `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
          <h2 style="color:#2BB673">Deal Submitted!</h2>
          <p style="color:#475569;font-size:16px">Your deal <strong>"${deal.title}"</strong> has been submitted and is pending approval by our team.</p>
          <p style="color:#475569">You'll receive an email once your deal is approved and live on the marketplace. This typically takes 1-2 business days.</p>
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
