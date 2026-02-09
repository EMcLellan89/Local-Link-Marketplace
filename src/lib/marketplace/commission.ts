/**
 * Commission calculation utilities
 * Enforces tier-based rates with membership requirements
 */

export function tierRate(tier: string): number {
  if (tier === "enterprise") return 0.20;
  if (tier === "pro") return 0.15;
  return 0.10; // starter
}

/**
 * Commission enforcement (LOCKED BUSINESS RULES):
 * - If partner membership inactive => 0% commission
 * - 10-day grace period after membership_ends_at (if present)
 * - Partner must have active membership at time of calculation
 */
export function computeCommissionRate(partner: any): number {
  if (!partner) return 0;

  const rate = tierRate(partner.tier);

  // Active membership = full commission
  if (partner.membership_active === true) return rate;

  // Check grace period (10 days after membership ends)
  if (partner.membership_ends_at) {
    const endsAt = new Date(partner.membership_ends_at).getTime();
    const now = Date.now();
    const tenDaysMs = 10 * 24 * 60 * 60 * 1000;

    // Within grace period = full commission
    if (now <= endsAt + tenDaysMs) return rate;
  }

  // Outside grace or no membership = no commission
  return 0;
}

/**
 * Calculate commission amount in cents
 */
export function calculateCommission(totalCents: number, rate: number): number {
  return Math.round(totalCents * rate);
}

/**
 * Check if partner is eligible for commissions
 */
export function isPartnerEligible(partner: any): boolean {
  return computeCommissionRate(partner) > 0;
}
