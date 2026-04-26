import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function sendEmail(to: string, subject: string, html: string) {
  const key = Deno.env.get("SENDGRID_API_KEY");
  const from = Deno.env.get("EMAIL_FROM") || "noreply@locallinkmarketplace.com";
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

    const { purchase_id } = await req.json();
    if (!purchase_id) throw new Error("purchase_id required");

    const { data: purchase } = await supabase
      .from("purchases")
      .select(`
        id, qr_code, amount_paid_cents, created_at,
        deals(title, redemption_instructions, merchants(business_name, email))
      `)
      .eq("id", purchase_id)
      .maybeSingle();

    if (!purchase) throw new Error("Purchase not found");

    const deal = (purchase as any).deals;
    const merchant = deal?.merchants;
    const appUrl = Deno.env.get("APP_BASE_URL") || "https://locallinkmarketplace.com";
    const amountFormatted = purchase.amount_paid_cents
      ? `$${(purchase.amount_paid_cents / 100).toFixed(2)}`
      : "";
    const purchaseDate = new Date(purchase.created_at).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });

    // Email confirmation to customer
    if (user.email) {
      await sendEmail(
        user.email,
        `Your LocalLink Purchase — ${deal?.title || "Deal"}`,
        `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
          <h2 style="color:#2BB673">Purchase Confirmed!</h2>
          <p style="color:#475569;font-size:16px">Thanks for your purchase of <strong>${deal?.title || "your deal"}</strong>!</p>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:24px 0">
            <p style="margin:0 0 8px;color:#64748b;font-size:13px">Purchase Date</p>
            <p style="margin:0 0 16px;font-weight:bold;color:#1e293b">${purchaseDate}</p>
            ${amountFormatted ? `<p style="margin:0 0 8px;color:#64748b;font-size:13px">Amount Paid</p>
            <p style="margin:0 0 16px;font-weight:bold;color:#1e293b">${amountFormatted}</p>` : ""}
            <p style="margin:0 0 8px;color:#64748b;font-size:13px">Redeem At</p>
            <p style="margin:0;font-weight:bold;color:#1e293b">${merchant?.business_name || "Merchant"}</p>
          </div>
          ${deal?.redemption_instructions ? `<div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:16px;margin-bottom:24px">
            <p style="margin:0 0 6px;font-weight:bold;color:#92400e">How to Redeem</p>
            <p style="margin:0;color:#78350f">${deal.redemption_instructions}</p>
          </div>` : ""}
          ${purchase.qr_code ? `<p style="color:#475569">Show your QR code at the business to redeem:</p>
          <p style="margin:20px 0;text-align:center">
            <a href="${appUrl}/customer/purchases" style="display:inline-block;padding:12px 24px;background:#2BB673;color:white;text-decoration:none;border-radius:8px;font-weight:bold">
              View My QR Code
            </a>
          </p>` : ""}
          <p style="color:#64748b;font-size:13px;margin-top:24px">Questions? Reply to this email and we'll help you out.</p>
        </div>`
      );
    }

    // Notify merchant of new purchase
    if (merchant?.email) {
      await sendEmail(
        merchant.email,
        `New Deal Redemption — ${deal?.title}`,
        `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
          <h2 style="color:#2BB673">New Customer Purchase!</h2>
          <p style="color:#475569;font-size:16px">A customer has purchased your deal <strong>"${deal?.title}"</strong>.</p>
          <p style="color:#475569">They will be visiting your business to redeem it. Make sure your team is ready to scan their QR code.</p>
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
