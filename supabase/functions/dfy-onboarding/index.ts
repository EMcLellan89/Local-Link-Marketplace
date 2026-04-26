import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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

async function sendAdminAlert(subject: string, html: string) {
  const adminEmail = Deno.env.get("ADMIN_EMAIL") || "admin@locallinkmarketplace.com";
  await sendEmail(adminEmail, subject, html);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { order_id, answers } = await req.json();
    if (!order_id) {
      return new Response(JSON.stringify({ error: "Missing order_id" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: order, error: orderErr } = await supabase
      .from("dfy_orders").select("id, user_id, status, product_name").eq("id", order_id).single();
    if (orderErr || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (order.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: upErr } = await supabase.from("dfy_onboarding").upsert({
      order_id,
      answers,
      submitted_at: new Date().toISOString(),
    });
    if (upErr) {
      return new Response(JSON.stringify({ error: upErr.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase.from("dfy_orders").update({ status: "queued" }).eq("id", order_id);

    // Notify merchant their intake was received and order is queued
    await sendEmail(
      user.email!,
      "Your Order Intake is Complete — We're On It!",
      `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h2 style="color:#2BB673">Intake Received!</h2>
        <p style="color:#475569;font-size:16px">We've received your onboarding intake for <strong>${order.product_name || 'your DFY order'}</strong>. Your order is now in the queue and our fulfillment team will begin work shortly.</p>
        <p style="color:#475569">You'll receive another update when your order moves into active production. Typical turnaround is 3-5 business days.</p>
        <p style="color:#64748b;font-size:13px;margin-top:24px">Questions? Reply to this email and we'll get right back to you.</p>
        <p style="color:#64748b;font-size:13px">— The LocalLink Team</p>
      </div>`
    );

    // Alert fulfillment team
    await sendAdminAlert(
      `[LocalLink] New DFY Intake Submitted — Order #${order_id.slice(0, 8)}`,
      `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h2 style="color:#1e293b">New DFY Intake Ready for Fulfillment</h2>
        <p><strong>Order ID:</strong> ${order_id}</p>
        <p><strong>Product:</strong> ${order.product_name || 'N/A'}</p>
        <p><strong>Customer:</strong> ${user.email}</p>
        <p><strong>Status:</strong> Queued — ready for assignment</p>
      </div>`
    );

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
