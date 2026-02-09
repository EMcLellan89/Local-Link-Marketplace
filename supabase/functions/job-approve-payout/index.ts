import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

function tierRate(tier: string): number {
  if (tier === 'starter') return 0.10;
  if (tier === 'pro') return 0.15;
  return 0.20; // enterprise
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST only' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const body = await req.json();
    if (!body?.job_id || !body?.gross_amount || !body?.performed_by) {
      return new Response(
        JSON.stringify({ error: 'Missing job_id, gross_amount, performed_by' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const job_id = body.job_id as string;
    const gross_amount = Number(body.gross_amount);
    const performed_by = body.performed_by as 'partner' | 'internal' | 'other_partner';
    const worker_partner_id = body.worker_partner_id as string | undefined;

    if (gross_amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'gross_amount must be > 0' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1) Load job + merchant + service key
    const { data: job, error: jErr } = await supabase
      .from('jobs')
      .select('id,merchant_id,service_product_key,status')
      .eq('id', job_id)
      .single();

    if (jErr || !job) {
      return new Response(
        JSON.stringify({ error: 'Job not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // prevent double-approve
    if (job.status === 'approved') {
      return new Response(
        JSON.stringify({ ok: true, skipped: 'already approved' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const merchant_id = job.merchant_id as string;
    const product_key = job.service_product_key as string;

    // 2) Merchant must be active
    const { data: merchant } = await supabase
      .from('merchants')
      .select('id,status,assigned_partner_id')
      .eq('id', merchant_id)
      .single();

    if (!merchant) {
      return new Response(
        JSON.stringify({ error: 'Merchant not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (merchant.status !== 'Active') {
      await supabase.from('jobs').update({ status: 'cancelled' }).eq('id', job_id);
      return new Response(
        JSON.stringify({ ok: true, skipped: 'merchant inactive; job cancelled' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3) Get sourcing partner (partner attached to merchant)
    const sourcing_partner_id = merchant.assigned_partner_id as string | null;

    // 4) Determine who is paid as the "commission earner" for this job
    let commission_earner_partner_id: string | null = null;
    let worker_amount = 0;
    let worker_rate: number | null = null;
    let sourcing_amount = 0;

    if (performed_by === 'internal') {
      // sourcing partner earns 7% if there is an attributed partner and they are active
      if (sourcing_partner_id) {
        const { data: sourcingPartner } = await supabase
          .from('partners')
          .select('id,status,recruiter_partner_id,tier')
          .eq('id', sourcing_partner_id)
          .maybeSingle();

        if (sourcingPartner && sourcingPartner.status === 'Active') {
          sourcing_amount = Number((gross_amount * 0.07).toFixed(2));
          commission_earner_partner_id = sourcing_partner_id;
        }
      }
    } else {
      // partner performed the job
      if (!worker_partner_id) {
        return new Response(
          JSON.stringify({ error: 'worker_partner_id required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: workerPartner } = await supabase
        .from('partners')
        .select('id,status,tier,recruiter_partner_id')
        .eq('id', worker_partner_id)
        .maybeSingle();

      if (!workerPartner || workerPartner.status !== 'Active') {
        return new Response(
          JSON.stringify({ error: 'Worker partner inactive or not found' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      worker_rate = tierRate(workerPartner.tier);
      worker_amount = Number((gross_amount * worker_rate).toFixed(2));
      commission_earner_partner_id = worker_partner_id;
      sourcing_amount = 0;
    }

    // 5) Upline logic (7% one level)
    let upline_amount = 0;
    let recruiter_partner_id: string | null = null;

    if (commission_earner_partner_id) {
      const { data: earner } = await supabase
        .from('partners')
        .select('id,status,recruiter_partner_id')
        .eq('id', commission_earner_partner_id)
        .maybeSingle();

      recruiter_partner_id = (earner?.recruiter_partner_id as string | null) ?? null;

      if (recruiter_partner_id) {
        upline_amount = Number((gross_amount * 0.07).toFixed(2));
      }
    }

    // 6) Platform amount
    const total_out = worker_amount + sourcing_amount + upline_amount;
    const platform_amount = Number(Math.max(gross_amount - total_out, 0).toFixed(2));

    // 7) Record revenue event
    const { data: revEvent, error: rErr } = await supabase
      .from('revenue_events')
      .insert({
        merchant_id,
        product_key,
        gross_amount,
        event_type: 'job.approved',
        stripe_object_id: job_id,
      })
      .select('id')
      .single();

    if (rErr || !revEvent) {
      return new Response(
        JSON.stringify({ error: 'Failed to write revenue event' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 8) Write job_payout record
    const { error: pErr } = await supabase.from('job_payouts').insert({
      job_id,
      merchant_id,
      sourcing_partner_id: sourcing_partner_id,
      worker_partner_id: performed_by === 'internal' ? null : worker_partner_id ?? null,
      gross_amount,
      worker_commission_rate: worker_rate,
      worker_amount,
      sourcing_amount,
      upline_amount,
      platform_amount,
      status: 'pending',
    });

    if (pErr) {
      return new Response(
        JSON.stringify({ error: 'Failed to write job_payouts' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 9) Write partner_commissions/upline_commissions rows
    if (commission_earner_partner_id) {
      const commission_rate = performed_by === 'internal' ? 0.07 : (worker_rate ?? 0);
      const commission_amount = performed_by === 'internal' ? sourcing_amount : worker_amount;

      if (commission_amount > 0) {
        await supabase.from('partner_commissions').insert({
          partner_id: commission_earner_partner_id,
          merchant_id,
          revenue_event_id: revEvent.id,
          commission_rate,
          commission_amount,
          status: 'pending',
        });
      }

      if (recruiter_partner_id && upline_amount > 0) {
        await supabase.from('upline_commissions').insert({
          recruiter_partner_id,
          recruit_partner_id: commission_earner_partner_id,
          revenue_event_id: revEvent.id,
          rate: 0.07,
          commission_amount: upline_amount,
          status: 'pending',
        });
      }
    }

    // 10) Mark job approved
    await supabase.from('jobs').update({ status: 'approved' }).eq('id', job_id);

    return new Response(
      JSON.stringify({
        ok: true,
        job_id,
        gross_amount,
        worker_amount,
        sourcing_amount,
        upline_amount,
        platform_amount,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in job-approve-payout:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});