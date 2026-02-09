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

  if (!expectedKey || jobKey !== expectedKey) {
    return false;
  }

  return true;
}

async function sendEmail(to: string, subject: string, html: string) {
  // TODO: Integrate with Resend, Postmark, or your email provider
  console.log("EMAIL WOULD BE SENT:", { to, subject });

  // Example with Resend (if configured):
  // const resendKey = Deno.env.get("RESEND_API_KEY");
  // if (resendKey) {
  //   await fetch("https://api.resend.com/emails", {
  //     method: "POST",
  //     headers: {
  //       "Authorization": `Bearer ${resendKey}`,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       from: "noreply@yourapp.com",
  //       to: [to],
  //       subject,
  //       html,
  //     }),
  //   });
  // }
}

async function sendSms(to: string, body: string) {
  // TODO: Integrate with Twilio or your SMS provider
  console.log("SMS WOULD BE SENT:", { to, body });

  // Example with Twilio (if configured):
  // const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  // const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  // const fromNumber = Deno.env.get("TWILIO_FROM_NUMBER");
  //
  // if (accountSid && authToken && fromNumber) {
  //   const auth = btoa(`${accountSid}:${authToken}`);
  //   await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
  //     method: "POST",
  //     headers: {
  //       "Authorization": `Basic ${auth}`,
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     body: new URLSearchParams({
  //       From: fromNumber,
  //       To: to,
  //       Body: body,
  //     }),
  //   });
  // }
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

    // Load abandoned carts with their checkout sessions
    const { data: carts, error } = await supabaseAdmin
      .from("marketplace_abandoned_carts")
      .select(`
        *,
        checkout_session:marketplace_checkout_sessions(
          id,
          created_at,
          status,
          customer_email,
          product_id,
          partner_referral_code,
          total_cents,
          currency
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

      // Skip if already paid
      if (cs.status === "paid") {
        await supabaseAdmin
          .from("marketplace_abandoned_carts")
          .update({
            status: "recovered",
            recovered_at: now.toISOString(),
          })
          .eq("id", cart.id);
        continue;
      }

      const email = cs.customer_email;
      if (!email) continue; // Can't recover without email

      const createdAt = new Date(cs.created_at).getTime();
      const ageMs = now.getTime() - createdAt;

      const appUrl = Deno.env.get("APP_BASE_URL") ||
                     Deno.env.get("SUPABASE_URL")?.replace(/\/.*/, "") ||
                     "http://localhost:3000";

      // Get product details for recovery email
      const { data: product } = await supabaseAdmin
        .from("marketplace_products")
        .select("name, slug")
        .eq("id", cs.product_id)
        .maybeSingle();

      const productName = product?.name || "Your Order";
      const productSlug = product?.slug || "";
      const resumeUrl = `${appUrl}/marketplace/products/${productSlug}${cs.partner_referral_code ? `?ref=${cs.partner_referral_code}` : ""}`;
      const totalFormatted = `${cs.currency.toUpperCase()} ${(cs.total_cents / 100).toFixed(2)}`;

      // STAGE 1: 30 minutes - First reminder email
      if (ageMs >= 30 * 60 * 1000 && !cart.last_email_sent_at) {
        await sendEmail(
          email,
          `Complete your checkout - ${productName}`,
          `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>You were almost done!</h2>
              <p>You left <strong>${productName}</strong> in your cart.</p>
              <p><strong>Total: ${totalFormatted}</strong></p>
              <p style="margin: 30px 0;">
                <a href="${resumeUrl}"
                   style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
                  Complete Your Purchase
                </a>
              </p>
              <p style="color: #666; font-size: 14px;">This link is valid for 7 days.</p>
            </div>
          `
        );

        await supabaseAdmin
          .from("marketplace_abandoned_carts")
          .update({
            status: "abandoned",
            last_email_sent_at: now.toISOString(),
          })
          .eq("id", cart.id);

        processed++;
        continue;
      }

      // STAGE 2: 12 hours - SMS reminder (if phone captured)
      // Note: Requires customer_phone field in checkout_sessions
      if (ageMs >= 12 * 60 * 60 * 1000 && !cart.last_sms_sent_at) {
        // If you add phone capture, uncomment:
        // if (cs.customer_phone) {
        //   await sendSms(
        //     cs.customer_phone,
        //     `${productName} is still in your cart. Complete checkout: ${resumeUrl}`
        //   );
        // }

        await supabaseAdmin
          .from("marketplace_abandoned_carts")
          .update({
            last_sms_sent_at: now.toISOString(),
          })
          .eq("id", cart.id);

        processed++;
        continue;
      }

      // STAGE 3: 24 hours - Final email with urgency
      if (ageMs >= 24 * 60 * 60 * 1000) {
        // Only send if last email was more than 6 hours ago
        const lastEmailTime = cart.last_email_sent_at ? new Date(cart.last_email_sent_at).getTime() : 0;
        const timeSinceLastEmail = now.getTime() - lastEmailTime;

        if (timeSinceLastEmail >= 6 * 60 * 60 * 1000) {
          await sendEmail(
            email,
            `Last chance: ${productName} is waiting`,
            `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>⏰ Your cart expires soon</h2>
                <p>Don't miss out on <strong>${productName}</strong>!</p>
                <p><strong>Total: ${totalFormatted}</strong></p>
                <p style="margin: 30px 0;">
                  <a href="${resumeUrl}"
                     style="display: inline-block; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px;">
                    Claim Your Spot Now
                  </a>
                </p>
                <p style="color: #666; font-size: 14px;">
                  This is your final reminder. Your cart will expire in 3 days.
                </p>
              </div>
            `
          );

          await supabaseAdmin
            .from("marketplace_abandoned_carts")
            .update({
              last_email_sent_at: now.toISOString(),
              status: "expired",
            })
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
    console.error("Error in cart recovery job:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Cart recovery job failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
