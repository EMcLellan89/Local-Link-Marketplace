import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Internal-Api-Key",
};

const TEMPLATES = {
  approved: {
    subject: "You're approved 🎉 Here's your Partner link + what to sell first",
    html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;line-height:1.5;">
  <h2 style="margin:0 0 10px;">You're approved 🎉</h2>
  <p>Welcome to the <b>Local-Link Partner Program</b> — you can now earn <b>one-time commissions</b> by referring businesses to our platforms.</p>

  <div style="padding:12px;border:1px solid #eee;border-radius:10px;background:#fafafa;margin:14px 0;">
    <b>Your next best step:</b><br/>
    Go to your Partner Dashboard → <b>Products to Sell</b> → copy your first link.
  </div>

  <p><b>Fastest product to sell this week:</b><br/>
  ✅ CRM Setup Fee (easy "yes")<br/>
  ✅ Courses (high margin, quick win)<br/>
  ✅ TradeHive/AdSuite (for trades + agencies)</p>

  <p>
    <a href="{{APP_BASE_URL}}/affiliate/dashboard" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#0b5cff;color:#fff;text-decoration:none;font-weight:700;">
      Open Partner Dashboard
    </a>
  </p>

  <hr style="border:none;border-top:1px solid #eee;margin:18px 0;" />
  <p style="font-size:12px;color:#666;">
    Reminder: Please disclose you may earn a commission when sharing links (FTC).
  </p>
</div>`,
  },
  noLink48: {
    subject: "Quick win (10 seconds): copy your first Partner link",
    html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;line-height:1.5;">
  <h3 style="margin:0 0 10px;">Quick win: copy your first link ✅</h3>
  <p>Most Partners get their first conversion after they share <b>one link</b> with <b>3 business owners</b>.</p>

  <ol>
    <li>Open Partner Dashboard</li>
    <li>Go to <b>Products to Sell</b></li>
    <li>Click <b>Copy Link</b> + <b>Copy Pitch</b></li>
  </ol>

  <p>
    <a href="{{APP_BASE_URL}}/affiliate/products" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#0b5cff;color:#fff;text-decoration:none;font-weight:700;">
      Copy my first link
    </a>
  </p>

  <p style="font-size:13px;color:#444;">
    Want the easiest offer to lead with? Use: <b>"CRM Setup + Migration"</b> (fast yes, high trust).
  </p>
</div>`,
  },
  firstSignup: {
    subject: "Nice — you got a signup ✅ here's how to turn it into a paid customer",
    html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;line-height:1.5;">
  <h3 style="margin:0 0 10px;">Nice — you got a signup ✅</h3>
  <p>Here's the fastest way to convert them:</p>

  <div style="padding:12px;border:1px solid #eee;border-radius:10px;background:#fafafa;margin:14px 0;">
    <b>Send this message:</b><br/><br/>
    "Hey! Want me to help you set it up so it's actually saving time this week? If I can't make it simpler, no worries."
  </div>

  <p>
    <a href="{{APP_BASE_URL}}/affiliate/earnings" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#0b5cff;color:#fff;text-decoration:none;font-weight:700;">
      View my referrals
    </a>
  </p>
</div>`,
  },
  firstSale: {
    subject: "First commission earned ✅ here's how to double it",
    html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;line-height:1.5;">
  <h2 style="margin:0 0 10px;">You just earned your first commission ✅</h2>
  <p>That's proof the system works. Here's how Partners double results quickly:</p>

  <ol>
    <li>Share the same offer with 5 more owners (same industry)</li>
    <li>Lead with one pain point: missed follow-ups or invoicing headaches</li>
    <li>Offer a simple next step: a 2-minute walkthrough</li>
  </ol>

  <p>
    <a href="{{APP_BASE_URL}}/affiliate/products" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#0b5cff;color:#fff;text-decoration:none;font-weight:700;">
      Copy another link + pitch
    </a>
  </p>
</div>`,
  },
  payoutReady: {
    subject: "You've got money pending 💰 payout details inside",
    html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;line-height:1.5;">
  <h3 style="margin:0 0 10px;">You've got money pending 💰</h3>
  <p>You have approved commissions ready. Payouts are processed on our standard schedule (Net-30) once the minimum threshold is met.</p>

  <p>
    <a href="{{APP_BASE_URL}}/affiliate/earnings" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#0b5cff;color:#fff;text-decoration:none;font-weight:700;">
      View payouts
    </a>
  </p>

  <p style="font-size:13px;color:#444;">
    Tip: The fastest way to increase payouts is to lead with <b>Courses</b> and <b>Setup Fees</b>.
  </p>
</div>`,
  },
  inactive14: {
    subject: "Want fresh wins this week? Here's the easiest offer to sell.",
    html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;line-height:1.5;">
  <h3 style="margin:0 0 10px;">Want a quick win this week?</h3>
  <p>The simplest offer to sell is:</p>

  <div style="padding:12px;border:1px solid #eee;border-radius:10px;background:#fafafa;margin:14px 0;">
    <b>"Setup + Migration"</b><br/>
    We set it up, move their contacts, and get them live without headaches.
  </div>

  <p>
    <a href="{{APP_BASE_URL}}/affiliate/products" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#0b5cff;color:#fff;text-decoration:none;font-weight:700;">
      Copy link + pitch
    </a>
  </p>
</div>`,
  },
};

