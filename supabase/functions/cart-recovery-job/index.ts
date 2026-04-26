import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Job-Key",
};

function requireJobKey(req: Request): boolean {
  const jobKey = req.headers.get("x-job-key");
  const expectedKey = Deno.env.get("LOCAL_LINK_JOB_KEY");
  if (!expectedKey || jobKey !== expectedKey) return false;
  return true;
}

async function sendEmail(to: string, subject: string, html: string) {
  const sendgridKey = Deno.env.get("SENDGRID_API_KEY");
  const fromEmail = Deno.env.get("EMAIL_FROM") || "noreply@locallinkmarketplace.com";
  if (!sendgridKey) {
    console.log("No SENDGRID_API_KEY — skipping email to", to);
    return;
  }
  const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${sendgridKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: fromEmail },
      subject,
      content: [{ type: "text/html", value: html }],
    }),
  });
  if (!resp.ok) {
    const err = await resp.text();
    console.error("SendGrid error:", err);
  }
}

async function sendSms(to: string, body: string) {
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const fromNumber = Deno.env.get("TWILIO_FROM_NUMBER");
  if (!accountSid || !authToken || !fromNumber) {
    console.log("Twilio not configured — skipping SMS to", to);
    return;
  }
  const auth = btoa(`${accountSid}:${authToken}`);
  const resp = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ From: fromNumber, To: to, Body: body }),
    }
  );
  if (!resp.ok) {
    const err = await resp.text();
    console.error("Twilio error:", err);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (!requireJobKey(req)) {
    return new Response(
      JSON.stringify({ error: "Invalid job key" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const now = new Date();

    const { data: carts, error } = await supabaseAdmin
      .from("marketplace_abandoned_carts")
      .select(`
        *,
        checkout_session:marketplace_checkout_sessions(
          id, created_at, status, customer_email,
          product_id, partner_referral_code, total_cents, currency
        )
      `)
      .in("status", ["open", "abandoned"])
      .limit(200);

    if (error) throw error;
    if (!carts?.length) {
      return new Response(
        JSON.stringify({ ok: true, processed: 0, message: "No carts to process" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let processed = 0;

    for (const cart of carts) {
      const cs = cart.checkout_session;
      if (!cs) continue;

      if (cs.status === "paid") {
        await supabaseAdmin
          .from("marketplace_abandoned_carts")
          .update({ status: "recovered", recovered_at: now.toISOString() })
          .eq("id", cart.id);
        continue;
      }

      const email = cs.customer_email;
      if (!email) continue;

      const ageMs = now.getTime() - new Date(cs.created_at).getTime();

      const appUrl = Deno.env.get("APP_BASE_URL") || "https://locallinkmarketplace.com";

      const { data: product } = await supabaseAdmin
        .from("marketplace_products")
        .select("name, slug")
        .eq("id", cs.product_id)
        .maybeSingle();

      const productName = product?.name || "Your Order";
      const productSlug = product?.slug || "";
      const resumeUrl = `${appUrl}/marketplace/products/${productSlug}${cs.partner_referral_code ? `?ref=${cs.partner_referral_code}` : ""}`;
      const totalFormatted = `$${(cs.total_cents / 100).toFixed(2)}`;

      // Stage 1: 30 min — first email
      if (ageMs >= 30 * 60 * 1000 && !cart.last_email_sent_at) {
        await sendEmail(
          email,
          `Complete your checkout — ${productName}`,
          `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
            <h2 style="color:#1e293b">You were almost done!</h2>
            <p style="color:#475569">You left <strong>${productName}</strong> in your cart.</p>
            <p style="font-size:20px;font-weight:bold;color:#2BB673">${totalFormatted}</p>
            <p style="margin:30px 0">
              <a href="${resumeUrl}" style="display:inline-block;padding:14px 28px;background:#2BB673;color:white;text-decoration:none;border-radius:8px;font-weight:bold">
                Complete Your Purchase
              </a>
            </p>
            <p style="color:#94a3b8;font-size:13px">This link is valid for 7 days.</p>
          </div>`
        );
        await supabaseAdmin
          .from("marketplace_abandoned_carts")
          .update({ status: "abandoned", last_email_sent_at: now.toISOString() })
          .eq("id", cart.id);
        processed++;
        continue;
      }

      // Stage 2: 12 hr — SMS if phone available
      if (ageMs >= 12 * 60 * 60 * 1000 && !cart.last_sms_sent_at) {
        if (cs.customer_phone) {
          await sendSms(
            cs.customer_phone,
            `${productName} is still in your cart. Complete checkout: ${resumeUrl}`
          );
        }
        await supabaseAdmin
          .from("marketplace_abandoned_carts")
          .update({ last_sms_sent_at: now.toISOString() })
          .eq("id", cart.id);
        processed++;
        continue;
      }

      // Stage 3: 24 hr — final urgency email
      if (ageMs >= 24 * 60 * 60 * 1000) {
        const lastEmailTime = cart.last_email_sent_at ? new Date(cart.last_email_sent_at).getTime() : 0;
        if (now.getTime() - lastEmailTime >= 6 * 60 * 60 * 1000) {
          await sendEmail(
            email,
            `Last chance: ${productName} is waiting for you`,
            `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
              <h2 style="color:#dc2626">Your cart expires soon</h2>
              <p style="color:#475569">Don't miss out on <strong>${productName}</strong>!</p>
              <p style="font-size:20px;font-weight:bold;color:#2BB673">${totalFormatted}</p>
              <p style="margin:30px 0">
                <a href="${resumeUrl}" style="display:inline-block;padding:14px 28px;background:#dc2626;color:white;text-decoration:none;border-radius:8px;font-weight:bold">
                  Claim Your Spot Now
                </a>
              </p>
              <p style="color:#94a3b8;font-size:13px">Your cart will expire in 3 days. This is your final reminder.</p>
            </div>`
          );
          await supabaseAdmin
            .from("marketplace_abandoned_carts")
            .update({ last_email_sent_at: now.toISOString(), status: "expired" })
            .eq("id", cart.id);
          processed++;
        }
      }
    }

    return new Response(
      JSON.stringify({ ok: true, processed }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Cart recovery error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Cart recovery job failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
