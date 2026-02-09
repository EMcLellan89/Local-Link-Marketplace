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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get all active partners
    const { data: partners, error: partnersError } = await supabaseAdmin
      .from('partners')
      .select('id, company_name, email, last_merchant_signup, last_login, total_merchants, active_warnings, inactivity_strike_count, status')
      .eq('status', 'Active') as { data: PartnerInactivityCheck[] | null, error: any };

    if (partnersError) {
      throw new Error(`Failed to fetch partners: ${partnersError.message}`);
    }

    if (!partners || partners.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No active partners to check', warnings_issued: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const now = new Date();
    const warningsIssued: any[] = [];
    const territoriesRecovered: any[] = [];

    // Check each partner for inactivity
    for (const partner of partners) {
      const daysSinceSignup = partner.last_merchant_signup
        ? Math.floor((now.getTime() - new Date(partner.last_merchant_signup).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      const daysSinceLogin = partner.last_login
        ? Math.floor((now.getTime() - new Date(partner.last_login).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      const inactiveDays = Math.max(daysSinceSignup, daysSinceLogin);

      // Determine action based on inactivity
      if (inactiveDays >= 90) {
        // SEVERE: 90+ days - Issue severe warning or recover territory
        if (partner.inactivity_strike_count >= 2) {
          // Third strike - Recover territory
          await recoverPartnerTerritory(supabaseAdmin, partner.partner_id, inactiveDays);
          territoriesRecovered.push({
            partner_id: partner.partner_id,
            company_name: partner.company_name,
            inactivity_days: inactiveDays
          });
        } else {
          // Issue severe warning
          await issueWarning(supabaseAdmin, partner.partner_id, 'severe', inactiveDays);
          warningsIssued.push({
            partner_id: partner.partner_id,
            company_name: partner.company_name,
            severity: 'severe',
            inactivity_days: inactiveDays
          });
        }
      } else if (inactiveDays >= 60) {
        // MODERATE: 60-89 days
        await issueWarning(supabaseAdmin, partner.partner_id, 'moderate', inactiveDays);
        warningsIssued.push({
          partner_id: partner.partner_id,
          company_name: partner.company_name,
          severity: 'moderate',
          inactivity_days: inactiveDays
        });
      } else if (inactiveDays >= 30) {
        // MINOR: 30-59 days
        await issueWarning(supabaseAdmin, partner.partner_id, 'minor', inactiveDays);
        warningsIssued.push({
          partner_id: partner.partner_id,
          company_name: partner.company_name,
          severity: 'minor',
          inactivity_days: inactiveDays
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        partners_checked: partners.length,
        warnings_issued: warningsIssued.length,
        territories_recovered: territoriesRecovered.length,
        warnings: warningsIssued,
        recoveries: territoriesRecovered
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Inactivity scanner error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function issueWarning(supabase: any, partnerId: string, severity: string, inactiveDays: number) {
  const messages = {
    minor: '30+ days of inactivity. Please log in and sign new merchants to maintain your territory.',
    moderate: '60+ days of inactivity. Action required: Sign at least 1 merchant in the next 30 days or territory may be recovered.',
    severe: '90+ days of inactivity. FINAL WARNING: Sign merchants within 14 days or your territory will be recovered.'
  };

  const deadlines = {
    minor: 30,
    moderate: 30,
    severe: 14
  };

  // Check if similar unresolved warning exists
  const { data: existingWarnings } = await supabase
    .from('partner_warnings')
    .select('id')
    .eq('partner_id', partnerId)
    .eq('warning_type', 'inactivity')
    .eq('severity', severity)
    .eq('resolved', false)
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()); // Within last 7 days

  if (existingWarnings && existingWarnings.length > 0) {
    // Don't spam - warning already issued recently
    return;
  }

  // Create warning
  await supabase
    .from('partner_warnings')
    .insert({
      partner_id: partnerId,
      warning_type: 'inactivity',
      severity: severity,
      title: `${severity.charAt(0).toUpperCase() + severity.slice(1)} Inactivity Warning`,
      description: messages[severity as keyof typeof messages],
      action_required: 'Sign new merchants and log in regularly to maintain territory',
      deadline: new Date(Date.now() + (deadlines[severity as keyof typeof deadlines] * 24 * 60 * 60 * 1000)).toISOString()
    });

  // Update partner strike count for severe warnings
  if (severity === 'severe') {
    await supabase
      .from('partners')
      .update({
        inactivity_strike_count: supabase.sql`inactivity_strike_count + 1`,
        active_warnings: supabase.sql`active_warnings + 1`
      })
      .eq('id', partnerId);
  } else {
    await supabase
      .from('partners')
      .update({
        active_warnings: supabase.sql`active_warnings + 1`
      })
      .eq('id', partnerId);
  }

  // TODO: Send email notification to partner
  console.log(`Warning issued to partner ${partnerId}: ${severity}`);
}

async function recoverPartnerTerritory(supabase: any, partnerId: string, inactiveDays: number) {
  // Get partner's territories
  const { data: territories } = await supabase
    .from('territories')
    .select('id, territory_name')
    .eq('assigned_partner_id', partnerId)
    .eq('status', 'Assigned');

  if (!territories || territories.length === 0) {
    return;
  }

  // Get partner warnings count
  const { data: warnings } = await supabase
    .from('partner_warnings')
    .select('id')
    .eq('partner_id', partnerId)
    .eq('warning_type', 'inactivity');

  const warningCount = warnings?.length || 0;

  // Get merchants count
  const { data: merchants } = await supabase
    .from('merchants')
    .select('id')
    .eq('partner_id', partnerId);

  const merchantCount = merchants?.length || 0;

  // Recover each territory
  for (const territory of territories) {
    // Log recovery
    await supabase
      .from('territory_recovery_log')
      .insert({
        territory_id: territory.id,
        previous_partner_id: partnerId,
        recovery_reason: `Inactivity: ${inactiveDays} days without merchant signup or login. ${warningCount} warnings issued.`,
        inactivity_days: inactiveDays,
        warnings_issued: warningCount,
        merchants_affected: merchantCount,
        last_activity_date: new Date(Date.now() - inactiveDays * 24 * 60 * 60 * 1000).toISOString()
      });

    // Set territory to Recovering status
    await supabase
      .from('territories')
      .update({
        status: 'Recovering',
        recovery_date: new Date().toISOString()
      })
      .eq('id', territory.id);
  }

  // Suspend partner
  await supabase
    .from('partners')
    .update({
      status: 'Suspended'
    })
    .eq('id', partnerId);

  // TODO: Send email notification to partner about territory recovery
  // TODO: Send email to admin about territory now available
  console.log(`Territory recovered from partner ${partnerId} due to ${inactiveDays} days inactivity`);
}
