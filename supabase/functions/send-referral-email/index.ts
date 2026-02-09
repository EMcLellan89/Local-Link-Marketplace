import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function escapeHtml(s: string) {
  return (s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function generateEmailHtml(args: {
  customerName?: string | null;
  programName: string;
  rewardLine: string;
  shareUrl: string;
  qrPngUrl: string;
}) {
  const name = args.customerName?.trim() ? args.customerName.trim() : "there";
  const program = escapeHtml(args.programName);
  const rewardLine = escapeHtml(args.rewardLine);
  const shareUrl = escapeHtml(args.shareUrl);
  const qrUrl = escapeHtml(args.qrPngUrl);

  return `
  <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; background:#f6f7fb; padding:24px;">
    <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e7e7e7; border-radius:16px; overflow:hidden;">
      <div style="padding:20px 22px; border-bottom:1px solid #efefef;">
        <div style="font-size:18px; font-weight:800;">${program}</div>
        <div style="margin-top:6px; color:#444; font-size:13px;">${rewardLine}</div>
      </div>

      <div style="padding:22px;">
        <div style="font-size:16px; font-weight:700;">Hi ${escapeHtml(name)} 👋</div>
        <div style="margin-top:10px; color:#333; line-height:1.5;">
          Here's your personal referral link. Share it with friends — when they qualify, you'll earn your reward.
        </div>

        <div style="margin-top:18px; padding:14px; border:1px solid #eee; border-radius:14px; background:#fafafa;">
          <div style="font-size:12px; color:#666;">Your referral link</div>
          <div style="margin-top:6px; font-size:14px; font-weight:700; word-break:break-all;">
            <a href="${shareUrl}" style="color:#111; text-decoration:underline;">${shareUrl}</a>
          </div>
        </div>

        <div style="margin-top:18px; display:flex; gap:16px; align-items:center; flex-wrap:wrap;">
          <div style="padding:10px; border:1px solid #eee; border-radius:14px; background:#fff;">
            <img alt="QR code" src="${qrUrl}" width="180" height="180" style="display:block; border-radius:10px;" />
          </div>
          <div style="min-width:240px; flex:1;">
            <div style="font-weight:700;">Scan to share</div>
            <div style="margin-top:6px; color:#333; line-height:1.5;">
              Friends can scan the QR code or click your link.
            </div>
            <div style="margin-top:12px;">
              <a href="${shareUrl}" style="display:inline-block; background:#111; color:#fff; padding:10px 14px; border-radius:12px; text-decoration:none; font-weight:700;">
                Open my referral link
              </a>
            </div>
          </div>
        </div>

        <div style="margin-top:20px; font-size:12px; color:#666;">
          Tip: send this message to 3 friends who already trust your recommendation.
        </div>
      </div>

      <div style="padding:14px 22px; border-top:1px solid #efefef; background:#fafafa; font-size:11px; color:#777;">
        Powered by Local-Link Marketplace
      </div>
    </div>
  </div>
  `;
}

function makeCode() {
  return Math.random().toString(16).slice(2, 8).toUpperCase();
}

function formatCurrency(cents: number) {
  return `$${((cents || 0) / 100).toFixed(2)}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const merchantId = user.id;
    const body = await req.json();
    const email = (body.email || "").trim().toLowerCase();
    const fullName = (body.full_name || "").trim() || null;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get referral program
    const { data: program, error: programError } = await supabaseAdmin
      .from("customer_referral_programs")
      .select("*")
      .eq("merchant_id", merchantId)
      .maybeSingle();

    if (programError || !program?.is_enabled) {
      return new Response(JSON.stringify({ error: "Referral program not enabled" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find or create customer
    let customerId: string;
    const { data: existingCustomer } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      // Create customer account
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          role: "customer"
        }
      });

      if (createError || !newUser.user) {
        return new Response(JSON.stringify({ error: "Failed to create customer" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      customerId = newUser.user.id;
    }

    // Get or create share code
    let shareCode: string | null = null;
    const { data: existingLink } = await supabaseAdmin
      .from("customer_referral_links")
      .select("share_code")
      .eq("merchant_id", merchantId)
      .eq("customer_id", customerId)
      .maybeSingle();

    if (existingLink?.share_code) {
      shareCode = existingLink.share_code;
    } else {
      for (let i = 0; i < 10; i++) {
        const code = makeCode();
        const { data: newLink, error: insertError } = await supabaseAdmin
          .from("customer_referral_links")
          .insert({
            merchant_id: merchantId,
            customer_id: customerId,
            share_code: code
          })
          .select("share_code")
          .single();

        if (!insertError && newLink) {
          shareCode = newLink.share_code;
          break;
        }
      }
    }

    if (!shareCode) {
      return new Response(JSON.stringify({ error: "Failed to generate share code" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const appUrl = Deno.env.get("SUPABASE_URL")?.replace(/\/.*/, "") || "http://localhost:3000";
    const destination = `${appUrl}/r/${program.landing_slug}?ref=${shareCode}`;

    // Create short link
    const { data: shortCode } = await supabaseAdmin.rpc("get_or_create_short_link", {
      p_merchant_id: merchantId,
      p_destination_url: destination
    });

    const shortUrl = `${appUrl}/l/${shortCode}`;
    const qrUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/generate-qr-code?text=${encodeURIComponent(shortUrl)}&size=240`;

    const rewardLine = `You earn ${formatCurrency(program.reward_value_cents)} • Your friend gets ${formatCurrency(program.referee_incentive_value_cents)}`;
    const html = generateEmailHtml({
      customerName: fullName,
      programName: program.program_name || "Refer & Earn",
      rewardLine,
      shareUrl: shortUrl,
      qrPngUrl: qrUrl,
    });

    // Send email using Resend (requires RESEND_API_KEY env var)
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailFrom = Deno.env.get("EMAIL_FROM") || "Local-Link <noreply@local-link.com>";
    const subject = `${program.program_name || "Your referral link"} — share & earn`;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailFrom,
        to: email,
        subject: subject,
        html: html,
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Email send error:", emailResult);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Track email sent
    await supabaseAdmin
      .from("profiles")
      .update({ referral_link_email_sent_at: new Date().toISOString() })
      .eq("id", customerId);

    return new Response(JSON.stringify({
      ok: true,
      share_code: shareCode,
      share_url: shortUrl,
      email_id: emailResult.id
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending referral email:", error);
    return new Response(JSON.stringify({ error: error.message || "Error sending email" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
