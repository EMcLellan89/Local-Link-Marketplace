import { checkLimit, getMerchantTier, getPartnerTier, hasAddon } from './usage';

export class FeatureGateError extends Error {
  constructor(
    message: string,
    public featureKey: string,
    public current: number,
    public limit: number,
    public upgradeRequired: boolean = true
  ) {
    super(message);
    this.name = 'FeatureGateError';
  }
}

export async function checkMerchantFeature(
  merchantId: string,
  featureKey: string
): Promise<void> {
  const tier = await getMerchantTier(merchantId);
  const result = await checkLimit('merchant', merchantId, tier, featureKey);

  if (!result.allowed) {
    throw new FeatureGateError(
      result.message || `Feature limit reached for ${featureKey}`,
      featureKey,
      result.current,
      result.limit,
      true
    );
  }

  if (result.message && result.message.includes('Warning')) {
    console.warn(result.message);
  }
}

export async function checkPartnerFeature(
  partnerId: string,
  featureKey: string
): Promise<void> {
  const tier = await getPartnerTier(partnerId);
  const result = await checkLimit('partner', partnerId, tier, featureKey);

  if (!result.allowed) {
    throw new FeatureGateError(
      result.message || `Feature limit reached for ${featureKey}`,
      featureKey,
      result.current,
      result.limit,
      true
    );
  }

  if (result.message && result.message.includes('Warning')) {
    console.warn(result.message);
  }
}

export async function checkAddonFeature(
  merchantId: string,
  addonFeatureFlag: string
): Promise<void> {
  const hasFeature = await hasAddon(merchantId, addonFeatureFlag);

  if (!hasFeature) {
    throw new FeatureGateError(
      `This feature requires the ${addonFeatureFlag} add-on subscription`,
      addonFeatureFlag,
      0,
      1,
      true
    );
  }
}

export interface FeatureAccessResult {
  hasAccess: boolean;
  reason?: string;
  upgradeRequired?: boolean;
  current?: number;
  limit?: number;
}

export async function checkFeatureAccess(
  userType: 'merchant' | 'partner',
  userId: string,
  featureKey: string,
  addonFlag?: string
): Promise<FeatureAccessResult> {
  try {
    if (addonFlag) {
      if (userType === 'merchant') {
        await checkAddonFeature(userId, addonFlag);
      }
    }

    if (userType === 'merchant') {
      await checkMerchantFeature(userId, featureKey);
    } else {
      await checkPartnerFeature(userId, featureKey);
    }

    return { hasAccess: true };
  } catch (error) {
    if (error instanceof FeatureGateError) {
      return {
        hasAccess: false,
        reason: error.message,
        upgradeRequired: error.upgradeRequired,
        current: error.current,
        limit: error.limit
      };
    }

    return {
      hasAccess: false,
      reason: 'An error occurred while checking feature access',
      upgradeRequired: false
    };
  }
}

export const FEATURE_KEYS = {
  MERCHANT: {
    ACTIVE_DEALS: 'active_deals',
    CRM_CONTACTS: 'crm_contacts',
    POSTCARD_SENDS_MONTHLY: 'postcard_sends_monthly',
    API_CALLS_DAILY: 'api_calls_daily'
  },
  PARTNER: {
    MAX_TERRITORIES: 'max_territories',
    MERCHANT_INVITES_MONTHLY: 'merchant_invites_monthly'
  }
};

export const ADDON_FLAGS = {
  WEBHOOK_PROCESSING: 'webhook_processing',
  INACTIVITY_SCANNER: 'inactivity_scanner',
  ELIGIBILITY_SCORING: 'eligibility_scoring',
  ADMIN_OVERRIDES: 'admin_overrides',
  COMPLIANCE_WARNINGS: 'compliance_warnings',
  REINSTATEMENT_AUTOMATION: 'reinstatement_automation',
  ANALYTICS_WIDGETS: 'analytics_widgets',
  CHARGEBACK_TRIGGERS: 'chargeback_triggers',
  MULTI_COUNTRY: 'multi_country',
  MULTI_CURRENCY: 'multi_currency',
  MULTI_LANGUAGE: 'multi_language'
};

export function getUpgradeMessage(
  currentTier: string
): string {
  const tierMap: { [key: string]: string } = {
    starter: 'Growth',
    growth: 'Scale',
    partner: 'Master Partner',
    master: 'White-Label Partner'
  };

  const nextTier = tierMap[currentTier] || 'a higher tier';

  return `Upgrade to ${nextTier} to unlock this feature and increase your limits.`;
}
