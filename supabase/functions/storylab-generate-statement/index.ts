import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface StatementRequest {
  partnerId: string;
  businessKey: string;
  periodStart: string; // YYYY-MM-DD
  periodEnd: string;   // YYYY-MM-DD
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    const body: StatementRequest = await req.json();
    const { partnerId, businessKey, periodStart, periodEnd } = body;

    // ============ CALCULATE STATEMENT TOTALS ============

    // Get all completed orders for this partner in period
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('partner_id', partnerId)
      .eq('business_key', businessKey)
      .eq('status', 'completed')
      .gte('paid_at', periodStart)
      .lte('paid_at', periodEnd);

    // Get all refunds in period
    const { data: refunds } = await supabase
      .from('orders')
      .select('*')
      .eq('partner_id', partnerId)
      .eq('business_key', businessKey)
      .eq('status', 'refunded')
      .gte('refunded_at', periodStart)
      .lte('refunded_at', periodEnd);

    // Calculate totals
    const grossCents = orders?.reduce((sum, o) => sum + (o.amount_cents || 0), 0) || 0;
    const refundsCents = refunds?.reduce((sum, r) => sum + (r.refund_amount_cents || 0), 0) || 0;
    const netCents = grossCents - refundsCents;

    // Get commissions for this period
    const { data: commissions } = await supabase
      .from('marketplace_affiliate_commissions')
      .select('*')
      .eq('creator_id', partnerId)
      .in('order_id', orders?.map(o => o.id) || []);

    const commissionCents = commissions?.reduce((sum, c) => sum + (c.commission_amount_cents || 0), 0) || 0;
    const bonusCents = 0; // Can add bonus logic here

    // ============ CALCULATE DEDUCTIONS ============

    // Get ad advance status
    const { data: adAdvance } = await supabase
      .from('partner_ad_advances')
      .select('*')
      .eq('partner_id', partnerId)
      .eq('business_key', businessKey)
      .single();

    let deductionsCents = 0;
    const deductionBreakdown: any = {};

    // Check if in repayment period (weeks 9+)
    if (adAdvance && adAdvance.status === 'repayment') {
      const remainingOwed = adAdvance.total_advanced_cents - adAdvance.amount_repaid_cents;

      if (remainingOwed > 0) {
        // Calculate weekly repayments for the period
        const startDate = new Date(periodStart);
        const endDate = new Date(periodEnd);
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const weeks = Math.ceil(days / 7);

        const weeklyRepayment = adAdvance.weekly_repayment_cents || 5000; // $50
        const totalRepayment = Math.min(weeklyRepayment * weeks, remainingOwed);

        deductionsCents += totalRepayment;
        deductionBreakdown.ad_repayment_cents = totalRepayment;
      }
    }

    // Add current ad costs (if partner is paying)
    if (adAdvance && adAdvance.status === 'repayment') {
      // Get ad costs for this period
      const { data: adCosts } = await supabase
        .from('profit_network_ad_costs')
        .select('*')
        .eq('enrollment_id', adAdvance.enrollment_id)
        .gte('date', periodStart)
        .lte('date', periodEnd);

      const adCostsCents = adCosts?.reduce((sum, c) => sum + (c.daily_spend_cents || 0), 0) || 0;
      deductionsCents += adCostsCents;
      deductionBreakdown.ad_costs_cents = adCostsCents;
    }

    // Check for partner membership fees
    const { data: membership } = await supabase
      .from('partner_memberships')
      .select('*')
      .eq('partner_id', partnerId)
      .eq('status', 'active')
      .single();

    if (membership?.monthly_fee_cents) {
      deductionsCents += membership.monthly_fee_cents;
      deductionBreakdown.membership_fee_cents = membership.monthly_fee_cents;
    }

    // ============ CALCULATE NET PAYOUT ============
    const payoutCents = Math.max(0, commissionCents + bonusCents - deductionsCents);

    // ============ CREATE OR UPDATE STATEMENT ============
    const { data: statement, error: statementError } = await supabase
      .from('partner_statements')
      .upsert({
        partner_id: partnerId,
        business_key: businessKey,
        period_start: periodStart,
        period_end: periodEnd,
        gross_cents: grossCents,
        refunds_cents: refundsCents,
        net_cents: netCents,
        commission_cents: commissionCents,
        bonus_cents: bonusCents,
        deductions_cents: deductionsCents,
        payout_cents: payoutCents,
        status: 'draft',
        meta: {
          order_count: orders?.length || 0,
          refund_count: refunds?.length || 0,
          deduction_breakdown: deductionBreakdown,
          generated_at: new Date().toISOString()
        }
      }, {
        onConflict: 'partner_id,business_key,period_start,period_end'
      })
      .select()
      .single();

    if (statementError) {
      throw statementError;
    }

    // ============ GENERATE PDF (Placeholder) ============
    // In production, use a PDF generation library or service
    const pdfUrl = await generateStatementPDF(statement, supabase);

    // Update statement with PDF asset ID
    if (pdfUrl) {
      await supabase
        .from('partner_statements')
        .update({
          pdf_asset_id: pdfUrl,
          status: 'sent'
        })
        .eq('id', statement.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        statement: {
          ...statement,
          pdf_url: pdfUrl
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Statement generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function generateStatementPDF(statement: any, supabase: any): Promise<string | null> {
  // Placeholder for PDF generation
  // In production, use a service like:
  // - PDFKit
  // - Puppeteer
  // - External API (PDF.co, DocRaptor, etc.)

  // For now, return a placeholder URL
  const pdfContent = `
PARTNER STATEMENT
Business: ${statement.business_key}
Period: ${statement.period_start} to ${statement.period_end}

SALES SUMMARY:
Gross Sales: $${(statement.gross_cents / 100).toFixed(2)}
Refunds: -$${(statement.refunds_cents / 100).toFixed(2)}
Net Sales: $${(statement.net_cents / 100).toFixed(2)}

COMMISSION:
Commission Earned: $${(statement.commission_cents / 100).toFixed(2)}
Bonuses: $${(statement.bonus_cents / 100).toFixed(2)}

DEDUCTIONS:
Total Deductions: -$${(statement.deductions_cents / 100).toFixed(2)}

NET PAYOUT:
Amount Due: $${(statement.payout_cents / 100).toFixed(2)}
  `.trim();

  console.log('PDF Content:', pdfContent);

  // In production, upload to Supabase Storage and return URL
  return `/statements/${statement.partner_id}/${statement.period_start}.pdf`;
}
