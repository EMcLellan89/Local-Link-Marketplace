/**
 * Referral Field Enforcement Helper
 * Ensures Referral Name + Referral ID# are present and valid
 * for all partner-sold checkouts
 */

export interface ReferralValidationResult {
  ok: boolean;
  error?: string;
  referral_name?: string;
  referral_id?: string;
}

/**
 * Enforce referral fields are present and valid
 * - Both fields can be blank (direct merchant purchase)
 * - If one is filled, both must be filled
 * - Referral ID# must be numeric if present
 */
export function enforceReferralFields(body: any): ReferralValidationResult {
  if (body.referral_name === undefined || body.referral_id === undefined) {
    return {
      ok: false,
      error: "Referral Name and Referral ID# fields are required (can be blank).",
    };
  }

  const name = String(body.referral_name || "").trim();
  const id = String(body.referral_id || "").trim();

  // If one is filled, both must be filled
  if ((name && !id) || (!name && id)) {
    return {
      ok: false,
      error: "If you enter referral info, both Referral Name and Referral ID# are required.",
    };
  }

  // Validate ID is numeric if present
  if (id && !/^\d+$/.test(id)) {
    return {
      ok: false,
      error: "Referral ID# must be numeric.",
    };
  }

  return {
    ok: true,
    referral_name: name,
    referral_id: id,
  };
}

/**
 * Check if referral bypass code is used (2428 = Family)
 * NEVER label this as "Friends & Family" - it's just "Family"
 */
export function isFamilyBypass(referral_id: string): boolean {
  return referral_id === "2428";
}

/**
 * Get display label for referral
 */
export function getReferralLabel(referral_name: string, referral_id: string): string {
  if (!referral_name || !referral_id) {
    return "Direct Purchase";
  }

  if (isFamilyBypass(referral_id)) {
    return "Family";
  }

  return `${referral_name} (#${referral_id})`;
}
