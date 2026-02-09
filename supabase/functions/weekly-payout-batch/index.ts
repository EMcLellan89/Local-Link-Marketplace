import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin only' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const now = new Date();
    const periodEnd = now.toISOString();
    const periodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: partners, error: partnersError } = await supabaseClient
      .from('partners')
      .select('*')
      .eq('status', 'Active');

    if (partnersError) {
      return new Response(JSON.stringify({ error: partnersError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const batchesCreated = [];
    let totalPartnersProcessed = 0;
    let totalTransactionsProcessed = 0;

    for (const partner of partners || []) {
      const { data: transactions, error: txError } = await supabaseClient
        .from('transactions')
        .select('*')
        .eq('partner_id', partner.id)
        .eq('payment_status', 'Paid')
        .eq('payout_status', 'Unpaid')
        .gte('created_at', periodStart)
        .lt('created_at', periodEnd);

      if (txError || !transactions || transactions.length === 0) {
        continue;
      }

      const totalPartnerShare = transactions.reduce(
        (sum, tx) => sum + parseFloat(String(tx.partner_share || 0)),
        0
      );

      const { data: batch, error: batchError } = await supabaseClient
        .from('payout_batches')
        .insert({
          partner_id: partner.id,
          period_start: periodStart,
          period_end: periodEnd,
          total_partner_share: totalPartnerShare,
          status: 'Scheduled',
        })
        .select()
        .single();

      if (batchError) {
        console.error(`Failed to create batch for partner ${partner.id}:`, batchError);
        continue;
      }

      const batchTransactions = transactions.map((tx) => ({
        payout_batch_id: batch.id,
        transaction_id: tx.id,
      }));

      const { error: linkError } = await supabaseClient
        .from('batch_transactions')
        .insert(batchTransactions);

      if (linkError) {
        console.error(`Failed to link transactions for batch ${batch.id}:`, linkError);
      }

      const txIds = transactions.map((tx) => tx.id);
      await supabaseClient
        .from('transactions')
        .update({ payout_status: 'Scheduled' })
        .in('id', txIds);

      batchesCreated.push({
        batch_id: batch.id,
        partner_id: partner.id,
        partner_name: partner.company_name,
        transaction_count: transactions.length,
        total_amount: totalPartnerShare,
      });

      totalPartnersProcessed++;
      totalTransactionsProcessed += transactions.length;
    }

    await supabaseClient.from('audit_logs').insert({
      actor_user_id: user.id,
      action: 'WEEKLY_PAYOUT_BATCH_RUN',
      entity_type: 'PayoutBatch',
      entity_id: null,
      metadata_json: {
        period_start: periodStart,
        period_end: periodEnd,
        partners_processed: totalPartnersProcessed,
        transactions_processed: totalTransactionsProcessed,
        batches_created: batchesCreated.length,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        period_start: periodStart,
        period_end: periodEnd,
        partners_processed: totalPartnersProcessed,
        transactions_processed: totalTransactionsProcessed,
        batches_created: batchesCreated,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});