import { supabase } from './supabase';

export type EligibilityResult = {
  eligible: boolean;
  score: number;
  reasons: string[];
  metrics: {
    certified: boolean;
    trainingPercent: number;
    activeTerritories: number;
    liveDeals: number;
    paidTx30d: number;
    gross30d: number;
    chargebacks30d: number;
    chargebackRate30d: number;
    allowExpansionDespiteScore: boolean;
    maxActiveTerritoriesCap: number;
    maxOpenRequestsCap: number;
  };
};

export const ELIGIBILITY_CONFIG = {
  minTrainingPercent: 100,
  maxActiveTerritoriesPerPartner: 10,
  maxOpenExpansionRequests: 3,
  minPaidTx30d: 3,
  minGross30d: 300,
  maxChargebackRatePct30d: 2.5,
  scorePass: 70,
  inactivityDaysToRecover: 21,
};

function safeRate(n: number, d: number) {
  if (!d) return 0;
  return (n / d) * 100;
}

export async function computeExpansionEligibility(partnerId: string): Promise<EligibilityResult> {
  const now = new Date();
  const start30d = new Date(now);
  start30d.setDate(start30d.getDate() - 30);

  const [_partnerRes, certRes, overrideRes, activeTerritoriesRes, liveDealsRes, txPaidRes, txAllRes, txChargebacksRes] = await Promise.all([
    supabase.from('partners').select('*').eq('id', partnerId).maybeSingle(),
    supabase.from('partner_certifications').select('*').eq('partner_id', partnerId).maybeSingle(),
    supabase.from('partner_overrides').select('*').eq('partner_id', partnerId).maybeSingle(),
    supabase.from('territories').select('id', { count: 'exact', head: true }).eq('assigned_partner_id', partnerId).eq('status', 'Assigned'),
    supabase.from('deals').select('id', { count: 'exact', head: true }).eq('partner_id', partnerId).eq('status', 'Live'),
    supabase.from('transactions').select('gross_amount').eq('partner_id', partnerId).eq('payment_status', 'Paid').gte('created_at', start30d.toISOString()).lte('created_at', now.toISOString()),
    supabase.from('transactions').select('id', { count: 'exact', head: true }).eq('partner_id', partnerId).gte('created_at', start30d.toISOString()).lte('created_at', now.toISOString()),
    supabase.from('transactions').select('id', { count: 'exact', head: true }).eq('partner_id', partnerId).eq('payment_status', 'Chargeback').gte('created_at', start30d.toISOString()).lte('created_at', now.toISOString()),
  ]);
  const cert = certRes.data;
  const override = overrideRes.data;
  const activeTerritories = activeTerritoriesRes.count || 0;
  const liveDeals = liveDealsRes.count || 0;
  const txPaid = txPaidRes.data || [];
  const txAll30d = txAllRes.count || 0;
  const chargebacks30d = txChargebacksRes.count || 0;

  const maxActiveTerritoriesCap = (override as any)?.max_active_territories_override ?? ELIGIBILITY_CONFIG.maxActiveTerritoriesPerPartner;
  const maxOpenRequestsCap = (override as any)?.max_open_requests_override ?? ELIGIBILITY_CONFIG.maxOpenExpansionRequests;
  const allowExpansionDespiteScore = !!(override as any)?.allow_expansion_despite_score;

  const trainingPercent = (cert as any)?.training_completed_percent ?? 0;
  const certified = !!cert && (cert as any).status === 'Active' && trainingPercent >= ELIGIBILITY_CONFIG.minTrainingPercent;

  const paidTx30d = txPaid.length;
  const gross30d = txPaid.reduce((s, t) => s + (parseFloat(String((t as any).gross_amount || 0))), 0);
  const chargebackRate30d = safeRate(chargebacks30d, txAll30d);

  const reasons: string[] = [];
  let score = 0;

  if (certified) {
    score += 40;
  } else {
    reasons.push('Certification incomplete (training must be 100% and status Active).');
  }

  if (paidTx30d >= ELIGIBILITY_CONFIG.minPaidTx30d) {
    score += 20;
  } else {
    reasons.push(`Needs at least ${ELIGIBILITY_CONFIG.minPaidTx30d} paid transactions in last 30 days.`);
  }

  if (gross30d >= ELIGIBILITY_CONFIG.minGross30d) {
    score += 15;
  } else {
    reasons.push(`Needs at least $${ELIGIBILITY_CONFIG.minGross30d} gross paid volume in last 30 days.`);
  }

  if (chargebackRate30d <= ELIGIBILITY_CONFIG.maxChargebackRatePct30d) {
    score += 10;
  } else {
    reasons.push(`Chargeback rate too high (${chargebackRate30d.toFixed(2)}% in last 30 days).`);
  }

  if (liveDeals >= 2) {
    score += 10;
  } else {
    reasons.push('Needs at least 2 Live deals to prove readiness.');
  }

  if (activeTerritories < maxActiveTerritoriesCap) {
    score += 5;
  } else {
    reasons.push('Active territory cap reached.');
  }

  const eligible = certified && (score >= ELIGIBILITY_CONFIG.scorePass || allowExpansionDespiteScore);

  return {
    eligible,
    score,
    reasons,
    metrics: {
      certified,
      trainingPercent,
      activeTerritories,
      liveDeals,
      paidTx30d,
      gross30d,
      chargebacks30d,
      chargebackRate30d,
      allowExpansionDespiteScore,
      maxActiveTerritoriesCap,
      maxOpenRequestsCap,
    },
  };
}

export function normalizeTerritoryName(name: string) {
  return name.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function territoriesOverlap(existing: string, requested: string) {
  const a = normalizeTerritoryName(existing);
  const b = normalizeTerritoryName(requested);
  return a.includes(b) || b.includes(a);
}
