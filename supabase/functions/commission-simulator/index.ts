import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { sku, amount_cents, partner_id } = await req.json();

    if (!sku || !amount_cents) {
      return new Response(JSON.stringify({ error: 'Missing sku or amount_cents' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const targetPartnerId = partner_id || user.id;

    const { data: rule, error: ruleError } = await supabase
      .from('product_commission_rules')
      .select('*')
      .eq('sku', sku)
      .eq('is_active', true)
      .maybeSingle();

    if (ruleError) {
      throw ruleError;
    }

    const rate = rule?.commission_rate_bps || 0;
    const commission_cents = Math.floor((amount_cents * rate) / 10000);

    const { data: sub } = await supabase
      .from('partner_crm_subscriptions')
      .select('status')
      .eq('partner_id', targetPartnerId)
      .maybeSingle();

    const payout_state = sub?.status === 'active' ? 'eligible' : 'withheld';

    const { data: quarterlyData } = await supabase.rpc('get_partner_quarterly_revenue', {
      p_partner_id: targetPartnerId,
      p_quarter: `Q${Math.floor((new Date().getMonth() / 3)) + 1}-${new Date().getFullYear()}`,
    }).maybeSingle();

    const quarterly_revenue_cents = quarterlyData?.total_revenue_cents || 0;
    const next_bonus_threshold = quarterly_revenue_cents < 500000 ? 500000 :
                                   quarterly_revenue_cents < 1500000 ? 1500000 :
                                   quarterly_revenue_cents < 3000000 ? 3000000 : null;

    return new Response(
      JSON.stringify({
        ok: true,
        sku,
        product_name: rule?.product_name || 'Unknown Product',
        amount_cents,
        commission_cents,
        commission_rate_bps: rate,
        commission_percentage: (rate / 100).toFixed(1) + '%',
        payout_state,
        partner_crm_active: sub?.status === 'active',
        quarterly_revenue_cents,
        next_bonus_threshold,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Commission simulator error:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});