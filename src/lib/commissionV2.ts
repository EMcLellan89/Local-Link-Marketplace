import { supabaseAdmin } from "./supabaseAdmin";

export type PartnerTier = "starter" | "growth" | "pro" | "enterprise";

export type CommissionEventType =
  | "partner_recruit_bonus"
  | "merchant_membership_first_month"
  | "marketplace_product"
  | "onehub_crm_cpa"
  | "recruit_override";

const tierRates: Record<PartnerTier, number> = {
  starter: 0.10,
  growth: 0.15,
  pro: 0.20,
  enterprise: 0.25,
} as const;

export function getCommissionRate(productType: string, partnerTier: PartnerTier): number {
  if (productType === "onehub_crm_cpa") return 0.30;
  return tierRates[partnerTier];
}

export function calculatePartnerRecruitBonus({
  recruiterTier,
  firstMonthAmount,
}: {
  recruiterTier: PartnerTier;
  firstMonthAmount: number;
}): number {
  return firstMonthAmount * tierRates[recruiterTier];
}

export function calculateMerchantMembershipCommission({
  partnerTier,
  firstMonthAmount,
}: {
  partnerTier: PartnerTier;
  firstMonthAmount: number;
}): number {
  // First month only — NOT recurring
  return firstMonthAmount * tierRates[partnerTier];
}

export function calculateOneHubCommission({
  monthlyAmount,
}: {
  monthlyAmount: number;
}): number {
  // 30% recurring, regardless of tier
  return monthlyAmount * 0.30;
}

export function calculateRecruitOverride({
  recruitCommissionableAmount,
}: {
  recruitCommissionableAmount: number;
}): number {
  // 7% on direct recruit's commissionable sales, 1 level only
  return recruitCommissionableAmount * 0.07;
}

export function calculateMarketplaceProductCommission({
  partnerTier,
  saleAmount,
  productType,
}: {
  partnerTier: PartnerTier;
  saleAmount: number;
  productType: string;
}): number {
  const rate = getCommissionRate(productType, partnerTier);
  return saleAmount * rate;
}

export function getTierRate(tier: PartnerTier): number {
  return tierRates[tier];
}

export function getTierLabel(tier: PartnerTier): string {
  const labels: Record<PartnerTier, string> = {
    starter: "Starter",
    growth: "Growth",
    pro: "Pro",
    enterprise: "Enterprise",
  };
  return labels[tier];
}

export function getTierFee(tier: PartnerTier): number {
  const fees: Record<PartnerTier, number> = {
    starter: 49,
    growth: 99,
    pro: 149,
    enterprise: 299,
  };
  return fees[tier];
}

// Legacy adapter — kept for backward compat with old code paths
export async function getCommissionRateV2(params: {
  partner_id: string;
  business_key: string;
  order_type: string;
}): Promise<number> {
  // Profit Network businesses = flat 25%
  if (params.business_key?.startsWith("storylab_")) return 0.25;
  if (params.business_key === "onehub_crm_cpa") return 0.30;

  try {
    const { data: partner } = await supabaseAdmin
      .from("partners")
      .select("tier")
      .eq("id", params.partner_id)
      .maybeSingle();

    const tier = (partner?.tier as PartnerTier) || "starter";
    return tierRates[tier];
  } catch {
    return tierRates.starter;
  }
}
