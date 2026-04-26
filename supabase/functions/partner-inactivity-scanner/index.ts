import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PartnerInactivityCheck {
  partner_id: string;
  company_name: string;
  email: string;
  last_merchant_signup: string | null;
  last_login: string | null;
  total_merchants: number;
  active_warnings: number;
  inactivity_strike_count: number;
}

async function sendEmail(to: string, subject: string, html: string) {
  const key = Deno.env.get("SENDGRID_API_KEY");
  const from = Deno.env.get("EMAIL_FROM") || "partners@locallinkmarketplace.com";
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: partners, error: partnersError } = await supabaseAdmin
      .from('partners')
      .select('id, company_name, email, last_merchant_signup, last_login, total_merchants, active_warnings, inactivity_strike_count, status')
      .eq('status', 'Active') as { data: PartnerInactivityCheck[] | null, error: any };

    if (partnersError) throw new Error(`Failed to fetch partners: ${partnersError.message}`);
    if (!partners?.length) {
      return new Response(
        JSON.stringify({ message: 'No active partners to check', warnings_issued: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const now = new Date();
    const warningsIssued: any[] = [];
    const territoriesRecovered: any[] = [];

    for (const partner of partners) {
      const daysSinceSignup = partner.last_merchant_signup
        ? Math.floor((now.getTime() - new Date(partner.last_merchant_signup).getTime()) / 86400000)
        : 999;
      const daysSinceLogin = partner.last_login
        ? Math.floor((now.getTime() - new Date(partner.last_login).getTime()) / 86400000)
        : 999;
      const inactiveDays = Math.max(daysSinceSignup, daysSinceLogin);

      if (inactiveDays >= 90) {
        if (partner.inactivity_strike_count >= 2) {
          await recoverPartnerTerritory(supabaseAdmin, partner.partner_id, partner.company_name, partner.email, inactiveDays);
          territoriesRecovered.push({ partner_id: partner.partner_id, company_name: partner.company_name, inactivity_days: inactiveDays });
        } else {
          await issueWarning(supabaseAdmin, partner.partner_id, partner.company_name, partner.email, 'severe', inactiveDays);
          warningsIssued.push({ partner_id: partner.partner_id, company_name: partner.company_name, severity: 'severe', inactivity_days: inactiveDays });
        }
      } else if (inactiveDays >= 60) {
        await issueWarning(supabaseAdmin, partner.partner_id, partner.company_name, partner.email, 'moderate', inactiveDays);
        warningsIssued.push({ partner_id: partner.partner_id, company_name: partner.company_name, severity: 'moderate', inactivity_days: inactiveDays });
      } else if (inactiveDays >= 30) {
        await issueWarning(supabaseAdmin, partner.partner_id, partner.company_name, partner.email, 'minor', inactiveDays);
        warningsIssued.push({ partner_id: partner.partner_id, company_name: partner.company_name, severity: 'minor', inactivity_days: inactiveDays });
      }
    }

    return new Response(
      JSON.stringify({ success: true, partners_checked: partners.length, warnings_issued: warningsIssued.length, territories_recovered: territoriesRecovered.length, warnings: warningsIssued, recoveries: territoriesRecovered }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Inactivity scanner error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function issueWarning(supabase: any, partnerId: string, companyName: string, email: string, severity: string, inactiveDays: number) {
  const messages: Record<string, string> = {
    minor: '30+ days of inactivity. Please log in and sign new merchants to maintain your territory.',
    moderate: '60+ days of inactivity. Action required: Sign at least 1 merchant in the next 30 days or territory may be recovered.',
    severe: '90+ days of inactivity. FINAL WARNING: Sign merchants within 14 days or your territory will be recovered.',
  };
  const deadlines: Record<string, number> = { minor: 30, moderate: 30, severe: 14 };

  const { data: existingWarnings } = await supabase
    .from('partner_warnings')
    .select('id')
    .eq('partner_id', partnerId)
    .eq('warning_type', 'inactivity')
    .eq('severity', severity)
    .eq('resolved', false)
    .gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString());

  if (existingWarnings?.length > 0) return;

  await supabase.from('partner_warnings').insert({
    partner_id: partnerId,
    warning_type: 'inactivity',
    severity,
    title: `${severity.charAt(0).toUpperCase() + severity.slice(1)} Inactivity Warning`,
    description: messages[severity],
    action_required: 'Sign new merchants and log in regularly to maintain territory',
    deadline: new Date(Date.now() + deadlines[severity] * 86400000).toISOString(),
  });

  if (severity === 'severe') {
    await supabase.from('partners')
      .update({ inactivity_strike_count: supabase.sql`inactivity_strike_count + 1`, active_warnings: supabase.sql`active_warnings + 1` })
      .eq('id', partnerId);
  } else {
    await supabase.from('partners')
      .update({ active_warnings: supabase.sql`active_warnings + 1` })
      .eq('id', partnerId);
  }

  const appUrl = Deno.env.get("APP_BASE_URL") || "https://locallinkmarketplace.com";
  const severityColors: Record<string, string> = { minor: '#f59e0b', moderate: '#f97316', severe: '#dc2626' };
  const color = severityColors[severity];

  await sendEmail(
    email,
    `[LocalLink] ${severity === 'severe' ? 'FINAL WARNING' : 'Action Required'} — Territory Inactivity Notice`,
    `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
      <div style="background:${color};color:white;padding:12px 20px;border-radius:8px;margin-bottom:24px">
        <strong>${severity.toUpperCase()} INACTIVITY WARNING</strong>
      </div>
      <h2 style="color:#1e293b">Hi ${companyName},</h2>
      <p style="color:#475569;font-size:16px">${messages[severity]}</p>
      <p style="color:#475569">You have been inactive for <strong>${inactiveDays} days</strong>. You have <strong>${deadlines[severity]} days</strong> to take action before your territory is affected.</p>
      <p style="margin:28px 0">
        <a href="${appUrl}/partner/dashboard" style="display:inline-block;padding:14px 28px;background:#2BB673;color:white;text-decoration:none;border-radius:8px;font-weight:bold">
          Log In Now
        </a>
      </p>
      <p style="color:#64748b;font-size:13px">Reply to this email if you have questions or circumstances that should be considered.</p>
    </div>`
  );
}

async function recoverPartnerTerritory(supabase: any, partnerId: string, companyName: string, email: string, inactiveDays: number) {
  const { data: territories } = await supabase
    .from('territories').select('id, territory_name')
    .eq('assigned_partner_id', partnerId).eq('status', 'Assigned');

  if (!territories?.length) return;

  const { data: warnings } = await supabase.from('partner_warnings').select('id').eq('partner_id', partnerId).eq('warning_type', 'inactivity');
  const warningCount = warnings?.length || 0;
  const { data: merchants } = await supabase.from('merchants').select('id').eq('partner_id', partnerId);
  const merchantCount = merchants?.length || 0;

  for (const territory of territories) {
    await supabase.from('territory_recovery_log').insert({
      territory_id: territory.id,
      previous_partner_id: partnerId,
      recovery_reason: `Inactivity: ${inactiveDays} days without activity. ${warningCount} warnings issued.`,
      inactivity_days: inactiveDays,
      warnings_issued: warningCount,
      merchants_affected: merchantCount,
      last_activity_date: new Date(Date.now() - inactiveDays * 86400000).toISOString(),
    });
    await supabase.from('territories')
      .update({ status: 'Recovering', recovery_date: new Date().toISOString() })
      .eq('id', territory.id);
  }

  await supabase.from('partners').update({ status: 'Suspended' }).eq('id', partnerId);

  const recoveredNames = territories.map((t: any) => t.territory_name).join(', ');
  const appUrl = Deno.env.get("APP_BASE_URL") || "https://locallinkmarketplace.com";

  // Notify partner
  await sendEmail(
    email,
    "[LocalLink] Territory Recovery Notice — Account Suspended",
    `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
      <div style="background:#dc2626;color:white;padding:12px 20px;border-radius:8px;margin-bottom:24px">
        <strong>TERRITORY RECOVERED</strong>
      </div>
      <h2 style="color:#1e293b">Important Notice for ${companyName}</h2>
      <p style="color:#475569;font-size:16px">Due to <strong>${inactiveDays} days of inactivity</strong> and multiple unresolved warnings, your partner account has been suspended and the following territories have been recovered:</p>
      <p style="color:#dc2626;font-weight:bold">${recoveredNames}</p>
      <p style="color:#475569">If you believe this is an error or would like to discuss reinstatement, please contact us immediately by replying to this email.</p>
      <p style="color:#64748b;font-size:13px;margin-top:24px">— The LocalLink Partner Team</p>
    </div>`
  );

  // Notify admin
  await sendAdminAlert(
    `[LocalLink Admin] Territory Recovered — ${companyName}`,
    `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
      <h2 style="color:#1e293b">Territory Recovery Completed</h2>
      <p><strong>Partner:</strong> ${companyName} (${email})</p>
      <p><strong>Territories recovered:</strong> ${recoveredNames}</p>
      <p><strong>Inactive days:</strong> ${inactiveDays}</p>
      <p><strong>Warnings issued:</strong> ${warningCount}</p>
      <p><strong>Merchants affected:</strong> ${merchantCount}</p>
      <p>These territories are now in <strong>Recovering</strong> status and can be reassigned.</p>
    </div>`
  );
}

async function sendAdminAlert(subject: string, html: string) {
  const adminEmail = Deno.env.get("ADMIN_EMAIL") || "admin@locallinkmarketplace.com";
  await sendEmail(adminEmail, subject, html);
}