function renderTemplate(html: string, vars: Record<string, string>): string {
  let output = html;
  for (const [key, value] of Object.entries(vars)) {
    output = output.replaceAll(`{{${key}}}`, value);
  }
  return output;
}

async function sendEmail(
  supabaseUrl: string,
  internalKey: string,
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const resp = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Api-Key": internalKey,
    },
    body: JSON.stringify({ to, subject, html }),
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(`SendGrid failed: ${errorText}`);
  }
}

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
    const INTERNAL_API_KEY = Deno.env.get("INTERNAL_API_KEY");
    const key = req.headers.get("x-internal-api-key") || "";

    if (!INTERNAL_API_KEY || key !== INTERNAL_API_KEY) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const APP_BASE_URL = Deno.env.get("APP_BASE_URL") || "https://locallinkmarketplace.com";
    const COOLDOWN_HOURS = Number(Deno.env.get("NUDGE_COOLDOWN_HOURS") || 48);

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: "Missing env vars" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: affiliates, error } = await supabase
      .from("marketplace_affiliates")
      .select("id, user_id, status, approved_at, last_nudged_at, affiliate_code, profiles:profiles(email, display_name)")
      .eq("status", "active")
      .limit(5000);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date();
    const cooldownMs = COOLDOWN_HOURS * 3600 * 1000;
    let sent = 0;
    const results: any[] = [];

    for (const affiliate of affiliates || []) {
      const email = (affiliate as any).profiles?.email as string | undefined;
      if (!email) continue;

      const lastNudgedAt = (affiliate as any).last_nudged_at
        ? new Date((affiliate as any).last_nudged_at)
        : null;

      if (lastNudgedAt && now.getTime() - lastNudgedAt.getTime() < cooldownMs) {
        continue;
      }

      const affiliateId = String((affiliate as any).id);

      const { count: referralsCount } = await supabase
        .from("marketplace_affiliate_referrals")
        .select("id", { count: "exact", head: true })
        .eq("marketplace_affiliate_id", affiliateId);

      const { data: commissions } = await supabase
        .from("marketplace_affiliate_commissions")
        .select("id, status, created_at")
        .eq("marketplace_affiliate_id", affiliateId);

      const paidCount = (commissions || []).filter((c: any) => c.status === "paid").length;
      const approvedCount = (commissions || []).filter((c: any) => c.status === "approved").length;

      let templateKey: keyof typeof TEMPLATES | null = null;

      const approvedAt = (affiliate as any).approved_at
        ? new Date((affiliate as any).approved_at)
        : null;

      if (approvedAt && (referralsCount || 0) === 0) {
        const hoursSinceApproval = (now.getTime() - approvedAt.getTime()) / 3600000;
        if (hoursSinceApproval >= 48) {
          templateKey = "noLink48";
        }
      }

      if (!templateKey && (referralsCount || 0) > 0 && paidCount === 0) {
        templateKey = "firstSignup";
      }

      if (!templateKey && paidCount === 1) {
        templateKey = "firstSale";
      }

      if (!templateKey && approvedCount > 0) {
        templateKey = "payoutReady";
      }

      if (!templateKey) {
        const lastActivity = [
          approvedAt?.getTime() || 0,
          ...(commissions || []).map((c: any) => new Date(c.created_at).getTime()),
        ].reduce((a, b) => Math.max(a, b), 0);

        const days = (now.getTime() - lastActivity) / (24 * 3600 * 1000);
        if (days >= 14) {
          templateKey = "inactive14";
        }
      }

      if (!templateKey) continue;

      const template = TEMPLATES[templateKey];
      const html = renderTemplate(template.html, { APP_BASE_URL });

      try {
        await sendEmail(SUPABASE_URL, INTERNAL_API_KEY, email, template.subject, html);
        sent++;

        await supabase
          .from("marketplace_affiliates")
          .update({ last_nudged_at: now.toISOString() })
          .eq("id", affiliateId);

        results.push({
          affiliate_id: affiliateId,
          email,
          template: templateKey,
          ok: true,
        });
      } catch (err) {
        results.push({
          affiliate_id: affiliateId,
          email,
          template: templateKey,
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    return new Response(JSON.stringify({ ok: true, sent, results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
