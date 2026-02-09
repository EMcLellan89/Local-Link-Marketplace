import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log('Running deal refresh bot...');

    const results = {
      expired: 0,
      expiring_soon: 0,
      low_performers: [],
      recommendations: []
    };

    // 1. Mark expired deals as inactive
    const now = new Date().toISOString();
    const { data: expiredDeals, error: expiredError } = await supabaseAdmin
      .from('business_deals')
      .update({ status: 'expired' })
      .lt('expiry_date', now)
      .eq('status', 'active')
      .select('id, title');

    if (expiredError) {
      console.error('Error marking expired deals:', expiredError);
    } else {
      results.expired = expiredDeals?.length || 0;
      console.log(`Marked ${results.expired} deals as expired`);
    }

    // 2. Flag deals expiring in next 7 days
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const { data: expiringSoon } = await supabaseAdmin
      .from('business_deals')
      .select('id, title, expiry_date, vendor:vendors(name)')
      .eq('status', 'active')
      .lte('expiry_date', sevenDaysFromNow.toISOString())
      .gte('expiry_date', now);

    results.expiring_soon = expiringSoon?.length || 0;

    // 3. Identify low performers (deals with <1% conversion rate and >100 clicks)
    const { data: lowPerformers } = await supabaseAdmin
      .from('business_deals')
      .select('id, title, click_count, purchase_count, conversion_rate, vendor:vendors(name)')
      .eq('status', 'active')
      .lt('conversion_rate', 1)
      .gt('click_count', 100);

    results.low_performers = lowPerformers?.map(d => ({
      id: d.id,
      title: d.title,
      vendor: d.vendor?.name,
      conversion_rate: d.conversion_rate,
      clicks: d.click_count,
      purchases: d.purchase_count
    })) || [];

    // 4. Generate recommendations based on category performance
    const { data: categoryStats } = await supabaseAdmin
      .from('business_deals')
      .select('category, purchase_count')
      .eq('status', 'active');

    const categoryPerformance = new Map<string, number>();
    categoryStats?.forEach(deal => {
      const current = categoryPerformance.get(deal.category) || 0;
      categoryPerformance.set(deal.category, current + (deal.purchase_count || 0));
    });

    // Sort categories by performance
    const sortedCategories = Array.from(categoryPerformance.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    results.recommendations = sortedCategories.map(([category, sales]) => ({
      category,
      total_sales: sales,
      recommendation: `Consider adding more deals in ${category} category - high demand detected`
    }));

    // 5. Update seasonal campaigns if needed
    const { data: activeCampaigns } = await supabaseAdmin
      .from('seasonal_campaigns')
      .select('id, name, start_date, end_date, status')
      .or('status.eq.scheduled,status.eq.active');

    for (const campaign of activeCampaigns || []) {
      const campaignStart = new Date(campaign.start_date);
      const campaignEnd = new Date(campaign.end_date);
      const today = new Date();

      if (today >= campaignStart && today <= campaignEnd && campaign.status === 'scheduled') {
        // Activate scheduled campaigns that should start
        await supabaseAdmin
          .from('seasonal_campaigns')
          .update({ status: 'active' })
          .eq('id', campaign.id);
        console.log(`Activated campaign: ${campaign.name}`);
      } else if (today > campaignEnd && campaign.status === 'active') {
        // Complete campaigns that have ended
        await supabaseAdmin
          .from('seasonal_campaigns')
          .update({ status: 'completed' })
          .eq('id', campaign.id);
        console.log(`Completed campaign: ${campaign.name}`);
      }
    }

    // 6. Log report to admin_system_events
    await supabaseAdmin
      .from('admin_system_events')
      .insert({
        event_type: 'deal_refresh_bot',
        event_data: results,
        status: 'completed',
        created_at: now
      });

    console.log('Deal refresh complete:', results);

    return new Response(
      JSON.stringify({
        success: true,
        results
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in deal refresh bot:', error);

    // Log error
    await supabaseAdmin
      .from('admin_system_events')
      .insert({
        event_type: 'deal_refresh_bot',
        event_data: { error: error.message },
        status: 'failed',
        created_at: new Date().toISOString()
      });

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
